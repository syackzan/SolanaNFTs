import React from "react";
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import "../../css/stripe.css"; // Import your custom CSS

const CheckoutForm = ({ setStripeModal, name, payment, resetConfirmModal }) => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // Prevent the default form submission, which would refresh the page.
        event.preventDefault();
    
        if (!stripe || !elements) {
            // Stripe.js hasn't loaded yet.
            // Disable form submission until Stripe.js has loaded.
            return;
        }
    
        try {
            const { error } = await stripe.confirmPayment({
                // The `Elements` instance used to create the Payment Element.
                elements,
                confirmParams: {
                    return_url: 'http://localhost:5173/marketplace?',
                },
            });
    
            if (error) {
                // Handle immediate error from confirming the payment.
                console.error("Unexpected error during payment confirmation:", error.message);
            } else {
                // Optional: Additional handling after successful confirmation, if needed.
            }
        } catch (err) {
            // Catch unexpected errors (e.g., network issues, Stripe API errors).
            console.error("Unexpected error during payment confirmation:", err);
        }
    };
    

    return (
        <>
            {/* Overlay for dimming background */}
            <div className="stripe-overlay"></div>
            <div className="stripe-modal">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="marykate">
                            <h5>NFT: {name}</h5>
                            <h5>Cost: {payment}</h5>
                        </div>
                        <button className="modal-close-top-right" onClick={() => { setStripeModal(false), resetConfirmModal() }}>&times;</button>
                    </div>
                    <PaymentElement />
                    <button className='stripe-button' style={{ marginTop: "20px" }}>Submit</button>
                </form>
            </div>
        </>
    );
};

export default CheckoutForm;