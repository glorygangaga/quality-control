from pages.login_page import LoginPage
from pages.product_page import ProductPage
from pages.order_page import OrderPage


def test_order(driver, load_config):
    config = load_config("order.yaml")

    login_page = LoginPage(driver)
    login_page.open_login_page(config["login_page"])
    login_page.input_login(config["login"])
    login_page.input_password(config["password"])
    login_page.click_login_button()

    product_page = ProductPage(driver)
    product_page.open(config["product_page"])
    product_page.choose_color(config["color"])
    product_page.remember_price()
    product_page.remember_title()
    product_page.add_product_in_cart()

    product_page.order_product_from_cart()

    order_page = OrderPage(driver)
    order_page.order_product()

    assert config["order_success_message"] in order_page.get_success_message()