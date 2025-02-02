const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import the CORS middleware
const axios = require("axios");
const crypto = require("crypto");


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Constants
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "my-secret-token";
const ACCESS_TOKEN = "EAAOpPoBIEyoBOzOKdOtJ16JKtpSDUzo058PweeydvMcIQDX2p3HpN7DsIfp5sZCx6ff8oW4kmQofu1VoL1w5W1114AMz9h9CjymtPEUpo4l6UQxsLXeAfGWZBwlk6LuwJTr5IxcfLEX3J8NfRJFzUlZA3J7MGqthNBL8kIsqjoh5NNUDLqcwstCm0kkKzKIKQZDZD";
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0/474152522447047/messages";
const MONGO_URI = "mongodb+srv://pingoo:AwRlQKJJxwTYnP4l@cluster0.tzceu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // MongoDB URI
const DATABASE_NAME = "whatsappMessages";
const MESSAGE_COLLECTION = "messages";
const ORDER_COLLECTION = "orders";
const table_COLLECTION = "table";
const PRIVATE_KEY = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFJDBWBgkqhkiG9w0BBQ0wSTAxBgkqhkiG9w0BBQwwJAQQmrwByERyo87P639V
YSRC+wICCAAwDAYIKoZIhvcNAgkFADAUBggqhkiG9w0DBwQIu0qdlOt4SRMEggTI
xgxg5zeGShzA+l+aVFycZPQ1C1uHfAd2YG6JA2HrJbVl3MkG9BKRo3dNQr8Qlsi0
ken31SdEaEegDupiypxGBkJ6HOp18rqlH9Yc2caEjvZkn00foTO63L8PjQFBH86x
/byfGIjMgxyqwtvGDDXPSRdhicMc2dGZ1NqoI0Yhlt6yw1WHZstrKqqmtamTHCbS
JkhH5uJP2l7uM/6E9ABLtgfOLZcaZgcB1Du8iXdLTwun+l7Wut+VGKuCYmoig8rh
6v1kPj+FerKSnfEdZEnWQlnNs8Xz/gbAqzBb5ouZnLJVSjoeUY1l5gaCK/ZkHjt3
x+laNCJcCwMY1ESN/vrY1R0Xx3lPddQfW/e2P0LLV694oBUsk+LCAvpdKAqkpB5K
7Qvmc0F4pJiUdwuANDiOgCDYimBK3qmt6tX2u7GFNBFiP+9Z1q6LMGr8tuwy7Rc3
SOdbi9yO2QY6n8dTzR73R57Rh85Vkn6SQr2CQR9wMxZ1Y+i6zeXtKJqPfKYs4v/p
VB7Wi0QDgP9wzTYHHmbWM7EPLJ2yi/Oy3im0Xz35orcB70DePLDR52zYYwwyxkii
aP8YBbsAdLN2XGQZ5NSWdM6aE/W0UfDYtb/PUUfoDvFR0UV0x8ltz3Xne7PpG5bS
UNeACDA4ZKzBYEyDPXgXnsbU0RHWefHeg3Ebs66sdjB41/e3Q2/9Ht74A7G7n6l8
KAgWhmPBk2ZzWMTtSfflaHgRERsET621xmVQGOOaz5OBKKhgc1YO9bq2iKD/LqdU
FRA5n205N1cYElL4ZR+tNML7JV+y/LCt70y/6omo04qsZv7TM1v2dq66B8rz9JmN
pbVqKMxzg7VN0Rjct59DXRJOEltEVCqdwcOBz2x1QCpyohgmkU/sCeIKOySceuDE
IMlrIKCLya6VW+JVZ0O1wYnAIYNqqH4qgTur0LtJRz4/u1Aqs44K8A4IoKsltHyZ
qxzu3xCdJTL2HNwvBDJ/yIOdveD3InbgxKQ2997ad50usgRCIPUyfz40RX+U7Irh
URbBcUGIisgwxmmBLPsNBB9LChca8o6vLegYWGMqcqRSSxqYxdAmGdBzqQ5r/cmz
c+V5ey+uoseMwicl0nkqsYpBF/U5g4jl1iwcE2aRnL0oZ9j4XEnLCiixm5bkvDNm
vXbDHpkkAx4vd+Tq6ZeyW4/B9gdi6dWYphjrOA9rsJ6gVug7d1ZjvelqT/wnfmI7
V0JJb+k+1ISx30AmnTSAbWUblOLoYaxUVff2VNFsAvKIunYGygzVz/E+YE3dxsLu
r+3HX1m3Q8+SV5C75dwwmOMGgp741VYTK7YbXBR0mviMif+7sHrWuwCcqgpeWMV6
B0Wx14FASAuP97EN4mL55cH6Ay4m/5eesP9D7fjIJasJgAkD/7ah1U3B7Wg/2qga
2qRGqBCItWkiFcMaOOpizlXffS2jj8ORgwxN/0QvSje1lrQQXDgtjKz+kQJLlBnb
NJWbtCdUhOHKIxZM19lK1HTGcz0T8065WvvIXMQMo8uLawq+f3OY1bvkUPm2scTm
3/Hqe08as8XN9CtJYcLqHEN0Tal+4+EG8s9st8QXpKijTV4qLm/VeiAUpvOkse+r
OT/lfLueJPaBM5+2sr/Huqr7SZ2W+QnZ
-----END ENCRYPTED PRIVATE KEY-----`


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


// ========================================= handling response  ====================================
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

  console.log(body, 'pppppppppppppp')

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








// =========================== set up flow endpoint  ==================================================================



const SCREEN_RESPONSES = {
  APPOINTMENT: {
    screen: "APPOINTMENT",
    data: {
      department: [
        {
          "id": "Cardiology",
          "title": "Cardiology"
        },
        {
          "id": "Neurology",
          "title": "Neurology"
        }
      ],
      location: [
        {
          "id": "1",
          "title": "King’s Cross, London"
        },
        {
          "id": "2",
          "title": "Oxford Street, London"
        }

      ],
      is_location_enabled: true,
      date: [
        {
          "id": "2022-02-28",
          "title": "Mon Feb 28 2025"
        }
      ],
      is_date_enabled: true,
      time: [
        {
          "id": "10:30",
          "title": "10:30"
        },
        {
          "id": "11:30",
          "title": "11:30"
        }

      ],
      is_time_enabled: true,
    }
  },
  DETAILS: {
    screen: "DETAILS",
    data: {
      department: "beauty",
      location: "1",
      date: "2024-01-01",
      time: "11:30",
    },
  },
  SUMMARY: {
    screen: "SUMMARY",
    data: {
      appointment:
        "Beauty & Personal Care Department at Kings Cross, London\nMon Jan 01 2024 at 11:30.",
      details:
        "Name: John Doe\nEmail: john@example.com\nPhone: 123456789\n\nA free skin care consultation, please",
      department: "beauty",
      location: "1",
      date: "2024-01-01",
      time: "11:30",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      more_details: "A free skin care consultation, please",
    },
  },
  TERMS: {
    screen: "TERMS",
    data: {},
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "REPLACE_FLOW_TOKEN",
          some_param_name: "PASS_CUSTOM_VALUE",
        },
      },
    },
  },
};;

const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;

  if (action === "ping") {
    return { data: { status: "active" } };
  }

  if (data?.error) {
    console.warn("Received client error:", data);
    return { data: { acknowledged: true } };
  }

  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.APPOINTMENT,
      data: {
        ...SCREEN_RESPONSES.APPOINTMENT.data,
        is_location_enabled: false,
        is_date_enabled: false,
        is_time_enabled: false,
      },
    };
  }

  if (action === "data_exchange") {
    switch (screen) {
      case "APPOINTMENT":
        return {
          ...SCREEN_RESPONSES.APPOINTMENT,
          data: {
            ...SCREEN_RESPONSES.APPOINTMENT.data,
            is_location_enabled: Boolean(data.department),
            is_date_enabled: Boolean(data.department) && Boolean(data.location),
            is_time_enabled:
              Boolean(data.department) &&
              Boolean(data.location) &&
              Boolean(data.date),
            location: SCREEN_RESPONSES.APPOINTMENT.data.location.slice(0, 3),
            date: SCREEN_RESPONSES.APPOINTMENT.data.date.slice(0, 3),
            time: SCREEN_RESPONSES.APPOINTMENT.data.time.slice(0, 3),
          },
        };

      case "DETAILS":
        const departmentName = "Beauty & Personal Care";
        const locationName = SCREEN_RESPONSES.APPOINTMENT.data.location.find(
          (loc) => loc.id === data.location
        )?.title;
        const dateName = SCREEN_RESPONSES.APPOINTMENT.data.date.find(
          (date) => date.id === data.date
        )?.title;

        const appointment = `${departmentName} at ${locationName}\n${dateName} at ${data.time}`;

        const details = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n"${data.more_details}"`;

        return {
          ...SCREEN_RESPONSES.SUMMARY,
          data: {
            appointment,
            details,
            ...data,
          },
        };

      case "SUMMARY":
        return {
          ...SCREEN_RESPONSES.SUCCESS,
          data: {
            extension_message_response: {
              params: {
                flow_token,
              },
            },
          },
        };

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error("Unhandled endpoint request.");
};

