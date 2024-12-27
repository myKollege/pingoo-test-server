const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // Replace with your desired port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define the webhook endpoint
app.post('/api/whatsapp/webhook', (req, res) => {
  // Access the webhook event data from the request body
  const event = req.body;

  // Process the event 
  console.log('Received WhatsApp event:', event); 

  // Example: Handle incoming messages
  if (event.object === 'whatsapp_business_account' && event.entry && event.entry[0].changes) {
    const changes = event.entry[0].changes;
    changes.forEach(change => {
      if (change.value.messages) {
        const message = change.value.messages[0];
        console.log('Received message:', message);

        // Handle the message (e.g., send a response)
        // ...
      }
    });
  }

  res.status(200).send('Event received successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});