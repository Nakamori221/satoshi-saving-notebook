/**
 * PWA Service Worker registration and management
 */

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  showUpdateNotification(registration);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
}

function showUpdateNotification(registration: ServiceWorkerRegistration) {
  // You can show a notification to the user here
  console.log('🔄 New version available! Please refresh to update.');
  
  // Auto-update (optional - you might want to ask user first)
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  // Request permission
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Send local notification
export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      ...options,
    });
  }
}

// Schedule local notification (using setTimeout)
export function scheduleLocalNotification(
  title: string, 
  delay: number, // milliseconds
  options?: NotificationOptions
) {
  setTimeout(() => {
    sendLocalNotification(title, options);
  }, delay);
}

// Check if app is installed as PWA
export function isPWAInstalled(): boolean {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  return isStandalone || isIOSStandalone;
}

// Install prompt utilities
export function canShowInstallPrompt(): boolean {
  return !isPWAInstalled() && 'serviceWorker' in navigator;
}

// Cache management
export async function clearAppCache(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ App cache cleared');
  }
}

// Check if app is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    console.log('🌐 App is online');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('📴 App is offline');
    onOffline?.();
  });
}

// Update app data when coming back online
export function syncWhenOnline() {
  if (isOnline()) {
    // Trigger sync immediately if online
    return fetch('/api/btc-price').catch(() => {
      console.log('Sync failed');
    });
  }
  
  // Otherwise wait for online event
  return new Promise<void>((resolve) => {
    const handleOnline = () => {
      fetch('/api/btc-price')
        .then(() => resolve())
        .catch(() => resolve())
        .finally(() => {
          window.removeEventListener('online', handleOnline);
        });
    };
    
    window.addEventListener('online', handleOnline);
  });
}