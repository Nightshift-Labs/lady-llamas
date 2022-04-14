import { useEffect, useState } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { ethers } from "ethers";

import LadyLlamas from "../artifacts/contracts/LadyLlamas.json";

export default function useMintContract() {
  const [mintContract, setMintContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  const getMintContract = async () => {
    const { ethereum } = window;

    if (ethereum) {
      console.log("Using metamask provider...");

      const web3 = new ethers.providers.Web3Provider(ethereum);

      const mintContract = new ethers.Contract(
        LadyLlamas,
        process.env.MINT_CONTRACT_ADDRESS
      );

      setMintContract(mintContract);
      setWeb3(web3);
    } else {
      console.log("Using alchemy provider...");

      const web3 = createAlchemyWeb3(process.env.PROVIDER);

      const mintContract = new web3.eth.Contract(
        LadyLlamas,
        process.env.MINT_CONTRACT_ADDRESS
      );

      setMintContract(mintContract);
      setWeb3(web3);
    }
  };

  useEffect(() => {
    getMintContract();
  }, []);

  return { mintContract, web3 };
}
