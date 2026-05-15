# Osyane · Sistema de Gamificación Académica

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Recharts-2.12-22c55e" alt="Recharts" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/license-MIT-f5a623" alt="License: MIT" />
  <img src="https://img.shields.io/badge/status-MVP-4f8ef7" alt="Status: MVP" />
  <img src="https://img.shields.io/badge/build-no_bundler-a78bfa" alt="No bundler" />
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
- 🏆 **Ranking del grupo** con podio animado, búsqueda y comparativa de competencias.
- 🏅 **Galería de insignias** con filtros por categoría, raras destacadas y vista de detalle.
- 📊 **Vista de progreso** con anillo de nivel, calendario de constancia de 70 días, gráficos de XP semanal y comparativa de notas vs. promedio del grupo.
- 🔔 **Notificaciones en tiempo real** sobre XP ganado, insignias y cambios en el ranking.
- 👤 **Perfil propio** accesible desde cualquier vista.
- 🔒 **Modo anónimo** para ocultar nombres de la mitad inferior del ranking.

### Para docentes
- 👨‍🏫 **Panel del docente** con vista completa del grupo.
- ➕ **Otorgar XP** con valores rápidos (25, 50, 100, 150, 200, 300) o personalizados, incluyendo motivo.
- 🏅 **Conceder insignias** desde un selector visual.
- 📋 **Gestión de tareas**: crear, listar y eliminar tareas con título, descripción, asignatura, fecha límite y XP de recompensa.
- 📊 **Exportar reportes** a Excel (XLSX) y PDF imprimible.
- 👁️ **Anonimizar nombres** del ranking para compartir capturas públicas.

### Comunes
- 🌒 **Diseño dark premium** con efectos de glassmorphism, gradientes y micro-animaciones.
- 📱 **Responsivo**: sidebar colapsable en desktop, barra inferior en mobile.
- ⚡ **Sin servidor**: corre 100% en el navegador, datos en memoria.

---

## 🛠 Stack técnico

| Capa             | Tecnología                                         |
| ---------------- | -------------------------------------------------- |
| UI Framework     | **React 18.3.1** (vía CDN, sin bundler)            |
| Transpilación    | **Babel Standalone 7.29.0** (JSX in-browser)       |
| Estilos          | **CSS personalizado** + **Tailwind v4** (CDN)      |
| Gráficos         | **Recharts 2.12.7**                                |
| Exportación      | **SheetJS (xlsx)**                                 |
| Tipografías      | Inter, Plus Jakarta Sans, JetBrains Mono (Google Fonts) |
| Empaquetado      | **Ninguno** — archivos `.jsx` cargados directamente con `<script type="text/babel">` |

---

## 📁 Estructura del proyecto

```
osyanne/
├── index.html                 ← Shell HTML, tokens CSS globales, animaciones
├── manifest.json              ← Web manifest (PWA-ready)
├── assets/
│   └── uta-logo.jpg
└── src/
    ├── data.jsx               ← Datos mock: estudiantes, docentes, insignias, niveles, tareas
    ├── icons.jsx              ← Librería de iconos SVG inline
    ├── ui.jsx                 ← Tokens DS + componentes (Avatar, XPBar, StatCard, BadgeCard, Btn, Modal…)
    ├── charts.jsx             ← Gráficos Recharts (área, barras, radar, sparklines, progress bars)
    ├── store.jsx              ← Estado global (Context API): login, students, tasks, notifications, role
    ├── app.jsx                ← AppShell: login, sidebar, topbar, router de vistas
    ├── view-dashboard.jsx     ← Vista 1 — Dashboard con bento grid
    ├── view-leaderboard.jsx   ← Vista 2 — Ranking con podio animado
    ├── view-badges.jsx        ← Vista 3 — Galería de insignias
    ├── view-progress.jsx      ← Vista 4 — Progreso, niveles y notas
    └── view-teacher.jsx       ← Vista 5 — Panel docente (XP, insignias, tareas)
```

---

## 🚀 Cómo ejecutarlo

### Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/osyanne.git
cd osyanne
```

Como Osyane no requiere build, basta con servir los archivos por HTTP (los `<script type="text/babel">` no funcionan abriendo `index.html` directamente desde el sistema de archivos por restricciones CORS de Babel).

### Opción 1 · Con npm (recomendado)
```bash
npm start
```
Abre automáticamente en [http://localhost:8080](http://localhost:8080).

### Opción 2 · Servidor estático con Python
```bash
python3 -m http.server 8080
```
Luego abre [http://localhost:8080](http://localhost:8080).

### Opción 3 · VS Code
Instala la extensión **Live Server** y haz clic derecho sobre `index.html` → *Open with Live Server*.

### Deploy a GitHub Pages
El repo incluye un workflow listo en `.github/workflows/deploy.yml`. Solo:

1. Ve a **Settings → Pages** en tu repo.
2. En **Source** selecciona **GitHub Actions**.
3. Haz push a `main`. El sitio se publicará en `https://TU_USUARIO.github.io/osyanne/`.

