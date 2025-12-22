import { useState, useEffect } from 'react';
import { sipService, CallState } from '../services/sip';
import './Phone.css';

interface PhoneProps {
  config?: {
    server: string;
    username: string;
    password: string;
    domain: string;
  };
}

const Phone = ({ config }: PhoneProps) => {
  const [registered, setRegistered] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallState | null>(null);
  const [dialNumber, setDialNumber] = useState('');
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    if (!config) return;

    // SIP service event handlers
    sipService.on('registered', () => {
      setRegistered(true);
      setStatus('Connected');
    });

    sipService.on('registrationFailed', (error: any) => {
      setRegistered(false);
      const errorMsg = error?.message || error?.cause || 'Connection Failed';
      setStatus(`Connection Failed: ${errorMsg}`);
      console.error('SIP registration failed:', error);
    });

    sipService.on('disconnected', () => {
      setRegistered(false);
      setStatus('Disconnected');
    });

    sipService.on('unregistered', () => {
      setRegistered(false);
      setStatus('Unregistered');
    });

    sipService.on('incomingCall', (call: CallState) => {
      setCurrentCall(call);
      setStatus('Incoming Call');
    });

    sipService.on('outgoingCall', (call: CallState) => {
      setCurrentCall(call);
      setStatus('Calling...');
    });

    sipService.on('callAnswered', (call: CallState) => {
      setCurrentCall(call);
      setStatus('In Call');
    });

    sipService.on('callEnded', () => {
      setCurrentCall(null);
      setStatus(registered ? 'Connected' : 'Disconnected');
    });

    // Initialize SIP
    sipService.initialize(config);

    return () => {
      sipService.disconnect();
    };
  }, [config]);

  const handleDial = async () => {
    if (!dialNumber.trim()) {
      alert('Raqam kiriting');
      return;
    }

    if (!registered) {
      alert('SIP ulanmagan');
      return;
    }

    const result = await sipService.makeCall(dialNumber.trim());
    if (!result.success) {
      alert(`Qo'ng'iroq qilishda xatolik: ${result.error}`);
    }
  };

  const handleAnswer = async () => {
    const result = await sipService.answerCall();
    if (!result.success) {
      alert(`Qo'ng'iroqni qabul qilishda xatolik: ${result.error}`);
    }
  };

  const handleHangup = async () => {
    const result = await sipService.hangupCall();
    if (!result.success) {
      alert(`Qo'ng'iroqni yopishda xatolik: ${result.error}`);
    }
  };

  return (
    <div className="phone-container">
      <div className="phone-status">
        <div className={`status-indicator ${registered ? 'connected' : 'disconnected'}`}></div>
        <span>{status}</span>
      </div>

      {currentCall && (
        <div className="call-info">
          <div className="call-number">
            {currentCall.direction === 'incoming' ? '📞' : '📱'} {currentCall.remoteNumber}
          </div>
          <div className="call-status">{currentCall.status}</div>
        </div>
      )}

      <div className="phone-dialpad">
        <div className="dial-input">
          <input
            type="text"
            value={dialNumber}
            onChange={(e) => setDialNumber(e.target.value)}
            placeholder="Raqam kiriting"
            disabled={!registered || !!currentCall}
          />
        </div>

        <div className="dial-buttons">
          {!currentCall ? (
            <>
              <button onClick={handleDial} disabled={!registered || !dialNumber.trim()}>
                📞 Qo'ng'iroq qilish
              </button>
            </>
          ) : (
            <>
              {currentCall.direction === 'incoming' && currentCall.status === 'ringing' && (
                <button onClick={handleAnswer} className="btn-answer">
                  ✅ Qabul qilish
                </button>
              )}
              <button onClick={handleHangup} className="btn-hangup">
                ❌ Yopish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Phone;

