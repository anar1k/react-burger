import { expect, test } from '@playwright/test';

import type { Route } from '@playwright/test';

type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

const TEST_ACCESS_TOKEN = 'Bearer test-access-token';
const TEST_REFRESH_TOKEN = 'test-refresh-token';
const TEST_ORDER_NUMBER = 12345;

const INGREDIENTS: Ingredient[] = [
  {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 250,
    price: 300,
    image: '/logo.svg',
    image_large: '/logo.svg',
    image_mobile: '/logo.svg',
    __v: 0,
  },
  {
    _id: 'main-1',
    name: 'Тестовая котлета',
    type: 'main',
    proteins: 30,
    fat: 15,
    carbohydrates: 5,
    calories: 200,
    price: 150,
    image: '/logo.svg',
    image_large: '/logo.svg',
    image_mobile: '/logo.svg',
    __v: 0,
  },
  {
    _id: 'sauce-1',
    name: 'Тестовый соус',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 3,
    calories: 20,
    price: 50,
    image: '/logo.svg',
    image_large: '/logo.svg',
    image_mobile: '/logo.svg',
    __v: 0,
  },
];

const setupApiMocks = async (
  route: Route,
  orderBody: { ingredients: string[] } | null
): Promise<{ ingredients: string[] } | null> => {
  const request = route.request();
  const url = new URL(request.url());
  const pathname = url.pathname;
  const method = request.method();

  if (pathname.endsWith('/api/ingredients') && method === 'GET') {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: INGREDIENTS }),
    });
    return orderBody;
  }

  if (pathname.endsWith('/api/auth/user') && method === 'GET') {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@example.com', name: 'Playwright User' },
      }),
    });
    return orderBody;
  }

  if (pathname.endsWith('/api/orders') && method === 'POST') {
    orderBody = (request.postDataJSON() as { ingredients: string[] }) ?? null;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Playwright Burger',
        order: { number: TEST_ORDER_NUMBER },
      }),
    });
    return orderBody;
  }

  await route.continue();
  return orderBody;
};

test.describe('Страница Конструктор', () => {
  test('путь пользователя от сборки до информации о заказе', async ({ page }) => {
    let postedOrderBody: { ingredients: string[] } | null = null;

    await page.addInitScript(
      ([accessToken, refreshToken]) => {
        window.localStorage.setItem('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
      },
      [TEST_ACCESS_TOKEN, TEST_REFRESH_TOKEN]
    );

    await page.route('**/api/**', async (route) => {
      postedOrderBody = await setupApiMocks(route, postedOrderBody);
    });

    await page.goto('http://localhost:5173');
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    const constructorSection = page.locator('section').filter({
      has: page.getByRole('button', { name: 'Оформить заказ' }),
    });
    const orderButton = page.getByRole('button', { name: 'Оформить заказ' });

    await test.step('Проверка модального окна ингредиента', async () => {
      await page.locator('img[alt="Тестовая булка"]').locator('xpath=..').click();

      await expect(page.getByText('Детали ингредиента')).toBeVisible();
      await expect(page).toHaveURL(/\/ingredients\/bun-1$/);

      await page.locator('[class*="close_button"]').click();

      await expect(page.getByText('Детали ингредиента')).toBeHidden();
      await expect(page).toHaveURL('http://localhost:5173/');
    });

    await test.step('Сборка бургера перетаскиванием ингредиентов', async () => {
      const bunCard = page.locator('img[alt="Тестовая булка"]').locator('xpath=..');
      const mainCard = page.locator('img[alt="Тестовая котлета"]').locator('xpath=..');

      await bunCard.dragTo(constructorSection);
      await mainCard.dragTo(constructorSection);

      await expect(page.getByText('Тестовая булка (верх)')).toBeVisible();
      await expect(page.getByText('Тестовая булка (низ)')).toBeVisible();
      await expect(
        constructorSection.locator('.constructor-element__text', {
          hasText: 'Тестовая котлета',
        })
      ).toBeVisible();
      await expect(orderButton).toBeEnabled();
    });

    await test.step('Создание заказа и проверка модального окна заказа', async () => {
      await orderButton.click();

      await expect(page.getByText(String(TEST_ORDER_NUMBER))).toBeVisible();
      await expect(page.getByText('идентификатор заказа')).toBeVisible();
      expect(postedOrderBody).toEqual({
        ingredients: ['bun-1', 'main-1', 'bun-1'],
      });

      await page.keyboard.press('Escape');

      await expect(page.getByText('идентификатор заказа')).toBeHidden();
      await expect(orderButton).toBeDisabled();
      await expect(page.getByText('Выберите булки').first()).toBeVisible();
      await expect(page.getByText('Выберите начинку')).toBeVisible();
    });
  });
});
