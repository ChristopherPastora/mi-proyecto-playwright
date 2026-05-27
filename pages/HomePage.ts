// ============================================================
// PAGE OBJECT MODEL - HOME PAGE
// Centraliza todos los selectores y acciones de la página
// principal de Booking.com
// El POM evita repetir código y facilita el mantenimiento:
// si cambia un selector, solo lo cambias aquí
// ============================================================

import { Page, Locator } from '@playwright/test';

export class HomePage {
  // ── Referencia a la página de Playwright
  readonly page: Page;

  // ── LOCATORS: elementos de la página
  // getByRole() → busca por rol semántico HTML (button, link, textbox)
  // getByPlaceholder() → busca por texto del placeholder
  // getByLabel() → busca por etiqueta del campo
  // locator() → busca por selector CSS o atributo

  readonly searchDestination: Locator;
  readonly searchButton: Locator;
  readonly signInButton: Locator;
  readonly checkInDate: Locator;
  readonly checkOutDate: Locator;
  readonly guestsButton: Locator;
  readonly logo: Locator;
  readonly currencyButton: Locator;
  readonly languageButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Campo de búsqueda de destino
    // getByPlaceholder → busca el input por su texto de placeholder
    this.searchDestination = page.getByRole('combobox', { name: '¿Adónde vas?' }).or(
  page.getByRole('combobox', { name: 'Where are you going?' })
);

    // Botón principal de búsqueda
    // getByRole('button') → busca por rol semántico de botón
    this.searchButton = page.getByRole('button', { name: /buscar|search/i });

    // Botón de inicio de sesión
    this.signInButton = page.getByRole('button', { name: /inicia sesión|sign in/i }).or(
      page.getByRole('link', { name: /inicia sesión|sign in/i })
    );

    // Selector de fecha de entrada
    this.checkInDate = page.locator('[data-testid="date-display-field-start"]').or(
      page.locator('[data-testid="searchbox-dates-container"]')
    );

    // Selector de fecha de salida
    this.checkOutDate = page.locator('[data-testid="date-display-field-end"]');

    // Botón de huéspedes y habitaciones
    this.guestsButton = page.locator('[data-testid="occupancy-config"]').or(
      page.getByText(/adultos|adults/i).first()
    );

    // Logo de Booking
    this.logo = page.locator('[aria-label="Booking.com"]').or(
      page.locator('.bf-header__logo')
    );

    // Botón de moneda
    this.currencyButton = page.getByRole('button', { name: /moneda|currency/i });

    // Botón de idioma
    this.languageButton = page.getByRole('button', { name: /idioma|language/i });
  }

  // ── MÉTODOS: acciones que se pueden realizar en la página

  // Navegar a Booking.com
  async navigate() {
    await this.page.goto('https://www.booking.com/index.es.html', {
      waitUntil: 'domcontentloaded', // Espera que el DOM esté listo
      timeout: 30000 // Timeout de 30 segundos
    });
    // Cerrar popup de cookies si aparece
    await this.closeCookiePopup();
  }

  // Cerrar el popup de cookies que aparece al entrar
  async closeCookiePopup() {
  try {
    const acceptCookies = this.page.getByRole('button', { name: /aceptar|accept/i });
    await acceptCookies.click({ timeout: 5000 });
  } catch {
    console.log('No apareció popup de cookies');
  }

  try {
    const ignorarBtn = this.page.getByRole('button', { name: /ignorar/i });
    await ignorarBtn.click({ timeout: 5000 });
  } catch {
    console.log('No apareció modal de ignorar');
  }
}

  // Buscar un destino completo
  // Parámetros: destino, fechaEntrada, fechaSalida
  async searchDestinationAndDates(
    destination: string,
    checkIn?: string,
    checkOut?: string
  ) {
    // 1. Escribir el destino
    await this.searchDestination.click();
    await this.searchDestination.fill(destination);

    // 2. Esperar que aparezcan sugerencias y seleccionar la primera
    await this.page.waitForSelector('[data-testid="autocomplete-result"]', {
      timeout: 5000
    }).catch(() => console.log('No aparecieron sugerencias'));

    // Seleccionar primera sugerencia del dropdown
    const firstSuggestion = this.page.locator('[data-testid="autocomplete-result"]').first();
    if (await firstSuggestion.isVisible()) {
      await firstSuggestion.click();
    }

    // 3. Hacer clic en buscar
    await this.searchButton.click();

    // 4. Esperar que cargue la página de resultados
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Obtener el título de la página
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}