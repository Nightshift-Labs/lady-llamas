import dynamic from "next/dynamic";
import { useEffect, useState, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import ReactCompareImage from "react-compare-image";
import { FaSpinner } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

import useMintContract from "../hooks/useMintContract";
import { getOwnerNfts } from "../services/nft-service";
import { WalletModalContext } from "../layout/page";
import { Discord, Twitter, OpenSea } from "./icons";
import { TRANSACTION_STATUS } from "../utils/constants";

const TransactionModal = dynamic(() =>
  import("../components/transaction-modal")
);

//mock values
const mock = {
  address: "0xc06Ff3aC0C1f3CE73966cD8Bf8AF867559992CFc",
  epochOne: [
    moment().subtract(5, "minutes").unix(),
    moment().subtract(5, "minutes").unix(),
  ],
  epochTwo: [
    moment().subtract(7, "minutes").unix(),
    moment().subtract(7, "minutes").unix(),
  ],
  epochThree: [
    moment().subtract(10, "minutes").unix(),
    moment().add(10, "minutes").unix(),
  ],
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

        // const epochOne = await mintContract.methods.epochOne().call();
        // const epochTwo = await mintContract.methods.epochTwo().call();
        // const epochThree = await mintContract.methods.epochThree().call();

        const epochOne = mock.epochOne;
        const epochTwo = mock.epochTwo;
        const epochThree = mock.epochThree;

        const now = moment().unix();
        console.log("getting nfts...");
        const numOfLazyLlamasOwned = await getUnclaimedLazyLlamaNfts();

        /**
         * // @notice will return epoch 1
            function epochOne() external view returns (uint, uint) {
              return (timeOneStart, timeTwoStart);
            }
          // @notice will return epoch 2
            function epochTwo() external view returns (uint, uint) {
              return (timeTwoStart, timeThreeStart);
            }
          // @notice will return epoch 3
            function epochThree() external view returns (uint, uint) {
              return (timeThreeStart, timeThreeEnd);
            }
         */

        if (now >= epochThree[0] && now <= epochThree[1]) {
          await setDay3State(numOfLazyLlamasOwned);
        } else if (now >= epochTwo[0] && now <= epochTwo[1]) {
          await setDay2State();
        } else if (now >= epochOne[0] && now <= epochOne[1]) {
          await setDay1State(numOfLazyLlamasOwned);
        } else if (now >= epochThree[1]) {
          //public mint?
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getUnclaimedLazyLlamaNfts = async () => {
    // const lazyLlamasNfts = await getOwnerNfts(address);
    const unclaimedLazyLlamaNfts = [];
    const lazyLlamasNfts = await getOwnerNfts(mock.address);

    for (let lazyLlamaNft of lazyLlamasNfts) {
      const tokenId = lazyLlamaNft?.id?.tokenId;
      const claimed = await mintContract.methods.isClaimed(tokenId).call();
      if (claimed) return;
      unclaimedLazyLlamaNfts.push(lazyLlamaNft);
    }

    console.log(unclaimedLazyLlamaNfts);
    const numOfLazyLlamasOwned = unclaimedLazyLlamaNfts.length;
    setLazyLlamasNfts(unclaimedLazyLlamaNfts);
    setNumOfLazyLlamasOwned(numOfLazyLlamasOwned);

    return numOfLazyLlamasOwned;
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

    if (true) {
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
    setIsTransactionModalOpen(true);

    let tx = {
      from: account,
      to: mintContract._address,
      value: price * mintCount,
    };

    const tokenIds = getTokenIdsFromNFTList();

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
      console.log("isDay1", numOfLazyLlamasOwned);
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

    onTrackTransaction(tx);
  };

  const onTrackTransaction = async (tx) => {
    try {
      await web3.eth
        .sendTransaction(tx)
        .once("transactionHash", () => {
          setTransactionStatus(TRANSACTION_STATUS.IN_PROGRESS);
        })
        .once("confirmation", (_confirmationNumber, receipt) => {
          if (receipt && receipt.status === true) {
            setTransactionStatus(TRANSACTION_STATUS.SUCCESS);
            refreshMinted();
          }
          setTimeout(() => {
            setIsTransactionModalOpen(false);
            setTransactionStatus(0);
          }, 2000);
        })
        .once("error", () => {
          setTransactionStatus(TRANSACTION_STATUS.FAILED);
          setTimeout(() => {
            setIsTransactionModalOpen(false);
            setTransactionStatus(0);
          }, 2000);
        });
    } catch (e) {
      console.error(e.message);
      setTransactionStatus(TRANSACTION_STATUS.FAILED);
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
        <div className="flex flex-row mt-7 sm:flex-col ">
          <div className="flex flex-row justify-items-stretch border-2 border-white rounded-full mr-8 items center sm:h-14 sm:mr-0 sm:mb-6">
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
            className="px-20 py-3 font-bold bg-white text-xl text-[#3F4A99] rounded-full hover:bg-hoverBlue hover:text-white"
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
        className="mt-7 py-2 px-6 border-2 border-white rounded-full font-bold text-lg hover:bg-hoverBlue hover:border-hoverBlue"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <span>Connect Wallet</span>
      </button>
    );
  };

  const DragHandle = () => {
    return (
      <div className="flex flex-row items-center">
        <FaChevronLeft />
        <p className="flex items-center pl-[10px] font-serif border-2 border-white rounded-full h-16 w-16">
          DRAG
        </p>
        <FaChevronRight />
      </div>
    );
  };

  // mint view
  return (
    <>
      <section className="lg:h-auto h-screen">
        <div className="w-full h-full bg-cover fixed bg-no-repeat bg-[url('/background-grad.svg')] -z-1 lg:hidden"></div>
        <div className="grid grid-cols-2 h-full lg:grid-cols-1">
          <div className="h-full w-full relative max-w-5xl ml-auto">
            <div className="w-full h-[120px] absolute bottom-0 left-0 z-[1] bg-gradient-to-t from-[#0F1140] xl:hidden 2xl:hidden lg:block"></div>
            <ReactCompareImage
              leftImage="/slide-left-min.png"
              rightImage="/slide-right-min.png"
              handle={<DragHandle />}
            />
          </div>
          <div className="flex flex-col justify-between z-[1] pt-12 px-12 md:px-[20px] lg:pb-12 sm:mt-[-100px] sm:z-[2]">
            <div></div>
            <div className="max-w-2xl">
              <div>
                <h1 className="font-sans font-black text-[5.5vw] xl:leading-[3.5vw] 2xl:text-8xl  2xl:leading-[4rem] text-lightPurple lg:text-[100px] lg:leading-[5rem] md:text-[85px] md:leading-[3rem] sm:text-8xl sm:leading-[75px] sm:max-w-sm">
                  <span className="outline-title"> MINT YOUR </span>LADY
                  <Image
                    src="/llama-switch.gif"
                    alt="Lady-LLamas"
                    width="70"
                    height="79"
                  />
                  LLAMA
                </h1>
              </div>
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
                      <p className="mr-4 md:mr-3 md:text-sm">
                        {dailyMintPriceText}
                      </p>
                      <p className="font-serif bg-[#353C7C] rounded-sm py-2 px-4 md:text-sm">
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
            <nav className="flex h-16 lg:hidden max-w-3xl pb-4">
              <div className="flex justify-between w-full">
                <div>
                  <Link href="/">
                    <a title=""></a>
                  </Link>
                </div>
                <ul className=" flex flex-row items-center space-x-8">
                  <li>
                    <a
                      className="flex flex-row text-lightPurple font-bold text-sm"
                      href={process.env.OPENSEA_LINK}
                      title="View on OpenSea"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenSea />
                      OPENSEA
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex flex-row text-lightPurple font-bold text-sm"
                      href=""
                      title="Follow Twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter />
                      TWITTER
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex flex-row text-lightPurple font-bold text-sm"
                      href=""
                      title="Join Discord"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Discord />
                      DISCORD
                    </a>
                  </li>
                  <li className="text-lightPurple font-bold text-sm">
                    <a
                      href=""
                      title="Contract"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                    CONTRACT
                  </li>
                </ul>
              </div>
            </nav>
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
