'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { WalletSelector, AccountState } from '@near-wallet-selector/core';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupBitteWallet } from '@near-wallet-selector/bitte-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import '@near-wallet-selector/modal-ui/styles.css';

type WalletSelectorContextValue = {
  selector: WalletSelector | null;
  modal: ReturnType<typeof setupModal> | null;
  accounts: Array<AccountState>;
  accountId: string | null;
  isInitialized: boolean;
};

const WalletSelectorContext = createContext<WalletSelectorContextValue>({
  selector: null,
  modal: null,
  accounts: [],
  accountId: null,
  isInitialized: false
});

export const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<ReturnType<typeof setupModal> | null>(null);
  const [accounts, setAccounts] = useState<Array<AccountState>>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    setupWalletSelector({
      network: 'testnet',
      modules: [
        setupMyNearWallet(),
        setupSender(),
        setupHereWallet(),
        setupMeteorWallet(),
        setupBitteWallet(),
        setupLedger()
      ],
    })
      .then((selector) => {
        const modal = setupModal(selector, {
          contractId: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
        });

        const state = selector.store.getState();
        setAccounts(state.accounts);
        setAccountId(state.accounts[0]?.accountId || null);

        setSelector(selector);
        setModal(modal);
        setIsInitialized(true);

        // Subscribe to changes
        selector.store.observable.subscribe((state) => {
          setAccounts(state.accounts);
          setAccountId(state.accounts[0]?.accountId || null);
        });
      })
      .catch((err) => {
        console.error('Failed to initialize wallet selector:', err);
        setIsInitialized(true); // Set to true even on error to prevent infinite retries
      });
  }, [isInitialized]);

  const contextValue = {
    selector,
    modal,
    accounts,
    accountId,
    isInitialized
  };

  return (
    <WalletSelectorContext.Provider value={contextValue}>
      {children}
    </WalletSelectorContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletSelectorContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletContextProvider');
  }
  return context;
}; 