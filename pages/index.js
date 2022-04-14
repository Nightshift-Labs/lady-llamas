import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";

const Home = () => {
  const { library, chainId, account, activate, deactivate, active } =
    useWeb3React();
  return (
    <div>
      <h1>Lady Llamas</h1>
    </div>
  );
};

export default Home;
