import { Server, Socket } from "socket.io";
import { injectable } from "inversify";
import { CandleEntity } from "@domain/entities/stock/candle.entity";
import { MarketDataService } from "@infrastructure/providers/stocks/market-data.service";
import { IWsGateway } from "@application/interfaces/services/stocks/ws-gateway.interface";

@injectable()
export class WsGateway implements IWsGateway {
    private io!: Server;
    private marketDataService!: MarketDataService;
    private subscriptions: Map<string, Set<string>> = new Map();

    constructor(

    ) { }

    public init(io: Server, marketDataService: MarketDataService) {
        this.io = io;
        this.marketDataService = marketDataService;

        marketDataService.setWsGateway(this);
        marketDataService.init();

        this.io.on("connection", (socket: Socket) => {

            socket.on("subscribe-candle", (data: { symbol: string, timeframe: string }) => {
                if (!data || !data.symbol || !data.timeframe) return;

                const room = `${data.symbol}:${data.timeframe}`;
                socket.join(room);

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
