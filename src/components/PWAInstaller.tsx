'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Text, Group, Alert } from '@mantine/core';
import { IconDownload, IconX, IconDeviceMobile } from '@tabler/icons-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Listen for the app being installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or if dismissed recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) { // Don't show for 7 days after dismissal
        setIsVisible(false);
      }
    }
  }, []);

  // Show iOS-specific instructions for Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  if (isIOS && isSafari && isVisible) {
    return (
      <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" mb="xs">
              <IconDeviceMobile size={20} color="blue" />
              <Text size="sm" fw={500}>
                ホーム画面に追加
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              Safari で「共有」→「ホーム画面に追加」でアプリのように使えます
            </Text>
          </div>
          <Button variant="subtle" size="xs" onClick={handleDismiss}>
            <IconX size={16} />
          </Button>
        </Group>
      </Card>
    );
  }

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder mb="md">
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb="xs">
            <IconDownload size={20} color="blue" />
            <Text size="sm" fw={500}>
              アプリとしてインストール
            </Text>
          </Group>
          <Text size="xs" c="dimmed" mb="sm">
            ホーム画面から素早くアクセスできます
          </Text>
          <Group gap="xs">
            <Button 
              size="xs" 
              variant="light" 
              color="blue"
              onClick={handleInstallClick}
              leftSection={<IconDownload size={14} />}
            >
              インストール
            </Button>
            <Button 
              size="xs" 
              variant="subtle" 
              color="gray"
              onClick={handleDismiss}
            >
              後で
            </Button>
          </Group>
        </div>
      </Group>
    </Card>
  );
}