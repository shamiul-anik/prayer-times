// PWA Setup and Notification Handler
class PrayerTimesPWA {
  constructor() {
    this.swRegistration = null;
    this.notificationsEnabled = false;
    this.lastNotifiedPrayer = null;
    this.init();
  }

  async init() {
    // Register Service Worker
    await this.registerServiceWorker();
    
    // Request notification permission
    await this.requestNotificationPermission();
    
    // Handle updates
    this.handleServiceWorkerUpdates();
    
    // Install prompt
    this.handleInstallPrompt();
    
    // Manage cache cleanup
    this.initializeCacheManagement();
  }

  // Initialize cache management
  initializeCacheManagement() {
    // Clear old cache immediately on startup
    this.cleanupOldCache();
    
    // Schedule cleanup every hour
    setInterval(() => this.cleanupOldCache(), 60 * 60 * 1000);
  }

  // Clean up old cache entries from previous days
  cleanupOldCache() {
    const today = new Date().toISOString().split('T')[0];
    const keysToDelete = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('prayer-times-')) {
          // Extract date from cache key (format: prayer-times-city-country-school-YYYY-MM-DD)
          const parts = key.split('-');
          const cacheDate = parts.slice(-3).join('-');
          
          if (cacheDate !== today) {
            keysToDelete.push(key);
          }
        }
      }
      
      keysToDelete.forEach(key => {
        localStorage.removeItem(key);
      });
      
      if (keysToDelete.length > 0) {
        console.log(`✓ PWA: Cleared ${keysToDelete.length} old cache entries`);
      }
    } catch (error) {
      console.error('Error during cache cleanup:', error);
    }
  }

  // Register Service Worker
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers are not supported in this browser.');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered successfully:', this.swRegistration);
      
      // Register for periodic background sync (if supported)
      // Note: This requires HTTPS and user engagement
      if ('periodicSync' in this.swRegistration) {
        try {
          await this.swRegistration.periodicSync.register('prayer-times-periodic', {
            minInterval: 24 * 60 * 60 * 1000 // 24 hours
          });
          console.log('✓ Periodic sync registered');
        } catch (error) {
          // Periodic sync fails on localhost and when permission not granted
          // This is expected - app will still work fine
          if (error.name === 'NotAllowedError') {
            console.log('ℹ Periodic sync requires HTTPS in production or user permission');
          } else {
            console.log('ℹ Periodic sync unavailable:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Notifications are not supported in this browser.');
      return;
    }

    if (Notification.permission === 'granted') {
      this.notificationsEnabled = true;
      console.log('Notifications are already enabled');
      return;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          this.notificationsEnabled = true;
          console.log('Notification permission granted');
          this.showWelcomeNotification();
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  // Show welcome notification
  showWelcomeNotification() {
    if (!this.notificationsEnabled || !this.swRegistration) return;

    this.swRegistration.showNotification('Prayer Times Dashboard', {
      body: 'Notifications enabled! You will receive Adhan alerts for prayer times.',
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
      tag: 'welcome',
      data: {
        dateOfArrival: Date.now()
      }
    });
  }

  // Show prayer time notification
  showPrayerNotification(prayer) {
    if (!this.notificationsEnabled || !this.swRegistration) {
      console.log('Notifications not enabled or Service Worker not registered');
      return;
    }

    if (this.lastNotifiedPrayer === prayer.name) {
      return; // Avoid duplicate notifications
    }

    this.lastNotifiedPrayer = prayer.name;

    // Format the time based on user preference
    const formattedTime = this.formatPrayerTime(prayer.time);

    const notificationOptions = {
      body: `It's time for ${prayer.name} prayer at ${formattedTime}`,
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
      tag: 'prayer-time',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        prayer: prayer.name,
        time: prayer.time,
        formattedTime: formattedTime
      },
      actions: [
        {
          action: 'focus',
          title: 'Focus on prayer'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    this.swRegistration.showNotification(`🕌 ${prayer.name} Prayer Time`, notificationOptions);
  }

  // Format prayer time based on user preference
  formatPrayerTime(time24) {
    const timingSelect = document.getElementById('timingSelect');
    const format = timingSelect ? timingSelect.value : '24';
    
    const [hours, minutes] = time24.split(':').map(Number);

    if (format === '12') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    }
    return time24; // 24-hour format
  }

  // Handle Service Worker updates
  handleServiceWorkerUpdates() {
    if (!this.swRegistration) return;

    this.swRegistration.addEventListener('updatefound', () => {
      const newWorker = this.swRegistration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available, notify user
          console.log('New version available! Refresh to update.');
          this.showUpdateNotification();
        }
      });
    });

    // Check for updates periodically
    setInterval(() => {
      this.swRegistration.update();
    }, 60 * 60 * 1000); // Check every hour
  }

  // Show update notification
  showUpdateNotification() {
    if (!this.swRegistration) return;

    this.swRegistration.showNotification('App Update Available', {
      body: 'A new version of Prayer Times is available. Please refresh the app.',
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
      tag: 'update',
      requireInteraction: true,
      data: {
        type: 'update'
      }
    });
  }

  // Handle install prompt
  handleInstallPrompt() {
    let deferredPrompt = null;
    let installPromptAvailable = false;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Capture and defer prompt for a consistent custom install banner.
      e.preventDefault();
      installPromptAvailable = true;
      deferredPrompt = e;
      console.log('Install prompt is available');
      
      // Wait a bit for DOM to be fully ready, then show our banner
      setTimeout(() => {
        this.showInstallPrompt(deferredPrompt);
      }, 500);
    });

    window.addEventListener('appinstalled', () => {
      console.log('✓ PWA was installed successfully');
      deferredPrompt = null;
      
      // Remove install banner when app is installed
      const banner = document.getElementById('installPrompt');
      if (banner) banner.remove();
    });

    // iOS Safari and macOS Safari often don't fire beforeinstallprompt.
    setTimeout(() => {
      if (!installPromptAvailable && !this.isRunningStandalone()) {
        this.showManualInstallPrompt();
      }
    }, 1200);
  }

  isRunningStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  isIOSSafari() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isWebKit = /WebKit/.test(ua);
    const isOtherIOSBrowser = /CriOS|FxiOS|EdgiOS/.test(ua);
    return isIOS && isWebKit && !isOtherIOSBrowser;
  }

  isMacSafari() {
    const ua = navigator.userAgent;
    const isMac = /Macintosh/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
    return isMac && isSafari;
  }

  showManualInstallPrompt() {
    const installContainer = document.getElementById('installPrompt');

    if (installContainer) {
      installContainer.style.display = 'block';
      const installButton = installContainer.querySelector('button');
      if (installButton) {
        installButton.textContent = 'How to Install';
        installButton.removeEventListener('click', this.handleInstallClick);
        installButton.addEventListener('click', () => this.showInstallInstructions());
      }
      return;
    }

    this.createManualInstallBanner();
  }

  showInstallInstructions() {
    if (this.isIOSSafari()) {
      alert("iPhone/iPad: Tap Share, then choose 'Add to Home Screen'.");
      return;
    }

    if (this.isMacSafari()) {
      alert("Mac Safari: Use File > Add to Dock to install this app.");
      return;
    }

    alert("Use your browser menu and choose 'Install app' or 'Add to Home Screen'.");
  }

  // Show install prompt
  showInstallPrompt(deferredPrompt) {
    // Check if there's an install container in the HTML
    const installContainer = document.getElementById('installPrompt');
    
    if (installContainer && installContainer.style.display !== 'none') {
      // Container already visible
      return;
    }
    
    if (installContainer) {
      // If container exists, use it
      installContainer.style.display = 'block';
      
      const installButton = installContainer.querySelector('button');
      if (installButton) {
        installButton.removeEventListener('click', this.handleInstallClick);
        installButton.addEventListener('click', this.handleInstallClick.bind(this, deferredPrompt, installContainer));
      }

      const closeButton = installContainer.querySelector('.close-btn');
      if (closeButton) {
        closeButton.removeEventListener('click', this.handleInstallClose);
        closeButton.addEventListener('click', this.handleInstallClose.bind(this, installContainer));
      }
    } else {
      // If no container, create one automatically
      this.createInstallBanner(deferredPrompt);
    }
  }

  // Handle install button click
  handleInstallClick(deferredPrompt, container) {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✓ User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      container.remove();
      deferredPrompt = null;
    }).catch(error => {
      console.error('Install prompt error:', error);
      container.remove();
    });
  }

  // Handle install close button
  handleInstallClose(container) {
    container.remove();
  }

  getInstallPromptTheme() {
    const styles = getComputedStyle(document.documentElement);
    const read = (name, fallback) => {
      const value = styles.getPropertyValue(name);
      return value ? value.trim() : fallback;
    };

    return {
      background: read('--primary-dark', '#1a1f3a'),
      text: read('--text-primary', '#f0f4ff'),
      buttonBg: read('--text-primary', '#f0f4ff'),
      buttonText: read('--primary-dark', '#1a1f3a'),
      buttonHover: read('--text-secondary', '#a0aec0'),
      closeBg: 'rgba(255,255,255,0.2)',
      closeHover: 'rgba(255,255,255,0.3)',
    };
  }

  // Create manual install banner for browsers without beforeinstallprompt
  createManualInstallBanner() {
    if (document.getElementById('installPrompt')) {
      return;
    }

    const theme = this.getInstallPromptTheme();
    const banner = document.createElement('div');
    banner.id = 'installPrompt';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${theme.background};
      color: ${theme.text};
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 9999;
      max-width: 320px;
      animation: slideIn 0.3s ease-out;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    const text = document.createElement('span');
    text.textContent = 'Install Prayer Times App';
    text.style.flex = '1';

    const button = document.createElement('button');
    button.textContent = 'How to Install';
    button.style.cssText = `
      background: ${theme.buttonBg};
      color: ${theme.buttonText};
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s;
      white-space: nowrap;
    `;

    button.addEventListener('mouseover', () => {
      button.style.background = theme.buttonHover;
    });

    button.addEventListener('mouseout', () => {
      button.style.background = theme.buttonBg;
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.className = 'close-btn';
    closeBtn.style.cssText = `
      background: ${theme.closeBg};
      border: none;
      color: ${theme.text};
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: background 0.2s;
    `;

    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.background = theme.closeHover;
    });

    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.background = theme.closeBg;
    });

    button.addEventListener('click', () => this.showInstallInstructions());
    closeBtn.addEventListener('click', () => banner.remove());

    banner.appendChild(text);
    banner.appendChild(button);
    banner.appendChild(closeBtn);
    document.body.appendChild(banner);
  }
  // Create install banner automatically if no container exists
  createInstallBanner(deferredPrompt) {
    // Check if banner already exists
    if (document.getElementById('installPrompt')) {
      return;
    }

    const theme = this.getInstallPromptTheme();
    const banner = document.createElement('div');
    banner.id = 'installPrompt';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${theme.background};
      color: ${theme.text};
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 9999;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    const text = document.createElement('span');
    text.textContent = "\u{1F54C} Install Prayer Times App";
    text.style.flex = '1';

    const button = document.createElement('button');
    button.textContent = 'Install';
    button.style.cssText = `
      background: ${theme.buttonBg};
      color: ${theme.buttonText};
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    `;

    button.addEventListener('mouseover', () => {
      button.style.background = theme.buttonHover;
    });

    button.addEventListener('mouseout', () => {
      button.style.background = theme.buttonBg;
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'x';
    closeBtn.className = 'close-btn';
    closeBtn.style.cssText = `
      background: ${theme.closeBg};
      border: none;
      color: ${theme.text};
      width: 32px;
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: background 0.2s;
    `;

    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.background = theme.closeHover;
    });

    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.background = theme.closeBg;
    });

    button.addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('✓ User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          banner.remove();
          deferredPrompt = null;
        }).catch(error => {
          console.error('Install prompt error:', error);
          banner.remove();
        });
      }
    });

    closeBtn.addEventListener('click', () => {
      banner.remove();
    });

    banner.appendChild(text);
    banner.appendChild(button);
    banner.appendChild(closeBtn);
    document.body.appendChild(banner);
  }

  // Method to send notification message to service worker
  sendNotificationToSW(title, options) {
    if (!this.swRegistration || !this.swRegistration.active) return;

    this.swRegistration.active.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: title,
      ...options
    });
  }

  // Background sync
  async syncPrayerTimes() {
    if ('SyncManager' in window && this.swRegistration) {
      try {
        await this.swRegistration.sync.register('prayer-times-sync');
        console.log('Background sync registered');
      } catch (error) {
        console.log('Background sync registration failed:', error);
      }
    }
  }
}

// Initialize PWA on page load
let pwaInstance = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pwaInstance = new PrayerTimesPWA();
  });
} else {
  pwaInstance = new PrayerTimesPWA();
}

// Expose globally for use in other scripts
window.pwaInstance = pwaInstance;

