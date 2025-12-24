// SIP Client Service - JSSIP orqali SIP provayderga ulanish

// Browser-compatible EventEmitter
class EventEmitter {
  private events: Map<string, Array<(...args: any[]) => void>> = new Map();

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!callback) {
      this.events.delete(event);
      return;
    }
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export interface CallState {
  id: string;
  direction: 'incoming' | 'outgoing';
  remoteNumber: string;
  status: 'idle' | 'ringing' | 'answered' | 'ended';
  startTime?: Date;
  endTime?: Date;
}

class SipService extends EventEmitter {
  private socket: any = null;
  private currentCall: any = null;
  private calls: Map<string, CallState> = new Map();
  private registered: boolean = false;
  private config: {
    server: string;
    username: string;
    password: string;
    domain: string;
  } | null = null;

  constructor() {
    super();
  }

  // SIP client ni ishga tushirish
  async initialize(config: {
    server: string;
    username: string;
    password: string;
    domain: string;
  }) {
    this.config = config;
    
    try {
      // JSSIP ni dynamic import qilish
      const JSSIP = await import('jssip');
      
      // SIP WebSocket URL - To'g'ridan-to'g'ri bell.uz SIP server ga ulanish
      // Bell.uz SIP server WebSocket protokoli qo'llab-quvvatlamasa, UDP/TCP ishlatiladi
      // WebRTC uchun WebSocket kerak, lekin agar yo'q bo'lsa, SIP.js UDP/TCP ishlatadi
      
      // WebSocket URL - agar bell.uz WebSocket qo'llab-quvvatlasa
      // Agar yo'q bo'lsa, JSSIP UDP/TCP orqali ulanadi
      let wsUrl: string | null = null;
      
      // WebSocket sinab ko'rish (wss://bell.uz:5060/ws yoki wss://bell.uz:8089/ws)
      // Agar WebSocket ishlamasa, JSSIP UDP/TCP ishlatadi
      try {
        // WebSocket URL ni sinab ko'rish
        wsUrl = `wss://${config.server}:8089/ws`;
        console.log('SIP WebSocket URL:', wsUrl);
      } catch (e) {
        console.warn('WebSocket URL not available, will use UDP/TCP');
        wsUrl = null;
      }
      
      // JSSIP UA konfiguratsiyasi
      const uaConfig: any = {
        uri: `sip:${config.username}@${config.domain || config.server}`,
        password: config.password,
        register: true,
        register_expires: 600,
        connection_recovery_min_interval: 2,
        connection_recovery_max_interval: 30,
        // WebRTC uchun media constraints
        session_timers: false,
        use_preloaded_route: false,
      };
      
      // WebSocket mavjud bo'lsa, ishlatish
      if (wsUrl) {
        const socket = new JSSIP.WebSocketInterface(wsUrl);
        uaConfig.sockets = [socket];
      } else {
        // WebSocket yo'q bo'lsa, UDP/TCP ishlatish
        // JSSIP avtomatik UDP/TCP orqali ulanadi
        console.log('Using UDP/TCP for SIP connection');
      }
      
      console.log('SIP connecting to:', config.server, 'as', config.username);
      
      this.socket = new JSSIP.UA(uaConfig);

      // Event handlers
      this.socket.on('registered', () => {
        this.registered = true;
        this.emit('registered');
        console.log('SIP registered successfully');
      });

      this.socket.on('registrationFailed', (e: any) => {
        this.registered = false;
        this.emit('registrationFailed', e);
        console.error('SIP registration failed:', e);
        console.error('Error details:', {
          cause: e.cause,
          message: e.message,
          status_code: e.status_code,
        });
      });

      this.socket.on('unregistered', () => {
        this.registered = false;
        this.emit('unregistered');
        console.log('SIP unregistered');
      });

      this.socket.on('registrationExpiring', () => {
        console.log('SIP registration expiring');
      });

      this.socket.on('connected', () => {
        console.log('SIP connected');
      });

      this.socket.on('disconnected', (e: any) => {
        this.registered = false;
        this.emit('disconnected');
        console.error('SIP disconnected:', e);
      });

      this.socket.on('newRTCSession', (e: any) => {
        const session = e.session;
        const direction = session.direction;
        
        if (direction === 'incoming') {
          this.handleIncomingCall(session);
        } else {
          this.handleOutgoingCall(session);
        }
      });

      this.socket.start();
      
      // Timeout - agar 10 soniyada ulanmasa, xatolik
      setTimeout(() => {
        if (!this.registered) {
          console.warn('SIP registration timeout');
          this.emit('registrationFailed', { 
            message: 'Connection timeout. SIP WebSocket ulanib bo\'lmadi.',
            cause: 'TIMEOUT'
          });
        }
      }, 10000);
      
      return { success: true };
    } catch (error: any) {
      console.error('SIP initialization error:', error);
      this.emit('registrationFailed', error);
      return { success: false, error: error.message };
    }
  }

