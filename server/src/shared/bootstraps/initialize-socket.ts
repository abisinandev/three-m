import { container } from '@infrastructure/inversify_di/container';
import { NOTIFICATION_TYEPS } from '@infrastructure/inversify_di/features/notification/notification.type';
import { SocketService } from '@infrastructure/providers/notification/socket.service';
import http from 'http';

export const initializeSockets = (server: http.Server) => {

   const socketService = container.get<SocketService>(NOTIFICATION_TYEPS.SocketService);
    socketService.init(server);
};