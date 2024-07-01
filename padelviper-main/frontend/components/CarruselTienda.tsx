import React, { useState, useEffect } from 'react';
import Image from 'next/image';


export default function CarruselTienda() {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = [
        "/images/bolas2.jpg",
        "/images/zapas1.jpg",
        "/images/pala2.jpg",
        "/images/ropa1.jpg",
        "/images/paletero1.jpg"
    ];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((activeIndex + 1) % images.length);
      }, 5000)
  
      return () => clearInterval(interval);
    }, [activeIndex, images.length]);

    
  return (
    <>
    <h2  className=" text-3xl xl:text-5xl font-bold text-center mb-10 pt-5"> <span className=" underline underline-offset-8 decoration-padel-green">P A D E L V I P E R</span><span className=" text-3xl md:text-5xl  text-gray-900"> |</span> <span className=" text-sm xl:text-2xl justify-center items-center text-center
    text-gray-900"> STORE</span></h2>
    <div className="flex bg-gray-900">
    <div className="mt-1 mb-20">
      <div className="md:grid md:gap-7  pt-5  ">
        <div className="hidden md:block">
            <a href='/tienda'> 
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={600}
              height={400}
              className={`h-auto max-w-full rounded-lg ml-auto mr-auto pt-10 opacity-85 transition-all duration-300 cursor-pointer hover:opacity-100 ${index === activeIndex ? 'block' : 'hidden'}`}
            />
          ))}
          </a>
        </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 px-10 py-1">
                <div>
                <p className='text-xl font-medium text-white text-center pb-2 underline underline-offset-8 decoration-padel-green'>Equipamineto</p>
                <Image
                    className="h-auto max-w-full rounded-lg opacity-85 transition-all duration-300 cursor-pointer hover:opacity-100"
                    src="/images/bolas2.jpg"
                    alt=""
                    width={600}
                    height={400}
                />
                </div>
                <div>
                <p className='text-xl font-medium text-white text-center pb-2 underline underline-offset-8 decoration-padel-green'>Calzado</p>
                <Image
                    className="h-auto max-w-full rounded-lg opacity-85 transition-all duration-300 cursor-pointer hover:opacity-100"
                    src="/images/zapas1.jpg"
                    alt=""
                    width={600}
                    height={400}
                />
                </div>
                <div>
                <p className='text-xl font-medium text-white text-center pb-2 underline underline-offset-8 decoration-padel-green'>Equipación</p>
                <Image
                    className="h-auto max-w-full rounded-lg opacity-85 transition-all duration-300 cursor-pointer hover:opacity-100"
                    src="/images/ropa1.jpg"
                    alt=""
                    width={600}
                    height={400}
                />
                </div>
                <div>
                <p className='text-xl font-medium text-white text-center pb-2 underline underline-offset-8 decoration-padel-green'>Palas</p>
                <Image
                    className="h-auto max-w-full rounded-lg opacity-85 transition-all duration-300 cursor-pointer hover:opacity-100"
                    src="/images/pala2.jpg"
                    alt=""
                    width={600}
                    height={400}
                />
                </div>
                <div>
                <p className='text-xl font-medium text-white text-center pb-2 underline underline-offset-8 decoration-padel-green'>Accesorios</p>
                <Image
                    className="h-auto max-w-full rounded-lg  opacity-85 transition-all duration-300 cursor-pointer hover:opacity-100"
                    src="/images/paletero1.jpg"
                    alt=""
                    width={600}
                    height={400}
                />
                </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
