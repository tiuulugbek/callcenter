import { useState } from 'react';
import './SipSettings.css';

interface SipSettingsProps {
  onSave: (config: {
    server: string;
    username: string;
    password: string;
    domain: string;
  }) => void;
}

const SipSettings = ({ onSave }: SipSettingsProps) => {
  const [config, setConfig] = useState({
    server: localStorage.getItem('sip_server') || '90.156.199.92',
    username: localStorage.getItem('sip_username') || '',
    password: localStorage.getItem('sip_password') || '',
    domain: localStorage.getItem('sip_domain') || '90.156.199.92',
  });

  const handleSave = () => {
    if (!config.username || !config.password) {
      alert('Username va Password kiriting');
      return;
    }

    // localStorage ga saqlash
    localStorage.setItem('sip_server', config.server);
    localStorage.setItem('sip_username', config.username);
    localStorage.setItem('sip_password', config.password);
    localStorage.setItem('sip_domain', config.domain);

    onSave(config);
    alert('SIP sozlamalari saqlandi');
  };

  return (
    <div className="sip-settings">
      <h3>MicroSIP Sozlamalari</h3>
      <p className="sip-description">
        Kerio Operatordan kelgan qo'ng'iroqlarni qabul qilish uchun MicroSIP ma'lumotlarini kiriting.
      </p>
      
      <div className="warning-box">
        <strong>⚠️ Muhim:</strong>
        <p>Browser da to'g'ridan-to'g'ri Kerio Control ga ulanib bo'lmaydi. Asterisk WebRTC gateway kerak.</p>
        <p>Agar ulanmayotgan bo'lsa, MicroSIP ishlatishni tavsiya qilamiz.</p>
      </div>
      
      <div className="form-group">
        <label>SIP Server</label>
        <input
          type="text"
          value={config.server}
          onChange={(e) => setConfig({ ...config, server: e.target.value })}
          placeholder="90.156.199.92"
        />
      </div>

      <div className="form-group">
        <label>Username (Extension)</label>
        <input
          type="text"
          value={config.username}
          onChange={(e) => setConfig({ ...config, username: e.target.value })}
          placeholder="MicroSIP da ishlatilgan username"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={config.password}
          onChange={(e) => setConfig({ ...config, password: e.target.value })}
          placeholder="MicroSIP da ishlatilgan password"
        />
      </div>

      <div className="form-group">
        <label>Domain</label>
        <input
          type="text"
          value={config.domain}
          onChange={(e) => setConfig({ ...config, domain: e.target.value })}
          placeholder="90.156.199.92"
        />
      </div>

      <button onClick={handleSave} className="btn-primary">
        Saqlash
      </button>
    </div>
  );
};

export default SipSettings;
