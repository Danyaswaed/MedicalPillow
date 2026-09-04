require("dotenv").config();

const {
  Client,
  Environment,
  OrdersController,
  CheckoutPaymentIntent,
} = require("@paypal/paypal-server-sdk");

const environment =
  process.env.PAYPAL_ENV === "live"
    ? Environment.Production
    : Environment.Sandbox;

const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  environment,
});

const paypalOrdersController = new OrdersController(paypalClient);

module.exports = {
  paypalOrdersController,
  CheckoutPaymentIntent,
};
