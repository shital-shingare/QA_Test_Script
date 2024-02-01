const axios = require("axios");

const mainCRMData = {
    VIN_NO: "89916490634626393163",
    ICCID: "89916490634626393163",
    UIN_NO: "ACON4IA202200079317",
    DEVICE_IMEI: "868274066912314",
    DEVICE_MAKE: "Accolade",
    DEVICE_MODEL: "ACON4NA",
    ENGINE_NO: "ENGINE_SR_N_30032103",
    REG_NUMBER: "PB09AZ2103",
    VEHICLE_OWNER_FIRST_NAME: "Shivam",
    VEHICLE_OWNER_MIDDLE_NAME: "Shivam",
    VEHICLE_OWNER_LAST_NAME: "Shivam",
    ADDRESS_LINE_1: "123",
    ADDRESS_LINE_2: "456",
    VEHICLE_OWNER_CITY: "Belgavi",
    VEHICLE_OWNER_DISTRICT: "Belgavi",
    VEHICLE_OWNER_STATE: "Karanataka",
    VEHICLE_OWNER_COUNTRY: "India",
    VEHICLE_OWNER_PINCODE: "411045",
    VEHICLE_OWNER_REGISTERED_MOBILE: "9156419214",
    DEALER_CODE: "1133",
    POS_CODE: "AB123",
    POA_DOC_NAME: "PANAB123",
    POA_DOC_NO: "PAN1AB123",
    POI_DOC_TYPE: "ADHARAB123",
    POI_DOC_NO: "ADHARXYZ123",
    RTO_OFFICE_CODE: "MH 12",
    RTO_STATE: "MH",
    PRIMARY_OPERATOR: "BSNL",
    PRIMARY_MOBILE_NUMBER: "1234567890",
    SECONDARY_OPERATOR: "BHA",
    SECONDARY_MOBILE_NUMBER: "9876543210",
    VEHICLE_MODEL: "NANO",
    COMMERCIAL_ACTIVATION_START_DATE: "2023-10-04",
    COMMERCIAL_ACTIVATION_EXPIRY_DATE: "",
    ACCOLADE_POSTING_DATE_TIME: "2023-10-04",
    MFG_YEAR: "2023",
    INVOICE_DATE: "2023-10-04",
};

const mainFEData = {
    VIN_NO: "89916555634626394163",
    ICCID: "89916490634626390375",
    REQUEST_TYPE: "New",
    CERTIFICATE_VALIDITY_DURATION_IN_YEAR: 2,
    RTO_STATE: "MAHARASHTRA",
    RTO_OFFICE_CODE: "MH01",
    VEHICLE_OWNER_REGISTERED_MOBILE: "999999999",
    VEHICLE_OWNER_NAME: "Rajesh Kumar",
    COMMERCIAL_ACTIVATION_START_DATE: "2023-06-01",
    COMMERCIAL_ACTIVATION_EXPIRY_DATE: "2025-06-01",
};

const mainTicketStatusData = {
    VIN_NO: "89916555634626391631",
    ICCID: "89916490634626390375",
    Ticket_No: "AEPL-240121-2",
};

const qaTokenRequestBody = { username: "accoladeCrm", password: "admin@123" };
const productionTokenRequestBody = {
    username: "accoladeCrm",
    password: "admin@123",
};
const mainTokenRequestBody = qaTokenRequestBody;

async function makeRequest(url, options) {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
}

function generateRandomString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

function dateGeneratorYYMMDD() {
    const today = new Date();

    const year = today.getFullYear() % 100;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}`;

    return formattedDate; // Output: YYMMDD
}

async function tokenGenerator(tokenRequestBody) {
    const tokenURL = "http://20.219.88.214:6109/api/crm/generateToken";
    const tokenHeaders = { "Content-Type": "application/json" };

    const tokenResponse = await makeRequest(tokenURL, {
        method: "POST",
        headers: tokenHeaders,
        body: JSON.stringify(tokenRequestBody),
    });
    return tokenResponse;
}

async function saveCRMDataAPI(headers, saveCRMDataRequestBody) {
    const saveCRMDataURL = "http://20.219.88.214:6109/api/crm/saveCrmData";

    const tokenResponse = await makeRequest(saveCRMDataURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(saveCRMDataRequestBody),
    });
    return tokenResponse;
}

async function saveFleetedgeDataAPI(headers, saveFleetedgeRequestBody) {
    const saveFleetedgeURL =
        "http://20.219.88.214:6109/api/crm/saveFleetedgeData";

    const fleetedgeResponse = await makeRequest(saveFleetedgeURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(saveFleetedgeRequestBody),
    });
    return fleetedgeResponse;
}

async function getTicketStatusAPI(headers, getTicketStatusRequestBody) {
    const getTicketStatusURL =
        "http://20.219.88.214:6109/api/crm/getTicketStatus";

    try {
        const ticketResponse = await axios.get(getTicketStatusURL, {
            headers: headers,
            data: getTicketStatusRequestBody,
        });
        return ticketResponse;
    } catch (error) {
        return error; // Handle error appropriately
    }
}

/*
 Test Cases for Generate Token API
 */

async function generateToken_ValidUsernameValidPassword_TokenGenerated() {
    let tokenRequestBody = mainTokenRequestBody;
    const tokenResponse = await tokenGenerator(tokenRequestBody);

    const responseData = await tokenResponse.json();
    const errors = [];

    // Assertions
    if (tokenResponse.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${tokenResponse.status}" expected "200"`
        );
    }
    if (tokenResponse.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${tokenResponse.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not True in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Token Generated") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Token Generated"`
        );
    }
    if (!responseData.token) {
        errors.push(`Token is not present in the response expected a Token`);
    }
    if (errors.length > 0) {
        console.log(
            "Test generateToken_ValidUsernamePassword_TokenGenerated: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test generateToken_ValidUsernamePassword_TokenGenerated: PASS"
        );
    }
}

async function generateToken_InvalidUsernameInvalidPassword_TokenNotGenerated() {
    let tokenRequestBody = JSON.parse(JSON.stringify(mainTokenRequestBody));
    tokenRequestBody.username = "invalid username";
    tokenRequestBody.password = "invalid password";
    const tokenResponse = await tokenGenerator(tokenRequestBody);
    const responseData = await tokenResponse.json();
    const errors = [];

    // Assertions
    if (tokenResponse.status !== 500) {
        errors.push(
            `Response status is not 500 in the response. Response Status: "${tokenResponse.status}" expected "500"`
        );
    }
    if (tokenResponse.statusText !== "Internal Server Error") {
        errors.push(
            `Response status text is not Internal Server Error in the response. Response Status: "${tokenResponse.statusText}" expected "Internal Server Error"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not False in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }
    if (responseData.message !== "Invalid User") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Invalid User"`
        );
    }
    if (responseData.token) {
        errors.push(`Token should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test generateToken_InvalidUsernameInvalidPassword_TokenNotGenerated: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test generateToken_InvalidUsernameInvalidPassword_TokenNotGenerated: PASS"
        );
    }
}

async function generateToken_MissingPassword_TokenNotGenerated() {
    let tokenRequestBody = {
        username: "accoladeCrm",
    };
    const tokenResponse = await tokenGenerator(tokenRequestBody);
    const responseData = await tokenResponse.json();
    const errors = [];

    
    
    // Assertions
    if (tokenResponse.status !== 500) {
        errors.push(
            `Response status is not 500 in the response. Response Status: "${tokenResponse.status}" expected "500"`
        );
    }
    if (tokenResponse.statusText !== "Internal Server Error") {
        errors.push(
            `Response status text is not Internal Server Error in the response. Response Status: "${tokenResponse.statusText}" expected "Internal Server Error"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not False in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }
    if (
        responseData.message !==
        "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined"
    ) {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined"`
        );
    }
    if (responseData.token) {
        errors.push(`Token should not be present in the response`);
    }
    if (!responseData.data.length === 0) {
        errors.push(`Data should empty in the response`);
    }
    if (errors.length > 0) {
        console.log("Test generateToken_MissingPassword_TokenNotGenerated: FAIL");
        console.log("\tErrors: ", errors);
    } else {
        console.log("Test generateToken_MissingPassword_TokenNotGenerated: PASS");
    }
}

async function generateToken_MissingUsername_TokenNotGenerated() {
    const tokenRequestBody = { password: "admin123" };
    const tokenResponse = await tokenGenerator(tokenRequestBody);
    const responseData = await tokenResponse.json();
    const errors = [];

    // Assertions
    if (tokenResponse.status !== 500) {
        errors.push(
            `Response status is not 500 in the response. Response Status: "${tokenResponse.status}" expected "500"`
        );
    }
    if (tokenResponse.statusText !== "Internal Server Error") {
        errors.push(
            `Response status text is not Internal Server Error in the response. Response Status: "${tokenResponse.statusText}" expected "Internal Server Error"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not False in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }
    if (responseData.message !== "Invalid User") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Invalid User"`
        );
    }
    if (responseData.token) {
        errors.push(`Token should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log("Test generateToken_MissingUsername_TokenNotGenerated: FAIL");
        console.log("\tErrors: ", errors);
    } else {
        console.log("Test generateToken_MissingUsername_TokenNotGenerated: PASS");
    }
}

/*
 Test Cases for Save CRM Data API
 */

async function saveCrmData_ValidData_ValidToken_DataSavedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];
    
    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== true) {
            errors.push(
                `Data status is not true in the responseData. Response Status: "${responseData.data[0].status}" expected "true"`
            );
        }
        if (responseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`Validation Error should be present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidData_ValidToken_DataSavedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidData_ValidToken_DataSavedSuccessfully: PASS"
        );
    }
}

async function saveCRMData_LoadTesting_ValidData_ValidToken_DataSavedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    // let VIN_NO = generateRandomString(17);
    // let ICCID = generateRandomString(20);
    // let UIN_NO = generateRandomString(19);
    // let DEVICE_IMEI = generateRandomString(15);

    const loadTestingDataQuantity = 100
    const dataArray = [];
    for (let i = 0; i < loadTestingDataQuantity; i++) {
        const VIN_NO = generateRandomString(17);
        const ICCID = generateRandomString(20);
        const UIN_NO = generateRandomString(19);
        const DEVICE_IMEI = generateRandomString(15);

        let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
        saveCRMData.VIN_NO = VIN_NO;
        saveCRMData.ICCID = ICCID;
        saveCRMData.UIN_NO = UIN_NO;
        saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

        dataArray.push(saveCRMData);
    }



    const saveCRMDataRequestBody = dataArray;
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);
    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else if ((responseData.data.length !== loadTestingDataQuantity)) {
        errors.push(`Data response should be present for ${loadTestingDataQuantity} in the response instead got ${responseData.data.length}`);
    }
    // else {
    //     if (responseData.data[0].VIN_NO !== VIN_NO) {
    //         errors.push(
    //             `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
    //         );
    //     }
    //     if (responseData.data[0].ICCID !== ICCID) {
    //         errors.push(
    //             `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
    //         );
    //     }
    //     if (responseData.data[0].UIN_NO !== UIN_NO) {
    //         errors.push(
    //             `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
    //         );
    //     }
    //     if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
    //         errors.push(
    //             `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
    //         );
    //     }
    //     if (responseData.data[0].status !== false) {
    //         errors.push(
    //             `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
    //         );
    //     }
    //     if (responseData.data[0].message !== "Data not saved") {
    //         errors.push(
    //             `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
    //         );
    //     }
    //     if (responseData.data[0].VALIDATION_ERROR.length === 0) {
    //         errors.push(`Validation Error should be present in the response`);
    //     } else {
    //         if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_19")) {
    //             errors.push(
    //                 `Validation Error For DEALER_CODE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_19".`
    //             );
    //         }
    //     }
    // }
    if (errors.length > 0) {
        console.log(
            "Test saveCRMData_LoadTesting_ValidData_ValidToken_DataSavedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCRMData_LoadTesting_ValidData_ValidToken_DataSavedSuccessfully: PASS"
        );
    }
}


async function saveCrmData_ValidData_InvalidToken_UnauthorizedAccess() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: "token",
    };

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 401) {
        errors.push(
            `Response status is not 401 in the response. Response Status: "${response.status}" expected "401"`
        );
    }
    if (response.statusText !== "Unauthorized") {
        errors.push(
            `Response status text is not Unauthorized in the response. Response Status: "${response.statusText}" expected "Unauthorized"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }

    if (responseData.message !== "unauthorized-access") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "unauthorized-access"`
        );
    }
    if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidData_InvalidToken_UnauthorizedAccess: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidData_InvalidToken_UnauthorizedAccess: PASS"
        );
    }
}

async function saveCrmData_ValidData_MissingToken_PleasePassToken() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
    };

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 400) {
        errors.push(
            `Response status is not 400 in the response. Response Status: "${response.status}" expected "400"`
        );
    }
    if (response.statusText !== "Bad Request") {
        errors.push(
            `Response status text is not Bad Request in the response. Response Status: "${response.statusText}" expected "Bad Request"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }

    if (responseData.message !== "Please pass token") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Please pass token"`
        );
    }
    if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidData_MissingToken_PleasePassToken: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidData_MissingToken_PleasePassToken: PASS"
        );
    }
}

