import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import '../components.css';
import LetterBoxingABI from "../util/LetterBoxing.json";
import fleek from '@fleekhq/fleek-storage-js';  
import * as  constants from '../util/constants.js';
import { ipfsUpload } from '../util/nft_operations.js';

const DEPLOYED_CONTRACT_ADDRESS = constants.DEPLOYED_CONTRACT_ADDRESS;

export const injected = new InjectedConnector();

function MintLetterBox() {
    const [hasMetamask, setHasMetamask] = useState(false);
    const {
        active,
        activate,
        chainId,
        account,
        library: provider,
      } = useWeb3React();
    const [state, setState] = useState(    {
        name: "",
        lattitude: "",
        longitude: "",
        description: "",
        city: "",
        state: "",
        country: "",
        zip: "",
        isLetterBox: true,
        selectedAddress: "",
    });
    const [file, setFile] = useState({});

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(state.name !== "" && state.lattitude !== "" && state.longitude !== "" && 
            state.description !== "" && state.city !== "" && state.state !== ""
            && state.country !== "" && state.zip !== "" && state.isLetterBox === true) {
            let metaDataResult = await ipfsUpload({
                fleek: fleek,
                file: file,
                imagePath: constants.LETTERBOX_IMAGE_PATH,
                metadataPath: constants.LETTERBOX_METADATA_PATH,
                state: state
            });
            const contract = new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, LetterBoxingABI["abi"], provider.getSigner());

            contract.mintLetterbox(account, metaDataResult.publicUrl);
        } else {
            alert("Please enter value for all fields");
        }
    }

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    };

    function handleChange(event) {
        let change = {
            ...state
        };
        change[event.target.name] = event.target.value;
        setState(change);
    };
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

    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            setHasMetamask(true);
        }
    });
    
    return (
        <div>
            {console.log('State Context: ', state)}
            {console.log('File Context: ', file)}
            
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
            <form onSubmit={handleSubmit}>
                <h1>Plant a Letter Box</h1>
                <div>&nbsp;</div>
                <label htmlFor="letter-plant-name">Name:
                    <input type="text" name="name" className="form-control" id="letter-plant-name" onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-description">Description:
                    <textarea type="text" name="description" rows="4" cols="50"className="form-control" id="letter-plant-description" onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-lattitude">Lattitude:
                    <input type="text" name="lattitude" className="form-control" id="letter-plant-lattitude" onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-longitude">Longitude:
                    <input type="text" name="longitude" className="form-control" id="letter-plant-longitude" onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-city">City:
                    <input type="text" name="city" className="form-control" id="letter-plant-city"onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-state">State:
                    <input type="text" name="state" className="form-control" id="letter-plant-state"onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-country">Country: 
                    <input type="text" name="country" className="form-control" id="letter-plant-country"onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-zip">Zip Code:
                    <input type="text" name="zip" className="form-control" id="letter-plant-zip"onChange={handleChange}/>
                </label>
                <label htmlFor="letter-plant-upload">Upload: 
                    <input type="file" className="form-control" id="letter-plant-upload"onChange={handleFileChange}/>
                </label>
                <div>&nbsp;</div>
                <button type="submit" className="btn btn-success">Mint</button>
            </form> : <h1 className="center">Connect Wallet</h1>}
        </div>
    );
}
export default <MintLetterBox/>