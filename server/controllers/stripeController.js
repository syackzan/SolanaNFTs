const stripe = require('stripe')(process.env.STRIPE_SK);

exports.getPaymentIntent = async (req, res) => {
    try {
        
        console.log("Hello from stripe payments");

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1099,
            currency: 'sek',
            automatic_payment_methods: {
              enabled: true,
            },
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