import axios from "axios";
import { config } from "../config/config";

export const pineappleDexService = {
    walletlogin,
    tokenList,
    getSleepageList,
    dollorPriceList,
    ApproveToken,
    ToptokenList,
    QuotesList,
    DeleteCategory,
    changePassword,
    getAllowance,
    swapToken,
    saveSwapToken,
    priceExchange,
    updateSleepage,
    getUserInfo,
    getpoolDetail,
    getpoolPriceLiQuidity,
    getdextscore,
    getTokenInfo,
    contactUs,
    signOut,
    rejectSwap,
    getProgressBar,
    createLimitOrderData,
    saveLimitOrder,
    getOpenLimitOrder,
    getNotificationList,
    unreadCountdata,
    getNewToken,
    saveNewToken

}

const headers = () => {
    let token = localStorage.getItem("Token");
    let headersConfig = {};
    
    if (token) {
        headersConfig['Authorization'] = `${token}`;
    }
    
    return { headers: headersConfig };
};

const headersss = {
    'accept': 'application/json',
    'x-api-key': 'HWpnRi6oIp2ZEmRwBFope5TDQMwtjcSa6YcZoJvD'
};

async function priceExchange(tokens) {
    return await axios.get(`${config.apiUrl}/price-exchange/${tokens}?currency=USD`)
}

async function walletlogin(params) {
    return await axios.post(`${config.apiUrl}/login-by-wallet`,params)
}
    
    async function updateSleepage(params) {
    return await axios.put(`${config.apiUrl}/user/update-info`,params,headers())
}

async function getUserInfo() {
    return await axios.get(`${config.apiUrl}/user/my-info`, headers())
}




async function tokenList() {
    return await axios.get(`${config.apiUrl}/tokens`, headers())
}



async function getAllowance(params) {
    return await axios.get(`${config.apiUrl}/approve-allowance?tokenAddress=${params.tokenAddress}&walletAddress=${params.walletAddress}`, headers())
}

async function swapToken(params) {
    return await axios.get(`${config.apiUrl}/token-swap?src=${params?.src}&dst=${params.dst}&amount=${params.amount}&from=${params.from}&origin=${params.origin}&slippage=${params.slippage}`, headers())
}



async function saveSwapToken(params) {
    return await axios.post(`${config.apiUrl}/save-transaction`,params, headers())
}

async function rejectSwap(params) {
    return await axios.post(`${config.apiUrl}/reject-transaction`,params, headers())
}
async function createLimitOrderData(params) {
    return await axios.post(`${config.apiUrl}/create-limit-order`,params, headers())
}

async function saveLimitOrder(params) {
    return await axios.post(`${config.apiUrl}/save-limit-order`,params, headers())
}

async function unreadCountdata(params) {
    return await axios.put(`${config.apiUrl}/read-notifications`,params, headers())
}

async function getOpenLimitOrder() {
    return await axios.get(`${config.apiUrl}/active-limit-order`, headers())
}

async function getNotificationList() {
    return await axios.get(`${config.apiUrl}/notification`, headers())
}


async function ToptokenList() {
    return await axios.get(`${config.apiUrl}/top-tokens`, headers())
}

async function getSleepageList(params) {
    return await axios.get(`${config.apiUrl}/user/slippage?ip=${params.ip}&amount=${params.amount}`,headers())
}

async function ApproveToken(params) {
    return await axios.get(`${config.apiUrl}/approve-token?tokenAddress=${params.tokenAddress}`, headers())
}

async function dollorPriceList(params) {
    return await axios.get(`https://public-api.dextools.io/trial/v2/token/ether/${params.tokenAddress}/price=${params.amount}`, { headersss }
)
}

async function QuotesList(params) {
    return await axios.get(`${config.apiUrl}/quote?src=${params.src}&dst=${params.dst}&amount=${params.amount}&includeGas=${params.includeGas}&includeProtocols=${params.includeProtocols}`, headers())

    // return await axios.get(`${config.apiUrl}/quote?src=${params.src}&dst=${params.dst}&amount=${params.amount}&gasPrice=${params.gasPrice}`, headers())
}

async function userStatus(params) {
    return await axios.put(`${config.apiUrl}/user/${params.userId}/disable/`,params,headers())
}

async function changePassword(data) {
    return await axios.post(`${config.apiUrl}/change-password/`, data, headers())
}

async function DeleteCategory(id) {
    return await axios.delete(`${config.apiUrl}/category/` + id, headers())
}

async function getpoolDetail(params) {
    return await axios.get(`${config.apiUrl}/pool-detail/${params.tokenAddress}`, headers()
)
}

async function getpoolPriceLiQuidity(params) {
    return await axios.get(`${config.apiUrl}/pool/price-liquidity/${params.tokenAddress}`, headers())
}
async function getdextscore(params) {
    return await axios.get(`${config.apiUrl}/pool/dext-score/${params.tokenAddress}`, headers())

}

async function getTokenInfo(params) {
    return await axios.get(`${config.apiUrl}/token/info/${params.tokenAddress}`, headers())
}

async function getProgressBar(params) {
    return await axios.get(`${config.apiUrl}/price-feed/${params.tokenAddress}/${params.token2}/${params.token1}`, headers())

    // http://192.168.2.182:3000/api/v1/price-feed/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
}


// async function getPool(params) {
//     return await axios.get(`${config.apiUrl}/pool/dext-score/${params.pool}`, headers())
//     https://interface.gateway.uniswap.org/v2/quickroute?tokenInChainId=1&tokenInAddress=ETH&tokenOutChainId=1&tokenOutAddress=0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599&amount=1000000000000000000&tradeType=EXACT_IN

// }


async function contactUs(params){
    return await axios.post(`${config.apiUrl}/contact-feed/save`,params)
}

async function signOut(data) {
    return await axios.post(`${config.apiUrl}/logout/`, data, headers())
}


async function saveNewToken(params){
    return await axios.post(`${config.apiUrl}/tokens`,params)
}
async function getNewToken(params){
    return await axios.get(`${config.apiUrl}/token/${params.tokenAddress}`,params)
}





