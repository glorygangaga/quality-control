import { test } from "node:test";
import assert from "node:assert/strict";
import { Builder, WebDriver } from "selenium-webdriver";

import { loadConfig } from "../config/config";

import { LoginPage } from "../pages/LoginPage";
import { MainPage } from "../pages/MainPage";
import { ProductPage } from "../pages/ProductPage";
import { OrderPage } from "../pages/OrderPage";

interface LoginConfig {
  base_url: string;
  login_page: string;
  login: string;
  password: string;
  success_message: string;
}

interface SearchConfig {
  main_page: string;
  search_string: string;
}

interface CartConfig {
  product_page: string;
  color: string;
  expected_count: string;
}

interface OrderConfig {
  base_url: string;
  login_page: string;
  product_page: string;
  login: string;
  password: string;
  color: string;
  order_success_message: string;
}

async function createDriver(): Promise<WebDriver> {
  return await new Builder()
    .forBrowser("chrome")
    .build();
}

async function closeDriver(driver: WebDriver): Promise<void> {
  await driver.quit();
}

test("1. Авторизация пользователя", async () => {
  const config = loadConfig<LoginConfig>("login.yaml");
  const driver = await createDriver();

  try {
    const loginPage = new LoginPage(driver);

    await loginPage.openLoginPage(config.login_page);

    await loginPage.login(
      config.login,
      config.password
    );

    const message = await loginPage.getSuccessSignContent();

    assert.ok(
      message.includes(config.success_message),
      `Ожидалось сообщение: ${config.success_message}. Получено: ${message}`
    );

    console.log("Авторизация прошла успешно");
  } finally {
    await closeDriver(driver);
  }
});

test("2. Поиск товара в каталоге", async () => {
  const config = loadConfig<SearchConfig>(
    "product_search.yaml"
  );

  const driver = await createDriver();

  try {
    const mainPage = new MainPage(driver);

    await mainPage.open(config.main_page);

    await mainPage.inputSearchBar(config.search_string);
    await mainPage.submitSearchBar();

    const result =
      await mainPage.firstProductCardTitleContainsString();

    assert.equal(
      result,
      true,
      "Название первого товара не содержит поисковую строку"
    );

    console.log("Поиск товара прошёл успешно");
  } finally {
    await closeDriver(driver);
  }
});

test("3. Добавление товара в корзину", async () => {
  const config = loadConfig<CartConfig>("add_to_cart.yaml");

  const driver = await createDriver();

  try {
    const productPage = new ProductPage(driver);

    await productPage.open(config.product_page);

    await productPage.chooseColor(config.color);
    await productPage.rememberTitle();
    await productPage.rememberPrice();

    await productPage.addProductInCart();
    await productPage.openCart();

    const actualTitle =
      await productPage.getProductTitleInCart();

    const actualCount =
      await productPage.getProductCountInCart();

    assert.ok(
      actualTitle.includes(config.color),
      `В корзине не найден выбранный цвет: ${config.color}`
    );

    assert.equal(
      actualCount.trim(),
      config.expected_count,
      "Количество товара в корзине не совпадает с ожидаемым"
    );

    console.log("Товар успешно добавлен в корзину");
  } finally {
    await closeDriver(driver);
  }
});

test("4. Оформление заказа", async () => {
  const config = loadConfig<OrderConfig>("order.yaml");

  const driver = await createDriver();

  try {
    const loginPage = new LoginPage(driver);
    const productPage = new ProductPage(driver);
    const orderPage = new OrderPage(driver);

    await loginPage.openLoginPage(config.login_page);

    await loginPage.login(
      config.login,
      config.password
    );

    await productPage.open(config.product_page);

    await productPage.chooseColor(config.color);

    await productPage.addProductInCart();

    await productPage.openCart();
    await productPage.orderProductFromCart();

    await orderPage.orderProduct();

    const message = await orderPage.getSuccessMessage();

    assert.ok(
      message.includes(config.order_success_message),
      `Не найдено сообщение об оформлении заказа. Получено: ${message}`
    );

    console.log("Заказ успешно оформлен");
  } finally {
    await closeDriver(driver);
  }
});