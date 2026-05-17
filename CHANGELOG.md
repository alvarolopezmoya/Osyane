# Changelog

Todas las notas de cambios relevantes se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto adhiere al [Versionado Semántico](https://semver.org/lang/es/).

---

## [2.0.0] — 2026-05-16

### 🚀 Migración mayor a Vite + React (ESM)
- Reescritura de toda la app: de Babel-standalone en navegador a **Vite + ESM**.
- Bundle de producción: ~290 KB gzipped (charts + xlsx + app).
- Build con code-splitting automático (`react`, `charts`, `xlsx` en chunks separados).
- **PWA instalable** vía `vite-plugin-pwa` con service worker y precaché offline.

### ✨ Añadido
- **Persistencia con `localStorage`**: estudiantes, tareas, entregas, notificaciones, sesión, tema e idioma sobreviven recargas.
- **Vista de tareas para estudiantes** (`src/views/StudentTasks.jsx`): listado con contador hasta deadline (color-coded), entrega con nota, filtros por estado y auto-otorgación de XP al aprobar.
- **Flujo de entregas (submissions)**: estudiante entrega → docente aprueba/rechaza → XP se otorga automáticamente al aprobar.
- **Pestaña "Entregas"** en el panel del docente con badge de contador de pendientes.
- **i18n (es/en)** completo con detección automática del idioma del navegador y selector en topbar.
- **Tests con Vitest**: 39 tests cubriendo `getLevelInfo`, ranking, validación de tareas y cálculos de deadline.
- **Stubs documentados** con TODOs para integrar Firebase/Supabase/Express, OAuth UTA (MSAL/Azure AD) y notificaciones WebSocket/SSE.
- Botón placeholder "Ingresar con cuenta UTA" en el login (deshabilitado hasta configurar SSO).
- Validación de tareas centralizada en `utils/tasks.js` (XP > 0, ≤ 1000, asignatura válida, fecha parseable, título no vacío).

### 🎨 Cambiado
- **Estructura de archivos** reorganizada: `src/components/`, `src/views/`, `src/utils/`, `src/i18n/`, `src/services/`, `tests/`.
- Modo claro/oscuro ahora persiste en `localStorage` (clave `osyane:theme`).
- Login con flujo más rápido (350ms vs. 650ms).

### 🛠️ Tooling
- Scripts npm: `dev`, `build`, `preview`, `test`, `test:watch`, `deploy`.
- Configuración de despliegue a GitHub Pages con `gh-pages`.
- `.gitignore` actualizado con `dist/`, `dev-dist/`, `coverage/`.

### ❌ Eliminado
- Dependencias CDN (`<script>` tags de React UMD, Babel, Recharts UMD, etc.).
- Compilación en navegador con `@babel/standalone` (incompatible con producción real).
- Archivos legacy: `src/icons.jsx`, `src/ui.jsx`, `src/charts.jsx`, `src/data.jsx`, `src/view-*.jsx`.

---

## [1.0.0] — 2025-05-14

### ✨ Añadido
- Pantalla de **login** con autenticación por correo institucional `@uta.edu.ec`.
- **Roles diferenciados**: estudiante y docente.
- Sistema de **gestión de tareas** para docentes (crear, listar, eliminar).
- Panel del docente con tabs **Estudiantes** y **Tareas**.
- Notificaciones con `position: fixed` para evitar problemas de z-index.

### 🎨 Cambiado
- **Rediseño completo** a estética dark premium (paleta navy/gold/purple).
- **Hero del dashboard** con avatar de anillo cónico animado.
- Bento grid asimétrica en lugar de columnas tradicionales.
- Podio del ranking con animación spring.
- Anillo SVG de progreso de nivel.
- Glass morphism en sidebar y topbar.

### ⚡ Performance
- `StatCard` y `BadgeCard` migrados de `useState` a clases CSS para hover.
- Eliminados re-renders innecesarios en interacciones del mouse.

### 🐛 Corregido
- Panel de notificaciones ya no se corta bajo otros elementos.
- Nombres largos en stat cards (ej. "Valentina Torres") ya no se cortan.

---

## [0.1.0] — Versión inicial

### ✨ Añadido
- 5 vistas: Dashboard, Ranking, Insignias, Progreso, Docente.
- 15 estudiantes mock con XP, racha e insignias.
- 10 niveles con títulos (Aprendiz → Leyenda).
- 15 insignias en 9 categorías.
- Exportación a Excel y PDF.
- Diseño responsivo con sidebar colapsable.
