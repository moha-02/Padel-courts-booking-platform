import React from 'react';
import Image from 'next/image';
import { FormatDate } from '../common/FormatDate';
import GoogleMapsButton from './GoogleMaps';

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  reservation_date: string;
  price:  string
  pista: {
    nombre: string;
    club: {
      name: string;
      img: string;
      calle: string;
      zip: string;
      numero: string;
      localidad: string;
      contact_number: string;
    };
  };
}

interface BookingDetailsProps {
  selectedBooking: Booking;
  courtP: number;
}

const icocoCalendar = (<svg className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);
const iconoX = (<svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const iconoV = (<svg className="h-5 w-5 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" /><path d="M5 12l5 5l10 -10" /></svg>
);

export default function BookingDetails({ selectedBooking, courtP }: BookingDetailsProps) {
  const currentDate = new Date();
  const reservationDate = new Date(`${selectedBooking.reservation_date}T${selectedBooking.end_time}`);
  const status = currentDate > reservationDate ? "Finalizado" : "Activo";

  return (
    <div>
      <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-10 bg-[url('../public/images/modal-bg.jpg')] md:bg-cover bg-center w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-white underline underline-offset-4 decoration-padel-green pb-10 text-center">
          Detalles de la reserva
        </h2>
      </div>
      <div className="px-2 md:px-4 py-5 sm:px-6 bg-gray-50">
        <div className="bg-white px-10 md:px-5  py-3  absolute top-20 md:top-28 md:inset-x-32 rounded-lg border border-gray-300">
          <div className='flex flex-row border-b border-b-gray-300 pb-5 pt-2 items-center'>
            {icocoCalendar}
            <div className='ml-5'>
              <h2 className='uppercase font-bold text-lg'>Pádel</h2>
              <p>{FormatDate(selectedBooking.reservation_date)} {selectedBooking.start_time.slice(0, 5)} - {selectedBooking.end_time.slice(0, 5)}</p>
            </div>
          </div>
          <div className='grid grid-cols-3 mt-5 text-center'>
            <div>
              <p className="font-semibold">Tipo de Pista</p>
              <p>Dobles, Exterior</p>
            </div>
            <div>
              <p className="font-semibold">Pista</p>
              <p>{selectedBooking.pista.nombre}</p>
            </div>
            <div>
              <p className="font-semibold">Precio</p>
              <p>{selectedBooking.price}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white px-1 md:px-5 py-3 sm:px-6 rounded-lg border border-gray-300 mt-32 md:mx-28">
          <div className="grid grid-cols-2 pb-1 pt-1 items-center text-center">
            <p className="font-semibold">Partido Privado</p>
            <p className={`text-${status === 'Activo' ? 'green' : 'red'}-500 flex items-center ml-10 md:ml-20 font-semibold`}>
              {status === "Finalizado" && iconoX}
              {status === "Activo" && iconoV}
              {status}
            </p>
          </div>
        </div>

        <div className="bg-white px-1 md:px-5 py-3 sm:px-6 rounded-lg border border-gray-300 mt-2 md:mt-5 md:mx-28">
          <div className="flex flex-row pb-3 pt-3 items-center">
            <Image 
              src={`${process.env.NEXT_PUBLIC_URL_BACKEND}${selectedBooking.pista.club.img}`} 
              className="mx-3 flex w-28 h-20 md:w-32 md:max-h-20 rounded-xl border border-black" 
              alt="imgPista" 
              width={200}
              height={100}
            />
            <div className="flex ml-5 items-center">
              <div>
                <h2 className="uppercase font-bold">{selectedBooking.pista.club.name}</h2>
                <p className="hidden md:block">{selectedBooking.pista.club.calle}, {selectedBooking.pista.club.numero}, {selectedBooking.pista.club.zip}, {selectedBooking.pista.club.localidad}</p>
                <p className='text-gray-500 font-semibold'>{selectedBooking.pista.club.contact_number}</p>
              </div>
              <GoogleMapsButton address={`${selectedBooking.pista.club.calle}, ${selectedBooking.pista.club.numero}, ${selectedBooking.pista.club.zip}, ${selectedBooking.pista.club.localidad}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
