import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51P1DZuC7RFNPITL3MmIT7G9P4QfwOdWsw8VHsXk6QuNB2zuBMpjHaNf9GSdsLMMC2LbKwipuGbYwfZEkT8TH2tZa00haILEpQC');

const Stripe = ({ clientSecret, setStripeModal, name, payment, resetConfirmModal }) => {
    const options = {
        clientSecret: `${clientSecret}`,
        appearance: {
            theme: "night", // Options: 'stripe', 'flat', 'night', etc.
            // variables: {
            //     colorPrimary: "#6772e5", // Primary color for buttons and inputs
            //     colorBackground: "#f6f8fa", // Background color
            //     colorText: "#32325d", // Text color
            //     borderRadius: "8px", // Input border radius
            //     fontFamily: "Arial, sans-serif", // Font family
            // },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm setStripeModal={setStripeModal} name={name} payment={payment} resetConfirmModal={resetConfirmModal} />
        </Elements>
    );
};

export default Stripe;