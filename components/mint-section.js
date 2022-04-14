import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import useMintContract from "../hooks/useMintContract";

const MintSection = () => {
  const { mintContract, web3 } = useMintContract();
  const { account, active, chainId } = useWeb3React();

  useEffect(() => {
    const init = async () => {
      initContractValues();
    };
    init();
  }, [mintContract, chainId]);

  useEffect(() => {
    const init = async () => {};

    init();
  }, [account]);

  //functions
  const initContractValues = async () => {
    try {
      if (mintContract && active) {
        console.log(mintContract);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getPrice = () => {};

  // mint view
  return (
    <>
      <section>MINT</section>
    </>
  );
};

export default MintSection;
