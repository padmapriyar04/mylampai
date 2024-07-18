import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const StreakSection = () => {
	const days = [30, 31, 30];

	const MonthCalendarComponent = (props : { d: number}) => {
		const d = props.d;
		const arr = [...Array(d)].fill(0);

		return (
			<div className="grid grid-cols-5 gap-1 h-fit">
				{arr.map((value, index) => (
					<div
						className="w-5 h-5 bg-gray-200 rounded-md"
						key={index}></div>
				))}
			</div>
		);
	};

	return (
		<div className="w-[100%] mt-2 bg-white rounded-lg shadow-md p-5">
			<div className="flex justify-between items-center">
				<div className="font-bold text-lg">Apr 2024 - Jun 2024</div>
				<div className="flex gap-4">
					<div className="border-2 border-gray-300 p-2 rounded-full text-gray-500">
						<FaChevronLeft />
					</div>
					<div className="border-2 border-gray-300 p-2 rounded-full text-gray-200">
						<FaChevronRight />
					</div>
				</div>
			</div>
			<div className="flex mt-5 justify-around">
				{days.map((d, index) => (
					<MonthCalendarComponent
						d={d}
						key={index}
					/>
				))}
			</div>
			<div className="flex gap-5 mt-5 text-sm font-semibold">
				<div className="flex gap-3 items-center justify-center">
					<div className="flex gap-1">
						<div className="w-4 h-4 bg-[#91E1B9] rounded-md"></div>
						<div className="w-4 h-4 bg-[#00BE64] rounded-md"></div>
						<div className="w-4 h-4 bg-[#008746] rounded-md"></div>
						<div className="w-4 h-4 bg-[#004623] rounded-md"></div>
					</div>
					<div className="text-gray-600">Questions</div>
				</div>
				<div className="flex gap-2">
					<div className="flex justify-center items-center border-2 border-gray-500 rounded-md px-[4px]">
						<FaStar className="text-[11px] text-green-600" />
					</div>
					<div className="text-gray-400">POTD Question</div>
				</div>
			</div>
			<div className="text-gray-500 flex gap-5 mt-2 font-semibold text-sm">
				<div>
					Current Streak: <span className="text-black">0</span>
				</div>
				<div>
					Max Streak: <span className="text-black">0</span>
				</div>
				<div>
					Global Max Streak: <span className="text-black">45</span>
				</div>
			</div>
		</div>
	);
};

export default StreakSection;