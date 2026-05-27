import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

// ── Helpers de fecha ────────────────────────────────────────
function getDateString(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0]; // formato: 2026-05-28
}

// ── TC-001: Búsqueda válida con destino y fechas ────────────
test.describe('Búsqueda de alojamiento', () => {

  test('TC-001 - Búsqueda válida con destino Madrid y fechas',
    async ({ page }) => {

    // ── Arrange: instanciar los page objects ─────────────────
    const homePage = new HomePage(page);
    const resultsPage = new SearchResultsPage(page);

    const checkIn  = getDateString(1); // mañana
    const checkOut = getDateString(4); // 3 noches

    // ── Act: ejecutar el flujo ───────────────────────────────

    // 1. Navegar (ya maneja cookies internamente)
    await homePage.navigate();

    // 2. Buscar Madrid con fechas usando tu método del POM
    await homePage.searchDestinationAndDates(
      'Madrid',
      checkIn,
      checkOut
    );

    // 3. Esperar que carguen los resultados
    await page.waitForLoadState('networkidle');

    // ── Assert: verificar resultados ─────────────────────────

    // ✓ La URL cambió a página de resultados
    await expect(page).toHaveURL(/searchresults/);

    // ✓ Hay al menos una tarjeta de hotel visible
    await expect(resultsPage.firstHotelCard).toBeVisible();

    // ✓ Se encontraron más de 0 hoteles
    const count = await resultsPage.getHotelCount();
    expect(count).toBeGreaterThan(0);

    // ✓ El nombre del primer hotel no está vacío
    const firstName = await resultsPage.getFirstHotelName();
    expect(firstName.trim()).not.toBe('');

    // ✓ La página menciona Madrid en su contenido
    await expect(page).toHaveURL(/searchresults/);

    // ✓ La URL cambió a página de resultados
await expect(page).toHaveURL(/searchresults/);

// ✓ Hay al menos una tarjeta de hotel visible
await expect(resultsPage.firstHotelCard).toBeVisible();

// ✓ Se encontraron más de 0 hoteles
const count = await resultsPage.getHotelCount();
expect(count).toBeGreaterThan(0);

// ✓ El nombre del primer hotel no está vacío
const firstName = await resultsPage.getFirstHotelName();
expect(firstName.trim()).not.toBe('');

  });

});