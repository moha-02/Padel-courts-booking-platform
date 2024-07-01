import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Input from "../common/Input";
import Button from "../common/Button";
import CloseButton from "../common/CloseButton";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../contexts/userContext";
import { useRouter } from "next/router";

const capitalizeFirstLetter = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

interface UserData {
  name: string;
  email: string;
  password: string;
  surname: string;
  phone: number;
  confirmPassword?: string;
}

const iconoOcular = (
  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const iconoMostrar = (
  <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function Modal({
  isVisible,
  onClose,
  onChange,
}: {
  isVisible: boolean;
  onClose: () => void;
  onChange: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserData>();

  const { updateUser } = useContext(UserContext);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
      });
      return;
    }

    console.log(data);
    try {
      // Capitalizar nombre y apellido
      const capitalizedData: UserData = {
        ...data,
        name: capitalizeFirstLetter(data.name),
        surname: capitalizeFirstLetter(data.surname),
        email: data.email,
        password: data.password,
        phone: data.phone,
      };

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/register",
        {
          user: {
            name: capitalizedData.name,
            email: capitalizedData.email,
            password: capitalizedData.password,
            surname: capitalizedData.surname,
            tel: capitalizedData.phone,
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Registro de usuario correcto");
        console.log(response.data);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
        updateUser(response.data); 
        onClose();    
        router.push("/");
      }
      } catch (error) {
      Swal.fire({
        title: "Ops...",
        text: "Algo ha ido mal. Por favor, inténtalo de nuevo.",
        icon: "error",
      }).then(() => {
        reset();
      });
      console.error(error);
    }
  });

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form
                onSubmit={onSubmit}
                className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
              >
                <CloseButton onClose={onClose} />
                <h1 className="text-3xl font-bold text-gray-900">
                  Únete a PadelViper
                </h1>
                <p className="text-md text-gray-500 mt-2 mb-10">
                  Regístrate para poder continuar.
                </p>
                <Input
                  type="text"
                  placeholder="Nombre"
                  label="name"
                  register={register}
                  errors={errors}
                />
                <Input
                  type="text"
                  placeholder="Apellidos"
                  label="surname"
                  register={register}
                  errors={errors}
                />
                <Input
                  type="text"
                  placeholder="Correo electrónico"
                  label="email"
                  register={register}
                  pattern="email"
                  errors={errors}
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    label="password"
                    register={register}
                    minLength={8}
                    errors={errors}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? iconoOcular : iconoMostrar}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmar Contraseña"
                    label="confirmPassword"
                    register={register}
                    minLength={8}
                    errors={errors}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? iconoOcular : iconoMostrar}
                  </button>
                </div>
                <Input
                  type="tel"
                  placeholder="Teléfono"
                  label="phone"
                  register={register}
                  pattern="phone"
                  errors={errors}
                />
                <Button type="submit">Regístrate</Button>
              </form>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 text-center">
                <p className="text-sm text-gray-500">
                  ¿Ya tienes cuenta?{" "}
                  <a
                    onClick={() => {
                      onClose();
                      onChange();
                    }}
                    href="#"
                    className="text-gray-700 hover:underline underline-offset-4 hover:decoration-padel-green"
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
