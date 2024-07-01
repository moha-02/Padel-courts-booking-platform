import { useContext, useState } from "react";
import { UserContext } from "../contexts/userContext";
import Input from "../common/Input";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

interface UserFormProps {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}

export default function UserForm({ modalIsOpen, setModalIsOpen }: UserFormProps) {
  const { register, handleSubmit } = useForm();
  const { dataUser, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (dataUser) {
      updateUser({
        ...dataUser,
        user: {
          ...dataUser.user,
          [name]: value,
        },
      });
      setHasChanges(true);
    }
  };

  const onSubmit = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${dataUser?.user.id}/update`,
        {
          name: dataUser?.user.name,
          surname: dataUser?.user.surname,
          email: dataUser?.user.email,
          tel: dataUser?.user.tel,
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
        updateUser(response.data);
        Swal.fire({
          text: "Has editado tu perfil correctamente",
          icon: "success",
        });
        setIsEditing(false);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Swal.fire({
        text: "Hubo un error al actualizar tu perfil. Por favor, intenta nuevamente.",
        icon: "error",
      });
    }
  };

  if (!dataUser) {
    return <div>Regístrate para poder ver tu perfil...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          <li>
            <Input
              register={register}
              type="text"
              label="name"
              id="name"
              name="name"
              visualLabel="Nombre"
              placeholder="Nombre"
              value={dataUser.user.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </li>
          <li>
            <Input
              register={register}
              type="text"
              label="surname"
              id="surname"
              name="surname"
              visualLabel="Apellidos"
              placeholder="Apellidos"
              value={dataUser.user.surname}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </li>
          <li>
            <Input
              register={register}
              type="email"
              label="email"
              id="email"
              visualLabel="Correo electrónico"
              name="email"
              placeholder="Correo electrónico"
              value={dataUser.user.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </li>
          <li>
            <Input
              register={register}
              type="tel"
              label="tel"
              visualLabel="Teléfono"
              id="tel"
              name="tel"
              placeholder="Teléfono"
              value={dataUser.user.tel}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {isEditing ? (
            <button
              disabled={!hasChanges}
              type="submit"
              className="bg-gray-900 hover:bg-padel-green hover:text-black text-white py-2 px-4 w-full rounded"
            >
              Guardar
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleEdit}
              className="bg-gray-900 hover:bg-padel-green hover:text-black text-white py-2 px-4 w-full rounded"
            >
              Editar perfil
            </button>
          )}
          {!dataUser.user.nivel ? (
            <button
              type="button"
              onClick={() => setModalIsOpen(true)}
              className="bg-gray-900 hover:bg-padel-green hover:text-black text-white py-2 px-4 w-full rounded"
            >
              Asignar un nivel
            </button>
          ) : null}
        </div>
      </form>
    </>
  );
}
