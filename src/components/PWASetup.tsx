'use client';

import { useEffect } from 'react';
import { registerServiceWorker, setupNetworkListeners } from '@/lib/pwa';
import { notifications } from '@mantine/notifications';

export default function PWASetup() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Setup network event listeners
    setupNetworkListeners(
      () => {
        // When coming back online
        notifications.show({
          title: '🌐 オンライン',
          message: 'インターネット接続が復活しました',
          color: 'green',
          autoClose: 3000,
        });
      },
      () => {
        // When going offline
        notifications.show({
          title: '📴 オフライン',
          message: 'オフラインモードで動作しています',
          color: 'orange',
          autoClose: 5000,
        });
      }
    );
  }, []);

  return null; // This component doesn't render anything
}