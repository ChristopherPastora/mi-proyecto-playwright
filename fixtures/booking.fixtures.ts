// ============================================================
// FIXTURES - BOOKING.COM
// Los fixtures son configuraciones compartidas entre tests.
// Evitan repetir el setup en cada test (ej: abrir página,
// cerrar cookies, tener las páginas POM listas)
// ============================================================

import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

// Definir el tipo de fixtures personalizados
type BookingFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  searchResultsPage: SearchResultsPage;
};

// Extender el test base de Playwright con nuestros fixtures
export const test = base.extend<BookingFixtures>({

  // Fixture de HomePage:
  // Se ejecuta antes de cada test que lo use
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    // Navegar y cerrar cookies automáticamente
    await homePage.navigate();
    // Pasar la instancia al test
    await use(homePage);
  },

  // Fixture de LoginPage
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture de SearchResultsPage
  searchResultsPage: async ({ page }, use) => {
    const searchResultsPage = new SearchResultsPage(page);
    await use(searchResultsPage);
  },
});

// Exportar expect para usarlo en los tests
export { expect } from '@playwright/test';