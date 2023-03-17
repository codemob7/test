import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Plyr from 'plyr';
import EthApp from './EthApp';
import Wallet from "./wallet";
import { sleep } from './TokenPrice';

const Navbar = () => {
  const [ready, setReady] = useState(false);

  const authenticateUser = async () => {
    try {
      if (ready) {
        setReady(false);
        await sleep(100);

      }
      if (!ready)
        await Wallet.create()
      await Wallet.connectWallet()
      setReady(true);
    } catch (err) {

    }

  };
  return (
    <></>
  )
}

function App() {
  useEffect(() => {
    const player = new Plyr('#player');

  })
  return (
    <div className="App overflow-x-hidden relative">
      <Navbar />
      <EthApp />
    </div>
  );
}

export default App;
