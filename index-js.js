import { createWalletClient,custom, createPublicClient,parseEther,defineChain, formatEther } from "https://esm.sh/viem";
import { contractAddress, abi } from "./constants-js.js";

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const ethAmountInput = document.getElementById('ethAmount');
const balanceButton = document.getElementById('balanceButton');
const withdrawButton = document.getElementById('withdrawButton');


connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw
let walletClient // a varibale that connect us to the bc wallet
let publicClient


async function connect() {
  console.log('hi')
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })
    await walletClient.requestAddresses()
    connectButton.innerHTML = 'Connected..!';
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function fund(){
    const ethAmount = ethAmountInput.value;
    console.log("ethAmount is : ",ethAmount);
    let connectedAccount;
    if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })
    const accounts = await walletClient.requestAddresses();
    connectedAccount = accounts[0]
    } 
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const chain = await getCurrentChain(walletClient);
    const {request } =  await publicClient.simulateContract({
      address : contractAddress,
      abi,
      functionName : 'fund',
      account : connectedAccount,
      chain,
      value : parseEther(ethAmount),
    })
   const hash = await walletClient.writeContract(request);
   console.log(hash);
    
}



async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "ZkSync sepolia",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.ankr.com/zksync_era_sepolia"],
      },
    },
  })
  return currentChain
}

async function getBalance() {
   if (typeof window.ethereum !== "undefined") {
      publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    } 

    const balanceInWei = await publicClient.getBalance({
      address : contractAddress
    })

    console.log(formatEther(balanceInWei))
    
}

async function withdraw() {
    let connectedAccount;
    if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    })
    const accounts = await walletClient.requestAddresses();
    connectedAccount = accounts[0]
    } 
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
    const chain = await getCurrentChain(walletClient);
    const {request } =  await publicClient.simulateContract({
      address : contractAddress,
      abi,
      functionName : 'withdraw',
      account : connectedAccount,
      chain,
      value : parseEther(0),
    })
   const hash = await walletClient.writeContract(request);
   console.log(hash);
}