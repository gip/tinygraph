import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { WalletContextProvider } from "../components/AppWalletProvider/AppWalletProvider";
import Providers from './providers';

export const metadata = {
  title: 'TinyGraph',
  description: 'A hackathon project around DeFI agents',
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Providers>
          <WalletContextProvider>
            <MantineProvider theme={theme}>{children}</MantineProvider>
          </WalletContextProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
