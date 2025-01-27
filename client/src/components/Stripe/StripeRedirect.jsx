import React, {useState, useEffect} from 'react';

import {useStripe } from '@stripe/react-stripe-js';

const StripeRedirect = ({redirectSecret, handleSuccessfulStripePayment}) => {

    const stripe = useStripe();

    const [message, setMessage] = useState('');

    useEffect(() => {
        const handlePaymentIntent = async () => {
            if (!stripe || !redirectSecret) {
                return; // Exit early if stripe or redirectSecret is not available
            }
    
            try {
                // Retrieve the PaymentIntent
                const { paymentIntent } = await stripe.retrievePaymentIntent(redirectSecret);
                console.log("PaymentIntent ",paymentIntent);
    
                // Inspect the PaymentIntent `status` to indicate the status of the payment
                switch (paymentIntent.status) {
                    case 'succeeded':
                        setMessage('Success! Payment received.');
                        console.log('Success! Payment received.');
                        await handleSuccessfulStripePayment(); // Call success handler
                        break;
    
                    case 'processing':
                        setMessage("Payment processing. We'll update you when payment is received.");
                        console.log("Payment processing. We'll update you when payment is received.");
                        break;
    
                    case 'requires_payment_method':
                        setMessage('Payment failed. Please try another payment method.');
                        console.log('Payment failed. Please try another payment method.');
                        break;
    
                    default:
                        setMessage('Something went wrong.');
                        console.log('Something went wrong.');
                        break;
                }
            } catch (error) {
                console.error('Error retrieving PaymentIntent:', error);
                setMessage('Failed to retrieve payment details. Please try again.');
            }
        };
    
        handlePaymentIntent(); // Call the async function
    }, [stripe]);


    return(
        <>
        </>
    )
}

export default StripeRedirect;