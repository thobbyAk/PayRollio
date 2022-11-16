import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { employeeContractAddress } from "../config";
import { ethers } from "ethers";
import spinner from "../assets/images/spinner.svg";
import Employee from "../abi/Employee.json";
import { shortenAddress } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EmployeePage = () => {
	const navigate = useNavigate();
	const [employees, setEmployees] = useState([]);
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
		const employeeData = await Promise.all(
			data.map(async (i) => {
				let rank = ethers.utils.formatUnits(i.rank.toString(), "ether") * 1e18;
				let salary = ethers.utils.formatUnits(i.salary.toString(), "ether");
				let daysTopayDay =
					ethers.utils.formatUnits(i.daysToNextPay.toString(), "ether") * 1e18;
				let singleEmployee = {
					id: i.id,
					name: i.name,
					salary: salary,
					walletAddress: i.walletAddress,
					rank: rank,
					payDay: daysTopayDay,
				};
				return singleEmployee;
			})
		);
		const filteredRmployee = employeeData.filter(function (element) {
			return element.name !== "";
		});
		setLoading(false);
		setEmployees(filteredRmployee);
	}

	async function releaseEmployee(employeeId) {
		setLoading(true);
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		let contract = new ethers.Contract(
			employeeContractAddress,
			Employee.abi,
			signer
		);
		const transaction = await contract.releaseEmployee(employeeId);
		let tx = await transaction.wait();
		let event = tx.events[0];
		setLoading(false);
		loadEmployees();
		Swal.fire({
			title: "Success",
			text: "Employee Removed Successfully",
			icon: "success",
			showConfirmButton: false,
			timer: 2000,
			background: "#241c2d",
		});
	}
	useEffect(() => {
		loadEmployees();
	}, []);

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
		<div className="py-10">
			<div className=" mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 ">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-white">Employee</h1>
						<p className="mt-2 text-sm text-gray-500">
							A list of all the Employee in your company including their name, title,
							email and role.
						</p>
					</div>
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
						<button
							onClick={() => {
								navigate("/add-employee");
							}}
							type="button"
							className="inline-flex items-center justify-center text-[#30253f] rounded-md border border-transparent bg-[#9A76D9] px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#bd94eb] focus:outline-none focus:ring-2  focus:ring-offset-2 sm:w-auto"
						>
							Add Employee
						</button>
					</div>
				</div>

				<div className="mt-8 flex flex-col rounded-lg bg-[#1d1921] px-4">
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
										<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
											<span className="sr-only">Edit</span>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{employees.map((employe, index) => (
										<tr key={index}>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 md:pl-0">
												{employe.name}
											</td>
											<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
												{employe.salary} MATIC
											</td>
											<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
												{shortenAddress(employe.walletAddress)}
											</td>
											<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
												{employe?.rank === 2 ? "Team Member" : ""}
												{employe?.rank === 1 ? "Team Lead" : ""}
												{employe?.rank === 3 ? "Engineering Manager" : ""}
											</td>
											<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
												{employe?.payDay} days
											</td>
											<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
												<button
													onClick={() => {
														releaseEmployee(employe?.id);
													}}
													className="text-[#9A76D9] hover:text-[#9A76D9]"
												>
													Release Employee<span className="sr-only">, {employe.name}</span>
												</button>
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

export default EmployeePage;
