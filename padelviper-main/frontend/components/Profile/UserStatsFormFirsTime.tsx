import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';

interface StatsUser {
    birth: string;
    gameType: string;
    hand: string;
    height: string;
    playTime: string;
    racketBrand: string;
    weight: string;
}

interface UserStatsFormProps {
    setStatsUser: (stats: StatsUser) => void;
    setIsFirstTimeUser: (isFirstTime: boolean) => void;
}

export default function UserStatsFormFirsTime({ setStatsUser, setIsFirstTimeUser }: UserStatsFormProps) {
    const { dataUser } = useContext(UserContext);
    const [formData, setFormData] = useState<StatsUser>({
        birth: '',
        gameType: '',
        hand: '',
        height: '',
        playTime: '',
        racketBrand: '',
        weight: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_URL + `/userstats/${dataUser?.user.id}/store`, 
                {
                    birth: formData.birth,
                    weight: formData.weight,
                    height: formData.height,
                    hand: formData.hand,
                    playTime: formData.playTime,
                    gameType: formData.gameType,
                    racketBrand: formData.racketBrand,
                    user_id: dataUser?.user.id
                }, 
                {
                    headers: {
                        "Content-Type": "application/vnd.api+json",
                        Accept: "application/vnd.api+json",
                        Authorization: `Bearer ${dataUser?.token}`
                    }
                }
            );

            console.log("Respuesta de la API:", response.data);
            setStatsUser(formData);
            setIsFirstTimeUser(false);
        } catch (error: any) {
            console.error("Error al enviar las estadísticas del usuario:", error);
        }
    };

    return (
        <div className="max-w-md mt-5 mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Ingrese sus estadísticas personales</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        name="birth"
                        value={formData.birth}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de juego:</label>
                    <input
                        type="text"
                        name="gameType"
                        value={formData.gameType}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mano hábil:</label>
                    <select
                        name="hand"
                        value={formData.hand}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    >
                        <option value="right">Derecha</option>
                        <option value="left">Izquierda</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Altura (cm):</label>
                    <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tiempo jugando (meses):</label>
                    <input
                        type="number"
                        name="playTime"
                        value={formData.playTime}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Marca de pala:</label>
                    <input
                        type="text"
                        name="racketBrand"
                        value={formData.racketBrand}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Peso (kg):</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-padel-green focus:border-padel-green"
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-padel-green hover:bg-padel-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-padel-green"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}
