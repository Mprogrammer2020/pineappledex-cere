import React, { useEffect } from 'react';

const AddToken = ({setMetaMaskModal, metaMaskModal, selectedToken2 }) => {
  const addTokenToMetaMask = async () => {
    const tokenAddress = selectedToken2?.address ; // Replace with your token's address
    const tokenSymbol = selectedToken2?.symbol; // Replace with your token's symbol
    const tokenDecimals = selectedToken2?.decimals; // Replace with your token's decimals
    const tokenImage = selectedToken2?.logoURI; // Replace with your token's image URL

    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Token added!');
      } else {
        console.log('Token not added.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() =>{
        addTokenToMetaMask()
  },[metaMaskModal])

  return (
    <div>
      {/* <button onClick={addTokenToMetaMask}>Add Token to MetaMask</button> */}
    </div>
  );
};

export default AddToken;