async function saveCrmData_EmptyList_ValidToken_DataFetchedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    const saveCRMDataRequestBody = [];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];
        
    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 400 in the response. Response Status: "${response.status}" expected "400"`
        );
    }

    if (response.statusText == "Bad Request") {
        errors.push(
            `Response status text is not Bad Request in the response. Response Status: "${response.statusText}" expected "Bad Request"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }
    if (responseData.message == "No data provided") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "No data provided"`
        );
    }
    if (!responseData.data) {
        errors.push(`Data should be present in the response`);
    } else if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_EmptyList_ValidToken_DataFetchedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_EmptyList_ValidToken_DataFetchedSuccessfully: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = "";
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_01") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO == "") {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: ""`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected ${"Data not saved"}`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_01") {
            errors.push(
                `Validation Error For VIN_No not present in the response: "${responseData.data[0].VALIDATION_ERROR}" expected ${ERR_01}`
                );
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_ICCID_Empty_ERR_02() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "";
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_02") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ICCID_Empty_ERR_02: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ICCID_Empty_ERR_02: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_ICCID_Missing_ERR_02() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "";
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.ICCID;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID == ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_02") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ICCID_Missing_ERR_02: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ICCID_Missing_ERR_02: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_UIN_NO_Empty_ERR_03() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = "";
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_03") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_UIN_NO_Empty_ERR_03: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_UIN_NO_Empty_ERR_03: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_UIN_NO_Missing_ERR_03() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = "";
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.UIN_NO;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);
    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO == UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_03") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_UIN_NO_Missing_ERR_03: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_UIN_NO_Missing_ERR_03: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Empty_ERR_04() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = "";

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_04") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Empty_ERR_04: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Empty_ERR_04: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Missing_ERR_04() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = "";

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.DEVICE_IMEI;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI == DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }

        if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_04") {
            errors.push(`Validation Error For VIN_No not present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Missing_ERR_04: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Missing_ERR_04: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Empty_ERR_05() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.DEVICE_MAKE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (responseData.data[0].VALIDATION_ERROR.length === 1){
                errors.push(`Validation Error should not be present in the response`)
            }
                if (
                    responseData.data[0].VALIDATION_ERROR.length === 1 &&
                    responseData.data[0].VALIDATION_ERROR.includes("ERR_05")
                )
             {
                errors.push(
                    `Validation Error For DEVICE_MAKE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_05".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Empty_ERR_05: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Empty_ERR_05: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Missing_ERR_05() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.DEVICE_MAKE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);
    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (
                    responseData.data[0].VALIDATION_ERROR.length === 1 &&
                    responseData.data[0].VALIDATION_ERROR.includes("ERR_05")  
            ) {
                errors.push(
                    `Validation Error For DEVICE_MAKE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_05".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Missing_ERR_05: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Missing_ERR_05: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MAKE_ERR_06() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.DEVICE_MAKE = "AA";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }
        if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_06")) {
            errors.push(
                `Validation Error For DEVICE_MAKE not present in the response`
            );
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MAKE_ERR_06: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MAKE_ERR_06: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Empty_ERR_07() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.DEVICE_MODEL = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (
                !(
                    responseData.data[0].VALIDATION_ERROR.length === 1 &&
                    responseData.data[0].VALIDATION_ERROR.includes("ERR_07")
                )
            ) {
                errors.push(
                    `Validation Error For DEVICE_MODEL not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_07".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Empty_ERR_07: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Empty_ERR_07: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Missing_ERR_07() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.DEVICE_MODEL;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (
                    responseData.data[0].VALIDATION_ERROR.length === 1 &&
                    responseData.data[0].VALIDATION_ERROR.includes("ERR_07")
                    )
             {
                errors.push(
                    `Validation Error For DEVICE_MODEL not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_07".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Missing_ERR_07: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Missing_ERR_07: PASS"
        );
    }
}

async function saveCrmData_ValidToken_ValidData_Valid_DEVICE_MODEL_DataSavedSuccessfully() {
    let deviceModelList = [
        "ACONITS140",
        "ACONITS140A",
        "ACONITS140G",
        "ACONITS140I",
        "ACON4IA",
        "ACON4CA",
        "ACON4IE",
        "AEPL051401",
        "AEPL051400",
        "ACON4NA",
        "ACON4TA",
        "ACON4PA",
    ];
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);
    const errors = [];

    await Promise.all(
        deviceModelList.map(async (deviceModel) => {
            let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
            saveCRMData.VIN_NO = VIN_NO;
            saveCRMData.ICCID = ICCID;
            saveCRMData.UIN_NO = UIN_NO;
            saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
            saveCRMData.DEVICE_MODEL = deviceModel;

            const saveCRMDataRequestBody = [saveCRMData];
            const response = await saveCRMDataAPI(
                saveCRMDataHeaders,
                saveCRMDataRequestBody
            );

            const responseData = await response.json();
            console.log('responseData :>> ', responseData);
            // Assertions
            if (response.status !== 200) {
                errors.push(
                    `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
                );
            }

            if (response.statusText !== "OK") {
                errors.push(
                    `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
                );
            }
            if (responseData.status !== true) {
                errors.push(
                    `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
                );
            }
            if (responseData.message !== "Data fetched successfully") {
                errors.push(
                    `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
                );
            }
            if (responseData.data.length === 0) {
                errors.push(
                    `Data response should be present in the response for Device Model ${deviceModel}`
                );
            } else {
                if (responseData.data[0].VIN_NO !== VIN_NO) {
                    errors.push(
                        `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
                    );
                }
                if (responseData.data[0].ICCID !== ICCID) {
                    errors.push(
                        `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
                    );
                }
                if (responseData.data[0].UIN_NO !== UIN_NO) {
                    errors.push(
                        `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
                    );
                }
                if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
                    errors.push(
                        `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
                    );
                }
                if (responseData.data[0].status !== true) {
                    errors.push(
                        `Data status is not true in the responseData for Device Model ${deviceModel}. Response Status: "${responseData.data[0].status}" expected "true"`
                    );
                }
                if (responseData.data[0].message !== "Data saved Successfully") {
                    errors.push(
                        `Unexpected message in the response for Device Model ${deviceModel}: "${responseData.data[0].message}" expected "Data saved Successfully"`
                    );
                }
                if (responseData.data[0] && responseData.data[0].VALIDATION_ERROR) {
                    // Your existing validation logic for VALIDATION_ERROR
                    console.log("VALIDATION_ERROR");
                    if (!responseData.data[0].VALIDATION_ERROR.length === 0) {
                        errors.push(
                            `Validation Error should not be present For DEVICE_MODEL "${deviceModel}" in the response`
                        );
                    }
                } else {
                    errors.push(`Validation Error part missing in the response`);
                }
            }
        })
    );

    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_ValidData_Valid_DEVICE_MODEL_DataSavedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_ValidData_Valid_DEVICE_MODEL_DataSavedSuccessfully: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MODEL_ERR_08() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);
    const errors = [];

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.DEVICE_MODEL = "aa";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        }
        if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_08")) {
            errors.push(
                `Validation Error For DEVICE_MODEL not present in the response`
            );
        }
    }

    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MODEL_ERR_08: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MODEL_ERR_08: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_ENGINE_NO_Empty_ERR_10() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.ENGINE_NO = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_10")) {
                errors.push(
                    `Validation Error For ENGINE_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_10".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ENGINE_NO_Empty_ERR_10: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ENGINE_NO_Empty_ERR_10: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_ENGINE_NO_Missing_ERR_10() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.ENGINE_NO;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_10")) {
                errors.push(
                    `Validation Error For ENGINE_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_10".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ENGINE_NO_Missing_ERR_10: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ENGINE_NO_Missing_ERR_10: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_REG_NUMBER_Empty_ERR_11() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.REG_NUMBER = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_11")) {
                errors.push(
                    `Validation Error For REG_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_11".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_REG_NUMBER_Empty_ERR_11: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_REG_NUMBER_Empty_ERR_11: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_REG_NUMBER_Missing_ERR_11() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.REG_NUMBER;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_11")) {
                errors.push(
                    `Validation Error For REG_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_11".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_REG_NUMBER_Missing_ERR_11: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_REG_NUMBER_Missing_ERR_11: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Empty_ERR_13() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.VEHICLE_OWNER_LAST_NAME = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_13")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_LAST_NAME not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_13".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Empty_ERR_13: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Empty_ERR_13: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Missing_ERR_13() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.VEHICLE_OWNER_LAST_NAME;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_13")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_LAST_NAME not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_13".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Missing_ERR_13: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Missing_ERR_13: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Empty_ERR_14() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.ADDRESS_LINE_1 = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_14")) {
                errors.push(
                    `Validation Error For ADDRESS_LINE_1 not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_14".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Empty_ERR_14: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Empty_ERR_14: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Missing_ERR_14() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.ADDRESS_LINE_1;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_14")) {
                errors.push(
                    `Validation Error For ADDRESS_LINE_1 not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_14".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Missing_ERR_14: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Missing_ERR_14: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Empty_ERR_15() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.VEHICLE_OWNER_CITY = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_15")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_CITY not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_15".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Empty_ERR_15: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Empty_ERR_15: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Missing_ERR_15() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.VEHICLE_OWNER_CITY;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_15")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_CITY not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_15".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Missing_ERR_15: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Missing_ERR_15: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Empty_ERR_16() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.VEHICLE_OWNER_REGISTERED_MOBILE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_16")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_REGISTERED_MOBILE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_16".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Empty_ERR_16: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Empty_ERR_16: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Missing_ERR_16() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.VEHICLE_OWNER_REGISTERED_MOBILE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_16")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_REGISTERED_MOBILE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_16".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Missing_ERR_16: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Missing_ERR_16: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Non_Numeric_ERR_17() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.VEHICLE_OWNER_REGISTERED_MOBILE = "asdasd";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_17")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_REGISTERED_MOBILE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_17".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Non_Numeric_ERR_17: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Non_Numeric_ERR_17: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Length_Equal_10_ERR_18() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.VEHICLE_OWNER_REGISTERED_MOBILE = "91584221801";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_18")) {
                errors.push(
                    `Validation Error For VEHICLE_OWNER_REGISTERED_MOBILE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_18".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Length_Equal_10_ERR_18: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Length_Equal_10_ERR_18: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEALER_CODE_Empty_ERR_19() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.DEALER_CODE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_19")) {
                errors.push(
                    `Validation Error For DEALER_CODE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_19".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEALER_CODE_Empty_ERR_19: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEALER_CODE_Empty_ERR_19: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_DEALER_CODE_Missing_ERR_19() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.DEALER_CODE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_19")) {
                errors.push(
                    `Validation Error For DEALER_CODE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_19".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEALER_CODE_Missing_ERR_19: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_DEALER_CODE_Missing_ERR_19: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Empty_ERR_20() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.POA_DOC_NAME = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_20")) {
                errors.push(
                    `Validation Error For POA_DOC_NAME not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_20".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Empty_ERR_20: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Empty_ERR_20: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Missing_ERR_20() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.POA_DOC_NAME;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_20")) {
                errors.push(
                    `Validation Error For POA_DOC_NAME not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_20".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Missing_ERR_20: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Missing_ERR_20: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Empty_ERR_21() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.POA_DOC_NO = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_21")) {
                errors.push(
                    `Validation Error For POA_DOC_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_21".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Empty_ERR_21: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Empty_ERR_21: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Missing_ERR_21() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.POA_DOC_NO;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_21")) {
                errors.push(
                    `Validation Error For POA_DOC_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_21".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Missing_ERR_21: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Missing_ERR_21: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Empty_ERR_22() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.POI_DOC_TYPE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_22")) {
                errors.push(
                    `Validation Error For POI_DOC_TYPE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_22".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Empty_ERR_22: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Empty_ERR_22: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Missing_ERR_22() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.POI_DOC_TYPE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_22")) {
                errors.push(
                    `Validation Error For POI_DOC_TYPE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_22".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Missing_ERR_22: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Missing_ERR_22: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Empty_ERR_23() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.POI_DOC_NO = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_23")) {
                errors.push(
                    `Validation Error For POI_DOC_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_23".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Empty_ERR_23: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Empty_ERR_23: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Missing_ERR_23() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.POI_DOC_NO;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_23")) {
                errors.push(
                    `Validation Error For POI_DOC_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_23".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Missing_ERR_23: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Missing_ERR_23: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Empty_ERR_24() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.RTO_OFFICE_CODE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_24")) {
                errors.push(
                    `Validation Error For RTO_OFFICE_CODE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_24".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Empty_ERR_24: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Empty_ERR_24: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Missing_ERR_24() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.RTO_OFFICE_CODE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_24")) {
                errors.push(
                    `Validation Error For RTO_OFFICE_CODE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_24".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Missing_ERR_24: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Missing_ERR_24: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_RTO_STATE_Empty_ERR_25() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.RTO_STATE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_25")) {
                errors.push(
                    `Validation Error For RTO_STATE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_25".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_STATE_Empty_ERR_25: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_STATE_Empty_ERR_25: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_RTO_STATE_Missing_ERR_25() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.RTO_STATE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_25")) {
                errors.push(
                    `Validation Error For RTO_STATE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_25".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_STATE_Missing_ERR_25: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_RTO_STATE_Missing_ERR_25: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Empty_ERR_27() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.PRIMARY_OPERATOR = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_27")) {
                errors.push(
                    `Validation Error For PRIMARY_OPERATOR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_27".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Empty_ERR_27: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Empty_ERR_27: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Missing_ERR_27() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.PRIMARY_OPERATOR;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_27")) {
                errors.push(
                    `Validation Error For PRIMARY_OPERATOR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_27".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Missing_ERR_27: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Missing_ERR_27: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Empty_ERR_28() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.PRIMARY_MOBILE_NUMBER = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_28")) {
                errors.push(
                    `Validation Error For PRIMARY_MOBILE_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_28".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Empty_ERR_28: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Empty_ERR_28: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Missing_ERR_28() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.PRIMARY_MOBILE_NUMBER;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_28")) {
                errors.push(
                    `Validation Error For PRIMARY_MOBILE_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_28".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Missing_ERR_28: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Missing_ERR_28: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Non_Numeric_ERR_29() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.PRIMARY_MOBILE_NUMBER = "asd";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_29")) {
                errors.push(
                    `Validation Error For PRIMARY_MOBILE_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_29".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Non_Numeric_ERR_29: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Non_Numeric_ERR_29: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Less_Than_15_ERR_30() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.PRIMARY_MOBILE_NUMBER = "1234567890123456";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_30")) {
                errors.push(
                    `Validation Error For PRIMARY_MOBILE_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_30".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Less_Than_15_ERR_30: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Less_Than_15_ERR_30: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Empty_ERR_31() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.SECONDARY_OPERATOR = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_31")) {
                errors.push(
                    `Validation Error For SECONDARY_OPERATOR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_31".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Empty_ERR_31: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Empty_ERR_31: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Missing_ERR_31() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.SECONDARY_OPERATOR;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_31")) {
                errors.push(
                    `Validation Error For SECONDARY_OPERATOR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_31".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Missing_ERR_31: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Missing_ERR_31: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Less_Than_15_ERR_32() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.SECONDARY_MOBILE_NUMBER = "1234567890123456";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_32")) {
                errors.push(
                    `Validation Error For SECONDARY_MOBILE_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_32".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Less_Than_15_ERR_32: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Less_Than_15_ERR_32: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Non_Numeric_ERR_33() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.SECONDARY_MOBILE_NUMBER = "asd";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_33")) {
                errors.push(
                    `Validation Error For SECONDARY_MOBILE_NUMBER not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_33".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Non_Numeric_ERR_33: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Non_Numeric_ERR_33: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Empty_ERR_34() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.VEHICLE_MODEL = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_34")) {
                errors.push(
                    `Validation Error For VEHICLE_MODEL not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_34".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Empty_ERR_34: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Empty_ERR_34: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Missing_ERR_34() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.VEHICLE_MODEL;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_34")) {
                errors.push(
                    `Validation Error For VEHICLE_MODEL not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_34".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Missing_ERR_34: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Missing_ERR_34: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Empty_ERR_35() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.COMMERCIAL_ACTIVATION_START_DATE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_35")) {
                errors.push(
                    `Validation Error For COMMERCIAL_ACTIVATION_START_DATE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_35".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Empty_ERR_35: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Empty_ERR_35: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Missing_ERR_35() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.COMMERCIAL_ACTIVATION_START_DATE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_35")) {
                errors.push(
                    `Validation Error For COMMERCIAL_ACTIVATION_START_DATE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_35".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Missing_ERR_35: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Missing_ERR_35: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_MFG_YEAR_Empty_ERR_38() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.MFG_YEAR = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_38")) {
                errors.push(
                    `Validation Error For MFG_YEAR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_38".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_MFG_YEAR_Empty_ERR_38: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_MFG_YEAR_Empty_ERR_38: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_MFG_YEAR_Missing_ERR_38() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.MFG_YEAR;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_38")) {
                errors.push(
                    `Validation Error For MFG_YEAR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_38".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_MFG_YEAR_Missing_ERR_38: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_MFG_YEAR_Missing_ERR_38: PASS"
        );
    }
}

async function saveCrmData_ValidToken_ValidData_DUPLICATE_DATA_ERR_39() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = "DUPLICATE_DATA_VIN_NO";
    let ICCID = "DUPLICATE_DATA_ICCID";
    let UIN_NO = "DUPLICATE_DATA_UIN_NO";
    let DEVICE_IMEI = "DUPLICATE_DATA_DEVICE_IMEI";

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    await saveCRMDataAPI(saveCRMDataHeaders, saveCRMDataRequestBody);
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Duplicate Details") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Duplicate Details"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_39")) {
                errors.push(
                    `Validation Error For MFG_YEAR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_39".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_ValidData_DUPLICATE_DATA_ERR_39: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_ValidData_DUPLICATE_DATA_ERR_39: PASS"
        );
    }
}

