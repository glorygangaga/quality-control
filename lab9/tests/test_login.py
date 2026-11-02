from pages.login_page import LoginPage


def test_login(driver, load_config):
    config = load_config("login.yaml")

    page = LoginPage(driver)
    page.open_login_page(config["login_page"])
    page.input_login(config["login"])
    page.input_password(config["password"])
    page.click_login_button()

    assert page.get_success_sign_content() == config["success_message"]