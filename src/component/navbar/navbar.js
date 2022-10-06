import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { DONATION_ABI } from "../../contract/donation_ABI";

function Navbar() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [provider, setprovider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [campaign, setCampaign] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("You don't have metamask installed");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      throw new Error(error);
    }
  };
  const accountChangedHandler = (newAccount) => {
    setCurrentAccount(newAccount);
    instantiateContract();
  };
  window.ethereum.on("accountsChanged", accountChangedHandler);

  const instantiateContract = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setprovider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let contractAddress = "0xD4Fc541236927E2EAf8F27606bD7309C1Fc2cbee";
    let tempContract = new ethers.Contract(
      contractAddress,
      DONATION_ABI,
      tempSigner
    );
    console.log("tempContract>", tempContract);
    setContract(tempContract);
  };

  const getCampaignById = async (event) => {
    event.preventDefault();
    let val = await contract.campaigns(event.target.text.value);
    console.log("val>>", event.target.text.value, val);
    setCampaign(val);
  };

  const startCampaign = async (event) => {
    event.preventDefault();
    let val = await contract.startCampaign();
    console.log("val>>", val);
  };

  return (
    <div>
      {!currentAccount ? (
        <button onClick={connectWallet}>connect to wallet</button>
      ) : (
        <>
          <span>{currentAccount}</span>
          <form onSubmit={startCampaign}>
            <button type={"submit"}>start campaign</button>
          </form>
          <form onSubmit={getCampaignById}>
            <input id="text" type="text" />
            <button type={"submit"}>get campaign</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Navbar;
