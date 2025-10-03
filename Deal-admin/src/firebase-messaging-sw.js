importScripts("https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyANUT2TJvnISJZL3PW4xOAsMuU7xUfq5X4",
    authDomain: "ionic-olx-d3206.firebaseapp.com",
    projectId: "ionic-olx-d3206",
    storageBucket: "ionic-olx-d3206.appspot.com",
    messagingSenderId: "519451432286",
    appId: "1:519451432286:web:a57442ea34f786537f2bcf",
    measurementId: "G-G7D5LYG26S"
});
const messaging = firebase.messaging();  

// messaging.onBackgroundMessage((payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Sahayak Admin';
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: 'src/assets/logo.jpg'
//     };

//     self.registration.showNotification(notificationTitle, notificationOptions);
// });