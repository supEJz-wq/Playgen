import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage.js';

test.describe('Navigation', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
  });

  const routes = [
    { name: 'Playwright Generator', url: '/generator' },
    { name: 'Selenium Generator', url: '/selenium-generator' },
    { name: 'Mobile (Appium)', url: '/appium-generator' },
    { name: 'CI/CD Generator', url: '/cicd-generator' },
    { name: 'SQL Validation', url: '/sql-builder' },
    { name: 'Templates', url: '/templates' },
  ];

  for (const route of routes) {
    test(`should navigate to ${route.name}`, async () => {
      const key = route.name.toLowerCase().includes('playwright') ? 'generator' :
        route.name.toLowerCase().includes('selenium') ? 'selenium' :
        route.name.toLowerCase().includes('appium') ? 'appium' :
        route.name.toLowerCase().includes('ci/cd') ? 'cicd' :
        route.name.toLowerCase().includes('sql') ? 'sql' : 'templates';
      await dashboardPage.navigateTo(key);
      await expect(dashboardPage.page).toHaveURL(new RegExp(route.url));
    });
  }
});
