import axios from "axios";
import React, { useContext } from "react";
import Swal from "sweetalert2";
import { UserContext } from "../contexts/userContext";
import { useRouter } from "next/router";


interface TotalPriceProps {
  selectedDay: string;
  selectedTime: string;
  selectedDuration: number;
  selectedPrice: number | null;
  selectedPriceForm: number | null
  selectedPista: number | null;
  onClose: () => void;
}

const TotalPrice: React.FC<TotalPriceProps> = ({
  selectedDay,
  selectedTime,
  selectedDuration,
  selectedPrice,
  selectedPriceForm,
  selectedPista,
  onClose
}) => {
  type UserContextType = React.ContextType<typeof UserContext>;
  const { dataUser } = useContext<UserContextType>(UserContext);
  const router = useRouter();
  
  if (!selectedDay || !selectedTime || !selectedDuration || selectedPrice === null || selectedPrice <= 0 || selectedPista === null) {
    return null;
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    console.log("Formulario enviado");
    console.log("selectedPista:", selectedPista);
    console.log("selectedTime:", selectedTime);
    console.log("dataUser?.user.id:", dataUser?.user.id);
    console.log("selectedDuration:", selectedDuration);
    console.log("selectedDay:", selectedDay);
    console.log("selectedPrice:", selectedPriceForm);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/reservations/create", {
        data: {
          pistas_id: selectedPista,
          start_time: selectedTime,
          user_id: dataUser?.user.id,
          end_time: calculateEndTime(selectedTime, selectedDuration),
          reservation_date: selectedDay,
          price: selectedPriceForm,
        }
      }, {
        headers: {
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${dataUser?.token}`,
        },
      });

      console.log("Respuesta de la API:", response.data);

      if(response.data.error){
        Swal.fire({
          title: "Ops...",
          text: `No se ha podido realizar la reserva. ${response.data.error}`,
          icon: "error",
        });
      } else {
        onClose();
        Swal.fire({
          title: "¡Reserva confirmada!",
          text: "Tu reserva se ha realizado con éxito.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            router.reload();
          }
        });
        
      }
    } catch (error: any) {
      console.error("Error al realizar la reserva:", error);

      if (error.response) {
        Swal.fire({
          title: "Ops...",
          text: "No se ha podido realizar la reserva. Inicia sesión primero.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Ops...",
          text: "No se ha podido realizar la reserva. Por favor, inténtalo de nuevo.",
          icon: "error",
        });
      }
    }
  };
  
  // Función para calcular la hora de finalización
  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-2 mt-5 flex justify-end">
      <form onSubmit={handleSubmit} className="flex flex-col w-full px-6">
        <h3 className="flex text-xl font-medium italic text-gray-700 mb-1 text-right border-b w-full justify-end border-b-gray-300">
          Precio Total
        </h3>
        <div className="flex items-center justify-between w-full mt-3">
          <button
            className="bg-gray-800 py-2 text-white font-bold px-4 rounded-full border border-gray-600 hover:opacity-85 w-2/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-padel-green"
            type="submit"
          >
            Confirmar Reserva
          </button>
          <div className="flex items-baseline justify-end">
            <span className="text-5xl font-bold italic text-padel-green">{selectedPrice?.toFixed(2)}</span>
            <span className="ml-1 text-xl text-gray-700">€</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TotalPrice;
