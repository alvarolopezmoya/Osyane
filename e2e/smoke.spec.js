import { test, expect } from '@playwright/test';

// Helpers ────────────────────────────────────────────────────────────────────
async function freshSession(page) {
  await page.goto('/');
  await page.evaluate(() => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('osyane:'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
  });
  await page.reload();
  // Esperar a que la pantalla de login esté lista (el formulario aparece).
  await expect(page.getByPlaceholder('usuario@uta.edu.ec')).toBeVisible();
}

async function loginAsStudent(page, name = /Osyan Granda/) {
  await page.getByRole('button', { name }).click();
  // Esperar a que cargue el dashboard (chunk lazy).
  await expect(page.locator('h1.head', { hasText: 'Osyan Granda' })).toBeVisible({ timeout: 10_000 });
}

async function loginAsTeacher(page, name = /Dr\. Carlos Pinto/) {
  await page.getByRole('button', { name }).click();
  await expect(page.getByRole('heading', { name: 'Panel del Docente' })).toBeVisible({ timeout: 10_000 });
}

test.beforeEach(async ({ page }) => {
  await freshSession(page);
});

// ── Login ────────────────────────────────────────────────────────────────────
test.describe('Login', () => {
  test('rechaza credenciales inválidas', async ({ page }) => {
    await page.getByPlaceholder('usuario@uta.edu.ec').fill('inexistente@uta.edu.ec');
    await page.getByPlaceholder('••••••••').fill('mal');
    // Usar el botón submit explícitamente (no el botón SSO disabled).
    await page.getByRole('button', { name: 'Ingresar →' }).click();
    await expect(page.getByText(/incorrecto|inv[aá]lid/i)).toBeVisible();
  });

  test('estudiante entra con quick-login y ve su dashboard', async ({ page }) => {
    await loginAsStudent(page);
  });

  test('docente entra y aterriza en el panel del docente', async ({ page }) => {
    await loginAsTeacher(page);
  });
});

// ── Flujo crítico: entrega → aprobación → +XP ────────────────────────────────
test.describe('Flujo entrega → aprobación → XP', () => {
  test('estudiante entrega, docente aprueba, recibe +XP', async ({ page }) => {
    // 1. Estudiante entra ────────────────────────────────────────────────────
    await loginAsStudent(page);

    // Ir a "Tareas" desde la sidebar (botón con icono + label "Tareas").
    await page.locator('aside button', { hasText: 'Tareas' }).click();
    await expect(page.getByRole('heading', { name: 'Mis tareas' })).toBeVisible({ timeout: 10_000 });

    // Click en "Entregar" de la primera tarea.
    await page.getByRole('button', { name: /^Entregar$/ }).first().click();

    // Modal de entrega abierto.
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByPlaceholder(/Resumen|enlace al repo/i).fill('https://github.com/test/api-rest');
    await page.getByRole('button', { name: /Enviar entrega/i }).click();

    // El badge "En revisión" o "Entregada · pendiente" debe aparecer.
    await expect(page.getByText(/En revisi[oó]n|Entregada/i).first()).toBeVisible();

    // 2. Logout y entrar como docente ────────────────────────────────────────
    await page.getByRole('button', { name: /Cerrar sesión/i }).click();
    await expect(page.getByPlaceholder('usuario@uta.edu.ec')).toBeVisible();
    await loginAsTeacher(page);

    // Ir a la pestaña "Entregas".
    await page.getByRole('button', { name: /Entregas/ }).click();

    // Aprobar la entrega.
    await page.getByRole('button', { name: /Aprobar/i }).first().click();

    // Toast de XP otorgado.
    await expect(page.getByText(/XP otorgado/i)).toBeVisible({ timeout: 5_000 });
  });
});

// ── Atajos de teclado y accesibilidad ────────────────────────────────────────
test.describe('Atajos y a11y', () => {
  test('Ctrl+K abre la paleta de comandos', async ({ page }) => {
    await loginAsStudent(page);
    // Enfoque inicial al body por si Playwright lo perdió.
    await page.locator('body').click();
    await page.keyboard.press('Control+KeyK');
    await expect(page.getByPlaceholder(/Buscar comando/i)).toBeVisible({ timeout: 5_000 });
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder(/Buscar comando/i)).toBeHidden();
  });

  test('Escape cierra modales (Nueva tarea del docente)', async ({ page }) => {
    await loginAsTeacher(page);
    // Tab "Tareas (N)".
    await page.getByRole('button', { name: /^Tareas \(/ }).click();
    // Botón "Nueva tarea" en el header.
    await page.getByRole('button', { name: /Nueva tarea/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('toggle de tema persiste en localStorage', async ({ page }) => {
    await loginAsStudent(page);
    const themeBefore = await page.evaluate(() => localStorage.getItem('osyane:theme'));
    // El botón tiene aria-label "Modo claro" o "Modo oscuro" según estado.
    await page.getByRole('button', { name: /^Modo (claro|oscuro)$/ }).click();
    // Esperar a que el efecto del state se aplique.
    await page.waitForFunction((before) => {
      try { return localStorage.getItem('osyane:theme') !== before; } catch { return false; }
    }, themeBefore);
    const themeAfter = await page.evaluate(() => localStorage.getItem('osyane:theme'));
    expect(themeAfter).not.toBe(themeBefore);
  });
});
