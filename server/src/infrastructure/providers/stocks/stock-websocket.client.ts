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
    private reconnectDelay = 3000;
    private readonly maxReconnectDelay = 60000;
    private reconnectTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.apiKey = env.FINNHUB_API_KEY_SECRET
    }

    connect(): void {

        if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        // Prevent overlapping reconnect attempts
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.ws = new WebSocket(`${env.FINNHUB_WEBSOCKET}${this.apiKey}`);

        this.ws.on('open', () => {
            // logger.info("Websocket connected");
            this.reconnectDelay = 3000; // Reset backoff delay upon successful handshake

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
            // logger.warn(`⚠️ Websocket disconnected. Reconnecting in ${this.reconnectDelay / 1000}s...`);

            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
            }

            this.reconnectTimer = setTimeout(() => {
                this.connect();
            }, this.reconnectDelay);

            // Exponential Backoff
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
        })

        this.ws.on("error", (_err) => {
            // logger.error("❌ WS Error: ${_err}");
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