> **Nota.** No hay dependencias a instalar. Todo se carga desde CDNs públicos en `index.html`.

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
| …y 10 más             | (ver `src/data.jsx`)            |

El login también muestra **botones de acceso rápido** que rellenan automáticamente el formulario.

---

## 👥 Roles y permisos

Osyane diferencia dos roles. El rol se determina en el login según si el correo está en la lista `TEACHERS` o `STUDENTS` de `src/data.jsx`.

| Capacidad                          | Estudiante | Docente |
| ---------------------------------- | :--------: | :-----: |
| Ver Dashboard, Ranking, Insignias, Progreso | ✅         | ❌       |
| Ver panel del Docente              | ❌         | ✅       |
| Otorgar XP a estudiantes           | ❌         | ✅       |
| Conceder insignias                 | ❌         | ✅       |
| Crear / eliminar tareas            | ❌         | ✅       |
| Exportar reportes (Excel / PDF)    | ❌         | ✅       |
| Anonimizar nombres del ranking     | ❌         | ✅       |
| Notificaciones                     | ✅         | ✅       |

**Implementación.** En `src/store.jsx`, la función `login()` busca primero en `TEACHERS`. Si encuentra coincidencia, fija `userRole = 'teacher'`. Si no, busca en `STUDENTS` y fija `userRole = 'student'`. La sidebar filtra los items de navegación con `visibleNav = NAV_ITEMS.filter(item => item.id === 'teacher' ? isTeacher : true)`.

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

### 5 · Panel del Docente (solo profesores)
- Header con exportación a Excel/PDF y botón de nueva tarea.
- 5 stat cards (Estudiantes, XP promedio, Líder, Tareas, XP total del grupo).
- **2 pestañas**:
  - **Estudiantes**: tabla con búsqueda, botones `+XP` y `🏅` por fila.
  - **Tareas**: grid de cards con accent bar por asignatura, fecha límite con alerta a < 3 días, botón eliminar.
- **3 modales**: Otorgar XP, Otorgar insignia, Nueva tarea.

---

## 🆙 Sistema de niveles y XP

Definido en `src/data.jsx` → `LEVELS`. Los rangos son acumulativos:

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

Toda la lógica de negocio vive en `src/store.jsx` usando **React Context API**:

```js
const AppContext = React.createContext(null);

function AppProvider({ children }) {
  const [students, setStudents] = useState(STUDENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [userRole, setUserRole] = useState(null);
  // ... login, logout, awardXp, awardBadge, addTask, deleteTask, etc.
}
```

Cualquier componente accede vía `const { ... } = useApp()`.

### Carga de archivos

Por **no usar bundler**, cada archivo `.jsx` exporta sus símbolos a `window` al final:

```js
Object.assign(window, { Avatar, XPBar, StatCard, /* ... */ });
```

Esto permite que cualquier otro archivo cargado posteriormente en `index.html` use los componentes sin importarlos.

### Orden de carga
```
data.jsx → icons.jsx → ui.jsx → charts.jsx → store.jsx → views → app.jsx
```

### Datos persistentes
Actualmente **no hay persistencia**: cerrar el navegador descarta cambios. Para producción habría que integrar `localStorage`, IndexedDB o un backend.

---

## ⚠ Limitaciones actuales

- **Sin backend**. Datos mock en memoria; no hay persistencia entre sesiones.
- **Login simulado**. Cualquier estudiante o docente entra con `osyane` / `1234`. No hay hash, JWT, OAuth ni rate-limiting.
- **Tareas sin entrega**. El docente puede crear tareas pero los estudiantes aún no las ven ni pueden entregarlas.
- **Sin notificaciones push reales**. Las notificaciones son estáticas en `store.jsx`.
- **Carga inicial lenta**. Babel transpila JSX en el browser (~1.5 MB de payload).

---

## 🔮 Próximos pasos

- [ ] **Persistencia con `localStorage`** para que el progreso se mantenga entre sesiones.
- [ ] **Vista de tareas para estudiantes** con entregas, contador hasta deadline y auto-otorgación de XP al aprobar.
- [ ] **Backend ligero** (Firebase, Supabase o Express + SQLite) para multi-usuario real.
- [ ] **Auth con UTA SSO** (OAuth contra `@uta.edu.ec`).
- [ ] **Notificaciones reales** vía WebSocket o Server-Sent Events.
- [ ] **Bundle con Vite** para producción: ~80% menos payload, mejor SEO, PWA instalable.
- [ ] **Modo claro** opcional como Tweak.
- [ ] **Tests**: Vitest para `getLevelInfo`, lógica de ranking, validaciones de tareas.
- [ ] **i18n**: soporte multilenguaje (es / en) para visibilidad internacional.

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
