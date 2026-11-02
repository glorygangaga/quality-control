from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class LoginPage(BasePage):
    LOGIN_FIELD = (By.XPATH, "//*[@name='login']")
    PASSWORD_FIELD = (By.XPATH, "//*[@id='pasword']")
    LOGIN_BUTTON = (By.XPATH, "//form[@id='login']/button[@class='btn btn-default']")
    SUCCESS_SIGN = (By.CSS_SELECTOR, ".alert.alert-success")

    def open_login_page(self, url):
        self.driver.get(url)

    def input_login(self, login):
        self.type(self.LOGIN_FIELD, login)

    def input_password(self, password):
        self.type(self.PASSWORD_FIELD, password)

    def click_login_button(self):
        self.click(self.LOGIN_BUTTON)

    def get_success_sign_content(self):
        return self.get_text(self.SUCCESS_SIGN)