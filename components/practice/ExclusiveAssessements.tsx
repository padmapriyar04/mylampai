"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from 'react';
import Image from 'next/image';

interface ExclusiveAssementsType {
	text: string;
	imgURL: string;
	bgColor: string;
}

const ExclusiveAssessements = (props: { exclusiveAssements: ExclusiveAssementsType[] }) => {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const exclusiveAssements = props.exclusiveAssements;

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			const containerWidth = scrollContainerRef.current.clientWidth;
        	let cardWidth;
			if (window.innerWidth >= 1024) { // For lg and xl screens
				cardWidth = containerWidth / 3;
			} else { // For smaller screens
				cardWidth = containerWidth / 2;
			}
			scrollContainerRef.current.scrollBy({
				left: -cardWidth,
				behavior: 'smooth',
			});
		}
	};

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			const containerWidth = scrollContainerRef.current.clientWidth;
			let cardWidth;

			if (window.innerWidth >= 1024) { // For lg and xl screens
				cardWidth = containerWidth / 3;
			} else { // For smaller screens
				cardWidth = containerWidth / 2;
			}
			scrollContainerRef.current.scrollBy({
				left: cardWidth,
				behavior: 'smooth',
			});
		}
	};

	const CardComponent = ({ data }: { data: ExclusiveAssementsType }) => {
		const { text, imgURL, bgColor } = data;

		return (
			<div className="w-[100%] h-full bg-white rounded-2xl shadow-slate-300 shadow-md">
				<div
					style={{ backgroundColor: bgColor }}
					className="rounded-lg h-[60%] relative">
					<Image
						alt="exclusive assessment"
						width={100}
						height={100}
						src={imgURL}
						className="h-[70%] max-w-[70%] absolute right-5 bottom-0"
					/>
				</div>
				<p className="font-bold text-xl h-auto w-[50%] mt-3 ml-5 flex items-center">{text}</p>
			</div>
		);
	};

	return (
		<div>
			<div className="flex justify-between">
				<div className="font-bold text-lg">Exclusive Assessments</div>
				<div className="flex gap-4">
					<button onClick={scrollLeft}>
						<FaChevronLeft />
					</button>
					<button onClick={scrollRight}>
						<FaChevronRight />
					</button>
				</div>
			</div>
			<div
				ref={scrollContainerRef}
				className="flex justify-start mt-4 w-full h-[300px] overflow-x-auto scroll-snap-x-mandatory snap-x no-scrollbar"
			>
				{exclusiveAssements.map((value, index) => (
					<div
						key={index}
						className="flex-shrink-0 w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 h-full p-2 snap-start"
					>
						<CardComponent data={value} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ExclusiveAssessements;