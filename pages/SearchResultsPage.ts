// ============================================================
// PAGE OBJECT MODEL - SEARCH RESULTS PAGE
// Maneja la página de resultados de búsqueda de hoteles
// ============================================================

import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  // ── LOCATORS de resultados
  readonly hotelCards: Locator;
  readonly firstHotelCard: Locator;
  readonly hotelNames: Locator;
  readonly hotelPrices: Locator;
  readonly filterSection: Locator;
  readonly sortDropdown: Locator;
  readonly resultsCount: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tarjetas de hoteles en resultados
    // locator() con atributo data-testid → más estable que clases CSS
    this.hotelCards = page.locator('[data-testid="property-card"]');

    // Primera tarjeta de hotel
    this.firstHotelCard = page.locator('[data-testid="property-card"]').first();

    // Nombres de hoteles
    this.hotelNames = page.locator('[data-testid="title"]');

    // Precios de hoteles
    this.hotelPrices = page.locator('[data-testid="price-and-discounted-price"]');

    // Sección de filtros
    this.filterSection = page.locator('[data-testid="filters-sidebar"]').or(
      page.locator('.filter_sidebar')
    );

    // Dropdown de ordenamiento
    this.sortDropdown = page.locator('[data-testid="sorters-dropdown"]');

    // Contador de resultados
    this.resultsCount = page.locator('[data-testid="header-container"]');

    // Mensaje de sin resultados
    this.noResultsMessage = page.getByText(/no encontramos|no results/i);
  }

  // Hacer clic en el primer hotel de los resultados
  async clickFirstHotel() {
    await this.firstHotelCard.click();
    // Esperar nueva pestaña o navegación
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Obtener la cantidad de hoteles mostrados
  async getHotelCount(): Promise<number> {
    return await this.hotelCards.count();
  }

  // Obtener el nombre del primer hotel
  async getFirstHotelName(): Promise<string> {
    return await this.hotelNames.first().innerText();
  }
}