import {
	AcademicCapIcon,
	CheckBadgeIcon,
	ClockIcon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const Credit = () => {
	return (
		<div className="py-10">
			<div className=" mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8 ">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-white">Benefits & Credits</h1>
						<p className="mt-2 text-sm text-gray-500">
							Allows employee to purchase the following benefits with theor respective
							employee tokens
						</p>
					</div>
				</div>
				<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					<button className="block rounded-xl border border-gray-800 p-8 shadow-xl bg-[#1d1921]  transition hover:border-pink-500/10 hover:shadow-pink-500/10">
						<div className="flex justify-between items-center">
							<ClockIcon className="text-white w-12 h-12" />
							<div className="text-white text-xl font-bold">1.34 EMP</div>
						</div>

						<h2 className="mt-4 text-xl text-left font-bold text-white">
							Request Time Off
						</h2>

						<p className="mt-1 text-sm text-left text-gray-300">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo
							possimus adipisci distinctio alias voluptatum blanditiis laudantium.
						</p>
					</button>
					<button className="block rounded-xl border border-gray-800 p-8 shadow-xl bg-[#1d1921]  transition hover:border-pink-500/10 hover:shadow-pink-500/10">
						<div className="flex justify-between items-center">
							<CheckBadgeIcon className="text-white w-12 h-12" />
							<div className="text-white text-xl font-bold">1.34 EMP</div>
						</div>

						<h2 className="mt-4 text-xl text-left font-bold text-white">Benefits</h2>

						<p className="mt-1 text-sm text-left text-gray-300">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo
							possimus adipisci distinctio alias voluptatum blanditiis laudantium.
						</p>
					</button>
					<button className="block rounded-xl border border-gray-800 p-8 shadow-xl bg-[#1d1921]  transition hover:border-pink-500/10 hover:shadow-pink-500/10">
						<div className="flex justify-between items-center">
							<UsersIcon className="text-white w-12 h-12" />
							<div className="text-white text-xl font-bold">1.34 EMP</div>
						</div>

						<h2 className="mt-4 text-xl text-left font-bold text-white">
							Schedule a one-on-one
						</h2>

						<p className="mt-1 text-sm text-left text-gray-300">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo
							possimus adipisci distinctio alias voluptatum blanditiis laudantium.
						</p>
					</button>
					<button className="block rounded-xl border border-gray-800 p-8 shadow-xl bg-[#1d1921]  transition hover:border-pink-500/10 hover:shadow-pink-500/10">
						<div className="flex justify-between items-center">
							<AcademicCapIcon className="text-white w-12 h-12" />
							<div className="text-white text-xl font-bold">1.34 MATIC</div>
						</div>

						<h2 className="mt-4 text-xl text-left font-bold text-white">Training</h2>

						<p className="mt-1 text-sm text-left text-gray-300">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo
							possimus adipisci distinctio alias voluptatum blanditiis laudantium.
						</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Credit;
