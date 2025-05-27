import { createWalletClient,custom } from "https://esm.sh/viem"

const connectButton = document.getElementById('connectButton');

connectButton.onclick = connect;

let walletClient // a varibale that connect us to the bc wallet


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })
    await walletClient.requestAddresses()
    console.log("hi")
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}