const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "my-secret-token";
const ACCESS_TOKEN = "EAAWQBCW9JhkBO40FHqmfcIMjGOF2md6ajzzj4RlMeToFxLUBpSfy4p5fF65fRxorHIzbJ9uxNREuadvYgrGQy3HLvhr5G6QCxSdnq0eWSpl76SIf7WatXWUJTKyCdkUMTTlZCKtCvybZC5ogaIZCYHIVkXhnwel1mQFeIVQDVZCYqcdKkUpMJr1f3UWQ5cjRCsArHGCHrggRRuZBgZBY6AmU7CYzNxDpGvhXAvqYKfARQZD"; // Replace with your access token
const WHATSAPP_API_URL = " https://graph.facebook.com/v21.0/523374564194215/messages";
const PHONE_NUMBER_ID = "523374564194215"
const ACCOUNT_ID = "516787181518685"

// Webhook endpoint for receiving messages
app.post("/webhook", (req, res) => {
  const body = req.body;

  // Verify this is a webhook from WhatsApp
  if (body.object === "whatsapp_business_account") {
    body.entry.forEach((entry) => {
      const changes = entry.changes;
      changes.forEach((change) => {
        if (change.value && change.value.messages) {
          const messages = change.value.messages;
          messages.forEach((message) => {
            console.log("Received message:", message);
            // Process the message and respond if needed
          });
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Verification endpoint for webhook setup
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});


// Endpoint to send messages
app.post("/send-message", async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/<phone-number-id>/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error sending message:", error.response.data);
    res.status(500).send(error.response.data);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
