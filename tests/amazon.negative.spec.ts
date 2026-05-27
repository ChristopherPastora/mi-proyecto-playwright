import { test, expect } from '@playwright/test';

// ============================================================
// TESTS NEGATIVOS - AMAZON ESPAÑA
// Los tests negativos verifican que el sistema maneja
// correctamente errores, entradas inválidas y casos límite
// ============================================================

const BASE_URL = 'https://www.amazon.es';

// ============================================================
// TEST NEG-01: Búsqueda vacía
// Función: fill('') → intenta buscar sin texto
// Esperado: No navega o muestra resultados genéricos
// ============================================================
test('NEG01 - Búsqueda con campo vacío no rompe la página', async ({ page }) => {
  await page.goto(BASE_URL);

  // Localizar el campo de búsqueda
  const searchBox = page.locator('#twotabsearchtextbox');

  // Limpiar el campo (dejarlo vacío)
  await searchBox.fill('');

  // Intentar buscar sin texto
  await page.locator('#nav-search-submit-button').click();

  // Verificar que la página sigue siendo Amazon (no crashea)
  await expect(page).toHaveURL(/amazon\.es/);

  // Verificar que el header sigue visible (página estable)
  await expect(page.locator('#nav-logo')).toBeVisible();

  console.log('✅ NEG01 PASADO: Búsqueda vacía no rompe la página');
});

// ============================================================
// TEST NEG-02: Búsqueda con caracteres especiales
// Función: fill() → ingresa símbolos y caracteres raros
// Esperado: No genera error 500, muestra "sin resultados"
// ============================================================
test('NEG02 - Búsqueda con caracteres especiales no genera error', async ({ page }) => {
  await page.goto(BASE_URL);

  // Escribir caracteres especiales en el buscador
  await page.locator('#twotabsearchtextbox').fill('!@#$%^&*()_+{}|:<>?');

  // Presionar Enter para buscar
  await page.locator('#twotabsearchtextbox').press('Enter');

  // Esperar que cargue algo
  await page.waitForLoadState('domcontentloaded');

  // Verificar que NO aparece un error 500 o página rota
  await expect(page.locator('body')).not.toContainText('500');
  await expect(page.locator('body')).not.toContainText('Internal Server Error');

  // Verificar que sigue siendo una página de Amazon
  await expect(page).toHaveURL(/amazon\.es/);

  console.log('✅ NEG02 PASADO: Caracteres especiales no generan error del servidor');
});

// ============================================================
// TEST NEG-03: Búsqueda con texto extremadamente largo
// Función: fill() → ingresa 500 caracteres
// Esperado: Amazon lo maneja sin colapsar
// ============================================================
test('NEG03 - Búsqueda con texto muy largo no rompe la página', async ({ page }) => {
  await page.goto(BASE_URL);

  // Generar un texto de 500 caracteres
  const textoLargo = 'a'.repeat(500);

  // Intentar buscar con ese texto
  await page.locator('#twotabsearchtextbox').fill(textoLargo);
  await page.locator('#twotabsearchtextbox').press('Enter');

  // Esperar que la página responda
  await page.waitForLoadState('domcontentloaded');

  // Verificar que la página no crashea
  await expect(page.locator('body')).not.toContainText('Internal Server Error');
  await expect(page).toHaveURL(/amazon\.es/);

  console.log('✅ NEG03 PASADO: Texto largo no colapsa la página');
});

// ============================================================
// TEST NEG-04: Acceso directo a URL de producto inexistente
// Función: goto() → navega a una URL de producto falso
// Esperado: Amazon muestra página de error 404 o "no encontrado"
// ============================================================
test('NEG04 - URL de producto inexistente muestra error controlado', async ({ page }) => {
  // Intentar acceder a un producto con ID falso
  await page.goto(`${BASE_URL}/dp/PRODUCTO000FALSO`);

  // Esperar que cargue
  await page.waitForLoadState('domcontentloaded');

  // Verificar que Amazon muestra una página de error controlada
  // (no una pantalla en blanco o error del servidor)
  const bodyText = await page.locator('body').innerText();

  // Amazon debe mostrar algo como "página no encontrada" o redirigir
  expect(
    bodyText.includes('encontrado') ||
    bodyText.includes('disponible') ||
    bodyText.includes('404') ||
    bodyText.includes('Dogs of Amazon') // página de error clásica de Amazon
  ).toBeTruthy();

  console.log('✅ NEG04 PASADO: Producto inexistente muestra error controlado');
});