async function saveCrmData_ValidToken_ValidData_Change_Request_After_Stage_2_ERR_40() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = "12985475";
    let ICCID = "89916490634626389138";
    let UIN_NO = "ACON4NA202200089462";
    let DEVICE_IMEI = "868274066889462";

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    await saveCRMDataAPI(saveCRMDataHeaders, saveCRMDataRequestBody);
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_40")) {
                errors.push(
                    `Validation Error For MFG_YEAR not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_40".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_ValidData_Change_Request_After_Stage_2_ERR_40: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_ValidData_Change_Request_After_Stage_2_ERR_40: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Empty_ERR_41() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMData.INVOICE_DATE = "";

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_41")) {
                errors.push(
                    `Validation Error For INVOICE_DATE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_41".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Empty_ERR_41: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Empty_ERR_41: PASS"
        );
    }
}

async function saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Missing_ERR_41() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveCRMDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    delete saveCRMData.INVOICE_DATE;
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const response = await saveCRMDataAPI(
        saveCRMDataHeaders,
        saveCRMDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (responseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${responseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_41")) {
                errors.push(
                    `Validation Error For INVOICE_DATE not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_41".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Missing_ERR_41: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Missing_ERR_41: PASS"
        );
    }
}

/*
 Test Cases for Save Fleet Edge Data API
 */

async function saveFleetedgeData_ValidData_ValidToken_DataSavedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }
    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== true) {
            errors.push(
                `Data status is not true in the responseData. Response Status: "${responseData.data[0].status}" expected "true"`
            );
        }
        if (responseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (!responseData.data[0].Ticket_No) {
            errors.push(`Ticket Number should be present in the response."`);
        } else {
            let ticketNo = responseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }

        if (responseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`Validation Error should be present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidData_ValidToken_DataSavedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidData_ValidToken_DataSavedSuccessfully: PASS"
        );
    }
}

async function saveFleetedgeData_LoadTesting_ValidData_ValidToken_DataSavedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    const FEloadTestingDataQuantity = 100;
    const FEdataArray = [];
    for (let i = 0; i < FEloadTestingDataQuantity; i++) {
        const VIN_NO = generateRandomString(17);
        const ICCID = "89916490634626390375";

        let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
        saveFleetedgeData.VIN_NO = VIN_NO;
        saveFleetedgeData.ICCID = ICCID;

        FEdataArray.push(saveFleetedgeData);
    }

    const saveFleetedgeDataRequestBody = FEdataArray;
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);
    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }
    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else if ((responseData.data.length !== FEloadTestingDataQuantity)) {
        errors.push(`Data response should be present for ${FEloadTestingDataQuantity} in the response instead got ${responseData.data.length}`);
    }
    /*
         else {
         if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== true) {
            errors.push(
                `Data status is not true in the responseData. Response Status: "${responseData.data[0].status}" expected "true"`
            );
        }
        if (responseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (!responseData.data[0].Ticket_No) {
            errors.push(`Ticket Number should be present in the response."`);
        } else {
            let ticketNo = responseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }

        if (responseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`Validation Error should be present in the response`);
        }
    } */
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_FELoadTesting_ValidData_ValidToken_DataSavedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_FELoadTesting_ValidData_ValidToken_DataSavedSuccessfully: PASS"
        );
    }
}

async function saveFleetedgeData_ValidData_InvalidToken_UnauthorizedAccess() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: "token",
    };

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 401) {
        errors.push(
            `Response status is not 401 in the response. Response Status: "${response.status}" expected "401"`
        );
    }
    if (response.statusText !== "Unauthorized") {
        errors.push(
            `Response status text is not Unauthorized in the response. Response Status: "${response.statusText}" expected "Unauthorized"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }

    if (responseData.message !== "unauthorized-access") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "unauthorized-access"`
        );
    }
    if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidData_InvalidToken_UnauthorizedAccess: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidData_InvalidToken_UnauthorizedAccess: PASS"
        );
    }
}

async function saveFleetedgeData_ValidData_MissingToken_PleasePassToken() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
    };

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 400) {
        errors.push(
            `Response status is not 400 in the response. Response Status: "${response.status}" expected "400"`
        );
    }
    if (response.statusText !== "Bad Request") {
        errors.push(
            `Response status text is not Bad Request in the response. Response Status: "${response.statusText}" expected "Bad Request"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }

    if (responseData.message !== "Please pass token") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Please pass token"`
        );
    }
    if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidData_MissingToken_PleasePassToken: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidData_MissingToken_PleasePassToken: PASS"
        );
    }
}

async function saveFleetedgeData_EmptyList_ValidToken_DataFetchedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    const saveFleetedgeDataRequestBody = [];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 400) {
        errors.push(
            `Response status is not 400 in the response. Response Status: "${response.status}" expected "400"`
        );
    }

    if (response.statusText !== "Bad Request") {
        errors.push(
            `Response status text is not Bad Request in the response. Response Status: "${response.statusText}" expected "Bad Request"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }
    if (responseData.message !== "No data provided") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "No data provided"`
        );
    }
    if (!responseData.data) {
        //errors.push(`Data should be present in the response`);
    } else if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_EmptyList_ValidToken_DataFetchedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_EmptyList_ValidToken_DataFetchedSuccessfully: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = "";
    let ICCID = generateRandomString(20);

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);
    
    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_01")) {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_01".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = "";
    let ICCID = generateRandomString(20);

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    delete saveFleetedgeData.VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO == VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_01")) {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_01".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Not_Present_ERR_02() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } 
    if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status == false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message == "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            //errors.push(`Validation Error should be present in the response`);
        } 
        
        if (!responseData.data[0].VALIDATION_ERROR[0] == "ERR_02") {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${!responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_02".`
                );
            }
            // if (responseData.data[0].VALIDATION_ERROR[0] !== "ERR_01") {
            //     errors.push(
            //         `Validation Error For VIN_No not present in the response: "${responseData.data[0].VALIDATION_ERROR}" expected ${ERR_01}`
            //         );
            // }
        
    
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Not_Present_ERR_02: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Not_Present_ERR_02: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_ICCID_Empty_ERR_03() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_03")) {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_03".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_ICCID_Empty_ERR_03: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_ICCID_Empty_ERR_03: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_ICCID_Missing_ERR_03() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    delete saveFleetedgeData.ICCID;
    saveFleetedgeData.VIN_NO = VIN_NO;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID == ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_03")) {
                errors.push(
                    `Validation Error For ICCID not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_03".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_ICCID_Missing_ERR_03: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_ICCID_Missing_ERR_03: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_ICCID_Not_Present_ERR_04() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390373";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_04")) {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_04".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_ICCID_Not_Present_ERR_04: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_ICCID_Not_Present_ERR_04: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Empty_ERR_07() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;
    saveFleetedgeData.REQUEST_TYPE = "";

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_07")) {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_07".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Empty_ERR_07: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Empty_ERR_07: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Missing_ERR_07() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    delete saveFleetedgeData.REQUEST_TYPE;
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_07")) {
                errors.push(
                    `Validation Error For ICCID not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_07".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Missing_ERR_07: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Missing_ERR_07: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Empty_ERR_08() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;
    saveFleetedgeData.CERTIFICATE_VALIDITY_DURATION_IN_YEAR = "";

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_08")) {
                errors.push(
                    `Validation Error For VIN_NO not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_08".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Empty_ERR_08: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Empty_ERR_08: PASS"
        );
    }
}

async function saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Missing_ERR_08() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    delete saveFleetedgeData.CERTIFICATE_VALIDITY_DURATION_IN_YEAR;
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const responseData = await response.json();
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }

    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "Data not saved") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "Data not saved"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length === 0) {
            errors.push(`Validation Error should be present in the response`);
        } else {
            if (!responseData.data[0].VALIDATION_ERROR.includes("ERR_08")) {
                errors.push(
                    `Validation Error For ICCID not present or not up to mark in the response. Got "${responseData.data[0].VALIDATION_ERROR}". Expected: "ERR_08".`
                );
            }
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Missing_ERR_08: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Missing_ERR_08: PASS"
        );
    }
}

async function saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithoutCRMDataPushed_DataAlreadyExists() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response1 = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const response1Data = await response1.json();
    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }
    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.data[0].status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "FE Allready sent the data for this VIN. Waiting for crm.") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "FE Allready sent the data for this VIN. Waiting for crm."`
            );
        }
        if (!responseData.data[0].Ticket_No) {
            errors.push(`Ticket Number should be present in the response."`);
        } else if (responseData.data[0].Ticket_No !== response1Data.data[0].Ticket_No) {
            errors.push(
                `Unexpected Ticket Number in the response: "${responseData.data[0].ticketNo}" expected "${response1Data.data[0].Ticket_No}"`
            );
        } else {
            let ticketNo = responseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }

        if (!responseData.data[0].VALIDATION_ERROR) {
            errors.push(`Validation Error should be present in the response`);

        } else if (responseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`Validation Error should be present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithoutCRMDataPushed_DataAlreadyExists: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithoutCRMDataPushed_DataAlreadyExists: PASS"
        );
    }
}

async function saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithCRMDataPushed_DataAlreadyExists() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const saveFleetedgeDataHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    const saveCRMDataRequestBody = [saveCRMData];

    await saveCRMDataAPI(
        saveFleetedgeDataHeaders,
        saveCRMDataRequestBody
    );

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;


    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const response1 = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const response = await saveFleetedgeDataAPI(
        saveFleetedgeDataHeaders,
        saveFleetedgeDataRequestBody
    );
    const errors = [];

    const response1Data = await response1.json();
    const responseData = await response.json();

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }
    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }
    console.log('responseData.data.length :>> ', responseData.data.length);
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].status !== false) {
            errors.push(
                `Data status is not false in the responseData. Response Status: "${responseData.data[0].status}" expected "false"`
            );
        }
        if (responseData.data[0].message !== "FE Allready sent the data for this VIN.") {
            errors.push(
                `Unexpected message in the response: "${responseData.data[0].message}" expected "FE Allready sent the data for this VIN."`
            );
        }
        if (!responseData.data[0].Ticket_No) {
            errors.push(`Ticket Number should be present in the response."`);
        } else if (responseData.data[0].Ticket_No !== response1Data.data[0].Ticket_No) {
            errors.push(
                `Unexpected Ticket Number in the response: "${responseData.data[0].ticketNo}" expected "${response1Data.data[0].Ticket_No}"`
            );
        } else {
            let ticketNo = responseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (!responseData.data[0].VALIDATION_ERROR) {
            errors.push(`Validation Error should be present in the response`);

        } else if (responseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`Validation Error should be present in the response`);
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithCRMDataPushed_DataAlreadyExists: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithCRMDataPushed_DataAlreadyExists: PASS"
        );
    }
}

/*
 Test Cases for Get Ticket Status API
 */

async function getTicketStatus_ValidData_ValidToken_DataFetchedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const getTicketStatusHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = "89916555634626391631";
    let ICCID = "89916490634626390375";
    let Ticket_No = "AEPL-240121-2";

    let getTicketStatus = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatus.VIN_NO = VIN_NO;
    getTicketStatus.ICCID = ICCID;
    getTicketStatus.Ticket_No = Ticket_No;

    const getTicketStatusRequestBody = [getTicketStatus];
    const response = await getTicketStatusAPI(
        getTicketStatusHeaders,
        getTicketStatusRequestBody
    );
    const errors = [];

    const responseData = response.data;
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${response.status}" expected "200"`
        );
    }
    if (response.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${response.statusText}" expected "OK"`
        );
    }
    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }
    if (responseData.message !== "Data fetched successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data fetched successfully"`
        );
    }
    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `Ticket_Handler doesn't match. Ticket_Handler got: "${responseData.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (responseData.data[0].Ticket_No !== Ticket_No) {
            errors.push(
                `Ticket_No doesn't match. Ticket_No got: "${responseData.data[0].Ticket_No}" Expected Ticket_No: Ticket_No`
            );
        }
        if (responseData.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `Ticket_Stage doesn't match. Ticket_Stage got: "${responseData.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (responseData.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `Ticket_Activity doesn't match. Ticket_Activity got: "${responseData.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (responseData.data[0].Ticket_Status !== "STS_CO_02") {
            errors.push(
                `Ticket_Status doesn't match. Ticket_Status got: "${responseData.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
            );
        }
        if (responseData.data[0].Ticket_Remark !== "") {
            errors.push(
                `Ticket_Remark doesn't match. Ticket_Remark got: "${responseData.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].UIN_NO !== "ACON4NA202200089462") {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData.data[0].UIN_NO}" Expected UIN_NO: "ACON4NA202200089462"`
            );
        }
        if (responseData.data[0].RTO_STATE !== "MH") {
            errors.push(
                `RTO_STATE doesn't match. RTO_STATE got: "${responseData.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (responseData.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${responseData.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (responseData.data[0].Process_End_Date_and_Time !== "") {
            errors.push(
                `Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${responseData.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
            );
        }
        if (responseData.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${responseData.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }
        if (responseData.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${responseData.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (responseData.data[0].Certificate_File_Location !== "") {
            errors.push(
                `Certificate_File_Location doesn't match. Certificate_File_Location got: "${responseData.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (responseData.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `Certificate_File_Names doesn't match. Certificate_File_Names got: "${responseData.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
    }
    if (errors.length > 0) {
        console.log(
            "Test getTicketStatus_ValidData_ValidToken_DataSavedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test getTicketStatus_ValidData_ValidToken_DataSavedSuccessfully: PASS"
        );
    }
}

async function getTicketStatus_ValidData_InvalidToken_UnauthorizedAccess() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const getTicketStatusHeaders = {
        "Content-Type": "application/json",
        token: "token",
    };

    let getTicketStatus = JSON.parse(JSON.stringify(mainFEData));

    const getTicketStatusRequestBody = [getTicketStatus];
    const errorResponse = await getTicketStatusAPI(
        getTicketStatusHeaders,
        getTicketStatusRequestBody
    );
    const errors = [];
    let response = errorResponse.response;

    const responseData = await response.data;
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.status !== 401) {
        errors.push(
            `Response status is not 401 in the response. Response Status: "${response.status}" expected "401"`
        );
    }
    if (response.statusText !== "Unauthorized") {
        errors.push(
            `Response status text is not Unauthorized in the response. Response Status: "${response.statusText}" expected "Unauthorized"`
        );
    }

    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }

    if (responseData.message !== "unauthorized-access") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "unauthorized-access"`
        );
    }
    if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test getTicketStatus_ValidData_InvalidToken_UnauthorizedAccess: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test getTicketStatus_ValidData_InvalidToken_UnauthorizedAccess: PASS"
        );
    }
}

async function getTicketStatus_ValidData_MissingToken_PleasePassToken() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const getTicketStatusHeaders = {
        "Content-Type": "application/json",
    };

    let getTicketStatus = JSON.parse(JSON.stringify(mainFEData));

    const getTicketStatusRequestBody = [getTicketStatus];
    const response = await getTicketStatusAPI(
        getTicketStatusHeaders,
        getTicketStatusRequestBody
    );
    const errors = [];

    const responseData = await response.response.data;
    console.log('responseData :>> ', responseData);

    // Assertions
    if (response.response.status !== 400) {
        errors.push(
            `Response status is not 400 in the response. Response Status: "${response.response.status}" expected "400"`
        );
    }
    if (response.response.statusText !== "Bad Request") {
        errors.push(
            `Response status text is not Bad Request in the response. Response Status: "${response.response.statusText}" expected "Bad Request"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }

    if (responseData.message !== "Please pass token") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Please pass token"`
        );
    }
    if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test getTicketStatus_ValidData_MissingToken_PleasePassToken: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test getTicketStatus_ValidData_MissingToken_PleasePassToken: PASS"
        );
    }
}

