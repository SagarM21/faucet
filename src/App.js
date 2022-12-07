import { useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import { useState } from "react";
function App() {
	const [web3Api, setWeb3Api] = useState({
		provider: null,
		web3: null,
	});

	const [account, setAccount] = useState(null);

	useEffect(() => {
		const loadProvider = async () => {
			let provider = null;
			// with metamask we have an access to window.ethereum & window.web3
			// metamask injects a global API into website
			// this API allows websites to request users, accounts, read data to blockchain, sign messages and transaction

			// console.log(window.web3);
			// console.log(window.ethereum);

			// automatically connects to metamask
			if (window.ethereum) {
				provider = window.ethereum;

				try {
					await provider.enable();
				} catch {
					console.error("User denied account access.");
				}
			} else if (window.web3) {
				provider = window.web3.currentProvider;
			} else if (!process.env.production) {
				provider = new Web3.loadProviders.HttpProvider("http://localhost:7545");
			}

			setWeb3Api({
				web3: new Web3(provider),
				provider,
			});
		};
		loadProvider();
	}, []);

	console.log(web3Api.web3);

	useEffect(() => {
		const getAccount = async () => {
			const accounts = await web3Api.web3.eth.getAccounts();
			setAccount(accounts[0]);
		};
		web3Api.web3 && getAccount();
	}, [web3Api.web3]);

	return (
		<>
			<div className='faucet-wrapper'>
				<div className='faucet'>
					<span>
						<strong>Account: </strong>
					</span>
					<h1>{account ? account : "Not connected"}</h1>
					<div className='balance-view is-size-2'>
						Current Balance: <strong>10</strong>ETH
					</div>

					<button className='btn mr-2'>Donate</button>
					<button className='btn'>Withdraw</button>
				</div>
			</div>
		</>
	);
}

export default App;
