// ────────────────────────────────────────────────────────────────────────────
// Auth — stub local. En producción esto se reemplaza con UTA SSO (OAuth).
//
// TODO[SSO] Auth con UTA SSO contra @uta.edu.ec:
//   La UTA usa Microsoft 365 / Azure AD para los correos @uta.edu.ec.
//   Por lo tanto el flujo OAuth correcto es Azure AD (MSAL) restringido al tenant UTA.
//
//   1) Registrar la app en Azure Portal del DTIC-UTA (pedir al área).
//      Redirect URI: https://<github-pages-host>/Osyane/  (o el dominio final)
//      Obtener: CLIENT_ID (UUID) + TENANT_ID de uta.edu.ec.
//   2) Instalar MSAL:
//        npm i @azure/msal-browser @azure/msal-react
//   3) Crear msalConfig con clientId/tenantId; envolver <App> en <MsalProvider>.
//   4) Reemplazar `loginLocal` por:
//        const { instance } = useMsal();
//        await instance.loginPopup({ scopes: ['User.Read'] });
//        const account = instance.getActiveAccount();
//        if (!account.username.endsWith('@uta.edu.ec')) throw new Error('Dominio no permitido');
//   5) Alternativa más simple: Firebase Auth → SAML/OIDC provider apuntando al IdP UTA.
//   6) Validar el dominio del correo en el backend también, no sólo en cliente.
// ────────────────────────────────────────────────────────────────────────────

import { STUDENTS, TEACHERS } from '../data.js';

const VALID_PASSWORDS = new Set(['osyane', '1234']);

export function loginLocal(email, password) {
  if (!email || !password) return { ok: false, reason: 'empty' };
  const addr = email.trim().toLowerCase();
  const pwd = password.trim();
  if (!VALID_PASSWORDS.has(pwd)) return { ok: false, reason: 'bad-password' };

  const teacher = TEACHERS.find((t) => t.email.toLowerCase() === addr);
  if (teacher) return { ok: true, role: 'teacher', user: teacher };

  const student = STUDENTS.find((s) => s.email.toLowerCase() === addr);
  if (student) return { ok: true, role: 'student', user: student };

  return { ok: false, reason: 'not-found' };
}

// Placeholder para el botón "Ingresar con cuenta UTA".
// TODO[SSO] Implementar con MSAL (ver bloque superior).
export async function loginWithUtaSso() {
  throw new Error('UTA SSO aún no está configurado. Ver TODO[SSO] en services/auth.js');
}
