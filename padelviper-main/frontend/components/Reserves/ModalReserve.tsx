import axios from "axios";
import React, { useState, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import TotalPrice from "./TotalPrice";

interface ModalReserveProps {
  isOpen: boolean;
  onClose: () => void;
  courts: Court[];
  selectedCourt: number | null;
  availabilities: Availability;
  courtPistasIds: number[];
  selectedDay: string;
  selectedHoraForm: string
}

interface Availability {
  Disponibles: {
    pista_id: number;
    pista_name: string;
    fecha: string;
    inicio: string;
    fin: string;
    duracion: number;
  }[];
}

interface Pista {
  pista_id: number;
  prange1: string;
  prange2: string;
  prange3: string;
}

interface Court {
  id: number;
  name: string;
  direction: string;
  image: string;
  
}

export default function ModalReserve({
  isOpen,
  onClose,
  courts,
  selectedCourt,
  availabilities,
  courtPistasIds,
  selectedDay,
  selectedHoraForm

}: ModalReserveProps) {
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedPista, setSelectedPista] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedPriceForm, setSelectedPriceForm] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  useEffect(() => {
    if(selectedTime === "")
    setSelectedTime(selectedHoraForm)
  })

  useEffect(() => {
    (async () => {
      try {
        if (selectedPista !== null) {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/pricepista`;
          const result = await axios.get(apiUrl, {
            headers: {
              "Content-Type": "application/vnd.api+json",
              Accept: 'application/vnd.api+json',
            },
          });

          console.log(result.data);

          const pistaSeleccionada = result.data.find((pista: Pista) => pista.pista_id === selectedPista);

          if (pistaSeleccionada) {
            const ranges = [
              { start: 8, end: 13, price: parseFloat(pistaSeleccionada.prange1) },
              { start: 13, end: 18, price: parseFloat(pistaSeleccionada.prange2) },
              { start: 18, end: 23, price: parseFloat(pistaSeleccionada.prange3) }
            ];

            const initTime = parseInt(selectedTime, 10);
            const selectedRange = ranges.find(range => initTime >= range.start && initTime < range.end);

            if (selectedRange && selectedRange.price !== undefined) {
              const durationInHours = selectedDuration / 60;
              console.log(`Precio de la pista seleccionada: ${selectedRange.price * durationInHours}`);
              setSelectedPrice(selectedRange.price * durationInHours);
              setSelectedPriceForm(selectedRange.price)
            } else {
              console.log("No hay precio para la hora seleccionada");
            }
          } else {
            console.log("No se encontró la pista seleccionada");
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [selectedPista, selectedTime, selectedDuration]);

  useEffect(() => {
    setSelectedTime("");
    const firstAvailablePista = availabilities.Disponibles.find(avail => avail.fecha === selectedDay && courtPistasIds.includes(avail.pista_id));
    setSelectedPista(firstAvailablePista ? firstAvailablePista.pista_id : null);
  }, [selectedDay, availabilities, courtPistasIds]);

  if (!isOpen) return null;

  const handleTimeChange = (inicio: string) => {
    setSelectedTime(inicio);
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handlePistaChange = (pista_id: number) => {
    setSelectedPista(pista_id);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Selected Price:", selectedPrice);
    console.log("Selected Price 2:", selectedPriceForm);
  };

  const filteredTimes = availabilities.Disponibles.filter(
    (avail) => avail.fecha === selectedDay && courtPistasIds.includes(avail.pista_id)
  );

  const filteredDurations = [60, 90, 120];

  const filteredPistas = availabilities.Disponibles.filter(
    (avail) =>
      avail.fecha === selectedDay &&
      avail.inicio === selectedTime &&
      avail.duracion === selectedDuration &&
      courtPistasIds.includes(avail.pista_id)
  );

  const handdleClose = () => {
    onClose()
    setSelectedTime("")
    setSelectedPrice(null)
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-4 sm:p-8 md:p-10 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 my-4">
        <div className="flex justify-end">
          <button onClick={handdleClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="availability-form ">
          <h2 className="text-2xl md:text-3xl lg:text-4xl shadow-inner font-bold text-white flex bg-cover bg-center rounded-lg justify-center text-center bg-opacity-65 py-6 md:py- lg:py-8 px-4 md:px-6 lg:px-10"  
              style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_URL_BACKEND}${courts.find((court) => court.id === selectedCourt)?.image})`, opacity : 0.9 }}>
            <span className="py-3 px-3 bg-black opacity-70 rounded-xl"> Reserva en {courts.find((court) => court.id === selectedCourt)?.name}</span>
          </h2>

          <ReservationForm
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            selectedPista={selectedPista}
            handleTimeChange={handleTimeChange}
            handleDurationChange={handleDurationChange}
            handlePistaChange={handlePistaChange}
            handleSubmit={handleSubmit}
            filteredTimes={filteredTimes}
            filteredDurations={filteredDurations}
            filteredPistas={filteredPistas}
            courtPistasIds={courtPistasIds}
          />

          <TotalPrice
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            selectedPrice={selectedPrice}
            selectedPriceForm={selectedPriceForm}
            selectedPista={selectedPista}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
