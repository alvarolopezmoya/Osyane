# Osyane · Sistema de Gamificación Académica

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-2-6e9f18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/PWA-installable-5a0fc8?logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/i18n-es%20%2F%20en-22c55e" alt="i18n" />
  <img src="https://img.shields.io/badge/license-MIT-f5a623" alt="License: MIT" />
  <img src="https://img.shields.io/badge/version-2.0-4f8ef7" alt="Version 2.0" />
</p>

> **Plataforma web de gamificación educativa** para la Facultad de Ingeniería en Sistemas, Electrónica e Industrial (FISEI) de la Universidad Técnica de Ambato (UTA).

Osyane convierte el rendimiento académico de los estudiantes en una experiencia tipo videojuego: niveles, puntos de experiencia (XP), insignias, rachas y rankings. Profesores pueden otorgar XP, conceder insignias y publicar tareas; los estudiantes ven su progreso, compiten en el ranking del grupo y desbloquean logros.

🔗 **Demo en vivo:** _(añade tu URL de GitHub Pages aquí tras hacer deploy)_

---

## 📑 Tabla de contenidos

1. [Visión general](#-visión-general)
2. [Características principales](#-características-principales)
3. [Stack técnico](#-stack-técnico)
4. [Estructura del proyecto](#-estructura-del-proyecto)
5. [Cómo ejecutarlo](#-cómo-ejecutarlo)
6. [Credenciales de acceso](#-credenciales-de-acceso)
7. [Roles y permisos](#-roles-y-permisos)
8. [Vistas de la aplicación](#-vistas-de-la-aplicación)
9. [Sistema de niveles y XP](#-sistema-de-niveles-y-xp)
10. [Sistema de insignias](#-sistema-de-insignias)
11. [Diseño visual](#-diseño-visual)
12. [Arquitectura técnica](#-arquitectura-técnica)
13. [Limitaciones actuales](#-limitaciones-actuales)
14. [Próximos pasos](#-próximos-pasos)

---

## 🎯 Visión general

**Problema que resuelve.** La motivación intrínseca de los estudiantes universitarios suele decaer durante el semestre. Las plataformas tradicionales (Moodle, calificaciones en hoja) son funcionales pero poco atractivas y no premian la constancia ni el esfuerzo continuo.

**Solución.** Osyane introduce mecánicas de juego para que las actividades académicas se sientan como una progresión:

- Cada entrega, foro o examen otorga **XP**.
- Los XP acumulados desbloquean **niveles** con títulos (de Aprendiz a Leyenda).
- Logros específicos otorgan **insignias** coleccionables (raras y comunes).
- La actividad consecutiva genera una **racha 🔥** que motiva visitas diarias.
- Un **ranking** del grupo crea sana competencia.

**Audiencia.** Estudiantes y docentes de Ingeniería en Software · FISEI · UTA.

---

## ✨ Características principales

### Para estudiantes
- 🏠 **Dashboard personal** con hero animado, estadísticas clave y feed de actividad reciente.
- 📋 **Mis tareas** — listado con contador hasta el deadline, entregas con nota opcional y **auto-XP al aprobar**.
- 🏆 **Ranking del grupo** con podio animado, búsqueda y comparativa de competencias.
- 🏅 **Galería de insignias** con filtros por categoría, raras destacadas y vista de detalle.
- 📊 **Vista de progreso** con anillo de nivel, calendario de constancia de 70 días, gráficos de XP semanal y comparativa de notas vs. promedio del grupo.
- 🔔 **Notificaciones** sobre XP ganado, insignias y cambios en el ranking.
- 👤 **Perfil propio** accesible desde cualquier vista.

### Para docentes
- 👨‍🏫 **Panel del docente** con vista completa del grupo.
- ➕ **Otorgar XP** con valores rápidos (25, 50, 100, 150, 200, 300) o personalizados, incluyendo motivo.
- 🏅 **Conceder insignias** desde un selector visual.
- 📋 **Gestión de tareas**: crear, listar y eliminar tareas con título, descripción, asignatura, fecha límite y XP de recompensa.
- ✅ **Revisar entregas**: aprobar (otorga XP automáticamente) o rechazar (el alumno puede reintentar).
- 📊 **Exportar reportes** a Excel (XLSX) y PDF imprimible.
- 👁️ **Anonimizar nombres** del ranking para compartir capturas públicas.

### Comunes
- 🌒 **Diseño dark premium** con efectos de glassmorphism, gradientes y micro-animaciones.
- 📱 **Responsivo**: sidebar colapsable en desktop, barra inferior en mobile.
- 🌗 **Tema claro / oscuro** con toggle persistente.
- 🌐 **i18n** español / inglés con autodetección del navegador.
- 💾 **Persistencia local**: tu progreso se mantiene entre sesiones.
- 📲 **PWA instalable** con soporte offline básico vía service worker.

---

## 🛠 Stack técnico

| Capa            | Tecnología                                              |
| --------------- | ------------------------------------------------------- |
| UI Framework    | **React 18.3.1** (ESM)                                  |
| Bundler         | **Vite 6** + `@vitejs/plugin-react`                     |
| PWA             | **vite-plugin-pwa** (service worker + precache offline) |
| Estilos         | **CSS** (sin framework) con design tokens y data-theme  |
| Gráficos        | **Recharts 2.12**                                       |
| Exportación     | **SheetJS (xlsx)**                                      |
| Tests           | **Vitest 2** + `jsdom`                                  |
| i18n            | Custom context (es / en, autodetect navegador)          |
| Persistencia    | `localStorage` (estudiantes, tareas, entregas, tema, idioma, sesión) |
| Tipografías     | Inter, Plus Jakarta Sans, JetBrains Mono (Google Fonts) |

---

## 📁 Estructura del proyecto

```
Osyane_v2/
├── index.html                ← Entry HTML (Vite)
├── vite.config.js            ← Build, PWA, code-splitting, Vitest config
├── package.json              ← Scripts: dev / build / preview / test / deploy
├── public/
│   └── assets/uta-logo.jpg
├── src/
│   ├── main.jsx              ← Entry point (StrictMode + Providers)
│   ├── App.jsx               ← Shell: login, sidebar, topbar, router de vistas
│   ├── store.jsx             ← Estado global con localStorage persistence
│   ├── data.js               ← Datos semilla (mock)
│   ├── styles.css            ← CSS global + tokens + tema claro/oscuro
│   ├── components/
│   │   ├── ds.js             ← Design tokens y switch de tema
│   │   ├── UI.jsx            ← Avatar, XPBar, StatCard, Modal, Toast, Btn…
│   │   ├── Icons.jsx         ← Librería de iconos SVG inline
│   │   └── Charts.jsx        ← Recharts wrappers
│   ├── utils/
│   │   ├── levels.js         ← getLevelInfo (pura, testeada)
│   │   ├── ranking.js        ← buildLeaderboard, findRank
│   │   ├── tasks.js          ← validateTask, daysUntilDeadline, isOverdue…
│   │   └── storage.js        ← localStorage helpers + usePersistedState
│   ├── i18n/
│   │   ├── index.jsx         ← Provider con detección automática
│   │   ├── es.js             ← Español
│   │   └── en.js             ← Inglés
│   ├── services/
│   │   ├── api.js            ← Stub local + TODO[BACKEND] para Firebase/Supabase
│   │   ├── auth.js           ← Login local + TODO[SSO] para MSAL/Azure AD UTA
│   │   └── notifications.js  ← EventEmitter + TODO[REALTIME] para WS/SSE
│   └── views/
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── Leaderboard.jsx
│       ├── Badges.jsx
│       ├── Progress.jsx
│       ├── StudentTasks.jsx  ← NUEVO: tareas del estudiante con entregas y auto-XP
│       └── Teacher.jsx       ← Tabs: Estudiantes / Tareas / Entregas
└── tests/
    ├── levels.test.js        ← 11 tests
    ├── ranking.test.js       ← 8 tests
    └── tasks.test.js         ← 20 tests
```

---

## 🚀 Cómo ejecutarlo

### Requisitos
- **Node.js ≥ 20** y **npm ≥ 10**.

### Instalación

```bash
git clone https://github.com/alvarolopezmoya/Osyane.git
cd Osyane
npm install
```

### Desarrollo

```bash
npm run dev          # arranca Vite en http://localhost:5173 con HMR
```

### Producción

```bash
npm run build        # genera dist/ optimizado (~290 KB gzipped)
npm run preview      # sirve dist/ localmente para probar el build
```

### Tests

```bash
npm test             # corre los 39 tests con Vitest
npm run test:watch   # modo watch para TDD
```

### Deploy a GitHub Pages

```bash
# Si el repo se aloja en https://USUARIO.github.io/Osyane/:
VITE_BASE=/Osyane/ npm run build
npm run deploy       # publica dist/ a la rama gh-pages
```

Luego en **Settings → Pages → Source** elige `gh-pages` branch. Alternativamente, configura un workflow de GitHub Actions que ejecute `npm run build` y suba `dist/` con `actions/deploy-pages`.

---

## 🔑 Credenciales de acceso

El sistema valida correos institucionales `@uta.edu.ec` contra una lista mock.

**Contraseña universal para demo:** `osyane` (también acepta `1234`).

### Docentes (acceso al panel administrativo)

| Nombre               | Correo                        |
| -------------------- | ----------------------------- |
| Dr. Carlos Pinto     | `cpinto@uta.edu.ec`           |
| Ing. María Salinas   | `msalinas@uta.edu.ec`         |

### Estudiantes (acceso a vistas de progreso)

| Nombre                | Correo                          |
| --------------------- | ------------------------------- |
| Osyan Granda          | `ogranda8821@uta.edu.ec`        |
| Valentina Torres      | `vtorres5543@uta.edu.ec`        |
| Sebastián Mora        | `smora6612@uta.edu.ec`          |
| Camila Reyes          | `creyes7731@uta.edu.ec`         |
| Diego Almeida         | `dalmeida4423@uta.edu.ec`       |
| …y 10 más             | (ver `src/data.js`)             |

El login también muestra **botones de acceso rápido** que rellenan automáticamente el formulario.

---

## 👥 Roles y permisos

Osyane diferencia dos roles. El rol se determina en el login según si el correo está en la lista `TEACHERS` o `STUDENTS` de `src/data.js`.

| Capacidad                          | Estudiante | Docente |
| ---------------------------------- | :--------: | :-----: |
| Ver Dashboard, Ranking, Insignias, Progreso | ✅         | ❌       |
| Ver mis tareas y entregarlas       | ✅         | ❌       |
| Ver panel del Docente              | ❌         | ✅       |
| Otorgar XP a estudiantes           | ❌         | ✅       |
| Conceder insignias                 | ❌         | ✅       |
| Crear / eliminar tareas            | ❌         | ✅       |
| Aprobar / rechazar entregas        | ❌         | ✅       |
| Exportar reportes (Excel / PDF)    | ❌         | ✅       |
| Anonimizar nombres del ranking     | ❌         | ✅       |
| Cambiar tema y idioma              | ✅         | ✅       |
| Notificaciones                     | ✅         | ✅       |

**Implementación.** En `src/services/auth.js`, `loginLocal()` busca en `TEACHERS` primero, luego en `STUDENTS`. La sidebar filtra `NAV_ITEMS` por rol (`role: 'student' | 'teacher' | 'both'`).

---

## 🖼 Vistas de la aplicación

### 1 · Dashboard
- **Hero card** con avatar de anillo cónico giratorio, nivel actual, racha, barra de XP al siguiente nivel y XP total en gradiente dorado.
- **4 stat cards**: XP total, ranking global, racha, insignias.
- **Bento grid** asimétrica:
  - Actividad reciente (abarca 2 filas)
  - Próximos logros con barras de progreso por meta
  - Mini-ranking (top 5)
  - Tira horizontal de insignias con hover scale
  - Progreso por asignatura (5 materias)

### 2 · Ranking
- **Podio animado** con pilares que crecen con animación spring (gold/silver/bronze).
- **Tabla del grupo** con búsqueda, hover row, nombres anonimizables.
- **Radar de competencias** (Algoritmos, BD, POO, Redes, Matemáticas, Soft Skills).
- **Barras de dominio por área** con marcador del promedio del grupo.

### 3 · Insignias
- 3 stat cards: obtenidas, XP de insignias, raras.
- **Filtro por categoría** (Inicio, Constancia, Excelencia, Estudio, Social, Ranking, Especial, Técnico, Progreso).
- 2 secciones: ✅ Obtenidas (con glow dorado) · 🔒 Por desbloquear (atenuadas).
- **Modal de detalle** con descripción, categoría y XP de recompensa.

### 4 · Progreso
- 5 stat cards (XP acumulado, promedio semanal, mejor semana, nivel, nota promedio).
- **Anillo SVG circular** de progreso al siguiente nivel.
- **Calendario de constancia** estilo GitHub (10 semanas × 7 días) con 3 niveles de intensidad.
- **4 tabs** con gráficos:
  - XP semanal (área chart)
  - XP por asignatura (barras + barras de progreso)
  - Calificaciones vs. promedio
  - Tabla de niveles con título y rango de XP

### 5 · Tareas (solo estudiantes) — **NUEVA**
- 4 stat cards: Tareas activas, XP obtenido, XP por ganar, Vencidas.
- Búsqueda + filtros por estado (Todas / Pendientes / Entregadas / Aprobadas / Vencidas).
- Cada tarea muestra **contador color-coded** hasta el deadline (rojo ≤ 2 d, dorado ≤ 7 d).
- Botón **Entregar** abre modal con nota/enlace opcional. Estado pasa a "En revisión".
- Al aprobar el docente, el estudiante recibe **+XP automático** + notificación + toast.
- Si la entrega es rechazada, aparece botón **Reintentar**.

### 6 · Panel del Docente (solo profesores)
- Header con exportación a Excel/PDF y botón de nueva tarea.
- 5 stat cards (Estudiantes, XP promedio, Líder, Tareas, XP total del grupo).
- **3 pestañas**:
  - **Estudiantes**: tabla con búsqueda, botones `+XP` y `🏅` por fila.
  - **Tareas**: grid de cards con accent bar por asignatura, deadline con alerta a < 3 días, eliminar.
  - **Entregas**: lista de entregas pendientes con botones Aprobar / Rechazar (con badge de contador).
- **3 modales**: Otorgar XP, Otorgar insignia, Nueva tarea (con validación completa).

---

## 🆙 Sistema de niveles y XP

Definido en `src/utils/levels.js` → `LEVELS`. Los rangos son acumulativos:

| Nivel | Título         | XP requerido       |
| :---: | -------------- | ------------------ |
| 1     | Aprendiz       | 0 – 500            |
| 2     | Explorador     | 500 – 1 200        |
| 3     | Analista       | 1 200 – 2 200      |
| 4     | Desarrollador  | 2 200 – 3 500      |
| 5     | Arquitecto     | 3 500 – 5 200      |
| 6     | Ingeniero      | 5 200 – 7 200      |
| 7     | Especialista   | 7 200 – 9 800      |
| 8     | Experto        | 9 800 – 13 000     |
| 9     | Maestro        | 13 000 – 17 000    |
| 10    | Leyenda        | 17 000 – ∞         |

La función `getLevelInfo(xp)` devuelve `{ n, title, min, max, progress }` para cualquier cantidad de XP.

---

## 🏅 Sistema de insignias

15 insignias en 9 categorías. Las marcadas como `rare: true` muestran un tag morado **RARO** cuando se obtienen.

| Categoría     | Insignias                                          |
| ------------- | -------------------------------------------------- |
| Inicio        | Primera Llama 🔥                                    |
| Constancia    | Velocista ⚡, Racha x7 🔁, Constancia 🏅              |
| Excelencia    | Precisión 🎯★, Innovador 💡★, Analítico 📊            |
| Estudio       | Ratón de Biblioteca 📚                              |
| Social        | Colaborador 🤝                                      |
| Ranking       | Top 3 🏆★                                           |
| Especial      | Estrella del Mes 🌟★, Global 🌍★                     |
| Técnico       | Lanzamiento 🚀★, Resolvedor 🧩                       |
| Progreso      | Graduado 🎓★                                        |

★ = insignia rara

Cada insignia define `xp` de recompensa (50 – 400) y se almacena en el array `earnedBadges` del estudiante.

---

## 🎨 Diseño visual

**Filosofía.** Dark premium con acentos de luz tipo terminal/dashboard pro. Inspirado en Linear, Vercel y dashboards de Stripe.

### Paleta de colores

| Token        | Hex                              | Uso                         |
| ------------ | -------------------------------- | --------------------------- |
| `--bg`       | `#060912`                        | Fondo de la app             |
| `--bg-card`  | `#0b1121`                        | Cards y contenedores        |
| `--blue`     | `#4f8ef7`                        | Acento primario, navegación |
| `--gold`     | `#f5a623`                        | XP, logros, métricas        |
| `--green`    | `#0fd9a0`                        | Éxito, indicadores vivos    |
| `--purple`   | `#a78bfa`                        | Rol docente, raras          |
| `--red`      | `#f43f5e`                        | Errores, deadlines críticos |
| `--t1 / t2`  | `#e8edf8` / `#5a6a8a`            | Texto principal / secundario |

### Tipografía

- **Plus Jakarta Sans** — encabezados, marca, títulos de cards (`.head`)
- **Inter** — texto de UI por defecto
- **JetBrains Mono** — números, XP, IDs, badges (`.num`)

### Efectos visuales

- **Glassmorphism** en sidebar y topbar (`backdrop-filter: blur(20–24px)`).
- **Mesh ambient background** con 3 radial-gradients animados en `body::before`.
- **Animaciones**: `rise-in`, `float-up` (entrada escalonada con clases `.d1`–`.d6`), `xpShine`, `orb-float`, `spin-slow`, `pulse`.
- **Gradient text** dorado/azul vía `background-clip: text`.
- **Hover effects** en cards: lift `translateY(-3px)` + box-shadow más profunda + border-color realzado, todo en CSS (sin re-renders de React).

---

## 🏗 Arquitectura técnica

### Estado global

`src/store.jsx` expone `AppProvider` y `useApp()` con **React Context API**. Los slices persistentes usan el hook `usePersistedState` de `src/utils/storage.js`, que es un `useState` espejado a `localStorage` con tolerancia a fallos (quota, modo privado).

```js
const [students, setStudents]   = usePersistedState('students', STUDENTS);
const [tasks, setTasks]         = usePersistedState('tasks', INITIAL_TASKS);
const [submissions, setSubsions]= usePersistedState('submissions', []);
const [theme, setThemeState]    = usePersistedState('theme', 'dark');
```

### Flujo de entrega → auto-XP

1. Estudiante abre `StudentTasks` y clica **Entregar** → `submitTask(taskId, studentId, note)` crea un submission con `status: 'submitted'`.
2. Docente abre la pestaña **Entregas** y clica **Aprobar** → `approveSubmission(id)` marca `status: 'approved'` y, en un microtask, llama a `awardXp(studentId, task.xp, 'Tarea X aprobada')`.
3. `awardXp` actualiza el XP del estudiante, dispara una notificación (`pushNotif`), un toast (`showToast`) y emite el evento `xp.awarded` en `services/notifications.js` para suscriptores externos (TODO: WS/SSE).

### i18n

- `useI18n()` devuelve `{ t, locale, setLocale }`.
- `t('clave.anidada', { vars })` con interpolación `{name}` y fallback a español si la clave no existe.
- Idioma persistido y autodetección por `navigator.language`.

### Servicios (stubs)

Tres archivos en `src/services/` documentan dónde conectar producción real:
- **`api.js`** — `fetchStudents` / `saveTasks` / `fetchSubmissions` etc. usan `localStorage` hoy; cada función tiene un bloque `TODO[BACKEND]` describiendo cómo mapearla a Firebase, Supabase o Express + SQLite.
- **`auth.js`** — `loginLocal()` valida contra datos mock; bloque `TODO[SSO]` indica los pasos exactos para conectar MSAL/Azure AD contra el tenant `@uta.edu.ec`.
- **`notifications.js`** — `subscribe()` / `emit()` con event emitter local; bloque `TODO[REALTIME]` muestra cómo migrar a WebSocket o Server-Sent Events.

---

## 🧪 Tests

39 tests en `tests/` ejecutados con Vitest + jsdom:

| Suite                | Cubre                                                            |
| -------------------- | ---------------------------------------------------------------- |
| `levels.test.js`     | `getLevelInfo` (bordes, NaN, niveles extremos, continuidad).     |
| `ranking.test.js`    | `buildLeaderboard` (orden, ranks, inmutabilidad, empates), `findRank`. |
| `tasks.test.js`      | `validateTask`, `daysUntilDeadline`, `isOverdue`, `canSubmit`.    |

```bash
npm test
# Test Files  3 passed (3)
# Tests       39 passed (39)
```

---

## ⚠ Limitaciones actuales

- **Backend simulado con `localStorage`**. Los datos persisten **localmente por navegador**, no entre usuarios. Para multi-usuario real ver `TODO[BACKEND]` en `src/services/api.js`.
- **Login local**. Cualquier estudiante o docente entra con `osyane` / `1234`. Para OAuth UTA ver `TODO[SSO]` en `src/services/auth.js`.
- **Notificaciones sin transporte realtime**. Hoy son in-memory + persistencia local. Para WS/SSE ver `TODO[REALTIME]` en `src/services/notifications.js`.

---

## 🔮 Roadmap (v2.0 — entregado vs. pendiente)

### ✅ Entregado en v2.0
- [x] **Persistencia con `localStorage`** para que el progreso se mantenga entre sesiones.
- [x] **Vista de tareas para estudiantes** con entregas, contador hasta deadline y auto-otorgación de XP al aprobar.
- [x] **Bundle con Vite** para producción: ~290 KB gzipped + PWA instalable + service worker.
- [x] **Modo claro** opcional con toggle en topbar (persiste).
- [x] **Tests** con Vitest: 39 tests cubriendo `getLevelInfo`, ranking, validaciones de tareas y deadlines.
- [x] **i18n**: soporte multilenguaje (es / en) con autodetección y selector en topbar.

### 🚧 Pendiente (con stubs documentados)
- [ ] **Backend ligero** (Firebase, Supabase o Express + SQLite) para multi-usuario real — ver `TODO[BACKEND]` en `src/services/api.js`.
- [ ] **Auth con UTA SSO** (OAuth contra `@uta.edu.ec` vía Azure AD / MSAL) — ver `TODO[SSO]` en `src/services/auth.js`.
- [ ] **Notificaciones reales** vía WebSocket o Server-Sent Events — ver `TODO[REALTIME]` en `src/services/notifications.js`.

---

## 📄 Licencia

Este proyecto está licenciado bajo **MIT** — ver el archivo [LICENSE](LICENSE) para más detalles.

Proyecto académico desarrollado para FISEI · Universidad Técnica de Ambato.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Lee la [guía de contribución](CONTRIBUTING.md) antes de enviar un PR.

## 📜 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para historial de versiones.

---

**Desarrollado por** Osyan Granda · FISEI · UTA · 2025-A
