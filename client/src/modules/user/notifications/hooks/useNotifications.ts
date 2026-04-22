import { useState, useRef, useEffect, useCallback } from 'react';
import { useNotificationStore } from '@stores/notification/useNotificationStore';
import { markNotificationRead, markAllNotificationsRead, getNotifications } from '@shared/services/notification/notification.service';
import type { NotificationFilter } from '../types/notification.types';

export const useNotifications = () => {
    const { notifications, unreadCount, markRead, markAllRead, setNotifications } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<NotificationFilter>('all');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredNotifications = notifications.filter(n =>
        activeTab === 'unread' ? !n.read : true
    );
    
    const unreadNum = unreadCount();

    // Initial Fetch
    useEffect(() => {
        getNotifications().then(setNotifications);
    }, [setNotifications]);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleMarkAsRead = useCallback(async (id: string, event?: React.MouseEvent) => {
        event?.stopPropagation();
        try {
            await markNotificationRead(id);
            markRead(id);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, [markRead]);

    const handleMarkAllRead = useCallback(async () => {
        try {
            await markAllNotificationsRead();
            markAllRead();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, [markAllRead]);

    const toggleOpen = () => setIsOpen(prev => !prev);

    return {
        notifications: filteredNotifications,
        unreadCount: unreadNum,
        isOpen,
        activeTab,
        dropdownRef,
        setActiveTab,
        handleMarkAsRead,
        handleMarkAllRead,
        toggleOpen
    };
};
