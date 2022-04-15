export const getProviderRandom = () => {
  const number = Math.floor(Math.random() * 2);
  if (number === 0) {
    return process.env.PROVIDER_PRIMARY;
  } else {
    return process.env.PROVIDER_SECONDARY;
  }
};
