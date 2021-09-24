const PRODUCTION_HOSTNAME = "smyra-google-autocomplete.herokuapp.com";

export const getServer = () => {
  switch (window.location.hostname) {
    case PRODUCTION_HOSTNAME:
      return `https://${PRODUCTION_HOSTNAME}`;
    default:
      return "http://localhost:8081";
  }
};

export default { getServer };
