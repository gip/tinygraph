'use client';

import { WalletContextProvider } from '../components/AppWalletProvider/AppWalletProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  );
};

export default Providers; 