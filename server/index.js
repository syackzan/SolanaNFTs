const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();

// Proxy endpoint
app.post('/api/upload', async (req, res) => {
  try {
    console.log(`Trying to upload with API Key: ${process.env.TUSK_API_KEY}`);
    const response = await axios.post('https://docs.tusky.io/uploads', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.TUSK_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Upload failed with the following error:');
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No response received from the server.');
      console.error(error.request);
    } else {
      // Something else happened during the request setup
      console.error('Error setting up the request:', error.message);
    }

    // Respond with a detailed error message
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data || 'No additional details available.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