  // Kiruvchi qo'ng'iroqni boshqarish
  private handleIncomingCall(session: any) {
    const callId = session.id;
    const remoteNumber = session.remote_identity.uri.user || 'Unknown';
    
    const callState: CallState = {
      id: callId,
      direction: 'incoming',
      remoteNumber,
      status: 'ringing',
      startTime: new Date(),
    };

    this.calls.set(callId, callState);
    this.currentCall = session;
    
    this.emit('incomingCall', callState);

    // Session events
    session.on('accepted', () => {
      callState.status = 'answered';
      this.emit('callAnswered', callState);
    });

    session.on('ended', () => {
      callState.status = 'ended';
      callState.endTime = new Date();
      this.emit('callEnded', callState);
      this.calls.delete(callId);
      if (this.currentCall === session) {
        this.currentCall = null;
      }
    });

    session.on('failed', () => {
      callState.status = 'ended';
      callState.endTime = new Date();
      this.emit('callEnded', callState);
      this.calls.delete(callId);
      if (this.currentCall === session) {
        this.currentCall = null;
      }
    });
  }

  // Chiquvchi qo'ng'iroqni boshqarish
  private handleOutgoingCall(session: any) {
    const callId = session.id;
    const remoteNumber = session.remote_identity.uri.user || 'Unknown';
    
    const callState: CallState = {
      id: callId,
      direction: 'outgoing',
      remoteNumber,
      status: 'ringing',
      startTime: new Date(),
    };

    this.calls.set(callId, callState);
    this.currentCall = session;
    
    this.emit('outgoingCall', callState);

    // Session events
    session.on('accepted', () => {
      callState.status = 'answered';
      this.emit('callAnswered', callState);
    });

    session.on('ended', () => {
      callState.status = 'ended';
      callState.endTime = new Date();
      this.emit('callEnded', callState);
      this.calls.delete(callId);
      if (this.currentCall === session) {
        this.currentCall = null;
      }
    });

    session.on('failed', () => {
      callState.status = 'ended';
      callState.endTime = new Date();
      this.emit('callEnded', callState);
      this.calls.delete(callId);
      if (this.currentCall === session) {
        this.currentCall = null;
      }
    });
  }

