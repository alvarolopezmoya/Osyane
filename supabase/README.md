# Supabase setup para Osyane

Esta carpeta contiene todo lo necesario para conectar Osyane a un backend real.
Sin esto, la app sigue funcionando en **modo demo** con `localStorage`.

## 1 · Crear el proyecto

1. Ir a [https://supabase.com](https://supabase.com) → **New project**.
2. Elegir región **South America (São Paulo)** para latencia más baja desde Ecuador.
3. Anotar la **contraseña de la BD** (la pide para crear el Postgres). No la pierdas.
4. Esperar ~2 min a que se aprovisione.

## 2 · Aplicar el esquema

1. En el dashboard del proyecto → **SQL Editor → New query**.
2. Pegar el contenido de [`schema.sql`](./schema.sql) y ejecutar (botón **Run**).
3. (Opcional, solo dev) Pegar [`seed.sql`](./seed.sql) y ejecutar para tener datos de prueba.

> El schema es idempotente: si necesitas re-aplicarlo, no rompe nada.

## 3 · Configurar Authentication

En **Authentication → Providers → Email**:

- ✅ Activar **Enable Email Provider**
- ✅ Activar **Confirm email** (obliga clic en el link antes de loguear)
- ✅ Activar **Secure email change**

En **Authentication → URL Configuration**:

- **Site URL**: `https://tu-usuario.github.io/Osyane/` (o tu dominio en producción)
- **Redirect URLs**: añadir las URLs locales también — `http://localhost:5173/**`

En **Authentication → Email Templates** → **Magic Link**:

- Personalizar el asunto: `Tu enlace de acceso a Osyane`
- Cuerpo HTML con la marca Osyane (opcional, hay template de ejemplo abajo)

### Template HTML sugerido

```html
<h2 style="color:#4f8ef7;font-family:sans-serif;">Bienvenido a Osyane</h2>
<p>Haz clic en el siguiente botón para iniciar sesión:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:12px 24px;
     background:linear-gradient(135deg,#1d4ed8,#4f8ef7);color:#fff;text-decoration:none;
     border-radius:9px;font-weight:700;">Ingresar a Osyane</a>
</p>
<p style="color:#5a6a8a;font-size:12px;">
  El enlace expira en 1 hora. Si no fuiste tú, ignora este correo.
</p>
```

## 4 · Conectar el frontend

En la raíz del repo, copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

Las claves se obtienen en **Project Settings → API**.

## 5 · Probar el flujo

```bash
npm run dev
```

1. Abrir `http://localhost:5173`. En el login verás dos pestañas: **Demo** y **Magic link**.
2. Pestaña **Magic link** → escribir un correo `@uta.edu.ec`.
3. Revisar el inbox → clic en el enlace.
4. Vuelves a la app ya autenticado. Supabase crea el perfil automáticamente.

## 6 · Promoverte a docente

Como el trigger crea perfiles con `role = 'student'` por defecto, para tener un usuario docente
hay que actualizarlo manualmente la primera vez:

```sql
update public.profiles set role = 'teacher' where email = 'cpinto@uta.edu.ec';
```

## 7 · Deploy a producción

GitHub Pages no acepta `.env`. Hay dos opciones:

### Opción A · GitHub Actions secrets

En el repo → **Settings → Secrets and variables → Actions → New repository secret**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SENTRY_DSN` (opcional)

Y en el workflow (`.github/workflows/deploy.yml`) añadir bajo el step de Build:

```yaml
env:
  VITE_BASE: /${{ github.event.repository.name }}/
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
  VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
```

### Opción B · Vercel / Netlify / Cloudflare Pages

Estos hosts tienen UI para configurar env vars y mejor soporte para SPAs.
Recomendado para producción seria.

## ⚠️ Seguridad

- La `anon key` es **pública** — es seguro exponerla en el front. Lo que protege los datos son las **RLS policies** definidas en `schema.sql`.
- La `service_role key` (en Project Settings → API) es **secreta** — nunca la pongas en el cliente. Solo úsala desde backend / Edge Functions.
- Las policies de `schema.sql` ya restringen:
  - Estudiantes solo leen/escriben sus propias entregas
  - Solo docentes pueden crear/aprobar tareas
  - Solo docentes pueden ver el audit_log

## Estructura

```
supabase/
├── schema.sql      ← DDL completo: tablas, índices, RLS, triggers, RPCs
├── seed.sql        ← Datos de prueba (solo dev)
└── README.md       ← Esta guía
```

## Migraciones futuras

Para evolucionar el schema sin perder datos:

1. Crear `supabase/migrations/0002_lo_que_sea.sql` con los `ALTER TABLE` necesarios.
2. Ejecutarlos en orden en el SQL Editor.
3. Commitear ambos archivos al repo.

Cuando crezca el proyecto, vale la pena usar la **Supabase CLI** local que automatiza esto:

```bash
npm i -g supabase
supabase login
supabase link --project-ref tu-proyecto
supabase db push
```
