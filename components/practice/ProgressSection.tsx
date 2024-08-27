import { CircularProgressbarWithChildren } from "react-circular-progressbar";

const progressSection = () => {
	return (
		<div className="w-[full] bg-white rounded-lg shadow-md p-5">
			<div className="flex justify-around border-b pb-5">
				<div className="w-[30%]">
					<CircularProgressbarWithChildren
						value={50}
						styles={{ path: { stroke: "#8C52FF",
						strokeLinecap:"round"
						 } }}>
						<p className="font-bold text-sm">6</p>
						<p className="font-bold text-sm">Assessment</p>
						<p className="font-bold text-sm">Taken</p>
					</CircularProgressbarWithChildren>
				</div>
				<div className="w-[30%]">
					<CircularProgressbarWithChildren
						value={27}
						styles={{ path: { stroke: "#8C52FF",
						strokeLinecap:"round"
						} }}>
						<p className="font-bold text-sm">27</p>
						<p className="font-bold text-sm">Questions</p>
						<p className="font-bold text-sm">Solved</p>
					</CircularProgressbarWithChildren>
				</div>
			</div>
			<div className="flex justify-around mt-5">
				<div className="font-bold text-lg w-[40%] pb-10 pl-5">Badges</div>
				<div className="font-bold text-lg w-[40%] pb-10 pl-5 border-l-2">Focused Area</div>
			</div>
		</div>
	);
};

export default progressSection;