import { Server, Socket } from "socket.io";
import { injectable } from "inversify";
import { CandleEntity } from "@domain/entities/stock/candle.entity";
import { MarketDataService } from "@infrastructure/providers/stocks/market-data.service";

// To make it injectable and easily integrated where io is actually created
@injectable()
export class WsGateway {
    private io!: Server;
    private marketDataService!: MarketDataService;
    private subscriptions: Map<string, Set<string>> = new Map(); // "symbol:timeframe" -> Set<socketId>

    constructor(
        // Assuming we lazy tie it to market data service, or we can just pass it later.
    ) { }

    public init(io: Server, marketDataService: MarketDataService) {
        this.io = io;
        this.marketDataService = marketDataService;

        // Link this gateway to market data service
        marketDataService.setWsGateway(this);
        marketDataService.init();

        this.io.on("connection", (socket: Socket) => {

            socket.on("subscribe-candle", (data: { symbol: string, timeframe: string }) => {
                if (!data || !data.symbol || !data.timeframe) return;

                const room = `${data.symbol}:${data.timeframe}`;
                socket.join(room);

                // Start tracking this symbol if it's new
                this.marketDataService.subscribeToSymbol(data.symbol);

                if (!this.subscriptions.has(room)) {
                    this.subscriptions.set(room, new Set());
                }
                this.subscriptions.get(room)!.add(socket.id);
                console.log(`Socket ${socket.id} subscribed to ${room}`);
            });

            socket.on("unsubscribe-candle", (data: { symbol: string, timeframe: string }) => {
                if (!data || !data.symbol || !data.timeframe) return;

                const room = `${data.symbol}:${data.timeframe}`;
                socket.leave(room);

                if (this.subscriptions.has(room)) {
                    const clients = this.subscriptions.get(room)!;
                    clients.delete(socket.id);
                    
                    // Cleanup room if empty
                    if (clients.size === 0) {
                        this.subscriptions.delete(room);
                    }

                    // Check if anyone else is watching this symbol in OTHER timeframes
                    const isStillTracked = Array.from(this.subscriptions.keys()).some(k => k.startsWith(`${data.symbol}:`));
                    if (!isStillTracked) {
                        this.marketDataService.unsubscribeFromSymbol(data.symbol);
                    }
                }
                console.log(`Socket ${socket.id} unsubscribed from ${room}`);
            });

            socket.on("disconnect", () => {
                // remove from all tracked sets
                this.subscriptions.forEach((clients, room) => {
                    if (clients.delete(socket.id)) {
                        // If the room becomes empty, cleanup and check if we should untrack the symbol
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
}
