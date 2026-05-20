"use client";

import React, { useMemo } from "react";
import {WalletProvider,ConnectionProvider} from "@solana/wallet-adapter-react"
import {WalletMultiButton, WalletModalProvider} from "@solana/wallet-adapter-react-ui"
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base"
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets"
import {clusterApiUrl} from "@solana/web3.js"
import "@solana/wallet-adapter-react-ui/styles.css";
const WalletContextProvider = ({ children }:{children:React.ReactNode}) => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        [],
    );
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="min-h-screen bg-gray-100">
                        <header className="bg-white shadow-sm px-5 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-gray-800">Notes Dapp</h1>
                                <WalletMultiButton />
                            </div>
                        </header>
                    <main className="p-5">
                        {children}
                    </main>

                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>


    )

}

export default WalletContextProvider;