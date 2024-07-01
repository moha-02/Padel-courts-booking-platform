import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import Swal from 'sweetalert2';

interface UserList {
    id: number;
    name: string;
    surname: string;
    email: string;
    acces: string;
}

export default function ManageUser() {

    const iconOk = <svg className="h-4 w-4 text-gray-900"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
  </svg>
  
    const { dataUser, updateUser } = useContext(UserContext);
    const [userList, setUserList] = useState<UserList[]>([]);
    const [filteredUserList, setFilteredUserList] = useState<UserList[]>([]);
    const [filterAcces, setFilterAcces] = useState<string>('');
    const [filterEmail, setFilterEmail] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('');
    const [permisos, setPermisos] = useState(true)

    useEffect(() => {
        (async () => {
            if(dataUser?.user.acces === "admin"){
                setPermisos(false)
            }            
            
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/userlist`;
                const result = await axios.get(apiUrl, {
                    headers: {
                        Accept: 'application/vnd.api+json',
                        "Content-Type": "application/vnd.api+json",
                        "Authorization": `Bearer ${dataUser?.token}`
                    },
                });

                console.log(result.data);
                setUserList(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [dataUser?.token]);

    useEffect(() => {
        let filtered = userList;

        if (filterAcces) {
            filtered = filtered.filter(user => user.acces.toString().includes(filterAcces));
        }

        if (filterEmail) {
            filtered = filtered.filter(user => user.email.toLowerCase().includes(filterEmail.toLowerCase()));
        }

        if (sortOrder === 'asc') {
            filtered = filtered.sort((a, b) => a.id - b.id);
        } else if (sortOrder === 'desc') {
            filtered = filtered.sort((a, b) => b.id - a.id);
        }
        setFilteredUserList(filtered);
    }, [filterAcces, filterEmail, sortOrder, userList]);

    const handleRoleChange = (id: number, newRole: string) => {
        // Aquí se puede implementar la lógica para actualizar el rol en el servidor si es necesario
        const updatedUserList = filteredUserList.map((user) => {
            if (user.id === id) {
                return { ...user, acces: newRole };
            }
            return user;
        });
        setFilteredUserList(updatedUserList);
    }

    const handleSubmit = async (id: number, newAccess: string) => {
        try {
            const response = await axios.put(process.env.NEXT_PUBLIC_API_URL + "/user/updateacces", {
                    user_id: id,
                    acces: newAccess
            }, {
                headers: {
                    "Content-Type": "application/vnd.api+json",
                    Accept: "application/vnd.api+json",
                    Authorization: `Bearer ${dataUser?.token}`,
                },
            });
    
            console.log("Respuesta de la API:", response.data);
                Swal.fire({
                    title: "Ok",
                    text: "Se han cambiado los permismos del usuario",
                    icon: "success",
                  });
        } catch (error) {
            console.error('Error al enviar la solicitud POST:', error);
            Swal.fire({
                title: "Mal...",
                text:  `No se ha podido realizar la acion debido a ${error}`,
                icon: "error",
              });
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
                <h2 className="pl-3 py-2">Administrator panel </h2>
            </div>
            <div className="flex flex-row justify-end bg-gray-200 items-center pr-5 ">
                <div className="mr-5 mt-auto">
                    <input
                        type='text'
                        value={filterEmail}
                        onChange={(e) => setFilterEmail(e.target.value)}
                        className="border-gray-300 focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 block w-full px-2 py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                        placeholder='Filtrar por email'
                    />
                </div>
                <div className="mr-5">
                    <label className="mr-2"></label>
                    <select
                        value={filterAcces}
                        onChange={(e) => setFilterAcces(e.target.value)}
                        className="border-gray-300 focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 block w-full px-2 py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                    >
                        <option value="">Todos</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div>
                    <label className="mr-2"></label>
                    <select
                        value={sortOrder}
                        onChange={(e) => {
                            setSortOrder(e.target.value);
                            setFilteredUserList([...filteredUserList]);
                        }}
                        className="border-gray-300 focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 block w-full px-2 py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                    >
                        <option value="">--</option>
                        <option value="asc">Mayor a menor</option>
                        <option value="desc">Menor a mayor </option>
                    </select>
                </div>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Acces</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {filteredUserList.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-2 px-4 border-b">{user.id}</td>
                            <td className="py-2 px-4 border-b">{user.name} {user.surname}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">
                                <select
                                    value={user.acces}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="border-gray-300 focus:border-padel-green border-b-2 focus:border-b-2 text-gray-900 block w-full px-2 py-1 focus:outline-none focus:transition focus:duration-300 focus:ease-in-out"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleSubmit(user.id, user.acces)}
                                    className="bg-green-200 text-white py-1 px-4 rounded-md hover:opacity-60"
                                >
                                    {iconOk}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
