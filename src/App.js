import { useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import { useCallback } from "react";

function App() {
	const [web3Api, setWeb3Api] = useState({
		provider: null,
		web3: null,
		contract: null,
	});

	const [account, setAccount] = useState(null);
	const [balance, setBalance] = useState(null);

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();
			const contract = await loadContract("Faucet", provider);

			if (provider) {
				// provider.request({ method: "eth_requestAccounts" }); // this will force u to login to metamask
				setWeb3Api({
					web3: new Web3(provider),
					provider,
					contract,
				});
			} else {
				console.error("Please install metamask!");
			}
			// with metamask we have an access to window.ethereum & window.web3
			// metamask injects a global API into website
			// this API allows websites to request users, accounts, read data to blockchain, sign messages and transaction

			// console.log(window.web3);
			// console.log(window.ethereum);

			// automatically connects to metamask
		};
		loadProvider();
	}, []);

	useEffect(() => {
		const loadBalance = async () => {
			const { contract, web3 } = web3Api;
			const balance = await web3.eth.getBalance(contract.address);
			setBalance(web3.utils.fromWei(balance, "ether"));
		};
		web3Api.contract && loadBalance();
	}, [web3Api]);

	console.log(web3Api.web3);

	useEffect(() => {
		const getAccount = async () => {
			const accounts = await web3Api.web3.eth.getAccounts();
			setAccount(accounts[0]);
		};
		web3Api.web3 && getAccount();
	}, [web3Api.web3]);

	const addFunds = useCallback(async () => {
		const { contract, web3 } = web3Api;
		await contract.addFunds({
			from: account,
			value: web3.utils.toWei("1", "ether"),
		});
	}, [web3Api, account]);

	return (
		<>
			<div className='faucet-wrapper'>
				<div className='faucet'>
					<div className='is-flex align-items-center'>
						<span>
							<strong className='mr-2'>Account: </strong>
						</span>
						{account ? (
							<div>{account}</div>
						) : (
							<button
								className='button is-small'
								onClick={() =>
									web3Api.provider.request({ method: "eth_requestAccounts" })
								}
							>
								Connect Wallet
							</button>
						)}
					</div>
					<div className='balance-view is-size-2 my-4'>
						Current Balance: <strong>{balance} </strong>ETH
					</div>

					<button className='button mr-2  is-link' onClick={addFunds}>
						Donate 1 eth
					</button>
					<button className='button is-primary'>Withdraw</button>
				</div>
			</div>
		</>
	);
}

export default App;
