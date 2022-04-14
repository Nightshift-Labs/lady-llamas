module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos"],
  },
  env: {
    MINT_CONTRACT_ADDRESS: process.env.MINT_CONTRACT_ADDRESS,
    PROVIDER_PRIMARY: process.env.PROVIDER_PRIMARY,
    PROVIDER_SECONDARY: process.env.PROVIDER_SECONDARY,
    OPENSEA_LINK: process.env.OPENSEA_LINK,
  },
};
