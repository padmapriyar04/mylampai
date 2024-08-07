
import AllAssessments from "../../../components/practice/AllAssessments";
import ExclusiveAssessements from "../../../components/practice/ExclusiveAssessements";


import exclusiveAssements from "@/data/practise/exclusiveAssessments";
import allAssessements from "@/data/practise/allAssessments";

const Mentorship = () => {
	return (
		<div className="bg-[#F1EAFF] p-5 min-h-screen flex flex-col lg:flex-row justify-between z-0">
			<div className="w-full lg:w-[60%] mb-5 lg:mb-0 ">
				<div className="mt-5">
					<ExclusiveAssessements exclusiveAssements={exclusiveAssements} />
				</div>
				<div className="mt-5">
					<AllAssessments allAssessements={allAssessements} />
				</div>
			</div>
			
		</div>
	);
};
export default Mentorship;
