import Link from 'next/link';
import navData from '@/components/navbar/navLinks.json'
import { usePathname } from "next/navigation";
import Image from 'next/image';

export default function NavItems(props:any){
    const pathname = usePathname();
    return (
        <div className={`flex flex-row transition w-full h-7 pt-4 gap-6 md:gap-3 text-xl font-semibold grayscale text-[#737373] hover:grayscale-0 hover:text-[#8C52FF] hover:duration-300 ${pathname == navData[props.index].Link ?'grayscale-0 text-[#8C52FF]': ''} items-center`}>
            <div className={`w-2 h-6 hidden md:inline `}><Image src="/sidebar/navbarslider.svg" alt="slider" height={10} width={10} className={`${pathname == navData[props.index].Link ? 'block' : 'hidden'} w-3/4 `} /></div>
            <div className='w-7 h-full flex items-center pt-4'><Image height={100} width={100} alt='icon' src={props.icon} /></div>
            <Link href={props.Link} className='pt-4'>{props.name}</Link>
        </div>
    );
}