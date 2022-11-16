import { React, Fragment, useContext, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { shortenAddress } from "../../lib/utils";

const EmployeeView = ({
	showModal,
	setShowModal,
	employeeDetails,
	imgArray,
}) => {
	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setShowModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-[39px] bg-[#241c2d] px-8 pt-5 pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-12">
								<div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
									<button
										type="button"
										className="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										onClick={() => setShowModal(false)}
									>
										<span className="sr-only">Close</span>
										<XMarkIcon className="h-6 w-6  text-gray-500" aria-hidden="true" />
									</button>
								</div>
								<div className="sm:flex sm:items-center justify-center">
									<div className="mt-3 text-center sm:mt-0  sm:text-center">
										<Dialog.Title
											as="h3"
											className="text-4xl underline font-medium mt-4 font-tcbbold leading-6 text-white"
										>
											Employee Details
										</Dialog.Title>
									</div>
								</div>
								<div className="grid grid-cols-2 mt-5 gap-4">
									<div>
										<div className="flex  justitfy-start flex-col">
											<div className="text-sm text-left font-semibold text-gray-500 ">
												Employee Name
											</div>
											<div className="text-sm text-left flex font-medium text-gray-100 mt-1">
												{" "}
												{employeeDetails?.name}{" "}
											</div>
										</div>
										<div className="flex  justitfy-start mt-3 flex-col">
											<div className="text-sm text-left font-semibold text-gray-500 ">
												Employee Role
											</div>
											<div className="text-medium text-left flex font-medium text-gray-100 mt-1">
												{employeeDetails?.rank === 2 ? "Team Member" : ""}
												{employeeDetails?.rank === 1 ? "Team Lead" : ""}
												{employeeDetails?.rank === 3 ? "Engineering Manager" : ""}
											</div>
										</div>
										<div className="flex  justitfy-start mt-3 flex-col">
											<div className="text-sm text-left font-semibold text-gray-500 ">
												Employee Address
											</div>
											<div className="text-medium text-left flex font-medium text-gray-100 mt-1">
												{" "}
												{shortenAddress(employeeDetails?.walletAddress)}{" "}
												<DocumentDuplicateIcon className="ml-4 text-white cursor-pointer w-5 h-5" />{" "}
											</div>
										</div>
									</div>

									<div>
										<div className="text-medium text-left flex font-medium text-gray-100 mt-1">
											Employee NFT's
										</div>
										<div className="grid grid-cols-3 gap-4">
											{imgArray.map((image, index) => (
												<div
													key={index}
													className="rounded-[39px]  mt-8 h-[100px]  flex flex-col "
												>
													<img
														className="h-full w-full"
														src={`https://aqua-just-grouse-834.mypinata.cloud/ipfs/QmWUvWPmcEX56H1nsahAjCMy9LcB3EA4fA2rHggxFjHSzk/${image}.png`}
														alt="image"
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default EmployeeView;
