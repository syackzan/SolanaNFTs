import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';

import StripeRedirect from './StripeRedirect';

import { useTransactionsController } from '../../providers/TransactionsProvider';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

const Stripe = ({ nft, handleSuccessfulStripePayment }) => {

    const {
        preCalcPayment,
        stripeSecret,
        stripeModal,
        setStripeModal,
        redirectSecret,
    } = useTransactionsController();

    const clientSecret = stripeSecret ?? (redirectSecret || "");
    
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
                nft={nft}
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