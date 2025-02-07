const defaultFieldMappings = {
    department: "department",
    location: "location",
    date: "date",
    time: "time",
    name: "name",
    email: "email",
    phone: "phone",
    more_details: "more_details",
};

/**
 * Dynamically maps fields while handling missing and new fields.
 */



const mapFields = (customMappings = {}) => {

    const defaultFieldMappings = {
        department: "department",
        location: "location",
        date: "date",
        time: "time",
        name: "name",
        email: "email",
        phone: "phone",
        more_details: "more_details",
    };

    if (!defaultFieldMappings || typeof defaultFieldMappings !== "object") return defaultFieldMappings;

    let transformedData = {};

    for (let key in defaultFieldMappings) {
        if (customMappings[key] === null) {
            // Field is marked for removal, so we skip it
            continue;
        }

        if (customMappings[key]) {
            // Modify value if mapping exists
            transformedData[key] = customMappings[key];
        } else {
            // Keep the original field value if no mapping exists
            transformedData[key] = defaultFieldMappings[key];
        }
    }

    // Add any new fields from customMappings that are missing in the original data
    for (let newField in customMappings) {
        if (!defaultFieldMappings.hasOwnProperty(newField) && customMappings[newField] !== null) {
            transformedData[newField] = customMappings[newField]; // New field with custom value
        }
    }

    return transformedData;
};

// Example customMappings to modify values
console.log(mapFields({
    department: "Chamber",       // Modify value
    location: "LA",             // Modify value
    new_field: "extra_info",    // Add new field
    time: null                  // Remove field
}));


console.log(mapFields({
    department: "chamber"
}))

const getNextScreen = async (decryptedBody) => {
    const { screen, data, version, action, flow_token } = decryptedBody;

    if (action === "ping") return { data: { status: "active" } };

    if (data?.error) {
        console.warn("Received client error:", data);
        return { data: { acknowledged: true } };
    }

    let SCREEN_RESPONSES = await handleScreenFlowJson();
    const mappedData = mapFields(data); // Dynamically map fields

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
                        is_location_enabled: Boolean(mappedData?.location),
                        is_date_enabled: Boolean(mappedData.dept) && Boolean(mappedData.loc),
                        is_time_enabled:
                            Boolean(mappedData.dept) &&
                            Boolean(mappedData.loc) &&
                            Boolean(mappedData.appointmentDate),
                        ...mappedData, // Automatically include all available data fields
                    },
                };

            case "DETAILS":
                const departmentName = "Beauty & Personal Care";
                const locationName = SCREEN_RESPONSES.APPOINTMENT.data.location.find(
                    (loc) => loc.id === mappedData.loc
                )?.title || "Unknown Location";

                const dateName = SCREEN_RESPONSES.APPOINTMENT.data.date.find(
                    (date) => date.id === mappedData.appointmentDate
                )?.title || "Unknown Date";

                const appointment = `${departmentName} at ${locationName}\n${dateName} at ${mappedData.appointmentTime || "N/A"}`;
                const details = `Name: ${mappedData.fullName || "N/A"}\nEmail: ${mappedData.emailAddress || "N/A"}\nPhone: ${mappedData.contactNumber || "N/A"}\n"${mappedData.extraInfo || ""}"`;

                return {
                    ...SCREEN_RESPONSES.SUMMARY,
                    data: {
                        appointment,
                        details,
                        ...mappedData, // Include any new fields dynamically
                    },
                };

            case "SUMMARY":
                return {
                    ...SCREEN_RESPONSES.SUCCESS,
                    data: {
                        extension_message_response: {
                            params: { flow_token, data: mappedData }, // Use mapped data to ensure field consistency
                        },
                    },
                };

            default:
                throw new Error("Unhandled screen type.");
        }
    }

    throw new Error("Unhandled request body.");
};