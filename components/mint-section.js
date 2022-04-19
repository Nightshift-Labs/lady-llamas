import dynamic from "next/dynamic";
import { useEffect, useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import ReactCompareImage from "react-compare-image";
import { FaSpinner } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Image from "next/image";

import useMintContract from "../hooks/useMintContract";
import { getOwnerNfts } from "../services/nft-service";
import { WalletModalContext } from "../layout/page";

const TransactionModal = dynamic(() =>
  import("../components/transaction-modal")
);

//mock values
const mock = {
  address: "0xc06Ff3aC0C1f3CE73966cD8Bf8AF867559992CFc",
  day1Timestamp: moment().subtract(5, "minutes").unix(),
  day2Timestamp: moment().subtract(5, "minutes").unix(),
  day3Timestamp: moment().subtract(5, "minutes").unix(),
};

console.log(mock);

const MintSection = () => {
  const { mintContract, web3 } = useMintContract();
  const { account, active, chainId } = useWeb3React();
  const { setIsOpen } = useContext(WalletModalContext);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(0);
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
  const [mintActive, setMintActive] = useState(false);
  const [dailyMintPriceText, setDailyMintPriceText] = useState("");

  const [day1Timestamp, setDay1Timestamp] = useState();
  const [day2Timestamp, setDay2Timestamp] = useState();
  const [day3Timestamp, setDay3Timestamp] = useState();
  const [isDay1, setIsDay1] = useState(false);
  const [isDay2, setIsDay2] = useState(false);
  const [isDay3, setIsDay3] = useState(false);

  const mintPriceText = {
    day1: "DAY 1: Llama Holders (3+)",
    day2: "DAY 2: Whitelist Sale ",
    day3: "DAY 3: Llama Holders (1-2)",
  };

  useEffect(() => {
    const init = async () => {
      initContractValues();
    };
    init();
  }, [mintContract, chainId, account]);

  // functions
  const initContractValues = async () => {
    try {
      setLoading(true);
      if (mintContract && active && account) {
        console.log(mintContract);
        const minterMaximumCapacity = await mintContract.methods
          .minterMaximumCapacity()
          .call();

        const totalSupply = await mintContract.methods.totalSupply().call();

        setMinterMaximumCapacity(minterMaximumCapacity);
        setTotalSupply(totalSupply);

        day1Timestamp = mock.day1Timestamp;
        day2Timestamp = mock.day2Timestamp;
        day3Timestamp = mock.day3Timestamp;

        console.log("getting nfts...");
        const now = moment().unix();
        const lazyLlamasNfts = await getOwnerNfts(mock.address);
        const numOfLazyLlamasOwned = lazyLlamasNfts.length;
        setLazyLlamasNfts(lazyLlamasNfts);
        setNumOfLazyLlamasOwned(numOfLazyLlamasOwned);

        if (now >= day3Timestamp) {
          await setDay3State(numOfLazyLlamasOwned);
        } else if (now >= day2Timestamp) {
          await setDay2State();
        } else if (now >= day1Timestamp) {
          await setDay1State(numOfLazyLlamasOwned);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setDay1State = async (numOfLazyLlamasOwned) => {
    /**
       * Monday April 25th
        • - 5+ llamas @ 0.1 ETH per mint. Can mint according to how many multiples of 5.
        • - 3 or 4 LBL = 0.15 ETH mint. (1 max per wallet)
      */

    setIsDay1(true);
    setMintActive(true);
    setDailyMintPriceText(mintPriceText.day1);

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
  };

  const setDay2State = async () => {
    /**
     * Tuesday April 26th
      • - Whitelist Mint: 0.15 ETH mint. (1 max per wallet)
      */

    setIsDay2(true);
    setMintActive(true);
    setDailyMintPriceText(mintPriceText.day2);

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
  };

  const setDay3State = async (numOfLazyLlamasOwned) => {
    /**
     * Wednesday April 27th
      • - 1 or 2 LBL In Wallet:0.2 ETH mint. (1 max per wallet)
      */
    setIsDay3(true);
    setMintActive(true);
    setDailyMintPriceText(mintPriceText.day3);

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

  const getTokenIdsFromNFTList = () => {
    if (lazyLlamasNfts.length === 0) return [];

    try {
      return lazyLlamasNfts.map((nft) =>
        Number(
          nft.tokenUri.raw.substring(
            nft.tokenUri.raw.lastIndexOf("/") + 1,
            nft.tokenUri.raw.length
          )
        )
      );
    } catch (e) {
      return [];
    }
  };

  const onMint = async () => {
    let tx = {
      from: account,
      data: "",
      to: mintContract._address,
      value: price * mintCount,
    };

    const tokenIds = getTokenIdsFromNFTList();

    try {
      if (isDay3) {
        /**
         * Wednesday April 27th
          • - 1 or 2 LBL In Wallet:0.2 ETH mint. (1 max per wallet)
        */
        tx.data = mintContract.methods.publicMintOneToOne(tokenIds).encodeABI();
      } else if (isDay2) {
        /**
         * Tuesday April 26th
          • - Whitelist Mint: 0.15 ETH mint. (1 max per wallet)
        */
        tx.data = mintContract.methods.whitelistMint().encodeABI();
      } else if (isDay1) {
        /**
         * Monday April 25th
          • - 5+ llamas @ 0.1 ETH per mint. Can mint according to how many multiples of 5.
          • - 3 or 4 LBL = 0.15 ETH mint. (1 max per wallet)
        */
        if (numOfLazyLlamasOwned === 3 || numOfLazyLlamasOwned === 4) {
          tx.data = mintContract.methods
            .publicMintThreeToOne(tokenIds)
            .encodeABI();
        } else if (numOfLazyLlamasOwned >= 5) {
          tx.data = mintContract.methods
            .publicMintFiveToOne(tokenIds)
            .encodeABI();
        }
      }

      console.log(tx);
      // await web3.eth
      //   .sendTransaction(tx)
      //   .once("transactionHash", () => {
      //     setTransactionStatus(TRANSACTION_STATUS.IN_PROGRESS);
      //   })
      //   .once("confirmation", (_confirmationNumber, receipt) => {
      //     if (receipt && receipt.status === true) {
      //       setTransactionStatus(TRANSACTION_STATUS.SUCCESS);
      //       refreshMinted();
      //     }
      //     setTimeout(() => {
      //       setIsOpen(false);
      //       setTransactionStatus(0);
      //     }, 2000);
      //   })
      //   .once("error", () => {
      //     setTransactionStatus(TRANSACTION_STATUS.FAILED);
      //     setTimeout(() => {
      //       setIsOpen(false);
      //       setTransactionStatus(0);
      //     }, 2000);
      //   });
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

  const walletIsConnected = () => {
    return !loading && active;
  };

  const walletIsNotConnected = () => {
    return !loading && !active;
  };

  const closeTransactionModal = () => {
    setIsTransactionModalOpen(false);
  };

  // control
  const MintTracker = () => {
    if (!mintActive) {
      return;
    }

    if (!isSoldOut()) {
      return (
        <>
          <div className="flex flex-row">
            <div>
              <p className="font-black text-5xl mr-7 mb-1">
                {totalSupply}/{minterMaximumCapacity}
              </p>
              <p className="text-lightPurple">MINTED</p>
            </div>
            <div className="mt-6">
              {refresh ? (
                <div>
                  <p>
                    <FaSpinner />
                  </p>
                </div>
              ) : (
                <button className="underline" onClick={() => onRefresh()}>
                  Refresh
                </button>
              )}
            </div>
          </div>
        </>
      );
    } else {
      return <h1>Sold out.</h1>;
    }
  };

  const MintButton = () => {
    if (!mintActive) return;

    if (isSoldOut()) return;

    if (!eligible) return <h1>Not eligible.</h1>;

    return (
      <>
        <div className="flex flex-row mt-7">
          <div className="flex flex-row justify-items-stretch border-2 border-white rounded-full mr-8 items center">
            <input
              className="text-center w-4/12 cursor-pointer"
              type="button"
              onClick={() => updateMintCount(-1)}
              value="-"
            />
            <input
              className="bg-transparent text-center w-4/12 border-x-2 border-white"
              type="text"
              value={mintCount}
              readOnly
            />
            <input
              className="text-center w-4/12 cursor-pointer"
              type="button"
              onClick={() => updateMintCount(1)}
              value="+"
            />
          </div>
          <button
            className="px-20 py-3 font-bold bg-white text-xl text-[#3F4A99] rounded-full"
            onClick={() => onMint()}
          >
            Mint
          </button>
        </div>
      </>
    );
  };

  const ConnectWalletButton = () => {
    return (
      <button
        className="mt-7 py-2 px-6 border-2 border-white rounded-full font-bold text-lg"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <span>Connect Wallet</span>
      </button>
    );
  };

  const DragHandle = () => {
    return (
      <div style={{ color: "white" }}>
        <FaChevronLeft />
        <p style={{ fontSize: 25, fontWeight: "bold" }}>DRAG</p>
        <FaChevronRight />
      </div>
    );
  };

  // mint view
  return (
    <>
      <section>
        <div className="grid lg:grid-cols-2">
          <div className="min-h-fit w-full">
            <ReactCompareImage
              leftImage="/lady-llama-left.jpg"
              rightImage="/lady-llama-right.jpg"
              handle={<DragHandle />}
            />
          </div>
          <div className="flex flex-col self-center py-12 px-12 max-w-2xl">
            <h1 className="font-sans font-black text-7xl leading-7 text-lightPurple">
              <span className="outline-title"> MINT YOUR </span>LADY
              <Image
                className=""
                src="/images/Lady-LLamas.gif"
                alt="Lady-LLamas"
                width="70"
                height="79"
              />
              LLAMA
            </h1>
            <div className="my-5 h-2 w-full bg-gradient-to-r from-lightPurple"></div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              quis egestas ex. Aliquam erat volutpat. Phasellus luctus, sapien
              et ornare efficitur, est lorem varius purus, in congue orci nisi
              nec dolor.
            </p>
            <div className="mt-8">
              {active && mintActive && (
                <>
                  <div className="flex flex-row items-center mb-10">
                    <p className="mr-4">{dailyMintPriceText}</p>
                    <p className="font-serif bg-[#353C7C] rounded-sm py-2 px-4">
                      MINT Price: {getPrice()} ETH
                    </p>
                  </div>
                </>
              )}
              {loading && <h1>Loading...</h1>}
              {walletIsNotConnected() && (
                <>
                  <MintTracker />
                  <ConnectWalletButton />
                </>
              )}
              {walletIsConnected() && (
                <>
                  <MintTracker />
                  <MintButton />
                  {!mintActive && <h1>Mint is not active.</h1>}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <TransactionModal
        isOpen={isTransactionModalOpen}
        closeModal={closeTransactionModal}
        transactionStatus={transactionStatus}
      />
    </>
  );
};

export default MintSection;
