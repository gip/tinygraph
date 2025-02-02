'use client';

import { useEffect, useState } from 'react';
import { Anchor, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';
import { useWallet } from '../AppWalletProvider/AppWalletProvider';
import { Welcome } from '@/components/Welcome/Welcome';
import { Workbench } from '@/components/Workbench/Workbench';

const SESSION_STORAGE = 'hacksol-session';

export function Home() {

    const { 
        accountId,
    } = useWallet();

    const [session, setSessionIn] = useState(null);

    const setSession = (sess: string | null) => {
        localStorage.setItem(SESSION_STORAGE, sess || '');
    };

    useEffect(() => {
        let sess = localStorage.getItem(SESSION_STORAGE);
        if(accountId) {
            setSession(sess);
        }
    }, [accountId]);

    useEffect(() => {
        if(!accountId) {
            localStorage.setItem('hacksol-session', '');
            setSession(null);
        }
    }, [accountId]);

    return (
    <>
      {accountId && <Workbench connected={accountId} publicKey={accountId} setSession={setSession} session={session} />}
      {!accountId && <Welcome />}
    </>
  );
}