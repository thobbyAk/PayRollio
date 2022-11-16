import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Employee from "../abi/Employee.json";
import spinner from "../assets/images/spinner.svg";
import { employeeContractAddress } from "../config";
import Swal from "sweetalert2";

const AddProposal = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formInput, updateFormInput] = useState({
		candidate1: "",
		candidate2: "",
		candidate3: "",
	});
	async function createProposal() {
		if (
			formInput.candidate1 !== "" &&
			formInput.candidate2 !== "" &&
			formInput.candidate3 !== ""
		) {
			setLoading(true);
			const { candidate1, candidate2, candidate3 } = formInput;
			const web3Modal = new Web3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			let contract = new ethers.Contract(
				employeeContractAddress,
				Employee.abi,
				signer
			);

			let transaction = await contract.initiateEmployeeOfTheMonthProposal(
				candidate1,
				candidate2,
				candidate3
			);
			let txn = await transaction.wait();
			let event = txn.events[0];
			setLoading(false);
			updateFormInput({
				candidate1: "",
				candidate2: "",
				candidate3: "",
			});
			Swal.fire({
				title: "Success",
				text: "Proposal Created Successfully",
				icon: "success",
				showConfirmButton: false,
				timer: 2000,
				background: "#241c2d",
			});
			navigate("/voting");
		} else {
			console.log("fields not filled fully");
		}
	}
	return (
		<div className="space-y-8 divide-y divide-gray-200">
			<div className=" mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 py-8 space-y-8 divide-y divide-gray-200">
				<div>
					<div>
						<h3 className="leading-6 text-xl font-semibold text-white">
							Create Proposal
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							create monthly viting proposal for employee of the month and others
						</p>
					</div>
				</div>

				<div className="pt-8">
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						{/* <div className="sm:col-span-3">
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-400"
							>
								Month
							</label>
							<div className="mt-1">
								<select
									onChange={(e) =>
										updateFormInput({ ...formInput, month: e.target.value })
									}
									autoComplete="country-name"
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								>
									<option defaultValue value={0}>
										January
									</option>
									<option value={1}>Feburary</option>
									<option value={2}>March</option>
									<option value={3}>April</option>
									<option value={4}>May</option>
									<option value={5}>June</option>
									<option value={6}>July</option>
									<option value={7}>August</option>
									<option value={8}>September</option>
									<option value={9}>October</option>
									<option value={10}>November</option>
									<option value={11}>December</option>
								</select>
							</div>
						</div> */}
						<div className="sm:col-span-3">
							<label
								htmlFor="first-name"
								className="block text-sm font-medium text-gray-400"
							>
								Employee Nominee 1 Address
							</label>
							<div className="mt-1">
								<input
									type="text"
									placeholder="Nominee 1 Address"
									onChange={(e) =>
										updateFormInput({ ...formInput, candidate1: e.target.value })
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
								Employee Nominee 2 Address
							</label>
							<div className="mt-1">
								<input
									type="text"
									placeholder="Nominee 2 Address"
									onChange={(e) =>
										updateFormInput({ ...formInput, candidate2: e.target.value })
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
								Employee Nominee 2 Address
							</label>
							<div className="mt-1">
								<input
									type="text"
									placeholder="Nominee 3 Address"
									onChange={(e) =>
										updateFormInput({ ...formInput, candidate3: e.target.value })
									}
									className="block pl-4 w-full h-12 rounded-lg text-white shadow-sm bg-[#1b171d] sm:text-sm"
								/>
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
						onClick={() => {
							createProposal();
						}}
						className="ml-3 inline-flex items-center justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-[#30253f]  bg-[#9A76D9] shadow-sm hover:bg-[#bd94eb]  focus:outline-none focus:ring-2  focus:ring-offset-2"
					>
						{loading && <img className="animate-spin mr-3   w-5 h-5" src={spinner} />}
						Create Proposal
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddProposal;
