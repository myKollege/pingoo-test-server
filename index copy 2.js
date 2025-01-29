const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import the CORS middleware
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Constants
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "my-secret-token";
const ACCESS_TOKEN = "EAAFzFylf8lMBOwRfzQc3ZA75HdDLrUZBDKiIcOmApg0g9Uu4HCPXvy8UZCZCrvfghBIGKPXlXv4LgtCZCCiMJMvtL5dCt9jx76v0KQuqejANGhILWW0PgIZBmzPin1lNAABgiBhzFhBSs7sLnKo6wrCStOuzop5YQaT9VZC5zn9rECCBHY29SdDiOU789b0TGJLBROeMvZABiIKC1pN0LlIF3QqZA4QCV6A4rBZCgEW8DqZBb0ZD";
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0/474152522447047/messages";
const MONGO_URI = "mongodb+srv://pingoo:AwRlQKJJxwTYnP4l@cluster0.tzceu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // MongoDB URI
const DATABASE_NAME = "whatsappMessages";
const MESSAGE_COLLECTION = "messages";
const ORDER_COLLECTION = "orders";
const table_COLLECTION = "table";


// MongoDB Client and Connection Handling
let db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(DATABASE_NAME);
    console.log(`Connected to MongoDB: ${DATABASE_NAME}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if database connection fails
  }
}

// Webhook endpoint for receiving messages

// Webhook endpoint
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    try {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value && change.value.messages) {
            for (const message of change.value.messages) {
              console.log("Received message:", message);

              if (message?.type === "text") {
                // Save messages
                // try {

                //   // if (message?.text?.body && message?.text?.body?.includes('demo_restaurant')) {
                //   //   console.log('found', message?.from);
                //   //   await sendMessage(message?.from, 'select_category')
                //   //   const tableNoMatch = message?.text?.body?.match(/table-(\d+)/);
                //   //   const tableNo = tableNoMatch ? tableNoMatch[1] : null;
                //   //   const user = message?.from

                //   //   console.log(user, tableNo, 'pppppppp')

                //   //   await db.collection(table_COLLECTION).insertOne({ tableNo, user, message: message.text.body });
                //   //   // await sendMessage(user, 'select_category')

                //   // }

                //   // else if (message?.text?.body && message?.text?.body?.includes('demo_booking')) {

                //   //   await sendMessage(message?.from, 'demo_appointment_booking')

                //   // }
                //   // else if (message?.text?.body && message?.text?.body?.includes('demo_shop')) {

                //   //   await sendMessage(message?.from, 'catalog_offer_test_two')

                //   // }
                //   // else if (message?.text?.body && message?.text?.body?.includes('school_start_demo')) {

                //   //   await sendMessage(message?.from, 'school_start_demo')

                //   // }












                //   await db.collection(MESSAGE_COLLECTION).insertOne({ rawMessage: message });
                //   console.log("Message saved to database:", message);
                // } catch (error) {
                //   console.error("Error saving message to database:", error);
                // }
              }
              // if (message.type === "order") {
              //   // Save orders
              //   try {
              //     await db.collection(ORDER_COLLECTION).insertOne({ rawOrder: message });
              //     console.log("Order saved to database:", message);
              //   } catch (error) {
              //     console.error("Error saving order to database:", error);
              //   }
              // }

              if (message.type === 'interactive') {
                await sendMessage(message?.from, 'catalog_offer_test_two')
              }


              if (message.type === 'button') {
                console.log(message?.button)


                if (message?.button?.text == 'Brochure') {
                  sendMessage(message?.from, 'demo_appointment_booking', 'flow')
                }
                if (message?.button?.text?.toLowerCase() == 'apply now') {
                  sendMessage(message?.from, 'school_lead_demo', 'flow')
                }
                if (message?.button?.text?.toLowerCase() == 'get support') {
                  sendMessage(message?.from, 'school_support_demo', 'flow')
                }
              }










            }
          }
        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.sendStatus(500);
    }
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
      `https://graph.facebook.com/v21.0/474152522447047/messages`,
      {
        "messaging_product": "whatsapp",
        "to": phoneNumber,
        "type": "template",
        "template": {
          "name": message,
          "language": {
            "code": "en_US"
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, 'pppppppppppppppppppppppp')
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error sending message:", error.response.data);
    res.status(500).send(error.response.data);
  }
});
// Endpoint to send messages


// GET API to fetch messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await db.collection(MESSAGE_COLLECTION).find().toArray();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages");
  }
});

// GET endpoint to fetch all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await db.collection(ORDER_COLLECTION).find().toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
app.get("/tables", async (req, res) => {
  try {
    const orders = await db.collection(table_COLLECTION).find().toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Start the server after the database is connected
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});














// ========== send message

async function sendMessage(phoneNumber, template_Name, type = 'text') {



  let body = {
    "messaging_product": "whatsapp",
    "to": phoneNumber,
    "type": "template",
    "template": {
      "name": template_Name,
      "language": {
        "code": "en_US"
      }
    }
  }





  if (type == 'flow') {
    body =
    {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "template",
      "template": {
        "name": template_Name,
        "language": {
          "code": "en_US"
        },
        "components": [
          {
            "type": "button",
            "sub_type": "flow",
            "index": "0"
          }

        ]
      }
    }
  }




  if (template_Name == 'select_category') {
    body = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "template",
      "template": {
        "name": "select_category",
        "language": {
          "code": "en_US"
        },
        "components": [
          {
            "type": "header",
            "parameters": [
              {
                "type": "image",
                "image": {
                  "link": "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
              }
            ]
          },

          {
            "type": "button",
            "sub_type": "flow",
            "index": "0"
          }

        ]
      }
    }
  }
  if (template_Name == 'catalog_offer_test_two') {
    body =
    {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "template",
      "template": {
        "name": "catalog_offer_test_two",
        "language": {
          "code": "en_US"
        },
        "components": [
          /* Body component required if template uses variables, otherwise omit */
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": "100"
              },
              {
                "type": "text",
                "text": "400"
              },
              {
                "type": "text",
                "text": "3"
              }
            ]
          },
          {
            "type": "button",
            "sub_type": "CATALOG",
            "index": 0,
            "parameters": [
              {
                "type": "action",
                "action": {
                  "thumbnail_product_retailer_id": "6xjumexzvm"
                }
              }
            ]
          }
        ]
      }
    }
  }







  if (template_Name == 'demo_appointment_booking') {
    body =
    {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phoneNumber,
      "type": "template",
      "template": {
        "name": "demo_appointment_booking",
        "language": {
          "code": "en_US"
        },
        "components": [
          {
            "type": "button",
            "sub_type": "flow",
            "index": "0"
          }

        ]
      }
    }
  }




  try {

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/474152522447047/messages`,
      body,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );


  }
  catch (e) {

  }
} 