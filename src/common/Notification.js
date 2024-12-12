import { useContext, useEffect, useState } from "react";
import { useWeb3 } from "../config/Web3Context";
import { pineappleDexService } from "../service/api.service";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from "../globalStates.js/GlobalContext";

export const Notification = () => {
    const [showTransaction, setShowTransaction] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const globalStates = useContext(GlobalContext);
    const navigate = useNavigate();
    const handleCloseTransaction = () => setShowTransaction(false);
    const isJuicedPath = window.location.pathname === '/juiced';
    const isCurrentPath = window.location.pathname === '/swap';
    const handleShowOpenLimitList = (item) => {
        if(isJuicedPath){
          globalStates.setNotificationdata(item)
            globalStates.setShowNotification(false)
            globalStates.setShowOpenLimit(true)
        }
        if(isCurrentPath){
          globalStates.setNotificationdata(item)
            navigate("/juiced")
            localStorage.setItem("theme", "dark")
            document.body.className = "theme-dark"
            globalStates.setShowNotification(false)
            globalStates.setShowOpenLimit(true)
        }
    };
    const [nitificationList, setNotificationList] = useState()
    const key = localStorage.getItem("key")
    const { walletAddress, connectWallet, web3, checkNetwork } = useWeb3();

    useEffect(() => {
        GetNotificationData()
    }, [globalStates?.managenotification])

    /* get open limit order list */
    async function GetNotificationData() {
        setLoading(true);
        try {
            const response = await pineappleDexService.getNotificationList();
            if (response?.status === 200) {
                // console.log("response", response?.data?.data)
                setNotificationList(response?.data?.data)
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoading(false);
        }
    }

    const weiToEth = (weiAmount, web3) => {
        const ethAmount = web3.utils.fromWei(weiAmount, 'ether');
        return parseFloat(ethAmount).toFixed(5);
    };
    return (
        <div className="notification-menu-outer">
        <div className="notification-menu-cross" onClick={() => globalStates.setShowNotification(false)}>
          <img src={require("../assets/images/yellow-cross.svg").default} alt="img" />
          <img className="notification-white-cross" src={require("../assets/images/white-cross.svg").default} alt="img" />
        </div>
        {loading ? (
          <span className="outer-skeleton">
            <Skeleton count={5} height={80} />
          </span>
        ) : (
          nitificationList?.notifications && nitificationList.notifications.length > 0 ? (
            nitificationList.notifications.map((item, index) => {
              const expirationTime = item.transactionId?.expireDateTime;
              const formattedDate = expirationTime && moment(expirationTime).isValid()
                ? moment(expirationTime).format('MM/DD/YY, hh:mm A')
                : moment().format('MM/DD/YY, hh:mm A');
  
              const fromAmountEth = Number(item?.transactionId?.fromAmount) / Number(10 ** item?.transactionId?.fromToken?.decimals);
              const toAmountEth = Number(item?.transactionId?.toAmount) / Number(10 ** item?.transactionId?.toToken?.decimals);
              const shortAmount = fromAmountEth && fromAmountEth.toString().length > 5 ? fromAmountEth.toFixed(5) + "..." : fromAmountEth;
              const ToshortAmount = toAmountEth && toAmountEth.toString().length > 5 ? toAmountEth.toFixed(5) + "..." : toAmountEth;
              const isNearingExpiration = expirationTime && moment(expirationTime).diff(moment(), 'minutes') <= 30;
  
              return (
                <div className="notification-menu" key={index} onClick={(e) => handleShowOpenLimitList(item)}>
                  <h3>{formattedDate}</h3>
                  <div className="open-limits-tokens-bottom notification-tokens">
                    <h6>
                    {item?.transactionId?.fromToken?.logoURI ?
                     <img src={item?.transactionId?.fromToken?.logoURI} alt="token" /> :
                     <div className="token-alphabet notification-token-alphabet"
                     >
                          <span> {item?.transactionId?.fromToken?.name?.charAt(0)?.toUpperCase() || 'N/A'}</span>
                     </div>}
                      {shortAmount} {item?.transactionId?.fromToken?.symbol}</h6>
                    <img className="curatin-limit-arrow" src={require("../assets/images/limit-arrow.svg").default} alt="arrow" />
                    <h6>
                    {item?.transactionId?.toToken?.logoURI ?
                     <img src={item?.transactionId?.toToken?.logoURI} alt="token" />
                     :
                     <div className="token-alphabet notification-token-alphabet"
                     >
                         <span>  {item?.transactionId?.toToken?.name?.charAt(0)?.toUpperCase() || 'N/A'}</span>
                     </div>
                    }
                      {toAmountEth} {item?.transactionId?.toToken?.symbol}</h6>
                  </div>
                  <h5>when {ToshortAmount} {item?.transactionId?.fromToken?.symbol}/{toAmountEth} {item?.transactionId?.toToken?.symbol}</h5>
                   <h4><div className="circle"></div>{item?.title}</h4>
                </div>
              );
            })
          ) : (
            <div className="no-data-area">
            <img src={require("../assets/images/no-data-bg.gif")} alt="img" />
            <h3>No Notification available.</h3>
        </div>
          )
        )}
      </div>
    )
}