// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { createChart } from 'lightweight-charts';

// const AboutUs = () => {
//   const [tradingData, setTradingData] = useState(null);
//   const [WETHprice, setWETHprice] = useState(null)

//   //get WETH<> USDT price and store it
//   const fetchMyQueryData = async () => {
//     try {
//       const response = await axios.post(
//         'https://graphql.bitquery.io',
//         {
//           query: `
//           query MyQuery {
//             ethereum(network: ethereum) {
//               dexTrades(
//                 quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}
//                 baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
//                 options: {limit: 1, desc: "block.height"}
//               ) {
//                 timeInterval {
//                   minute(count: 15, format: "%Y-%m-%dT%H:%M:%SZ")
//                 }
//                 buyCurrency: baseCurrency {
//                   symbol
//                   address
//                 }
//                 sellCurrency: quoteCurrency {
//                   symbol
//                   address
//                 }
//                 sellAmountInUsd: quoteAmount
//                 tradeAmount(in: USD)
//                 averageQuotePrice: quotePrice(calculate: average)
//                 block {
//                   height
//                 }
//               }
//             }
//           }
//           `
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-API-KEY': 'BQYVnzeje7iKUzYXMpeFU6Mg33ASX7rj'
//           }
//         }
//       );
    
//       setWETHprice(response.data?.data?.ethereum.dexTrades[0]?.averageQuotePrice);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   fetchMyQueryData();


//   useEffect(() => {

//     const fetchData = async () => {
//       try {
//         const response = await axios.post(
//           'https://graphql.bitquery.io',
//           {
//             query: `
//             {
//               ethereum(network: ethereum) {
//                 dexTrades(
//                   options: {asc: "timeInterval.minute"}
//                   date: {since: "2023-07-16T00:00:00.000Z", till: "2024-07-17T10:59:21.000"}
//                   baseCurrency: {is: "0x69e37422cb87d963367f73a119c8ce9a4d529b72"}
//                   quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
//                   tradeAmountUsd: {gt: 10}
//                   exchangeName: {is: "Uniswap"}
//                 ) {
//                   timeInterval {
//                     minute(count: 15, format: "%Y-%m-%dT%H:%M:%SZ")
//                   }
//                   volume: quoteAmount
//                   high: quotePrice(calculate: maximum)
//                   low: quotePrice(calculate: minimum)
//                   open: minimum(of: block, get: quote_price)
//                   close: maximum(of: block, get: quote_price)
//                 }
//               }
//             }
            
//             `
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'X-API-KEY': 'BQYVnzeje7iKUzYXMpeFU6Mg33ASX7rj'
//             }
//           }
//         );
//         setTradingData(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (tradingData && WETHprice) {
//       const data = tradingData.data.ethereum.dexTrades.map((trade) => {
//         const open = Number(trade.open) * WETHprice * 1000000; // scale up the number by 1,000,000
//         const high = Number(trade.high) * WETHprice * 1000000;
//         const low = Number(trade.low) * WETHprice * 1000000;
//         const close = Number(trade.close) * WETHprice * 1000000;
//         console.log(`open: ${open}, high: ${high}, low: ${low}, close: ${close}`);
//         return {
//           time: new Date(trade.timeInterval.minute).getTime() / 1000,
//           open,
//           high,
//           low,
//           close,
//           volume: Number(trade.volume),
//         };
//       });
//       const chart = createChart(document.getElementById('firstContainer'), { priceScale: 10 });
//       console.log('>>127 data',data)
     
  
//       const candlestickSeries = chart.addCandlestickSeries();
//       candlestickSeries.setData(data);
   
//     }
//   }, [tradingData, WETHprice]);
  

//   return (
//     <div>
//       {tradingData ? (
//         <div id="firstContainer" style={{ height: 600, width: '100%' }}></div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default AboutUs

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';

const AboutUs = () => {
  const [tradingData, setTradingData] = useState(null);
  const [WETHprice, setWETHprice] = useState(null);
  const chartContainerRef = useRef(null);

  // Fetch WETH<> USDT price and store it
  const fetchMyQueryData = async () => {
    try {
      const response = await axios.post(
        'https://graphql.bitquery.io',
        {
          query: `
          query MyQuery {
            ethereum(network: ethereum) {
              dexTrades(
                quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}
                baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
                options: {limit: 1, desc: "block.height"}
              ) {
                timeInterval {
                  minute(count: 15, format: "%Y-%m-%dT%H:%M:%SZ")
                }
                buyCurrency: baseCurrency {
                  symbol
                  address
                }
                sellCurrency: quoteCurrency {
                  symbol
                  address
                }
                sellAmountInUsd: quoteAmount
                tradeAmount(in: USD)
                averageQuotePrice: quotePrice(calculate: average)
                block {
                  height
                }
              }
            }
          }
          `
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'BQYVnzeje7iKUzYXMpeFU6Mg33ASX7rj'
          }
        }
      );

      setWETHprice(response.data?.data?.ethereum.dexTrades[0]?.averageQuotePrice);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyQueryData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://graphql.bitquery.io',
          {
            query: `
            {
              ethereum(network: ethereum) {
                dexTrades(
                  options: {asc: "timeInterval.minute"}
                  date: {since: "2023-07-16T00:00:00.000Z", till: "2024-07-17T10:59:21.000"}
                  baseCurrency: {is: "0x69e37422cb87d963367f73a119c8ce9a4d529b72"}
                  quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}
                  tradeAmountUsd: {gt: 10}
                  exchangeName: {is: "Uniswap"}
                ) {
                  timeInterval {
                    minute(count: 15, format: "%Y-%m-%dT%H:%M:%SZ")
                  }
                  volume: quoteAmount
                  high: quotePrice(calculate: maximum)
                  low: quotePrice(calculate: minimum)
                  open: minimum(of: block, get: quote_price)
                  close: maximum(of: block, get: quote_price)
                }
              }
            }
            `
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': 'BQYVnzeje7iKUzYXMpeFU6Mg33ASX7rj'
            }
          }
        );
        setTradingData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (tradingData && WETHprice && chartContainerRef.current) {
      const data = tradingData.data.ethereum.dexTrades.map((trade) => {
        const open = Number(trade.open) * WETHprice;
        const high = Number(trade.high) * WETHprice;
        const low = Number(trade.low) * WETHprice;
        const close = Number(trade.close) * WETHprice;

        return {
          time: new Date(trade.timeInterval.minute).getTime() / 1000,
          open,
          high,
          low,
          close,
          volume: Number(trade.volume),
        };
      });

      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 600,
      });

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(data);

      return () => {
        chart.remove();
      };
    }
  }, [tradingData, WETHprice]);

  return (
    <div>
      {tradingData ? (
        <div ref={chartContainerRef} style={{ height: 600, width: '100%' }}></div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AboutUs;


