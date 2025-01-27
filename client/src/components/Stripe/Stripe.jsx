import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';

import StripeRedirect from './StripeRedirect';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

const Stripe = ({ 
    stripeSecret,
    redirectSecret,  
    setStripeModal, 
    nft, 
    payment, 
    resetConfirmModal, 
    stripeModal, 
    handleSuccessfulStripePayment, 
    preCalcPayment }) => {

    const clientSecret = stripeSecret ?? (redirectSecret || "");
    console.log(clientSecret);
    const options = {
        clientSecret: `${clientSecret}`,
        appearance: {
            theme: "night",
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            {stripeModal && <CheckoutForm
                setStripeModal={setStripeModal}
                nft={nft} payment={payment}
                resetConfirmModal={resetConfirmModal}
                clientSecret={clientSecret}
                preCalcPayment={preCalcPayment}
            />}
            {redirectSecret && <StripeRedirect
                redirectSecret={redirectSecret}
                handleSuccessfulStripePayment={handleSuccessfulStripePayment} />}
        </Elements>
    );
};

export default Stripe;