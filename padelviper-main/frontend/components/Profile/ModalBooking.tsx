import React, { useEffect, useState } from "react";
import CloseButton from "../common/CloseButton";
import axios from "axios";
import BookingDetails from "./ModalBookingDetails";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedBooking?: Booking | null;
}

interface Booking {
  id: string;
  start_time: string;
  end_time: string;
  reservation_date: string;
  price: string
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

export default function ModalBooking({ isVisible, onClose, selectedBooking }: ModalProps) {
  const [courtP, setCourtP] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        if (selectedBooking && selectedBooking.id) {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/pricepista/${encodeURIComponent(selectedBooking.id)}`;
  
          const result = await axios.get(apiUrl, {
            headers: {
              Accept: 'application/vnd.api+json',
            },
          });
          console.log(result.data);

          const currentDate = new Date();
          const [startHours, startMinutes, startSeconds] = selectedBooking.start_time.split(':').map(Number);
          const [endHours, endMinutes, endSeconds] = selectedBooking.end_time.split(':').map(Number);
          
          // Set start time
          currentDate.setHours(startHours, startMinutes, startSeconds);
          const startTime = currentDate.getTime();

          // Set end time
          const endDate = new Date(currentDate);
          endDate.setHours(endHours, endMinutes, endSeconds);
          const endTime = endDate.getTime();

          // Calculate duration in hours with decimals
          const durationHours = (endTime - startTime) / (1000 * 60 * 60);
          console.log('Duration in hours:', durationHours);

          const startHour = currentDate.getHours();
          console.log('Start hour:', startHour);
          
          // Define time ranges and corresponding prices
          const ranges = [
            { start: 8, end: 13, price: result.data.prange1 },
            { start: 13, end: 18, price: result.data.prange2 },
            { start: 18, end: 23, price: result.data.prange3 }
          ];
        
          // Find the price range corresponding to the start hour
          const selectedRange = ranges.find(range => startHour >= range.start && startHour < range.end);
        
          if (selectedRange && selectedRange.price !== undefined) {
            setCourtP(selectedRange.price * durationHours);
          } else {
            console.log("No hay precio");
            console.log(selectedRange);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [selectedBooking]);

  return (
    <>
      {isVisible && selectedBooking && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-gray-80 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-4xl sm:w-full">
            <CloseButton onClose={onClose} />
            <BookingDetails selectedBooking={selectedBooking} courtP={courtP} />
          </div>
        </div>
      )}
    </>
  );
}
