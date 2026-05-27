// ============================================================
// PLAYWRIGHT CONFIG - CONFIGURACIÓN AVANZADA
// Configura navegadores, timeouts, screenshots, videos,
// y múltiples proyectos de prueba
// ============================================================

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directorio donde están los tests
  testDir: './tests',

  // Correr tests en paralelo para mayor velocidad
  fullyParallel: true,

  // Fallar el build de CI si dejaste test.only en el código
  forbidOnly: !!process.env.CI,

  // Reintentar tests fallidos: 2 veces en CI, 0 en local
  retries: process.env.CI ? 2 : 0,

  // Número de workers (procesos paralelos)
  // En CI usa 1 para estabilidad, en local usa la mitad de CPUs
  workers: process.env.CI ? 1 : undefined,

  // Configuración del reporte de resultados
  reporter: [
    ['html'],      // Reporte HTML visual
    ['list'],      // Lista en consola
    ['json', { outputFile: 'test-results/results.json' }] // JSON para CI
  ],

  // Configuración global para todos los tests
  use: {
    // URL base (puedes usar page.goto('/') en lugar de la URL completa)
    baseURL: 'https://www.booking.com',

    // Tomar screenshot SOLO cuando falla un test
    // Opciones: 'off' | 'on' | 'only-on-failure'
    screenshot: 'only-on-failure',

    // Grabar video SOLO cuando falla un test
    // Opciones: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
    video: 'retain-on-failure',

    // Grabar trace para depuración (como una caja negra del avión)
    // Permite ver cada paso, screenshot y red después del test
    trace: 'on-first-retry',

    // Timeout de cada acción individual (click, fill, etc.)
    actionTimeout: 15000,

    // Timeout de cada navegación
    navigationTimeout: 30000,

    // Ignorar errores de HTTPS
    ignoreHTTPSErrors: true,

    // Viewport del navegador (tamaño de ventana)
    viewport: { width: 1280, height: 720 },

    // Idioma del navegador
    locale: 'es-ES',
  },

  // Timeout global de cada test completo
  timeout: 60000,

  // Carpeta donde se guardan los resultados
  outputDir: 'test-results/',

  // Proyectos: diferentes navegadores y dispositivos
  projects: [
    // ── Desktop Chrome
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // ── Desktop Firefox
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // ── Mobile Chrome (simula un celular Android)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
