

async function setBusinessPublicKey(phoneNumberId, accessToken, businessPublicKey) {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/whatsapp_business_encryption`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            business_public_key: businessPublicKey,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Public Key Set:', data);
    } else {
        const error = await response.json();
        console.error('Error:', error);
    }
}

// Example Usage
const phoneNumberId = '587413964445127';
const accessToken = "EAAOpPoBIEyoBOzOKdOtJ16JKtpSDUzo058PweeydvMcIQDX2p3HpN7DsIfp5sZCx6ff8oW4kmQofu1VoL1w5W1114AMz9h9CjymtPEUpo4l6UQxsLXeAfGWZBwlk6LuwJTr5IxcfLEX3J8NfRJFzUlZA3J7MGqthNBL8kIsqjoh5NNUDLqcwstCm0kkKzKIKQZDZD";
const businessPublicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApVbY7/cvD0rrDNw/Gb5v
48sYH8ZFnL+0Y2MMIF22t1Z+1/dGqDwA5jLu8jkiguZJiXnGLHoptJgQJrAxKCHz
9gTwFDrvMnuASguujiGYKuK2wdsLoTkTWpizGf6ySosBR7fmoLZl09ndSUEPEIjz
jKpKxUO7GVX4JmDYfYag+O88Hm+dQRUrt45VsAWUuwAyr8OVlqQhAI7YtLlteAIM
Wiz8lxm5ee48BIRKqJ9Ivzj41ir/XO9VT8w53gYZziIBrneoVAduziSgxrqGVUJE
FzjVKHNnTxbWPr83hhcFs9G2ZaiwKrD1X2KZI54poJAq/mCNW2CW4eqvraJWsClt
uQIDAQAB
-----END PUBLIC KEY-----
`;

setBusinessPublicKey(phoneNumberId, accessToken, businessPublicKey);