  // Qo'ng'iroq qilish - WebRTC orqali to'g'ridan-to'g'ri SIP server ga
  async makeCall(number: string) {
    if (!this.socket || !this.registered) {
      throw new Error('SIP not registered. Avval SIP server ga ulanish kerak.');
    }

    if (!this.config) {
      throw new Error('SIP config not initialized');
    }

    try {
      // Raqamni tozalash va formatlash
      let cleanNumber = number.replace(/\D/g, ''); // Faqat raqamlarni qoldirish
      
      // Agar raqam 998 bilan boshlanmasa, qo'shish
      if (!cleanNumber.startsWith('998')) {
        cleanNumber = `998${cleanNumber}`;
      }
      
      // SIP URI - to'g'ridan-to'g'ri bell.uz server ga
      const sipUri = `sip:${cleanNumber}@${this.config.domain || this.config.server}`;
      console.log('Calling:', sipUri);

      const options = {
        eventHandlers: {
          progress: (e: any) => {
            console.log('Call progress:', e);
            this.emit('callProgress', e);
          },
          failed: (e: any) => {
            console.error('Call failed:', e);
            this.emit('callFailed', e);
          },
          ended: (e: any) => {
            console.log('Call ended:', e);
            this.emit('callEnded', e);
          },
        },
        mediaConstraints: {
          audio: true,
          video: false,
        },
        // WebRTC uchun RTC peer connection options
        rtcOfferConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        },
        rtcAnswerConstraints: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        },
      };

      const session = this.socket.call(sipUri, options);
      
      // Session ni saqlash
      this.currentCall = session;
      
      // Session event handlers
      session.on('progress', () => {
        console.log('Call ringing...');
        this.emit('callProgress', { sessionId: session.id });
      });

      session.on('accepted', () => {
        console.log('Call answered');
        const callState = this.calls.get(session.id);
        if (callState) {
          callState.status = 'answered';
          this.emit('callAnswered', callState);
        }
      });

      session.on('ended', () => {
        console.log('Call ended');
        const callState = this.calls.get(session.id);
        if (callState) {
          callState.status = 'ended';
          callState.endTime = new Date();
          this.emit('callEnded', callState);
        }
        this.calls.delete(session.id);
        if (this.currentCall === session) {
          this.currentCall = null;
        }
      });

      session.on('failed', (e: any) => {
        console.error('Call failed:', e);
        const callState = this.calls.get(session.id);
        if (callState) {
          callState.status = 'ended';
          callState.endTime = new Date();
          this.emit('callEnded', callState);
        }
        this.calls.delete(session.id);
        if (this.currentCall === session) {
          this.currentCall = null;
        }
        this.emit('callFailed', e);
      });

      // Call state ni yaratish
      const callState: CallState = {
        id: session.id,
        direction: 'outgoing',
        remoteNumber: cleanNumber,
        status: 'ringing',
        startTime: new Date(),
      };
      this.calls.set(session.id, callState);
      this.emit('outgoingCall', callState);

      return { success: true, sessionId: session.id };
    } catch (error: any) {
      console.error('Make call error:', error);
      this.emit('callFailed', error);
      return { success: false, error: error.message };
    }
  }

  // Qo'ng'iroqni qabul qilish
  async answerCall() {
    if (!this.currentCall) {
      throw new Error('No active call');
    }

    try {
      this.currentCall.answer({
        mediaConstraints: {
          audio: true,
          video: false,
        },
      });
      return { success: true };
    } catch (error: any) {
      console.error('Answer call error:', error);
      return { success: false, error: error.message };
    }
  }

  // Qo'ng'iroqni yopish
  async hangupCall() {
    if (!this.currentCall) {
      throw new Error('No active call');
    }

    try {
      this.currentCall.terminate();
      this.currentCall = null;
      return { success: true };
    } catch (error: any) {
      console.error('Hangup call error:', error);
      return { success: false, error: error.message };
    }
  }

  // Status
  isRegistered(): boolean {
    return this.registered;
  }

  getCurrentCall(): CallState | null {
    if (!this.currentCall) {
      return null;
    }
    return this.calls.get(this.currentCall.id) || null;
  }

  // To'xtatish
  disconnect() {
    if (this.currentCall) {
      this.currentCall.terminate();
      this.currentCall = null;
    }
    
    if (this.socket) {
      this.socket.stop();
      this.socket = null;
    }
    
    this.registered = false;
    this.calls.clear();
  }
}

export const sipService = new SipService();

