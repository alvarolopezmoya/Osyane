# Changelog

Todas las notas de cambios relevantes se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y este proyecto adhiere al [Versionado Semántico](https://semver.org/lang/es/).

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
