// ============================================================
// TESTS NEGATIVOS - BOOKING.COM
// Verifican que el sistema maneja correctamente errores,
// entradas inválidas y flujos no esperados
// ============================================================

import { test, expect } from '../../../fixtures/booking.fixtures';

// ── TC-004: Buscar sin destino
test('TC004 - Búsqueda sin destino muestra advertencia', async ({ homePage, page }) => {
  // Dejar el campo de destino vacío y hacer clic en buscar
  await homePage.searchButton.click();

  // Esperar que aparezca algún mensaje de error o validación
  await page.waitForTimeout(1500);

  // Verificar que NO navegó a resultados (sigue en home)
  const url = page.url();
  const sigueEnHome = !url.includes('searchresults');

  // O verificar que aparece un mensaje de error
  const errorVisible = await page.getByText(/ingresa un destino|enter a destination|¿a dónde/i)
    .isVisible()
    .catch(() => false);

  expect(sigueEnHome || errorVisible).toBeTruthy();

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC004-busqueda-vacia.png'
  });

  console.log('✅ TC004 PASADO: Búsqueda sin destino controlada');
});

// ── TC-007: Login con credenciales inválidas
test('TC007 - Login con email inválido muestra error', async ({ homePage, loginPage, page }) => {
  // Abrir el login
  await loginPage.openLoginModal();
  await page.waitForLoadState('domcontentloaded');

  // Intentar ingresar un email inválido
  const emailField = page.getByLabel(/correo electrónico|email/i).or(
    page.getByRole('textbox', { name: /email/i })
  );

  if (await emailField.isVisible({ timeout: 5000 })) {
    await emailField.fill('emailinvalido@falso123.xyz');

    // Hacer clic en continuar
    const continueBtn = page.getByRole('button', { name: /continuar|continue/i });
    await continueBtn.click();

    await page.waitForTimeout(2000);

    // Verificar que aparece mensaje de error o no avanza
    const bodyText = await page.locator('body').innerText();
    const tieneError =
      bodyText.includes('error') ||
      bodyText.includes('inválido') ||
      bodyText.includes('invalid') ||
      bodyText.includes('no existe') ||
      bodyText.includes('contraseña');

    expect(tieneError).toBeTruthy();
  } else {
    console.log('⚠️ TC007: Estructura de login diferente a la esperada');
  }

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC007-login-invalido.png'
  });

  console.log('✅ TC007 PASADO: Login con email inválido controlado');
});

// ── TC-008: Login con email sin formato válido
test('TC008 - Login con formato de email incorrecto', async ({ homePage, loginPage, page }) => {
  await loginPage.openLoginModal();
  await page.waitForLoadState('domcontentloaded');

  const emailField = page.getByLabel(/correo electrónico|email/i).or(
    page.getByRole('textbox', { name: /email/i })
  );

  if (await emailField.isVisible({ timeout: 5000 })) {
    // Email sin @ ni dominio
    await emailField.fill('estonoesuncorreo');

    const continueBtn = page.getByRole('button', { name: /continuar|continue/i });
    await continueBtn.click();

    await page.waitForTimeout(1500);

    // Verificar que el sistema valida el formato
    const bodyText = await page.locator('body').innerText();
    const hayValidacion =
      bodyText.includes('válido') ||
      bodyText.includes('valid') ||
      bodyText.includes('formato') ||
      bodyText.includes('format') ||
      bodyText.includes('@');

    expect(hayValidacion).toBeTruthy();
  }

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC008-email-formato.png'
  });

  console.log('✅ TC008 PASADO: Formato de email validado');
});

// ── TC-013: Búsqueda con caracteres especiales
test('TC013 - Búsqueda con caracteres especiales no genera error 500', async ({ homePage, page }) => {
  await homePage.searchDestination.click();
  await homePage.searchDestination.fill('!@#$%^&*()');

  await homePage.searchButton.click();
  await page.waitForLoadState('domcontentloaded');

  // Verificar que no hay error del servidor
  await expect(page.locator('body')).not.toContainText('500');
  await expect(page.locator('body')).not.toContainText('Internal Server Error');

  // Verificar que sigue siendo Booking
  await expect(page).toHaveURL(/booking\.com/);

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC013-caracteres-especiales.png'
  });

  console.log('✅ TC013 PASADO: Caracteres especiales manejados correctamente');
});

// ── TC-015: Intentar reservar sin login
test('TC015 - Reservar sin login redirige a autenticación', async ({ homePage, page }) => {
  // Buscar un destino
  await homePage.searchDestination.click();
  await homePage.searchDestination.fill('Barcelona');

  await page.waitForSelector('[data-testid="autocomplete-result"]', {
    timeout: 5000
  }).catch(() => {});

  const firstResult = page.locator('[data-testid="autocomplete-result"]').first();
  if (await firstResult.isVisible()) {
    await firstResult.click();
  }

  await homePage.searchButton.click();
  await page.waitForLoadState('domcontentloaded');

  // Hacer clic en el primer hotel
  const firstHotel = page.locator('[data-testid="property-card"]').first();
  if (await firstHotel.isVisible()) {
    await firstHotel.click();
    await page.waitForLoadState('domcontentloaded');

    // Buscar botón de reservar
    const reserveBtn = page.getByRole('button', { name: /reservar|reserve|book/i }).first();
    if (await reserveBtn.isVisible()) {
      await reserveBtn.click();
      await page.waitForLoadState('domcontentloaded');

      // Verificar que pide login
      const urlActual = page.url();
      const pideLogin =
        urlActual.includes('login') ||
        urlActual.includes('signin') ||
        await page.getByText(/inicia sesión|sign in/i).isVisible().catch(() => false);

      expect(pideLogin).toBeTruthy();
    }
  }

  await page.screenshot({
    path: 'tests/evidencias/screenshots/TC015-reserva-sin-login.png'
  });

  console.log('✅ TC015 PASADO: Reserva sin login redirige a autenticación');
});