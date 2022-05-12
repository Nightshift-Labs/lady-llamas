import { create } from "apisauce";

const nftAPI = create({
  baseURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.NFT_API_KEY}/getNFTs/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getOwnerNfts = async (address) => {
  return [
    {
      id: {
        tokenId: "138",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/138",
      },
    },
    {
      id: {
        tokenId: "139",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/139",
      },
    },
    {
      id: {
        tokenId: "140",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/140",
      },
    },
    {
      id: {
        tokenId: "141",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/141",
      },
    },
    {
      id: {
        tokenId: "142",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/142",
      },
    },
    {
      id: {
        tokenId: "143",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/143",
      },
    },
    {
      id: {
        tokenId: "144",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/144",
      },
    },
    {
      id: {
        tokenId: "145",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/145",
      },
    },
    {
      id: {
        tokenId: "146",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/146",
      },
    },
    {
      id: {
        tokenId: "147",
      },
      tokenUri: {
        raw: "https://ipfs.io/ipfs/QmRz7wSrq2efD1bUBazffxX63bnCUsCLEAfrUpmJ2oWyfd/147",
      },
    },
  ];

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
