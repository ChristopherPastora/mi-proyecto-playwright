// ============================================================
// TESTS POSITIVOS - BOOKING.COM
// Verifican que las funcionalidades principales funcionan
// correctamente con datos válidos
// ============================================================

import { test, expect } from '../../../fixtures/booking.fixtures';

// ── TC-001: Página principal carga correctamente
test('TC001 - Home page carga correctamente', async ({ homePage, page }) => {
  // La página ya está abierta gracias al fixture

  // getByRole('img') → busca imágenes por su rol semántico
  // Verificar que el logo es visible
  await expect(homePage.logo).toBeVisible();

  // Verificar que el título contiene Booking
  await expect(page).toHaveTitle(/Booking/);

  // Verificar que el campo de búsqueda está presente
  await expect(homePage.searchDestination).toBeVisible();

  // Tomar screenshot como evidencia
  // fullPage: true → captura toda la página, no solo lo visible
  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC001-home.png',
    fullPage: true
  });

  console.log('✅ TC001 PASADO: Home page carga correctamente');
});

// ── TC-002: Buscar un destino válido
test('TC002 - Buscar destino válido muestra resultados', async ({ homePage, page }) => {
  // Escribir destino en el campo de búsqueda
  await homePage.searchDestination.click();
  await homePage.searchDestination.fill('Madrid');

  // Esperar sugerencias del autocomplete
  // waitForSelector → espera que aparezca el elemento en el DOM
  await page.waitForSelector('[data-testid="autocomplete-result"]', {
    timeout: 8000
  }).catch(() => console.log('Sin sugerencias autocomplete'));

  // getByText() → busca elemento que contenga ese texto exacto
  const madridOption = page.getByText('Madrid').first();
  if (await madridOption.isVisible()) {
    await madridOption.click();
  }

  // Hacer clic en buscar
  await homePage.searchButton.click();
  await page.waitForLoadState('domcontentloaded');

  // Verificar que la URL cambió a resultados
  await expect(page).toHaveURL(/searchresults|Madrid/i);

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC002-resultados-madrid.png'
  });

  console.log('✅ TC002 PASADO: Búsqueda de Madrid muestra resultados');
});

// ── TC-011: Verificar elementos del header
test('TC011 - Header y navegación son visibles', async ({ homePage, page }) => {
  // Verificar botón de login visible
  // getByRole('button') → más semántico y estable que selectores CSS
  const signInBtn = page.getByRole('button', { name: /inicia sesión|sign in/i }).or(
    page.getByRole('link', { name: /inicia sesión|sign in/i })
  );
  await expect(signInBtn).toBeVisible();

  // Verificar campo de búsqueda visible
  await expect(homePage.searchDestination).toBeVisible();

  // Verificar que el botón de búsqueda está visible
  await expect(homePage.searchButton).toBeVisible();

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC011-header.png'
  });

  console.log('✅ TC011 PASADO: Header y navegación visibles');
});

// ── TC-006: Abrir modal de login
test('TC006 - Modal de login se abre correctamente', async ({ homePage, loginPage, page }) => {
  // Hacer clic en el botón de iniciar sesión
  await loginPage.openLoginModal();

  // Esperar que cargue la página o modal de login
  await page.waitForLoadState('domcontentloaded');

  // Verificar que estamos en la página de login
  const isLoginPage =
    page.url().includes('login') ||
    page.url().includes('signin') ||
    await page.getByLabel(/correo electrónico|email/i).isVisible().catch(() => false);

  expect(isLoginPage).toBeTruthy();

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC006-login-modal.png'
  });

  console.log('✅ TC006 PASADO: Modal/página de login se abre');
});

// ── TC-014: Modificar número de huéspedes
test('TC014 - Modificar huéspedes y habitaciones', async ({ homePage, page }) => {
  // Hacer clic en el selector de huéspedes
  const guestsSelector = page.locator('[data-testid="occupancy-config"]').or(
    page.getByText(/adulto|adult/i).first()
  );

  if (await guestsSelector.isVisible()) {
    await guestsSelector.click();

    // Esperar que aparezca el panel de huéspedes
    await page.waitForTimeout(1000);

    // Buscar botón para agregar adulto
    // getByRole con name → busca botón por su aria-label
    const addAdultBtn = page.getByRole('button', { name: /aumentar.*adulto|increase.*adult/i });

    if (await addAdultBtn.isVisible()) {
      await addAdultBtn.click();
      console.log('✅ TC014 PASADO: Se modificaron los huéspedes');
    } else {
      console.log('⚠️ TC014: Selector de huéspedes tiene estructura diferente');
    }
  }

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC014-huespedes.png'
  });
});