import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
  http,
  WalletClient,
  PublicClient,
} from "viem";
import 'viem/window'
import { contractAddress, abi } from "./constants-ts.ts";

const connectButton = document.getElementById('connectButton') as HTMLButtonElement;
const fundButton = document.getElementById('fundButton') as HTMLButtonElement;
const ethAmountInput = document.getElementById('ethAmount') as HTMLInputElement;
const balanceButton = document.getElementById('balanceButton') as HTMLButtonElement;
const withdrawButton = document.getElementById('withdrawButton') as HTMLButtonElement;

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

let walletClient: WalletClient;
let publicClient: PublicClient;

async function connect(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    await walletClient.requestAddresses();
    connectButton.innerHTML = 'Connected..!';
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function fund(): Promise<void> {
  const ethAmount = ethAmountInput.value;
  let connectedAccount: `0x${string}`;

  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const accounts = await walletClient.requestAddresses();
    connectedAccount = accounts[0];
  } else {
    console.error("Ethereum provider not found");
    return;
  }

  publicClient = createPublicClient({
    transport: custom(window.ethereum),
  });

  const chain = await getCurrentChain(walletClient);

  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "fund",
    account: connectedAccount,
    chain,
    value: parseEther(ethAmount),
  });

  const hash = await walletClient.writeContract(request);
  console.log(hash);
}

async function getCurrentChain(client: typeof walletClient) {
  const chainId = await client.getChainId();
  return defineChain({
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
  });
}

async function getBalance(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });
  } else {
    console.error("Ethereum provider not found");
    return;
  }

  const balanceInWei = await publicClient.getBalance({
    address: contractAddress,
  });

  console.log(formatEther(balanceInWei));
}

async function withdraw(): Promise<void> {
  let connectedAccount: `0x${string}`;

  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });
    const accounts = await walletClient.requestAddresses();
    connectedAccount = accounts[0];
  } else {
    console.error("Ethereum provider not found");
    return;
  }

  publicClient = createPublicClient({
    transport: custom(window.ethereum),
  });

  const chain = await getCurrentChain(walletClient);

  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: "withdraw",
    account: connectedAccount,
    chain,
    value: parseEther("0"),
  });

  const hash = await walletClient.writeContract(request);
  console.log(hash);
}
