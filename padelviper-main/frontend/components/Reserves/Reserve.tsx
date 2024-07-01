import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/userContext";
import ReserveCard from "./ReserveCard";
import ModalReserve from "./ModalReserve";
import { useRouter } from 'next/router';
import { PulseLoader } from 'react-spinners';

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

interface Court {
  id: number;
  name: string;
  direction: string;
  image: string;
}

export default function Reserve() {
  const iconoX = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>;
  
  const { dataUser } = useContext(UserContext);
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<Availability>({ Disponibles: [] });
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
  const [courtPistasMap, setCourtPistasMap] = useState<{ [key: number]: number[] }>({});
  const [courtPistasIds, setCourtPistasIds] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [uniqueHours, setUniqueHours] = useState<string[]>([]);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedHoraForm, setSelectedHoraForm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs`, {
          headers: {
            Accept: "application/vnd.api+json",
          },
        });
        setCourts(result.data);
  
        const courtPistasMap: { [key: number]: number[] } = {};
        for (const court of result.data) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/pistas`,
            {
              headers: {
                Accept: "application/vnd.api+json",
              },
              params: {
                clubs_id: court.id,
              },
            }
          );
          
          const filteredPistas = response.data.filter(
            (pista: any) => pista.clubs_id === court.id
          );
          const courtPistasIds = filteredPistas.map((pista: any) => pista.id);
          setCourtPistasIds(courtPistasIds);
          courtPistasMap[court.id] = filteredPistas.map((pista: any) => pista.id);
        }
        setCourtPistasMap(courtPistasMap);
      } catch (error) {
        console.error("Error fetching courts and associated pistas:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  
  useEffect(() => {
    const hoursSet = new Set<string>();
    availabilities.Disponibles.forEach((avail) => {
      hoursSet.add(avail.inicio);
    });
    const uniqueHoursArray = Array.from(hoursSet);
    uniqueHoursArray.sort();
    setUniqueHours(uniqueHoursArray);
  }, [availabilities]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const fechaHoy = new Date();
        const formattedDate = fechaHoy.toISOString().split('T')[0];
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/available?fecha=${formattedDate}`;
        const result = await axios.get<Availability>(apiUrl, {
          headers: {
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${dataUser?.token}`,
          },
        });
        console.log(result.data)
        setAvailabilities(result.data);
        setSelectedDay(formattedDate);
      } catch (error) {
        console.error("Error fetching availabilities:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dataUser]);

  const handleCourtClick = async (courtId: number, hour: string) => {
    setSelectedCourt(courtId);
    setSelectedHour(hour);
    const courtPistas = courtPistasMap[courtId] || [];
    setCourtPistasIds(courtPistas);
    setSelectedHoraForm(hour);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd);
    const fecha = data.date;
    const hora = data.time;
    
    setIsLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/available?fecha=${data?.date}&hora_inicio=${data?.time}&duracion=${data?.duration}`;
      const result = await axios.get<Availability>(apiUrl, {
        headers: {
          Accept: "application/vnd.api+json",
        },
      });
      setAvailabilities(result.data);
      setIsFiltered(true);
      setSelectedDay(fecha.toString());
      setSelectedHoraForm(hora.toString());
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetFilters = async () => {
    setIsLoading(true);
    try {
      const fechaHoy = new Date();
      const formattedDate = fechaHoy.toISOString().split('T')[0];
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservations/available?fecha=${formattedDate}`;
      const result = await axios.get<Availability>(apiUrl, {
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${dataUser?.token}`,
        },
      });
      setAvailabilities(result.data);
      setIsFiltered(false);
      router.reload();
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  }
  
  const onClose = () => {
    setSelectedCourt(null)
    setSelectedHoraForm("")
    setSelectedHour("")
  }
  return (
    <div className="bg-gray-100 pb-20 pt-5">
      <form
        className="flex flex-wrap items-center h-auto mb-14 bg-white rounded-lg shadow-lg p-3 xl:w-4/6 min-[320px]:w-4/5 sm:w-3/5 md:w-3/5 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center w-full md:w-1/4 m-3 border hover:shadow-inner hover:border-gray-400 rounded-lg p-1">
          <label htmlFor="date" className="text-sm text-gray-400 flex pl-1 mr-5 items-center">
            Fecha:
          </label>
          <input
            type="date"
            name="date"
            id="date"
            min={today.toISOString().split("T")[0]} 
            max={maxDate.toISOString().split("T")[0]} 
            className="w-full text-center border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
            required
          />
        </div>
        <div className="flex items-center w-full md:w-1/5 m-3 border hover:shadow-inner hover:border-gray-400 rounded-lg p-1">
          <label htmlFor="duration" className="text-sm text-gray-400 flex pl-1 mr-5 items-center">
            Duración <span className="px-1 text-xs">(min)</span>:
          </label>
          <select
            name="duration"
            id="duration"
            className="w-full text-center border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
          >
            <option value="60">60</option>
            <option value="90">90</option>
            <option value="120">120</option>
          </select>
        </div>
        <div className="flex items-center w-full md:w-1/4 m-3 border hover:shadow-inner hover:border-gray-400 rounded-lg p-1">
          <label htmlFor="timeInput" className="text-sm text-gray-400 pl-1 mr-5">
            Hora:
          </label>
          <input
            type="time"
            name="time"
            className="w-full text-center border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
            id="timeInput"
            placeholder="Hora"
            min="09:00"
            max="23:00"
            step="1800"
          />
        </div>
        <div className="flex w-full md:w-1/5 text-center m-3">
          <button
            id="buscarBtn"
            className="btn font-bold w-4/6 bg-gray-800 text-white border-black rounded-lg hover:text-padel-green hover:bg-opacity-95 justify-center py-2"
          >
            Filtrar
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn bg-gray-100 border border-padel-green text-black rounded-lg hover:bg-padel-green hover:opacity-85 ml-1 px-5 py-1"
            >
              {iconoX}
            </button>
          )}
        </div>
      </form>

      <h2 className="text-3xl xl:text-5xl font-bold text-center mt-5 mb-2 md:mb-10">
        <span className="underline underline-offset-8 decoration-padel-green">
          R E S E R V A S
        </span>
        <span className="text-3xl md:text-5xl text-gray-900"> |</span>{" "}
        <span className="text-sm xl:text-2xl justify-center items-center text-center text-gray-900">
          DISPONIBLES
        </span>
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <PulseLoader color="#E9FD6F" size={45} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-5 md:gap-y-18 gap-y-12 items-start h-2/6 px-3 md:px-10">
          {courts.map((court) => (
            <ReserveCard
              key={court.id}
              id={court.id}
              name={court.name}
              direction={court.direction}
              image={`${process.env.NEXT_PUBLIC_URL_BACKEND}${court.image}`}
              availableHours={uniqueHours}
              onClick={(hour: string) => handleCourtClick(court.id, hour)}
            />
          ))}
        </div>
      )}
      
      <ModalReserve
        isOpen={selectedCourt !== null}
        onClose={onClose}
        courts={courts}
        selectedCourt={selectedCourt}
        availabilities={availabilities}
        courtPistasIds={courtPistasIds}
        selectedDay={selectedDay} 
        selectedHoraForm={selectedHoraForm}
      />
    </div>
  );
}
