

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
const phoneNumberId = '396871273512965';
const accessToken = "EAAFzFylf8lMBO1ZCdBET3IfWnDlXAhZCmZAxgpjmPNUZBsTwh3OCBunpQ2YpTBmO8dpxPyVeG7rcNi0ZBEdG3HVE2bxVEAO6ZC8izvLZAvK3ZC7GZBZB5Stb3wxBJXWGwBJ8irT77N3CFu0MeKP4EgKjhw0j1WBq9R4297ZA4jM7sGcOghHcg3UOYhNUKZCpICuVSLHTIGL30BhBgboahZCeA5BvY9JAh7cnMWdZBcMZC5f4Kx9TLgZD";
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
