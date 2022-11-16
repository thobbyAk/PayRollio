import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { employeeContractAddress } from "../config";
import { ethers } from "ethers";
import Employee from "../abi/Employee.json";
import { shortenAddress } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import spinner from "../assets/images/spinner.svg";
import Swal from "sweetalert2";
import { GlobalContext } from "../context/GlobalState";

const Voting = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [loadingNominee, setLoadingNominee] = useState(false);
	const [nominees, setNominees] = useState([]);
	const [formInput, updateFormInput] = useState({
		month: "",
	});
	const { users } = useContext(GlobalContext);

	async function viewNominees() {
		if (formInput.month !== "") {
			setLoadingNominee(true);
			const { month } = formInput;
			const provider = new ethers.providers.JsonRpcProvider(
				`https://rpc.ankr.com/polygon_mumbai`
			);
			const votingContract = new ethers.Contract(
				employeeContractAddress,
				Employee.abi,
				provider
			);
			const data = await votingContract.getElegibleCandidatesForVotingByMonth(
				month
			);
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
			setLoadingNominee(false);
			setNominees(employeeData);
		}
	}

	async function voteEmployee(employeeId) {
		setLoading(true);
		const eligible = await checkEmployeeEmployeeEligibility();
		if (eligible == false) {
			const web3Modal = new Web3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();

			let contract = new ethers.Contract(
				employeeContractAddress,
				Employee.abi,
				signer
			);
			const transaction = await contract.voteForEmployeeOfTheMonth(employeeId);
			let tx = await transaction.wait();
			let event = tx.events[0];
			setLoading(false);
			setLoading(false);
			Swal.fire({
				title: "Success",
				text: "Vote Recorded Successfully",
				icon: "success",
				showConfirmButton: false,
				timer: 2000,
				background: "#241c2d",
			});
		} else {
			setLoading(false);
			Swal.fire({
				title: "Danger",
				text: "You are not eligible to vote",
				icon: "error",
				showConfirmButton: false,
				timer: 2000,
				background: "#241c2d",
			});
		}
	}

	async function checkEmployeeEmployeeEligibility() {
		const { month } = formInput;
		const provider = new ethers.providers.JsonRpcProvider(
			`https://rpc.ankr.com/polygon_mumbai`
		);
		const votingContract = new ethers.Contract(
			employeeContractAddress,
			Employee.abi,
			provider
		);
		const data = await votingContract.hasVoted(month, users.account);
		return await data;
	}
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
						<h1 className="text-xl font-semibold text-white">
							Voting &#38; Governance
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							Every month an employee is vote us taking accross departments to select
							the employee of the month
						</p>
					</div>
					<div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
						<button
							onClick={() => {
								navigate("/add-proposal");
							}}
							type="button"
							className="inline-flex items-center justify-center text-[#30253f] rounded-md border border-transparent bg-[#9A76D9] px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#bd94eb] focus:outline-none focus:ring-2  focus:ring-offset-2 sm:w-auto"
						>
							Create Proposal
						</button>
					</div>
				</div>

				<section className="rounded-3xl shadow-2xl bg-[#1d1921] mt-8  transition hover:border-pink-500/10 hover:shadow-pink-500/10">
					<div className="p-8 text-center sm:p-12">
						<p className="text-sm font-semibold uppercase tracking-widest text-white">
							Select Voting Month
						</p>

						<div className="sm:col-span-3">
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-400"
							></label>
							<div className="mt-1">
								<select
									onChange={(e) =>
										updateFormInput({ ...formInput, month: e.target.value })
									}
									autoComplete="country-name"
									className="block pl-4 w-full mt-8 h-12 rounded-lg text-white shadow-sm bg-[#1b171d] border border-gray-600 sm:text-sm"
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
						</div>

						<button
							onClick={() => {
								viewNominees();
							}}
							className="mt-8 inline-flex items-center justify-center w-full rounded-full bg-[#9A76D9] py-4 text-sm font-bold text-white shadow-xl"
						>
							{loadingNominee && (
								<img className="animate-spin mr-3   w-5 h-5" src={spinner} />
							)}
							View Nominiees
						</button>
					</div>
				</section>

				{nominees.length > 0 && (
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
												Vote
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{nominees.map((employe, index) => (
											<tr key={employe?.id}>
												<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 md:pl-0">
													{employe?.name}
												</td>

												<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
													{shortenAddress(employe?.walletAddress)}
												</td>
												<td className="whitespace-nowrap py-4 px-3 text-sm text-white">
													{employe?.rank === 2 ? "Team Member" : ""}
													{employe?.rank === 1 ? "Team Lead" : ""}
													{employe?.rank === 3 ? "Engineering Manager" : ""}
												</td>

												<td className="relative whitespace-nowrap py-4 pl-3 pr-4  text-sm font-medium sm:pr-6 md:pr-0">
													<button
														onClick={() => {
															voteEmployee(employe?.id);
														}}
														className="text-[#9A76D9] hover:text-[#9A76D9]"
													>
														Vote Employee<span className="sr-only">, {employe.name}</span>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Voting;
