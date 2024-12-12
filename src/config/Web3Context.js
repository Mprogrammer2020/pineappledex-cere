import React, { createContext, useState, useContext, useEffect } from 'react';
import Web3 from 'web3';
import { pineappleDexService } from '../service/api.service';
import swal from 'sweetalert';
import axios from 'axios';
import { pineappleMetamaskUrl, privateKeyProvider, web3auth } from './config';
import { GlobalContext } from "../globalStates.js/GlobalContext";


const Web3Context = createContext();


export const formatWalletAddress = (address) => {
    if (!address) return '';
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);
    return `${firstPart}...${lastPart}`;
};






export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [walletAddress, setWalletAddress] = useState(localStorage.getItem("walletAddress") || '');
    const [chainId, setChainId] = useState(null);
    const [longitude, setLongitude] = useState("")
    const [latitude, setLatitude] = useState("")
    const [locationData, setLocationData] = useState(null)
    const globalStates = useContext(GlobalContext);


    // useEffect(() => {
    //     // For mobile MetaMask browser, use a manual connection button
    //     if (window.ethereum && window.ethereum.isMetaMask) {
    //         if (window.innerWidth <= 768) {
    //             console.log("Mobile MetaMask browser detected. Wallet connection requires user interaction.");
    //             connectWallet();
    //         } else {
    //             // For desktop, auto-connect
    //             // connectWallet();
    //         }
    //     } else {
    //         console.log("MetaMask not detected.");
    //     }
    // }, []);

    useEffect(() => {
        makeAPICall()
        // if (window.ethereum) {
        //     const web3Instance = new Web3(window.ethereum);
        //     setWeb3(web3Instance);
        // }
    }, [])

    // console.log("globalStates",globalStates)

    function makeAPICall() {
        let userCountry = '';
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                fetch(`https://ipapi.co/${data?.ip}/json`)
                    .then(response => response.json())
                    .then(data => {
                        // console.log("data==========", data)
                        setLocationData(data)
                        setLatitude(data?.latitude)
                        setLongitude(data.longitude)
                    })
            })
            .catch(error => {
            });
    }
    const connectWallet = async () => {
        try {
            const switchChain = await web3auth.switchChain({ chainId: "0x1" });
            console.log("provider", switchChain);

            const provider = await web3auth.connect();
            console.log("provider", provider);

            const user = await web3auth?.getUserInfo(); // web3auth instance
            console.log("provider", user);

            const web3Instance = new Web3(provider);

            // Get user's Ethereum public address
            const address = (await web3Instance.eth.getAccounts())[0];
            saveWalletAddress(address);
            setWalletAddress(address);
            web3Instance.setProvider(privateKeyProvider);
            setWeb3(web3Instance);
            let currentChainId = await web3Instance.eth.getChainId();
            localStorage.setItem('walletAddress', address);
            setChainId(Number(currentChainId));

        } catch (error) {

        }

        // if (window.innerWidth > 768) {
        // if (window.ethereum) {
        //     if (window.ethereum.isMetaMask) {
        //         try {
        //             await window.ethereum.request({ method: 'eth_requestAccounts' });
        //             const web3Instance = new Web3(window.ethereum);
        //             setWeb3(web3Instance);
        //             let currentChainId = await web3Instance.eth.getChainId();
        //             if (Number(currentChainId) != 1) {
        //                 await switchNetwork(1);
        //             }
        //             currentChainId = await web3Instance.eth.getChainId();
        //             if (Number(currentChainId) === 1) {
        //                 const accounts = await web3Instance.eth.getAccounts();
        //                 const address = accounts[0];
        //                 saveWalletAddress(address);
        //                 setWalletAddress(address);
        //                 localStorage.setItem('walletAddress', address);
        //                 setChainId(Number(currentChainId));
        //             }
        //         } catch (error) {
        //             console.log("Error connecting to wallet: ", error);
        //             console.log("Please install MetaMask!");
        //             alert("Please install MetaMask!");
        //             window.location.href = pineappleMetamaskUrl;
        //             // handleConnectionError();
        //         }
        //     } else {
        //         console.log("Non-MetaMask browser detected. Please install MetaMask.");
        //     }
        // }
        //  else if (window.web3) {
        //     const web3Instance = new Web3(window.web3.currentProvider);
        //     setWeb3(web3Instance);
        //     const currentChainId = await web3Instance.eth.getChainId();
        //     if (Number(currentChainId) != 1) {
        //         await switchNetwork(1);
        //     }
        //     currentChainId = await web3Instance.eth.getChainId();
        //     if (Number(currentChainId) === 1) {
        //         const accounts = await web3Instance.eth.getAccounts();
        //         const address = accounts[0];
        //         saveWalletAddress(address);
        //         setWalletAddress(address);
        //         localStorage.setItem('walletAddress', address);
        //         setChainId(Number(currentChainId));
        //     }
        // }
        //  else {
        //     if (window.innerWidth <= 768) {
        //         window.location.href = pineappleMetamaskUrl;
        //     }else{
        //         swal({
        //             icon: 'warning',
        //             text: "Please install MetaMask!",
        //             button: "OK"
        //         }).then(() => {
        //             window.open('https://metamask.io/download.html', '_blank');
        //         });
        //     }

        // }
        // } 
        // else { 
        //     console.log("Non-MetaMask browser detected. Please install MetaMask.");
        //     // window.location.href = pineappleMetamaskUrl;
        //     alert("Please install MetaMask!");
        // }

    };

    const handleConnectionError = () => {
        if (window.innerWidth <= 768) {
            // On mobile, show instructions to open MetaMask
            swal({
                title: "Connect Wallet",
                text: "Please open MetaMask app and connect your wallet.",
                icon: "info",
                buttons: ["Open MetaMask", "Cancel"],
                closeOnClickOutside: false
            }).then((openMetaMask) => {
                if (openMetaMask) {
                    // Open MetaMask app (iOS deep link)
                    // window.location.href = "https://apps.apple.com/app/id1438144202";

                }
            });
        }
    };

    const saveWalletAddress = async (walletAddress) => {
        try {
            const data = {
                walletAddress: walletAddress,
                role: 'User',
                country: locationData?.country_name,
                ip: locationData?.ip ? locationData?.ip : "",
                country: locationData?.country,
                latitude: locationData?.latitude,
                longitude: locationData?.longitude,
                timezone: locationData?.timezone,
                fcmToken: globalStates?.fcmToken || localStorage.getItem("fcmToken")
            };
            const response = await pineappleDexService.walletlogin(data);
            if (response?.status === 200 && response?.data?.data) {
                localStorage.setItem("login", true);
                localStorage.setItem("Token", response?.data?.token)
                globalStates.setShowToken(response?.data?.token)
                localStorage.setItem("userData", JSON.stringify(response?.data?.data))
                localStorage.setItem('walletAddress', walletAddress);
                globalStates.setIsChangemetamaskWallet(!globalStates.isChangemetamaskWallet);
                // swal("Success", response?.data?.message, "success").then(() => {
                //     // window.location.reload();
                // });
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                swal({
                    icon: "error",
                    text: error?.response?.data?.message,
                    button: "OK",
                }).then(() => {
                    localStorage.clear()
                    window.location.href = "/swap";
                });
            } else {
                swal({
                    icon: "error",
                    text: error?.response?.data?.message ? error?.response?.data?.message : error?.message,
                    button: "OK",
                }).then(() => {
                    localStorage.clear()
                    window.location.href = "/swap";
                });
            }
        }
    };

    useEffect(() => {
        checkNetwork();
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
    }, [walletAddress, web3,web3auth.status,web3auth.provider]);



    async function checkNetwork() {
        if (walletAddress && !web3) {
            // Reinitialize web3 instance if walletAddress is present but web3 is not
            // if (web3auth && web3auth?.provider) {
            //     console.log("user", web3auth);

            //     const user = await web3auth?.connected(); // web3auth instance
            //     console.log("user", user);



            // }

            if (web3auth && web3auth.provider) {

                const web3Instance = new Web3(web3auth.provider);
                // web3Instance.setProvider(privateKeyProvider);
                setWeb3(web3Instance);
                const currentChainId = await web3Instance.eth.getChainId();
                console.log("currentChainId", currentChainId);

                if (Number(currentChainId) == 1) {
                    setChainId(Number(currentChainId));
                } else {
                    swal({
                        icon: 'warning',
                        text: "Please select Ethereum as our website is compatible only with this blockchain for now.",
                        button: "OK"
                    }).then(() => {
                        switchNetwork(1);
                    })
                }
            }
        }

    }

    const handleChainChanged = (chainId) => {
        chainId = parseInt(chainId, 16);
        if (chainId == 1) {
            setChainId(chainId);
        } else {
            swal({
                icon: 'warning',
                text: "Please select Ethereum as our website is compatible only with this blockchain for now.",
                button: "OK"
            }).then(() => {
                switchNetwork(1);
            })
        }
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
            if (walletAddress) { // Only show the modal if the wallet is already connected

                if (walletAddress.toLowerCase() != accounts[0].toLowerCase()) {
                    swal({
                        icon: 'warning',
                        text: "Switching to a different wallet in MetaMask will disconnect your current session.",
                        buttons: ["Disconnect", "Ok"],
                        closeOnClickOutside: false
                    }).then((res) => {
                        if (res) {
                            localStorage.clear();
                            connectWallet();
                            // globalStates.setShowOpenLimit(!globalStates.showOpenLimit);
                        } else {
                            localStorage.clear();
                        }
                    })
                } else {
                    setWalletAddress(accounts[0]);
                }
            }
        } else {
            setWalletAddress(null);
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
            await switchNetwork(chainId)
            // throw switchError.message
            console.error('Error switching chain', switchError);
        }

    };


    const disconnectWallet = () => {
        setWeb3(null);
        setWalletAddress('');
        setChainId(null);
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('login');
        localStorage.removeItem('Token');
        localStorage.removeItem('userData');
        swal("Disconnected", "Wallet has been disconnected successfully.", "info");
    };
console.log("web3",web3);

    return (
        <Web3Context.Provider value={{ web3,setWeb3,chainId, walletAddress, connectWallet, disconnectWallet, checkNetwork }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);
