importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB_ZtUgtC0cR-FDTvDR-UPy0N42dEA8v9I",
  authDomain: "cemail-bf0aa.firebaseapp.com",
  projectId: "cemail-bf0aa",
  storageBucket: "cemail-bf0aa.firebasestorage.app",
  messagingSenderId: "945058766923",
  appId: "1:945058766923:web:0a2200c1bf52ca25fe6dce",
  measurementId: "G-JL9D3GP38X"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
