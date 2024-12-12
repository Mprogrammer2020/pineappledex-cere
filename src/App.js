import { SkeletonTheme } from 'react-loading-skeleton';
import './App.css';
import './assets/css/style.css'
import "./assets/css/dark.css"
import Routing from './routing/Routing';
import 'react-loading-skeleton/dist/skeleton.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useVisibilityChange from './firebaseNotification/useVisibilityChange';
import { useContext, useEffect } from 'react';
import useNotificationSetup, { setupNotifications } from './config/firebase';
import { sendNativeNotification, toastNotification } from './firebaseNotification/notificationHelpers';
import { ToastContainer } from 'react-toastify';
import { GlobalContext } from './globalStates.js/GlobalContext';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import { getInjectedAdapters } from '@web3auth/default-evm-adapter';
import { chainConfig, web3authClientId, privateKeyProvider, web3auth } from './config/config';
import { WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { useWeb3 } from './config/Web3Context';
import Web3 from 'web3';


function App() {
  useNotificationSetup();
  const isForeground = useVisibilityChange();
  const globalContext = useContext(GlobalContext);
  const { setWeb3 } = useWeb3();

  // useEffect(() => {
  //   setupNotifications((message) => {
  //     console.log("message",message);
  //     // if (isForeground) {
  //     //   // App is in the foreground, show toast notification
  //     //   toastNotification({
  //     //     title,
  //     //     description: body,
  //     //     status: "info",
  //     //   });
  //     // } else {
  //     //   // App is in the background, show native notification
  //     //   sendNativeNotification({
  //     //     title,
  //     //     body,
  //     //   });
  //     // }
  //   });
  // }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'NEW_NOTIFICATION') {
          globalContext.setManagenotification(!globalContext.managenotification);
        }
      });
    }
  }, []);


  useEffect(() => {
    const init = async () => {
      try {
        let metamaskAdapter = new MetamaskAdapter();
        const adapters = await getInjectedAdapters({
          options: {
            clientId: web3authClientId,
            chainConfig: chainConfig,
            web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
            privateKeyProvider: privateKeyProvider,
          }
        });

        if (adapters.length <= 0) {
          web3auth.configureAdapter(metamaskAdapter);
        }
        adapters.forEach((adapter) => {
          web3auth.configureAdapter(adapter);
        });

        function getLoginMethod(method, showOnModal = false) {
          return {
            [method]: {
              name: method,
              showOnModal,
            }
          };
        }

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.AUTH]: {
              label: "auth",
              loginMethods: {
                ...getLoginMethod("google"),
                ...getLoginMethod("sms_passwordless"),
                ...getLoginMethod("email_passwordless"),
                ...getLoginMethod("facebook"),
                ...getLoginMethod("discord"),
                ...getLoginMethod("reddit"),
                ...getLoginMethod("reddit"),
                ...getLoginMethod("apple"),
                ...getLoginMethod("twitch"),
                ...getLoginMethod("line"),
                ...getLoginMethod("github"),
                ...getLoginMethod("kakao"),
                ...getLoginMethod("linkedin"),
                ...getLoginMethod("twitter"),
                ...getLoginMethod("weibo"),
                ...getLoginMethod("wechat"),
                ...getLoginMethod("farcaster"),
                ...getLoginMethod("passkeys"),
                ...getLoginMethod("authenticator"),
              },
            },
          },
        });
        console.log("web3auth.provider", web3auth.provider);
        const web3Instance = new Web3(web3auth.provider);
        setWeb3(web3Instance);

      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  return (
    <>
      <ToastContainer />
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Router>
          <Routing />
        </Router>
      </SkeletonTheme>
    </>
  );
}

export default App;
