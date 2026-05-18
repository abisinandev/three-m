import { Trade } from "@application/dto/stocks/stock.dto";
import { IStockWebsocketProvider } from "@application/interfaces/repositories/stock/stock-websocket.interface";
import { env } from "@presentation/express/utils/constants/env.constants";
import { injectable } from "inversify";
import WebSocket from "ws";
import { logger } from "../logger/pino.logger";

/**
 * Handles connection to external stock WebSocket API and streams trade data.
 *
 * - Connects to the WebSocket server using API key
 * - Subscribes/unsubscribes to stock symbols
 * - Receives real-time trade messages from the provider
 * - Transforms raw data into Trade objects
 * - Notifies all registered listeners with incoming trades
 *
 * - Automatically reconnects on disconnection
 *
 * In short:
 * Acts as a bridge between external market data provider and internal system.
 */

@injectable()
export class StockWebSocketClient implements IStockWebsocketProvider {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private subscribers: ((trade: Trade) => void)[] = [];
    private activeSymbols = new Set<string>();

    constructor() {
        this.apiKey = env.FINNHUB_API_KEY_SECRET
    }

    connect(): void {

        if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        this.ws = new WebSocket(`${env.FINNHUB_WEBSOCKET}${this.apiKey}`);

        this.ws.on('open', () => {
            logger.info("Websocket connected");

            this.activeSymbols.forEach(symbol => {
                this.ws?.send(JSON.stringify({ type: "subscribe", symbol }));
                logger.info(`Subscribed to ${symbol}`);
            });
        })

        this.ws.on("message", (data) => {
            const parsed = JSON.parse(data.toString());

            if (parsed.type === "trade") {
                parsed.data.forEach((t: Record<string, unknown>) => {
                    const trade: Trade = {
                        symbol: String(t.s),
                        price: Number(t.p),
                        volume: Number(t.v),
                        timestamp: Number(t.t),
                    };

                    this.notifySubscribers(trade);
                });
            }
        })

        this.ws.on("close", () => {
            console.log("⚠️ Websocket disconnected. Reconnecting...");
            setTimeout(() => this.connect(), 3000);
        })

        this.ws.on("error", (err) => {
            console.error("❌ WS Error:", err);
        });
    }

    subscribe(symbol: string): void {
        this.activeSymbols.add(symbol);

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        this.ws.send(
            JSON.stringify({
                type: "subscribe",
                symbol,
            })
        );

        console.log(`📡 Subscribed to ${symbol}`);
    }

    unsubscribe(symbol: string) {
        this.activeSymbols.delete(symbol);

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        this.ws.send(
            JSON.stringify({
                type: "unsubscribe",
                symbol,
            })
        );
    }

    onTrade(callback: (trade: Trade) => void): void {
        this.subscribers.push(callback);
    }

    private notifySubscribers(trade: Trade) {
        this.subscribers.forEach((cb) => { cb(trade) });
    }
}