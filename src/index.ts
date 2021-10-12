import {ethers} from "ethers"
import * as base64 from "base-64"
import unfetch from "isomorphic-unfetch"

const fetch = globalThis.fetch || unfetch
type NFTResponse = {
  metadata: object,
  // If the image is an ipfs image, we'll wrap it in an http-ipfs proxy and return
  // the original url in ipfsImage
  image: string,
  ipfsImage?: string
}

function proxyIPFS(ipfsAddr: string) {
  if (ipfsAddr.includes("://")) {
    ipfsAddr = ipfsAddr.split("://")[1];
  }
  return "https://ipfs.io/" + ipfsAddr;
}
// ProviderConfig is an object with api keys detailed at https://docs.ethers.io/v5/api-keys/
export default async function fetchNFT(
  contractAddress: string,
  tokenId: number,
  optionalProviderNetwork = "homestead",
  optionalProviderConfig: {
    etherscan: string | undefined;
    infura: string | undefined;
    alchemy: string | undefined;
  } | undefined
) : Promise<NFTResponse> {
  // @ts-ignore
  const provider = globalThis.ethereum
    ? // @ts-ignore
      new ethers.providers.Web3Provider(globalThis.ethereum)
    : ethers.getDefaultProvider(
        optionalProviderNetwork,
        optionalProviderConfig
      );
  // Since we're just reading we only care about the one function in the abi
  const ABI = [
    // Some details about the token
    "function tokenURI(uint256) view returns (string)",
  ];
  console.log("Load", provider)
  const contract = new ethers.Contract(contractAddress, ABI, provider);
  const resp = await contract.tokenURI(tokenId);
  let metadata;
  console.log(resp)
  if (resp.includes("data:application/json;base64")) {
    // Check for base64 encoded json
    const jsonBase64 = resp.split(",")[1];
    metadata = JSON.parse(base64.decode(jsonBase64));
  } else if (resp.indexOf("http") == 0) {
    // Fetch the json from the http url
    console.log(resp)
    metadata = await fetch(resp).then((r: Response) => r.json());
  } else if (resp.indexOf("ipfs") == 0) {
    metadata = await fetch(proxyIPFS(resp)).then((r: Response) => r.json());
  }
  if (metadata.image.includes(";base64")) {
    // Grab the base64 encoded image and decode it
    const imgBase64 = metadata.image.split(",")[1];
    const image = base64.decode(imgBase64);
    return { metadata, image };
  } else if (metadata.image.includes("ipfs://")) {
    return {
      metadata,
      image: proxyIPFS(metadata.image),
      ipfsImage: metadata.image,
    };
  } else {
    return { metadata, image: metadata.image };
  }
};
