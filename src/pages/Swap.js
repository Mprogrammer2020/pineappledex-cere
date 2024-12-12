import { Accordion, Button, Col, Container, Dropdown, Form, Modal, OverlayTrigger, Row, Tab, Tabs, Tooltip } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { pineappleDexService } from "../service/api.service";
import swal from 'sweetalert';
import ChainList from "../common/ChainList";
import { formatWalletAddress, useWeb3, connectWallet } from "../config/Web3Context";
import ERC20ABI from "../common/ERC20ABI.json"
import Web3 from 'web3';
import { ETHERSCAN_URL, KeyDown, numberToLocaleString, options, socialIcons, CONTRACT_ADDRESS } from "../config/config";
import ErrorModals from "../common/ErrorModals";
import Select from "react-select";
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLinks from "../common/SocialLinks";

import AddToken from "../common/AddToken";
import { GlobalContext } from "../globalStates.js/GlobalContext";
import Abi_ERC20 from "../pages/Abi_ERC20.json";

const Swap = ({ selectedToken1, setSelectedToken1, selectedToken2, setSelectedToken2, showSliceInsights, setShowSliceInsights }) => {
    const [chainId, setChainId] = useState(null);
    const [metaMaskModal, setMetaMaskModal] = useState("")
    const globalStates = useContext(GlobalContext);
    const location = useLocation();
    const [key, setKey] = useState(localStorage.getItem("key") || 'swap');
    const navigate = useNavigate();
    const [timer, setTimer] = useState(moment().startOf('day'));
    const [showJuiced, setShowJuiced] = useState(false);
    const isJuicedPath = window.location.pathname === '/juiced';
    const isCurrentPath = window.location.pathname === '/swap';
    const [showSteps, setShowSteps] = useState(false);
    const handleShowSteps = () => setShowSteps(true);
    const shouldShowToggle = window.location.pathname !== '/juiced';
    const [transactionDetails, setTransactionDetails] = useState({})
    const [errorData, setErrorData] = useState()
    const [isSwap, setIsSwap] = useState(false)
    const [typingamountTimeout, setTypingAmountTimeout] = useState(null)
    const [sleepage, setSleepage] = useState({})
    const [approveSwaModal, setApproveSwaModal] = useState("initiated")
    const [manageApproveData, setManageApproveData] = useState("pending")
    const [swaModal, setSwaModal] = useState("pending")
    const [showShimmer, setShowShimmer] = useState(true);
    const [showTokens1, setShowTokens1] = useState(false);
    const [showTokens2, setShowTokens2] = useState(false);
    const [showTokens3, setShowTokens3] = useState(false);
    const [showError, setShowError] = useState(false);
    const [tokenList, setTokenList] = useState([]);
    const [swapdetail, setSwapDetail] = useState()
    const [topTokenList, setTopTokenList] = useState([])
    const { walletAddress, connectWallet, web3, checkNetwork } = useWeb3();
    const allowanceRef = useRef(0)
    const [slippageType, setSlippageType] = useState(localStorage.getItem(`slippageType`) || 'Auto');
    const [visible, setVisible] = useState(false);
    const [startSwap, setStartSwap] = useState(true);
    const isSwapUrl = window.location.pathname.includes('swap');
    const networkcostRef = useRef()
    const [selectedOption, setSelectedOption] = useState(options[1]);
    const [networkShimmer, setNetworkShimmer] = useState(true)
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [counter, setCounter] = useState(0);
    const [longitude, setLongitude] = useState("")
    const [latitude, setLatitude] = useState("")
    const [locationData, setLocationData] = useState(null)
    let fromCurrencyPriceRef = useRef()
    const [fromCurrencyPrice, setFromCurrencyPrice] = useState(true);
    const [activeItem, setActiveItem] = useState("Market"); // Default active item is "Market"
    const [activeItemExpire, setActiveItemExpire] = useState("1 week"); // Default active item is "1 week"
    const [limitExpiry, setLimitExpiry] = useState();
    const [formattedExpiry, setFormattedExpiry] = useState();
    const [inputValue, setInputValue] = useState(); // State to keep track of the input value
    const [adjustedPrice, setAdjustedPrice] = useState(fromCurrencyPriceRef?.current); // State to keep track of the adjusted price
    const limitStatusRef = useRef(false)
    const [openLimitorderList, setOpenLimitorderList] = useState()
    const openLimitorderRef = useRef()
    const [marketPrice, setMarketprice] = useState("")
    const defaultTokenData2 = {
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "symbol": "USDC",
        "decimals": 6,
        "name": "USD Coin",
        "logoURI": "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
        "eip2612": false,
        "tags": [
            "tokens",
            "PEG:USD"
        ]
    };

    const handleExpireItemClick = (item) => {
        setActiveItemExpire(item);
        updateLimitExpiry(item);
    };

    useEffect(() => {
        if (globalStates.globalKey === "limit") {
            GetOpenLimitData()
        }
    }, [key, isJuicedPath, globalStates.showOpenLimitCount, localStorage.getItem("Token"), globalStates.isChangemetamaskWallet, globalStates.showtoken, globalStates?.managenotification])
    /* get open limit order list */
    async function GetOpenLimitData() {
        try {
            const response = await pineappleDexService.getOpenLimitOrder();
            if (response?.status === 200) {
                setOpenLimitorderList(response?.data?.data)
                openLimitorderRef.current = response?.data?.data
            }
        } catch (error) {
            console.log("error", error)
        } finally {
            // setLoading(false);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            globalStates.setManageAimation(false)
        }, 2500)
    }, [globalStates?.manageAnimation])


    useEffect(() => {
        updateLimitExpiry(activeItemExpire);
    }, [activeItemExpire])

    const updateLimitExpiry = (expiryPeriod) => {
        let expiryDateInSeconds;
        const now = moment();

        switch (expiryPeriod) {
            // case "5 minutes":
            //     expiryDateInSeconds = moment().add(5, 'minutes').diff(now, 'seconds');
            //     break;
            case "1 day":
                expiryDateInSeconds = moment().add(1, 'days').diff(now, 'seconds');
                break;
            case "1 week":
                expiryDateInSeconds = moment().add(1, 'weeks').diff(now, 'seconds');
                break;
            case "1 month":
                expiryDateInSeconds = moment().add(1, 'months').diff(now, 'seconds');
                break;
            case "1 year":
                expiryDateInSeconds = moment().add(1, 'years').diff(now, 'seconds');
                break;
            default:
                expiryDateInSeconds = moment().add(1, 'weeks').diff(now, 'seconds');
        }
        setLimitExpiry(expiryDateInSeconds);
        const formattedExpiry = moment().add(expiryDateInSeconds, 'seconds').format('MMMM D, YYYY [at] h:mm a');
        setFormattedExpiry(formattedExpiry);
    };



    const [selectedToken3, setSelectedToken3] = useState(globalStates.globalKey == "limit" ? selectedToken1 : {})
    const [selectedToken4, setSelectedToken4] = useState(globalStates.globalKey == "limit" ? selectedToken2 : {})
    const [showLimitSteps, setShowLimtSteps] = useState(false);
    const [showLimitFollowSteps, setShowLimitFollowSteps] = useState(false);
    const [approveLimit, setApproveLimit] = useState("initiated")
    const [limitSwap, setLimitSwap] = useState("initiated")

    useEffect(() => {
        if (globalStates.globalKey == "limit") {
            setSelectedToken3(selectedToken1)
            setSelectedToken4(selectedToken2)
        }
        else {
            setSelectedToken3({})
            setSelectedToken4({})
        }
    }, [globalStates.globalKey, isJuicedPath])

    const handleCloseFollowLimitSteps = () => {
        setShowLimitFollowSteps(false);
    }
    const handleCloseLimitSteps = () => {
        setShowLimtSteps(false);
    }



    const handleItemClick = async (item) => {
        if (item == "Market" && globalStates.globalKey == "limit") {
            setInputValue(marketPrice)
        }
        if (activeItem === item) return;

        setActiveItem(item);
        if (item == "Market" && globalStates.globalKey == "limit" && limitStatusRef.current == true) {
            limitStatusRef.current = false
            let updatedvalue = await getQuotationListForcalcuationAmount()
            updatePrice(item);
            return;
        }
        if (item == "+10%" || item == "+5%" || item == "1%") {
            limitStatusRef.current = true
            let updatedvalue = await getQuotationListForcalcuationAmount()
            updatePrice(item);
        }
        else {
            limitStatusRef.current = false
            updatePrice(item);
        }
    };

    const calculateValue = () => {
        if (limitStatusRef.current === true) {
            return "Market";
        }
        if (limitStatusRef.current === false) {
            const tokenPercent = Math.round(((parseFloat(inputValue) - parseFloat(marketPrice)) / parseFloat(marketPrice)) * 100);
            if (tokenPercent === 0 || isNaN(tokenPercent)) {
                return "Market";
            } else if (tokenPercent > 0) {
                return `+${tokenPercent}%`;
            } else {
                return `${tokenPercent}%`;
            }
        }
    };


    const updatePrice = (item) => {
        let basePrice = parseFloat(marketPrice);
        let newPrice;
        switch (item) {
            case "1%":
                newPrice = basePrice * 1.01;
                break;
            case "+5%":
                newPrice = basePrice * 1.05;
                break;
            case "+10%":
                newPrice = basePrice * 1.10;
                break;
            default:
                newPrice = basePrice;
                break;
        }
        setInputValue(newPrice.toFixed(6));
    };

    useEffect(() => {
        if (key == "limit" && inputValue) {
            setSelectedToken2({ ...selectedToken2, amount: Number(inputValue) * Number(selectedToken1?.amount) })
        }
    }, [inputValue, selectedToken3?.address, selectedToken4?.address, selectedToken2?.address, selectedToken1?.address, selectedToken1?.symbol, selectedToken2?.symbol, selectedToken1?.amount])

    /* manage with decimal */
    const handleInputChange = (e) => {
        let value = e.target.value;
        setInputValue(value);
        setActiveItem("Market");
        if (key === "limit") {
            setSelectedToken2({ ...selectedToken2, amount: Number(value) * Number(selectedToken1?.amount) })
        }
        let basePrice = parseFloat(fromCurrencyPriceRef?.current || 0);
        if (!isNaN(value) && value !== "") {
            const customPrice = parseFloat(value);
            setAdjustedPrice((customPrice - basePrice).toFixed(8));
        } else {
            setAdjustedPrice(basePrice.toFixed(8));
        }
    };



    /* handle ApproveToken for limit order */
    const handleApproveLimit = () => {
        approveToken("LIMIT_APPROVED");
    };

    /* Check allowance and approve token with Web3 */
    const approveToken = async (transactionType) => {
        if (!web3 || !walletAddress) {
            console.error('Web3 or account not found');
            return;
        }
        const tokenContract = new web3.eth.Contract(Abi_ERC20, selectedToken1?.address);
        const spenderAddress = CONTRACT_ADDRESS;
        const requiredAllowance = "1000000000000000000000000000000000000000000000000000000000000000";
        try {
            // Check the current allowance
            const currentAllowance = await tokenContract.methods.allowance(walletAddress, CONTRACT_ADDRESS).call();
            const amountInWei = Number(selectedToken1?.amount) * Math.pow(10, selectedToken1?.decimals);
            console.log('Current allowance:', Number(currentAllowance), amountInWei, amountInWei <= Number(currentAllowance));

            if (amountInWei <= Number(currentAllowance)) {
                setShowLimitFollowSteps(true);
                setApproveLimit("complete");
                setLimitSwap("pending");
                LimitSwapApi();
                console.log('Sufficient allowance already granted');
            } else {
                // Approve if the current allowance is less than the required allowance
                if (transactionType == "LIMIT_APPROVED") {
                    setShowLimitFollowSteps(true);
                    setApproveLimit("pending");
                    const receipt = await tokenContract.methods.approve(CONTRACT_ADDRESS, requiredAllowance).send({ from: walletAddress });
                    console.log('Transaction receipt:', receipt);
                    let gasFeeInWei;
                    switch (selectedOption.value) {
                        case '30s':
                            gasFeeInWei = parseInt(sleepage?.gasPrice?.instant) || 30000;
                            break;
                        case '1m':
                            gasFeeInWei = parseInt(sleepage?.gasPrice?.fast) || 30000;
                            break;
                        case '10m':
                            gasFeeInWei = parseInt(sleepage?.gasPrice?.standard) || 30000;
                            break;
                        default:
                            gasFeeInWei = 30000;
                    }
                    console.log("---------- gasFeeInWei ----------", gasFeeInWei)
                    const gasUsed = parseInt(receipt.gasUsed);
                    console.log("---------- gasUsed ----------", gasUsed);
                    const totalGasFeeInWei = gasFeeInWei * gasUsed;
                    const totalGasFeeInEth = parseInt(totalGasFeeInWei) / 1e18;
                    console.log()
                    let receiptData = {
                        fromToken: selectedToken1?._id,
                        toToken: selectedToken2?._id,
                        transactionHash: receipt.transactionHash,
                        blockNumber: Number(receipt.blockNumber),
                        fromAmount: selectedToken1?.amount,
                        toAmount: selectedToken2.amount,
                        sleepage: sleepage.sleepage,
                        time: new Date(),
                        transactionFee: totalGasFeeInEth,
                        fromTokenPriceUSD: Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5),
                        toTokenPriceUSD: Number(selectedToken2?.amount * selectedToken2?.priceUSD).toFixed(5),
                        transactionType: transactionType,
                        transactionStatus: "COMPLETE"

                    }
                    saveSwapDetails(receiptData)
                }
                setApproveLimit("complete");
                setLimitSwap("pending");
                LimitSwapApi();
            }
        } catch (error) {
            console.error('Error checking allowance or approving tokens:', error);
            setShowLimitFollowSteps(false);
            setShowLimtSteps(false);
            setApproveLimit("initiated");
            setLimitSwap("initiated");
            const errorData = {
                error: error.message,
                transactionType: "LIMIT_APPROVED",
                time: new Date()
            };
            setShowLimitFollowSteps(false);
            setErrorData(errorData)
            setShowError(true);
        }
    };




    const LimitSwapApi = async () => {
        if (!selectedToken1?.address || !selectedToken2.address || !selectedToken1?.amount || !walletAddress || !selectedToken2?.amount || !limitExpiry) {
            return;
        }
        // const amountInWei = parseFloat(selectedToken1?.amount) * Math.pow(10, selectedToken1?.decimals);
        // const amountInWei2 = parseInt(selectedToken2?.amount) * Math.pow(10, selectedToken2?.decimals);
        const amountInWei = Math.round(parseFloat(selectedToken1?.amount) * Math.pow(10, selectedToken1?.decimals));
        const amountInWei2 = Math.round(parseFloat(selectedToken2?.amount) * Math.pow(10, selectedToken2?.decimals));
        const params = {
            walletAddress: walletAddress,
            fromToken: selectedToken1?.address,
            toToken: selectedToken2?.address,
            makerAmountInWei: numberToLocaleString(amountInWei),
            takerAmountInWei: numberToLocaleString(amountInWei2),
            expirationTimeinSec: limitExpiry,
        };
        try {
            const response = await pineappleDexService.createLimitOrderData(params);
            if (response?.status === 200) {
                const limtSwapData = response?.data?.data;
                const signature = await window.ethereum.request({
                    method: 'eth_signTypedData_v4',
                    params: [walletAddress, limtSwapData.message],
                });
                console.log("signature", signature);
                let inputDateTime = moment(formattedExpiry, "MMMM D, YYYY at h:mm a");
                // const inputDateTime = moment(moment().add(120, 'seconds').format('MMMM D, YYYY [at] h:mm a'), "MMMM D, YYYY at h:mm a");
                const saveSwapParams = {
                    limitOrderSignature: signature,
                    fromTokenPriceUSD: selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : "",
                    toTokenPriceUSD: Number(selectedToken2?.amount * selectedToken2?.priceUSD).toFixed(5),
                    expireDateTime: inputDateTime.toISOString(),
                    networkCost: networkcostRef.current,
                    marketPrice: marketPrice,
                }
                const response1 = await pineappleDexService.saveLimitOrder(saveSwapParams);
                globalStates.setShowOpenLimitCount(!globalStates.showOpenLimitCount)
                handleShowSuccess();
                setLimitSwap("complete");
                setApproveLimit("complete");
                setShowLimitFollowSteps(false);
                setShowMax(false);
                setShowLimtSteps(false);
                let SwapGas = response?.data?.data?.tx?.gas
                calculateNetworkCost(SwapGas)
            }
        } catch (error) {
            console.log("error >>>>>>>>", error)
            let errorMessage;
            if (
                error?.message === "MetaMask Tx Signature: User denied transaction signature"
            ) {
                errorMessage = "MetaMask Tx Signature: User denied transaction signature";
            }
            else if (error?.message === "User rejected the request.") {
                errorMessage = "User rejected the request.";

            } else {
                errorMessage = error.response?.data?.message || error.message;
            }

            setShowLimtSteps(false);
            const errorData = {
                error: errorMessage,
                // error: error.response?.data?.message == "Request failed with status code 400" ? " MetaMask Tx Signature: User denied transaction signature" : error.response?.data?.message,
                transactionType: "LIMIT_SWAP",
                time: new Date()
            };
            setShowLimitFollowSteps(false);
            setErrorData(errorData)
            setShowError(true);
            setApproveLimit("initiated");
            setLimitSwap("initiated");
            setShowMax(false);
            // setStartSwap(true)
            // calculateNetworkCost(21000);
        }
    };



    useEffect(() => {
        makeAPICall()
        if (key === "limit" && localStorage.getItem("Token")) {
            GetOpenLimitData()
        }
    }, [key])

    function makeAPICall() {
        let userCountry = '';
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                fetch(`https://ipapi.co/${data?.ip}/json`)
                    .then(response => response.json())
                    .then(data => {
                        setLocationData(data)
                        setLatitude(data?.latitude)
                        setLongitude(data.longitude)
                    })
            })
            .catch(error => {
            });
    }

    const tooltip = (
        <Tooltip id="tooltip">
            PROOF is a web3 startup incubator. Tokens launched with PROOF are vetted, KYC'd and audited.
        </Tooltip>
    );

    const tooltipJuiced = (
        <Tooltip id="tooltip">
            The Pineapple Score and related data/analytics provided within Slice Insights are sourced from the Dextools API. This score evaluates coins based on trust and other metrics. Dextools retains all rights to the original data and metrics used in calculating the Pineapple Score.
        </Tooltip>
    );

    const tooltipAudit = (
        <Tooltip id="tooltip">
            These audit results are automatic and carried out by entities external to DEXTools, DEXTools does not verify nor is responsible for the quality of the data obtained through these external auditors, always check before purchasing any token.
        </Tooltip>
    );

    const tooltipContract = (
        <Tooltip id="tooltip">
            Renouncing a smart contract means that the contract's creator will no longer have control over it, so no one can mint new tokens, rise taxes, blacklist wallets or other dangerous contract functions for investors and holders.
        </Tooltip>
    );

    const tooltipVerified = (
        <Tooltip id="tooltip">
            Whether the source code of the smart contract is accessible and has been reviewed.
        </Tooltip>
    );

    const tooltipHoneypot = (
        <Tooltip id="tooltip">
            Whether the token is a honeypot, which means that the token maybe cannot be sold because of the token contract's function, Or the token contains malicious code.
        </Tooltip>
    );

    const tooltipBuytax = (
        <Tooltip id="tooltip">
            Tax when buying the token.
        </Tooltip>
    );

    const tooltipSelltax = (
        <Tooltip id="tooltip">
            Tax when selling the token.
        </Tooltip>
    );


    const renderTooltip = (message) => (
        <Tooltip id="tooltip">
            {message}
        </Tooltip>
    );

    useEffect(() => {
        if (location.pathname == "/swap") {
            setKey("swap");
            handleToggleSwap();
        }
    }, [location.pathname])

    useEffect(() => {
        // console.log("getChainId in useEffect-------->")
        const getChainId = async () => {
            // console.log(" inside getChainId in useEffect-------->")
            if (window.ethereum.isMetaMask) {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const web3Instance = new Web3(window.ethereum);
                    // setWeb3(web3Instance);
                    const accounts = await web3Instance.eth.getAccounts();
                    const currentChainId = await web3Instance.eth.getChainId();
                    setChainId(Number(currentChainId));
                } catch (error) {
                    console.error('Error fetching chainId:', error);
                }
            } else {
                console.log('Ethereum provider not found');
            }
        };

        // getChainId();

        if (window.ethereum) {
            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, [walletAddress, selectedOption?.amount]);

    const handleChainChanged = (chainId) => {
        chainId = parseInt(chainId, 16);
        if (chainId === 1) {
            setChainId(chainId);
        } else {
            swal({
                icon: 'warning',
                text: "Please select Ethereum as our website is compatible only with this blockchain for now.",
                button: "OK"
            }).then(() => {
                switchNetwork(1);
            });
        }
    };


    const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
            if (walletAddress && walletAddress.toLowerCase() !== accounts[0].toLowerCase()) {
                swal({
                    icon: 'warning',
                    text: "Switching to a different wallet in MetaMask will disconnect your current session.",
                    buttons: ["Disconnect", "Ok"],
                    closeOnClickOutside: false
                }).then((res) => {
                    if (res) {
                        connectWallet();
                    } else {
                        localStorage.clear();
                    }
                });
            } else {
            }
        } else {
        }
    };

    const switchNetwork = async (chainId) => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(chainId) }],
            });
            setChainId(chainId);
        } catch (switchError) {
            console.error('Error switching chain', switchError);
            setChainId(null); // Ensure price is not shown if switch request is canceled
        }
    };

    /* close limti step modal */



    const handleCloseSteps = () => {
        setShowSteps(false);
        setApproveSwaModal("initiated")
        setManageApproveData("pending")
        setSwaModal("pending")
        setIsLoader(false)
        setCounter(0)
    }
    const handleCloseJuiced = () => {
        setKey("swap")
        globalStates.setGlobalKey("swap")
        setShowJuiced(false);
    }
    
    // console.log("key", key)  
    const handleShowJuiced = () => {
        console.log("click handleShowJuiced ", key)
        if (key == "slice_insights") {
            console.log("k0ey slice_insights in first loop", key)
            navigate("/juiced");
            if (!isJuicedPath) {
                console.log("k0ey slice_insights in second loop", key)
                setShowSliceInsights(true)
                localStorage.setItem("showSliceInsights", "true")
                globalStates.setShowSliceInsights(true)
                setShowJuiced(false)
                localStorage.setItem("theme", "dark")
                document.body.className = "theme-dark"
                if (selectedToken2?.symbol && selectedToken2?.address) {
                    dextScoreData();
                    setTimeout(() => {
                        getpoolData();
                    }, 1500);

                    setTimeout(() => {
                        LiQuidityData();
                    }, 3000);

                    setTimeout(() => {
                        getSliceInfo();
                    }, 5000);
                }
            }
        }
        if (key == "limit") {
            setKey("limit")
            globalStates.setGlobalKey("limit")
            console.log("k0ey limit ", key)
            if (!isJuicedPath) {
                console.log("k0ey limit in isJuicedPath loop", key)
                setShowJuiced(false)
                navigate("/juiced")
                localStorage.setItem("theme", "dark")
                document.body.className = "theme-dark"
            }
        }
    };
    useEffect(() => {
        let interval;
        if (swaModal == "initiated" && manageApproveData == "complete" && approveSwaModal == "complete") {
            setCounter(0);
            interval = setInterval(() => {
                setCounter(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [swaModal, manageApproveData, approveSwaModal]);
    const formattedTime = moment.utc(counter * 1000).format('mm:ss');



    useEffect(() => {
        localStorage.setItem("theme", "light");
    }, [])
    const handleDropdownChange = (type) => {
        setSlippageType(type);
        if (type === 'Auto') {
            setSelectedToken1({ ...selectedToken1, userSlippage: '0.5' });
        }
    };
    // const defaultTokenData = {
    //     "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    //     "symbol": "ETH",
    //     "decimals": 18,
    //     "name": "Ether",
    //     "logoURI": "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
    //     "eip2612": false,
    //     "tags": [
    //         "native",
    //         "PEG:ETH"
    //     ]
    // };

    const defaultTokenData = {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "symbol": "WETH",
        "decimals": 18,
        "name": "Wrapped Ether",
        "logoURI": "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
        "eip2612": false,
        "tags": ['PEG:ETH', 'tokens']
    };

    useEffect(() => {
        getTokenList();
        // getTopTokenList();
        getSleepageData();
        if (localStorage.getItem("Token")) {
            userInfo()
        }
    }, [globalStates.importNewToken]);
    async function getTokenList() {
        try {
            const response = await pineappleDexService.tokenList();
            if (response?.status === 200) {
                const tokensObject = response?.data?.tokens;
                console.log("tokensObject",tokensObject);
                
                setTokenList(tokensObject)
                const EthMatchToken = tokensObject.filter(token => token.symbol.toLowerCase() === "eth");
                getTopTokenList(EthMatchToken);

            }
        } catch (error) {
            console.log("error", error)
        }
    }

    async function getTopTokenList(ethTokenDetails) {
        try {
            const response = await pineappleDexService.ToptokenList();
            if (response?.status === 200) {
                const tokensObject = response?.data?.data;
                // ethTokenDetails = ethTokenDetails[0]
                // const ethTokenData={count:0,_id:ethTokenDetails._id,tokenDetails:ethTokenDetails};
                // tokensObject.unshift(ethTokenData);

                const topSymbols = ["ETH"]; // Tokens you want to set as top

                const reorderedTokens = tokensObject.sort((a, b) => {
                    if (topSymbols.includes(a.tokenDetails.symbol)) {
                        return -1; // Move "ETH" or "USDC" to the top
                    } else if (topSymbols.includes(b.tokenDetails.symbol)) {
                        return 1;
                    }
                    return 0;
                });
                setTopTokenList(reorderedTokens);
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    /* get User Sleepage */
    async function userInfo() {
        try {
            const response = await pineappleDexService.getUserInfo();
            if (response?.status === 200) {
                let responsedata = response?.data?.data;
            }
        } catch (error) {
            console.log("error", error)
            setNetworkShimmer(false)
            setShowShimmer(false)
            // errorSwal(error)
            if (error?.response?.status === 401) {
                swal({ icon: 'error', text: error?.response?.data, button: "OK" }).then(() => {
                    localStorage.clear();
                    window.location.href = "/swap"

                });
            } else {
                swal({ icon: 'error', text: error?.response?.data ? error?.response?.data : error?.message, button: "OK" }).then(() => {
                });
            }
        }
    }
    // useEffect( async() => {
    //     if (startSwap && selectedToken1?.address && selectedToken2?.address && key !== "limit") {
    //         if (selectedToken1?.amount && key !== "limit") {
    //           await  getQuotationList()
    //             getSleepageData()
    //             setTimeout(() => {
    //                 getQuotationListForcalcuationAmount()
    //             },2000)
    //            await getApproveAllowance()
    //         }

    //     }
    //     if (!selectedToken1?.amount && key !== "limit") {
    //         setSelectedToken2({ ...selectedToken2, amount: "" })
    //         setShowMax(false)
    //     }
    // }, [selectedToken1?.address, selectedToken2?.address, selectedToken1?.amount, selectedToken3?.address, selectedToken4?.address, isSwap]);


    useEffect(() => {
        const fetchData = async () => {
            if (startSwap && selectedToken1?.address && selectedToken2?.address && key !== 'limit') {
                if (selectedToken1?.amount && selectedToken1?.amount > 0 && key !== 'limit') {
                    try {
                        await getQuotationList();
                        getSleepageData();
                        setTimeout(async () => {
                            await getQuotationListForcalcuationAmount();
                        }, 2000);
                        await getApproveAllowance();
                    } catch (error) {
                        console.error('Error occurred while fetching data:', error);
                    }
                }
            }

            if (!selectedToken1?.amount && key !== 'limit') {
                setSelectedToken2(prev => ({ ...prev, amount: '' }));
                setShowMax(false);
            }
        };

        fetchData();
    }, [selectedToken1?.address, selectedToken2?.address, selectedToken1?.amount, selectedToken3?.address, selectedToken4?.address, isSwap]);

    useEffect(() => {
        if (selectedToken1?.amount && key == "limit" && limitStatusRef.current == true) {
            getQuotationListForcalcuationAmount()
        }
        // console.log("outside the condition to clear the both state")
        if (!selectedToken1?.amount) {
            // console.log("inside the condition to clear the both state")
            setSelectedToken1({ ...selectedToken1, amount: "" })
            setSelectedToken2({ ...selectedToken2, amount: "" })
        }
    }, [selectedToken1?.amount, selectedToken2?.symbol, selectedToken3?.symbol, selectedToken4])

    /* get network cost with swap */
    const getSwaptokenApiByNetworkCost = async () => {
        if (!selectedToken1?.address || !selectedToken2.address || !selectedToken1?.amount || !walletAddress || !sleepage?.userSlippage) {
            return;
        }
        setStartSwap(false)
        const amountInWei = parseFloat(selectedToken1?.amount) * Math.pow(10, selectedToken1?.decimals);
        const params = {
            src: selectedToken1?.address,
            dst: selectedToken2?.address,
            amount: numberToLocaleString(amountInWei),
            from: walletAddress,
            origin: walletAddress,
            slippage: sleepage?.userSlippage,
            includeGas: true
        };
        try {
            const response = await pineappleDexService.swapToken(params);
            if (response?.status === 200) {
                let SwapGas = response?.data?.data?.tx?.gas
                calculateNetworkCost(SwapGas)
            }
        } catch (error) {
            console.log("error", error)
            setStartSwap(true)
            calculateNetworkCost(21000);
        }
    };

    function calculateNetworkCost(SwapGas) {
        let gasPrice;
        switch (selectedOption.value) {
            case '30s':
                gasPrice = sleepage?.gasPrice?.instant;
                break;
            case '1m':
                gasPrice = sleepage?.gasPrice?.fast;
                break;
            case '10m':
                gasPrice = sleepage?.gasPrice?.standard;
                break;
            default:
                gasPrice = 30000;
        }
        const web3Instance = new Web3(window.ethereum);
        if (gasPrice && SwapGas) {
            let swapGasPriceinWei = Number(SwapGas) * Number(gasPrice).toFixed(0);
            let swapgasPriceinEth = web3Instance.utils.fromWei(swapGasPriceinWei.toString(), 'ether');
            let networkcostPrice = oneETHPriceInUSD * swapgasPriceinEth
            networkcostRef.current = networkcostPrice;
        }
    }

    /* get Quotes list */
    const getQuotationList = async (amount) => {
        if (!selectedToken1?.address || !selectedToken2.address) {
            return;
        }
        console.log("amount:::", selectedToken1)
        const amountInWei = parseFloat(Number(selectedToken1?.amount)) * Math.pow(10, selectedToken1?.decimals);
        let gasPrice;
        switch (selectedOption.value) {
            case '30s':
                gasPrice = sleepage?.gasPrice?.instant || 30000;
                break;
            case '1m':
                gasPrice = sleepage?.gasPrice?.fast || 30000;
                break;
            case '10m':
                gasPrice = sleepage?.gasPrice?.standard || 30000;
                break;
            default:
                gasPrice = 30000;
        }
        console.log("amountInWei::::", amountInWei)
        const params = {
            src: selectedToken1?.address,
            dst: selectedToken2.address,
            amount: numberToLocaleString(amountInWei),
            gasPrice: gasPrice,
            includeGas: "true",
            includeProtocols: true,
        };
        setIsSwap(true)
        try {
            const response = await pineappleDexService.QuotesList(params);
            if (response?.status === 200) {
                const quotes = response?.data?.dstAmount;
                const gasAmount = response?.data?.gas;
                const gasCostInETH = gasAmount * gasPrice / Math.pow(10, 18);
                const gasCostInUSD = gasCostInETH * selectedToken1?.priceUSD;
                const amountInETH = parseFloat(quotes) / Math.pow(10, selectedToken2.decimals);
                setSelectedToken2((prev) => ({ ...prev, amount: amountInETH, price: Number(selectedToken2?.priceUSD) * Number(amountInETH) }))
            }
        } catch (error) {
            console.log("error", error)

        }
    };

    useEffect(() => {
        if (globalStates.globalKey == "limit" && selectedToken2?.symbol && selectedToken1?.symbol && selectedToken3?.symbol && selectedToken4?.symbol) {
            getQuotationListForcalcuationAmount()
        }
    }, [selectedToken1?.symbol, selectedToken2?.symbol, selectedToken3?.symbol, selectedToken4?.symbol])



    const getQuotationListForcalcuationAmount = async (amount) => {
        if (!selectedToken1?.address || !selectedToken2.address) {
            return;
        }
        let amountInWei;
        if (key == "limit") {
            amountInWei = parseFloat(10000) * Math.pow(10, selectedToken1?.decimals);
        }
        else {
            amountInWei = parseFloat(10000) * Math.pow(10, selectedToken1?.decimals);
        }

        let gasPrice;
        switch (selectedOption.value) {
            case '30s':
                gasPrice = sleepage?.gasPrice?.instant || 30000;
                break;
            case '1m':
                gasPrice = sleepage?.gasPrice?.fast || 30000;
                break;
            case '10m':
                gasPrice = sleepage?.gasPrice?.standard || 30000;
                break;
            default:
                gasPrice = 30000;
        }
        const params = {
            amount: numberToLocaleString(amountInWei),
            gasPrice: gasPrice,
            includeGas: "true",
            includeProtocols: true,
        };
        // Add or modify properties based on the key
        if (key !== "limit") {
            console.log("key in if", key)
            params.src = selectedToken1?.address;
            params.dst = selectedToken2?.address;
        } else {
            // console.log("key in else", key)
            params.src = selectedToken3?.address;
            params.dst = selectedToken4?.address;
        }
        setIsSwap(true)
        try {
            const response = await pineappleDexService.QuotesList(params);
            if (response?.status === 200) {
                const quotes = response?.data?.dstAmount;
                const gasAmount = response?.data?.gas;
                console.log("gasAmount", gasAmount)
                const gasCostInETH = gasAmount * gasPrice / Math.pow(10, 18);
                const gasCostInUSD = gasCostInETH * selectedToken1?.priceUSD;
                console.log("gasCostInUSD", gasCostInUSD)
                networkcostRef.current = gasCostInUSD;
                const amountInETH = parseFloat(quotes) / Math.pow(10, selectedToken2.decimals);
                const adjustedAmountInETH = (amountInETH / 10000);
                fromCurrencyPriceRef.current = adjustedAmountInETH;
                if (key == "limit") {
                    setAdjustedPrice(adjustedAmountInETH)
                    setMarketprice(adjustedAmountInETH)
                    setInputValue(adjustedAmountInETH)
                }
                setFromCurrencyPrice(false)
            }
        } catch (error) {
            // setTimeout(() => {
            //     getQuotationListForcalcuationAmount(amount)    
            // },2000)
            console.log("error", error)
        }
    };


    function clearState(setSelected) {
        if (setSelected == 1) {
            setSelectedToken1({})
        } else {
            setSelectedToken2({})
        }
    }

    const handleAmountChange = (e) => {
        setShowMax(false)
        setIsSwap(false)
        const amount = (e.target.value)
        setSelectedToken1((prev) => ({ ...prev, amount: amount, price: Number(selectedToken1?.priceUSD) * Number(amount) }))
        if (key == "limit") {
            setSelectedToken2((prev) => ({ ...prev, amount: Number(amount) * Number(inputValue) }));
            return;
        }
        else {
            setSelectedToken2((prev) => ({ ...prev, amount: 0 }));
        }
        if (typingamountTimeout) {
            clearTimeout(typingamountTimeout);
        }
        setTypingAmountTimeout(setTimeout(() => {
            if (amount) {
                hitQuatationAPI(amount);
            }
        }, 1000));
    };

    function hitQuatationAPI(amount) {
    }
    /* update sleepage */
    const editSleepage = async (value, type) => {
        if (!sleepage) {
            return;
        }
        const params = {
            [type]: value,
            ip: locationData?.ip ? locationData?.ip : "",
        };
        try {
            const response = await pineappleDexService.updateSleepage(params);
            if (response?.status === 200) {
                getSleepageData()
                getSwaptokenApiByNetworkCost()
            }
        } catch (error) {
            console.log("error", error)
            setNetworkShimmer(false)
            setShowShimmer(false)
        }
    };

    const getTokenBalance = async (tokenAddress, userAddress) => {
        if (defaultTokenData?.address.toLowerCase() == tokenAddress.toLowerCase()) {
            const balance = await web3.eth.getBalance(userAddress)
            const decimals = 18;
            return Number(balance) / Math.pow(10, Number(decimals));
        }
        else {
            const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);
            const balance = await tokenContract.methods.balanceOf(userAddress).call();
            const decimals = await tokenContract.methods.decimals().call();
            return Number(balance) / Math.pow(10, Number(decimals));
        }
    };

    async function updateTokenBalance(selectedToken, setSelectedToken) {
        if (selectedToken?.address && web3 && walletAddress) {
            const balance = await getTokenBalance(selectedToken.address, walletAddress);
            const totalTokenPrice = balance * Number(selectedToken?.priceUSD);
            setSelectedToken((prev) => ({ ...prev, balance, totalTokenPrice }))
        }
    }
    useEffect(() => {
        updateTokenBalance(selectedToken2, setSelectedToken2);
    }, [selectedToken2?.address, walletAddress, web3]);

    useEffect(() => {
        updateTokenBalance(selectedToken1, setSelectedToken1);
    }, [selectedToken1?.address, walletAddress, web3]);

    const [oneETHPriceInUSD, setOneETHPriceInUSD] = useState(0)

    /* get dollor price */
    async function dollorList() {
        const tokens = selectedToken1?.address && selectedToken2?.address ? `${selectedToken1?.address},${selectedToken2?.address},${defaultTokenData?.address}` : selectedToken1?.address;
        try {
            const response = await pineappleDexService.priceExchange(tokens);
            if (response?.status === 200) {
                // console.log("priceExchange----------->", response.data)
                const tokensPriceInUDC = response.data.data;
                const token1 = selectedToken1?.address?.toLowerCase(), token2 = selectedToken2?.address?.toLowerCase(), ETHTokenAddress = defaultTokenData.address.toLowerCase()
                if (tokensPriceInUDC && tokensPriceInUDC[token1]) {
                    setSelectedToken1((prev) => ({ ...prev, priceUSD: tokensPriceInUDC[token1] }))
                }
                if (tokensPriceInUDC && tokensPriceInUDC[token2]) {
                    setSelectedToken2((prev) => ({ ...prev, priceUSD: tokensPriceInUDC[token2] }))
                }
                if (tokensPriceInUDC && tokensPriceInUDC[ETHTokenAddress]) {
                    setOneETHPriceInUSD(tokensPriceInUDC[ETHTokenAddress]);
                }

            }
        } catch (error) {
            console.log("error", error)
        }
    }
    useEffect(() => {
        if (selectedToken1?.address) {
            dollorList();
        }
    }, [walletAddress, selectedToken1?.address, selectedToken2?.address]);

    const [showSuccess, setShowSuccess] = useState(false);
    const handleCloseSuccess = () => {
        setShowSuccess(false);
        if (key != "limit") {
            setSelectedToken1(defaultTokenData)
            setSelectedToken2({})
        }
        else {
            setSelectedToken2({ ...selectedToken2, amount: 0 })
            setSelectedToken1({ ...selectedToken1, amount: 0 })
            setApproveLimit("initiated");
            setLimitSwap("initiated");
            // setInputValue()
        }

    }
    const handleShowSuccess = () => setShowSuccess(true);
    const [isLoader, setIsLoader] = useState(false)

    const handleBlur = () => {
    };
    /* get Approved Token */
    const handleApprovedToken = async () => {
        checkNetwork()
        await getApproveAllowance();
        setIsLoader(true)
        userInfo()
        const amount = selectedToken1?.amount;
        if (allowanceRef.current >= amount) {
            console.log("---------- Allowance is greater then 0 ----------")
            setShowSteps(true)
            setApproveSwaModal("complete")
            setManageApproveData("complete")
            setSwaModal("initiated")
            getSwaptokenApi();
        } else {
            console.log("---------- Allowance is less then 0 ----------")
            setShowSteps(true)
            // setApproveSwaModal("complete")
            // setManageApproveData("initiated")
            getApprovedToken();
        }
    };

    const getApprovedToken = async () => {
        console.log("---------- inside getApprovedToken ----------")
        if (!selectedToken1?.address || !selectedToken1?.amount) {
            return;
        }
        setStartSwap(false)
        const amountInWei = parseFloat(selectedToken1?.amount) * Math.pow(10, selectedToken1?.decimals);
        const params = {
            tokenAddress: selectedToken1?.address,
        };
        try {
            const response = await pineappleDexService.ApproveToken(params);
            console.log("---------- getApprovedToken response ----------", response.status)
            if (response?.status === 200) {
                setTimeout(async () => {
                    setApproveSwaModal("complete");
                    setManageApproveData("initiated")
                    await sendTransaction(response.data.data, "APPROVE");
                }, 1000)
            }
        } catch (error) {
            console.log("error", error)
            setStartSwap(true)
        }
    };

    function errorSwal(error) {
        console.log("error", error);
        if (error?.response?.status === 401) {
            swal({ icon: 'error', text: error?.response?.data?.message, button: "OK" }).then(() => {
                localStorage.clear();
                window.location.href = "/swap"

            });
        } else {
            swal({ icon: 'error', text: error?.response?.data?.message ? error?.response?.data?.message : error?.message, button: "OK" }).then(() => {
            });
        }
    }
    /* send Transaction to metamask */
    async function sendTransaction(dataObj, transactionType) {
        console.log("---------- sendTransaction transaction type ---------", transactionType)
        console.log("---------- dataObj dataObj ---------", dataObj)
        if (transactionType == "LIMIT_SWAP") {
            let data = dataObj?.version + dataObj?.header + dataObj?.body;
            console.log("---------- sendTransaction data ----------", data)
            const web3 = new Web3(window.ethereum)
            const tx = {
                from: walletAddress,
                to: CONTRACT_ADDRESS,
                data: data,
            };
            console.log("---------- sendTransaction tx ----------", tx)
            const receipt = await web3.eth.sendTransaction(tx);
            console.log("---------- sendTransaction receipt ----------", receipt);
        }
        try {
            const web3 = new Web3(window.ethereum)
            const { data, to, gasPrice, gas, value } = dataObj;
            const tx = {
                from: walletAddress,
                to: to,
                value: value,
                gasPrice: gasPrice,
                data: data,
                gas
            };
            console.log("---------- sendTransaction tx ----------", tx)
            let estimateGas = gas;
            console.log("---------- estimateGas ----------", tx)
            if (transactionType == "APPROVE") {
                estimateGas = await web3.eth.estimateGas(tx);
                console.log("----------Apporved estimateGas  ----------", tx)
            }
            tx.gas = Number(estimateGas);
            const receipt = await web3.eth.sendTransaction(tx);
            console.log("---------- sendTransaction receipt ----------", receipt);
            setStartSwap(true)
            console.log('Transaction sent:', receipt);
            if (receipt && transactionType == "APPROVE") {
                console.log("---------- transacetion has been approved ----------", transactionType)
                setApproveSwaModal("complete")
                setManageApproveData("complete")
                setSwaModal("initiated")
                getSwaptokenApi()
            }
            if (receipt && transactionType == "SWAP") {
                let gasFeeInWei;
                switch (selectedOption.value) {
                    case '30s':
                        gasFeeInWei = parseInt(sleepage?.gasPrice?.instant) || 30000;
                        break;
                    case '1m':
                        gasFeeInWei = parseInt(sleepage?.gasPrice?.fast) || 30000;
                        break;
                    case '10m':
                        gasFeeInWei = parseInt(sleepage?.gasPrice?.standard) || 30000;
                        break;
                    default:
                        gasFeeInWei = 30000;
                }
                console.log("---------- gasFeeInWei ----------", gasFeeInWei)
                const gasUsed = parseInt(receipt.gasUsed);
                console.log("---------- gasUsed ----------", gasUsed);
                const totalGasFeeInWei = gasFeeInWei * gasUsed;
                console.log("---------- totalGasFeeInWei ----------", totalGasFeeInWei);
                const totalGasFeeInEth = parseInt(totalGasFeeInWei) / 1e18;
                console.log("---------- totalGasFeeInEth ----------", totalGasFeeInEth);
                console.log("---------- swap has been approved ----------", transactionType)
                let receiptData = {
                    fromToken: selectedToken1?._id,
                    toToken: selectedToken2?._id,
                    transactionHash: receipt.transactionHash,
                    blockNumber: Number(receipt.blockNumber),
                    fromAmount: selectedToken1?.amount,
                    toAmount: selectedToken2.amount,
                    sleepage: sleepage.sleepage,
                    time: new Date(),
                    transactionFee: totalGasFeeInEth,
                    fromTokenPriceUSD: Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5),
                    toTokenPriceUSD: Number(selectedToken2?.amount * selectedToken2?.priceUSD).toFixed(5),
                    transactionType: transactionType,
                    transactionStatus: "COMPLETE"
                }

                console.log("receiptData ::::::::::::::: ", receiptData);
                setTransactionDetails(receiptData)
                setApproveSwaModal("complete")
                setManageApproveData("complete")
                setSwaModal("complete")
                saveSwapDetails(receiptData)
            }
        } catch (error) {
            console.error('---------- Error while signing the transaction ----------', error);
            const errorData = {
                error: error.message,
                transactionType: transactionType,
                time: new Date(),
                transactionStatus: "FAILED"
            };
            console.log("---------- errorData :: ----------", errorData);
            let receiptData = {
                fromToken: selectedToken1?._id,
                toToken: selectedToken2?._id,
                fromAmount: selectedToken1?.amount,
                toAmount: selectedToken2.amount,
                sleepage: sleepage.sleepage,
                time: new Date(),
                transactionType: transactionType,
                fromTokenPriceUSD: Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5),
                toTokenPriceUSD: Number(selectedToken2?.amount * selectedToken2?.priceUSD).toFixed(5),
                transactionType: transactionType,
                transactionStatus: "FAILED"
            }
            console.log("receiptData :: ", receiptData);
            console.log("else is swap swaModal:: ", swaModal, "approveSwaModal:: ", approveSwaModal, "manageApproveData ::", manageApproveData)
            if (transactionType == "APPROVE") {
                console.log("---------- transaction failed for the approve ---------------------------")
                setShowSteps(false)
                setIsLoader(false)
                setApproveSwaModal("initiated")
                setManageApproveData("pending")
                setSwaModal("pending")
                setCounter(0)

                // console.log(" in else part inside the approve swaModal::-  ",swaModal, "approveSwaModal:: ",approveSwaModal, "manageApproveData ::",manageApproveData)
            }
            if (transactionType == "SWAP") {
                console.log("---------- transaction failed for the swap -----------------------------")
                setShowSteps(false)
                setIsLoader(false)
                setApproveSwaModal("complete")
                setManageApproveData("complete")
                setSwaModal("pending")
                setCounter(0)
                // console.log("elsSwwapppp    swaModal:: ",swaModal, "approveSwaModal:: ",approveSwaModal, "manageApproveData ::",manageApproveData)
            }
            setTransactionDetails(receiptData)
            await saveRejectSwapDetails(receiptData)
            setShowSteps(false)
            setErrorData(errorData)
            setShowError(true);
            setStartSwap(true)
            setIsLoader(false)
            setCounter(0)
            console.log("---------- errorData ----------", errorData, showError);
        }
    }
    const handleToggle = () => {
        setShowSliceInsights(true);
        localStorage.setItem("showSliceInsights", "true")
        globalStates.setShowSliceInsights(true)
    };

    const handleToggleSwap = () => {
        setShowSliceInsights(false);
        localStorage.setItem("showSliceInsights", "false")
        globalStates.setShowSliceInsights(false)
    };

    /* get Sleepage list */
    async function getSleepageData() {
        const params = {
            ip: locationData?.ip ? locationData?.ip : "",
            amount: selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : ""
        }
        try {
            const response = await pineappleDexService.getSleepageList(params);
            if (response?.status === 200) {
                setSleepage(() => response?.data?.data)
                sessionStorage.setItem("sleepage", JSON.stringify(response?.data?.data))
                setShowShimmer(false)
                setNetworkShimmer(false)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        getSleepageData()
    }, [selectedToken3?.symbol, selectedToken4?.symbol, selectedToken2?.symbol, selectedToken1?.symbol, inputValue])

    const calculateConversionRate = () => {
        if (selectedToken1?.amount && selectedToken2?.amount) {
            return (((selectedToken2.amount) / (selectedToken1?.amount)) ** 1)?.toFixed(5)
        }
        return "0";
    };
    const [showMax, setShowMax] = useState(false)
    const handleMaxClick = (maxAmount) => {
        setShowMax(true)
        let gasPrice;
        switch (selectedOption.value) {
            case '30s':
                // gasPrice = sleepage?.gasPrice?.instant || 0;
                gasPrice = sleepage?.gasPrice?.instant || 0;
                break;
            case '1m':
                gasPrice = sleepage?.gasPrice?.fast || 0;
                break;
            case '10m':
                gasPrice = sleepage?.gasPrice?.standard || 0;
                break;
            default:
                gasPrice = 0;
        }
        const gasPriceInEth = parseInt(gasPrice) * 35000 / 1e18; // Convert Wei to ETH (assuming 1 ETH = 1e18 Wei)
        if (selectedToken1?.symbol === "ETH" && key !== "limit") {
            const adjustedAmount = Number(maxAmount) - gasPriceInEth;
            setSelectedToken1((prev) => ({ ...prev, amount: adjustedAmount }));
        }
        else if (selectedToken1?.symbol === "ETH" && key === "limit") {
            const adjustedAmount = Number(maxAmount) - gasPriceInEth;
            setSelectedToken1((prev) => ({ ...prev, amount: adjustedAmount }));
            setSelectedToken2((prev) => ({ ...prev, amount: Number(adjustedAmount) * Number(inputValue) }));
        }
        else {
            setSelectedToken1((prev) => ({ ...prev, amount: maxAmount }));
            if (key == "limit") {
                setSelectedToken2((prev) => ({ ...prev, amount: Number(maxAmount) * Number(inputValue) }));
            }
        }
    };

    /* get allowance list */
    const getApproveAllowance = async () => {
        if (!selectedToken1?.address || !walletAddress) {
            return;
        }
        const params = {
            tokenAddress: selectedToken1?.address,
            walletAddress: walletAddress,
        };
        try {
            const response = await pineappleDexService.getAllowance(params);
            if (response?.status === 200) {
                const allowance = response?.data?.data?.allowance;
                allowanceRef.current = parseInt(allowance);
                if (response?.data?.data?.allowance == "0") {
                }
                else {
                    setApproveSwaModal("complete")
                    setManageApproveData("complete")
                }
            }
        } catch (error) {
            console.log("error in getAllownace", error)
        }
    };

    /* get Swap appi */

    const getSwaptokenApi = async () => {
        if (!selectedToken1?.address || !selectedToken2.address || !selectedToken1?.amount || !walletAddress || !sleepage?.userSlippage) {
            return;
        }
        setStartSwap(false)
        const amountInWei = parseFloat(selectedToken1?.amount) * Math.pow(10, selectedToken1?.decimals);
        const params = {
            src: selectedToken1?.address,
            dst: selectedToken2?.address,
            amount: numberToLocaleString(amountInWei),
            from: walletAddress,
            origin: walletAddress,
            slippage: sleepage?.userSlippage,
            includeGas: true
        };
        try {
            const response = await pineappleDexService.swapToken(params);
            if (response?.status === 200) {
                setSwapDetail(response?.data?.data?.tx)
                setApproveSwaModal("complete")
                setManageApproveData("complete")
                setSwaModal("initiated")
                await sendTransaction(response?.data?.data?.tx, "SWAP");
            }
        } catch (error) {
            console.log("error", error)
            setStartSwap(true)
            setShowSuccess(false)
            setIsLoader(false)
            setShowSteps(false)
            setApproveSwaModal("initiated")
            setManageApproveData("pending")
            setSwaModal("pending")
            const errorData = {
                error: error.response?.data?.message,
                transactionType: "SWAP",
                time: new Date(),
                transactionStatus: "FAILED"
            };
            setErrorData(errorData)
            setShowError(true);
        }
    };
    /* save swap data */
    const saveSwapDetails = async (transactionDetails) => {
        try {
            const response = await pineappleDexService.saveSwapToken(transactionDetails);
            if (response?.status === 200) {
                handleShowSuccess();
                setIsLoader(false)
                setShowSteps(false)
                setApproveSwaModal("initiated")
                setManageApproveData("pending")
                setSwaModal("pending")
            }
        } catch (error) {
            // errorSwal(error);
            console.log("error", error)
            setIsLoader(false)
            setShowSteps(false)
        }
    };
    /* save RejectSwap */
    const saveRejectSwapDetails = async (transactionDetails) => {
        try {
            console.log("transactionDetails inside the reject transaction: ", transactionDetails)
            const response = await pineappleDexService.rejectSwap(transactionDetails);
            if (response?.status === 200) {
                // handleShowSuccess();
                setIsLoader(false)
                setShowSteps(false)
                if (transactionDetails?.transactionType !== "SWAP") {
                    setShowSteps(false)
                    setIsLoader(false)
                    setApproveSwaModal("initiated")
                    setManageApproveData("pending")
                    setSwaModal("pending")
                } else {
                    setShowSteps(false)
                    setIsLoader(false)
                    setApproveSwaModal("complete")
                    setManageApproveData("complete")
                    setSwaModal("pending")
                }
            }
        } catch (error) {
            // errorSwal(error);
            console.log("error", error)
            setIsLoader(false)
            setShowSteps(false)
        }
    };
    const truncateText = (text, maxLength) => {
        if (text && text?.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setNetworkShimmer(true)
        let dataToSave;
        switch (selectedOption.value) {
            case '30s':
                dataToSave = 'instant';
                break;
            case '1m':
                dataToSave = 'fast';
                break;
            case '10m':
                dataToSave = 'standard';
                break;
            default:
                dataToSave = '';
        }
        const value = dataToSave === "instant"
            ? sleepage?.gasPrice?.instant
            : dataToSave === "fast"
                ? sleepage?.gasPrice?.fast
                : sleepage?.gasPrice?.standard;
        hitSlippageAPI(value, "gas");
    };
    const handleSlippageChange = (e, type) => {
        setShowShimmer(true)
        const value = e.target.value;
        localStorage.setItem("slippageType", "Custom");
        setSleepage((prev) => ({ ...prev, [type]: e.target.value }))
        setSelectedToken1((prev) => ({ ...prev, [type]: e.target.value }))
        hitSlippageAPI(value, type);
    };


    const hitSlippageAPI = (value, type) => {

        editSleepage(value > 0 ? value : type == "userSlippage" ? "" : value, type);

    };

    const [showTooltip, setShowTooltip] = useState(false);
    const amount = selectedToken1?.amount?.toString();
    const displayAmount = selectedToken1?.amount && selectedToken1?.amount?.length > 5 ? `${amount.slice(0, 5)}...` : amount;

    const handleTooltipToggle = () => {
        setShowTooltip(!showTooltip);
    };

    /* slice insigts */
    const [slicePoolData, setSlicePoolData] = useState()
    const [liquidityData, setLiquidityData] = useState()
    const [dxtScore, setDxtScore] = useState()
    const [tokenInfo, setTokenInfo] = useState()
    const [slicePoolShimmer, setSlicePollShimmer] = useState(true)
    const [liquidityshimmer, setLiquidityShimmer] = useState(true)
    const [dxtScoreshimmer, setDxtScoreShimmer] = useState(true)
    const [tokenInfoshimmer, setTokenInfoShimmer] = useState(true)
    const [progressbar, setProgressBar] = useState()
    const [progressBarShimmer, setProgressBarShimmer] = useState(true)

    const shouldShowMax = !showMax &&
        selectedToken1?.symbol &&
        selectedToken1?.balance &&
        (selectedToken1?.amount === undefined || Number(selectedToken1.balance) > Number(selectedToken1.amount));

    async function getpoolData(retryCount = 3) {
        try {
            const params = {
                tokenAddress: selectedToken2?.address
            }
            let response = await pineappleDexService.getpoolDetail(params);
            if (response?.status === 200) {
                if (response?.data?.poolDetail?.address) {
                    setSlicePoolData(response?.data);
                    getProgressData(response?.data?.poolDetail?.address);
                    setSlicePollShimmer(false);
                } else if (retryCount > 0) {
                    // Retry the API call if address is not present and retry count is not exhausted
                    console.log(`Retrying API call. Attempts left: ${retryCount}`);
                    return await getpoolData(retryCount - 1);
                } else {
                    // Handle the case where all retries are exhausted
                    console.log('Failed to get pool detail address after 3 attempts');
                }
            }
        } catch (error) {
            console.log("error", error);
            if (retryCount > 0) {
                console.log(`Retrying API call due to error. Attempts left: ${retryCount}`);
                return await getpoolData(retryCount - 1);
            } else {
                // Handle the case where all retries are exhausted
                console.log('Failed to get pool detail address after 3 attempts due to error');
            }
        }
    }


    useEffect(() => {
        if (isCurrentPath === true) {
            setDxtScore("")
            setDxtScoreShimmer(false)
        }
    }, [dxtScore])


    async function LiQuidityData(token) {
        try {
            const params = {
                tokenAddress: token?.address ? token?.address : selectedToken2?.address
            }
            const response = await pineappleDexService.getpoolPriceLiQuidity(params);
            if (response?.status === 200) {
                setLiquidityData(response?.data)
                setLiquidityShimmer(false)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    async function dextScoreData(token) {
        try {
            const params = {
                tokenAddress: selectedToken2?.address
            }
            const response = await pineappleDexService.getdextscore(params);
            if (response?.status === 200) {
                setDxtScore(response?.data)
                setDxtScoreShimmer(false)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    async function getProgressData(tokenAddress) {
        try {
            const params = {
                tokenAddress: tokenAddress ? tokenAddress : slicePoolData?.poolDetail?.address,
                token1: selectedToken1?.address,
                token2: selectedToken2?.address
            }
            const response = await pineappleDexService.getProgressBar(params);
            if (response?.status === 200) {
                setProgressBar(response?.data?.dextScore)
                setTimeout(() => {
                    setProgressBarShimmer(false)
                }, 3000)
            }
        } catch (error) {
            console.log("error", error)
        }
    }



    async function getSliceInfo(token) {
        try {
            const params = {
                tokenAddress: token?.address ? token?.address : selectedToken2?.address
            }
            const response = await pineappleDexService.getTokenInfo(params);
            if (response?.status === 200) {
                setTokenInfo(response?.data)
                setTokenInfoShimmer(false)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    function formatToMillions(number) {
        const units = ["", "K", "M", "B", "T"];
        const unitThresholds = [1, 1e3, 1e6, 1e9, 1e12];

        let unitIndex = unitThresholds.length - 1;
        while (unitIndex > 0 && number < unitThresholds[unitIndex]) {
            unitIndex--;
        }

        const unit = units[unitIndex];
        const value = number / unitThresholds[unitIndex];
        const formattedValue = value.toFixed(2);

        return `${formattedValue}${unit}`;
    }

    const onLimitSwap = () => {
        setIsSwap(true)
        const tempData = { ...selectedToken3 };
        setSelectedToken3({ ...selectedToken4 });
        setSelectedToken4(tempData);
        console.log("Swap executed!");
    };

    useEffect(() => {
        if (isJuicedPath === true && localStorage.getItem("showSliceInsights") === "true") {
            dextScoreData();
            setTimeout(() => {
                getpoolData();
            }, 1500);

            setTimeout(() => {
                LiQuidityData();
            }, 3000);

            setTimeout(() => {
                getSliceInfo();
            }, 5000);
        }

    }, [])


    const handleClick = () => {
        setIsSwap(true)
        console.log("clicked!");
        if (key === 'swap') {
            // Step 1: Save current selectedToken2 data into tempData
            const tempData = {
                ...selectedToken2
            };
            // Step 2: Update selectedToken2 with the data from selectedToken1
            setSelectedToken2({
                ...selectedToken1
            });

            // Step 3: Update selectedToken1 with the data saved in tempData
            setSelectedToken1(tempData);
        }

        if (key === 'limit') {
            let tempToken1 = selectedToken1;
            let tempToken2 = selectedToken2;
            // Step 2: Update selectedToken2's symbol with the data from selectedToken1's symbol
            setSelectedToken2(prevState => ({
                ...prevState, // keep other properties unchanged
                symbol: tempToken1.symbol, logoURI: tempToken1.logoURI, address: tempToken1.address
            }));

            // // Step 3: Update selectedToken1's symbol with the data saved in tempSymbol
            setSelectedToken1(prevState => ({
                ...prevState, // keep other properties unchanged
                symbol: tempToken2.symbol, logoURI: tempToken2.logoURI, address: tempToken2.address
            }));
        }




    };

    const totalSupply = slicePoolData?.tokenInfo?.totalSupply || 0;
    const circulatingSupply = slicePoolData?.tokenInfo?.circulatingSupply || 0;

    const formattedTotalSupply = totalSupply ? totalSupply.toFixed(2) : "-";
    const formattedCirculatingSupply = circulatingSupply ? `$${formatToMillions(circulatingSupply)}` : "-";

    const percentageOfCirculatingSupply = (totalSupply && circulatingSupply)
        ? `${((circulatingSupply / totalSupply) * 100).toFixed(2)}%`
        : "-";

    const upvotes = dxtScore?.dextScore?.votes?.upvotes || 0;
    const downvotes = dxtScore?.dextScore?.votes?.downvotes || 0;

    const priceTopVotes = (upvotes + downvotes > 0)
        ? `${((upvotes / (downvotes + upvotes)) * 100).toFixed(1)}%`
        : "0";

    const priceDownVotes = (upvotes + downvotes > 0)
        ? `${((downvotes / (downvotes + upvotes)) * 100).toFixed(1)}%`
        : "-";

    const liquidityDataProof = liquidityData?.liquidity?.reserves?.mainToken?.toFixed(2) || 0;
    const liquidityDataProofPercentage = (liquidityDataProof && totalSupply)
        ? `${((liquidityDataProof / totalSupply) * 100).toFixed(2)}%`
        : "-";

    const auditDetails = tokenInfo?.auditDetails;

    // Function to count occurrences of "warning"
    const countWarnings = (details) => {
        let count = 0;
        for (let key in details) {
            if (details[key] === "warning") {
                count++;
            }
        }
        return count;
    };

    const warningCount = auditDetails ? countWarnings(auditDetails) : 0;

    function validateTokenValues(selectedToken, selectedTokenPrevious, otherToken) {
        // console.log("selectedToken, selectedTokenPrevious, otherToken", selectedToken, selectedTokenPrevious, otherToken);
        if (selectedToken?.address === otherToken?.address) {
            return [selectedToken, selectedTokenPrevious]
        } else {
            return [selectedToken, otherToken]
        }
    }

    function validateLimitToken(token1, token2, limit1, limit2) {
        if (token1?.address === limit1?.address) {
            return [limit1, token2]
        } else if (token1?.address === limit2?.address) {
            return [limit2, token2]
        } else if (token2?.address === limit1?.address) {
            return [limit1, token1]
        } else if (token2?.address === limit2?.address) {
            return [limit2, token1]
        }
    }

    function handleTokenChange(token, tokenType = "token0") {
        console.log("token, tokenType", token, tokenType);

        let token1 = null;
        let token2 = null;        
        if (tokenType === "token0") {
            [token1, token2] = validateTokenValues(token, selectedToken1, selectedToken2);
            setSelectedToken1(token1);
            setSelectedToken2(token2);
            setShowTokens1(false);
        } else if (tokenType === "token1") {
            [token2, token1] = validateTokenValues(token, selectedToken2, selectedToken1);
            setSelectedToken1(token1);
            setSelectedToken2(token2);
            setShowTokens2(false);
        }
        if (selectedToken3 && selectedToken3?.address && selectedToken4 && selectedToken4?.address) {
            let [limit1, limit2] = validateLimitToken(token1, token2, selectedToken3, selectedToken4);
            setSelectedToken3(limit1);
            setSelectedToken4(limit2);
        }        
    }

    // function handleLimitTokenChange(token, tokenLimitType = "token0") {
    //     let token1 = null;
    //     let token2 = null;
    //     if (tokenLimitType === "token0") {
    //         [token1, token2] = validateTokenValues(token, selectedToken3, selectedToken4);
    //         setSelectedToken3(token1);
    //         setSelectedToken4(token2);
    //         setShowTokens1(false);
    //     } else if (tokenLimitType === "token1") {
    //         [token2, token1] = validateTokenValues(token, selectedToken4, selectedToken3);
    //         setSelectedToken3(token1);
    //         setSelectedToken4(token2);
    //         setShowTokens2(false);
    //     }
    //     let [limit1, limit2] = validateLimitToken(token1, token2, selectedToken1, selectedToken2);
    //     setSelectedToken1(limit1);
    //     setSelectedToken2(limit2);
    // }

    /* swap click */
    const handleSwapKey = (k) => {
        if (k === "swap" || isJuicedPath || isCurrentPath) {
            localStorage.setItem("key", k);
            handleToggleSwap();
            setShowSliceInsights(false);
            localStorage.setItem("showSliceInsights", "false");
            globalStates.setShowSliceInsights(false);
            setLiquidityData("");
            setDxtScore("");
            setSlicePoolData("");
            setTokenInfo("");
            setProgressBar("");
            setSlicePollShimmer(true);
            setLiquidityShimmer(true);
            setDxtScoreShimmer(true);
            setTokenInfoShimmer(true);
            setProgressBarShimmer(true);
        }
    };

    /* handle limit click */
    const handleLimitKey = (k) => {
        if (!selectedToken2?.symbol || !selectedToken2?.address) {
            localStorage.setItem("key", k);
            swal({
                icon: 'warning',
                title: 'Warning',
                text: 'Please choose a token in the buy section before proceeding to the Slice Insight screen.'
            }).then(() => {
                setKey(k);
                globalStates.setGlobalKey(k);
            });
            return;
        }

        if (isJuicedPath) {
            setKey(k);
            globalStates.setGlobalKey(k);
            localStorage.setItem("key", k);
            setShowSliceInsights(false);
            localStorage.setItem("showSliceInsights", "false");
            globalStates.setShowSliceInsights(false);
            localStorage.setItem("theme", "dark");
            document.body.className = "theme-dark";
            return;
        }

        if (isSwapUrl) {
            setKey(k);
            setShowJuiced(true);
            globalStates.setGlobalKey(k);
            return;
        }
    };

    /* click slice insgits */

    const handleSliceInsightsKey = (k) => {
        setKey(k);
        globalStates.setGlobalKey(k);
        localStorage.setItem("key", k);
        if (!selectedToken2?.symbol || !selectedToken2?.address) {
            console.log("slice_insights 2222");
            setKey("swap");
            globalStates.setGlobalKey("swap");
            swal({
                icon: 'warning',
                title: 'Warning',
                text: 'Please choose a token in the buy section before proceeding to the Slice Insight screen.'
            }).then(() => {
                setKey("swap");
                globalStates.setGlobalKey("swap");
            });
            return;
        }

        if (selectedToken2?.symbol && selectedToken2?.symbol === "ETH") {
            setKey("swap");
            globalStates.setGlobalKey("swap");
            console.log("slice_insights 3333");
            swal({
                icon: 'warning',
                title: 'Warning',
                text: 'Please choose another token in the buy section before proceeding to the Slice Insight screen.'
            }).then(() => {
                setKey("swap");
                globalStates.setGlobalKey("swap");
            });
            return;
        }
        if (isSwapUrl && k == "slice_insights") {
            // console.log("slice_insights 5555");
            // globalStates.setGlobalKey(k);
            // setKey(k);
            // setShowJuiced(true);
            // setShowSliceInsights(true);
            // localStorage.setItem("showSliceInsights", "true");
            // globalStates.setShowSliceInsights(true);
            setShowJuiced(true);
            globalStates.setGlobalKey(k);
            setKey(k);
            return;
        }

        if (isJuicedPath) {
            console.log("slice_insights 444");
            setShowSliceInsights(true);
            localStorage.setItem("showSliceInsights", "true");
            globalStates.setShowSliceInsights(true);
            setShowJuiced(false);
            localStorage.setItem("theme", "dark");
            document.body.className = "theme-dark";

            if (selectedToken2?.symbol && selectedToken2?.address) {
                dextScoreData();
                setTimeout(() => {
                    getpoolData();
                }, 1500);

                setTimeout(() => {
                    LiQuidityData();
                }, 3000);

                setTimeout(() => {
                    getSliceInfo();
                }, 5000);
            }
            return;
        }
    };


    const handleSelect = (k) => {
        localStorage.setItem("key", k);
        console.log("key", k);
        setKey(k);
        globalStates.setGlobalKey(k);

        if (k === "swap") {
            handleSwapKey(k);
            return;
        }
        if (k === "limit") {
            handleLimitKey(k);
            return;
        }
        if (k === "slice_insights") {
            handleSliceInsightsKey(k);
            return;
        }
    };

    function juccedSwap() {
        return (
            /* this is for dark mode */
            <div className="fresh-mode-inner">
                <div className="linear-icon">
                    <Dropdown>
                        {shouldShowToggle && key == "swap" && (
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                <img src={require("../assets/images/linear.svg").default} alt="img" />
                            </Dropdown.Toggle>
                        )}
                        {shouldShowToggle && key == "swap" && (
                            <Dropdown.Menu>
                                <div className="max-slippage-area">
                                    <p>Max. slippage</p>
                                    <h6>{slippageType} <i class="fa-solid fa-angle-down"></i></h6>
                                </div>

                                <div className="slippage-content-left">
                                    <ul>
                                        <li className={slippageType === 'Auto' ? 'active' : ''} onClick={(e) => {
                                            handleDropdownChange('Auto');
                                            setShowShimmer(true)
                                            handleSlippageChange({ target: { value: '0.5' } }, 'userSlippage');
                                        }}>Auto</li>
                                        <li className={slippageType === 'Custom' ? 'active' : ''} onClick={() => {
                                            localStorage.setItem("slippageType", "Custom");
                                            handleDropdownChange('Custom')
                                        }}>Custom</li>
                                    </ul>
                                    <Form>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                placeholder="0.5"
                                                maxLength={10}
                                                value={sleepage?.userSlippage}
                                                onChange={(e) => {
                                                    handleSlippageChange(e, 'userSlippage');
                                                    handleDropdownChange('Custom');
                                                }}
                                                onKeyDown={(e) => KeyDown.includes(e.key) && e.preventDefault()}
                                            />
                                            <p>%</p>
                                        </Form.Group>

                                    </Form>
                                </div>
                                {slippageType == "Custom" && sleepage?.userSlippage >= 2 ? <span className="transaction-message-area transaction-light"><img src={require("../assets/images/alert-symbol.png")} />Your transaction may be frontrun and result in an unfavorable trade.</span> : ""}
                                <p className="gas-light-theme">Transaction Time</p>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                >
                                    <Select
                                        onClick={(e) => e.stopPropagation()}
                                        options={options}
                                        defaultValue={options[1]}
                                        value={selectedOption}
                                        onChange={handleChange}
                                        styles={{
                                            control: (base, state) => ({
                                                background: "rgba(240, 239, 230, 1)",
                                                border: "1px solid rgba(216, 215, 207, 1)",
                                                padding: "6px",
                                                borderRadius: "10px",
                                            }),
                                            placeholder: (base, state) => ({
                                                ...base,
                                                color: "#fff",

                                            }),
                                            input: (base, state) => ({
                                                ...base,
                                                color: "white"
                                            }),
                                            focus: (base, state) => ({
                                                background: "rgba(240, 239, 230, 1)",
                                            }),
                                        }}
                                    />
                                </Form.Group>
                            </Dropdown.Menu>
                        )}
                    </Dropdown>
                </div>
                <Tabs
                    defaultActiveKey={key}
                    id="uncontrolled-tab-example"
                    activeKey={key}
                    onSelect={(k) => handleSelect(k)}
                >
                    <Tab eventKey="swap" title="Swap">
                        <div className="fresh-mode-body" data-aos="zoom-in" data-aos-duration="500" data-aos-easing="ease-in-out" >
                            {window.location.pathname == "/juiced" &&
                                <div className="dark-mode-head">
                                    <div className="fresh-mode-inner space-margin">
                                        <label>Transaction Time</label>
                                        <Select
                                            onClick={(e) => e.stopPropagation()}
                                            options={options}
                                            defaultValue={options[1]}
                                            value={selectedOption}
                                            onChange={handleChange}
                                            styles={{
                                                control: (base, state) => ({
                                                    background: "rgba(240, 239, 230, 1)",
                                                    border: "rgba(216, 215, 207, 1)",
                                                    padding: "6px",
                                                    borderRadius: "10px",
                                                }),
                                                placeholder: (base, state) => ({
                                                    ...base,
                                                    color: "#fff",

                                                }),
                                                input: (base, state) => ({
                                                    ...base,
                                                    color: "white"
                                                }),
                                                focus: (base, state) => ({
                                                    background: "rgba(240, 239, 230, 1)",
                                                }),
                                            }}
                                        />
                                    </div>
                                    <div className="fresh-mode-inner space-margin">
                                        <label>Slippage</label>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                {slippageType == "Custom" ? sleepage?.userSlippage ? sleepage?.userSlippage : 0 : slippageType}
                                                <i class="fa-solid fa-angle-down"></i>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <div className="slippage-content-left">
                                                    <ul>
                                                        <li className={slippageType === 'Auto' ? 'active' : ''} onClick={(e) => {
                                                            localStorage.setItem("slippageType", "Auto");
                                                            handleDropdownChange('Auto');
                                                            setShowShimmer(true)
                                                            handleSlippageChange({ target: { value: '0.5' } }, 'userSlippage');
                                                        }}>Auto</li>
                                                        <li className={slippageType === 'Custom' ? 'active' : ''} onClick={() => { localStorage.setItem("slippageType", "Custom"); handleDropdownChange('Custom') }}>Custom</li>
                                                    </ul>
                                                    <Form className="slippage-content-left-inner-content">
                                                        <Form.Group>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="0.5"
                                                                maxLength={10}
                                                                value={slippageType == "Custom" && sleepage?.userSlippage ? sleepage?.userSlippage : slippageType == "Auto" ? 0.5 : ""}
                                                                onChange={(e) => {
                                                                    handleSlippageChange(e, 'userSlippage');
                                                                    handleDropdownChange('Custom');
                                                                }}
                                                                onKeyDown={(e) => KeyDown.includes(e.key) && e.preventDefault()}
                                                            />
                                                            <p>%</p>
                                                        </Form.Group>
                                                    </Form>
                                                </div>
                                                    {slippageType == "Custom" && sleepage?.userSlippage >= 2 ? <span className="transaction-message-area"><img src={require("../assets/images/alert-symbol.png")} />Your transaction may be frontrun and result in an unfavorable trade.</span> : ""}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            }
                            <div className="sell-area-outer">
                                <div className="sell-top-area-content">
                                    <h6>Sell</h6>
                                    {!selectedToken1?.logoURI && !selectedToken1?.symbol ? <Button type="button" variant="unset" onClick={() => { setShowTokens1(true); setShowMax(false); setIsSwap(false) }}>
                                        {"Choose Token"}  <i class="fa-solid fa-angle-down"></i></Button>
                                        : <h5 onClick={() => { setShowTokens1(true); setIsSwap(false) }}>
                                            {selectedToken1?.logoURI ?
                                                <img src={selectedToken1?.logoURI} alt="img" />
                                                :
                                                <div className="token-alphabet"

                                                >
                                                    {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                </div>}
                                            {selectedToken1?.symbol ? truncateText(selectedToken1?.symbol, 15) : "Choose Token"}  <i class="fa-solid fa-angle-down"></i>
                                        </h5>}
                                </div>

                                <div className="sell-area-bottom outer-sell-shimmer">
                                    <Form.Control
                                        type="number"
                                        placeholder="0.00"
                                        value={selectedToken1?.amount ? selectedToken1?.amount : ""}
                                        onChange={handleAmountChange}
                                        onBlur={handleBlur}
                                        onKeyDown={(e) => KeyDown.includes(e.key) && e.preventDefault()}
                                    />
                                    <h4>≈ ${selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : "0.000"}</h4>
                                </div>
                                {walletAddress &&
                                    <div className="balance-bottom">
                                        <h6>
                                            {/* {chainId == 1 ? */}
                                                <>
                                                    <span>Balance</span>{" "}{selectedToken1?.balance ? Number(selectedToken1?.balance)?.toFixed(5) : 0} {truncateText(selectedToken1?.symbol, 15)}
                                                </>
                                                {/* :
                                                <>
                                                    <span>Balance</span>{" "}{0} {truncateText(selectedToken1?.symbol, 15)}
                                                </>
                                            } */}

                                            {shouldShowMax && shouldShowMax !== 0 ? (
                                                // chainId == 1 ?
                                                    <span onClick={() => handleMaxClick(selectedToken1.balance)} className="max-amount">
                                                        MAX
                                                    </span>
                                                    // : ""
                                            ) : ""}
                                        </h6>
                                        <p>≈ $
                                            {/* {chainId == 1 ? */}
                                                <>
                                                    {selectedToken1?.balance && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.balance) * Number(selectedToken1?.priceUSD)).toFixed(5) : 0}
                                                </>
                                                {/* :
                                                <>

                                                </>} */}
                                        </p>
                                    </div>}
                            </div>
                            <img className="grey-arrow" src={require("../assets/images/grey-arrow.svg").default}
                                onClick={handleClick}
                                alt="img" />

                            <div className="sell-area-outer">
                                <div className="sell-top-area-content">
                                    <h6>Buy</h6>
                                    {!selectedToken2?.logoURI && !selectedToken2?.symbol ?
                                        <Button type="button" variant="unset" onClick={() => { setShowTokens2(true); setIsSwap(false) }}>
                                            {"Choose Token"}  <i class="fa-solid fa-angle-down"></i></Button>
                                        :
                                        <h5 onClick={() => { setShowTokens2(true); setIsSwap(false) }}>
                                            {selectedToken2?.logoURI ? <img src={selectedToken2.logoURI} alt="img" />
                                                :
                                                <div className="token-alphabet"

                                                >
                                                    {selectedToken2?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                </div>}
                                            {truncateText(selectedToken2?.symbol, 15)}
                                            <i class="fa-solid fa-angle-down"></i>
                                        </h5>}
                                </div>

                                <div className="sell-area-bottom">
                                    {selectedToken1?.amount && selectedToken2?.symbol && !selectedToken2?.amount ? (
                                        <div className={isCurrentPath ? "shimmer" : "shimmer dark-sell-shimmer"}></div>
                                    ) : (
                                        <>
                                            <Form.Control
                                                type="number"
                                                placeholder="0.00"
                                                value={selectedToken2?.amount ? Number(selectedToken2.amount).toFixed(5) : ''}
                                                readOnly={true}
                                            />
                                        </>
                                    )}
                                    {selectedToken1?.amount && selectedToken2?.symbol && !selectedToken2?.amount && !selectedToken2.priceUSD ? (
                                        <h4>
                                            <div className="shimmer token-shimmer"></div>
                                        </h4>
                                    )
                                        : <h4>
                                            ≈ ${selectedToken2?.amount && selectedToken2.priceUSD ? Number(selectedToken2.amount * selectedToken2.priceUSD).toFixed(5) : "0.000"}
                                        </h4>}
                                </div>
                                {walletAddress && selectedToken2?.symbol && <div className="balance-bottom">
                                    <h6><span>Balance</span> {" "}{selectedToken2?.balance ? Number(selectedToken2?.balance)?.toFixed(5) : 0} {selectedToken2?.symbol}</h6>
                                    <p>≈ ${selectedToken2?.balance && selectedToken2.priceUSD ? Number(Number(selectedToken2?.balance) * Number(selectedToken2.priceUSD)).toFixed(5) : 0}</p>
                                </div>}
                            </div>
                            {selectedToken1?.amount && selectedToken1?.symbol && selectedToken2?.symbol || selectedToken2?.amount ?
                                <div className="main-value-bottom">
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>
                                                <p>1 {truncateText(selectedToken1?.symbol, 15)} =
                                                    {fromCurrencyPrice ?
                                                        (
                                                            <Skeleton width={100} className={isCurrentPath ? "network-cost-area" : "dark-network-cost-area"} />)
                                                        : (
                                                            `${fromCurrencyPriceRef?.current} ${truncateText(selectedToken2?.symbol, 15)}`
                                                        )}
                                                </p>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className="main-value-content-inner light-skaltone">
                                                    <h6>Max. slippage</h6>
                                                    <div className="dotted-line">
                                                        <img src={require("../assets/images/line1.png")} alt="img" />
                                                    </div>
                                                    {showShimmer == true ? (
                                                        <Skeleton className={isCurrentPath ? "network-cost-area" : "dark-network-cost-area"} width={100} height={20} />
                                                    ) : (
                                                        <p>
                                                            {slippageType === "Auto" ? <span>auto</span> : ""}{sleepage?.userSlippage}%
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="main-value-content-inner light-skaltone">
                                                    <h6>Fee ({Number("0.04")}%)</h6>
                                                    <div className="dotted-line">
                                                        <img src={require("../assets/images/line2.png")} alt="img" />
                                                    </div>
                                                    <p>${sleepage?.fee?.toFixed(2) || "0.00"}</p>
                                                </div>
                                                <div className="main-value-content-inner light-skaltone">
                                                    <h6>Network cost</h6>
                                                    <div className="dotted-line">
                                                        <img src={require("../assets/images/line2.png")} alt="img" />
                                                    </div>
                                                    {networkShimmer == true ? (
                                                        <Skeleton className={isCurrentPath ? "network-cost-area" : "dark-network-cost-area"} width={100} height={20} />
                                                    ) :
                                                        (
                                                            <p><span className="network-cost-amount">${networkcostRef.current ? networkcostRef.current?.toFixed(5) : "0.00" || "-"}</span></p>)}
                                                </div>
                                                <div className="main-value-content-inner light-skaltone">
                                                    <h6>Order routing</h6>
                                                    <div className="dotted-line">
                                                        <img src={require("../assets/images/line1.png")} alt="img" />
                                                    </div>
                                                    <p>{sleepage?.order_routing || "-"}</p>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div> : ""}

                            {walletAddress ?
                                <Button className="main-btn" type="button" variant="unset"
                                    disabled={
                                        !(
                                            Number(selectedToken1?.amount) &&
                                            selectedToken1?.symbol &&
                                            selectedToken2?.symbol &&
                                            walletAddress &&
                                            Number(selectedToken1?.balance) >= Number(selectedToken1?.amount) &&
                                            selectedToken2?.amount
                                        )
                                    }
                                    onClick={handleApprovedToken}>
                                    {isLoader || !walletAddress ?
                                        (
                                            <span class="loader"></span>
                                        ) :
                                        !walletAddress ?
                                            "Connect Wallet" :
                                            (!selectedToken1?.symbol || !selectedToken2?.symbol) ?
                                                "Choose Token" :
                                                !selectedToken1?.amount && selectedToken1?.symbol && selectedToken2?.symbol ?
                                                    "Insert Amount" :
                                                    selectedToken1?.amount && selectedToken1?.symbol && selectedToken2?.symbol && walletAddress ?
                                                        (Number(selectedToken1?.balance) >= Number(selectedToken1?.amount) ? "Swap" : `Insufficient ${selectedToken1?.symbol} Balance`) :
                                                        null
                                    }
                                </Button> :
                                <Button className="main-btn" type="button" variant="unset" onClick={connectWallet}>
                                    Connect Wallet
                                </Button>}
                            {Number(selectedToken1?.balance) < Number(selectedToken1?.amount) && selectedToken1?.symbol && walletAddress ?
                                <div className="info-botttom">
                                    <p>Uh-oh! No {selectedToken1?.symbol}, no trading. Add more {selectedToken1?.symbol} or buy with your credit or debit card through the link below to get started.</p>
                                </div> : ""}
                        </div>
                        {!shouldShowToggle ?
                            <div className="footer-mid dark-footer-mid">
                                <p>Do you need help before proceeding? <span>Click here</span></p>
                            </div> :
                            showSliceInsights ?
                                <p className="slice-insight-copyright">Score, Data, and Analytics Powered by Dextools
                                    <OverlayTrigger placement="top" overlay={tooltipJuiced} >
                                        <img src={require("../assets/images/dark-copyright-info.svg").default} alt="img" />
                                    </OverlayTrigger>
                                </p>
                                : ""}
                    </Tab>



                    <Tab eventKey="limit" title="Limit">
                        <div className="fresh-mode-body limit-box-outer-top" data-aos="zoom-in" data-aos-duration="500" data-aos-easing="ease-in-out">
                            <div className="limit-order-head limit-order-box-outer">
                                <div className={`limit-order-box ${globalStates.manageAnimation ? "box" : ""}`}>
                                    <div className="limit-order-head-top limit-order-head-mid">
                                        {inputValue ? <p>When 1 <span>
                                            {selectedToken3?.logoURI ? <img src={selectedToken3?.logoURI} alt="img" />
                                                :
                                                <div className="token-alphabet"

                                                >
                                                    {selectedToken3?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                </div>}
                                            {selectedToken3?.symbol}</span> is worth</p> : <p>Limit price</p>}
                                        <Form.Control
                                            type="number"
                                            placeholder="0.00"
                                            value={inputValue}
                                            onChange={(e) => { handleInputChange(e); limitStatusRef.current = false; }}
                                            onKeyDown={(e) => KeyDown.includes(e.key) && e.preventDefault()}
                                        />
                                        <ul>
                                            <li
                                                className={inputValue && activeItem === "Market" ? "active" : ""}
                                                onClick={() => {
                                                    limitStatusRef.current = true;
                                                    handleItemClick("Market");
                                                    calculateValue();
                                                }}
                                            >
                                                {limitStatusRef.current == false ? calculateValue() : "Market"}
                                            </li>
                                            <li
                                                className={activeItem === "1%" ? "active" : ""}
                                                onClick={() => { limitStatusRef.current = true; handleItemClick("1%") }}
                                            >
                                                1%
                                            </li>
                                            <li
                                                className={activeItem === "+5%" ? "active" : ""}
                                                onClick={() => { limitStatusRef.current = true; handleItemClick("+5%") }}
                                            >
                                                +5%
                                            </li>
                                            <li
                                                className={activeItem === "+10%" ? "active" : ""}
                                                onClick={() => { limitStatusRef.current = true; handleItemClick("+10%") }}
                                            >
                                                +10%
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="limit-order-head-right-area">
                                    <div className="limit-order-head-top">
                                        {/* {inputValue ? <p>When 1 <span>
                                        {selectedToken3?.logoURI ? <img src={selectedToken3?.logoURI} alt="img" />
                                            :
                                            <div className="token-alphabet"

                                            >
                                                {selectedToken3?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                            </div>}
                                        {selectedToken3?.symbol}</span> is worth</p> : <p>Limit price</p>} */}
                                        <div className="limit-order-head-top-right" onClick={onLimitSwap} >
                                            <img src={require("../assets/images/up-down-arrow.svg").default} />
                                            <img className="yello-up-down" src={require("../assets/images/yellow-up-down.svg").default} />
                                        </div>
                                    </div>
                                    <div className="limit-order-head-mid">

                                        <p
                                        >
                                            {selectedToken4?.logoURI ? <img src={selectedToken4?.logoURI} alt="img" />
                                                :
                                                <div className="token-alphabet"

                                                >
                                                    {selectedToken4?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                </div>}
                                            {selectedToken4?.symbol}</p>
                                    </div>
                                </div>

                                {/* <ul>
                                    <li
                                        className={inputValue && activeItem === "Market" ? "active" : ""}
                                        onClick={() => {
                                            limitStatusRef.current = true;
                                            handleItemClick("Market");
                                            calculateValue();
                                        }}
                                    >
                                        {limitStatusRef.current == false ? calculateValue() : "Market"}
                                    </li>
                                    <li
                                        className={activeItem === "1%" ? "active" : ""}
                                        onClick={() => { limitStatusRef.current = true; handleItemClick("1%") }}
                                    >
                                        1%
                                    </li>
                                    <li
                                        className={activeItem === "+5%" ? "active" : ""}
                                        onClick={() => { limitStatusRef.current = true; handleItemClick("+5%") }}
                                    >
                                        +5%
                                    </li>
                                    <li
                                        className={activeItem === "+10%" ? "active" : ""}
                                        onClick={() => { limitStatusRef.current = true; handleItemClick("+10%") }}
                                    >
                                        +10%
                                    </li>
                                </ul> */}
                            </div>
                            <div className="limit-mid-box">
                                <div className="sell-area-outer">
                                    <div className="sell-top-area-content">
                                        <h6>Sell</h6>
                                        {!selectedToken1?.logoURI && !selectedToken1?.symbol ? <Button type="button" variant="unset" onClick={() => { setShowTokens1(true); setShowMax(false); setIsSwap(false) }}>
                                            {"Choose Token"}  <i class="fa-solid fa-angle-down"></i></Button>
                                            : <h5 onClick={() => { setShowTokens1(true); setIsSwap(false) }}>
                                                {/* <img src={selectedToken1?.logoURI} alt="img" /> */}
                                                {selectedToken1?.logoURI ? <img src={selectedToken1?.logoURI} alt="img" />
                                                    :
                                                    <div className="token-alphabet"

                                                    >
                                                        {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                    </div>}
                                                {selectedToken1?.symbol ? truncateText(selectedToken1?.symbol, 15) : "Choose Token"}  <i class="fa-solid fa-angle-down"></i>
                                            </h5>}

                                    </div>


                                    <div className="sell-area-bottom outer-sell-shimmer">
                                        <Form.Control
                                            type="number"
                                            placeholder="0.00"
                                            value={selectedToken1?.amount ? selectedToken1?.amount : ""}
                                            onChange={handleAmountChange}
                                            onBlur={handleBlur}
                                            onKeyDown={(e) => KeyDown.includes(e.key) && e.preventDefault()}
                                        />

                                        <h4>≈ ${selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : "0.000"}</h4>
                                    </div>
                                    {walletAddress && <div className="balance-bottom">
                                        <h6>
                                            {/* {chainId == 1 ? */}
                                                <>
                                                    <span>Balance</span>{" "}{selectedToken1?.address && selectedToken1?.balance ? Number(selectedToken1?.balance)?.toFixed(5) : 0} {truncateText(selectedToken1?.symbol, 15)}
                                                </>
                                                {/* :
                                                <>
                                                    <span>Balance</span>{" "}{0} {truncateText(selectedToken1?.symbol, 15)}
                                                </>
                                            } */}

                                            {shouldShowMax && shouldShowMax !== 0 ? (
                                                // chainId == 1 ?
                                                    <span onClick={() => handleMaxClick(selectedToken1.balance)} className="max-amount">
                                                        MAX
                                                    </span>
                                                    // : ""
                                            ) : ""}
                                        </h6>
                                    </div>}
                                </div>
                                <img className="grey-arrow" src={require("../assets/images/grey-arrow.svg").default}
                                    onClick={handleClick}
                                    alt="img" />
                                <div className="sell-area-outer">
                                    <div className="sell-top-area-content">
                                        <h6>Buy</h6>
                                        {!selectedToken2?.logoURI && !selectedToken2?.symbol ?
                                            <Button type="button" variant="unset" onClick={() => { setShowTokens2(true); setIsSwap(false) }}>
                                                {"Choose Token"}  <i class="fa-solid fa-angle-down"></i></Button>
                                            :
                                            <h5 onClick={() => { setShowTokens2(true); setIsSwap(false) }}>
                                                {/* <img src={selectedToken2.logoURI} alt="img" /> */}
                                                {selectedToken2?.logoURI ? <img src={selectedToken2?.logoURI} alt="img" />
                                                    :
                                                    <div className="token-alphabet"

                                                    >
                                                        {selectedToken2?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                    </div>}
                                                {truncateText(selectedToken2?.symbol, 15)}
                                                <i class="fa-solid fa-angle-down"></i>
                                            </h5>}
                                    </div>

                                    <div className="sell-area-bottom">
                                        {!selectedToken1?.logoURI && !selectedToken1?.symbol ? (
                                            <div className={isCurrentPath ? "shimmer" : "shimmer dark-sell-shimmer"}></div>
                                        ) : (
                                            <>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={selectedToken2?.amount ? selectedToken2.amount : ''}
                                                    readOnly={true}
                                                />
                                            </>
                                        )}
                                        {selectedToken1?.amount && selectedToken2?.symbol && !selectedToken2?.amount && !selectedToken2.priceUSD ? (
                                            <h4>
                                                <div className="shimmer token-shimmer"></div>
                                            </h4>
                                        )
                                            : <h4>
                                                ≈ ${selectedToken2?.amount && selectedToken2.priceUSD ? Number(selectedToken2.amount * selectedToken2.priceUSD).toFixed(5) : "0.000"}
                                            </h4>}
                                    </div>
                                    {walletAddress && selectedToken1?.amount && selectedToken2?.symbol && <div className="balance-bottom">
                                        <h6><span>Balance</span> {" "}{selectedToken2?.balance ? Number(selectedToken2?.balance)?.toFixed(5) : 0} {selectedToken2?.symbol}</h6>
                                    </div>}
                                </div>
                                <div className="limit-order-bottom">
                                    <h6>Expiry</h6>
                                    <ul>
                                        {/* <li
                                        className={activeItemExpire === "5 minutes" ? "active" : ""}
                                        onClick={() => handleExpireItemClick("5 minutes")}
                                    >
                                        5 minutes
                                    </li> */}
                                        <li
                                            className={activeItemExpire === "1 day" ? "active" : ""}
                                            onClick={() => handleExpireItemClick("1 day")}
                                        >
                                            1 day
                                        </li>
                                        <li
                                            className={activeItemExpire === "1 week" ? "active" : ""}
                                            onClick={() => handleExpireItemClick("1 week")}
                                        >
                                            1 week
                                        </li>
                                        <li
                                            className={activeItemExpire === "1 month" ? "active" : ""}
                                            onClick={() => handleExpireItemClick("1 month")}
                                        >
                                            1 month
                                        </li>
                                        <li
                                            className={activeItemExpire === "1 year" ? "active" : ""}
                                            onClick={() => handleExpireItemClick("1 year")}
                                        >
                                            1 year
                                        </li>
                                    </ul>
                                </div>

                                {walletAddress ?
                                    <Button className="main-btn" type="button" variant="unset"
                                        disabled={
                                            !(
                                                Number(selectedToken1?.amount) &&
                                                selectedToken1?.symbol &&
                                                selectedToken2?.symbol &&
                                                walletAddress &&
                                                Number(selectedToken1?.balance) >= Number(selectedToken1?.amount) &&
                                                selectedToken2?.amount
                                            )
                                        }
                                        onClick={(e) => { getSwaptokenApiByNetworkCost(); setShowLimtSteps(true) }}>
                                        {isLoader ?
                                            (
                                                <span class="loader"></span>
                                            ) :
                                            !walletAddress ?
                                                "Connect Wallet" :
                                                (!selectedToken1?.symbol || !selectedToken2?.symbol) ?
                                                    "Choose Token" :
                                                    !selectedToken1?.amount && selectedToken1?.symbol && selectedToken2?.symbol ?
                                                        "Insert Amount" :
                                                        selectedToken1?.amount && selectedToken1?.symbol && selectedToken2?.symbol && walletAddress ?
                                                            (Number(selectedToken1?.balance) >= Number(selectedToken1?.amount) ? "Confirm" : `Insufficient ${selectedToken1?.symbol} Balance`) :
                                                            null
                                        }
                                    </Button> :
                                    <Button className="main-btn" type="button" variant="unset" onClick={connectWallet}>
                                        Connect Wallet
                                    </Button>}
                                {openLimitorderRef.current?.totalTransactions > 0 &&
                                    <div className="open-limit-bottom" onClick={(e) => {
                                        globalStates.setShowOpenLimit(!globalStates.showOpenLimit)
                                    }}>
                                        <p><img src={require("../assets/images/clock.svg").default} />{openLimitorderList?.totalTransactions} open limit</p>
                                        <img src={require("../assets/images/limit-arrow.svg").default} />
                                    </div>
                                }
                                {Number(selectedToken1?.balance) < Number(selectedToken1?.amount) && selectedToken1?.symbol && walletAddress ?
                                    <></>

                                    : ""}
                            </div>
                        </div>

                    </Tab>
                    <Tab eventKey="slice_insights" title="Slice insights"
                    >
                    </Tab>
                </Tabs>
            </div >)
    }


    return (
        <>
            {
                window.location.pathname !== "/juiced" || showSliceInsights ?
                    <>
                        <Row className="justify-content-center">
                            <Col md={showSliceInsights ? 12 : 8} lg={showSliceInsights ? 12 : 6} xl={showSliceInsights ? 10 : 5} xxl={showSliceInsights ? 8 : 4} >
                                {juccedSwap()}
                            </Col>
                        </Row>
                    </>
                    :
                    <>
                        {juccedSwap(selectedToken1, selectedToken2)}
                    </>
            }
            <ChainList showTokens={showTokens1} setShowTokens={setShowTokens1} setSelectedToken={setSelectedToken1} tokenList={tokenList} topTokenList={topTokenList} setPrevSelectedToken={setSelectedToken2} prevSelectedToken={selectedToken2} clearState={clearState} name={"token0"} handleTokenChange={handleTokenChange} />
            <ChainList showTokens={showTokens2} setShowTokens={setShowTokens2} setSelectedToken={setSelectedToken2} tokenList={tokenList} topTokenList={topTokenList} setPrevSelectedToken={setSelectedToken1} prevSelectedToken={selectedToken1} clearState={clearState} name={"token1"} handleTokenChange={handleTokenChange} />
            <ErrorModals setShowError={setShowError} showError={showError} errorData={errorData} />

            {/* swap confirm modal during limit order */}
            <Modal show={showLimitSteps} onHide={handleCloseLimitSteps} centered className="choose-token-popup follow-steps" backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="follow-steps-head">
                        <h6>Review limit</h6>
                        <span>Get Help</span>
                    </div>
                    <div className="success-content-inner">
                        <div className="success-inner-top">
                            <p>You pay</p>
                            <div className="follow-steps-right-outer">
                                <div className="follow-step-right">
                                    <h6>{selectedToken1?.amount && selectedToken1?.amount?.toString()?.length > 5 ? `${selectedToken1?.amount?.toString()?.substring(0, 8)}...` : selectedToken1?.amount}{" "}{selectedToken1?.symbol} </h6>
                                    <p>≈ ${selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : "0.000"}</p>
                                </div>
                                {selectedToken1?.logoURI ?
                                    <span><img src={selectedToken1?.logoURI} alt="img" /></span>
                                    :
                                    <div className="token-alphabet"
                                    >
                                        {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                    </div>}
                            </div>

                        </div>
                        <hr />
                        <div className="success-inner-top">
                            <p>You receive</p>
                            <div className="follow-steps-right-outer">
                                <div className="follow-step-right">
                                    <h6>{(selectedToken2?.amount && selectedToken2?.amount?.toString()?.length > 5) ? `${selectedToken2?.amount?.toString()?.substring(0, 8)}...` : selectedToken2?.amount}{selectedToken2?.symbol} </h6>
                                    {/* <p>≈ ${selectedToken2?.amount && selectedToken2.priceUSD ? Number(selectedToken2.amount * selectedToken2.priceUSD).toFixed(5) : "0.000"}</p> */}
                                    <span>≈ ${selectedToken2?.amount && selectedToken2.priceUSD ? Number(selectedToken2.amount * selectedToken2.priceUSD).toFixed(5) : "0.000"}</span>
                                </div>
                                {selectedToken2?.logoURI ?
                                    <span><img src={selectedToken2?.logoURI} alt="img" /></span>
                                    :
                                    <div className="token-alphabet"
                                    >
                                        {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="transactions-detail-mid-outer">
                        <div className="transactions-detail-mid-inner">
                            <p>Limit Price</p>
                            <div>
                                <h6>1 {selectedToken1?.symbol} = {marketPrice} {selectedToken2?.symbol} </h6>
                                <span>≈ ${selectedToken2?.amount && selectedToken2.priceUSD && marketPrice ? Number(marketPrice * selectedToken2.priceUSD).toFixed(5) : "0.000"}</span>
                            </div>
                        </div>
                        <div className="transactions-detail-mid-inner">
                            <p>Expiry</p>
                            <h6>{formattedExpiry}</h6>
                        </div>
                        <div className="transactions-detail-mid-inner">
                            <p>Fee </p>
                            <h6>${0}</h6>
                        </div>
                        <div className="transactions-detail-mid-inner">
                            <p>Network cost</p>
                            {/* <h6>${networkcostRef.current ? networkcostRef.current?.toFixed(4) : sleepage?.networkCost}</h6> */}
                            <h6>${0}</h6>
                        </div>
                        <p className="order-limit-popup-text"><img src={require("../assets/images/limit-info.svg").default} />Cancelling a limit will require a small netwrok cost. {" "}</p>
                    </div>
                    <Button type="button" variant="unset" onClick={handleApproveLimit}>Approve and Swap</Button>
                </Modal.Body>
            </Modal>

            {/* swap confirm modal to setup */}
            <Modal show={showLimitFollowSteps} onHide={handleCloseFollowLimitSteps} centered className="choose-token-popup follow-steps" backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="follow-steps-head">
                        <h6>Review limit</h6>
                        <span>Get Help</span>
                    </div>
                    <div className="success-content-inner">
                        <div className="success-inner-top">
                            <p>You pay</p>
                            <div className="follow-steps-right-outer">
                                <div className="follow-step-right">
                                    <h6>{selectedToken1?.amount && selectedToken1?.amount?.toString()?.length > 5 ? `${selectedToken1?.amount?.toString()?.substring(0, 8)}...` : selectedToken1?.amount}{" "}{selectedToken1?.symbol} </h6>
                                    <p>≈ ${selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : "0.000"}</p>
                                </div>
                                {selectedToken1?.logoURI ?
                                    <span><img src={selectedToken1?.logoURI} alt="img" /></span> :
                                    <div className="token-alphabet"
                                    >
                                        {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                    </div>}
                            </div>

                        </div>
                        <hr />
                        <div className="success-inner-top">
                            <p>You receive</p>
                            <div className="follow-steps-right-outer">
                                <div className="follow-step-right">
                                    <h6>{(selectedToken2?.amount && selectedToken2?.amount?.toString()?.length > 5) ? `${selectedToken2?.amount?.toString()?.substring(0, 8)}...` : selectedToken2?.amount}{selectedToken2?.symbol} </h6>
                                    <p>≈ ${selectedToken2?.amount && selectedToken2.priceUSD ? Number(selectedToken2.amount * selectedToken2.priceUSD).toFixed(5) : "0.000"}</p>
                                </div>
                                {selectedToken2?.logoURI ?
                                    <span><img src={selectedToken2?.logoURI} alt="img" /></span>
                                    :
                                    <div className="token-alphabet"
                                    >
                                        {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                    </div>}
                            </div>
                        </div>
                    </div>

                    <div className="steps-approve-area">
                        <div className="steps-approve-inner">
                            <div className="steps-approve-inner-left">
                                {approveLimit == "pending" ? (
                                    <span className="steps-loader"></span>
                                ) : (
                                    <img
                                        src={approveLimit == "pending" ? require("../assets/images/grey-eth.png") : selectedToken1?.logoURI}
                                        alt="img"
                                    />
                                )}
                                <div className="steps-area-inner">
                                    <div className="steps-area-right">
                                        <h6 className={approveLimit == "complete" ? "disable" : ""}>Approve in wallet</h6>
                                        {approveLimit == "pending" ? <p>Why do I have to approve a token?</p> : ""}
                                    </div>
                                </div>
                            </div>
                            {approveLimit == "complete" && <i className="fa-solid fa-check"></i>}
                        </div>
                        <div className="steps-approve-inner">
                            <div className="steps-approve-inner-left" >
                                {limitSwap == "pending" ? <span class="steps-loader">
                                </span>
                                    :
                                    <img src={limitSwap == "pending" ? require("../assets/images/arrow-grey.png") : require("../assets/images/colored-arrow.png")} alt="img" />

                                }
                                <div className="steps-area-inner">
                                    <div className="steps-area-right">
                                        <h6 className={swaModal == "complete" ? "disable" : ""}>{limitSwap == "pending" ? "Swap pending..." : "Confirm swap"}</h6>
                                        {limitSwap == "pending" && <p>Why do i have to approve a token?</p>}
                                    </div>
                                </div>
                            </div>
                            {limitSwap == "complete" && approveLimit == "complete" && <i class="fa-solid fa-check"></i>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* swap success modal showSuccess */}
            <Modal show={showSuccess} onHide={handleCloseSuccess} centered className="choose-token-popup success-popup">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="success-content">
                        <div className="success-tick">
                            <img src={require("../assets/images/success-image.png")} alt="img" />
                        </div>

                        <h5>Transaction submitted</h5>
                        <div className="success-content-inner">
                            <div className="success-inner-top">
                                <p>Selled</p>
                                <h6>
                                    {selectedToken1?.amount && selectedToken1?.amount?.toString()?.length > 5 ? `${selectedToken1?.amount?.toString()?.substring(0, 8)}...` : selectedToken1?.amount}{" "}

                                    {selectedToken1?.logoURI ?
                                        <span>
                                            <img src={selectedToken1?.logoURI} alt="img" /> </span> :
                                        <span>
                                            <div className="token-alphabet notification-token-alphabet"
                                            >
                                                <span>  {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}</span>
                                            </div>
                                        </span>
                                    }
                                    <span className="font-size-dic">
                                        {selectedToken1?.symbol}
                                    </span>
                                </h6>
                            </div>
                            <hr />
                            <div className="success-inner-top">
                                <p>Received</p>
                                <h6>
                                    {/* {selectedToken2?.amount && !isNaN(selectedToken2.amount)
                                        ? Number(selectedToken2.amount).toFixed(5)
                                        : "0.000"} */}
                                    {selectedToken2?.amount && selectedToken2?.amount?.toString()?.length > 5 ? `${selectedToken2?.amount?.toString()?.substring(0, 8)}...` : selectedToken2?.amount}{" "}
                                    {selectedToken2?.logoURI ?
                                        <span><img src={selectedToken2?.logoURI} alt="img" /></span>
                                        :

                                        <div className="token-alphabet notification-token-alphabet"
                                        >
                                            <span>  {selectedToken2?.name?.charAt(0)?.toUpperCase() || 'N/A'}</span>
                                        </div>}
                                    <span className="font-size-dic">
                                        {selectedToken2?.symbol}</span></h6>
                            </div>
                        </div>
                        {key !== "limit" && <div className="timer-area">
                            <p><img src={require("../assets/images/timer.svg").default} alt="img" />
                                {transactionDetails?.time &&
                                    formattedTime
                                }
                            </p>
                            {key !== "limit" && <a href={`${ETHERSCAN_URL}/${transactionDetails.transactionHash}`} target="_blank">View on Etherscan</a>}
                        </div>}
                        <Button variant="unset" onClick={handleCloseSuccess}>
                            Close
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            {/* follow-steps-popup */}
            <Modal show={showSteps} onHide={handleCloseSteps} centered className="choose-token-popup follow-steps" backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="follow-steps-head">
                        <h6>Review limit</h6>
                        <span>Get Help</span>
                    </div>
                    <div className="success-content-inner">
                        <div className="success-inner-top">
                            <p>You pay</p>
                            <div className="follow-steps-right-outer">
                                <div className="follow-step-right">
                                    <h6>{selectedToken1?.amount && selectedToken1?.amount?.toString()?.length > 5 ? `${selectedToken1?.amount?.toString()?.substring(0, 8)}...` : selectedToken1?.amount}{" "}{selectedToken1?.symbol} </h6>
                                    <p>≈ ${selectedToken1?.amount && selectedToken1?.priceUSD ? Number(Number(selectedToken1?.amount) * Number(selectedToken1?.priceUSD)).toFixed(5) : "0.000"}</p>
                                </div>
                                {selectedToken1?.logoURI ? <span>
                                    <img src={selectedToken1?.logoURI} alt="img" />
                                </span>
                                    :
                                    <div className="token-alphabet"
                                    >
                                        {selectedToken1?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                    </div>}
                            </div>

                        </div>
                        <hr />
                        <div className="success-inner-top">
                            <p>You receive</p>
                            <div className="follow-steps-right-outer">
                                <div className="follow-step-right">
                                    <h6>{(selectedToken2?.amount && selectedToken2?.amount?.toString()?.length > 5) ? `${selectedToken2?.amount?.toString()?.substring(0, 8)}...` : selectedToken2?.amount}{selectedToken2?.symbol} </h6>
                                    <p>≈ ${selectedToken2?.amount && selectedToken2.priceUSD ? Number(selectedToken2.amount * selectedToken2.priceUSD).toFixed(5) : "0.000"}</p>
                                </div>
                                {selectedToken2?.logoURI ?
                                    <span><img src={selectedToken2?.logoURI} alt="img" /></span>
                                    :
                                    <div className="token-alphabet"
                                    >
                                        {selectedToken2?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="steps-approve-area">
                        <div className="steps-approve-inner">
                            <div className="steps-approve-inner-left">
                                {approveSwaModal == "initiated" ? (
                                    <span className="steps-loader"></span>
                                ) : (
                                    <img
                                        src={approveSwaModal == "initiated" ? require("../assets/images/grey-eth.png") : selectedToken1?.logoURI}
                                        alt="img"
                                    />
                                )}
                                <div className="steps-area-inner">
                                    <div className="steps-area-right">
                                        <h6 className={approveSwaModal == "complete" ? "disable" : ""}>Approve in wallet</h6>
                                        {approveSwaModal == "initiated" ? <p>Why do I have to approve a token?</p> : ""}
                                    </div>
                                </div>
                            </div>
                            {approveSwaModal == "complete" && <i className="fa-solid fa-check"></i>}
                        </div>

                        <div className="steps-approve-inner">
                            <div className="steps-approve-inner-left" >
                                {manageApproveData == "initiated" ? <span class="steps-loader"></span>
                                    :
                                    <img src={manageApproveData == "initiated" ? require("../assets/images/grey-msg-icon.png") : require("../assets/images/colored-msg.png")} alt="img" />}
                                <div className="steps-area-inner">
                                    <div className="steps-area-right">
                                        <h6 className={manageApproveData == "complete" ? "disable" : ""}>Sign message</h6>
                                        {manageApproveData == "initiated" ? <p>Why do i have to approve a token?</p> : ""}
                                    </div>
                                </div>
                            </div>
                            {manageApproveData == "complete" && <i class="fa-solid fa-check"></i>}

                        </div>
                        <div className="steps-approve-inner">
                            <div className="steps-approve-inner-left" >
                                {swaModal == "initiated" ? <span class="steps-loader">
                                </span>
                                    :
                                    <img src={swaModal == "initiated" ? require("../assets/images/arrow-grey.png") : require("../assets/images/colored-arrow.png")} alt="img" />

                                }
                                <div className="steps-area-inner">
                                    <div className="steps-area-right">
                                        <h6 className={swaModal == "complete" ? "disable" : ""}>{swaModal == "initiated" ? "Swap pending..." : "Confirm swap"}</h6>
                                        {swaModal == "initiated" && <p>Why do i have to approve a token?</p>}
                                    </div>
                                </div>
                            </div>
                            {swaModal == "complete" && manageApproveData == "complete" && approveSwaModal == "complete" ? <i class="fa-solid fa-check"></i> : <span>{swaModal == "initiated" &&
                                formattedTime}</span>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            
            {/* juiced-modal */}
            <Modal show={showJuiced} onHide={handleCloseJuiced} centered className="choose-token-popup success-popup juiced-mode ">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="success-content">
                        <div className="success-tick">
                            <img src={require("../assets/images/pineapple.svg").default} alt="img" />
                        </div>
                        <h5>Switch to Juiced mode</h5>
                        <div className="success-content-inner">
                            <p>To use the Limit and Slice insights, go to Juiced mode</p>
                        </div>
                        <Button variant="unset" onClick={!isJuicedPath ? handleShowJuiced : null
                        }>
                            Activate juiced mode
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {(metaMaskModal || metaMaskModal === false) &&
                <AddToken
                    setMetaMaskModal={setMetaMaskModal}
                    metaMaskModal={metaMaskModal}
                    selectedToken2={selectedToken2}
                />
            }
        </>
    )



};
export default Swap