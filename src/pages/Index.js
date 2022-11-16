import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { employeeContractAddress, NFTContractAddress } from "../config";
import { ethers } from "ethers";
import Employee from "../abi/Employee.json";
import spinner from "../assets/images/spinner.svg";
import PayRollio from "../abi/PayRollioNFT.json";
import { shortenAddress } from "../lib/utils";
import { GlobalContext } from "../context/GlobalState";
import EmployeeView from "../components/Modals/EmployeeView";

const Index = () => {
	const [showModal, setShowModal] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [imgArray, setImgArray] = useState([]);
	const [employeeOfMonthDetails, setEmployeeOfMonthDetails] = useState([]);
	const [employeeDetails, setEmployeeDetails] = useState({});
	const { users } = useContext(GlobalContext);
	const [loading, setLoading] = useState(false);

	async function loadEmployees() {
		setLoading(true);
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rpc.ankr.com/polygon_mumbai`
		);
		const employeeContract = new ethers.Contract(
			employeeContractAddress,
			Employee.abi,
			provider
		);

		const data = await employeeContract.getActiveEmployees();

		// const isdata = await employeeContract.isAdmin(users.account);
		// console.log("if employee", await isdata);
		const employeeData = await Promise.all(
			data.map(async (i) => {
				let rank = ethers.utils.formatUnits(i.rank.toString(), "ether") * 1e18;
				let salary = ethers.utils.formatUnits(i.salary.toString(), "ether");
				let daysTopayDay =
					ethers.utils.formatUnits(i.daysToNextPay.toString(), "ether") * 1e18;
				let employee = {
					id: i.id,
					name: i.name,
					salary: salary,
					walletAddress: i.walletAddress,
					rank: rank,
					payDay: daysTopayDay,
				};
				return employee;
			})
		);
		const filteredRmployee = employeeData.filter(function (element) {
			return element.name !== "";
		});
		setLoading(false);
		setEmployees(filteredRmployee);
	}
	async function loadEmployeeOfTheMonth() {
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rpc.ankr.com/polygon_mumbai`
		);
		const employeeContract = new ethers.Contract(
			employeeContractAddress,
			Employee.abi,
			provider
		);

		const empOfMonth = await employeeContract.getPreviousEmployeeOfTheMonth();
		setEmployeeOfMonthDetails(empOfMonth);
	}
	useEffect(() => {
		loadEmployees();
		loadEmployeeOfTheMonth();
	}, []);

	async function GetEmployeeDetails(details) {
		setLoading(true);
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rpc.ankr.com/polygon_mumbai`
		);
		const nftContract = new ethers.Contract(
			NFTContractAddress,
			PayRollio.abi,
			provider
		);
		const data = await nftContract.getAccountsNFTs(details.walletAddress);
		let newArr = [];
		data.forEach(function (element, index) {
			// data[index] = ethers.utils.formatUnits(element.toString(), "ether");
			if (element > 0) {
				// newArr.push[element];
				console.log("newArray", element);
				newArr.push(ethers.utils.formatUnits(element.toString(), "ether") * 1e18);
				setLoading(false);
				setImgArray(newArr);
				setEmployeeDetails(details);
				setShowModal(true);
			}
		});
	}

	const stats = [
		{ name: "Total Employees", stat: employees.length },
		{
			name: "Previous Employee of the Month",
			stat: employeeOfMonthDetails[1],
		},
		{ name: "Total Benefits Token in Circulation", stat: "2400 EMP" },
	];

	if (loading) {
		return (
			<div className=" flex h-screen">
				<div className="m-auto rounded-3xl shadow-2xl">
					{loading && <img className="animate-spin mr-3   w-5 h-5" src={spinner} />}
				</div>
			</div>
		);
	}
	return (
		<>
			<div className="py-10">
				<header>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
							Dashboard
						</h1>
					</div>
				</header>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<h3 className="text-lg font-medium leading-6 text-gray-500">
						Last 30 days
					</h3>
					<dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
						{stats.map((item) => (
							<div
								key={item.name}
								className="overflow-hidden rounded-lg bg-[#1d1921] px-4 py-5 shadow sm:p-6"
							>
								<dt className="truncate text-sm font-medium text-[#9A76D9]">
									{item.name}
								</dt>
								<dd className="mt-1 text-3xl font-semibold tracking-tight text-white">
									{item.stat}
								</dd>
							</div>
						))}
					</dl>
				</div>

				<div className="mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8">
					<div className="mt-8 bg-[#1d1921] rounded-lg px-4 flex flex-col">
						<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
								<table className="min-w-full divide-y divide-gray-300">
									<thead>
										<tr>
											<th
												scope="col"
												className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-6 md:pl-0"
											>
												Name
											</th>
											<th
												scope="col"
												className="py-3.5 px-3 text-left text-sm font-semibold text-gray-500"
											>
												Salary
											</th>
											<th
												scope="col"
												className="py-3.5 px-3 text-left text-sm font-semibold text-gray-500"
											>
												Wallet Address
											</th>
											<th
												scope="col"
												className="py-3.5 px-3 text-left text-sm font-semibold text-gray-500"
											>
												Role
											</th>
											<th
												scope="col"
												className="py-3.5 px-3 text-left text-sm font-semibold text-gray-500"
											>
												Next Payday
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{employees.slice(0, 8).map((employee, index) => (
											<tr
												key={index}
												className="cursor-pointer"
												onClick={() => {
													GetEmployeeDetails(employee);
												}}
											>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 md:pl-0">
													{employee.name}
												</td>
												<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
													{employee.salary} MATIC
												</td>
												<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
													{shortenAddress(employee.walletAddress)}
												</td>
												<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
													{employee?.rank === 2 ? "Team Member" : ""}
													{employee?.rank === 1 ? "Team Lead" : ""}
													{employee?.rank === 3 ? "Engineering Manager" : ""}
												</td>
												<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
													{employee.payDay} days
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			{showModal && (
				<EmployeeView
					showModal={showModal}
					setShowModal={setShowModal}
					imgArray={imgArray}
					employeeDetails={employeeDetails}
				/>
			)}
		</>
	);
};

export default Index;
