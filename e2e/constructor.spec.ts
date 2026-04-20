import { expect, test } from '@playwright/test';

import type { Locator, Route } from '@playwright/test';

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

const dragIngredientWithRetry = async ({
  source,
  target,
  successLocator,
  attempts = 3,
}: {
  source: Locator;
  target: Locator;
  successLocator: Locator;
  attempts?: number;
}): Promise<void> => {
  const page = source.page();

  const syntheticDragAndDrop = async (): Promise<void> => {
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await source.dispatchEvent('dragstart', { dataTransfer });
    await target.dispatchEvent('dragenter', { dataTransfer });
    await target.dispatchEvent('dragover', { dataTransfer });
    await target.dispatchEvent('drop', { dataTransfer });
    await source.dispatchEvent('dragend', { dataTransfer });
  };

  for (let index = 0; index < attempts; index += 1) {
    await source.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();
    await source.dragTo(target, { force: true });

    try {
      await expect(successLocator).toBeVisible({ timeout: 1000 });
      return;
    } catch {
      await syntheticDragAndDrop();
    }

    try {
      await expect(successLocator).toBeVisible({ timeout: 1000 });
      return;
    } catch {
      // WebKit иногда теряет dnd-событие, повторяем попытку.
    }
  }

  await expect(successLocator).toBeVisible();
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

    await page.goto('/');
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
      await expect(page).not.toHaveURL(/\/ingredients\/bun-1$/);
    });

    await test.step('Сборка бургера перетаскиванием ингредиентов', async () => {
      const bunCard = page
        .locator('img[alt="Тестовая булка"]')
        .first()
        .locator('xpath=..');
      const mainCard = page
        .locator('img[alt="Тестовая котлета"]')
        .first()
        .locator('xpath=..');
      const bunTop = constructorSection.getByText('Тестовая булка (верх)');
      const bunBottom = constructorSection.getByText('Тестовая булка (низ)');
      const mainInConstructor = constructorSection.locator(
        '.constructor-element__text',
        {
          hasText: 'Тестовая котлета',
        }
      );

      await dragIngredientWithRetry({
        source: bunCard,
        target: constructorSection,
        successLocator: bunTop,
      });
      await dragIngredientWithRetry({
        source: mainCard,
        target: constructorSection,
        successLocator: mainInConstructor,
      });

      await expect(bunTop).toBeVisible();
      await expect(bunBottom).toBeVisible();
      await expect(mainInConstructor).toBeVisible();
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
