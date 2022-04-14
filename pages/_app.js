import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

import Page from "../layout/page";

import "../styles/globals.css";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Page>{page}</Page>);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {getLayout(<Component {...pageProps} />)}
    </Web3ReactProvider>
  );
}

export default MyApp;
