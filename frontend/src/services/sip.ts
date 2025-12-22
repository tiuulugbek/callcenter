// SIP Client Service - JSSIP orqali Kerio Control ga ulanish
import { EventEmitter } from 'events';

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
      
      // Kerio Control WebSocket yoki UDP transport
      // Agar WebSocket mavjud bo'lmasa, UDP ishlatish kerak
      // Lekin browser da UDP ishlamaydi, shuning uchun WebSocket kerak
      // Kerio Control WebSocket port: 8089 yoki 5061 (WSS)
      const wsUrl = `wss://${config.server}:8089/ws`;
      
      // Agar WebSocket ishlamasa, SIP over WebSocket proxy kerak
      // Yoki Asterisk WebRTC gateway kerak
      const socket = new JSSIP.WebSocketInterface(wsUrl);
      
      this.socket = new JSSIP.UA({
        uri: `sip:${config.username}@${config.domain}`,
        password: config.password,
        sockets: [socket],
        register: true,
        register_expires: 600,
      });

      // Event handlers
      this.socket.on('registered', () => {
        this.registered = true;
        this.emit('registered');
        console.log('SIP registered');
      });

      this.socket.on('registrationFailed', (e: any) => {
        this.registered = false;
        this.emit('registrationFailed', e);
        console.error('SIP registration failed:', e);
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
      
      return { success: true };
    } catch (error: any) {
      console.error('SIP initialization error:', error);
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

  // Qo'ng'iroq qilish
  async makeCall(number: string) {
    if (!this.socket || !this.registered) {
      throw new Error('SIP not registered');
    }

    try {
      const options = {
        eventHandlers: {
          progress: () => {
            console.log('Call progress');
          },
          failed: (e: any) => {
            console.error('Call failed:', e);
            this.emit('callFailed', e);
          },
        },
        mediaConstraints: {
          audio: true,
          video: false,
        },
      };

      const session = this.socket.call(`sip:${number}@${this.config?.domain}`, options);
      return { success: true, sessionId: session.id };
    } catch (error: any) {
      console.error('Make call error:', error);
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

