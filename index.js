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
const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0/474152522447047/messages";
const MONGO_URI = "mongodb+srv://pingoo:AwRlQKJJxwTYnP4l@cluster0.tzceu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // MongoDB URI
const DATABASE_NAME = "whatsappMessages";


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

app.post("/pinggo-webhook", async (req, res) => {
    const body = req.body;
    const response = await axios.post(
        "http://20.193.155.204:5000/api/v1/whatsapp/webhook",
        body,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    res.sendStatus(200);
});



// =========================== set up flow endpoint  ==================================================================




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













