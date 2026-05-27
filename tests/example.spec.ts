import { test, expect } from '@playwright/test';

// ============================================================
// CONFIGURACIÓN BASE
// URL principal de Amazon España
// ============================================================
const BASE_URL = 'https://www.amazon.es';

// ============================================================
// TEST 1: Verificar que la página carga correctamente
// Función: page.goto() → navega a una URL
//          expect().toHaveTitle() → verifica el título de la página
// ============================================================
test('TC01 - La página principal carga correctamente', async ({ page }) => {
  // Navegar a Amazon España
  await page.goto(BASE_URL);

  // Verificar que el título contiene "Amazon"
  await expect(page).toHaveTitle(/Amazon/);

  // Verificar que el logo de Amazon es visible
  await expect(page.locator('#nav-logo')).toBeVisible();

  console.log('✅ TC01 PASADO: La página carga y el logo es visible');
});

// ============================================================
// TEST 2: Verificar la barra de búsqueda y botón buscar
// Función: locator().fill() → escribe texto en un campo
//          locator().click() → hace clic en un elemento
//          waitForURL() → espera que la URL cambie
// ============================================================
test('TC02 - Barra de búsqueda funciona correctamente', async ({ page }) => {
  await page.goto(BASE_URL);

  // Localizar el campo de búsqueda por su ID
  const searchBox = page.locator('#twotabsearchtextbox');

  // Verificar que el campo de búsqueda es visible
  await expect(searchBox).toBeVisible();

  // Escribir un término de búsqueda
  await searchBox.fill('laptop gaming');

  // Hacer clic en el botón de búsqueda (lupa)
  await page.locator('#nav-search-submit-button').click();

  // Esperar que la URL cambie a la página de resultados
  await page.waitForURL(/s\?k=/);

  // Verificar que hay resultados en la página
  await expect(page.locator('.s-result-item')).toHaveCount;

  console.log('✅ TC02 PASADO: La búsqueda funciona correctamente');
});

// ============================================================
// TEST 3: Verificar el botón del carrito de compras
// Función: locator().click() → hace clic en el carrito
//          expect().toBeVisible() → verifica visibilidad del elemento
// ============================================================
test('TC03 - Botón del carrito es clickeable', async ({ page }) => {
  await page.goto(BASE_URL);

  // Localizar el ícono del carrito
  const cartButton = page.locator('#nav-cart');

  // Verificar que el carrito es visible
  await expect(cartButton).toBeVisible();

  // Hacer clic en el carrito
  await cartButton.click();

  // Verificar que navegamos a la página del carrito
  await expect(page).toHaveURL(/cart/);

  console.log('✅ TC03 PASADO: El carrito es accesible');
});

// ============================================================
// TEST 4: Verificar el menú de categorías (hamburguesa)
// Función: locator().click() → abre el menú lateral
//          waitForSelector() →
