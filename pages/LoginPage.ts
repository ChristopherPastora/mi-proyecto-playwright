// ============================================================
// PAGE OBJECT MODEL - LOGIN PAGE
// Maneja todos los elementos del proceso de autenticación
// en Booking.com (modal de login)
// ============================================================

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // ── LOCATORS del modal de login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly modalContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Campo de email
    // getByLabel() → busca el input asociado a una etiqueta
    this.emailInput = page.getByLabel(/correo electrónico|email address/i).or(
      page.getByRole('textbox', { name: /email/i })
    );

    // Campo de contraseña
    this.passwordInput = page.getByLabel(/contraseña|password/i);

    // Botón continuar (primer paso del login)
    this.continueButton = page.getByRole('button', { name: /continuar|continue/i });

    // Botón de iniciar sesión
    this.signInButton = page.getByRole('button', { name: /inicia sesión|sign in/i });

    // Mensaje de error
    this.errorMessage = page.locator('[data-testid="error-message"]').or(
      page.getByText(/error|inválido|invalid/i)
    );

    // Contenedor del modal
    this.modalContainer = page.locator('[data-testid="modal-container"]').or(
      page.locator('.modal-mask')
    );
  }

  // Abrir el modal de login haciendo clic en el botón
  async openLoginModal() {
    const signInBtn = this.page.getByRole('button', { name: /inicia sesión|sign in/i }).or(
      this.page.getByRole('link', { name: /inicia sesión|sign in/i })
    );
    await signInBtn.click();
    // Esperar que el modal aparezca
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Ingresar email y continuar
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Ingresar contraseña
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Flujo completo de login
  async login(email: string, password: string) {
    await this.openLoginModal();
    await this.enterEmail(email);
    await this.enterPassword(password);
  }
}