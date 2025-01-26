const axios = require('axios');

exports.getInGameCurrency = async (req, res) => {
    try {
        // Extract the address from query parameters
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ error: "Address is required" });
        }

        // Build the external API URL
        const buildURL = `${process.env.VERCEL_URL}/user?wallet=${address}`;

        // Make the request to the external API
        const response = await axios.get(buildURL, {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN_BEARER}`,
            },
        });

        // console.log("External API Response:", response.data.balances[0].balance);

        // Return the data as a response
        res.status(200).json(response.data.balances[0].balance);
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

exports.deductInGameCurrency = async (req, res) => {

    try {
        // Extract the address from query parameters
        const { address, amount } = req.body;

        if (!address) {
            return res.status(400).json({ error: "Address is required" });
        }

        console.log(`Address: ${address}, Amount Deduct: ${amount}`);

        // Build the external API URL
        const buildURL = `${process.env.VERCEL_URL}/user/balance/decrement?wallet=${address}&amount=${amount}`;

        // Make the request to the external API
        const response = await axios.post(
            buildURL, // The URL of the external API
            {}, // The body of the POST request (empty object in this case)
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN_BEARER}`, // Authorization header
                },
            }
        );

        console.log(response.data);

        // Return the data as a response
        res.status(200).json(response.data);
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
}