import { Server, Socket } from "socket.io";
import { injectable, inject } from "inversify";
import { Candle } from "@domain/entities/stock/candle.entity";
import { STOCK_TYPES } from "@infrastructure/inversify_di/features/stock/stock.types";
import { MarketDataService } from "@application/services/stocks/market-data.service";

// To make it injectable and easily integrated where io is actually created
@injectable()
export class WsGateway {
    private io!: Server;
    private subscriptions: Map<string, Set<string>> = new Map(); // "symbol:timeframe" -> Set<socketId>

    constructor(
        // Assuming we lazy tie it to market data service, or we can just pass it later.
    ) {}

    public init(io: Server, marketDataService: MarketDataService) {
        this.io = io;
        
        // Link this gateway to market data service
        marketDataService.setWsGateway(this);
        marketDataService.init();

        this.io.on("connection", (socket: Socket) => {
            
            socket.on("subscribe-candle", (data: { symbol: string, timeframe: string }) => {
                if (!data || !data.symbol || !data.timeframe) return;
                
                const room = `${data.symbol}:${data.timeframe}`;
                socket.join(room);
                
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
                     this.subscriptions.get(room)!.delete(socket.id);
                 }
                 console.log(`Socket ${socket.id} unsubscribed from ${room}`);
            });

            socket.on("disconnect", () => {
                // remove from all tracked sets
                this.subscriptions.forEach((clients, room) => {
                    clients.delete(socket.id);
                });
            });
        });
    }

    public broadcastToSubscribers(candle: Candle) {
        const room = `${candle.symbol}:${candle.timeframe}`;
        if (this.io) {
            this.io.to(room).emit("candle-update", {
                time: candle.time,
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                // optionally volume, though TV lightweight charts focus on time,open,high,low,close
                volume: candle.volume
            });
        }
    }
}
