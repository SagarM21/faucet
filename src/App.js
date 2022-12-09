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
		isProvidedLoaded: false,
		web3: null,
		contract: null,
	});

	const [account, setAccount] = useState(null);
	const [balance, setBalance] = useState(null);
	const [reload, setReload] = useState(false);

	const canConnectToContract = account && web3Api.contract;

	const reloadEffect = useCallback(() => setReload(!reload), [reload]);
	const setAccountListener = (provider) => {
		provider.on("accountsChanged", (_) => window.location.reload()); // refer metamask docs
		provider.on("chainChanged", (_) => window.location.reload()); // refer metamask docs

		//* 2ND method of above line
		// provider._jsonRpcConnection.events.on("notification", (payload) => {
		// 	const { method } = payload;
		// 	if (method === "metamask_unlockStateChanged") {
		// 		setAccount(null);
		// 	}
		// });
	};

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();

			if (provider) {
				const contract = await loadContract("Faucet", provider);

				setAccountListener(provider);
				// provider.request({ method: "eth_requestAccounts" }); // this will force u to login to metamask
				setWeb3Api({
					web3: new Web3(provider),
					provider,
					contract,
					isProvidedLoaded: true,
				});
			} else {
				setWeb3Api((api) => {
					return {
						...api,
						isProvidedLoaded: true,
					};
				});
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
	}, [web3Api, reload]);

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
		reloadEffect();
	}, [web3Api, account, reloadEffect]);

	const withdraw = useCallback(async () => {
		const { contract, web3 } = web3Api;
		const withdrawAmount = web3.utils.toWei("0.1", "ether"); // this withdrawAmt variable is coming from the contract
		await contract.withdraw(withdrawAmount, {
			from: account,
		});
		reloadEffect();
	}, [web3Api, account, reloadEffect]);

	return (
		<>
			<div className='faucet-wrapper'>
				<div className='faucet'>
					{web3Api.isProvidedLoaded ? (
						<div className='is-flex is-align-items-center'>
							<span>
								<strong className='mr-2'>Account: </strong>
							</span>
							{account ? (
								<div>{account}</div>
							) : !web3Api.provider ? (
								<>
									{" "}
									<div className='notification is-warning is-size-6 is-rounded'>
										Wallet is not detected!{" "}
										<a
											target='_blank'
											href='https://docs.metamask.io'
											className='is_block'
											rel='noreferrer'
										>
											Install Metamask
										</a>
									</div>
								</>
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
					) : (
						<span>Looking for web3...</span>
					)}

					<div className='balance-view is-size-2 my-4'>
						Current Balance: <strong>{balance} </strong>ETH
					</div>
					{!canConnectToContract && (
						<i className='is-block'>Connect to Ganache</i>
					)}
					<button
						className='button mr-2  is-link'
						onClick={addFunds}
						disabled={!canConnectToContract}
					>
						Donate 1 eth
					</button>
					<button
						className='button is-primary'
						onClick={withdraw}
						disabled={!canConnectToContract}
					>
						Withdraw 0.1 eth
					</button>
				</div>
			</div>
		</>
	);
}

export default App;
