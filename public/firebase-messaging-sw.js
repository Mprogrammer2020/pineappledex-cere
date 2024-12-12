// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB7P0q7QZD9mC1p7fCtULx3XENErS04iv4",
  authDomain: "pineapple-e77fe.firebaseapp.com",
  projectId: "pineapple-e77fe",
  storageBucket: "pineapple-e77fe.appspot.com",
  messagingSenderId: "698092437776",
  appId: "1:698092437776:web:a538f9df4d021f433aa595",
  measurementId: "G-Z7M7Z5JTND"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// Customize background notification handling here
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        payload: payload
      });
    });
  });
});