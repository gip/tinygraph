'use client';

import { useWallet } from './AppWalletProvider/AppWalletProvider';

const WalletConnectButton = () => {
  const { selector, modal, accountId, isInitialized } = useWallet();

  const handleConnect = async () => {
    modal?.show();
  };

  const handleDisconnect = async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  if (!isInitialized) {
    return (
      <button 
        disabled 
        className="px-4 py-2 font-bold text-white bg-gray-400 rounded cursor-not-allowed"
      >
        Initializing...
      </button>
    );
  }

  return (
    <button
      onClick={accountId ? handleDisconnect : handleConnect}
      className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
    >
      {accountId ? `Disconnect (${accountId})` : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnectButton; 