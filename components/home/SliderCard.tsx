import Image from "next/image";

interface SliderProp {
    imageUrl: string
}

const SliderCard: React.FC<SliderProp> = ({ imageUrl }) => {
    return (
        <>
            <div className={`bg-url(${imageUrl}) `}>

            </div>
        </>
    )
}

export default SliderCard;