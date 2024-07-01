import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from './BookingCard';
import { UserContext } from "../contexts/userContext";
import ModalBooking from './ModalBooking';
import Image from 'next/image';

export default function BookingsUser() {
  const iconoAnt = <svg className="h-6 w-6 text-gray-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <polyline points="15 18 9 12 15 6" /></svg>
  const iconoSig = <svg className="h-6 w-6 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
 
    type UserContextType = React.ContextType<typeof UserContext>;
  
    interface Booking {
        id: string;
        start_time: string 
        end_time: string
        reservation_date: string
        price: string
        pista: {
          nombre: string
          club: {
            name: string
            img: string
            calle: string
            zip: string
            numero: string
            localidad: string
            contact_number: string
          }
        } 
      }
    
    const [bookings, setBooking] = useState<Booking[]>([]);
    const { dataUser, updateUser } = useContext<UserContextType>(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null >(null);
    const pageSize = 3;
    const [page, setPage] = useState(0);

    
    useEffect(() => {
      (async () => {
        try {
          const userId = dataUser && dataUser.user ? dataUser.user.id : ''; //Si no pones le datauser peta pq el encoder no puede recibir un null
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/myReservations/${encodeURIComponent(userId)}`;
    
          const result = await axios.get(apiUrl, {
            headers: {
              Accept: 'application/vnd.api+json',
              "Authorization": `Bearer ${dataUser?.token}`
            },
          });
    
            // Filtrar reservas pasadas
            const filteredBookings = result.data.reservations.filter((booking: Booking) => {
              const reservationDate = new Date(`${booking.reservation_date}T${booking.end_time}`);
              return reservationDate <= new Date();
          });

          console.log(result.data.reservations);
          setBooking(filteredBookings);
          console.log(filteredBookings);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })();
    }, [dataUser]);

      // Obtener las reservas actuales según la página seleccionada
      const currentPageBookings = bookings.slice(page * pageSize, (page + 1) * pageSize);

      const handlePageChange = (newPage: number) => {
          setPage(newPage);
      };

    const handleViewBooking = (booking: Booking) => {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    
    return (
        <div className="relative overflow-x-auto shadow-md mt-1 md:mt-5">
        <div className="flex items-center text-2xl font-bold text-black uppercase rounded-t-lg bg-gray-400 border-2 border-gray-500 p-2">
          <h2 className="pl-3 py-2">Historial de tus partidos</h2>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <tbody className="divide-y divide-gray-200">
          {currentPageBookings.map((booking) => (
            <tr key={booking.id} className="bg-gray-300 text-black grid grid-cols-2 gap-x-5 md:table w-full pt-2 pb-2 opacity-70">
              <BookingCard
                key={booking.id}
                imgSrc={`${process.env.NEXT_PUBLIC_URL_BACKEND}${booking.pista.club.img}`}
                name={booking.pista.club.name}
                reservation_date={booking.reservation_date}
                timeInit={booking.start_time}
                timeFinish={booking.end_time}
                location={booking.pista.club.calle}
                court={booking.pista.nombre}
              />
                <td className="pb-4 flex felx-row md:mt-20 md:mr-2">
                  <button className="ml-4 w-56 md:w-20 p-1 px-4 text-sm bg-gray-700 text-black font-semibold rounded-full hover:opacity-80 flex items-center"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <p className="text-md ml-10 md:ml-1 font-bold">Datos</p>
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
        </table>
          {/* Agregar controles de paginación */}
          <div className="flex justify-center mt-4">
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-l"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                >
                    {iconoAnt}
                </button>
                <p className="bg-gray-200 text-gray-700 font-semibold py-2 px-5">
                    Página {page + 1} de {Math.ceil(bookings.length / pageSize)}
                </p>
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-r"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={(page + 1) * pageSize >= bookings.length}
                >
                    {iconoSig}
                </button>
            </div>
        <ModalBooking isVisible={isModalOpen} onClose={handleCloseModal} selectedBooking={selectedBooking} />
      </div>
    );
  };
