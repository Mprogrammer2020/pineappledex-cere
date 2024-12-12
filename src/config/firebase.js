// import { useEffect, useContext } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { initializeApp } from '@firebase/app';
// import { GlobalContext } from '../globalStates.js/GlobalContext';
// import { getMessaging, getToken, onMessage } from '@firebase/messaging';

// import { getFirestore, initializeFirestore } from 'firebase/firestore';


// // Your Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyB7P0q7QZD9mC1p7fCtULx3XENErS04iv4",
//   authDomain: "pineapple-e77fe.firebaseapp.com",
//   projectId: "pineapple-e77fe",
//   storageBucket: "pineapple-e77fe.appspot.com",
//   messagingSenderId: "698092437776",
//   appId: "1:698092437776:web:a538f9df4d021f433aa595",
//   measurementId: "G-Z7M7Z5JTND"
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// const useNotificationSetup = () => {
//   const globalStates = useContext(GlobalContext);

//   useEffect(() => {
//     const setupNotifications = async () => {
//       try {
//         // Request permission for notifications
//         const permission = await Notification.requestPermission();

//         if (permission === 'granted') {
//           console.log('Notification permission granted.');
//           // Get the FCM token
//           const messaging = getMessaging();
//           const token = await getToken(messaging);
//           console.log('FCM Token:', token);
//           globalStates.setFcmToken(token);
//           localStorage.setItem('fcmToken', token);
//           // globalStates?.setManagenotification(!globalStates.managenotification);
//         } else {
//           console.log('Notification permission denied.');
//         }

//         // Handle foreground notifications
//         onMessage(messaging, (payload) => {
//           console.log('Foreground Message:', payload.notification.title, payload);
//           globalStates.setManagenotification(!globalStates.managenotification);
//           toast.info(`New Notification: ${payload.notification.title}`, {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             toastId: 'success_draft_1',
//           });
//         });
//       } catch (error) {
//         console.error('Error setting up notifications:', error);
//       }
//     };

//     setupNotifications();
//   }, [globalStates]);
// };
// export default useNotificationSetup;

import { useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initializeApp } from 'firebase/app';
import { GlobalContext } from '../globalStates.js/GlobalContext';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB7P0q7QZD9mC1p7fCtULx3XENErS04iv4",
  authDomain: "pineapple-e77fe.firebaseapp.com",
  projectId: "pineapple-e77fe",
  storageBucket: "pineapple-e77fe.appspot.com",
  messagingSenderId: "698092437776",
  appId: "1:698092437776:web:a538f9df4d021f433aa595",
  measurementId: "G-Z7M7Z5JTND"
};

// Detect MetaMask Browser
const isMetaMaskBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /MetaMask/i.test(ua);
};

const firebaseApp = initializeApp(firebaseConfig);
let messaging;

const useNotificationSetup = () => {
  const globalStates = useContext(GlobalContext);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        if (isMetaMaskBrowser()) {
          console.log('MetaMask browser detected. Firebase may not work as expected.');
          // Provide an alternative UI or disable notification functionality if MetaMask browser
          return;
        }

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          messaging = getMessaging(firebaseApp);
          
          // Get the FCM token
          const token = await getToken(messaging, { vapidKey: 'BHZmoQvLMF-JlWy_ZCk900-_S9JjuhkKBsKc69t7XQcmSmI8KPLAFYThiNCcmDkvTh1asgTbLxOLpBlTZPdGQ5w' });
          console.log('FCM Token:', token);
          globalStates.setFcmToken(token);
          localStorage.setItem('fcmToken', token);

        } else {
          console.log('Notification permission denied.');
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('Foreground Message:', payload.notification.title, payload);
          globalStates.setManagenotification(!globalStates.managenotification);
          toast.info(`New Notification: ${payload.notification.title}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: 'success_draft_1',
          });
        });
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [globalStates]);
};

export default useNotificationSetup;