async function getTicketStatus_EmptyList_ValidToken_DataFetchedSuccessfully() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const getTicketStatusHeaders = {
        "Content-Type": "application/json",
        token: token,
    };

    const getTicketStatusRequestBody = [];
    const errorResponse = await getTicketStatusAPI(
        getTicketStatusHeaders,
        getTicketStatusRequestBody
    );
    const errors = [];
    let response = errorResponse.response;
    const responseData = await response.data;
    console.log('responseData :>> ', responseData);
    
    // Assertions
    if (response.status == 400) {
        errors.push(
            `Response status is not 400 in the response. Response Status: "${!response.status}" expected "400"`
        );
    }

    if (response.statusText == "Bad Request") {
        errors.push(
            `Response status text is not Bad Request in the response. Response Status: "${!response.statusText}" expected "Bad Request"`
        );
    }
    if (responseData.status !== false) {
        errors.push(
            `Status is not false in the responseData. Response Status: "${responseData.status}" expected "false"`
        );
    }
    if (responseData.message == "No data provided") {
        errors.push(
            `Unexpected message in the response: "${!responseData.message}" expected "No data provided"`
        );
    }
    if (!responseData.data) {
       // errors.push(`Data should be present in the response`);
    } else if (responseData.data.length !== 0) {
        errors.push(`Data response should not be present in the response`);
    }
    if (errors.length > 0) {
        console.log(
            "Test getTicketStatus_EmptyList_ValidToken_DataFetchedSuccessfully: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test getTicketStatus_EmptyList_ValidToken_DataFetchedSuccessfully: PASS"
        );
    }
}

/*
 Test Cases for CRM NOT Fetched Data
 */

