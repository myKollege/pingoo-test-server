const body = {
    key1: "value1",
    key2: "value2"
};

const appSecret = "your-app-secret-here"; // Replace with the APP_SECRET used in your server
const rawBody = JSON.stringify(body);

const hmac = CryptoJS.HmacSHA256(rawBody, appSecret); // Calculate HMAC using CryptoJS
const signature = hmac.toString(CryptoJS.enc.Hex);

fetch("http://89.116.121.214:5000/api/v1/flow-endpoint", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-hub-signature-256": `sha256=${signature}`
    },
    body: rawBody
})
    .then((response) => response.json())
    .then((data) => console.log("Response:", data))
    .catch((error) => console.error("Error:", error));