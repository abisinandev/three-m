import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private url = import.meta.env.VITE_SOCKET_URL

  connect() {
    if (!this.socket) {
      this.socket = io(this.url, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToSymbol(symbol: string) {
    if (this.socket) {
      this.socket.emit('subscribe', symbol);
    }
  }

  unsubscribeFromSymbol(symbol: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe', symbol);
    }
  }

  subscribeToCandle(symbol: string, timeframe: string) {
    if (this.socket) {
      this.socket.emit('subscribe-candle', { symbol, timeframe });
    }
  }

  unsubscribeFromCandle(symbol: string, timeframe: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe-candle', { symbol, timeframe });
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