async function getTicketStatus_ValidData_ValidToken_NOCRMDataSent_FESDataSent_GETStatusAPI_TicketGenerated_STS_CO_19() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const header = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916490634626390375";
    // let Ticket_No = "AEPL-240121-2";

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const saveFleetedgeResponse = await saveFleetedgeDataAPI(
        header,
        saveFleetedgeDataRequestBody
    );
    const responseData = await saveFleetedgeResponse.json();
    let ticketNo = responseData.data[0].Ticket_No;

    let getTicketStatusData = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatusData.VIN_NO = VIN_NO;
    getTicketStatusData.ICCID = ICCID;
    getTicketStatusData.Ticket_No = ticketNo;
    console.log('getTicketStatusData.Ticket_No :>> ', getTicketStatusData.Ticket_No);

    const getTicketStatusRequestBody = [getTicketStatusData];
    const response1 = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBody

    );
    const errors = [];
    const responseData1 = response1.data;
    console.log('responseData :>> ', responseData);
    console.log('responseData1 :>> ', responseData1);

    // Assertions
    if (saveFleetedgeResponse.status !== 200) {
        errors.push(
            `Response status is not 200 in the response. Response Status: "${saveFleetedgeResponse.status}" expected "200"`
        );
    }

    if (saveFleetedgeResponse.statusText !== "OK") {
        errors.push(
            `Response status text is not OK in the response. Response Status: "${saveFleetedgeResponse.statusText}" expected "OK"`
        );
    }

    if (responseData.status !== true) {
        errors.push(
            `Status is not true in the responseData. Response Status: "${responseData.status}" expected "true"`
        );
    }

    if (responseData.message !== "Data Fetched Successfully") {
        errors.push(
            `Unexpected message in the response: "${responseData.message}" expected "Data Fetched Successfully"`
        );
    }

    if (responseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (responseData.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (responseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`Validation Error should be present in the response`);
        }
    }

    if (responseData1.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {


    }

    if (responseData1.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (responseData1.data[0].Ticket_Handler == "") {
            errors.push(
                `Ticket_Handler doesn't match. Ticket_Handler got: "${responseData.data[0].Ticket_Handler}" Expected Ticket_Handler: " "`
            );
        }

        if (!responseData1.data[0].Ticket_No) {
            errors.push(`Ticket Number should be present in the response."`);
        } else {
            if (responseData1.data[0].Ticket_No !== ticketNo) {
                errors.push(
                    `Ticket_No doesn't match. Ticket_No got: "${responseData.data[0].Ticket_No}" Expected Ticket_No: ${ticketNo}`
                );
            }
            let ticketNumber = responseData1.data[0].Ticket_No;
            let [heading, date, index] = ticketNumber.split("-");
            if (!heading) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }

        if (responseData1.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `Ticket_Stage doesn't match. Ticket_Stage got: "${responseData.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (responseData1.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `Ticket_Activity doesn't match. Ticket_Activity got: "${responseData.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (responseData1.data[0].Ticket_Status !== "STS_CO_19") {
            errors.push(
                `Ticket_Status doesn't match. Ticket_Status got: "${responseData.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_19"`
            );
        }
        if (responseData1.data[0].Ticket_Remark !== "") {
            errors.push(
                `Ticket_Remark doesn't match. Ticket_Remark got: "${responseData.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (responseData1.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `VIN_NO doesn't match. VIN_NO got: "${responseData1.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }

        if (responseData1.data[0].ICCID !== ICCID) {
            errors.push(
                `ICCID doesn't match. ICCID got: "${responseData1.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }

        if (responseData1.data[0].status == true) {
            errors.push(
                `Data status is not true in the responseData. Response Status: "${responseData1.data[0].status}" expected "true"`
            );
        }

        if (responseData1.data[0].message == "Data saved Successfully") {
            errors.push(
                `Unexpected message in the response: "${responseData1.data[0].message}" expected "Data saved Successfully"`
            );
        }

        if (responseData1.data[0].UIN_NO == "") {
            errors.push(
                `UIN_NO doesn't match. UIN_NO got: "${responseData1.data[0].UIN_NO}" Expected UIN_NO: ""`
            );
        }
        if (responseData1.data[0].RTO_STATE == "MH") {
            errors.push(
                `RTO_STATE doesn't match. RTO_STATE got: "${responseData1.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (responseData1.data[0].RTO_OFFICE_CODE == "MH 12") {
            errors.push(
                `RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${responseData1.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (responseData1.data[0].Process_End_Date_and_Time !== "") {
            errors.push(
                `Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${responseData.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
            );
        }
        if (responseData1.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${responseData.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }
        if (responseData1.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${responseData1.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (responseData1.data[0].Certificate_File_Location !== "") {
            errors.push(
                `Certificate_File_Location doesn't match. Certificate_File_Location got: "${responseData1.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (responseData1.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `Certificate_File_Names doesn't match. Certificate_File_Names got: "${responseData1.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
    }

    if (errors.length > 0) {
        console.log(
            "Test getTicketStatus_ValidData_ValidToken_NOCRMDataSent_FESDataSent_GETStatusAPI_TicketGenerated_STS_CO_19 : FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test getTicketStatus_ValidData_ValidToken_NOCRMDataSent_FESDataSent_GETStatusAPI_TicketGenerated_STS_CO_19: PASS"
        );
    }
}

//Test Case for FE Not initiated 

async function saveCrmData_ValidData_ValidToken_DataSavedSuccessfully_FE_DataNotInitiated_GetAPIStatus() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const header = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = generateRandomString(20);
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const CRMresponse = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBody
    );
    const errors = [];

    const CRMresponseData = await CRMresponse.json();
    console.log('CRMresponseData :>> ', CRMresponseData);


    // Assertions
    if (CRMresponse.status !== 200) {
        errors.push(
            `CRM Responce Response status is not 200 in the response. Response Status: "${CRMresponse.status}" expected "200"`
        );
    }

    if (CRMresponse.statusText !== "OK") {
        errors.push(
            `CRM Responce Response status text is not OK in the response. Response Status: "${CRMresponse.statusText}" expected "OK"`
        );
    }
    if (CRMresponseData.status !== true) {
        errors.push(
            `CRM Responce Status is not true in the responseData. Response Status: "${CRMresponseData.status}" expected "true"`
        );
    }
    if (CRMresponseData.message !== "Data fetched successfully") {
        errors.push(
            `CRM Responce Unexpected message in the response: "${CRMresponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (CRMresponseData.data.length === 0) {
        errors.push(`CRM Responce Data response should be present in the response`);
    } else {
        if (CRMresponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `CRM Responce VIN_NO doesn't match. VIN_NO got: "${CRMresponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (CRMresponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `CRM Responce ICCID doesn't match. ICCID got: "${CRMresponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (CRMresponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `CRM Responce UIN_NO doesn't match. UIN_NO got: "${CRMresponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (CRMresponseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `CRM Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${CRMresponseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (CRMresponseData.data[0].status !== true) {
            errors.push(
                `CRM Responce Data status is not true in the responseData. Response Status: "${CRMresponseData.data[0].status}" expected "true"`
            );
        }
        if (CRMresponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `CRM Responce Unexpected message in the response: "${CRMresponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (CRMresponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`CRM Responce Validation Error should be present in the response`);
        }
    }

    //GET Status API FE not initiated

    let getTicketStatus = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatus.VIN_NO = VIN_NO;
    getTicketStatus.ICCID = ICCID;
    getTicketStatus.Ticket_No = "";

    const getTicketStatusRequestBody = [getTicketStatus];
    const GETresponse = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBody
    );

    const GETresponseData = GETresponse.data;

    // console.log('GETresponse :>> ', GETresponse); 
    console.log('GETresponseData :>> ', GETresponseData);
    // Assertions
    if (GETresponse.status !== 200) {
        errors.push(
            `GET Responce Response status is not 200 in the response. Response Status: "${GETresponse.status}" expected "200"`
        );
    }
    if (GETresponse.statusText !== "OK") {
        errors.push(
            `GET Responce Response status text is not OK in the response. Response Status: "${GETresponse.statusText}" expected "OK"`
        );
    }
    if (GETresponseData.status !== true) {
        errors.push(
            `GET Responce Status is not true in the responseData. Response Status: "${GETresponseData.status}" expected "true"`
        );
    }
    if (GETresponseData.message !== "Data fetched successfully") {
        errors.push(
            `GET Responce Unexpected message in the response: "${GETresponseData.message}" expected "Data fetched successfully"`
        );

    }
    if (GETresponseData.data.length === 0) {
        errors.push(`GET Responce Data response should be present in the response`);
    } else {
        if (GETresponseData.data[0].Ticket_Handler == "") {
            errors.push(
                `GET Responce Ticket_Handler doesn't match. Ticket_Handler got: "${GETresponseData.data[0].Ticket_Handler}" Expected Ticket_Handler: "" `
            );
        }

        /*           if (responseData.data[0].Ticket_No !== Ticket_No) {
                       errors.push(
                           `Ticket_No doesn't match. Ticket_No got: "${responseData.data[0].Ticket_No}" Expected Ticket_No: Ticket_No`
                       );
                   }
                   if (responseData.data[0].Ticket_Stage !== "Stage 1") {
                       errors.push(
                           `Ticket_Stage doesn't match. Ticket_Stage got: "${responseData.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
                       );
                   }
                   if (responseData.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
                       errors.push(
                           `Ticket_Activity doesn't match. Ticket_Activity got: "${responseData.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
                       );
                   }
                   if (responseData.data[0].Ticket_Status !== "STS_CO_02") {
                       errors.push(
                           `Ticket_Status doesn't match. Ticket_Status got: "${responseData.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
                       );
                   }
                   if (responseData.data[0].Ticket_Remark !== "") {
                       errors.push(
                           `Ticket_Remark doesn't match. Ticket_Remark got: "${responseData.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
                       );
                   }
                   */

        if (GETresponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `GET Responce VIN_NO doesn't match. VIN_NO got: "${GETresponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (GETresponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `GET Responce ICCID doesn't match. ICCID got: "${GETresponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (GETresponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `GET Responce UIN_NO doesn't match. UIN_NO got: "${GETresponseData.data[0].UIN_NO}" Expected UIN_NO: {UIN_NO}`
            );
        }
        if (GETresponseData.data[0].RTO_STATE !== "MH") {
            errors.push(
                `GET Responce RTO_STATE doesn't match. RTO_STATE got: "${GETresponseData.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (GETresponseData.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `GET Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${GETresponseData.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (GETresponseData.data[0].Process_End_Date_and_Time !== "") {
            errors.push(
                `GET Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${GETresponseData.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
            );
        }
        if (GETresponseData.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `GET Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${GETresponseData.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }
        if (GETresponseData.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `GET Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${GETresponseData.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (GETresponseData.data[0].Certificate_File_Location !== "") {
            errors.push(
                `GET Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${GETresponseData.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (GETresponseData.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `GET Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${GETresponseData.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
    }

    if (errors.length > 0) {
        console.log(
            "Test saveCrmData_ValidData_ValidToken_DataSavedSuccessfully_FE_DataNotInitiated_GetAPIStatus: FAIL"
        );
        console.log("\tErrors: ", errors);
    } else {
        console.log(
            "Test saveCrmData_ValidData_ValidToken_DataSavedSuccessfully_FE_DataNotInitiated_GetAPIStatus: PASS"
        );
    }
}

//Change Request Device Change

async function ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_DeviceChange() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const header = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916420534722028934";
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const crmResponse = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBody
    );
    const errors = [];
    const crmResponseData = await crmResponse.json();

    // Assertions
    if (crmResponse.status !== 200) {
        errors.push(
            `1st CRM Data Responce Response status is not 200 in the Response. Response Status: "${crmResponse.status}" expected "200"`
        );
    }

    if (crmResponse.statusText !== "OK") {
        errors.push(
            `1st CRM Data Responce Response status text is not OK in the response. Response Status: "${crmResponse.statusText}" expected "OK"`
        );
    }
    if (crmResponseData.status !== true) {
        errors.push(
            `1st CRM Data Responce Status is not true in the responseData.Response Status: "${crmResponseData.status}" expected "true"`
        );
    }
    if (crmResponseData.message !== "Data fetched successfully") {
        errors.push(
            `1st CRM Data Responce Unexpected message in the response: "${crmResponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (crmResponseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (crmResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st CRM Data Responce VIN_NO doesn't match. VIN_NO got: "${crmResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (crmResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st CRM Data Responce ICCID doesn't match. ICCID got: "${crmResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (crmResponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `1st CRM Data Responce UIN_NO doesn't match. UIN_NO got: "${crmResponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (crmResponseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `1st CRM Data Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${crmResponseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (crmResponseData.data[0].status !== true) {
            errors.push(
                `1st CRM Data Responce Data status is not true in the crmResponseData. Response Status: "${crmResponseData.data[0].status}" expected "true"`
            );
        }
        if (crmResponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `1st CRM Data Responce Unexpected message in the response: "${crmResponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (crmResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st CRM Data Responce Validation Error should be present in the response`);
        } else if (crmResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st CRM Data Responce Validation Error should be present in the response`);
        }
    }

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const feResponse = await saveFleetedgeDataAPI(
        header,
        saveFleetedgeDataRequestBody
    );
    const feResponseData = await feResponse.json();
    console.log('crmResponseData :>> ', crmResponseData);
    console.log('feResponseData :>> ', feResponseData);
    let ticketNo = feResponseData.data[0].Ticket_No;

    //Assertions
    if (feResponse.status !== 200) {
        errors.push(
            `1st FE Data Responce Response status is not 200 in the response. Response Status: "${feResponse.status}" expected "200"`
        );
    }
    if (feResponse.statusText !== "OK") {
        errors.push(
            `1st FE Data Responce Response status text is not OK in the response. Response Status: "${feResponse.statusText}" expected "OK"`
        );
    }
    if (feResponseData.status !== true) {
        errors.push(
            `1st FE Data Responce Status is not true in the responseData. Response Status: "${feResponseData.status}" expected "true"`
        );
    }
    if (feResponseData.message !== "Data Fetched Successfully") {
        errors.push(
            `1st FE Data Responce Unexpected message in the response: "${feResponseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (feResponseData.data.length === 0) {
        errors.push(`1st FE Data Responce Data response should be present in the response`);
    } else {
        if (feResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st FE Data Responce VIN_NO doesn't match. VIN_NO got: "${feResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (feResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st FE Data Responce ICCID doesn't match. ICCID got: "${feResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (feResponseData.data[0].status !== true) {
            errors.push(
                `1st FE Data Responce Data status is not true in the responseData. Response Status: "${feResponseData.data[0].status}" expected "true"`
            );
        }
        if (feResponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `1st FE Data Responce Unexpected message in the response: "${feResponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (!feResponseData.data[0].Ticket_No) {
            errors.push(`1st FE Data Responce Ticket Number should be present in the response."`);
        } else {
            // let ticketNo = feResponseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (!feResponseData.data[0].VALIDATION_ERROR) {
            errors.push(`1st FE Data Responce Validation Error should be present in the response`);
        } else if (feResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st FE Data Responce Validation Error should be present in the response`);
        }
    }

    let getTicketStatus = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatus.VIN_NO = VIN_NO;
    getTicketStatus.ICCID = ICCID;
    getTicketStatus.Ticket_No = ticketNo;

    const getTicketStatusRequestBody = [getTicketStatus];
    const getAPIResponse = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBody
    );

    const getAPIResponseData = getAPIResponse.data;

    // Assertions
    if (getAPIResponse.status !== 200) {
        errors.push(
            `1st GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponse.status}" expected "200"`
        );
    }
    if (getAPIResponse.statusText !== "OK") {
        errors.push(
            `1st GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponse.statusText}" expected "OK"`
        );
    }
    if (getAPIResponseData.status !== true) {
        errors.push(
            `1st GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseData.status}" expected "true"`
        );
    }
    if (getAPIResponseData.message !== "Data fetched successfully") {
        errors.push(
            `1st GETAPI Responce Unexpected message in the response: "${getAPIResponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (getAPIResponseData.data.length === 0) {
        errors.push(`1st GETAPI Responce Data response should be present in the response`);
    } else {
        if (getAPIResponseData.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `1st GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseData.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_No !== ticketNo) {
            errors.push(
                `1st GETAPI Responce Ticket_No doesn't match. Ticket_No got: "${getAPIResponseData.data[0].Ticket_No}" Expected Ticket_No: ${Ticket_No}`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `1st GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseData.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `1st GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseData.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Status !== "STS_CO_02") {
            errors.push(
                `1st GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseData.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Remark !== "") {
            errors.push(
                `1st GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseData.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (getAPIResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (getAPIResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (getAPIResponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `1st GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (getAPIResponseData.data[0].RTO_STATE !== "MH") {
            errors.push(
                `1st GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseData.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (getAPIResponseData.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `1st GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseData.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (getAPIResponseData.data[0].Process_End_Date_and_Time !== "") {
            errors.push(
                `1st GETAPI Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${getAPIResponseData.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
            );
        }
        if (getAPIResponseData.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `1st GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseData.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }
        if (getAPIResponseData.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `1st GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseData.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (getAPIResponseData.data[0].Certificate_File_Location !== "") {
            errors.push(
                `1st GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseData.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (getAPIResponseData.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `1st GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseData.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
    }
    console.log('getAPIResponseData :>> ', getAPIResponseData);
    //Change Data in CRM API

    let UIN_NO_new = generateRandomString(19);

    let saveCRMDataNew = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMDataNew.VIN_NO = VIN_NO;
    saveCRMDataNew.ICCID = ICCID;
    saveCRMDataNew.UIN_NO = UIN_NO_new;
    saveCRMDataNew.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBodyNew = [saveCRMDataNew];
    const crmResponseNew = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBodyNew
    );

    const crmResponseDataNew = await crmResponseNew.json();
    console.log('crmResponseDataNew :>> ', crmResponseDataNew);
    // console.log('getAPIResponseDataNew :>> ', getAPIResponseDataNew);
    // Assertions
    if (crmResponseNew.status !== 200) {
        errors.push(
            `2nd CRM Responce Response status is not 200 in the Response. Response Status: "${crmResponseNew.status}" expected "200"`
        );
    }

    if (crmResponseNew.statusText !== "OK") {
        errors.push(
            `2nd CRM Responce Response status text is not OK in the response. Response Status: "${crmResponseNew.statusText}" expected "OK"`
        );
    }
    if (crmResponseDataNew.status !== true) {
        errors.push(
            `2nd CRM Responce Status is not true in the responseData. Response Status: "${crmResponseDataNew.status}" expected "true"`
        );
    }
    if (crmResponseDataNew.message !== "Data fetched successfully") {
        errors.push(
            `2nd CRM Responce Unexpected message in the response: "${crmResponseDataNew.message}" expected "Data fetched successfully"`
        );
    }
    if (crmResponseDataNew.data.length === 0) {
        errors.push(`2nd CRM Responce Data response should be present in the response`);
    } else {
        if (crmResponseDataNew.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `2nd CRM Responce VIN_NO doesn't match. VIN_NO got: "${crmResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (crmResponseDataNew.data[0].ICCID !== ICCID) {
            errors.push(
                `2nd CRM Responce ICCID doesn't match. ICCID got: "${crmResponseDataNew.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (crmResponseDataNew.data[0].UIN_NO !== UIN_NO_new) {
            errors.push(
                `2nd CRM Responce UIN_NO doesn't match. UIN_NO got: "${crmResponseDataNew.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO_new}"`
            );
        }
        if (crmResponseDataNew.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `2nd CRM Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${crmResponseDataNew.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (crmResponseDataNew.data[0].status !== true) {
            errors.push(
                `2nd CRM Responce Data status is not true in the crmResponseData. Response Status: "${crmResponseDataNew.data[0].status}" expected "true"`
            );
        }
        if (crmResponseDataNew.data[0].message !== "Data saved Successfully") {
            errors.push(
                `2nd CRM Responce Unexpected message in the response: "${crmResponseDataNew.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (crmResponseDataNew.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`2nd CRM Responce Validation Error should be present in the response`);
        } else if (crmResponseDataNew.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`2nd CRM Responce Validation Error should be present in the response`);
        }
    }
    //GET New Ticket Responce

    let Ticket_No_New = ticketNo;

    let getTicketStatusNew = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatusNew.VIN_NO = VIN_NO;
    getTicketStatusNew.ICCID = ICCID;
    getTicketStatusNew.Ticket_No = Ticket_No_New;

    const getTicketStatusRequestBodyNew = [getTicketStatusNew];
    const getAPIResponseNew = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBodyNew
    );

    const getAPIResponseDataNew = getAPIResponseNew.data;
    console.log('getAPIResponseDataNew :>> ', getAPIResponseDataNew);
    // Assertions
    if (getAPIResponseNew.status !== 200) {
        errors.push(
            `2nd GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponseNew.status}" expected "200"`
        );
    }
    if (getAPIResponseNew.statusText !== "OK") {
        errors.push(
            `2nd GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponseNew.statusText}" expected "OK"`
        );
    }
    if (getAPIResponseDataNew.status !== true) {
        errors.push(
            `2nd GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseDataNew.status}" expected "true"`
        );
    }
    if (getAPIResponseDataNew.message !== "Data fetched successfully") {
        errors.push(
            `2nd GETAPI Responce Unexpected message in the response: "${getAPIResponseDataNew.message}" expected "Data fetched successfully"`
        );
    }
    if (getAPIResponseDataNew.data.length === 0) {
        errors.push(`2nd GETAPI Responce Data response should be present in the response`);
    } else {
        if (getAPIResponseDataNew.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `2nd GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseDataNew.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (!getAPIResponseDataNew.data[0].Ticket_No) {
            errors.push(`2nd GETAPI Responce Ticket Number should be present in the response."`);
        } else if (getAPIResponseDataNew.data[0].Ticket_No !== ticketNo) {
            errors.push(
                `2nd GETAPI Responce Ticket_No doesn't match. Ticket_No got: "${getAPIResponseDataNew.data[0].Ticket_No}" Expected Ticket_No: ${ticketNo}`
            );
        } else {

            let [heading, date, index] = getAPIResponseDataNew.data[0].Ticket_No.split("-");
            if (!heading) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (getAPIResponseDataNew.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `2nd GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseDataNew.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `2nd GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseDataNew.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Status !== "STS_CO_20") {
            errors.push(
                `2nd GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseDataNew.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Remark !== "") {
            errors.push(
                `2nd GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseDataNew.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `2nd GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseDataNew.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (getAPIResponseDataNew.data[0].ICCID !== ICCID) {
            errors.push(
                `2nd GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseDataNew.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (getAPIResponseDataNew.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `2nd GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseDataNew.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (getAPIResponseDataNew.data[0].RTO_STATE !== "MH") {
            errors.push(
                `2nd GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseDataNew.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (getAPIResponseDataNew.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `2nd GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseDataNew.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (!getAPIResponseDataNew.data[0].Process_End_Date_and_Time) {
            errors.push(
                `2nd GETAPI Responce Process_End_Date_and_Time should be present`
            );
        }
        if (getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        } else if (getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }

        if (getAPIResponseDataNew.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseDataNew.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].Certificate_File_Location !== "") {
            errors.push(
                `2nd GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseDataNew.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `2nd GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseDataNew.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }

        // 

        let getTicketStatusNewPostCR = JSON.parse(JSON.stringify(mainTicketStatusData));
        getTicketStatusNewPostCR.VIN_NO = VIN_NO;
        getTicketStatusNewPostCR.ICCID = ICCID;
        getTicketStatusNewPostCR.Ticket_No = "";

        const getTicketStatusRequestBodyNewPostCR = [getTicketStatusNewPostCR];
        const getAPIResponseNewPostCR = await getTicketStatusAPI(
            header,
            getTicketStatusRequestBodyNewPostCR
        );

        const getAPIResponseDataNewPostCR = getAPIResponseNewPostCR.data;
        console.log('getAPIResponseDataNewPostCR :>> ', getAPIResponseDataNewPostCR);
        // Assertions
        if (getAPIResponseNewPostCR.status !== 200) {
            errors.push(
                `CR GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponseNewPostCR.status}" expected "200"`
            );
        }
        if (getAPIResponseNewPostCR.statusText !== "OK") {
            errors.push(
                `CR GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponseNewPostCR.statusText}" expected "OK"`
            );
        }
        if (getAPIResponseDataNewPostCR.status !== true) {
            errors.push(
                `CR GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseDataNewPostCR.status}" expected "true"`
            );
        }
        if (getAPIResponseDataNewPostCR.message !== "Data fetched successfully") {
            errors.push(
                `CR GETAPI Responce Unexpected message in the response: "${getAPIResponseDataNewPostCR.message}" expected "Data fetched successfully"`
            );
        }
        if (getAPIResponseDataNewPostCR.data.length === 0) {
            errors.push(`CR GETAPI Responce Data response should be present in the response`);
        } else {
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Handler !== "Shivani Bhosale") {
                errors.push(
                    `CR GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
                );
            }
            if (!getAPIResponseDataNewPostCR.data[0].Ticket_No) {
                errors.push(`CR GETAPI Responce Ticket Number should be present in the response."`);
            } else {

                let [heading, date, index] = getAPIResponseDataNewPostCR.data[0].Ticket_No.split("-");
                if (!heading) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                    );
                } else if (heading != "AEPL") {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                    );
                }
                if (!index) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                    );
                } else if (Number(index) <= 0) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                    );
                }
                if (!date) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                    );
                } else if (date !== dateGeneratorYYMMDD()) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                    );
                }
            }

            if (getAPIResponseDataNewPostCR.data[0].Ticket_Stage !== "Stage 1") {
                errors.push(
                    `CR GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
                errors.push(
                    `CR GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Status !== "STS_CO_02") {
                errors.push(
                    `CR GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Remark !== "") {
                errors.push(
                    `CR GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].VIN_NO !== VIN_NO) {
                errors.push(
                    `CR GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseDataNewPostCR.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].ICCID !== ICCID) {
                errors.push(
                    `CR GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseDataNewPostCR.data[0].ICCID}" Expected ICCID: "${ICCID}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].UIN_NO !== UIN_NO_new) {
                errors.push(
                    `CR GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseDataNewPostCR.data[0].UIN_NO_new}" Expected UIN_NO: "${UIN_NO_new}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].RTO_STATE !== "MH") {
                errors.push(
                    `CR GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseDataNewPostCR.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].RTO_OFFICE_CODE !== "MH 12") {
                errors.push(
                    `CR GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseDataNewPostCR.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Process_End_Date_and_Time !== "") {
                errors.push(
                    `CR GETAPI Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${getAPIResponseDataNewPostCR.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certification_Registration_Date_and_Time !== "") {
                errors.push(
                    `CR GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNewPostCR.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certification_Expiry_Date !== "") {
                errors.push(
                    `CR GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseDataNewPostCR.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certificate_File_Location !== "") {
                errors.push(
                    `CR GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseDataNewPostCR.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certificate_File_Names.length !== 0) {
                errors.push(
                    `CR GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseDataNewPostCR.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
                );
            }
        }

        if (errors.length > 0) {
            console.log(
                "Test ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_DeviceChange: FAIL"
            );
            console.log("\tErrors: ", errors);
        } else {
            console.log(
                "Test ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_DeviceChange: PASS"
            );
            //console.log('feResponseData :>> ', feResponseData);

        }
    }
}

//Change Request RTO Change

async function ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_RTOChange() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const header = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916420534722028934";
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const crmResponse = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBody
    );
    const errors = [];
    const crmResponseData = await crmResponse.json();

    // Assertions
    if (crmResponse.status !== 200) {
        errors.push(
            `1st CRM Data Responce Response status is not 200 in the Response. Response Status: "${crmResponse.status}" expected "200"`
        );
    }

    if (crmResponse.statusText !== "OK") {
        errors.push(
            `1st CRM Data Responce Response status text is not OK in the response. Response Status: "${crmResponse.statusText}" expected "OK"`
        );
    }
    if (crmResponseData.status !== true) {
        errors.push(
            `1st CRM Data Responce Status is not true in the responseData.Response Status: "${crmResponseData.status}" expected "true"`
        );
    }
    if (crmResponseData.message !== "Data fetched successfully") {
        errors.push(
            `1st CRM Data Responce Unexpected message in the response: "${crmResponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (crmResponseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (crmResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st CRM Data Responce VIN_NO doesn't match. VIN_NO got: "${crmResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (crmResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st CRM Data Responce ICCID doesn't match. ICCID got: "${crmResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (crmResponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `1st CRM Data Responce UIN_NO doesn't match. UIN_NO got: "${crmResponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (crmResponseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `1st CRM Data Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${crmResponseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (crmResponseData.data[0].status !== true) {
            errors.push(
                `1st CRM Data Responce Data status is not true in the crmResponseData. Response Status: "${crmResponseData.data[0].status}" expected "true"`
            );
        }
        if (crmResponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `1st CRM Data Responce Unexpected message in the response: "${crmResponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (crmResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st CRM Data Responce Validation Error should be present in the response`);
        } else if (crmResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st CRM Data Responce Validation Error should be present in the response`);
        }
    }

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const feResponse = await saveFleetedgeDataAPI(
        header,
        saveFleetedgeDataRequestBody
    );
    const feResponseData = await feResponse.json();
    console.log('crmResponseData :>> ', crmResponseData);
    console.log('feResponseData :>> ', feResponseData);
    let ticketNo = feResponseData.data[0].Ticket_No;

    //Assertions
    if (feResponse.status !== 200) {
        errors.push(
            `1st FE Data Responce Response status is not 200 in the response. Response Status: "${feResponse.status}" expected "200"`
        );
    }
    if (feResponse.statusText !== "OK") {
        errors.push(
            `1st FE Data Responce Response status text is not OK in the response. Response Status: "${feResponse.statusText}" expected "OK"`
        );
    }
    if (feResponseData.status !== true) {
        errors.push(
            `1st FE Data Responce Status is not true in the responseData. Response Status: "${feResponseData.status}" expected "true"`
        );
    }
    if (feResponseData.message !== "Data Fetched Successfully") {
        errors.push(
            `1st FE Data Responce Unexpected message in the response: "${feResponseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (feResponseData.data.length === 0) {
        errors.push(`1st FE Data Responce Data response should be present in the response`);
    } else {
        if (feResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st FE Data Responce VIN_NO doesn't match. VIN_NO got: "${feResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (feResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st FE Data Responce ICCID doesn't match. ICCID got: "${feResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (feResponseData.data[0].status !== true) {
            errors.push(
                `1st FE Data Responce Data status is not true in the responseData. Response Status: "${feResponseData.data[0].status}" expected "true"`
            );
        }
        if (feResponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `1st FE Data Responce Unexpected message in the response: "${feResponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (!feResponseData.data[0].Ticket_No) {
            errors.push(`1st FE Data Responce Ticket Number should be present in the response."`);
        } else {
            // let ticketNo = feResponseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (!feResponseData.data[0].VALIDATION_ERROR) {
            errors.push(`1st FE Data Responce Validation Error should be present in the response`);
        } else if (feResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st FE Data Responce Validation Error should be present in the response`);
        }
    }

    let getTicketStatus = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatus.VIN_NO = VIN_NO;
    getTicketStatus.ICCID = ICCID;
    getTicketStatus.Ticket_No = ticketNo;

    const getTicketStatusRequestBody = [getTicketStatus];
    const getAPIResponse = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBody
    );

    const getAPIResponseData = getAPIResponse.data;

    // Assertions
    if (getAPIResponse.status !== 200) {
        errors.push(
            `1st GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponse.status}" expected "200"`
        );
    }
    if (getAPIResponse.statusText !== "OK") {
        errors.push(
            `1st GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponse.statusText}" expected "OK"`
        );
    }
    if (getAPIResponseData.status !== true) {
        errors.push(
            `1st GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseData.status}" expected "true"`
        );
    }
    if (getAPIResponseData.message !== "Data fetched successfully") {
        errors.push(
            `1st GETAPI Responce Unexpected message in the response: "${getAPIResponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (getAPIResponseData.data.length === 0) {
        errors.push(`1st GETAPI Responce Data response should be present in the response`);
    } else {
        if (getAPIResponseData.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `1st GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseData.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_No !== ticketNo) {
            errors.push(
                `1st GETAPI Responce Ticket_No doesn't match. Ticket_No got: "${getAPIResponseData.data[0].Ticket_No}" Expected Ticket_No: ${Ticket_No}`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `1st GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseData.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `1st GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseData.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Status !== "STS_CO_02") {
            errors.push(
                `1st GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseData.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Remark !== "") {
            errors.push(
                `1st GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseData.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (getAPIResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (getAPIResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (getAPIResponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `1st GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (getAPIResponseData.data[0].RTO_STATE !== "MH") {
            errors.push(
                `1st GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseData.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (getAPIResponseData.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `1st GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseData.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (getAPIResponseData.data[0].Process_End_Date_and_Time !== "") {
            errors.push(
                `1st GETAPI Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${getAPIResponseData.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
            );
        }
        if (getAPIResponseData.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `1st GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseData.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }
        if (getAPIResponseData.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `1st GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseData.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (getAPIResponseData.data[0].Certificate_File_Location !== "") {
            errors.push(
                `1st GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseData.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (getAPIResponseData.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `1st GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseData.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
    }
    console.log('getAPIResponseData :>> ', getAPIResponseData);
    //Change Data in CRM API

    //let UIN_NO_new = generateRandomString(19);
    let RTO_OFFICE_CODE_New = "MH 19"; 
    let RTO_STATE_New = "MH";

    let saveCRMDataNew = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMDataNew.VIN_NO = VIN_NO;
    saveCRMDataNew.ICCID = ICCID;
    saveCRMDataNew.UIN_NO = UIN_NO;
    saveCRMDataNew.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMDataNew.RTO_STATE = RTO_STATE_New;
    saveCRMDataNew.RTO_OFFICE_CODE = RTO_OFFICE_CODE_New;

    const saveCRMDataRequestBodyNew = [saveCRMDataNew];
    const crmResponseNew = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBodyNew
    );

    const crmResponseDataNew = await crmResponseNew.json();
    console.log('crmResponseDataNew :>> ', crmResponseDataNew);
    // console.log('getAPIResponseDataNew :>> ', getAPIResponseDataNew);
    // Assertions
    if (crmResponseNew.status !== 200) {
        errors.push(
            `2nd CRM Responce Response status is not 200 in the Response. Response Status: "${crmResponseNew.status}" expected "200"`
        );
    }

    if (crmResponseNew.statusText !== "OK") {
        errors.push(
            `2nd CRM Responce Response status text is not OK in the response. Response Status: "${crmResponseNew.statusText}" expected "OK"`
        );
    }
    if (crmResponseDataNew.status !== true) {
        errors.push(
            `2nd CRM Responce Status is not true in the responseData. Response Status: "${crmResponseDataNew.status}" expected "true"`
        );
    }
    if (crmResponseDataNew.message !== "Data fetched successfully") {
        errors.push(
            `2nd CRM Responce Unexpected message in the response: "${crmResponseDataNew.message}" expected "Data fetched successfully"`
        );
    }
    if (crmResponseDataNew.data.length === 0) {
        errors.push(`2nd CRM Responce Data response should be present in the response`);
    } else {
        if (crmResponseDataNew.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `2nd CRM Responce VIN_NO doesn't match. VIN_NO got: "${crmResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (crmResponseDataNew.data[0].ICCID !== ICCID) {
            errors.push(
                `2nd CRM Responce ICCID doesn't match. ICCID got: "${crmResponseDataNew.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (crmResponseDataNew.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `2nd CRM Responce UIN_NO doesn't match. UIN_NO got: "${crmResponseDataNew.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (crmResponseDataNew.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `2nd CRM Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${crmResponseDataNew.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (crmResponseDataNew.data[0].status !== true) {
            errors.push(
                `2nd CRM Responce Data status is not true in the crmResponseData. Response Status: "${crmResponseDataNew.data[0].status}" expected "true"`
            );
        }
        if (crmResponseDataNew.data[0].message !== "Data saved Successfully") {
            errors.push(
                `2nd CRM Responce Unexpected message in the response: "${crmResponseDataNew.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (crmResponseDataNew.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`2nd CRM Responce Validation Error should be present in the response`);
        } else if (crmResponseDataNew.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`2nd CRM Responce Validation Error should be present in the response`);
        }
    }
    //GET New Ticket Responce

    let Ticket_No_New = ticketNo;

    let getTicketStatusNew = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatusNew.VIN_NO = VIN_NO;
    getTicketStatusNew.ICCID = ICCID;
    getTicketStatusNew.Ticket_No = Ticket_No_New;

    const getTicketStatusRequestBodyNew = [getTicketStatusNew];
    const getAPIResponseNew = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBodyNew
    );

    const getAPIResponseDataNew = getAPIResponseNew.data;
    console.log('getAPIResponseDataNew :>> ', getAPIResponseDataNew);
   
    // Assertions
    if (getAPIResponseNew.status !== 200) {
        errors.push(
            `2nd GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponseNew.status}" expected "200"`
        );
    }
    if (getAPIResponseNew.statusText !== "OK") {
        errors.push(
            `2nd GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponseNew.statusText}" expected "OK"`
        );
    }
    if (getAPIResponseDataNew.status !== true) {
        errors.push(
            `2nd GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseDataNew.status}" expected "true"`
        );
    }
    if (getAPIResponseDataNew.message !== "Data fetched successfully") {
        errors.push(
            `2nd GETAPI Responce Unexpected message in the response: "${getAPIResponseDataNew.message}" expected "Data fetched successfully"`
        );
    }
    if (getAPIResponseDataNew.data.length === 0) {
        errors.push(`2nd GETAPI Responce Data response should be present in the response`);
    } else {
        if (getAPIResponseDataNew.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `2nd GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseDataNew.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (!getAPIResponseDataNew.data[0].Ticket_No) {
            errors.push(`2nd GETAPI Responce Ticket Number should be present in the response."`);
        } else if (getAPIResponseDataNew.data[0].Ticket_No !== ticketNo) {
            errors.push(
                `2nd GETAPI Responce Ticket_No doesn't match. Ticket_No got: "${getAPIResponseDataNew.data[0].Ticket_No}" Expected Ticket_No: ${ticketNo}`
            );
        } else {

            let [heading, date, index] = getAPIResponseDataNew.data[0].Ticket_No.split("-");
            if (!heading) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (getAPIResponseDataNew.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `2nd GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseDataNew.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `2nd GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseDataNew.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Status !== "STS_CO_22") {
            errors.push(
                `2nd GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseDataNew.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_22"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Remark !== "") {
            errors.push(
                `2nd GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseDataNew.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `2nd GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseDataNew.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (getAPIResponseDataNew.data[0].ICCID !== ICCID) {
            errors.push(
                `2nd GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseDataNew.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (getAPIResponseDataNew.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `2nd GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseDataNew.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (getAPIResponseDataNew.data[0].RTO_STATE !== RTO_STATE_New) {
            errors.push(
                `2nd GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseDataNew.data[0].RTO_STATE}" Expected RTO_STATE: "${RTO_STATE_New}"`
            );
        }
        if (getAPIResponseDataNew.data[0].RTO_OFFICE_CODE == RTO_OFFICE_CODE_New) {
            errors.push(
                `2nd GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseDataNew.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "${RTO_OFFICE_CODE_New}"`
            );
        }
        if (!getAPIResponseDataNew.data[0].Process_End_Date_and_Time) {
            errors.push(
                `2nd GETAPI Responce Process_End_Date_and_Time should be present`
            );
        }
        if (getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        } else if (getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }

        if (getAPIResponseDataNew.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseDataNew.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].Certificate_File_Location !== "") {
            errors.push(
                `2nd GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseDataNew.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `2nd GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseDataNew.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }

        // 

        let getTicketStatusNewPostCR = JSON.parse(JSON.stringify(mainTicketStatusData));
        getTicketStatusNewPostCR.VIN_NO = VIN_NO;
        getTicketStatusNewPostCR.ICCID = ICCID;
        getTicketStatusNewPostCR.Ticket_No = "";

        const getTicketStatusRequestBodyNewPostCR = [getTicketStatusNewPostCR];
        const getAPIResponseNewPostCR = await getTicketStatusAPI(
            header,
            getTicketStatusRequestBodyNewPostCR
        );

        const getAPIResponseDataNewPostCR = getAPIResponseNewPostCR.data;
        console.log('getAPIResponseDataNewPostCR :>> ', getAPIResponseDataNewPostCR);
        // Assertions
        if (getAPIResponseNewPostCR.status !== 200) {
            errors.push(
                `CR GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponseNewPostCR.status}" expected "200"`
            );
        }
        if (getAPIResponseNewPostCR.statusText !== "OK") {
            errors.push(
                `CR GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponseNewPostCR.statusText}" expected "OK"`
            );
        }
        if (getAPIResponseDataNewPostCR.status !== true) {
            errors.push(
                `CR GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseDataNewPostCR.status}" expected "true"`
            );
        }
        if (getAPIResponseDataNewPostCR.message !== "Data fetched successfully") {
            errors.push(
                `CR GETAPI Responce Unexpected message in the response: "${getAPIResponseDataNewPostCR.message}" expected "Data fetched successfully"`
            );
        }
        if (getAPIResponseDataNewPostCR.data.length === 0) {
            errors.push(`CR GETAPI Responce Data response should be present in the response`);
        } else {
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Handler !== "Shivani Bhosale") {
                errors.push(
                    `CR GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
                );
            }
            if (!getAPIResponseDataNewPostCR.data[0].Ticket_No) {
                errors.push(`CR GETAPI Responce Ticket Number should be present in the response."`);
            } else {

                let [heading, date, index] = getAPIResponseDataNewPostCR.data[0].Ticket_No.split("-");
                if (!heading) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                    );
                } else if (heading != "AEPL") {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                    );
                }
                if (!index) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                    );
                } else if (Number(index) <= 0) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                    );
                }
                if (!date) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                    );
                } else if (date !== dateGeneratorYYMMDD()) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                    );
                }
            }

            if (getAPIResponseDataNewPostCR.data[0].Ticket_Stage !== "Stage 1") {
                errors.push(
                    `CR GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
                errors.push(
                    `CR GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Status !== "STS_CO_02") {
                errors.push(
                    `CR GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Remark !== "") {
                errors.push(
                    `CR GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].VIN_NO !== VIN_NO) {
                errors.push(
                    `CR GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseDataNewPostCR.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].ICCID !== ICCID) {
                errors.push(
                    `CR GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseDataNewPostCR.data[0].ICCID}" Expected ICCID: "${ICCID}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].UIN_NO !== UIN_NO) {
                errors.push(
                    `CR GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseDataNewPostCR.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].RTO_STATE == "RTO_STATE_New") {
                errors.push(
                    `CR GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseDataNewPostCR.data[0].RTO_STATE}" Expected RTO_STATE: "${RTO_STATE_New}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].RTO_OFFICE_CODE == "RTO_OFFICE_CODE_New") {
                errors.push(
                    `CR GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseDataNewPostCR.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "${RTO_OFFICE_CODE_New}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Process_End_Date_and_Time !== "") {
                errors.push(
                    `CR GETAPI Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${getAPIResponseDataNewPostCR.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certification_Registration_Date_and_Time !== "") {
                errors.push(
                    `CR GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNewPostCR.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certification_Expiry_Date !== "") {
                errors.push(
                    `CR GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseDataNewPostCR.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certificate_File_Location !== "") {
                errors.push(
                    `CR GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseDataNewPostCR.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certificate_File_Names.length !== 0) {
                errors.push(
                    `CR GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseDataNewPostCR.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
                );
            }
        }

        if (errors.length > 0) {
            console.log(
                "Test ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_RTOChange: FAIL"
            );
            console.log("\tErrors: ", errors);
        } else {
            console.log(
                "Test ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_RTOChange: PASS"
            );
            //console.log('feResponseData :>> ', feResponseData);

        }
    }
}

//Change Request Vehicle_Owner_Change
async function ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_VehicleOwnerChange() {
    const tokenResponse = await tokenGenerator(mainTokenRequestBody);
    const tokenResponseData = await tokenResponse.json();
    const token = tokenResponseData.token;
    const header = {
        "Content-Type": "application/json",
        token: token,
    };

    let VIN_NO = generateRandomString(17);
    let ICCID = "89916420534722028934";
    let UIN_NO = generateRandomString(19);
    let DEVICE_IMEI = generateRandomString(15);

    let saveCRMData = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMData.VIN_NO = VIN_NO;
    saveCRMData.ICCID = ICCID;
    saveCRMData.UIN_NO = UIN_NO;
    saveCRMData.DEVICE_IMEI = DEVICE_IMEI;

    const saveCRMDataRequestBody = [saveCRMData];
    const crmResponse = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBody
    );
    const errors = [];
    const crmResponseData = await crmResponse.json();

    // Assertions
    if (crmResponse.status !== 200) {
        errors.push(
            `1st CRM Data Responce Response status is not 200 in the Response. Response Status: "${crmResponse.status}" expected "200"`
        );
    }

    if (crmResponse.statusText !== "OK") {
        errors.push(
            `1st CRM Data Responce Response status text is not OK in the response. Response Status: "${crmResponse.statusText}" expected "OK"`
        );
    }
    if (crmResponseData.status !== true) {
        errors.push(
            `1st CRM Data Responce Status is not true in the responseData.Response Status: "${crmResponseData.status}" expected "true"`
        );
    }
    if (crmResponseData.message !== "Data fetched successfully") {
        errors.push(
            `1st CRM Data Responce Unexpected message in the response: "${crmResponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (crmResponseData.data.length === 0) {
        errors.push(`Data response should be present in the response`);
    } else {
        if (crmResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st CRM Data Responce VIN_NO doesn't match. VIN_NO got: "${crmResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (crmResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st CRM Data Responce ICCID doesn't match. ICCID got: "${crmResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (crmResponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `1st CRM Data Responce UIN_NO doesn't match. UIN_NO got: "${crmResponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (crmResponseData.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `1st CRM Data Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${crmResponseData.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (crmResponseData.data[0].status !== true) {
            errors.push(
                `1st CRM Data Responce Data status is not true in the crmResponseData. Response Status: "${crmResponseData.data[0].status}" expected "true"`
            );
        }
        if (crmResponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `1st CRM Data Responce Unexpected message in the response: "${crmResponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (crmResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st CRM Data Responce Validation Error should be present in the response`);
        } else if (crmResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st CRM Data Responce Validation Error should be present in the response`);
        }
    }

    let saveFleetedgeData = JSON.parse(JSON.stringify(mainFEData));
    saveFleetedgeData.VIN_NO = VIN_NO;
    saveFleetedgeData.ICCID = ICCID;

    const saveFleetedgeDataRequestBody = [saveFleetedgeData];
    const feResponse = await saveFleetedgeDataAPI(
        header,
        saveFleetedgeDataRequestBody
    );
    const feResponseData = await feResponse.json();
    console.log('crmResponseData :>> ', crmResponseData);
    console.log('feResponseData :>> ', feResponseData);
    let ticketNo = feResponseData.data[0].Ticket_No;

    //Assertions
    if (feResponse.status !== 200) {
        errors.push(
            `1st FE Data Responce Response status is not 200 in the response. Response Status: "${feResponse.status}" expected "200"`
        );
    }
    if (feResponse.statusText !== "OK") {
        errors.push(
            `1st FE Data Responce Response status text is not OK in the response. Response Status: "${feResponse.statusText}" expected "OK"`
        );
    }
    if (feResponseData.status !== true) {
        errors.push(
            `1st FE Data Responce Status is not true in the responseData. Response Status: "${feResponseData.status}" expected "true"`
        );
    }
    if (feResponseData.message !== "Data Fetched Successfully") {
        errors.push(
            `1st FE Data Responce Unexpected message in the response: "${feResponseData.message}" expected "Data Fetched Successfully"`
        );
    }
    if (feResponseData.data.length === 0) {
        errors.push(`1st FE Data Responce Data response should be present in the response`);
    } else {
        if (feResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st FE Data Responce VIN_NO doesn't match. VIN_NO got: "${feResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (feResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st FE Data Responce ICCID doesn't match. ICCID got: "${feResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (feResponseData.data[0].status !== true) {
            errors.push(
                `1st FE Data Responce Data status is not true in the responseData. Response Status: "${feResponseData.data[0].status}" expected "true"`
            );
        }
        if (feResponseData.data[0].message !== "Data saved Successfully") {
            errors.push(
                `1st FE Data Responce Unexpected message in the response: "${feResponseData.data[0].message}" expected "Data saved Successfully"`
            );
        }
        if (!feResponseData.data[0].Ticket_No) {
            errors.push(`1st FE Data Responce Ticket Number should be present in the response."`);
        } else {
            // let ticketNo = feResponseData.data[0].Ticket_No;
            let [heading, date, index] = ticketNo.split("-");
            if (!heading) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `1st FE Data Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (!feResponseData.data[0].VALIDATION_ERROR) {
            errors.push(`1st FE Data Responce Validation Error should be present in the response`);
        } else if (feResponseData.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`1st FE Data Responce Validation Error should be present in the response`);
        }
    }

    let getTicketStatus = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatus.VIN_NO = VIN_NO;
    getTicketStatus.ICCID = ICCID;
    getTicketStatus.Ticket_No = ticketNo;

    const getTicketStatusRequestBody = [getTicketStatus];
    const getAPIResponse = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBody
    );

    const getAPIResponseData = getAPIResponse.data;

    // Assertions
    if (getAPIResponse.status !== 200) {
        errors.push(
            `1st GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponse.status}" expected "200"`
        );
    }
    if (getAPIResponse.statusText !== "OK") {
        errors.push(
            `1st GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponse.statusText}" expected "OK"`
        );
    }
    if (getAPIResponseData.status !== true) {
        errors.push(
            `1st GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseData.status}" expected "true"`
        );
    }
    if (getAPIResponseData.message !== "Data fetched successfully") {
        errors.push(
            `1st GETAPI Responce Unexpected message in the response: "${getAPIResponseData.message}" expected "Data fetched successfully"`
        );
    }
    if (getAPIResponseData.data.length === 0) {
        errors.push(`1st GETAPI Responce Data response should be present in the response`);
    } else {
        if (getAPIResponseData.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `1st GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseData.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_No !== ticketNo) {
            errors.push(
                `1st GETAPI Responce Ticket_No doesn't match. Ticket_No got: "${getAPIResponseData.data[0].Ticket_No}" Expected Ticket_No: ${Ticket_No}`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `1st GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseData.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `1st GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseData.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Status !== "STS_CO_02") {
            errors.push(
                `1st GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseData.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
            );
        }
        if (getAPIResponseData.data[0].Ticket_Remark !== "") {
            errors.push(
                `1st GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseData.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (getAPIResponseData.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `1st GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (getAPIResponseData.data[0].ICCID !== ICCID) {
            errors.push(
                `1st GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseData.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (getAPIResponseData.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `1st GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseData.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (getAPIResponseData.data[0].RTO_STATE !== "MH") {
            errors.push(
                `1st GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseData.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (getAPIResponseData.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `1st GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseData.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (getAPIResponseData.data[0].Process_End_Date_and_Time !== "") {
            errors.push(
                `1st GETAPI Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${getAPIResponseData.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
            );
        }
        if (getAPIResponseData.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `1st GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseData.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }
        if (getAPIResponseData.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `1st GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseData.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (getAPIResponseData.data[0].Certificate_File_Location !== "") {
            errors.push(
                `1st GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseData.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (getAPIResponseData.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `1st GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseData.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
    }
    console.log('getAPIResponseData :>> ', getAPIResponseData);
    //Change Data in CRM API

    //let UIN_NO_new = generateRandomString(19);
    let VEHICLE_OWNER_LAST_NAME_New = generateRandomString(19);
    
    let saveCRMDataNew = JSON.parse(JSON.stringify(mainCRMData));
    saveCRMDataNew.VIN_NO = VIN_NO;
    saveCRMDataNew.ICCID = ICCID;
    saveCRMDataNew.UIN_NO = UIN_NO;
    saveCRMDataNew.DEVICE_IMEI = DEVICE_IMEI;
    saveCRMDataNew.VEHICLE_OWNER_LAST_NAME = "VEHICLE_OWNER_LAST_NAME_New";

    const saveCRMDataRequestBodyNew = [saveCRMDataNew];
    const crmResponseNew = await saveCRMDataAPI(
        header,
        saveCRMDataRequestBodyNew
    );

    const crmResponseDataNew = await crmResponseNew.json();
    console.log('crmResponseDataNew :>> ', crmResponseDataNew);
    // console.log('getAPIResponseDataNew :>> ', getAPIResponseDataNew);
    // Assertions
    if (crmResponseNew.status !== 200) {
        errors.push(
            `2nd CRM Responce Response status is not 200 in the Response. Response Status: "${crmResponseNew.status}" expected "200"`
        );
    }

    if (crmResponseNew.statusText !== "OK") {
        errors.push(
            `2nd CRM Responce Response status text is not OK in the response. Response Status: "${crmResponseNew.statusText}" expected "OK"`
        );
    }
    if (crmResponseDataNew.status !== true) {
        errors.push(
            `2nd CRM Responce Status is not true in the responseData. Response Status: "${crmResponseDataNew.status}" expected "true"`
        );
    }
    if (crmResponseDataNew.message !== "Data fetched successfully") {
        errors.push(
            `2nd CRM Responce Unexpected message in the response: "${crmResponseDataNew.message}" expected "Data fetched successfully"`
        );
    }
    if (crmResponseDataNew.data.length === 0) {
        errors.push(`2nd CRM Responce Data response should be present in the response`);
    } else {
        if (crmResponseDataNew.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `2nd CRM Responce VIN_NO doesn't match. VIN_NO got: "${crmResponseData.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (crmResponseDataNew.data[0].ICCID !== ICCID) {
            errors.push(
                `2nd CRM Responce ICCID doesn't match. ICCID got: "${crmResponseDataNew.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (crmResponseDataNew.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `2nd CRM Responce UIN_NO doesn't match. UIN_NO got: "${crmResponseDataNew.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (crmResponseDataNew.data[0].DEVICE_IMEI !== DEVICE_IMEI) {
            errors.push(
                `2nd CRM Responce DEVICE_IMEI doesn't match. DEVICE_IMEI got: "${crmResponseDataNew.data[0].DEVICE_IMEI}" Expected DEVICE_IMEI: "${DEVICE_IMEI}"`
            );
        }
        if (crmResponseDataNew.data[0].status !== true) {
            errors.push(
                `2nd CRM Responce Data status is not true in the crmResponseData. Response Status: "${crmResponseDataNew.data[0].status}" expected "true"`
            );
        }
        if (crmResponseDataNew.data[0].message !== "Data saved Successfully") {
            errors.push(
                `2nd CRM Responce Unexpected message in the response: "${crmResponseDataNew.data[0].message}" expected "Data saved Successfully"`
            );
        }
    
        if (crmResponseDataNew.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`2nd CRM Responce Validation Error should be present in the response`);
        } else if (crmResponseDataNew.data[0].VALIDATION_ERROR.length !== 0) {
            errors.push(`2nd CRM Responce Validation Error should be present in the response`);
        }
    }
    //GET New Ticket Responce

    let Ticket_No_New = ticketNo;

    let getTicketStatusNew = JSON.parse(JSON.stringify(mainTicketStatusData));
    getTicketStatusNew.VIN_NO = VIN_NO;
    getTicketStatusNew.ICCID = ICCID;
    getTicketStatusNew.Ticket_No = Ticket_No_New;
    //getTicketStatusNew.VEHICLE_OWNER_LAST_NAME = "VEHICLE_OWNER_LAST_NAME_New";

    const getTicketStatusRequestBodyNew = [getTicketStatusNew];
    const getAPIResponseNew = await getTicketStatusAPI(
        header,
        getTicketStatusRequestBodyNew
    );

    const getAPIResponseDataNew = getAPIResponseNew.data;
    console.log('getAPIResponseDataNew :>> ', getAPIResponseDataNew);
   
    // Assertions
    if (getAPIResponseNew.status !== 200) {
        errors.push(
            `2nd GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponseNew.status}" expected "200"`
        );
    }
    if (getAPIResponseNew.statusText !== "OK") {
        errors.push(
            `2nd GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponseNew.statusText}" expected "OK"`
        );
    }
    if (getAPIResponseDataNew.status !== true) {
        errors.push(
            `2nd GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseDataNew.status}" expected "true"`
        );
    }
    if (getAPIResponseDataNew.message !== "Data fetched successfully") {
        errors.push(
            `2nd GETAPI Responce Unexpected message in the response: "${getAPIResponseDataNew.message}" expected "Data fetched successfully"`
        );
    }
    if (getAPIResponseDataNew.data.length === 0) {
        errors.push(`2nd GETAPI Responce Data response should be present in the response`);
    } else {
        if (getAPIResponseDataNew.data[0].Ticket_Handler !== "Shivani Bhosale") {
            errors.push(
                `2nd GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseDataNew.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
            );
        }
        if (!getAPIResponseDataNew.data[0].Ticket_No) {
            errors.push(`2nd GETAPI Responce Ticket Number should be present in the response."`);
        } else if (getAPIResponseDataNew.data[0].Ticket_No !== ticketNo) {
            errors.push(
                `2nd GETAPI Responce Ticket_No doesn't match. Ticket_No got: "${getAPIResponseDataNew.data[0].Ticket_No}" Expected Ticket_No: ${ticketNo}`
            );
        } else {

            let [heading, date, index] = getAPIResponseDataNew.data[0].Ticket_No.split("-");
            if (!heading) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                );
            } else if (heading != "AEPL") {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                );
            }
            if (!index) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                );
            } else if (Number(index) <= 0) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                );
            }
            if (!date) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                );
            } else if (date !== dateGeneratorYYMMDD()) {
                errors.push(
                    `2nd GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                );
            }
        }
        if (getAPIResponseDataNew.data[0].Ticket_Stage !== "Stage 1") {
            errors.push(
                `2nd GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseDataNew.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
            errors.push(
                `2nd GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseDataNew.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Status !== "STS_CO_21") {
            errors.push(
                `2nd GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseDataNew.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_21"`
            );
        }
        if (getAPIResponseDataNew.data[0].Ticket_Remark !== "") {
            errors.push(
                `2nd GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseDataNew.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].VIN_NO !== VIN_NO) {
            errors.push(
                `2nd GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseDataNew.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
            );
        }
        if (getAPIResponseDataNew.data[0].ICCID !== ICCID) {
            errors.push(
                `2nd GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseDataNew.data[0].ICCID}" Expected ICCID: "${ICCID}"`
            );
        }
        if (getAPIResponseDataNew.data[0].UIN_NO !== UIN_NO) {
            errors.push(
                `2nd GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseDataNew.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
            );
        }
        if (getAPIResponseDataNew.data[0].RTO_STATE !== "MH") {
            errors.push(
                `2nd GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseDataNew.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
            );
        }
        if (getAPIResponseDataNew.data[0].RTO_OFFICE_CODE !== "MH 12") {
            errors.push(
                `2nd GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseDataNew.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
            );
        }
        if (!getAPIResponseDataNew.data[0].Process_End_Date_and_Time) {
            errors.push(
                `2nd GETAPI Responce Process_End_Date_and_Time should be present`
            );
        }
        if (getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        } else if (getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNew.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
            );
        }

        if (getAPIResponseDataNew.data[0].Certification_Expiry_Date !== "") {
            errors.push(
                `2nd GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseDataNew.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].Certificate_File_Location !== "") {
            errors.push(
                `2nd GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseDataNew.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
            );
        }
        if (getAPIResponseDataNew.data[0].Certificate_File_Names.length !== 0) {
            errors.push(
                `2nd GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseDataNew.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
            );
        }
 
        let getTicketStatusNewPostCR = JSON.parse(JSON.stringify(mainTicketStatusData));
        getTicketStatusNewPostCR.VIN_NO = VIN_NO;
        getTicketStatusNewPostCR.ICCID = ICCID;
        getTicketStatusNewPostCR.Ticket_No = "";
        getTicketStatusNewPostCR.VEHICLE_OWNER_LAST_NAME = "VEHICLE_OWNER_LAST_NAME_New";

        const getTicketStatusRequestBodyNewPostCR = [getTicketStatusNewPostCR];
        const getAPIResponseNewPostCR = await getTicketStatusAPI(
            header,
            getTicketStatusRequestBodyNewPostCR
        );

        const getAPIResponseDataNewPostCR = getAPIResponseNewPostCR.data;
        console.log('getAPIResponseDataNewPostCR :>> ', getAPIResponseDataNewPostCR);
        // Assertions
        if (getAPIResponseNewPostCR.status !== 200) {
            errors.push(
                `CR GETAPI Responce Response status is not 200 in the response. Response Status: "${getAPIResponseNewPostCR.status}" expected "200"`
            );
        }
        if (getAPIResponseNewPostCR.statusText !== "OK") {
            errors.push(
                `CR GETAPI Responce Response status text is not OK in the response. Response Status: "${getAPIResponseNewPostCR.statusText}" expected "OK"`
            );
        }
        if (getAPIResponseDataNewPostCR.status !== true) {
            errors.push(
                `CR GETAPI Responce Status is not true in the responseData. Response Status: "${getAPIResponseDataNewPostCR.status}" expected "true"`
            );
        }
        if (getAPIResponseDataNewPostCR.message !== "Data fetched successfully") {
            errors.push(
                `CR GETAPI Responce Unexpected message in the response: "${getAPIResponseDataNewPostCR.message}" expected "Data fetched successfully"`
            );
        }
        if (getAPIResponseDataNewPostCR.data.length === 0) {
            errors.push(`CR GETAPI Responce Data response should be present in the response`);
        } else {
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Handler !== "Shivani Bhosale") {
                errors.push(
                    `CR GETAPI Responce Ticket_Handler doesn't match. Ticket_Handler got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Handler}" Expected Ticket_Handler: "Shivani Bhosale"`
                );
            }
            if (!getAPIResponseDataNewPostCR.data[0].Ticket_No) {
                errors.push(`CR GETAPI Responce Ticket Number should be present in the response."`);
            } else {

                let [heading, date, index] = getAPIResponseDataNewPostCR.data[0].Ticket_No.split("-");
                if (!heading) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header missing`
                    );
                } else if (heading != "AEPL") {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${heading}" expected "AEPL"`
                    );
                }
                if (!index) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Index missing`
                    );
                } else if (Number(index) <= 0) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number index got: "${index}"`
                    );
                }
                if (!date) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Date missing`
                    );
                } else if (date !== dateGeneratorYYMMDD()) {
                    errors.push(
                        `CR GETAPI Responce Ticket Number does not follow the nomenclature guidelines. Ticket Number Header got: "${date}" expected "${dateGeneratorYYMMDD()}"`
                    );
                }
            }

            if (getAPIResponseDataNewPostCR.data[0].Ticket_Stage !== "Stage 1") {
                errors.push(
                    `CR GETAPI Responce Ticket_Stage doesn't match. Ticket_Stage got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Stage}" Expected Ticket_Stage: "Stage 1"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Activity !== "FOTA / OTA  Activities") {
                errors.push(
                    `CR GETAPI Responce Ticket_Activity doesn't match. Ticket_Activity got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Activity}" Expected Ticket_Activity: "FOTA / OTA  Activities"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Status !== "STS_CO_02") {
                errors.push(
                    `CR GETAPI Responce Ticket_Status doesn't match. Ticket_Status got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Status}" Expected Ticket_Status: "STS_CO_02"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Ticket_Remark !== "") {
                errors.push(
                    `CR GETAPI Responce Ticket_Remark doesn't match. Ticket_Remark got: "${getAPIResponseDataNewPostCR.data[0].Ticket_Remark}" Expected Ticket_Remark: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].VIN_NO !== VIN_NO) {
                errors.push(
                    `CR GETAPI Responce VIN_NO doesn't match. VIN_NO got: "${getAPIResponseDataNewPostCR.data[0].VIN_NO}" Expected VIN_NO: "${VIN_NO}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].ICCID !== ICCID) {
                errors.push(
                    `CR GETAPI Responce ICCID doesn't match. ICCID got: "${getAPIResponseDataNewPostCR.data[0].ICCID}" Expected ICCID: "${ICCID}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].UIN_NO !== UIN_NO) {
                errors.push(
                    `CR GETAPI Responce UIN_NO doesn't match. UIN_NO got: "${getAPIResponseDataNewPostCR.data[0].UIN_NO}" Expected UIN_NO: "${UIN_NO}"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].RTO_STATE !== "MH") {
                errors.push(
                    `CR GETAPI Responce RTO_STATE doesn't match. RTO_STATE got: "${getAPIResponseDataNewPostCR.data[0].RTO_STATE}" Expected RTO_STATE: "MH"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].RTO_OFFICE_CODE !== "MH 12") {
                errors.push(
                    `CR GETAPI Responce RTO_OFFICE_CODE doesn't match. RTO_OFFICE_CODE got: "${getAPIResponseDataNewPostCR.data[0].RTO_OFFICE_CODE}" Expected RTO_OFFICE_CODE: "MH 12"`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Process_End_Date_and_Time !== "") {
                errors.push(
                    `CR GETAPI Responce Process_End_Date_and_Time doesn't match. Process_End_Date_and_Time got: "${getAPIResponseDataNewPostCR.data[0].Process_End_Date_and_Time}" Expected Process_End_Date_and_Time: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certification_Registration_Date_and_Time !== "") {
                errors.push(
                    `CR GETAPI Responce Certification_Registration_Date_and_Time doesn't match. Certification_Registration_Date_and_Time got: "${getAPIResponseDataNewPostCR.data[0].Certification_Registration_Date_and_Time}" Expected Certification_Registration_Date_and_Time: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certification_Expiry_Date !== "") {
                errors.push(
                    `CR GETAPI Responce Certification_Expiry_Date doesn't match. Certification_Expiry_Date got: "${getAPIResponseDataNewPostCR.data[0].Certification_Expiry_Date}" Expected Certification_Expiry_Date: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certificate_File_Location !== "") {
                errors.push(
                    `CR GETAPI Responce Certificate_File_Location doesn't match. Certificate_File_Location got: "${getAPIResponseDataNewPostCR.data[0].Certificate_File_Location}" Expected Certificate_File_Location: ""`
                );
            }
            if (getAPIResponseDataNewPostCR.data[0].Certificate_File_Names.length !== 0) {
                errors.push(
                    `CR GETAPI Responce Certificate_File_Names doesn't match. Certificate_File_Names got: "${getAPIResponseDataNewPostCR.data[0].Certificate_File_Names}" Expected Certificate_File_Names: ""`
                );
            }

           
        }

        if (errors.length > 0) {
            console.log(
                "Test ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_VehicleOwnerChange: FAIL"
            );
            console.log("\tErrors: ", errors);
        } else {
            console.log(
                "Test ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_VehicleOwnerChange: PASS"
            );
            //console.log('feResponseData :>> ', feResponseData);

        }
    }
}



(async () => {
    try {
        //  await generateToken_ValidUsernameValidPassword_TokenGenerated();
        //  await generateToken_InvalidUsernameInvalidPassword_TokenNotGenerated();
        //  await generateToken_MissingPassword_TokenNotGenerated();
        //  await generateToken_MissingUsername_TokenNotGenerated();
        //  await saveCrmData_ValidData_ValidToken_DataSavedSuccessfully(); 
        //  await saveCrmData_ValidData_InvalidToken_UnauthorizedAccess();
        //  await saveCrmData_ValidData_MissingToken_PleasePassToken();
        //  await saveCrmData_EmptyList_ValidToken_DataFetchedSuccessfully();
        //  await saveCrmData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01();
        //  await saveCrmData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01();
        //  await saveCrmData_ValidToken_InvalidData_ICCID_Empty_ERR_02();
        //  await saveCrmData_ValidToken_InvalidData_ICCID_Missing_ERR_02();
        //  await saveCrmData_ValidToken_InvalidData_UIN_NO_Empty_ERR_03();
        //  await saveCrmData_ValidToken_InvalidData_UIN_NO_Missing_ERR_03();
        //  await saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Empty_ERR_04()
        //  await saveCrmData_ValidToken_InvalidData_DEVICE_IMEI_Missing_ERR_04();
        //  await saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Empty_ERR_05();
        //  await saveCrmData_ValidToken_InvalidData_DEVICE_MAKE_Missing_ERR_05();
        //  await saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MAKE_ERR_06();
        //  await saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Empty_ERR_07();
        //  await saveCrmData_ValidToken_InvalidData_DEVICE_MODEL_Missing_ERR_07();
        //  await saveCrmData_ValidToken_ValidData_Valid_DEVICE_MODEL_DataSavedSuccessfully();
        //  await saveCrmData_ValidToken_InvalidData_Invalid_DEVICE_MODEL_ERR_08();
        //  await saveCrmData_ValidToken_InvalidData_ENGINE_NO_Empty_ERR_10();
        //  await saveCrmData_ValidToken_InvalidData_ENGINE_NO_Missing_ERR_10();
        //  await saveCrmData_ValidToken_InvalidData_REG_NUMBER_Empty_ERR_11();
        //  await saveCrmData_ValidToken_InvalidData_REG_NUMBER_Missing_ERR_11();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Empty_ERR_13();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_LAST_NAME_Missing_ERR_13();
        //  await saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Empty_ERR_14();
        //  await saveCrmData_ValidToken_InvalidData_ADDRESS_LINE_1_Missing_ERR_14();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Empty_ERR_15();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_CITY_Missing_ERR_15();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Empty_ERR_16();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Missing_ERR_16();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Non_Numeric_ERR_17();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_OWNER_REGISTERED_MOBILE_Length_Equal_10_ERR_18();
        //  await saveCrmData_ValidToken_InvalidData_DEALER_CODE_Empty_ERR_19();
        //  await saveCrmData_ValidToken_InvalidData_DEALER_CODE_Missing_ERR_19();
        //  await saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Empty_ERR_20();
        //  await saveCrmData_ValidToken_InvalidData_POA_DOC_NAME_Missing_ERR_20();
        //  await saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Empty_ERR_21();
        //  await saveCrmData_ValidToken_InvalidData_POA_DOC_NO_Missing_ERR_21();
        //  await saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Empty_ERR_22();
        //  await saveCrmData_ValidToken_InvalidData_POI_DOC_TYPE_Missing_ERR_22();
        //  await saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Empty_ERR_23();
        //  await saveCrmData_ValidToken_InvalidData_POI_DOC_NO_Missing_ERR_23();
        //  await saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Empty_ERR_24();
        //  await saveCrmData_ValidToken_InvalidData_RTO_OFFICE_CODE_Missing_ERR_24();
        //  await saveCrmData_ValidToken_InvalidData_RTO_STATE_Empty_ERR_25();
        //  await saveCrmData_ValidToken_InvalidData_RTO_STATE_Missing_ERR_25();
        //  await saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Empty_ERR_27();
        //  await saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Empty_ERR_28();
        //  await saveCrmData_ValidToken_InvalidData_PRIMARY_OPERATOR_Missing_ERR_27();
        //  await saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Missing_ERR_28();
        //  await saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Non_Numeric_ERR_29();
        //  await saveCrmData_ValidToken_InvalidData_PRIMARY_MOBILE_NUMBER_Less_Than_15_ERR_30();
        //  await saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Empty_ERR_31();
        //  await saveCrmData_ValidToken_InvalidData_SECONDARY_OPERATOR_Missing_ERR_31();
        //  await saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Less_Than_15_ERR_32();
        //  await saveCrmData_ValidToken_InvalidData_SECONDARY_MOBILE_NUMBER_Non_Numeric_ERR_33();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Empty_ERR_34();
        //  await saveCrmData_ValidToken_InvalidData_VEHICLE_MODEL_Missing_ERR_34();
        //  await saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Empty_ERR_35();
        //  await saveCrmData_ValidToken_InvalidData_COMMERCIAL_ACTIVATION_START_DATE_Missing_ERR_35();
        //  await saveCrmData_ValidToken_InvalidData_MFG_YEAR_Empty_ERR_38();
        //  await saveCrmData_ValidToken_InvalidData_MFG_YEAR_Missing_ERR_38();
        //  await saveCrmData_ValidToken_ValidData_DUPLICATE_DATA_ERR_39();
        //  await saveCrmData_ValidToken_ValidData_Change_Request_After_Stage_2_ERR_40();
        //  await saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Empty_ERR_41();
        //  await saveCrmData_ValidToken_InvalidData_INVOICE_DATE_Missing_ERR_41();
        //  await saveFleetedgeData_ValidData_ValidToken_DataSavedSuccessfully();
        //  await saveFleetedgeData_ValidData_InvalidToken_UnauthorizedAccess();
        //  await saveFleetedgeData_ValidData_InvalidToken_UnauthorizedAccess();
        //  await saveFleetedgeData_ValidData_InvalidToken_UnauthorizedAccess();
        //  await saveFleetedgeData_ValidData_MissingToken_PleasePassToken();
        //  await saveFleetedgeData_EmptyList_ValidToken_DataFetchedSuccessfully();
        //  await saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Empty_ERR_01();
        //  await saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Missing_ERR_01();
        //  await saveFleetedgeData_ValidToken_InvalidData_VIN_NO_Not_Present_ERR_02();
        //  await saveFleetedgeData_ValidToken_InvalidData_ICCID_Empty_ERR_03();
        //  await saveFleetedgeData_ValidToken_InvalidData_ICCID_Missing_ERR_03()
        //  await saveFleetedgeData_ValidToken_InvalidData_ICCID_Not_Present_ERR_04();
        //  await saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Empty_ERR_07();
        //  await saveFleetedgeData_ValidToken_InvalidData_REQUEST_TYPE_Missing_ERR_07();
        //  await saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Empty_ERR_08();
        //  await saveFleetedgeData_ValidToken_InvalidData_CERTIFICATE_VALIDITY_DURATION_IN_YEAR_Missing_ERR_08();
        //  await getTicketStatus_ValidData_ValidToken_DataFetchedSuccessfully();
        //  await getTicketStatus_ValidData_InvalidToken_UnauthorizedAccess();
        //  await getTicketStatus_ValidData_MissingToken_PleasePassToken();
        //  await getTicketStatus_EmptyList_ValidToken_DataFetchedSuccessfully();

        //  await saveFleetedgeData_LoadTesting_ValidData_ValidToken_DataSavedSuccessfully();
        //  await saveCRMData_LoadTesting_ValidData_ValidToken_DataSavedSuccessfully();
        //  await saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithoutCRMDataPushed_DataAlreadyExists();
        //  await saveFleetedgeData_ValidData_ValidToken_DuplicateDataWithCRMDataPushed_DataAlreadyExists();
        //  await getTicketStatus_ValidData_ValidToken_NOCRMDataSent_FESDataSent_GETStatusAPI_TicketGenerated_STS_CO_19();
        //  await ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_DeviceChange();
        //  await saveCrmData_ValidData_ValidToken_DataSavedSuccessfully_FE_DataNotInitiated_GetAPIStatus();
        //  await ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_RTOChange();
          await ValidToken_SaveCRMData_SaveFEData_DataSavedSuccessfully_GETStatus_ChageRequest_VehicleOwnerChange();
    }
    catch (error) {
        console.log(`Error... ${error}`);
    }
})();
