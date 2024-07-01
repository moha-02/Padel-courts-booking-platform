import Image from 'next/image';

interface BookingProps{
    imgSrc: string
    name: string 
    reservation_date: string
    timeInit: string 
    timeFinish: string 
    location: string 
    court: string
}

export default function BookingsUser( { imgSrc, name, reservation_date, timeInit ,timeFinish, location, court }: BookingProps) {

        const iconoUbi = (<svg className="h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        );
        const iconoHora = (<svg className="h-4 w-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>
        );
        const iconoPelota= (<svg className="h-4 w-4 text-gray-900"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="9" />    <path d="M6 5.3a9 9 0 0 1 0 13.4" />    <path d="M6 5.3a9 9 0 0 1 0 13.4" transform="rotate(180 12 12)" />  </svg>
        );
        const iconEye= (<svg className="h-4 w-4 text-gray-900"  fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        );


      return (
        <>
            <td className="pt-5 md:pb-5 w-full h-full md:w-2/5 text-center">
            <Image 
            src={imgSrc} 
            className="mx-3 flex md:mx-10 xl:mx-24 h-36   md:w-72 md:h-40 rounded-xl border border-black" 
            alt="imgPista"
            content='fill' 
            width={200}
            height={200}
            />
            </td>
            <td className="mt-5 md:pl-14 pl-5 md:w-2/5">
                <p className="text-4xl font-bold pb-3">{name}</p>
                <div className="flex pb-1 items-center">
                    {iconoHora}
                    <p className="text-md ml-2 font-semibold">{reservation_date} / {timeInit.slice(0, 5)} - {timeFinish.slice(0, 5)}</p>
                </div>
                <div className="flex items-center">
                    {iconoUbi}
                    <p className="text-md pb-1 ml-2">{location}</p>
                </div>
                <div className="flex items-center">
                    {iconoPelota}
                    <p className="text-md ml-2">Pista {court}</p>
                </div>
            </td>
        </>
    );
}
