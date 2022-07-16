import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import '../components.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import UserStamp from "./UserStamp";
import * as  constants from '../util/constants.js';
import { getUserStamp } from '../util/nft_operations.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

function UsersCollection() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState({
        stampList: []
    });
    
    async function connect() {
        if (typeof window.ethereum !== "undefined") {
          try {
            await activate(injected);
            setHasMetamask(true);
          } catch (e) {
            console.log(e);
          }
        }
      };

    async function getNFTs() {
        const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());
        let stampList = await getUserStamp({
            account: account,
            contract: contract
        });
        setState({
            ...state,
            stampList: stampList
        });
    };

      useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
          setHasMetamask(true);
        }
      });

      useEffect(() => {
        if(active) {
            getNFTs();
        }
      },[active]);
      
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('Account Context: ', account)}
            {console.log('Account Active: ', active)}
            {hasMetamask ? (
                active ? (
                <div className="top-right">Connected</div>
                ) : (
                    <button className="top-right" onClick={() => connect()}>Connect</button>
                )
            ) : (
                <div className="top-right">Please Install Metamask</div>
            )}
            {active ? 
            <div className="center">
                <div>&nbsp;</div>
                <h1>Stamps</h1>
                <UserStamp stamp={state} />
            </div> : <h1 className="center">Connect Wallet</h1>}
        </div>
    );
}
export default <UsersCollection/>