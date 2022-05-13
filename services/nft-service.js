import { create } from "apisauce";

const nftAPI = create({
  baseURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NFT_API_KEY}/getNFTs/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getOwnerNfts = async (address) => {
  // return [
  //   {
  //     id: {
  //       tokenId: "187",
  //     },
  //     tokenUri: {
  //       raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/187",
  //     },
  //   },
  // ];

  const response = await nftAPI.get(`?owner=${address}`);
  if (response.ok) {
    const ownedNfts = response.data.ownedNfts;

    if (ownedNfts) {
      return ownedNfts.filter(
        (n) => n.contract.address === process.env.LAZY_LLAMA_CONTRACT_ADDRESS
      );
    }
  } else {
    return [];
  }
};
