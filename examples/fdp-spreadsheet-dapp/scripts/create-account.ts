import { JsonRpcProvider, Wallet, parseEther } from "ethers";
import { FdpStorage } from "@fairdatasociety/fdp-storage";

async function createAccount(
  username: string,
  password: string,
  postageStampId: string,
  rpcUrl: string,
  beeUrl: string,
  fundingPrivateKey: string
) {
  const fdp = new FdpStorage(beeUrl, postageStampId as any);
  const accountWallet = fdp.account.createWallet();

  const provider = new JsonRpcProvider(rpcUrl);

  const fundingWallet = new Wallet(fundingPrivateKey, provider);

  const tx = await fundingWallet.sendTransaction({
    to: accountWallet.address,
    value: parseEther("0.1"),
  });

  await tx.wait();

  const registrationRequest = fdp.account.createRegistrationRequest(
    username,
    password
  );

  await fdp.account.register(registrationRequest);
}

if (process.argv.length < 5) {
  throw new Error(
    "Usage: vite-node create-account.ts <username> <password> <postage_stamp_id>"
  );
}

const username = process.argv[2];
const password = process.argv[3];
const postageStampId = process.argv[4];

createAccount(
  username,
  password,
  postageStampId,
  "http://localhost:9545",
  "http://localhost:1633",
  "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
)
  .then(() => console.log("Account created"))
  .catch(console.error);
