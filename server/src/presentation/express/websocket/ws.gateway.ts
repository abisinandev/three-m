import { Server, Socket } from "socket.io";
import { injectable } from "inversify";
import { CandleEntity } from "@domain/entities/stock/candle.entity";
import { IWsGateway } from "@application/interfaces/services/stocks/ws-gateway.interface";
import { IMarketDataService } from "@application/interfaces/services/stocks/market-data-service.usecase";


/**
 * Handles WebSocket connections and manages real-time candle subscriptions.
 *
 * - Listens for client connections and subscription requests (symbol + timeframe)
 * - Groups clients into rooms based on symbol and timeframe
 * - Notifies MarketDataService to start/stop data streaming as needed
 * - Tracks active subscriptions to avoid unnecessary data processing
 * - Cleans up subscriptions when clients unsubscribe or disconnect
 *
 * - Broadcasts candle updates to all subscribed clients in the relevant room
 */
@injectable()
export class WsGateway implements IWsGateway {
    private io!: Server;
    private marketDataService!: IMarketDataService;
    private subscriptions: Map<string, Set<string>> = new Map();

    public init(io: Server, marketDataService: IMarketDataService) {
        this.io = io;
        this.marketDataService = marketDataService;

        marketDataService.setWsGateway(this);
        marketDataService.init();

        this.io.on("connection", (socket: Socket) => {

            socket.on("subscribe-candle", (data: { symbol: string, timeframe: string }) => {
                if (!data || !data.symbol || !data.timeframe) return;

                const room = `${data.symbol}:${data.timeframe}`;//creating room
                socket.join(room);

                this.marketDataService.subscribeToSymbol(data.symbol);

                if (!this.subscriptions.has(room)) {
                    this.subscriptions.set(room, new Set());
                }
                
                this.subscriptions.get(room)?.add(socket.id);
                console.log(`Socket ${socket.id} subscribed to ${room}`);
            });

            socket.on("unsubscribe-candle", (data: { symbol: string, timeframe: string }) => {
                if (!data || !data.symbol || !data.timeframe) return;

                const room = `${data.symbol}:${data.timeframe}`;
                socket.leave(room);

                if (this.subscriptions.has(room)) {
                    const clients = this.subscriptions.get(room)!;
                    clients.delete(socket.id);

                    if (clients.size === 0) {
                        this.subscriptions.delete(room);
                    }

                    const isStillTracked = Array.from(this.subscriptions.keys()).some(k => k.startsWith(`${data.symbol}:`));
                    if (!isStillTracked) {
                        this.marketDataService.unsubscribeFromSymbol(data.symbol);
                    }
                }
                console.log(`Socket ${socket.id} unsubscribed from ${room}`);
            });

            socket.on("subscribe", (symbol: string) => {
                if (!symbol) return;
                const room = `symbol:${symbol}`;
                socket.join(room);
                this.marketDataService.subscribeToSymbol(symbol);
                console.log(`Socket ${socket.id} subscribed to ${room}`);
            });

            socket.on("unsubscribe", (symbol: string) => {
                if (!symbol) return;
                const room = `symbol:${symbol}`;
                socket.leave(room);
                console.log(`Socket ${socket.id} unsubscribed from ${room}`);
            });

            socket.on("disconnect", () => {

                this.subscriptions.forEach((clients, room) => {
                    if (clients.delete(socket.id)) {

                        if (clients.size === 0) {
                            this.subscriptions.delete(room);

                            const symbol = room.split(':')[0];
                            const isStillTracked = Array.from(this.subscriptions.keys()).some(k => k.startsWith(`${symbol}:`));
                            if (!isStillTracked) {
                                this.marketDataService.unsubscribeFromSymbol(symbol);
                            }
                        }
                    }
                });
            });
        });
    }


/**
 * Sends candle data to all connected clients who subscribed to a specific symbol and timeframe.
 *
 * - Creates a room name using symbol and timeframe (e.g., "AAPL:1m")
 * - Uses Socket.IO to emit a "candle-update" event to that room
 * - Only clients who joined that room will receive the update
 *
 * In short:
 * It pushes real-time candle updates to the right group of subscribed users.
 */
    public broadcastToSubscribers(candle: CandleEntity) {
        const room = `${candle.symbol}:${candle.timeframe}`;
        if (this.io) {
            this.io.to(room).emit("candle-update", {
                symbol: candle.symbol,
                timeframe: candle.timeframe,
                time: candle.time,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                volume: candle.volume,
            });
        }
    }

    public broadcastPriceUpdate(symbol: string, price: number) {
        const room = `symbol:${symbol}`;
        if (this.io) {
            this.io.to(room).emit("stock_update", {
                symbol,
                price
            });
        }
    }
}
