const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Constants
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "my-secret-token";
const ACCESS_TOKEN = "EAAWQBCW9JhkBO40FHqmfcIMjGOF2md6ajzzj4RlMeToFxLUBpSfy4p5fF65fRxorHIzbJ9uxNREuadvYgrGQy3HLvhr5G6QCxSdnq0eWSpl76SIf7WatXWUJTKyCdkUMTTlZCKtCvybZC5ogaIZCYHIVkXhnwel1mQFeIVQDVZCYqcdKkUpMJr1f3UWQ5cjRCsArHGCHrggRRuZBgZBY6AmU7CYzNxDpGvhXAvqYKfARQZD"; // Replace with your access token
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0/523374564194215/messages";
const PHONE_NUMBER_ID = "523374564194215";
const ACCOUNT_ID = "516787181518685";
const MONGO_URI = "mongodb+srv://pingoo:AwRlQKJJxwTYnP4l@cluster0.tzceu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Update this with your MongoDB URI

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Define a Message schema
const messageSchema = new mongoose.Schema(
  {
    from: String,
    body: String,
    timestamp: Number,
    messageId: String,
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

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
              const newMessage = new Message({
                rawMessage: message, // Save the raw message object
              });

              await newMessage.save();
              console.log("Raw message saved to database:", newMessage);
            } catch (error) {
              console.error("Error saving raw message to database:", error);
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
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
