import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

const walletconnect = new WalletConnectConnector({
  rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const walletlink = new WalletLinkConnector({
  rpcUrl: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  appName: "web3-react-demo",
});

const chainNames = {
  coinbaseWallet: "coinbaseWallet",
  walletConnect: "walletConnect",
  injected: "injected",
};

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink,
  chainNames,
};
