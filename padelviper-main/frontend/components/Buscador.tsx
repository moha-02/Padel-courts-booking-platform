import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./contexts/userContext";
import Swal from "sweetalert2";
import BlurIn from "./commonEfects/blur-in";

interface Court {
  id: number;
  name: string;
  direction: string;
  image: string;
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

export default function Buscador() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");  
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability>({
    Disponibles: [],
  });
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  type UserContextType = React.ContextType<typeof UserContext>;
  const { dataUser, updateUser } = useContext<UserContextType>(UserContext);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    (async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs`,
        {
          headers: {
            Accept: "application/vnd.api+json",
          },
        }
      );
      setCourts(result.data);
    })();
  }, []);

  useEffect(() => {
    const today = new Date();
    const weekFromToday = new Date();
    weekFromToday.setDate(today.getDate() + 7);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    setMinDate(formatDate(today));
    setMaxDate(formatDate(weekFromToday));

    const options: string[] = [];
    for (let hour = 8; hour <= 23; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    setTimeOptions(options);
  }, []);

  useEffect(() => {
    if (courts.length === 0) return; // Evitar llamadas innecesarias a la API

    // Llamada a la API para obtener las disponibilidades
    const fetchAvailabilities = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/available`;
        const result = await axios.get<Availability>(apiUrl, {
          headers: {
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${dataUser?.token}`,
          },
        });
        console.log(result.data);
        setAvailabilities(result.data);
      } catch (error) {
        console.error("Error fetching availabilities:", error);
      }
    };

    fetchAvailabilities();
  }, [courts]);

  const checkAvailability = () => {
    const selectedDate = (document.getElementById('input2') as HTMLInputElement)?.value;
    const selectedTime = (document.getElementById('timeInput') as HTMLInputElement)?.value;
  
    // Verificar si la pista seleccionada está disponible en el día y hora seleccionados
    const isAvailable = availabilities.Disponibles.some(avail => (
      avail.fecha === selectedDate &&
      avail.inicio === selectedTime
    ));
  
    setIsAvailable(isAvailable);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    checkAvailability();
  };

  const renderAvailabilityMessage = () => {
    if (isAvailable === null) {
      return null;
    }
  
    if (isAvailable) {
      Swal.fire({
        title: "¡Hora Disponible!",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else {
      Swal.fire({
        title: "¡Hora No Disponible!",
        text: "La hora seleccionada no está disponible. Por favor, elija otro horario.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  

  if (!isClient) {
    return null;
  }
  return (
    <div className="flex h-auto w-full">
      <div className="flex flex-col justify-center bg-[url('../public/images/fondoblack2.jpg')] md:bg-cover bg-center w-full px-2 md:py-16">
        <div className="text-center py-5 mt-10 mb-10 pb-0">
          <p className="text-4xl md:text-7xl text-white font-bold">
            {t("experienceMessage")}
          </p>
        </div>
  
        <BlurIn 
        word={t("searchMessage")}
        className="flex justify-center md:mt-10 text-xl md:text-4xl text-white font-bold"/>
           
        <form className="flex flex-wrap  xl:h-52 mb-40 mt-5 md:mt-1 bg-white rounded-lg shadow-lg p-3 xl:w-3/6 min-[320px]:w-3/5 sm:w-3/4 md:w-3/4 mx-auto" onSubmit={handleSearch}>
          <div className="w-full md:w-1/3">
            <div className="m-3 border hover:shadow-inner hover:border-gray-400 rounded-lg p-1 mt-8">
              <label htmlFor="input1" className="text-sm text-gray-400 pl-1">
                {t("centerLabel")}
              </label>
              <select
                className="border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm block w-full py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                id="input1"
                name="input1"
                required
              >
                {courts.map((court) => (
                  <option key={court.id} value={court.name}>
                    {court.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          <div className="w-full md:w-1/3">
            <div className="m-3 border hover:shadow-inner hover:border-gray-400 rounded-lg p-1 mt-8">
              <label htmlFor="input2" className="text-sm text-gray-400 pl-1">
                {t("fecha")}
              </label>
              <input
                type="date"
                className="border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm block w-full py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                id="input2"
                placeholder="Fecha"
                required
                min={minDate}
                max={maxDate}
              />
            </div>
          </div>
  
          <div className="w-full md:w-1/3">
            <div className="m-3 border hover:shadow-inner hover:border-gray-400 rounded-lg p-1 mt-8">
              <label htmlFor="timeInput" className="text-sm text-gray-400 pl-1">
                {t("hora")}
              </label>
              <input
                type="time"
                className="border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm block w-full py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                id="timeInput"
                placeholder="Hora"
                required
                min={`00:00`}
                max={`24:00`}
                step={`3600`}
              />
            </div>
          </div>
  
          <div className="w-full text-center mt-3">
            <div className="grid h-9">
              <button
                id="buscarBtn"
                onClick={renderAvailabilityMessage}
                className="btn bg-gray-800 rounded-lg text-white border-black hover:bg-gray-600"
              >
                {t("buscar")}
              </button>
            </div>
            <div
              id="successBuscar"
              className="alert alert-warning py-2 m-1 w-full"
              role="alert"
              style={{ display: "none" }}
            ></div>
            <div
              id="errorBuscar"
              className="alert alert-danger py-2 m-1 w-full"
              role="alert"
              style={{ display: "none" }}
            ></div>
          </div>
        </form>
      </div>
    </div>
  );
}  