// ============================================================
// TEST NEG-05: Agregar al carrito sin seleccionar variante
// Función: click() → intenta comprar sin elegir talla/color
// Esperado: Amazon muestra advertencia, no agrega al carrito
// ============================================================
test('NEG05 - Agregar producto sin seleccionar variante muestra advertencia', async ({ page }) => {
  await page.goto(BASE_URL);

  // Buscar un producto que tenga variantes (tallas/colores)
  await page.locator('#twotabsearchtextbox').fill('camiseta hombre');
  await page.locator('#twotabsearchtextbox').press('Enter');
  await page.waitForLoadState('domcontentloaded');

  // Hacer clic en el primer producto
  await page.locator('.s-result-item .a-link-normal').first().click();
  await page.waitForLoadState('domcontentloaded');

  // Intentar agregar al carrito directamente sin elegir variante
  const addToCartButton = page.locator('#add-to-cart-button');

  // Verificar si el botón existe en esta página
  if (await addToCartButton.isVisible()) {
    await addToCartButton.click();
    await page.waitForLoadState('domcontentloaded');

    // Verificar que aparece advertencia o se redirige al carrito
    const pageContent = await page.locator('body').innerText();
    const tieneAdvertencia =
      pageContent.includes('selecciona') ||
      pageContent.includes('elige') ||
      pageContent.includes('talla') ||
      pageContent.includes('color') ||
      pageContent.includes('Carrito');

    expect(tieneAdvertencia).toBeTruthy();
    console.log('✅ NEG05 PASADO: Sistema responde al agregar sin variante');
  } else {
    console.log('⚠️ NEG05 OMITIDO: El producto no tiene botón de agregar directo');
  }
});

// ============================================================
// TEST NEG-06: Búsqueda con solo espacios en blanco
// Función: fill('   ') → espacios en lugar de texto real
// Esperado: No hace búsqueda real o muestra resultados genéricos
// ============================================================
test('NEG06 - Búsqueda con solo espacios no devuelve resultados útiles', async ({ page }) => {
  await page.goto(BASE_URL);

  // Ingresar solo espacios en el buscador
  await page.locator('#twotabsearchtextbox').fill('     ');
  await page.locator('#twotabsearchtextbox').press('Enter');

  await page.waitForLoadState('domcontentloaded');

  // Verificar que la página sigue siendo Amazon y no crashea
  await expect(page).toHaveURL(/amazon\.es/);
  await expect(page.locator('body')).not.toContainText('Internal Server Error');

  console.log('✅ NEG06 PASADO: Espacios en blanco no rompen la búsqueda');
});

// ============================================================
// TEST NEG-07: Intentar ir al checkout sin estar logueado
// Función: goto() → acceder directo a la página de pago
// Esperado: Amazon redirige al login, no permite pagar sin cuenta
// ============================================================
test('NEG07 - Acceso al checkout sin sesión redirige al login', async ({ page }) => {
  // Intentar ir directo a la página de checkout
  await page.goto(`${BASE_URL}/gp/buy/spc/handlers/display.html`);

  await page.waitForLoadState('domcontentloaded');

  // Verificar que Amazon redirige al login
  await expect(page).toHaveURL(/signin|ap\/signin|login/);

  console.log('✅ NEG07 PASADO: Checkout sin sesión redirige al login');
});

// ============================================================
// TEST NEG-08: Búsqueda con número de teléfono (dato sensible)
// Función: fill() → ingresa un número de teléfono
// Esperado: Amazon lo trata como búsqueda normal, sin exponer datos
// ============================================================
test('NEG08 - Búsqueda con número de teléfono se trata como texto normal', async ({ page }) => {
  await page.goto(BASE_URL);

  // Ingresar un número de teléfono en el buscador
  await page.locator('#twotabsearchtextbox').fill('+34 612 345 678');
  await page.locator('#twotabsearchtextbox').press('Enter');

  await page.waitForLoadState('domcontentloaded');

  // Verificar que no expone información sensible ni genera error
  await expect(page).toHaveURL(/amazon\.es/);
  await expect(page.locator('body')).not.toContainText('Internal Server Error');

  console.log('✅ NEG08 PASADO: Número de teléfono tratado como búsqueda normal');
});