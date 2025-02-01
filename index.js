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
const ACCESS_TOKEN = "EAAFzFylf8lMBO97iMEbv1J1MZCQ3kkR2qrP9YdSqMW7upXJGrY4Neg9bG1SgSBBG5zfFROoaZB1PC7sHvkuM5WzP42cZAaxXdt5eZCRb5ipZCn0lV9bFKo2sYxAFvPt3Tn3oldCbQS18tMPO8Qpxu76GQOrd6Obz01VUWg6jwvjZCKfUIj2TCV1ufLdWjp7WtMMk4Q9SX1z2nzZCZBHSqSVT705p2vuCKoRCtQ9mIyTTeuQZD";
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

              // if (message?.type === "text") {
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
              // }
              // if (message.type === "order") {
              //   // Save orders
              //   try {
              //     await db.collection(ORDER_COLLECTION).insertOne({ rawOrder: message });
              //     console.log("Order saved to database:", message);
              //   } catch (error) {
              //     console.error("Error saving order to database:", error);
              //   }
              // }


              if (message?.type === "text") {

                if (message?.text?.body && message?.text?.body?.includes('school demo')) {
                  console.log('found', message?.from);
                  sendMessage(message?.from, 'school_demo2', 'text', "en")

                }
              } else if (message.type === 'interactive') {
                await sendMessage(message?.from, 'thank_you_message')

              }

              else if (message.type === 'button') {
                console.log(message?.button)
                console.log(message?.button?.text)

                if (message?.button?.text == 'Brochure') {
                  await sendMessage(message?.from, 'school_brochure2')

                }
                else if (message?.button?.text == 'Application From') {
                  console.log('here  ++++++++++++++', 'Application From')
                  await sendMessage(message?.from, 'apply_for_school', 'flow')

                }
                else if (message?.button?.text == 'Support') {
                  console.log('here  ++++++++++++++', 'Support From')
                  await sendMessage(message?.from, 'school_support', 'flow')

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
app.post("/pinggo-webhook", async (req, res) => {
  const body = req.body;

  // if (body.object === "whatsapp_business_account") {
  //   try {
  //     for (const entry of body.entry) {
  //       for (const change of entry.changes) {
  //         if (change.value && change.value.messages) {
  //           for (const message of change.value.messages) {
  //             console.log("Received message:", message);

  //             // if (message?.type === "text") {
  //             // Save messages
  //             // try {

  //             //   // if (message?.text?.body && message?.text?.body?.includes('demo_restaurant')) {
  //             //   //   console.log('found', message?.from);
  //             //   //   await sendMessage(message?.from, 'select_category')
  //             //   //   const tableNoMatch = message?.text?.body?.match(/table-(\d+)/);
  //             //   //   const tableNo = tableNoMatch ? tableNoMatch[1] : null;
  //             //   //   const user = message?.from

  //             //   //   console.log(user, tableNo, 'pppppppp')

  //             //   //   await db.collection(table_COLLECTION).insertOne({ tableNo, user, message: message.text.body });
  //             //   //   // await sendMessage(user, 'select_category')

  //             //   // }

  //             //   // else if (message?.text?.body && message?.text?.body?.includes('demo_booking')) {

  //             //   //   await sendMessage(message?.from, 'demo_appointment_booking')

  //             //   // }
  //             //   // else if (message?.text?.body && message?.text?.body?.includes('demo_shop')) {

  //             //   //   await sendMessage(message?.from, 'catalog_offer_test_two')

  //             //   // }
  //             //   // else if (message?.text?.body && message?.text?.body?.includes('school_start_demo')) {

  //             //   //   await sendMessage(message?.from, 'school_start_demo')

  //             //   // }












  //             //   await db.collection(MESSAGE_COLLECTION).insertOne({ rawMessage: message });
  //             //   console.log("Message saved to database:", message);
  //             // } catch (error) {
  //             //   console.error("Error saving message to database:", error);
  //             // }
  //             // }
  //             // if (message.type === "order") {
  //             //   // Save orders
  //             //   try {
  //             //     await db.collection(ORDER_COLLECTION).insertOne({ rawOrder: message });
  //             //     console.log("Order saved to database:", message);
  //             //   } catch (error) {
  //             //     console.error("Error saving order to database:", error);
  //             //   }
  //             // }


  //             if (message?.type === "text") {

  //               if (message?.text?.body && message?.text?.body?.includes('school demo')) {
  //                 console.log('found', message?.from);
  //                 sendMessage(message?.from, 'school_demo2', 'text', "en")

  //               }
  //             } else if (message.type === 'interactive') {
  //               await sendMessage(message?.from, 'thank_you_message')

  //             }

  //             else if (message.type === 'button') {
  //               console.log(message?.button)
  //               console.log(message?.button?.text)

  //               if (message?.button?.text == 'Brochure') {
  //                 await sendMessage(message?.from, 'school_brochure2')

  //               }
  //               else if (message?.button?.text == 'Application From') {
  //                 console.log('here  ++++++++++++++', 'Application From')
  //                 await sendMessage(message?.from, 'apply_for_school', 'flow')

  //               }
  //               else if (message?.button?.text == 'Support') {
  //                 console.log('here  ++++++++++++++', 'Support From')
  //                 await sendMessage(message?.from, 'school_support', 'flow')

  //               }
  //             }










  //           }
  //         }
  //       }
  //     }
  //     res.sendStatus(200);
  //   } catch (error) {
  //     console.error("Error processing webhook:", error);
  //     res.sendStatus(500);
  //   }


  // } else {
  //   res.sendStatus(404);
  // }

  res.sendStatus(200);
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

async function sendMessage(phoneNumber, template_Name, type = 'text', language = "en_US") {


  if (!phoneNumber || !template_Name) {
    return
  }



  let body = {
    "messaging_product": "whatsapp",
    "to": phoneNumber,
    "type": "template",
    "template": {
      "name": template_Name,
      "language": {
        "code": language
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


  if (template_Name == 'school_brochure2') {
    body = {
      "messaging_product": "whatsapp",
      "to": phoneNumber,
      "type": "template",
      "template": {
        "name": "school_brochure2",
        "language": {
          "code": "en_US"
        }
      },
      "components": [
        {
          "type": "BUTTONS",
          "buttons": [
            {
              "type": "URL",
              "text": "Download Brochure",
              "url": "https://drive.google.com/file/d/10zzA2bRWozpKUgZNCcXMD_MbRTt07BCd/view"
            }
          ]
        }
      ]
    }
  }






  console.log(body, '[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[')

  try {

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/396871273512965/messages`,
      body,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json()
    console.log(result, '|||||||||||||||||||||||||||||||')


  }
  catch (e) {

  }
} 