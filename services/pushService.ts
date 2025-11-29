import { apiService } from './apiService';

/**
 * Servicio para manejar Push Notifications
 */
class PushService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  /**
   * Inicializa el servicio de push notifications
   */
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications no están soportadas en este navegador');
      return false;
    }

    try {
      // Registrar el service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('✅ Service Worker registrado:', this.registration.scope);

      // Esperar a que el service worker esté activo
      await navigator.serviceWorker.ready;
      console.log('✅ Service Worker listo');

      // Verificar si ya hay una suscripción
      this.subscription = await this.registration.pushManager.getSubscription();

      // Si no hay suscripción, crear una nueva
      if (!this.subscription) {
        await this.subscribe();
      } else {
        console.log('✅ Ya existe una suscripción a push notifications');
        // Verificar que la suscripción esté registrada en el servidor
        await this.ensureSubscriptionRegistered();
      }

      return true;
    } catch (error) {
      console.error('❌ Error inicializando push notifications:', error);
      return false;
    }
  }

  /**
   * Solicita permiso y suscribe al usuario a push notifications
   */
  async subscribe(): Promise<boolean> {
    if (!this.registration) {
      console.error('Service Worker no está registrado');
      return false;
    }

    try {
      // Solicitar permiso
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('Permiso para notificaciones denegado');
        return false;
      }

      // Obtener la clave pública VAPID
      const publicKey = await apiService.getVapidPublicKey();
      
      if (!publicKey) {
        console.error('No se pudo obtener la clave pública VAPID');
        return false;
      }

      // Convertir la clave pública de base64 a ArrayBuffer
      const publicKeyBuffer = this.urlBase64ToUint8Array(publicKey);

      // Crear la suscripción
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKeyBuffer
      });

      // Registrar la suscripción en el servidor
      await apiService.subscribeToPush(this.subscription);

      console.log('✅ Suscrito a push notifications');
      return true;
    } catch (error) {
      console.error('❌ Error suscribiéndose a push notifications:', error);
      return false;
    }
  }

  /**
   * Cancela la suscripción a push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true; // Ya está desuscrito
    }

    try {
      await this.subscription.unsubscribe();
      await apiService.unsubscribeFromPush(this.subscription.endpoint);
      this.subscription = null;
      console.log('✅ Desuscrito de push notifications');
      return true;
    } catch (error) {
      console.error('❌ Error desuscribiéndose:', error);
      return false;
    }
  }

  /**
   * Verifica el estado de la suscripción
   */
  async getSubscriptionStatus(): Promise<{
    subscribed: boolean;
    permission: NotificationPermission;
  }> {
    const permission = Notification.permission;
    
    if (!this.registration) {
      return { subscribed: false, permission };
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      return {
        subscribed: subscription !== null,
        permission
      };
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      return { subscribed: false, permission };
    }
  }

  /**
   * Asegura que la suscripción esté registrada en el servidor
   */
  private async ensureSubscriptionRegistered(): Promise<void> {
    if (!this.subscription) return;

    try {
      // Intentar registrar la suscripción (si ya existe, el servidor la ignorará)
      await apiService.subscribeToPush(this.subscription);
    } catch (error) {
      console.warn('No se pudo verificar la suscripción en el servidor:', error);
    }
  }

  /**
   * Convierte una clave VAPID de base64 URL-safe a Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushService = new PushService();

