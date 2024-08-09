
import ExclusiveAssessements1 from "../../../components/mentorship/ExclusiveAssessements1";
import ExclusiveAssessements from "../../../components/mentorship/ExclusiveAssessements";


import exclusiveAssements from "@/components/mentorship/data/exclusiveAssessments";
import exclusiveAssements1 from "@/components/mentorship/data/exclusiveAssessments1";


const Mentorship = () => {
	return (
		<div className="bg-[#F1EAFF] p-5 min-h-screen flex flex-col lg:flex-row justify-between z-0">
			<div className="w-full mb-5 lg:mb-0 ">
				<div className="mt-5">
					<ExclusiveAssessements exclusiveAssements={exclusiveAssements} />
				</div>
				<div className="mt-5">
					<ExclusiveAssessements1 exclusiveAssements={exclusiveAssements1} />
				</div>
			</div>
			
		</div>
	);
};
export default Mentorship;
