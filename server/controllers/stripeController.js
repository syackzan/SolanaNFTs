const stripeKey = process.env.NODE_ENV === "production" ? process.env.STRIPE_RK_T : process.env.STRIPE_RK_L;
const stripe = require('stripe')(stripeKey);

exports.getPaymentIntent = async (req, res) => {

    const { payment, id, walletAddress } = req.query;

    try {
        
        console.log(payment, id, walletAddress);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: (payment * 100), //convert to cents
            currency: 'usd',
            automatic_payment_methods: {
              enabled: true,
            },
            description: `${payment}?${id}?${walletAddress}`
          });

        // Return the data as a response
        res.json({client_secret: paymentIntent.client_secret});
    } catch (error) {
        // Enhanced error logging
        if (error.response) {
            // Error response from the API
            console.error("API Error Response:", {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data,
            });
        } else if (error.request) {
            // No response received
            console.error("No Response Received:", error.request);
        } else {
            // Other errors (e.g., request setup issues)
            console.error("Request Error:", error.message);
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};