import { By, WebDriver } from "selenium-webdriver";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private readonly LOGIN_FIELD =
    By.xpath("//*[@name='login']");

  private readonly PASSWORD_FIELD =
    By.xpath("//*[@id='pasword']");

  private readonly LOGIN_BUTTON =
    By.xpath("//form[@id='login']/button[@class='btn btn-default']");

  private readonly SUCCESS_SIGN =
    By.css(".alert.alert-success");

  constructor(driver: WebDriver, timeout = 10) {
    super(driver, timeout);
  }

  async openLoginPage(url: string): Promise<void> {
    await this.open(url);
  }

  async inputLogin(login: string): Promise<void> {
    await this.type(this.LOGIN_FIELD, login);
  }

  async inputPassword(password: string): Promise<void> {
    await this.type(this.PASSWORD_FIELD, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.LOGIN_BUTTON);
  }

  async login(login: string, password: string): Promise<void> {
    await this.inputLogin(login);
    await this.inputPassword(password);
    await this.clickLoginButton();
  }

  async getSuccessSignContent(): Promise<string> {
    return await this.getText(this.SUCCESS_SIGN);
  }
}