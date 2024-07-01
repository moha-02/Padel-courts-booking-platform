import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from "../contexts/userContext";
import { FormatDate } from "../common/FormatDate";
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Input from "../common/Input";
import { useForm } from 'react-hook-form';
import UserStatsFormFirsTime from './UserStatsFormFirsTime';


export default function UserStats(){

    const iconLvl = <svg className="w-5 h-5 text-padel-green ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/></svg>
    const iconNoLvl = <svg className="w-5 h-5 text-gray-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20"><path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/></svg>
    const iconLat= <svg className="h-4 w-4 text-gray-600"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="18" y2="6.01" />  <path d="M18 13l-3.5 -5a4 4 0 1 1 7 0l-3.5 5" />  <polyline points="10.5 4.75 9 4 3 7 3 20 9 17 15 20 21 17 21 15" />  <line x1="9" y1="4" x2="9" y2="17" />  <line x1="15" y1="15" x2="15" y2="20" /></svg>
    const iconUser= <svg className="h-6 w-6 text-black"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="7" r="4" />  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
   
    type Level = 1 | 2 | 3 | 4 | 5 ;

    interface StatsUser {
        birth: string;
        gameType: string
        hand: string
        height: string
        playTime: string
        racketBrand: string
        weight: string
      }

      type UserContextType = React.ContextType<typeof UserContext>;
      const router = useRouter()
      const { register } = useForm();
      const { dataUser, updateUser } = useContext<UserContextType>(UserContext);
      const [statsUser, setStatsUser] = useState<StatsUser | null>(null);
      const [isEditing, setIsEditing] = useState(false);
      const [hasChanges, setHasChanges] = useState<boolean>(false);
      const [isFirstTimeUser, setIsFirstTimeUser] = useState(Boolean)

   

      const renderStars = (level: Level): JSX.Element[] => {
        const starArray: JSX.Element[] = [];
        for (let i = 0; i < level; i++) {
          starArray.push(iconLvl);
        }
        for (let i = level; i < 5; i++) {
          starArray.push(iconNoLvl);
        }
        return starArray;
      };
      
      const level = dataUser?.user.nivel as Level | undefined; 
      const stars = level ? renderStars(level):[];

      const handleSubmitDelete = async () => {
        console.log(dataUser);
        console.log(dataUser?.token);

        const result = await Swal.fire({
          title: '¿Estás seguro que desesas eliminar el usuario?',
          text: "¡Perderas todo tu registr y no podras volver!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6 ',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
        });
    
        if(result.isConfirmed){
          try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/user/delete/${dataUser?.user.id}`,
            {
              headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                Authorization: `Bearer ${dataUser?.token}`,
              },
              withCredentials: true,
            }
          );
    
          if (response.status === 200) {
            console.log("Delete user correcto");
            console.log(response.data);
            updateUser(null);
            router.push("/")
            Swal.fire({
              text: "Has eliminado el usuario correctamente",
              icon: "warning",
            });
          }
        } catch (error) {
          console.error(error);
        }
      }};
  
      useEffect(() => {
          (async () => {
              try {
                  const userId = dataUser && dataUser.user ? dataUser.user.id : '';
                  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/userstats/${encodeURIComponent(userId)}`;
  
                  const result = await axios.get(apiUrl, {
                      headers: {
                          Accept: 'application/vnd.api+json',
                          "Authorization": `Bearer ${dataUser?.token}`
                      },
                  });
  
                  setStatsUser(result.data);
                  console.log(result.data);
                  
              } catch (error) {
                  console.error('Error fetching data:', error);
              }
          })();
      }, [dataUser]);

      const handleSubmit = async () => {
    
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/userstats/${dataUser?.user.id}/update`,
            {
              birth: statsUser?.birth,
              weight: statsUser?.weight,
              height: statsUser?.height,
              playTime: statsUser?.playTime,
              hand: statsUser?.hand,
              gameType: statsUser?.gameType,
              racketBrand: statsUser?.racketBrand,
            },
            {
              headers: {
                "Content-Type": "application/vnd.api+json",
                Accept: "application/vnd.api+json",
                Authorization: `Bearer ${dataUser?.token}`,
              },
              withCredentials: true,
            }
          );
    
          if (response.status === 200) {
            console.log("Update user correcto");
            console.log(response.data);
            setIsEditing(false);
            Swal.fire({
              text: "Has editado tu perfil correctamente",
              icon: "success",
            });
            setHasChanges(false);
          }
        } catch (error) {
          console.error(error);
        }
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
      
        if (e.target.tagName.toLowerCase() === 'select') {
          setStatsUser((prevStatsUser: StatsUser | null) => ({
            ...prevStatsUser!,
            [name]: value,
          }));
        } else {
          setStatsUser((prevStatsUser: StatsUser | null) => ({
            ...prevStatsUser!,
            [name]: e.target.value,
          }));
        }
        
        setHasChanges(true);
      };
      
      const toggleEdit = () => {
        setIsEditing(!isEditing);
      };

      useEffect(() => {
        // Verificar si el usuario tiene datos de estadísticas
        if (!statsUser) {
            setIsFirstTimeUser(true);
        }
    }, [statsUser]);
    
      return (
         !statsUser?.height && isFirstTimeUser ?(
          <UserStatsFormFirsTime 
              setStatsUser={setStatsUser} 
              setIsFirstTimeUser={setIsFirstTimeUser} 
          />
      ) : 
        (statsUser &&(
        <div className="relative overflow-x-auto shadow-md mt-1 md:mt-5">
          <div className="flex items-center text-sm md:text-2xl font-bold text-black uppercase rounded-t-lg bg-gray-400 border-2 border-gray-500 p-2">
            {iconUser}
            <h2 className="pl-3 py-2">Tus Detalles Personales</h2>
          </div>
          <div className="bg-white pb-10">
          <div className="flex items-center justify-between px-2 md:px-32 pt-5">
            <div>
              <p className="text-4xl md:text-5xl md:ml-8 font-bold text-gray-800">{dataUser?.user.name} {dataUser?.user.surname}</p>
            </div>
            {isEditing ? (
              <div className="ml-8 mt-3">
                <button
                  disabled={!hasChanges}
                  type="button"
                  onClick={handleSubmit}
                  className=" hover:text-black text-gray-600 font-semibold border-b-2 border-b-padel-green py-1 px-4 rounded"
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div className="ml-8 mt-3 ">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="  hover:text-black text-gray-600 font-semibold border-b-2 border-b-padel-green py-2 px-4 rounded"
                >
                  Cambiar Datos
                </button>
              </div>
            )}
            </div>
              <div className="mt-4 px-2 md:px-32">
                <p className="w-2/4 md:w-2/4 rounded-full px-2 md:px-5 font-bold text-sm md:text-xl bg-gray-600 text-padel-green flex py-2 items-center">
                  Nivel
                  <div className="ml-1 md:ml-4 flex">
                    {stars.map((star, index) => (
                      <span key={index}>{star}</span>
                    ))}
                  </div>
                </p>
              </div>

            <form action="">
              {/* Acerca de mí */}
              <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-600 py-2 border-b border-gray-700 px-2 mx-5">
                <p className="md:px-16 text-sm font-bold uppercase">Acerca de mí</p>
              </h3>
              <div className="py-2 px-6 md:px-48 flex items-center justify-between">
                <strong className="text-gray-500 w-full">Fecha Nacimiento:</strong>
                <Input
                  register={register}
                  type="date"
                  label="birth"
                  id="birth"
                  name="birth"
                  visualLabel=""
                  placeholder="Ingrese su fecha de nacimiento"
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  value={statsUser.birth}
                />
              </div>
              <div className="py-2 px-6 md:px-48  flex items-center justify-between">
                <strong className="text-gray-500 w-full">Peso<span className="text-gray-500 ml-1 text-xs">(kg) :</span></strong>
                <Input
                  register={register}
                  type="number"
                  label="weight"
                  id="weight"
                  name="weight"
                  visualLabel=""
                  placeholder="Ingrese su peso en kg"
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  value={statsUser.weight}
                /> 
              </div>
              <div className="py-2 px-6 md:px-48  flex items-center justify-between">
                <strong className="text-gray-500 w-full">Altura<span className="text-gray-500 ml-1 text-xs">(cm) :</span></strong>
                <Input
                  register={register}
                  type="number"
                  label="height"
                  id="height"
                  name="height"
                  visualLabel=""
                  placeholder="Ingrese su altura en cm"
                  disabled={!isEditing}
                  onChange={handleInputChange}
                  value={statsUser.height}
                />
              </div>
            </div>
             {/* Estadísticas de pádel */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-gray-600 py-2 border-b border-gray-700 px-2 mx-5">
                <p className="md:px-16 text-sm font-bold uppercase">Estadísticas de pádel</p>
              </h3>
              <div className="py-2 px-6 md:px-48 mt-1">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-500 w-full">Tiempo jugando al pádel:</strong>
                  <div className="flex items-center">
                    <Input
                      register={register}
                      type="text"
                      label="playTime"
                      id="playTime"
                      name="playTime"
                      visualLabel=""
                      placeholder=""
                      disabled={!isEditing}
                      onChange={handleInputChange}
                      value={statsUser.playTime}
                    />
                    <span className="ml-2 text-gray-500">meses</span>
                  </div>
                </div>
              </div>
              <div className="py-2 px-6 md:px-48 mt-1">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-500 w-full">Mano hábil:</strong>
                  <select
                    {...register("hand")}
                    id="hand"
                    name="hand"
                    className="`border-gray-300  focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out "
                    value={statsUser.hand}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </select>
                </div>
              </div>

              <div className="py-2 px-6 md:px-48 mt-1">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-500 w-full">Tipo de juego:</strong>
                  <select
                    {...register("gameType")}
                    id="gameType"
                    name="gameType"
                    className="`border-gray-300  focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 text-sm block w-full p-2.5 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out "
                    value={statsUser.gameType}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Dobles">Dobles</option>
                  </select>
                </div>
              </div>
              <div className="py-2 px-6 md:px-48 mt-1">
                <div className="flex items-center justify-between">
                  <strong className="text-gray-500 w-full">Marca de pala:</strong>
                  <Input
                    register={register}
                    type="text"
                    label="racketBrand"
                    id="racketBrand"
                    name="racketBrand"
                    visualLabel=""
                    placeholder=""
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    value={statsUser.racketBrand}
                  />
                </div>
              </div>
            </div>
              {/* Información general */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-600 py-2 border-b border-gray-700 px-2 mx-5">
                  <p className="md:px-16 text-sm font-bold uppercase">Información general</p>
                </h3>
                <p className="py-2 px-6 md:px-48 flex items-center justify-between">
                  <strong className="text-gray-500 w-full">Número de teléfono móvil:</strong> {dataUser?.user.tel}
                </p>
                <p className="py-2 px-6 md:px-48 flex items-center justify-between">
                  <strong className="text-gray-500 w-full">Email:</strong> {dataUser?.user.email}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-600 py-2 border-b border-gray-700 px-2 mx-5">
                  <p className="md:px-16 text-sm font-bold uppercase">Eliminar Cuenta</p>
                </h3>
                <p className="py-2 px-6 md:px-32 grid grid-cols-2 gap-5 md:gap-0 mt-3 items-center">
                  <strong className="text-gray-500 w-full">Borrar usuario existente:</strong>
                  <button
                    type="button" 
                    className="bg-gray-100 border border-red-600 hover:bg-red-500 hover:text-black text-gray-500 py-1 w-2/4 px-2 font-semibold rounded"
                    onClick={handleSubmitDelete}
                  >
                    Eliminar
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )
      ));
      
}