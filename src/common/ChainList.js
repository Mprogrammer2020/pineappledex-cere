import { useContext, useEffect, useState } from "react";
import { Form, Modal, Container, Row, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageLoader from "./ImageLoader";
import swal from 'sweetalert';
import { pineappleDexService } from "../service/api.service";
import { formatWalletAddress, useWeb3 } from "../config/Web3Context";
import { GlobalStates } from "../globalStates.js/GlobalStates";
import { GlobalContext } from "../globalStates.js/GlobalContext";

const ChainList = ({ showTokens, setShowTokens, setSelectedToken, tokenList, topTokenList, prevSelectedToken, setPrevSelectedToken, clearState, name, key, handleTokenChange }) => {
    key = localStorage.getItem("key")
    const { web3 } = useWeb3();
    // const handleTokenChange = (token) => {
    //     setSelectedToken(token);
    //     // localStorage.setItem(name, JSON.stringify(token));
    //     setShowTokens(false);
    //     // if (prevSelectedToken?.address?.toLowerCase() == token?.address?.toLowerCase() && key == "limit") {
    //     //     setPrevSelectedToken(token);
    //     //     return;
    //     // }
    //     // if (prevSelectedToken?.address?.toLowerCase() == token?.address?.toLowerCase()) {
    //     //     setPrevSelectedToken({});
    //     //     return;
    //     // }
    // };
    /* handle search */
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTokens, setFilteredTokens] = useState(tokenList);
    useEffect(() => {
        setSearchTerm("");
    }, [showTokens])
    const globalStates = useContext(GlobalContext);

    const handleSearch = async (e) => {
        const term = e.target.value.toLowerCase();
        const value = term.replace(/^\s+/g, '');
        setSearchTerm(value);
        let filtered = tokenList.filter(token =>
            token.symbol.toLowerCase().includes(term) ||
            token.name.toLowerCase().includes(term) ||
            token.address.toLowerCase().includes(term)
        );
        const exactMatches = filtered.filter(token => token.symbol.toLowerCase() === term);
        const otherMatches = filtered.filter(token => token.symbol.toLowerCase() !== term);
        filtered = [...exactMatches, ...otherMatches];

        setNewToken()
        if (filtered?.length == 0 && isValidAddress(value)) {
            await getNewTokenData(value)
        }
        setFilteredTokens(filtered);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

    const renderTooltip = (message) => (
        <Tooltip id="tooltip">
            {message}
        </Tooltip>
    );
    function isValidAddress(address) {
        return web3.utils.isAddress(address);
    }
    const [newToken, setNewToken] = useState();
    const [newTokenShimmer, setNewTokenShimmer] = useState(true)
    const [isAccepted, setIsAccepted] = useState(false);


    async function getNewTokenData(data) {
        const params = {
            tokenAddress: data
        }
        try {
            const response = await pineappleDexService.getNewToken(params);
            if (response?.status === 200) {
                console.log("getNewTokenData response", response?.data)
                setNewToken(response?.data)
                setNewTokenShimmer(true)
            }
        } catch (error) {
            console.log("error", error)
            setNewTokenShimmer(false)
        } finally {
            setNewTokenShimmer(false)
        }
    }

    const [showImportdata, setShowImportdata] = useState(false);
    async function importToken(data) {
        const params = {
            address: searchTerm,
            symbol: data.symbol,
            decimals: data.decimals,
            name: data.name,
            logoURI: data?.logo || "",
            eip2612: true
        }
        try {
            const response = await pineappleDexService.saveNewToken(params);
            if (response?.status === 201) {
                console.log("getNewTokenData response", response?.data?.token)
                setShowTokens(false)
                setSelectedToken(response?.data?.token)
                setShowImportdata(false)
                globalStates.setImportNewToken(true)
                setNewToken()
            }
        } catch (error) {
            console.log("error", error)
            swal("Error", error?.response?.data?.message, "error").then(() => {
                // window.location.reload();
            });
            setNewTokenShimmer(false)
        } finally {
            setNewTokenShimmer(false)
        }
    }
    const [copyAddress, setCopyAddress] = useState(false);

    const handleCopy = (walletAddress) => {
        navigator.clipboard.writeText(walletAddress).then(() => {
            setCopyAddress(true)
            setTimeout(() => setCopyAddress(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const tooltip = (
        <Tooltip id="tooltip">
            This token is currently disabled by the admin.
        </Tooltip>
    );
    return (
        <>
            <Modal show={showTokens} onHide={() => { setShowTokens(false); setNewToken(); setShowImportdata(false) }} centered className="choose-token-popup">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <div className="choose-token-content">
                        <div className="choose-token-top-area">
                            <Form>
                                <Form.Group className="mb-2 search-area">
                                    <img src={require("../assets/images/search.svg").default} alt="img" />
                                    <Form.Control type="text" placeholder="Search name or paste contract" name="search" value={searchTerm} onChange={handleSearch} />
                                </Form.Group>
                            </Form>
                            <ul>
                                <OverlayTrigger placement="top" overlay={
                                    <Tooltip id="tooltip">Coming soon!</Tooltip>
                                    } >
                                    <li className="disable-text">
                                        <div className="token-alphabet">P</div> PINEAPPLE
                                    </li>
                                </OverlayTrigger>
                                {topTokenList?.map((token, index) => {
                                    const toptoken = token.tokenDetails;
                                    return (
                                        <>
                                            <li onClick={() => handleTokenChange(toptoken, name)}>
                                                {toptoken?.logoURI ?
                                                    <ImageLoader imageSrc={toptoken?.logoURI ? toptoken?.logoURI : require("../assets/images/doller.svg").default} alt={"img"} /> :
                                                    <div className="token-alphabet"

                                                    >
                                                        {toptoken.name?.charAt(0)?.toUpperCase()}
                                                    </div>} {toptoken?.symbol}
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>

                        </div>

                        <div className="token-options-area">
                            <div className="token-options-area-outer">
                                {searchTerm ? (
                                    filteredTokens.length > 0 ? (
                                        filteredTokens.map((token, index) => (
                                            <div key={index} className="token-options-inner"
                                                onClick={() => {
                                                    handleTokenChange(token, name);
                                                    globalStates.setManageAimation(true)
                                                    //  setTimeout(() =>
                                                    //      globalStates.setManageAimation(true)
                                                    //  , );
                                                }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    {token?.logoURI ?
                                                        <ImageLoader className="me-2" imageSrc={token?.logoURI ? token?.logoURI : require("../assets/images/doller.svg").default} alt={"img"} /> :
                                                        <div className="token-alphabet"

                                                        >
                                                            {token.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                        </div>}

                                                    <h6> {truncateText(token.symbol, 15)}</h6>
                                                </div>
                                                <p>{truncateText(token.name, 15)}</p>
                                            </div>
                                        ))
                                    ) : newToken ? (
                                        <>
                                            <div className="token-import-box">
                                                <div className="d-flex align-items-center">
                                                    {/* <img
                                                        className="me-2"
                                                        src={newToken?.tokenDetails?.logoURI || newToken?.tokenDetails?.name?.charAt(0)}
                                                        alt="img"
                                                    /> */}
                                                    <div className="me-2" style={{ position: 'relative', width: '40px', height: '40px' }}>
                                                        {newToken?.
                                                            tokenDetails
                                                            ?.logo ? (
                                                            <img
                                                                src={newToken.tokenDetails.logo}
                                                                alt="Token Logo"
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                            />
                                                        ) : (
                                                            <div className="token-alphabet"
                                                            >
                                                                {newToken?.tokenDetails?.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="token-import-box-right">
                                                        <h6>{truncateText(newToken.tokenDetails.name, 15)}</h6>

                                                        <p>{truncateText(newToken.tokenDetails.symbol, 15)}
                                                            <span onClick={(e) => handleCopy(searchTerm)}> {formatWalletAddress(searchTerm)} <img src={require("../assets/images/wallet-copy.svg").default} alt="img" /></span>
                                                            {copyAddress && <h6 style={{ fontSize: '12px', textAlign: 'center', color: 'green', color: "#23ff23", fontWeight: "500", lineHeight: "3px" }}>Copied!</h6>}
                                                        </p>

                                                    </div>

                                                </div>


                                                {!showImportdata ? (
                                                    <>
                                                        {newToken.tokenDetails?.status !== "DISABLE" ?

                                                            <button
                                                                className="import-button"
                                                                onClick={() => setShowImportdata(true)}
                                                            >
                                                                Import
                                                            </button>
                                                            :
                                                            <>
                                                                <div className="exclamation-mark">
                                                                    <OverlayTrigger placement="top" overlay={tooltip}>
                                                                        <Button bsStyle="default"> <i class="fa-solid fa-triangle-exclamation"></i></Button>
                                                                    </OverlayTrigger>
                                                                </div>


                                                            </>
                                                        }
                                                    </>

                                                )
                                                    : (
                                                        <div className="tokem-name-right">
                                                            <p>Etherscan  <a href={`https://etherscan.io/token/${searchTerm}`} target="_blank"> <img src={require("../assets/images/choose-token-share.svg").default} alt={"img"} /></a></p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            {showImportdata && <div className="leading-token-area-outer">
                                                <div className="leading-token-area">
                                                    <p>This token isn't traded on leading U.S. centaralized exchanges or frequently swapped on  Pineapple DEX. Always conduct your own research before trading.</p>
                                                    <div className="leading-token-area-field">
                                                        <p>{`https://etherscan.io/token/${searchTerm}`}</p>
                                                        <a href={`https://etherscan.io/token/${searchTerm}`} target="_blank">  <img src={require("../assets/images/choose-token-share.svg").default} alt={"img"} /></a>
                                                    </div>
                                                    <Button type="button" variant="unset" onClick={() => importToken(newToken.tokenDetails)}>I Understand</Button>
                                                </div>
                                            </div>}
                                        </>
                                    ) : (
                                        <div className="no-data-area">
                                            <img src={require("../assets/images/no-data.gif")} alt="img" />
                                            <p>No Token found.</p>
                                        </div>
                                    )

                                ) : tokenList.length > 0 ? (
                                    tokenList.map((token, index) => (
                                        <div key={index} className="token-options-inner" onClick={() => {
                                            handleTokenChange(token, name);
                                            globalStates.setManageAimation(true)
                                            //     setTimeout(() =>
                                            //     globalStates.setManageAimation(true)
                                            // , 4000000);
                                        }}>
                                            <div className="d-flex align-items-center">
                                                {token?.logoURI ?
                                                    <ImageLoader className="me-2" imageSrc={token?.logoURI ? token?.logoURI : require("../assets/images/doller.svg").default} alt={"img"} /> :
                                                    <div

                                                    >
                                                        {token.name?.charAt(0)?.toUpperCase() || 'N/A'}
                                                    </div>}
                                                <h6>{truncateText(token.symbol, 15)}</h6>

                                            </div>
                                            <OverlayTrigger placement="top" overlay={renderTooltip(token.name)}>
                                                <p>{truncateText(token.name, 15)}</p>
                                            </OverlayTrigger>
                                        </div>
                                    ))
                                ) :
                                    (
                                        <div className="no-data-area">
                                            <img src={require("../assets/images/no-data.gif")} alt="img" />
                                            <p>No Token found.</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
};
export default ChainList;