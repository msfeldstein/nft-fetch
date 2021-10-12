const { expect } = require("chai");
const fetchNFT = require("../dist");
const dotenv = require("dotenv");
dotenv.config();

describe("fetchNFT", () => {
  it("should fetch base64 encoded uris with base64 encoded svg images", async () => {
    const MESSAGES_ADDR = "0xa4f6c450e515adfa8e4efa558d0d58087e7d59e3";
    // The last two arguments are unnecessary but you may run into rate limiting issues
    const { metadata, image } = await fetchNFT(MESSAGES_ADDR, 1, "homestead", {
      etherscan: process.env.ETHERSCAN_API_KEY,
    });
    expect(metadata).to.exist;
    expect(image).to.exist;
  });

  it("should fetch http metadata based nfts", async () => {
    // A really great foundation NFT currently up for sale ;)
    const FOUDNATION_ADDR = "0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405";
    const { metadata, image } = await fetchNFT(FOUDNATION_ADDR, 8258, "homestead", {
      etherscan: process.env.ETHERSCAN_API_KEY,
    });
    expect(metadata).to.exist;
    expect(image).to.exist;
  });

  it("should fetch ipfs metadata based nfts", async () => {
    const BAYC_ADDR = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
    const { metadata, image, ipfsImage } = await fetchNFT(BAYC_ADDR, 1, "homestead", {
      etherscan: process.env.ETHERSCAN_API_KEY,
    });
    expect(metadata).to.exist;
    // Should proxy the image
    expect(image).to.exist;
    // should return the original ipfs address too
    expect(ipfsImage).to.exist
  });


});
