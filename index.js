const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import the CORS middleware

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Constants
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "my-secret-token";
const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN"; // Replace with your access token
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0/523374564194215/messages";
const MONGO_URI = "mongodb+srv://pingoo:AwRlQKJJxwTYnP4l@cluster0.tzceu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update with your MongoDB URI
const DATABASE_NAME = "whatsappMessages";
const COLLECTION_NAME = "messages";

// MongoDB Client
let db;
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(DATABASE_NAME);
    console.log(`Connected to MongoDB: ${DATABASE_NAME}`);
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Webhook endpoint for receiving messages
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    body.entry.forEach(async (entry) => {
      const changes = entry.changes;
      changes.forEach(async (change) => {
        if (change.value && change.value.messages) {
          const messages = change.value.messages;

          for (const message of messages) {
            console.log("Received message:", message);

            // Save the entire message to MongoDB
            try {
              await db.collection(COLLECTION_NAME).insertOne({ rawMessage: message });
              console.log("Message saved to database:", message);
            } catch (error) {
              console.error("Error saving message to database:", error);
            }
          }
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

// GET API to fetch messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await db.collection(COLLECTION_NAME).find().toArray();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
