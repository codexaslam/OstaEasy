import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

const CheckoutForm = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL after successful payment
        return_url: `${window.location.origin}/`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment failed:", error);
      Swal.fire({
        title: "Payment Failed!",
        text: error.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      Swal.fire({
        title: "Payment Successful!",
        text: "Your order has been processed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        onSuccess(paymentIntent);
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-md p-4 bg-gray-50">
            <PaymentElement />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || processing}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