const decryptRequest = (body, privateKey) => {
  const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;

  const decryptedAesKey = crypto.privateDecrypt(
    {
      key: crypto.createPrivateKey({
        key: privateKey,
        passphrase: "g746fXi|!5b9<735", // Add passphrase here
      }),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encrypted_aes_key, "base64")
  );
  const flowDataBuffer = Buffer.from(encrypted_flow_data, "base64");
  const initialVectorBuffer = Buffer.from(initial_vector, "base64");

  const TAG_LENGTH = 16;
  const encryptedFlowBody = flowDataBuffer.subarray(0, -TAG_LENGTH);
  const encryptedFlowTag = flowDataBuffer.subarray(-TAG_LENGTH);

  const decipher = crypto.createDecipheriv(
    "aes-128-gcm",
    decryptedAesKey,
    initialVectorBuffer
  );
  decipher.setAuthTag(encryptedFlowTag);

  const decryptedJSONString = Buffer.concat([
    decipher.update(encryptedFlowBody),
    decipher.final(),
  ]).toString("utf-8");

  return {
    decryptedBody: JSON.parse(decryptedJSONString),
    aesKeyBuffer: decryptedAesKey,
    initialVectorBuffer,
  };
};

const encryptResponse = (
  response,
  aesKeyBuffer,
  initialVectorBuffer
) => {
  const flippedIV = Buffer.from(initialVectorBuffer.map((byte) => ~byte));

  const cipher = crypto.createCipheriv("aes-128-gcm", aesKeyBuffer, flippedIV);
  const encryptedResponse = Buffer.concat([
    cipher.update(JSON.stringify(response), "utf-8"),
    cipher.final(),
  ]);

  return Buffer.concat([
    encryptedResponse,
    cipher.getAuthTag(),
  ]).toString("base64");
};

app.use(express.json());

app.post("/flow", async (req, res) => {
  try {
    const { body } = req;
    const { decryptedBody, aesKeyBuffer, initialVectorBuffer } = decryptRequest(
      body,
      PRIVATE_KEY
    );

    const responseData = await getNextScreen(decryptedBody);
    const encryptedResponse = encryptResponse(
      responseData,
      aesKeyBuffer,
      initialVectorBuffer
    );

    res.send(encryptedResponse);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(421).send({
      message: "Unable to decrypt request payload.",
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({
    data: {
      status: "active",
    },
  });
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
      `https://graph.facebook.com/v21.0/601959412989825/messages`,
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