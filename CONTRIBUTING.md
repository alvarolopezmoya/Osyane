# Guía de contribución

¡Gracias por tu interés en contribuir a **Osyane**! Este documento explica cómo proponer cambios al proyecto.

---

## 🐛 Reportar bugs

1. Verifica que el bug no esté ya reportado en [Issues](../../issues).
2. Abre un nuevo issue usando la plantilla "Bug report" con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs. observado
   - Capturas de pantalla si aplica
   - Navegador y SO

## ✨ Proponer una nueva característica

1. Abre un issue con la etiqueta `enhancement` describiendo:
   - Problema que resuelve
   - Solución propuesta
   - Alternativas consideradas

## 🔧 Enviar un Pull Request

### Setup inicial
```bash
# 1. Fork el repo en GitHub
# 2. Clona tu fork
git clone https://github.com/TU_USUARIO/osyanne.git
cd osyanne

# 3. Crea una rama para tu cambio
git checkout -b feat/mi-nueva-feature
```

### Convenciones de código

**Estilo de commits** (Conventional Commits):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `style:` cambios visuales sin lógica
- `refactor:` reorganización sin cambio de comportamiento
- `docs:` cambios en documentación
- `perf:` mejoras de rendimiento

**JavaScript / JSX:**
- Indentación: 2 espacios
- Comillas: simples para JS, dobles para JSX
- Punto y coma al final de cada línea
- Componentes en `PascalCase`
- Variables y funciones en `camelCase`
- Constantes globales en `SCREAMING_SNAKE_CASE`

**CSS:**
- Usa variables `--token` definidas en `index.html` antes de inventar nuevos colores
- Prefiere clases CSS sobre styles inline para hover/transition (mejor performance)

### Antes de hacer push

- [ ] Verifica que la app cargue sin errores en consola
- [ ] Prueba en Chrome, Firefox y Safari
- [ ] Prueba en mobile (responsive)
- [ ] Si añades datos mock, mantén el formato existente en `src/data.jsx`
- [ ] Si tocas el estado global, actualízalo solo en `src/store.jsx`

### Abrir el PR

1. Push tu rama: `git push origin feat/mi-nueva-feature`
2. Abre un PR contra `main` con:
   - Título corto y descriptivo
   - Descripción de qué cambió y por qué
   - Capturas antes/después si es visual
   - Referencia al issue: `Closes #123`

---

## 🎨 Áreas con mayor necesidad de aportes

- 🌐 **Backend**: Firebase / Supabase para persistencia real
- 🔐 **Auth**: integración con UTA SSO
- ♿ **Accesibilidad**: ARIA labels, navegación por teclado, contraste AA
- 🌍 **i18n**: traducción a inglés
- 📱 **PWA**: service worker, offline-first
- 🧪 **Tests**: Vitest para lógica de negocio

---

## 📞 Contacto

Para dudas, abre un issue con la etiqueta `question` o escribe a `ogranda8821@uta.edu.ec`.

¡Gracias por hacer Osyane mejor! 🎓
