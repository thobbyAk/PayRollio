import { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
	ArchiveBoxIcon,
	CreditCardIcon,
	HomeIcon,
	UsersIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { GlobalContext } from "../context/GlobalState";
import Header from "./Header";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { Link, NavLink, useLocation } from "react-router-dom";
import { employeeContractAddress } from "../config";
import Employee from "../abi/Employee.json";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}
const Layout = ({ children }) => {
	const location = useLocation();
	const [admin, setAdmin] = useState(false);
	const { addUser, users } = useContext(GlobalContext);
	function getLocationPath() {
		return location.pathname;
	}
	const navigation = [
		{
			name: "Dashboard",
			href: "/",
			icon: HomeIcon,
			current: getLocationPath() === "/" ? true : false,
		},
		{
			name: "Employee",
			href: "/employee",
			icon: UsersIcon,
			current: getLocationPath().toLowerCase() === "/employee" ? true : false,
		},
		{
			name: "Credits",
			href: "/credits",
			icon: CreditCardIcon,
			current: getLocationPath() === "/credits" ? true : false,
		},
		{
			name: "Governance",
			href: "/voting",
			icon: ArchiveBoxIcon,
			current: getLocationPath() === "/voting" ? true : false,
		},
	];
	const userNavigation = [
		{
			name: "Dashboard",
			href: "/",
			icon: HomeIcon,
			current: location.pathname === "/" ? true : false,
		},
		{
			name: "Employee",
			href: "/employee",
			icon: UsersIcon,
			current: location.pathname === "/employee" ? true : false,
		},
		{
			name: "Credits",
			href: "/credits",
			icon: CreditCardIcon,
			current: location.pathname === "/credits" ? true : false,
		},
		{
			name: "Governance",
			href: "/voting",
			icon: ArchiveBoxIcon,
			current: location.pathname === "/voting" ? true : false,
		},
	];

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [account, setAccount] = useState("");
	const [walletConnected, setWalletConnected] = useState(false);
	const [web3Modal, setWeb3Modal] = useState(null);
	const [currentMenu, setCurrentMenu] = useState(navigation);
	const chainIdNumber = 80001;

	async function checkIsAdmin() {
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rpc.ankr.com/polygon_mumbai`
		);
		const employeeContract = new ethers.Contract(
			employeeContractAddress,
			Employee.abi,
			provider
		);
		console.log("useAddress", users.account);
		if (users.account !== "") {
			const isdata = await employeeContract.isAdmin(users.account);
			console.log("Admindat", isdata);
			isdata == true && setCurrentMenu(navigation);
			isdata == false && setCurrentMenu(userNavigation);
			setAdmin(isdata);
		}
	}

	useEffect(() => {
		const providerOptions = {};

		const newWeb3Modal = new Web3Modal({
			cacheProvider: true,
			network: "mumbai",
			providerOptions,
		});

		setWeb3Modal(newWeb3Modal);
	}, []);

	useEffect(() => {
		// connect automatically and without a popup if user is already connected
		if (web3Modal && web3Modal.cachedProvider) {
			connectWallet();
		}
	}, [web3Modal]);

	async function addListeners(web3ModalProvider) {
		web3ModalProvider.on("accountsChanged", (accounts) => {
			connectWallet();
			// checkIsAdmin();
		});

		// Subscribe to chainId change
		web3ModalProvider.on("chainChanged", (chainId) => {
			// checkIsAdmin();
			connectWallet();
		});
	}

	const disconnectWallet = async () => {
		await web3Modal.clearCachedProvider();

		// handleClose();
		setWalletConnected(false);
		// removeAccount();
	};
	// useEffect(() => {
	// 	checkIsAdmin();
	// }, []);

	async function connectWallet() {
		const provider = await web3Modal.connect();
		addListeners(provider);
		const ethersProvider = new providers.Web3Provider(provider);
		const userAddress = await ethersProvider.getSigner().getAddress();
		const userBalance = await ethersProvider.getBalance(userAddress);
		console.log("userBalance", ethers.utils.formatUnits(userBalance));
		const { chainId } = await ethersProvider.getNetwork();
		setAccount(userAddress);
		addUser({
			account: userAddress,
			userBalance: userBalance,
		});
		setWalletConnected(true);
		if (chainId !== 8001) {
			checkifUserisConnectedToMumbai();
		}

		// console.log("userAccount", userAccount);
	}

	async function checkifUserisConnectedToMumbai() {
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x13881" }],
			});
			console.log("here switch");
		} catch (err) {
			// This error code indicates that the chain has not been added to MetaMask
			if (err.code === 4902) {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainName: "Mumbai Testnet",
							chainId: "0x13881",
							nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
							rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
						},
					],
				});
			}
		}
	}

	return (
		<div>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-40 md:hidden"
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute top-0 right-0 -mr-12 pt-2">
										<button
											type="button"
											className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
											onClick={() => setSidebarOpen(false)}
										>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								<div className="flex flex-shrink-0 items-center px-4">
									<div
										className="text-xl font-semibold text-white
                                    "
									>
										PayRollio
									</div>
								</div>
								<div className="mt-5 h-0 flex-1 overflow-y-auto">
									<nav className="space-y-1 px-2">
										{currentMenu.map((item) => (
											<NavLink
												key={item.name}
												exact
												to={item.href}
												className={classNames(
													item.current
														? "bg-[#30253f] text-[#9A76D9]"
														: "text-[#9A76D9] hover:bg-gray-700 hover:text-white",
													"group flex items-center px-2 py-2 text-base font-medium rounded-md"
												)}
											>
												<item.icon
													className={classNames(
														item.current
															? "text-[#9A76D9]"
															: "text-[#9A76D9] group-hover:text-[#9A76D9]",
														"mr-4 flex-shrink-0 h-6 w-6"
													)}
													aria-hidden="true"
												/>
												{item.name}
											</NavLink>
										))}
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
						<div className="w-14 flex-shrink-0" aria-hidden="true">
							{/* Dummy element to force sidebar to shrink to fit close icon */}
						</div>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex min-h-0 flex-1 flex-col bg-gradient-to-r from-[#291f32] to-[#291f32]">
					<div className="flex h-16 flex-shrink-0 items-center bg-[#241c2d] px-4">
						<div
							className="text-xl font-semibold text-white
                                    "
						>
							PayRollio
						</div>
					</div>
					<div className="flex flex-1 flex-col overflow-y-auto">
						<nav className="flex-1 space-y-1 px-2 py-4">
							{currentMenu.map((item) => (
								<NavLink
									key={item?.name}
									to={item.href}
									className={({ isActive }) =>
										isActive
											? "bg-[#30253f] text-[#9A76D9] group flex items-center px-2 py-2 text-sm font-medium rounded-md "
											: "text-[#9A76D9] hover:bg-[#30253f] hover:text-[#9A76D9] group flex items-center px-2 py-2 text-sm font-medium rounded-md"
									}
								>
									<item.icon
										className={classNames(
											item.current
												? "text-[#9A76D9]"
												: "text-[#9A76D9] group-hover:text-[#9A76D9]",
											"mr-3 flex-shrink-0 h-6 w-6"
										)}
										aria-hidden="true"
									/>
									{item.name}
								</NavLink>
							))}
						</nav>
					</div>
				</div>
			</div>
			<div className="flex flex-col md:pl-64">
				<Header
					connectWallet={connectWallet}
					disconnectWallet={disconnectWallet}
					walletConnected={walletConnected}
					account={account}
				/>

				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};

export default Layout;
