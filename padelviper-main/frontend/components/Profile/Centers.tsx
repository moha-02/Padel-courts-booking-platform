import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';

interface CentrosParcial {
    calle: string;
    contact_number: string;
    horario: string;
    id: number;
    img: string;
    localidad: string;
    name: string;
    numero: string;
    pais: string;
    zip: string;
}

export default function Centers() {

    const iconOk = (
        <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    );
    const iconNo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-900"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>

    const { dataUser, updateUser } = useContext(UserContext);
    const route = useRouter()
    const [listaCentrosParcial, setListaCentrosParcial] = useState<CentrosParcial[]>([]);
    const [permisos, setPermisos] = useState(true)

    useEffect(() => {
        (async () => {
            if(dataUser?.user.acces === "admin"){
                setPermisos(false)
            }   
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/parcialsclubs`;
                const result = await axios.get(apiUrl, {
                    headers: {
                        Accept: 'application/vnd.api+json',
                        "Content-Type": "application/vnd.api+json",
                        "Authorization": `Bearer ${dataUser?.token}`
                    },
                });
                console.log(result.data);
                setListaCentrosParcial(result.data);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [dataUser?.token]);

    const handleSubmit = async (id:number, name: string, calle: string, zip: string, numero: string, localidad: string,  pais: string, horario: string, contact_number: string, img: string) => {
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/club/${dataUser?.user.id}/store`;
            const result = await axios.post(apiUrl, {
              name: name,
              calle: calle,
              zip: zip,
              numero: numero,
              localidad: localidad,
              pais: pais,
              horario: horario,
              contact_number: contact_number,
              img: img
            }, {
              headers: {
                Accept: 'application/vnd.api+json',
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${dataUser?.token}`
              }
            });
        
            console.log(result.data);
        
            if (result.data.error) {
              Swal.fire({
                title: "Ops...",
                text: `No se ha podido crear el centro: ${result.data.error}`,
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "¡Reserva confirmada!",
                text: "El centro se ha guardado con éxito.",
                icon: "success",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const deleteApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/parcialclub/${id}/delete`;
                  const deleteResult = await axios.delete(deleteApiUrl, {
                    headers: {
                      Accept: 'application/vnd.api+json',
                      "Content-Type": "application/vnd.api+json",
                      "Authorization": `Bearer ${dataUser?.token}`
                    }
                  });
        
                  console.log(deleteResult.data);
                  route.reload();
                }
              });
            }
        
          } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al guardar el centro.",
              icon: "error",
            });
          }
        };
    

    const handleDenied = async(id: number) =>  {
        const result = await Swal.fire({
            title: '¿Vas a eliminar la solicitud de centro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6 ',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
          });
      
          if(result.isConfirmed){
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/parcialclub/${id}/delete`;
            const result = await axios.delete(apiUrl, {
                headers: {
                    Accept: 'application/vnd.api+json',
                    "Content-Type": "application/vnd.api+json",
                    "Authorization": `Bearer ${dataUser?.token}`
                }
            });
    
            console.log(result.data);
            route.reload()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      }
    }


    return (
        <div className="relative overflow-x-auto shadow-md mt-1 md:mt-5">
               {!permisos && ( // Add this block
                <div className="bg-red-500 rounded-md font-semibold text-white text-center p-2">
                    No tienes permisos
                </div>
            )}
            <div className="flex items-center text-sm md:text-2xl font-bold text-white uppercase rounded-t-lg bg-gray-600 border-2 border-gray-500 p-2">
                <h2 className="pl-3 py-2">Registrar Clubs</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-5 p-5 bg-gray-200">
                {listaCentrosParcial.map((center) => {
                    const imageUrl = `${process.env.NEXT_PUBLIC_URL_BACKEND}${center.img}`;
                    console.log('Image URL:', imageUrl);
    
                    return (
                        <div key={center.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg overflow-hidden shadow-lg bg-white mb-5">
                            <div className="grid grid-cols-1">
                                <Image
                                    src={imageUrl}
                                    alt={center.name}
                                    width={300}
                                    height={200}
                                    className='object-cover px-6 pt-5 rounded-xl'
                                />
                               <div className="px-6 py-4">
                                    <div className="font-bold text-2xl mb-2">{center.name}</div>
                                    <div className="text-gray-700 text-base">
                                        <span className="font-semibold">Horario:</span> {center.horario}
                                    </div>
                                    <div className="text-gray-700 text-base">
                                        <span className="font-semibold">Calle:</span> {center.calle}, {center.numero} {center.localidad}, {center.pais} {center.zip}
                                    </div>
                                    <div className="text-gray-700 text-base">
                                        <span className="font-semibold">Teléfono de contacto:</span> {center.contact_number}
                                    </div>
                                </div>
                                <div className='flex justify-center gap-5 pb-5'>
                                    <button
                                        onClick={() => handleSubmit(center.id, center.name, center.calle, center.zip, center.numero, center.localidad, center.pais, center.horario, center.contact_number, center.img)}
                                        className="bg-green-200 text-white py-1 px-3 rounded-md hover:opacity-60"
                                    >
                                        {iconOk}
                                    </button>
                                    <button
                                        onClick={() => handleDenied(center.id)}
                                        className="bg-red-200 text-white py-1 px-3 rounded-md hover:opacity-60"
                                    >
                                        {iconNo}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
}
