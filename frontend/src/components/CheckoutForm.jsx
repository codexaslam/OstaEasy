import { Button } from "@/components/ui/button";
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
    <div className="w-full">
      <div className="mb--md">
        <h5 className="flex flex--center text--lg text--primary">
          <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
          <span>Payment Details</span>
        </h5>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-lg p-3 bg-white shadow-sm">
          <PaymentElement />
        </div>

        <div className="flex gap-3 mt-4">
          {" "}
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 h-11 mr--md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!stripe || processing}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {processing ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center p--sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
