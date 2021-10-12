import fetchNFT from "../src/index.ts";

const $ = (sel) => document.querySelector(sel)
$("#load").addEventListener('click', async function() {
    console.log("Load")
    const {metadata, image, ipfsImage} = await fetchNFT($("#contract-address").value, $("#token-id").value)
    if (ipfsImage) {
        alert("I don't have an ipfs proxy for this image so it probably wont work, set up a real proxy if you want to use this")
    }
    console.log(metadata, image)
    let mediaEl;
    if (image.includes("<svg")) {
        mediaEl = document.createElement('div')
        mediaEl.innerHTML = image
    } else if (image.includes(".mp4")) {
        mediaEl = document.createElement('video')
        mediaEl.src = image
    } else {
        mediaEl = document.createElement('img')
        mediaEl.src = image
    }
    mediaEl.crossOrigin = "Anonoymous"
    mediaEl.style.width = '500px'
    mediaEl.style.height = '500px'
    $("#container").appendChild(mediaEl)
    $("pre").textContent = JSON.stringify(metadata, null, 2)
})
