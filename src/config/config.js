import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
export const baseUrl = "https://staging-api.pineappledex.com"  /* staging */
// export const baseUrl ="https://test-api.pineappledex.com" // test
// export const baseUrl = "http://192.168.1.77:3000" // local
// export const baseUrl ="https://api.pineappledex.com"  // production
export const web3authClientId = "BM3eS4IOgOsegcA96wwSu09whiVftpOaK3uTYr14sA7o2ehEeS96x1SSmSJBFJ34po3q8vmJGBgbL-Cy68ImX2w" //MAINNET staging






export const config = {
    apiUrl: baseUrl + "/api/v1",
    // imageUrl: baseUrl + '/',
  }

  export const MATIC_PROVIDER ="https://polygon-mainnet.g.alchemy.com/v2/fSEm67dNMKyaax7RNGU03kYZwoMqsFNo"
  export const ETH_PROVIDER ="https://eth-mainnet.g.alchemy.com/v2/fSEm67dNMKyaax7RNGU03kYZwoMqsFNo"
  export const ETHERSCAN_URL = `https://etherscan.io/tx`;
  export const CONTRACT_ADDRESS ="0x111111125421ca6dc452d289314280a0f8842a65";
   export const FEE_CONTRACT_ADDRESS ="0x0bac03Af533E3db80BD7115a871ddBEA4EC5e858";

  export const options = [
    { value: "30s", label: "30 seconds" },
    { value: "1m", label: "1 minute" },
    { value: "10m", label: "10 minutes" },
];
// export const pineappleMetamaskUrl = "https://metamask.app.link/dapp/test.pineappledex.com/swap" //test
// export const pineappleMetamaskUrl = "https://metamask.app.link/dapp/pineappledex.com/swap" // production
export const pineappleMetamaskUrl = "https://metamask.app.link/dapp/staging.pineappledex.com/swap" // staging

export const socialIcons = [
  { key: 'bitbucket', imgSrc: require("../assets/images/bitbucket.svg").default, tooltip: 'Bitbucket' },
  { key: 'discord', imgSrc: require("../assets/images/discord.svg").default, tooltip: 'Discord' },
  { key: 'email', imgSrc: require("../assets/images/email.svg").default, tooltip: 'Email' },
  { key: 'facebook', imgSrc: require("../assets/images/facebook.svg").default, tooltip: 'Facebook' },
  { key: 'github', imgSrc: require("../assets/images/github.svg").default, tooltip: 'GitHub' },
  { key: 'instagram', imgSrc: require("../assets/images/instagram.svg").default, tooltip: 'Instagram' },
  { key: 'linkedin', imgSrc: require("../assets/images/linkdin.svg").default, tooltip: 'LinkedIn' },
  { key: 'medium', imgSrc: require("../assets/images/medium.svg").default, tooltip: 'Medium' },
  { key: 'reddit', imgSrc: require("../assets/images/reddit.svg").default, tooltip: 'Reddit' },
  { key: 'telegram', imgSrc: require("../assets/images/telegram.svg").default, tooltip: 'Telegram' },
  { key: 'tiktok', imgSrc: require("../assets/images/tiktok.svg").default, tooltip: 'TikTok' },
  { key: 'twitter', imgSrc: require("../assets/images/X.svg").default, tooltip: 'Twitter' },
  { key: 'website', imgSrc: require("../assets/images/website.svg").default, tooltip: 'Website' },
  { key: 'youtube', imgSrc: require("../assets/images/youtube.svg").default, tooltip: 'YouTube' },
];
  export const KeyDown = [" ", "`", "~", "!", "@", "#", "$", "^", "&", "*", "(", ")", "_", "-", "=", "+", "{", "}", "[", "]", "'", "|", ";", ":", '"', "?", "/", ",", "<", ">", "\\", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

  export const numberToLocaleString = (amount) => {
    // console.log("amount",amount);
    return Number(amount).toLocaleString('fullwide', { useGrouping: false })
}




export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

export const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});


export const web3auth = new Web3Auth({
  clientId:web3authClientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  uiConfig: {
    appName: "PineAppleDex",
    appUrl:'https://staging.pineappledex.com/swap'
  }
});