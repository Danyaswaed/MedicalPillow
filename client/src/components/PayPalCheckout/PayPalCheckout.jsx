import {
  PayPalProvider,
  PayPalOneTimePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6";

function PayPalCheckout({ createOrder, onApprove, onError }) {
  const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  const environment = process.env.REACT_APP_PAYPAL_ENVIRONMENT || "sandbox";

  if (!clientId) {
    return <div className="paypal-config-error">חסר PayPal Client ID</div>;
  }

  return (
    <PayPalProvider
      clientId={clientId}
      environment={environment}
      components={["paypal-payments"]}
      pageType="checkout"
    >
      <PayPalOneTimePaymentButton
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        presentationMode="auto"
      />
    </PayPalProvider>
  );
}

export default PayPalCheckout;
