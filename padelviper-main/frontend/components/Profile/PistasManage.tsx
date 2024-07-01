import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import { useRouter } from 'next/router';
import { Tooltip } from "@nextui-org/tooltip";
import { PulseLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import Router from 'next/router';

interface Court {
  id: number;
  name: string;
}

interface Pista {
  id: number;
  nombre: string;
  clubs_id: number;
}

interface PistaPrice {
    pista_id: number
    prange1: string;
    prange2: string;
    prange3: string;
  };



export default function PistasManage() {
  const { dataUser, updateUser } = useContext(UserContext);
  const route = useRouter();
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtPistasMap, setCourtPistasMap] = useState<{ [key: number]: Pista[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nombrePista, setNombrePista] = useState<string>('');
  const [courtId, setCourtId] = useState<number>(0);
  const [tooltipContent, setTooltipContent] = useState<PistaPrice | null>(null);
  const [selectedPistaId, setSelectedPistaId] = useState(Number)



  useEffect(() => {
    const fetchCourtsAndPistas = async () => {
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs`, {
          headers: {
            Accept: "application/vnd.api+json",
          },
        });

        const courtsData = result.data;
        setCourts(courtsData);

        const courtPistasMap: { [key: number]: Pista[] } = {};

        for (const court of courtsData) {
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
            (pista: Pista) => pista.clubs_id === court.id
          );

          courtPistasMap[court.id] = filteredPistas;
        }

        setCourtPistasMap(courtPistasMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courts and associated pistas:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchCourtsAndPistas();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, nombre: string, id: number) => {
    e.preventDefault(); // Evitar que el formulario se envíe automáticamente

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/pista/${dataUser?.user.id}/store`;
      const result = await axios.post(apiUrl, {
        nombre: nombre,
        clubs_id: id
      }, {
        headers: {
          Accept: 'application/vnd.api+json',
          "Content-Type": "application/vnd.api+json",
          "Authorization": `Bearer ${dataUser?.token}`
        }
      });

      console.log("Nombre de la pista:", nombre);
      console.log("ID del club:", id);
      console.log("Respuesta del servidor:", result.data);
      
      if(result.data.error){
        Swal.fire({
          title: "Ops...",
          text: `No se has podido crear la pista ${result.data.error}`,
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "¡Reserva confirmada!",
          text: "Tu pista se ha guardado con éxito.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            route.reload();
          }
        });
        
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePistaClick = async (pistaId: number) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/pricepista/${pistaId}`;
      const result = await axios.get(apiUrl, {
        headers: {
          Accept: 'application/vnd.api+json'
        }
      });
  
      setTooltipContent(result.data as PistaPrice);
      setSelectedPistaId(pistaId);
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };
  
  if (loading) {
    <div className="flex justify-center items-center h-64">
          <PulseLoader color="#E9FD6F" size={35} />
        </div>
  }
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md mt-1 md:mt-5">
      <div className="flex items-center text-sm md:text-2xl font-bold text-white uppercase rounded-t-lg bg-gray-600 border-2 border-gray-500 p-2">
        <h2 className="pl-3 py-2">Registrar Pistas</h2>
      </div>
  
      <form className="grid grid-cols-2 w-full p-3 bg-gray-200" onSubmit={(e) => handleSubmit(e, nombrePista, courtId)}>
        <div className="m-3 border hover:shadow-inner bg-white hover:border-gray-400 rounded-lg p-1 mt-8 items-center">
          <label htmlFor="input1" className="text-sm text-gray-400 pl-1">
            Club
          </label>
          <select
            className="border-gray-300 focus:border-b-2 focus:border-padel-green text-gray-900 text-sm block w-full py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
            id="input1"
            name="input1"
            required
            onChange={(e) => setCourtId(parseInt(e.target.value))}
          >
            {courts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>
        <div className='m-3 border hover:shadow-inner bg-white hover:border-gray-400 rounded-lg p-1 mt-8'>
          <label htmlFor="input2" className="text-sm text-gray-400 pl-1">
            Nombre Pista
          </label>
          <input
            type='text'
            className=" focus:border-padel-green focus:border-b-2 text-gray-900 block w-full px-2 py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
            id="input2"
            onChange={(e) => setNombrePista(e.target.value)}
          />
        </div>
        <button type="submit" className='bg-gray-800 text-white rounded-lg py-2 px-20 font-semibold mx-auto col-span-2'>Crear</button>
      </form>
  
      <div className="grid grid-cols-2 gap-5 p-5 bg-white">
        {courts.map(court => (
          <div key={court.id} className="mb-4 px-10">
            <h3 className="font-bold text-xl mb-5">{court.name}</h3>
            {courtPistasMap[court.id] && courtPistasMap[court.id].length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {courtPistasMap[court.id].map(pista => (
                  <Tooltip
                  content={tooltipContent ? `Mañanas ${tooltipContent.prange1}€/h, Tardes ${tooltipContent.prange2}€/h, Noches ${tooltipContent.prange3}€/h` : ""}
                  className={`bg-black text-white rounded-lg px-4 ${selectedPistaId === pista.id ? 'visible' : 'hidden'}`}
                >
                  <div key={pista.id} className="py-2 px-2 border rounded-md shadow-sm focus:outline-none sm:text-sm cursor-pointer hover:bg-gray-100" onClick={() => handlePistaClick(pista.id)}>
                    <button className=''>{pista.nombre}</button>
                  </div>
                </Tooltip>
                ))}
              </div>
            ) : (
              <div className='py-2 px-2 border rounded-md shadow-sm focus:outline-none sm:text-sm'>
                No hay pistas disponibles para este club
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
}
