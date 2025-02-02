import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PRIVATE_KEY = `-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFJDBWBgkqhkiG9w0BBQ0wSTAxBgkqhkiG9w0BBQwwJAQQ8L3ulP+bgxPQcZ/h
iat88wICCAAwDAYIKoZIhvcNAgkFADAUBggqhkiG9w0DBwQINCGVkkW2e5sEggTI
0uOiMB1f2dQEG+Yb/5mIGpQcm30idEeTCn7gj/oPGOCCrDYn2OPHgocZ36HzVYid
DQr5/BuedbHCMK+KSVXcuj7AQycZrFVrt7mwhL9of+v2LaLqRAHnC0QhjbghdUBe
IXeqK3B15H6xhxVDeVelChMXxO0tDWX4OTJ+FEp/pPeCiLZ3bt16LoTG3s4JHa3o
7fikMLnb0t7aoWnM3zBxyqJwxCqumVroEKvyYUwjRdPcJ13rjWgWzrfR8RrhHbN4
RpxPtINe3mwNLEl6+yI7GlfVWIYh1oeBvfDvGEuME9VEtlzViUS1TW1Gvlwxt7vn
QZQxSBUqJQG7xoBWF2n8d9+xdtZxDoKBvHf0IRWyraHPvuy1JujFw3EqbOebmtZl
6CemYMT1jDLraE3Oo6dAMhfAX7whWAUQjHEw0p0HSXHJ7eVxFym02yuAUL+zIiWi
ClssVIQZFD63w5Bpxi99Hys9M/HYkIkldskqESBCCWC23PVZ/MDELPd5cyCEcMNP
CCjBd9xIjvbYonWeDcDMyMr5S0xG5scWb6o8UNIvq6SFbYd8hRtCS2u80gq7pxrI
rQLDpztJcMpULtn9BDId8KCsVfASSepZUgclhbsTtPeQmS3ohX5nXAMgzFMCVwvo
pk/q4qENQWxsIxVR3OTf0rHcsSGwaxZXM3e+WzkTrp5Q9rnI6raqXomtkacyzCDj
9ZXwFyomiIAB39Yg+CsimLRqKyMbEbkoNWPS3GdUH/f3JagS7z/kYCwrDDNxmYYk
icH8O+Iah7u6S9Jy1CsADI3KFU5/aQ/L51kk2v2cSN7TkmXFnmmTI+Ojm96htgIr
N3cImUras8JZG/JdVwtxOxvQ87AYS+qd5ZR5zyUuOZ+gJTWa2+vE9SBxX0DRHY7q
67vbfsztzcvw7JhzSl6C6Etfr7/LR4qLjbdq/VHUVbEU6sOKKQqXrNazKe5kvBiN
jx2o0cjKE9suZuMz+zlVcHREWwVk1PjEsSM3Y05+fT2zCXriBSMzcAacSZ7ftZy0
B0ol/8hghSjBZj1WbULWuUytruZSCKXf9YvHINJHu4Swuz9C3g0Xc4sqYT3lnybi
On5I/sbRzTSMLacqm0xRD0orDwUVwhdqeykGMN4yTzslZScGyOMPoQGLdrAaoCYa
hb4KlBJKZX8w9HfDm+sfSAJQ3tytE757HvECaYkMNZckUwX7aWGWqzoWGOonogKb
M1LLbImN16NoPVtwIA57kY4qfKGly9naJS90s+047RmJiqDjlrwla2DoWmVVUplw
G68jP3wMIeouy8QWkCARFm18/yrNqU90+gHFvIWqxzI2YJmdR6+C4XOmXs0E7OtI
OSbp3LOjyGHd5QkDPWut6EAlLcva0rXV101chQhRHcOkZmIYmZKXLAIxJvHAQ2lg
5XevIE2i8n4KDwLTlkhiNaA4sULrKID209nQnCuxbGLMEKwumgDHAMkJnhuiMSL6
ABK3yqsvwHoCtfNqkeQm0+yO2vdlMJJMC9Oe3q5uvwYtzLBEDz4MMS8Dto8YRBLK
CoQtS+jYzlL/uKW2uyassPtDcd4OhflqBGpVFOHBai7GSNGHXz5Jxh/LhaDyfy7K
ypfvbHoCbiPspv1d4abPT1rQNtNfBTt4
-----END ENCRYPTED PRIVATE KEY-----`



const SCREEN_RESPONSES = {
    APPOINTMENT: {
        screen: "APPOINTMENT",
        data: {
            department: [
                {
                    id: "shopping",
                    title: "Shopping & Groceries",
                },
                {
                    id: "clothing",
                    title: "Clothing & Apparel",
                },
                {
                    id: "home",
                    title: "Home Goods & Decor",
                },
                {
                    id: "electronics",
                    title: "Electronics & Appliances",
                },
                {
                    id: "beauty",
                    title: "Beauty & Personal Care",
                },
            ],
            location: [
                {
                    id: "1",
                    title: "King\u2019s Cross, London",
                },
                {
                    id: "2",
                    title: "Oxford Street, London",
                },
                {
                    id: "3",
                    title: "Covent Garden, London",
                },
                {
                    id: "4",
                    title: "Piccadilly Circus, London",
                },
            ],
            is_location_enabled: true,
            date: [
                {
                    id: "2024-01-01",
                    title: "Mon Jan 01 2024",
                },
                {
                    id: "2024-01-02",
                    title: "Tue Jan 02 2024",
                },
                {
                    id: "2024-01-03",
                    title: "Wed Jan 03 2024",
                },
            ],
            is_date_enabled: true,
            time: [
                {
                    id: "10:30",
                    title: "10:30",
                },
                {
                    id: "11:00",
                    title: "11:00",
                    enabled: false,
                },
                {
                    id: "11:30",
                    title: "11:30",
                },
                {
                    id: "12:00",
                    title: "12:00",
                    enabled: false,
                },
                {
                    id: "12:30",
                    title: "12:30",
                },
            ],
            is_time_enabled: true,
        },
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
                passphrase: "129400", // Add passphrase here
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

app.post("/data", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
