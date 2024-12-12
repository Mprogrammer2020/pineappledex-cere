import { useState } from "react";
import { GlobalContext } from "./GlobalContext";

export const GlobalStates = (props) => {
    const [showAnimation, setShowAnimation] = useState(false);
    const [showOpenLimit, setShowOpenLimit] =useState(false)
    const [fcmToken, setFcmToken] = useState(localStorage.getItem("fcmToken") || '');
    const [showNotification, setShowNotification] = useState(false);
    const [managenotification, setManagenotification] = useState(false);
    const [showOpenLimitCount, setShowOpenLimitCount] = useState(false);
    const [globalKey, setGlobalKey] = useState(localStorage.getItem("key") || 'swap');
    const [isChangemetamaskWallet, setIsChangemetamaskWallet] = useState(false);
    const [showtoken, setShowToken]=useState(localStorage.getItem("login"))
    const [cancelLimitOrder, setCancelLimitOrder] = useState(false);
    const [showSliceInsights, setShowSliceInsights] = useState(localStorage.getItem("showSliceInsights") || false)
    const [notificationData, setNotificationdata] = useState()
    const [importNewToken, setImportNewToken]=useState(false)
    const [manageAnimation, setManageAimation]=useState(false)
 

    const value = {
        showAnimation, setShowAnimation,
        showOpenLimit,setShowOpenLimit,
        fcmToken, setFcmToken,
        showNotification,setShowNotification,
        managenotification, setManagenotification,
        showOpenLimitCount,setShowOpenLimitCount,
        globalKey,setGlobalKey,
        isChangemetamaskWallet, setIsChangemetamaskWallet,
        cancelLimitOrder, setCancelLimitOrder,
        showSliceInsights, setShowSliceInsights,
        notificationData, setNotificationdata,
        showtoken, setShowToken,
        importNewToken, setImportNewToken,
        manageAnimation, setManageAimation

    }

    return (<GlobalContext.Provider value={value}>
    {props.children}
</GlobalContext.Provider>)
}