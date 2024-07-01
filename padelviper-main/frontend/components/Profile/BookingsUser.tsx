import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from './BookingCard';
import { UserContext } from "../contexts/userContext";
import ModalBooking from './ModalBooking';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

export default function BookingsUser() {

    const router = useRouter();
    const iconoAnt = <svg className="h-6 w-6 text-gray-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="15 18 9 12 15 6" /></svg>
    const iconoSig = <svg className="h-6 w-6 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
    
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
    const {dataUser, updateUser } = useContext<UserContextType>(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
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
              return reservationDate >= new Date();
          });

          console.log(result.data.reservations);
          setBooking(filteredBookings);
          console.log(filteredBookings);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })();
    }, [dataUser]);

    const deleteBooking = async (uID: string, bID: string, fechaReserva: string) => {
      if (!dataUser) return;
   
      const result = await Swal.fire({
        title: '¿Estás seguro que deseas eliminar la reserva?',
        text: `¡No podrás cancelar la reserva 12h antes de ${fechaReserva}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      });
      

            
      if (result.isConfirmed) {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/delete/${encodeURIComponent(uID)}/${encodeURIComponent(bID)}`;
          const deleteResult = await axios.delete(apiUrl, {
            headers: {
              Accept: 'application/vnd.api+json',
              Authorization: `Bearer ${dataUser?.token}`,
            },
          });
          
          console.log(deleteResult.data);
          Swal.fire(
            'Reserva cancelada',
            'La reserva ha sido cancelada exitosamente.',
            'success'
          ).then(() => {
            router.reload()
          });;
        
        } catch (error) {
          console.error('Error deleting booking:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al cancelar la reserva. Por favor, inténtalo de nuevo más tarde.',
            'error'
          );
        }
      }
    } 

    // Obtener las reservas actuales según la página seleccionada
    const currentPageBookings = bookings.slice(page * pageSize, (page + 1) * pageSize);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleViewBooking = (booking : Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    
      return (
        <div className="relative overflow-x-auto shadow-md mt-1 md:mt-5">
            <div className="flex items-center text-2xl font-bold text-black uppercase rounded-t-lg bg-gray-400 border-2 border-gray-500 p-2">
                <svg className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h2 className="pl-3 py-2">Gestiona tus reservas</h2>
            </div>
            {/* Renderizar las reservas de la página actual */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody className="divide-y divide-gray-200 ">
                    {currentPageBookings.map((booking) => (
                        <tr key={booking.id} className="bg-gray-50 text-black grid grid-cols-2 gap-x-5 md:table w-full pt-2 pb-2">
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
                                <button className="ml-5 w-20 p-1 px-2 text-sm bg-gray-900 text-white font-semibold  rounded-full hover:opacity-80"
                                    onClick={() => dataUser && deleteBooking(dataUser.user.id, booking.id, booking.reservation_date)}
                                >
                                    Cancelar
                                </button>
                                <button className="ml-2 w-20 p-1 px-4 text-sm bg-padel-green text-black font-semibold rounded-full hover:opacity-80 flex items-center"
                                    onClick={() => handleViewBooking(booking)}
                                >
                                    <svg className="h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <p className="text-md ml-1">Ver</p>
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
