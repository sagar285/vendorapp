var admin = require("firebase-admin");

var serviceAccount = require("./ghartak-92ab5-firebase-adminsdk-fbsvc-d2cc73ccae.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});





const sendSingleNotification = async (token, title, body, data = {}) => {
  try {
    if (!token) {
      console.log("FCM token not found");
      return;
    }

    const message = {
      token:token,
      data: {
       title:title,
        body:body
      }
    };              

    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);

    return response;
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};
sendSingleNotification()
module.exports = {sendSingleNotification};