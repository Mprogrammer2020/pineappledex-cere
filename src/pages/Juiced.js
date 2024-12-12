import { Accordion, Button, Col, Container, Dropdown, Form, Modal, Row, Tab, Tabs } from "react-bootstrap";
import Swap from "./Swap";
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Footer from "../common/Footer";
import AboutUs from "../common/AboutUs";
import MeltAnimation from "../common/MeltAnimation";
import { GlobalContext } from "../globalStates.js/GlobalContext";
const Juiced = () => {


    /* usdt */

    const defaultLimitTokenData = {
        "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "symbol": "USDT",
        "_id": "6686a22ecd46b12347d7b8a1",
        "decimals": 6,
        "name": "Tether USD",
        "logoURI": "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
        "eip2612": false,
        "tags": [
            "tokens",
            "PEG:USD"
        ]
    };

    /* usdc */

    const defaultTokenData2 = {
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "symbol": "USDC",
        "decimals": 6,
        "name": "USD Coin",
        "logoURI": "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
        "eip2612": false,
        "_id": "6686a22ecd46b12347d7b85b",
        "tags": [
            "tokens",
            "PEG:USD"
        ]
    };

    /* weth */
    const defaultTokenData = {
        "address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "symbol": "WETH",
        "decimals": 18,
        "name": "Wrapped Ether",
        "logoURI": "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
        "eip2612": false,
        "tags": ['PEG:ETH', 'tokens']
    };


    const globalStates = useContext(GlobalContext);

    const location = useLocation();
    const key = useState(localStorage.getItem("key"))
    const [selectedToken1, setSelectedToken1] = useState(defaultLimitTokenData);
    const [selectedToken2, setSelectedToken2] = useState(defaultTokenData2);
    const [loading, setLoading] = useState(true);
    const [showSliceInsights, setShowSliceInsights] = useState(localStorage.getItem("showSliceInsights") == "true" ? true : false);
    const hasShownAnimationRef = useRef(false);

    const [locationdata, setLocationdata] = useState("")

    useEffect(() => {
        makeAPICall()
    }, [])

    useEffect(() => {
            hasShownAnimationRef.current = true;
            localStorage.setItem("hasShownAnimationRef", true)
    //         const timer = setTimeout(() => {
    //             globalStates.setShowAnimation(false);
    //         }, 1500);
    //         return () => clearTimeout(timer);
    }, [globalStates?.showAnimation]);

    useEffect(() => {
        if (key == "limit") {
            setSelectedToken1(localStorage.getItem("key") == "limit" ? defaultLimitTokenData : defaultTokenData);
            setSelectedToken2(localStorage.getItem("key") == "limit" ? defaultTokenData2 : {});
        }
    }, [key, selectedToken1?.symbol, selectedToken2?.symbol])


    useEffect(() => {
        if (window?.location.pathname == "/juiced") {
            localStorage.setItem("theme", "dark");
            document.body.className = "theme-dark"
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (location.pathname == "/swap") {
            localStorage.setItem("theme", "light");
            document.body.className = "theme-light"
        } else {
            localStorage.setItem("theme", "dark");
            document.body.className = "theme-dark"
        }
    }, [location.pathname]);

    function makeAPICall() {
        let userCountry = '';
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                fetch(`https://ipapi.co/${data?.ip}/json`)
                    .then(response => response.json())
                    .then(data => {
                        setLocationdata(data)
                    })
            })
            .catch(error => {
            });
    }

    const shouldShowDisclaimer = window.location.pathname == "/swap" &&
    locationdata?.region === "England" &&
    locationdata?.timezone === "Europe/London";

    const getTradingViewSymbol = (tokenSymbol) => {
        const tokenName = ["DINGERWETH_21A7AF", "YDFWETH_153F20", "NOIAWETH_B8A1A8", "CPOOLWETH_99920E", "BITGWETH_1C4D21", "FISWETH_6DA6C5", "BLOCKSWETH_DAC9B2", "YGGWETH_99B42F", "WHALEWETH_229B8D.USD", "STOSWETH_80D972", "UWUWETH_98C588.USD", "WALVWETH_BE1737 ", "NEARUSD", " HRDWETH_EEBBCE", "RSRWETH_32D925.USD", "PUNKWETH_33D1CF.USD", "HETHWETH_4F2CBF.USD", " WLITIWETH_5AC9EA", "NTXWETH_B3D994", "PIRATEWETH_03A81C", "BENDWETH_336EF4", "SIPHERWETH_F3FDCF", "EMAIDUSDC_355938.USD", "YGGWETH_99B42F.USD", "SIDUSWETH_8C07E1", "RVSTWETH_649082.USD", "OPULUSDC_A5F0CF", "PYUSDUSDC_D3F5C3.USD", "PADREWETH_3B8F9B", "BMDAWETH_43B82C", "VXVWETH_CBBC98.USD", "KETWETH_5A012D", "LOOTERWETH_FDA70E", "X7DAOWETH_75311E", "X7RWETH_613924", "CVXCRV_645C3A.USD", "SDAOWETH_424485.USD", "ETHPADWETH_04B6BE", "ZENTUSDT_135A41", "NEURALWETH_111295.USD", "OXWETH_AB72F4", "DOGWIFHATWETH_11C20A", "DOLAUSDC_845F28", "PUFETHWETH_BDB04E.USD", "RSWETHWETH_C41057.USD", "SAVMWETH_AD9EF1.USD", "USDAEURA_580EE6.USD", "FOXGIV_AD0E10.USD", " RSETHWETH_059615.USD", "EZETHWSTETH_1B9D58.USD", "SUSDEWSTETH_8609B6.USD", " OSETHUSDC_C2A679.USD", "TOKENWETH_C7E6B6", "METHWETH_047080.USD", "SAFEREUMWETH_3681A3", "GAINSWETH_D3719A", "UNIV2VOW_F848E9", "ARKMWETH_9CB91E.USD", "AEGWETH_419E84.USD", "WZNNWETH_DAC866.USD", "PLEBWETH_C3A03B", "AMPRETHWETH_D8ED2C.USD", "WOJAKWETH_4EC8BA", "SWETHWETH_30EA22.USD", "AETHIRWETH_976C6F", "AAVEBANKWETH_34A9E7.USD", "ZARPUSDC_17A155.USD", "SDAIWETH_422A29.USD", "THRYUSDC_5F558B", "AAVEUSDC_DCEAF5.USD", "BLURWETH_2BFDB9.USD", "DFIUSDT_9E251D", "FXSFRAX_E1573B", "DOGUSDT_3D6D0E", "AURAWETH_6C350E", "VDZWETH_661ECC", "COMPWETH_CFFDDE", "GHSTWETH_873D3C", "AAVEWETH_2ACEDA.USD", "AAVEWETH_DFC14D", "AAVEBANKWETH_34A9E7.USD", "GHSTWETH_873D3C"];
        const token = ["DINGER", "YDF", "NOIA", "CPOOL", "BTBS", "rETH_2", "BLOCKS", "YGG", "WHALE", "STOS", "uWu", "wALV", "Near", "HRD", "RSR", "PUNK", "HORD", "wLITI", "NTX", "NATION", "BEND", "SIPHER", " eMAID", "GUILD", "SIDUS", "RVST", "OPUL", "PYUSD", "PAD", "BMDA", "VXV", "RYOSHI", "LOOT", "X7DAO", "X7R", "cvxCRV", "SDAO", "ETHPAD", "ZENT", "NEURA", "OX", "DOGWIFHAT", "Staked Dola", "PufETH", "rswETH", "SAVM", " USDA", "genETH", " RSETH", "ezETH", "sUSDe", "osETH", "TOKEN", "METH", "SAFEREUM", "Gains", "8PAY v2 ", "ARKM", "aEthENS", "wZNN", "PLEB", "wBETH", "WOJAK", "SWETH", "aETHMKR", "aEthUNI", "ZARP", "sDAI", "PEEP$ ", "aEthCRV", "BLUR", "DFI_2", " SFRXETH", "XAUt=Tether Gold", " auraBAL", "VCASH", " CUSDCv3", "aETHGHO", "aEthPYUSD", "aETHLDO", "aETHSNX", "aETHBAL"]; let b = ["DINGERWETH_21A7AF", "YDFWETH_153F20", "NOIAWETH_B8A1A8", "CPOOLWETH_99920E", "BITGWETH_1C4D21", "FISWETH_6DA6C5", "BLOCKSWETH_DAC9B2", "YGGWETH_99B42F", "WHALEWETH_229B8D.USD", "STOSWETH_80D972", "UWUWETH_98C588.USD"];
        let inx = token.indexOf(tokenSymbol)
        if (inx > -1) {
            return tokenName[inx]
        } else {
            return `${tokenSymbol}/WETH`;
        }
    };
  

    return (
        <>
            <section className={`fresh-mode-outer mt-3 ${shouldShowDisclaimer ? 'disclaimer-top' : ''}`}   >
                <Container fluid>
                    <Row style={{
                        justifyContent: showSliceInsights ? 'center' : 'flex-start', 
                    }} >

                        {globalStates.showAnimation ?
                         <MeltAnimation />
                        :
                        <>
                        <Col className="mb-3" md={location.pathname === "/juiced" ? showSliceInsights ? 12 : 12 : 12} lg={location.pathname === "/juiced" && !showSliceInsights ? 4 : showSliceInsights && 12} xl={location.pathname === "/juiced" && !showSliceInsights ? 4 : showSliceInsights && 12} xxl={location.pathname === "/juiced" && !showSliceInsights ? 4 : showSliceInsights && 12}>
                            <Swap selectedToken1={selectedToken1} setSelectedToken1={setSelectedToken1} selectedToken2={selectedToken2} setSelectedToken2={setSelectedToken2} showSliceInsights={showSliceInsights} setShowSliceInsights={setShowSliceInsights} />
                        </Col>
                        </>
                        }
                    </Row>
                </Container>
            </section>
            <Footer showSliceInsights={showSliceInsights} />
            


        </>
    );
}

export default Juiced;
