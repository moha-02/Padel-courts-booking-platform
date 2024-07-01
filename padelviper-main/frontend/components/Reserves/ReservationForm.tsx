import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

interface ReservationFormProps {
  selectedDay: string;
  selectedTime: string;
  selectedDuration: number;
  selectedPista: number | null;
  handleTimeChange: (inicio: string) => void;
  handleDurationChange: (duration: number) => void;
  handlePistaChange: (pista_id: number) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  filteredTimes: { inicio: string; duracion: number }[];
  filteredDurations: number[];
  filteredPistas: { pista_id: number; pista_name: string }[];
  courtPistasIds: number[];
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  selectedDay,
  selectedTime,
  selectedDuration,
  selectedPista,
  handleTimeChange,
  handleDurationChange,
  handlePistaChange,
  handleSubmit,
  filteredTimes,
  filteredDurations,
  filteredPistas,
  courtPistasIds,
}) => {

  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);

  const formattedDate = (rawDate: string): string => {
    const date = new Date(rawDate);
    const day = date.getDate();
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return `${day} de ${month} del ${year}`;
};
  const fechaOriginal = selectedDay;
  const fechaFormateada = formattedDate(fechaOriginal);

  return (
    <form  onSubmit={handleSubmit} className="mt-2">
      <div className="mb-3">
        <label htmlFor="selected-days" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha Seleccionada: 
        </label>
       <p className="text-2xl font-bold">{fechaFormateada}</p>
      </div>

     
        <div className="mb-2">
          <label htmlFor="selected-times" className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona la hora:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Array.from(new Set(filteredTimes.map((avail) => avail.inicio))).map((inicio, index) => (
              <button
                key={index}
                value={inicio}
                className={`py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:text-black sm:text-sm ${
                  selectedTime === inicio ? "bg-padel-green border-gray-600" : "text-black"
                }`}
                onClick={() => handleTimeChange(inicio)}
              >
                {inicio}
              </button>
            ))}
          </div>
        </div>
  

      {selectedTime && (
        <div className="mb-2">
          <label htmlFor="selected-durations" className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona la duración:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {filteredDurations.map((duration, index) => (
              <button
                key={index}
                className={`py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  selectedDuration === duration ? "bg-padel-green border-gray-600" : "text-black"
                }`}
                onClick={() => handleDurationChange(duration)}
                disabled={!filteredTimes.some((avail) => avail.duracion === duration)}
              >
                {duration} min
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDuration && (
        <div className="mb-4">
          <label htmlFor="selected-pistas" className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona la pista:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {filteredPistas.map((avail, index) => (
              <button
                key={index}
                className={`py-2 px-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  selectedPista === avail.pista_id ? "bg-padel-green border-gray-600" : "text-black"
                }`}
                onClick={() => handlePistaChange(avail.pista_id)}
                disabled={!courtPistasIds.includes(avail.pista_id)}
              >
                {avail.pista_name}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default ReservationForm;
