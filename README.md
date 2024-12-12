# PineappleDEX React.js

## Overview
PineappleDEX is a decentralized exchange front-end built with React.js. This project integrates several features for seamless trading, including charting, notifications, and wallet connectivity.

## Features
- **Decentralized Trading**: Integrated with the 1inch Limit Order SDK for decentralized trading.
- **Real-time Charts**: Visualization using Chart.js, ECharts, and Highcharts.
- **Wallet Integration**: Web3 wallet connections via Web3Auth.
- **Notifications**: Push notifications through Firebase.
- **Responsive UI**: Built with React Bootstrap for a user-friendly experience.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v14 or later)
- **npm** (v7 or later)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Mprogrammer2020/pineappledex-cere.git
   cd pineappledex-cere
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Scripts
- **Start the development server:**
  ```bash
  npm start
  ```
- **Build the production app:**
  ```bash
  npm run build
  ```
- **Run tests:**
  ```bash
  npm test
  ```
- **Eject the app:** (Caution: This action is irreversible!)
  ```bash
  npm run eject
  ```

## Configuration
### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Configure the Firebase Messaging service and obtain your credentials.
3. Replace the Firebase configuration in your codebase with your credentials.

### Web3Auth
1. Set up Web3Auth by following their [documentation](https://web3auth.io/docs/).
2. Configure the Web3Auth adapters (`base`, `default-evm-adapter`, and `metamask-adapter`) with your app credentials.

## Dependencies
The project leverages the following major dependencies:
- **React**: Frontend framework.
- **1inch Limit Order SDK**: For decentralized limit order trading.
- **Chart.js, ECharts, Highcharts**: For advanced data visualization.
- **Firebase**: For push notifications.
- **Web3.js**: For blockchain interactions.
- **React Bootstrap**: For UI components.

Check the `package.json` file for the full list of dependencies.

## Development Notes
- Use `react-app-rewired` for customization without ejecting.
- Sourcemaps are disabled in production builds for improved performance and security.

## Browsers Support
- Production: Modern browsers with >0.2% market share.
- Development: Latest versions of Chrome, Firefox, and Safari.

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Submit a pull request for review.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
Special thanks to all contributors and the open-source libraries that made this project possible.