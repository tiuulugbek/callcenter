declare module 'jssip' {
  export interface UAConfiguration {
    uri: string;
    password: string;
    sockets: WebSocketInterface[];
    register?: boolean;
    register_expires?: number;
  }

  export interface WebSocketInterface {
    // WebSocket interface
  }

  export class WebSocketInterface {
    constructor(url: string);
  }

  export interface RTCSession {
    id: string;
    direction: 'incoming' | 'outgoing';
    remote_identity: {
      uri: {
        user: string;
      };
    };
    answer(options?: any): void;
    terminate(): void;
    on(event: string, callback: (data?: any) => void): void;
  }

  export interface CallOptions {
    eventHandlers?: {
      progress?: () => void;
      failed?: (e: any) => void;
    };
    mediaConstraints?: {
      audio?: boolean;
      video?: boolean;
    };
  }

  export class UA {
    constructor(config: UAConfiguration);
    start(): void;
    stop(): void;
    call(target: string, options?: CallOptions): RTCSession;
    on(event: string, callback: (data?: any) => void): void;
  }
}

