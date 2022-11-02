import React, { useState, useContext } from "react";
import Web3Modal from "web3modal";
import Employee from "../abi/Employee.json";
import { ethers } from "ethers";

import { GlobalContext } from "../context/GlobalState";
import { employeeContractAddress } from "../config";

const AddEmployee = () => {
	const { users } = useContext(GlobalContext);
	const [formInput, updateFormInput] = useState({
		name: "",
		rank: "",
		dateOfBirth: "",
		salary: "",
	});
	console.log("ise", users);

	async function createEmployee() {
		if (users.length !== 0) {
			const { name, rank, dateOfBirth, salary } = formInput;
			const web3Modal = new Web3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			signer.getChainId();
			let contract = new ethers.Contract(
				employeeContractAddress,
				Employee.abi,
				signer
			);
			const employeeSalary = ethers.utils.parseUnits(salary.toString(), "ether");
			const employeeRank = ethers.utils.parseUnits(salary.toString(), "ether");
			const employeeDOB = ethers.utils.parseUnits(dateOfBirth.toString(), "ether");
			let transaction = await contract.addEmployee(
				name,
				employeeRank,
				employeeDOB,
				employeeSalary,
				users[0].account
			);
			let tx = await transaction.wait();
			let event = tx.events[0];
			console.log("event emmitted", event);
		} else {
			console.log("connect to metamask");
		}
	}
	return (
		<form className="space-y-8 divide-y divide-gray-200">
			<div className=" mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 py-8 space-y-8 divide-y divide-gray-200">
				<div>
					<div>
						<h3 className="leading-6 text-xl font-semibold text-white">
							Add Employee
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							This information will be displayed publicly so be careful what you share.
						</p>
					</div>
				</div>

				<div className="pt-8">
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<div className="sm:col-span-3">
							<label
								htmlFor="first-name"
								className="block text-sm font-medium text-gray-400"
							>
								Name
							</label>
							<div className="mt-1">
								<input
									type="text"
									name="first-name"
									id="first-name"
									placeholder="Name"
									onChange={(e) =>
										updateFormInput({ ...formInput, name: e.target.value })
									}
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								/>
							</div>
						</div>

						<div className="sm:col-span-3">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-400"
							>
								Email address
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									placeholder="email"
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								/>
							</div>
						</div>
						<div className="sm:col-span-3">
							<label
								htmlFor="salary"
								className="block text-sm font-medium text-gray-400"
							>
								Salary
							</label>
							<div className="mt-1">
								<input
									id="salary"
									name="salary"
									type="text"
									placeholder="Salary in MATIC"
									onChange={(e) =>
										updateFormInput({ ...formInput, salary: e.target.value })
									}
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								/>
							</div>
						</div>
						<div className="sm:col-span-3">
							<label htmlFor="don" className="block text-sm font-medium text-gray-400">
								Date of Birth
							</label>
							<div className="mt-1">
								<input
									id="dob"
									name="dob"
									type="date"
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								/>
							</div>
						</div>

						<div className="sm:col-span-3">
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-400"
							>
								Employee Rank
							</label>
							<div className="mt-1">
								<select
									id="country"
									name="country"
									autoComplete="country-name"
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								>
									<option>United States</option>
									<option>Canada</option>
									<option>Mexico</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="pt-5  mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 py-8 ">
				<div className="flex justify-end">
					{/* <button
						type="button"
						className="rounded-md border bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
						Cancel
					</button> */}
					<button
						type="submit"
						className="ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-[#30253f]  bg-[#9A76D9] shadow-sm hover:bg-[#bd94eb]  focus:outline-none focus:ring-2  focus:ring-offset-2"
					>
						Create Employee
					</button>
				</div>
			</div>
		</form>
	);
};

export default AddEmployee;
