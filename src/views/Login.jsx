import { useState } from 'react';
import { useApp } from '../store.jsx';
import { useI18n } from '../i18n/index.jsx';
import { STUDENTS, TEACHERS } from '../data.js';
import { DS } from '../components/ds.js';
import { Avatar, Input } from '../components/UI.jsx';
import { IcoSearch } from '../components/Icons.jsx';

export default function LoginScreen() {
  const { login } = useApp();
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  function tryLogin(u, p) {
    const usr = (u !== undefined ? u : username).trim();
    const pwd = (p !== undefined ? p : password).trim();
    if (!usr || !pwd) { setError(t('login.required')); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      const ok = login(usr, pwd);
      setLoading(false);
      if (!ok) {
        setError(t('login.error'));
        setShaking(true);
        setTimeout(() => setShaking(false), 600);
      }
    }, 350);
  }

  function quickLogin(s) {
    setUsername(s.email); setPassword('osyane');
    tryLogin(s.email, 'osyane');
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: DS.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, overflowY: 'auto'
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 65% 55% at 20% 15%, rgba(79,142,247,0.13) 0%, transparent 60%),
                     radial-gradient(ellipse 55% 60% at 82% 82%, rgba(167,139,250,0.09) 0%, transparent 60%)` }} />

      <div className={`rise-in${shaking ? ' shake' : ''}`}
        style={{ position: 'relative', width: '100%', maxWidth: 440, zIndex: 1, margin: 'auto' }}>

        <div style={{
          background: DS.card,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${DS.bdMd}`, borderRadius: 24,
          padding: '36px 36px 30px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)'
        }}>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 58, height: 58, borderRadius: 17, margin: '0 auto 14px',
              background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 900, color: '#fff',
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              boxShadow: '0 0 36px rgba(79,142,247,0.5)'
            }}>O</div>
            <h1 className="head" style={{ fontSize: 24, fontWeight: 800, color: DS.t1, margin: '0 0 4px', letterSpacing: '-.02em' }}>{t('app.title')}</h1>
            <p style={{ margin: 0, fontSize: 13, color: DS.t2 }}>{t('app.subtitle')}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DS.t2, marginBottom: 6, letterSpacing: '.07em', textTransform: 'uppercase' }}>{t('login.email')}</label>
              <Input placeholder="usuario@uta.edu.ec" value={username} icon={<IcoSearch size={15} />}
                onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DS.t2, marginBottom: 6, letterSpacing: '.07em', textTransform: 'uppercase' }}>{t('login.password')}</label>
              <Input placeholder="••••••••" value={password} type="password"
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error &&
              <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.28)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
                {error}
              </div>
            }

            <button
              onClick={() => tryLogin()} disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                background: loading ? 'rgba(79,142,247,0.4)' : 'linear-gradient(135deg,#1d4ed8,#4f8ef7)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                fontFamily: "'Inter',sans-serif", cursor: loading ? 'default' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 18px rgba(79,142,247,0.45)',
                transition: 'all .2s', letterSpacing: '.01em'
              }}>
              {loading ? t('login.submitting') : t('login.submit')}
            </button>

            {/* TODO[SSO] Implementar OAuth contra @uta.edu.ec (ver services/auth.js) */}
            <button
              disabled
              title="UTA SSO próximamente — ver TODO[SSO] en services/auth.js"
              style={{
                width: '100%', padding: '11px', borderRadius: 10,
                border: `1px dashed ${DS.bdMd}`, background: 'transparent',
                color: DS.t2, fontSize: 13, fontWeight: 600,
                fontFamily: "'Inter',sans-serif", cursor: 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: 0.7,
              }}>
              <span>🎓</span> {t('login.ssoCta')}
            </button>
            <div style={{ fontSize: 10, color: DS.t3, textAlign: 'center', marginTop: -8 }}>{t('login.ssoNote')}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: DS.bd }} />
            <span style={{ fontSize: 10, color: DS.t3, fontWeight: 700, letterSpacing: '.08em' }}>{t('login.quickAccess')}</span>
            <div style={{ flex: 1, height: 1, background: DS.bd }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TEACHERS.map((teacher) => (
              <button key={teacher.id} onClick={() => quickLogin(teacher)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 11,
                border: '1px solid rgba(167,139,250,0.25)',
                background: 'rgba(167,139,250,0.07)',
                cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all .15s',
              }}>
                <Avatar initials={teacher.initials} size={34} colorIndex={5} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: DS.t1 }}>{teacher.name}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(167,139,250,0.2)', color: '#a78bfa', borderRadius: 4, padding: '1px 6px', letterSpacing: '.05em' }}>{t('login.teacher')}</span>
                  </div>
                  <div style={{ fontSize: 10, color: DS.t2, fontFamily: "'JetBrains Mono',monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacher.email}</div>
                </div>
                <span style={{ fontSize: 12, color: DS.t3 }}>→</span>
              </button>
            ))}
            {STUDENTS.slice(0, 4).map((s) => (
              <button key={s.id} onClick={() => quickLogin(s)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 11,
                border: `1px solid ${DS.bd}`, background: DS.card2,
                cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all .15s',
              }}>
                <Avatar initials={s.initials} size={34} colorIndex={parseInt(s.id.slice(1)) - 1} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DS.t1 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: DS.t2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace" }}>{s.email}</div>
                </div>
                <span style={{ fontSize: 12, color: DS.t3 }}>→</span>
              </button>
            ))}
          </div>

          <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: 11, color: DS.t3 }}>
            {t('login.hint')} <span style={{ color: DS.t2, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>osyane</span>
          </p>
        </div>
      </div>
    </div>
  );
}
