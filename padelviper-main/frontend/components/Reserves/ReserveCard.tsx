import React from 'react';
import Button from "../common/Button";
import Image from 'next/image';

export default function CourtCard({
    id,
    name,
    direction,
    image,
    availableHours,
    onClick
}: {
    id?: number;
    name: string | null;
    direction: string | null;
    image: string;
    availableHours: string[];
    onClick: (hour: string, id?: number) => void; 
}) {
    const iconoUbi = (
        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-2xl bg-gray-900 flex flex-col h-full">
            <div className="relative w-full h-48 md:h-72">
                <Image
                    src={image}
                    alt="Centro Img"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-70"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" 
                />
                {name && (
                    <div className="absolute top-24 left-4 md:top-60">
                        <span className="text-white font-bold text-lg md:text-md xl:text-xl md:px-4 py-1 md:py-2 rounded-lg truncate">
                            {name}
                        </span>
                    </div>
                )}
            </div>
            <div className="py-4 mt-1 flex-1 flex flex-col justify-between">
                <div className="px- flex items-center mb-1 pl-2 text-white text-xs md:text-sm">
                    {iconoUbi}
                    <p className="text-white text-xs md:text-sm pl-2">{direction}</p>
                </div>
                <div className="flex justify-center mt-auto">
                    <div className="flex flex-wrap mt-2 justify-center w-full mb-2 ">
                        {availableHours.map((hour, index) => (
                         <Button
                         key={index}
                         className="mt-2 mx-2 bg-transparent hover:bg-grey text-white font-medium py-2 px-1 border-b border-grey hover:border-b-padel-green hover:text-padel-green"
                         onClick={() => onClick(hour, id)}  // Modificado para pasar el id del tribunal
                     >
                         {hour}
                     </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
