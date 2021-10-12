# nft-fetch

Easily fetch any ERC-721 token info

## Install

```
npm install --save nft-fetch
```

## Usage

```
const fetchNFT = require('nft-fetch')
fetchNFT("0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405", 8258).then(info => {
    console.log("NFT Info for a great looking nft", info)
})
```