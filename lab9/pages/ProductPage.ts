import { By, WebDriver, WebElement } from "selenium-webdriver";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  private readonly COLOR_MENU =
    By.xpath("//div[contains(@class,'available')]//select");

  private readonly PRODUCT_PRICE_FIELD =
    By.xpath("//h5[@id='base-price']");

  private readonly PRODUCT_TITLE_FIELD =
    By.xpath("//div[contains(@class,'single-para')]/h2");

  private readonly ADD_BUTTON =
    By.xpath("//a[@id='productAdd']");

  private readonly CART_BUTTON =
    By.xpath("//div[contains(@class,'cart')]//a");

  private readonly PRODUCT_TITLE_IN_CART =
    By.xpath("//div[@id='cart']//table//tbody/tr[1]/td[2]/a");

  private readonly PRODUCT_COUNT_IN_CART =
    By.xpath("//div[@id='cart']//table//tbody/tr[1]/td[3]");

  private readonly PRODUCT_PRICE_IN_CART =
    By.xpath("//div[@id='cart']//table//tbody/tr[1]/td[4]");

  private readonly TOTAL_COUNT =
    By.xpath("//div[@id='cart']//table//tbody/tr[2]/td[contains(@class,'cart-qty')]");

  private readonly TOTAL_COST =
    By.xpath("//div[@id='cart']//table//tbody/tr[3]/td[contains(@class,'cart-sum')]");

  private readonly ORDER_BUTTON =
    By.xpath("//div[@id='cart']//div[@class='modal-footer']/a[contains(@class,'btn-primary')]");

  private productPrice: string | null = null;
  private productTitle: string | null = null;
  private productColor: string | null = null;

  constructor(driver: WebDriver, timeout = 10) {
    super(driver, timeout);
  }

  async chooseColor(color: string): Promise<void> {
    const select = await this.find(this.COLOR_MENU);
    const options = await select.findElements(By.tagName("option"));

    let selected = false;

    for (const option of options) {
      const text = (await option.getText()).trim();

      if (text === color) {
        await option.click();
        selected = true;
        break;
      }
    }

    if (!selected) {
      throw new Error(`Цвет "${color}" не найден`);
    }

    this.productColor = `(${color})`;
  }

  async rememberPrice(): Promise<void> {
    this.productPrice = await this.getText(
      this.PRODUCT_PRICE_FIELD
    );
  }

  getProductPrice(): string | null {
    return this.productPrice;
  }

  async rememberTitle(): Promise<void> {
    const title = await this.getText(
      this.PRODUCT_TITLE_FIELD
    );

    this.productTitle =
      `${title} ${this.productColor ?? ""}`.trim();
  }

  getProductTitle(): string | null {
    return this.productTitle;
  }

  async addProductInCart(): Promise<void> {
    await this.click(this.ADD_BUTTON);
  }

  async openCart(): Promise<void> {
    await this.click(this.CART_BUTTON);
  }

  async getProductTitleInCart(): Promise<string> {
    return await this.getText(this.PRODUCT_TITLE_IN_CART);
  }

  async getProductCountInCart(): Promise<string> {
    return await this.getText(this.PRODUCT_COUNT_IN_CART);
  }

  async getProductPriceInCart(): Promise<string> {
    return await this.getText(this.PRODUCT_PRICE_IN_CART);
  }

  async getTotalCount(): Promise<string> {
    return await this.getText(this.TOTAL_COUNT);
  }

  async getTotalCost(): Promise<string> {
    return await this.getText(this.TOTAL_COST);
  }

  async orderProductFromCart(): Promise<void> {
    await this.click(this.ORDER_BUTTON);
  }
}