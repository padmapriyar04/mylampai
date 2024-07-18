import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    usePrevNextButtons
} from './Arrow'
import useEmblaCarousel from 'embla-carousel-react'
import bytedata from '@/app/data/bytesCarousel.json'
import Image from 'next/image'
type PropType = {
    slides: number[]
    options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla max-w-[90vw] mx-auto relative flex-grow">
            <div className="overflow-hidden h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                    {bytedata.map((_, index) => (
                        <div className="embla__slide min-w-0" key={index}>
                            <div className="embla__slide__number flex items-center justify-center h-full"><Image src={bytedata[index].svg} alt="img" height={100} width={100} /></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-center align-center w-full absolute top-[50%] ">
                <button><Image src="/bytes/lfarw.svg" alt="arrow" height={20} width={20} onClick={onPrevButtonClick} /></button>
                <button><Image src="/bytes/rfarw.svg" alt="invarrow" height={20} width={20} onClick={onNextButtonClick} /></button>
            </div>

        </section>
    )
}

export default EmblaCarousel
