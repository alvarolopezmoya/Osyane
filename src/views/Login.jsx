import { useState } from 'react';
import { useApp } from '../store.jsx';
import { useI18n } from '../i18n/index.jsx';
import { STUDENTS, TEACHERS } from '../data.js';
import { DS } from '../components/ds.js';
import { Avatar, Input, Btn } from '../components/UI.jsx';
import { IcoSearch } from '../components/Icons.jsx';
import { isSupabaseEnabled } from '../services/supabase.js';
import { sendMagicLink, validateInstitutionalEmail } from '../services/auth-supabase.js';

export default function LoginScreen() {
  const { login } = useApp();
  const { t } = useI18n();
  // Si Supabase está habilitado, abrimos por defecto la pestaña "real" (magic link).
  // Si no, solo se muestra la pestaña Demo.
  const [tab, setTab] = useState(isSupabaseEnabled ? 'magic' : 'demo');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: DS.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, overflowY: 'auto'
    }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 65% 55% at 20% 15%, rgba(79,142,247,0.13) 0%, transparent 60%),
                     radial-gradient(ellipse 55% 60% at 82% 82%, rgba(167,139,250,0.09) 0%, transparent 60%)` }} />

      <div className="rise-in" style={{ position: 'relative', width: '100%', maxWidth: 440, zIndex: 1, margin: 'auto' }}>
        <div style={{
          background: DS.card,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${DS.bdMd}`, borderRadius: 24,
          padding: '36px 36px 30px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          <Brand t={t} />

          {isSupabaseEnabled && (
            <div role="tablist" style={{
              display: 'flex', gap: 6, marginBottom: 22,
              background: DS.card2, padding: 4, borderRadius: 11,
              border: `1px solid ${DS.bd}`,
            }}>
              <TabButton active={tab === 'magic'} onClick={() => setTab('magic')}>🔐 Magic link</TabButton>
              <TabButton active={tab === 'demo'}  onClick={() => setTab('demo')}>🧪 Demo</TabButton>
            </div>
          )}

          {!isSupabaseEnabled && <DemoBadge />}

          {tab === 'magic' ? <MagicLinkForm /> : <DemoForm login={login} t={t} />}
        </div>
      </div>
    </div>
  );
}

// ── Brand ────────────────────────────────────────────────────────────────────
function Brand({ t }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{
        width: 58, height: 58, borderRadius: 17, margin: '0 auto 14px',
        background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 900, color: '#fff',
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        boxShadow: '0 0 36px rgba(79,142,247,0.5)',
      }}>O</div>
      <h1 className="head" style={{ fontSize: 24, fontWeight: 800, color: DS.t1, margin: '0 0 4px', letterSpacing: '-.02em' }}>{t('app.title')}</h1>
      <p style={{ margin: 0, fontSize: 13, color: DS.t2 }}>{t('app.subtitle')}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={{
        flex: 1, padding: '8px 12px', borderRadius: 8,
        border: 'none', cursor: 'pointer',
        background: active ? DS.card : 'transparent',
        color: active ? DS.t1 : DS.t2,
        fontWeight: active ? 700 : 500, fontSize: 12,
        fontFamily: "'Inter',sans-serif",
        boxShadow: active ? `0 1px 0 ${DS.bd}, 0 4px 12px rgba(0,0,0,0.18)` : 'none',
        transition: 'all .15s',
      }}
    >{children}</button>
  );
}

function DemoBadge() {
  return (
    <div style={{
      marginBottom: 22, padding: '8px 12px',
      background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)',
      borderRadius: 9, fontSize: 11, color: DS.gold,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>🧪</span>
      <span><strong>MODO DEMO</strong> · datos en localStorage. Para multi-usuario real, configura Supabase (ver <code>supabase/README.md</code>).</span>
    </div>
  );
}

// ── Magic-link form ──────────────────────────────────────────────────────────
function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validateInstitutionalEmail(email)) {
      setError('Solo correos @uta.edu.ec están permitidos.');
      return;
    }
    setLoading(true);
    try {
      await sendMagicLink(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'No se pudo enviar el enlace. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
        <h2 className="head" style={{ fontSize: 16, fontWeight: 700, color: DS.t1, marginBottom: 8 }}>
          Revisa tu correo
        </h2>
        <p style={{ fontSize: 13, color: DS.t2, lineHeight: 1.5, margin: '0 0 18px' }}>
          Te enviamos un enlace mágico a <strong style={{ color: DS.t1 }}>{email}</strong>.<br />
          Haz clic ahí para entrar a Osyane.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(''); }}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 12, color: DS.blueBright, fontWeight: 600,
          }}
        >Usar otro correo</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ margin: 0, fontSize: 12, color: DS.t2, lineHeight: 1.5 }}>
        Te enviaremos un enlace de un solo uso a tu correo institucional. Sin contraseñas que recordar.
      </p>

      <div>
        <label htmlFor="magic-email" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: DS.t2, marginBottom: 6, letterSpacing: '.07em', textTransform: 'uppercase' }}>
          Correo institucional
        </label>
        <Input
          placeholder="usuario@uta.edu.ec"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<IcoSearch size={15} />}
          type="email"
        />
      </div>

      {error && (
        <div role="alert" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.28)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      <Btn type="submit" variant="primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
        {loading ? 'Enviando…' : 'Enviar enlace →'}
      </Btn>

      <p style={{ margin: 0, fontSize: 10, color: DS.t3, textAlign: 'center' }}>
        El enlace expira en 1 hora. Si no recibes nada, revisa spam.
      </p>
    </form>
  );
}

// ── Demo form (login local mock) ─────────────────────────────────────────────
function DemoForm({ login, t }) {
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
    <div className={shaking ? 'shake' : ''}>
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
          <div role="alert" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.28)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
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
            transition: 'all .2s', letterSpacing: '.01em',
          }}>
          {loading ? t('login.submitting') : t('login.submit')}
        </button>
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
  );
}
