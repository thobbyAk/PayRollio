import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { employeeContractAddress } from "../config";
import { ethers } from "ethers";
import Employee from "../abi/Employee.json";
import { shortenAddress } from "../lib/utils";

const stats = [
	{ name: "Total Employees", stat: "71,897" },
	{ name: "Avg. Work Rate", stat: "58.16%" },
	{ name: "Total Token in Circulation", stat: "2400" },
];

const Index = () => {
	const [employees, setEmployees] = useState([]);
	const [loadingState, setLoading] = useState(false);

	async function loadEmployees() {
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rpc.ankr.com/polygon_mumbai`
		);
		const employeeContract = new ethers.Contract(
			employeeContractAddress,
			Employee.abi,
			provider
		);

		const data = await employeeContract.getActiveEmployees();
		console.log("employee", await data);
		const employeeData = await Promise.all(
			data.map(async (i) => {
				let rank = ethers.utils.formatUnits(i.rank.toString(), "ether") * 1e18;
				let salary = ethers.utils.formatUnits(i.salary.toString(), "ether") * 1e18;
				let daysTopayDay =
					ethers.utils.formatUnits(i.daysToNextPay.toString(), "ether") * 1e18;
				let employee = {
					name: i.name,
					salary: salary,
					walletAddress: i.walletAddress,
					rank: rank,
					payDay: daysTopayDay,
				};
				return employee;
			})
		);
		console.log("eemployeeData:", employeeData);
		setEmployees(employeeData);
	}
	useEffect(() => {
		loadEmployees();
	}, []);
	return (
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
										<tr key={index}>
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
												{employee.rank}
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
	);
};

export default Index;
