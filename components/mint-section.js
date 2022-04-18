import { useEffect, useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import ReactCompareImage from "react-compare-image";
import { FaSpinner } from "react-icons/fa";

import useMintContract from "../hooks/useMintContract";
import { getOwnerNfts } from "../services/nft-service";
import { WalletModalContext } from "../layout/page";

//mock values
const mock = {
  address: "0xc06Ff3aC0C1f3CE73966cD8Bf8AF867559992CFc",
  day1Timestamp: moment().subtract(10, "minutes").unix(),
  day2Timestamp: moment().subtract(5, "minutes").unix(),
  day3Timestamp: moment().subtract(10, "minutes").unix(),
  maxPerWallet: 1,
};

console.log(mock);

const MintSection = () => {
  const { mintContract, web3 } = useMintContract();
  const { account, active, chainId } = useWeb3React();
  const { isOpen, setIsOpen } = useContext(WalletModalContext);

  const [lazyLlamasNfts, setLazyLlamasNfts] = useState([]);
  const [numOfLazyLlamasOwned, setNumOfLazyLlamasOwned] = useState(0);
  const [minterMaximumCapacity, setMinterMaximumCapacity] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [price, setPrice] = useState(0);
  const [maxPerWallet, setMaxPerWallet] = useState(0);
  const [eligible, setEligible] = useState(false);
  const [mintCount, setMintCount] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const [day1Timestamp, setDay1Timestamp] = useState();
  const [day2Timestamp, setDay2Timestamp] = useState();
  const [day3Timestamp, setDay3Timestamp] = useState();
  const [isDay1, setIsDay1] = useState(false);
  const [isDay2, setIsDay2] = useState(false);
  const [isDay3, setIsDay3] = useState(false);

  useEffect(() => {
    const init = async () => {
      initContractValues();
    };
    init();
  }, [mintContract, chainId, account]);

  //functions
  const initContractValues = async () => {
    try {
      setLoading(true);
      if (mintContract && active && account) {
        console.log(mintContract);
        const minterMaximumCapacity = await mintContract.methods
          .minterMaximumCapacity()
          .call();

        const totalSupply = await mintContract.methods.totalSupply().call();

        console.log("minterMaximumCapacity", minterMaximumCapacity);
        setMinterMaximumCapacity(minterMaximumCapacity);

        console.log("totalSupply", totalSupply);
        setTotalSupply(totalSupply);

        day1Timestamp = mock.day1Timestamp;
        day2Timestamp = mock.day2Timestamp;
        day3Timestamp = mock.day3Timestamp;

        setDay1Timestamp(day1Timestamp);
        setDay2Timestamp(day2Timestamp);
        setDay3Timestamp(day3Timestamp);

        console.log("getting nfts...");
        const now = moment().unix();
        const lazyLlamasNfts = await getOwnerNfts(mock.address);
        const numOfLazyLlamasOwned = lazyLlamasNfts.length;
        setLazyLlamasNfts(lazyLlamasNfts);
        setNumOfLazyLlamasOwned(numOfLazyLlamasOwned);

        if (now >= day3Timestamp) {
          /**
           * Wednesday April 27th
            • - 1 or 2 LBL In Wallet:0.2 ETH mint. (1 max per wallet)
           */

          setIsDay3(true);
          const maxPerWallet = 1;
          setMaxPerWallet(maxPerWallet);

          if (numOfLazyLlamasOwned >= 1) {
            const minterFeesOnePlusDayThree = await mintContract.methods
              .minterFeesOnePlusDayThree()
              .call();
            setPrice(minterFeesOnePlusDayThree.toString());
            setEligible(true);
          } else {
            setEligible(false);
          }
        } else if (now >= day2Timestamp) {
          /**
           * Tuesday April 26th
            • - Whitelist Mint: 0.15 ETH mint. (1 max per wallet)
           */

          setIsDay2(true);
          const maxPerWallet = 1;
          setMaxPerWallet(maxPerWallet);

          const myWhitelistStatus = await mintContract.methods
            .myWhitelistStatus(account)
            .call();

          if (myWhitelistStatus) {
            const minterFeesThreePlusOrWL = await mintContract.methods
              .minterFeesThreePlusOrWL()
              .call();

            setPrice(minterFeesThreePlusOrWL);
            setEligible(true);
          } else {
            setEligible(false);
          }
        } else if (now >= day1Timestamp) {
          /**
           * Monday April 25th
            • - 5+ llamas @ 0.1 ETH per mint. Can mint according to how many multiples of 5.
            • - 3 or 4 LBL = 0.15 ETH mint. (1 max per wallet)
          */

          setIsDay1(true);

          if (numOfLazyLlamasOwned >= 5) {
            const maxPerWallet = Math.floor(numOfLazyLlamasOwned / 5);
            setMaxPerWallet(maxPerWallet);

            const minterFeesFivePlus = await mintContract.methods
              .minterFeesFivePlus()
              .call();

            setPrice(minterFeesFivePlus);
            setEligible(true);
          } else if (numOfLazyLlamasOwned === 3 || numOfLazyLlamasOwned === 4) {
            const maxPerWallet = 1;
            setMaxPerWallet(maxPerWallet);

            const minterFeesThreePlusOrWL = await mintContract.methods
              .minterFeesThreePlusOrWL()
              .call();

            setPrice(minterFeesThreePlusOrWL);
            setEligible(true);
          } else {
            setEligible(false);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getDay = () => {
    if (isDay3) {
      return "Day 3";
    } else if (isDay2) {
      return "Day 2";
    } else if (isDay1) {
      return "Day 1";
    } else {
      return "Day 0";
    }
  };

  const getPrice = () => {
    const formattedPrice = web3?.utils.fromWei(price.toString());
    return Number(formattedPrice).toFixed(3);
  };

  const updateMintCount = (val) => {
    if (mintCount + val <= 0) return;
    if (mintCount + val > maxPerWallet) return;

    setMintCount(mintCount + val);
  };

  const onMint = async () => {
    try {
      console.log("mint");
      if (isDay3) {
      } else if (isDay2) {
      } else if (isDay1) {
      } else {
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const onRefresh = async () => {
    refreshMinted();
  };

  const refreshMinted = async () => {
    setRefresh(true);
    try {
      const totalSupply = await mintContract.methods.totalSupply().call();
      setTotalSupply(totalSupply);
      setTimeout(() => {
        setRefresh(false);
      }, 500);
    } catch (e) {
      setTimeout(() => {
        setRefresh(false);
      }, 500);
    }
  };

  const isSoldOut = () => {
    return Number(totalSupply) === Number(minterMaximumCapacity);
  };

  // control
  const MintTracker = () => {
    return (
      <>
        <p>
          {totalSupply}/{minterMaximumCapacity}
        </p>
        <p>MINTED</p>
        <div>
          {refresh ? (
            <div>
              <p>
                <FaSpinner />
              </p>
            </div>
          ) : (
            <button onClick={() => onRefresh()}>Refresh</button>
          )}
        </div>
      </>
    );
  };

  const MintButton = () => {
    return (
      <>
        <p>{getDay()}</p>
        <p>Price: {getPrice()}</p>
        <p>Max Per Wallet: {maxPerWallet}</p>
        <input type="button" onClick={() => updateMintCount(-1)} value="-" />
        <input type="text" value={mintCount} readOnly />
        <input type="button" onClick={() => updateMintCount(1)} value="+" />
        <button onClick={() => onMint()}>MINT</button>
      </>
    );
  };

  const ConnectWalletButton = () => {
    return <h1>CONNECT WALLET BUTTON</h1>;
  };

  // mint view
  return (
    <>
      <section>
        <h1>MINT YOUR LADY LLAMA</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis
          egestas ex. Aliquam erat volutpat. Phasellus luctus, sapien et ornare
          efficitur, est lorem varius purus, in congue orci nisi nec dolor.
        </p>
        <ReactCompareImage
          leftImage="/lady-llama-left.jpg"
          rightImage="/lady-llama-right.jpg"
        />
        {loading && <h1>Loading...</h1>}
        {!loading && isSoldOut() && <h1>SOLD OUT</h1>}
        {!loading && !isSoldOut() && (
          <>
            {eligible ? (
              <>
                <MintTracker />
                {active ? <MintButton /> : <ConnectWalletButton />}
              </>
            ) : (
              <>
                {" "}
                <h1>Sorry you are not eligible</h1>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default MintSection;
