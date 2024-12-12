import { Button, Col, Container, Dropdown, Modal, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import { useWeb3, formatWalletAddress } from "../config/Web3Context";
import { useContext, useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
// import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { pineappleDexService } from "../service/api.service";
import { GlobalContext } from "../globalStates.js/GlobalContext";
import { Notification } from "./Notification";
import { keys } from "highcharts";
import { useBootstrapBreakpoints } from "react-bootstrap/esm/ThemeProvider";
import { web3auth } from "../config/config";


const Header = () => {
    const { walletAddress, connectWallet } = useWeb3();
    const globalStates = useContext(GlobalContext);
    const [showJuiced, setShowJuiced] = useState(false);
    const isJuicedPath = window.location.pathname === '/juiced';
    const isCurrentPath = window.location.pathname === '/swap';
    const navigate = useNavigate();
    const [notificationList, setNotificationList] = useState()
    const [expand, setExpand] = useState(false);
    const [disableToggle, setDisableToggle] = useState(false);

    const handleCloseJuiced = () => {
        setShowJuiced(false);
    }

    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const handleCloseDisclaimer = () => setShowDisclaimer(false);
    const handleShowDisclaimer = () => setShowDisclaimer(true);
    const [location, setLocation] = useState("")

    useEffect(() => {
        makeAPICall()
    }, [])


    const handleDisconnect = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to disconnect the wallet.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, disconnect it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                Logout()
            }
        });
    };

    const handleButtonClick = () => {
        if (window.location.pathname !== "/swap") {
            localStorage.setItem("theme", "light");
            document.body.className = "theme-light"
            navigate("/swap");
            handleTabChange("radio-1", "/swap", "light")

        }
    };

    /* get user broweser location */
    function makeAPICall() {
        let userCountry = '';
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                fetch(`https://ipapi.co/${data?.ip}/json`)
                    .then(response => response.json())
                    .then(data => {
                        setLocation(data)
                    })
            })
            .catch(error => {
            });
    }

    useEffect(() => {
        if (globalStates.showtoken) {
            GetNotificationData()
        }
    }, [globalStates?.managenotification, globalStates.isChangemetamaskWallet, localStorage.getItem("Token"), globalStates.showtoken])

    async function GetNotificationData() {
        try {
            const response = await pineappleDexService.getNotificationList();
            if (response?.status === 200) {
                // console.log("response", response)
                setNotificationList(response?.data?.data)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    async function unReadCount() {
        const params = {}
        try {
            const response = await pineappleDexService.unreadCountdata(params);
            if (response?.status === 200) {
                console.log("response", response)
                GetNotificationData()
                // setNotificationList(response?.data?.data)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    // console.log("globalStates.isChangemetamaskWallet", globalStates.isChangemetamaskWallet)

    async function Logout() {
        const params = {
            country: location?.country,
            ip: location?.ip,
            fcmToken: globalStates?.fcmToken
        }
        try {
            await web3auth.logout();
            const response = await pineappleDexService.signOut(params);
            if (response.status === 200) {
                localStorage.clear()
                window.location.href = "/swap";
            }
        }
        catch (error) {
            localStorage.clear();
            window.location.reload();
            console.log("error", error);
        }
    };

    const shouldShowDisclaimer = window.location.pathname == "/swap" &&
        location?.region === "England" &&
        location?.timezone === "Europe/London";

    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 10);
        });
    }, []);

    useEffect(() => {
        // On page load, set the default tab based on localStorage
        const savedTab = localStorage.getItem("selectedTab");
        if (savedTab) {
            document.getElementById(savedTab).checked = true;
        } else {
            // Default to "radio-1" if no tab is saved in localStorage
            document.getElementById("radio-1").checked = true;
        }
    }, []);

    const navbarRef = useRef(null);

    // Function to handle link clicks and collapse the navbar
    const handleLinkClick = (path) => {
        if (window.location.pathname !== path) {
            localStorage.setItem("theme", "light");
            document.body.className = "theme-light";
            navigate(path);
        }

        // Collapse the navbar
        if (navbarRef.current) {
            const bsCollapse = new useBootstrapBreakpoints().Collapse(navbarRef.current, { toggle: false });
            bsCollapse.hide();
        }
    };

    const handleTabChange = (tabId, path, theme) => {
        console.log("handleTabChange", tabId, path, theme)
        if (window.location.pathname !== path) {
            if (path == "/juiced") {
                globalStates.setShowAnimation(true)
            }
            localStorage.setItem("selectedTab", tabId);
            localStorage.setItem("theme", theme);
            document.body.className = `theme-${theme}`;
            navigate(path);
        }
        setDisableToggle(false);
    };



    return (
        <>
            <section className={scroll ? "header scrolled" : "header"}>
                {shouldShowDisclaimer && (
                    <div className="disclaimer">
                        <p>
                            Disclaimer for UK residents. This web application is provided as a tool for users to interact with the Pineapple Protocol ...
                            <a onClick={handleShowDisclaimer}>Read More</a>
                        </p>
                    </div>
                )}

                <Navbar expanded={expand} expand="md" className="bg-body-tertiary">
                    <Container fluid>
                        <Navbar.Brand onClick={handleButtonClick} className="desktop-logo mob-logos">
                            {window.location.pathname == "/swap" && <img className="web-logo-pine" role={window.location.pathname != "/swap" ? "button" : ""} src={require("../assets/images/logo.svg").default} alt="img" />}
                            {window.location.pathname == "/juiced" && <img className="juiced-web-logo" role={window.location.pathname != "/swap" ? "button" : ""} src={require("../assets/images/juiced-logo.svg").default} alt="img" />}
                            <img className="mobile-pinepple" role={window.location.pathname != "/swap" ? "button" : ""} src={require("../assets/images/mobile-pinapple.svg").default} alt="img" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpand(!expand)} />
                        <div className="under-mobile-view-menus">
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link
                                        onClick={() => {
                                            if (window.location.pathname !== "/swap") {
                                                localStorage.setItem("theme", "light");
                                                document.body.className = "theme-light"
                                                navigate("/swap");
                                                setExpand(false);
                                                handleTabChange("radio-1", "/swap", "light")
                                            }
                                        }} >Swap</Nav.Link>
                                    <Nav.Link >About</Nav.Link>
                                    <Nav.Link >Stake $PAPPLE</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </div>
                        <div className="customer-top-header">
                            <div className="mobile-connect-btn">
                                <Nav className="header-top-right">
                                    {localStorage.getItem("Token") ?
                                        <div className="notification-top">
                                            <div className="dropdown" >
                                                <Button variant="success" onClick={(e) => {
                                                    if (notificationList?.unReadCount > 0) {
                                                        unReadCount()
                                                        globalStates.setShowNotification(!globalStates.showNotification)
                                                    }
                                                    else {
                                                        globalStates.setShowNotification(!globalStates.showNotification)
                                                    }
                                                }}>

                                                    <img src={require("../assets/images/notification-icon.svg").default} alt="img" />
                                                    <img className="yellow-notification" src={require("../assets/images/yello-notification-icon.svg").default} alt="img" />

                                                    {notificationList?.unReadCount > 0 ? <p>{notificationList?.unReadCount}</p> : ""}
                                                </Button>
                                                <div className={globalStates.showNotification ? "dropdown-menu show" : "dropdown-menu"}>
                                                    <Notification />
                                                </div>
                                            </div>
                                        </div> : ""}
                                    <a><img src={require("../assets/images/head-eth.png")} alt="img" /><p>Ethereum</p> <i class="fa-solid fa-angle-down"></i></a>

                                    {walletAddress ? (
                                        <Button type="button" variant="unset" onClick={handleDisconnect}>
                                            <img src={require("../assets/images/profile.png")} alt="img" />
                                            {formatWalletAddress(walletAddress)}
                                        </Button>
                                    ) : (
                                        <Button type="button" variant="unset" onClick={connectWallet}>
                                            Connect Wallet
                                        </Button>
                                    )}
                                </Nav>
                            </div>
                            <div className="under-display-mobile">
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav " className="row">
                                    <Col sm={5} xl={4}>
                                        <div className="headee-section-top-left">
                                            {location.pathname == "/swap" ?
                                                <Navbar.Brand onClick={handleButtonClick} className="desktop-logo ">
                                                    <img role={window.location.pathname != "/swap" ? "button" : ""} src={require("../assets/images/logo.svg").default} alt="img" />
                                                </Navbar.Brand> :
                                                <Navbar.Brand onClick={handleButtonClick} className="desktop-logo ">
                                                    {window.location.pathname == "/swap" && <img role={window.location.pathname != "/swap" ? "button" : ""} src={require("../assets/images/logo.svg").default} alt="img" />}
                                                    {window.location.pathname == "/juiced" && <img className="juiced-web-logo" role={window.location.pathname != "/swap" ? "button" : ""} src={require("../assets/images/juiced-logo.svg").default} alt="img" />}
                                                </Navbar.Brand>}
                                            <Nav className="header-top-left">
                                                <div className="header-top-links">
                                                    <Nav.Link onClick={() => {
                                                        if (window.location.pathname !== "/swap") {
                                                            localStorage.setItem("theme", "light");
                                                            document.body.className = "theme-light"
                                                            localStorage.setItem("hasShownAnimationRef", false)
                                                            navigate("/swap");
                                                        }
                                                    }}>Swap</Nav.Link>
                                                    <Nav.Link >About</Nav.Link>
                                                    <Nav.Link >Stake $PAPPLE</Nav.Link>
                                                </div>
                                            </Nav>
                                        </div>
                                    </Col>
                                    <Col sm={3} xl={4}>
                                        <div className="under-tabs-anime">
                                            <Nav className="swap-options">
                                                <ul>
                                                    <li
                                                        onClick={() => {
                                                            if (window.location.pathname !== "/swap") {
                                                                localStorage.setItem("theme", "light");
                                                                document.body.className = "theme-light"
                                                                localStorage.setItem("hasShownAnimationRef", false)
                                                                localStorage.setItem("key", "swap");
                                                                navigate("/swap");

                                                            }
                                                        }}
                                                        className={`${isCurrentPath ? "active" : ""} ${window.location.pathname === "/swap" ? "disabled-header" : ""}`}
                                                    >
                                                        Fresh
                                                    </li>
                                                    <li
                                                        onClick={(e) => {
                                                            if (window.location.pathname !== "/juiced") {
                                                                globalStates.setShowAnimation(true)
                                                                localStorage.setItem("theme", "dark")
                                                                document.body.className = "theme-dark"
                                                                navigate("/juiced")

                                                            }
                                                        }
                                                        }
                                                        className={`${isJuicedPath ? "juiced-bg" : "juiced"} ${isJuicedPath ? "disabled-header" : ""}`}
                                                    >
                                                        Juiced
                                                    </li>
                                                    <span class="glider"></span>
                                                </ul>
                                            </Nav>

                                            <div className="tabs-main">
                                                <input disabled={disableToggle} type="radio" id="radio-1" name="tabs" onClick={() => {
                                                    setDisableToggle(true)
                                                    handleTabChange("radio-1", "/swap", "light")
                                                    localStorage.setItem("key", "swap");
                                                }} />
                                                <label
                                                    className={`${window.location.pathname == "/swap" ? "active" : "tab"}`}
                                                    htmlFor="radio-1"
                                                >
                                                    Fresh
                                                </label>

                                                <input disabled={disableToggle} type="radio" id="radio-2" name="tabs" onClick={() => {
                                                    setDisableToggle(true)
                                                    setTimeout(() => {
                                                        handleTabChange("radio-2", "/juiced", "dark");
                                                    }, 1000)
                                                }
                                                } />
                                                <label
                                                    className={`${window.location.pathname == "/juiced" ? "juiced-bg" : "tab"}`}
                                                    htmlFor="radio-2"
                                                >
                                                    Juiced
                                                </label>

                                                <span className="glider"></span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={4} xl={4}>
                                        <Nav className="header-top-right">
                                            {localStorage.getItem("Token") ?
                                                <div className="notification-top">
                                                    <div className="dropdown" >
                                                        <Button variant="success" onClick={(e) => {
                                                            if (notificationList?.unReadCount > 0) {
                                                                unReadCount()
                                                                globalStates.setShowNotification(!globalStates.showNotification)
                                                            }
                                                            else {
                                                                globalStates.setShowNotification(!globalStates.showNotification)
                                                            }
                                                        }}>

                                                            <img src={require("../assets/images/notification-icon.svg").default} alt="img" />
                                                            <img className="yellow-notification" src={require("../assets/images/yello-notification-icon.svg").default} alt="img" />

                                                            {notificationList?.unReadCount > 0 ? <p>{notificationList?.unReadCount}</p> : ""}
                                                        </Button>
                                                        <div className={globalStates.showNotification ? "dropdown-menu show" : "dropdown-menu"}>
                                                            <Notification />
                                                        </div>
                                                    </div>
                                                </div>
                                                : ""}
                                            <a><img src={require("../assets/images/head-eth.png")} alt="img" /><p>Ethereum </p></a>
                                            {walletAddress ? (
                                                <Button type="button" variant="unset" onClick={handleDisconnect}>
                                                    <img src={require("../assets/images/profile.png")} alt="img" />
                                                    {formatWalletAddress(walletAddress)}
                                                </Button>
                                            ) : (
                                                <Button type="button" variant="unset" onClick={connectWallet}>
                                                    Connect Wallet
                                                </Button>
                                            )}
                                        </Nav>
                                    </Col>
                                </Navbar.Collapse>
                            </div>
                        </div>

                    </Container>
                </Navbar>
                <div className="mobile-swap">
                    <Nav className="swap-options">
                        <ul>
                            <li
                                onClick={() => {
                                    if (window.location.pathname !== "/swap") {
                                        localStorage.setItem("theme", "light");
                                        localStorage.setItem("key", "swap");
                                        document.body.className = "theme-light"
                                        localStorage.setItem("hasShownAnimationRef", false)
                                        navigate("/swap");
                                    }
                                }}
                                className={`${isCurrentPath ? "active" : ""} ${window.location.pathname === "/swap" ? "disabled-header" : ""}`}
                            >Fresh</li>
                            <li
                                onClick={(e) => {
                                    if (window.location.pathname == "/juiced") {
                                        return ;
                                    }
                                    else {
                                        // alert("Coming Soon")
                                        globalStates.setShowAnimation(true)
                                        localStorage.setItem("theme", "dark")
                                        document.body.className = "theme-dark"
                                        navigate("/juiced")
                                    }
                                }
                                }
                                className={`${isJuicedPath ? "juiced-bg mob-juiced-bg" : "juiced"} ${isJuicedPath ? "disabled-header" : ""}`}

                            >Juiced</li>
                        </ul>
                    </Nav>
                </div>
            </section>

            {/* mobile-meu */}
            {/* <div className="mobile-view-bottom-menu">
                <ul>
                    <li className={localStorage.getItem("key") != "slice_insights" ? "active" : ""}> <Nav.Link onClick={() => {
                        if (window.location.pathname !== "/swap") {
                            localStorage.setItem("theme", "light");
                            document.body.className = "theme-light"
                            navigate("/swap");
                        }
                    }}>Swap</Nav.Link></li>
                    <li><Nav.Link >About</Nav.Link></li>
                    <li> <Nav.Link >Stake $PAPPLE</Nav.Link></li>
                </ul>
            </div> */}

            {/* disclaimer-modal */}
            <Modal show={showDisclaimer} onHide={handleCloseDisclaimer} centered className="choose-token-popup disclaimer-popup">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h5>Disclaimer for UK residents</h5>
                    <div className="disclaimer-content">
                        This web application is provided as a tool for users to interact with the Pineapple Protocol on their own initiative, with no endorsement or recommendation of cryptocurrency trading activities. In doing so, Pineapple is not recommending that users or potential users engage in cryptoasset trading activity, and users or potential users of the web application should not regard this webpage or its contents as involving any form of recommendation, invitation or inducement to deal in cryptoassets.
                    </div>
                    <Button variant="unset" onClick={handleCloseDisclaimer}>
                        Dismiss
                    </Button>
                </Modal.Body>

            </Modal>
        </>
    )
};
export default Header;