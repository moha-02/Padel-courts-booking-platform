import React, { useContext } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import CloseButton from "../common/CloseButton";
import axios from "axios";
import { useRouter } from "next/router";
import { UserContext } from "../contexts/userContext";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'

interface ModalProps {
  isLogged: boolean;
  isVisible: boolean;
  onClose: () => void;
  onChange: () => void;
}  

export default function LoginModal({ isVisible, isLogged, onClose, onChange }: ModalProps) {
  const { updateUser } = useContext(UserContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      console.log('He entrado en el try.');
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/login",
        {
          data: {
            attributes: {
              email: data.email,
              password: data.password,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        console.log("Inicio de sesión correcto");
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
        updateUser(response.data); // Usar updateUser en lugar de setUser
        onClose();   
        router.push("/profile/user");
      }
    } catch (error) {
      Swal.fire({
        title: 'Ops...',
        text: 'Algo ha ido mal. Por favor, inténtalo de nuevo.',
        icon: 'error',
      });  
      setTimeout(() => {
        reset();      
      }, 2000);
      console.error("Error al iniciar sesión:", error);
    }
  });

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
                <h2 className="text-3xl font-bold text-gray-900 underline underline-offset-4 decoration-padel-green">
                  Jugar ya!
                </h2>
                <p className="text-md text-gray-500 mt-3 mb-10">
                  Inicia sesión en tu cuenta para continuar.
                </p>
                {errors.login && (
                  <p className="text-red-500 text-sm text-center">
                    {String(errors.login.message)}
                  </p>
                )}
                <Input
                  type="email"
                  label="email"
                  visualLabel="Correo electrónico"
                  placeholder="Correo electrónico"
                  register={register}
                  errors={errors}
                  pattern="email"
                />
                <Input
                  type="password"
                  visualLabel="Password"
                  label="password"
                  placeholder="Contraseña"
                  register={register}
                  errors={errors}
                />
                <Button type="submit">Iniciar sesión</Button>
                <a
                  href="#"
                  className="mt-3 block text-right text-sm text-gray-700 hover:underline underline-offset-4 hover:decoration-padel-green"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </form>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 text-center">
                <p className="text-sm text-gray-500">
                  ¿No tienes una cuenta?{" "}
                  <a
                    onClick={() => {
                      onClose();
                      onChange();
                    }}
                    href="#"
                    className=" text-gray-700 hover:underline underline-offset-4 hover:decoration-padel-green"
                  >
                    Regístrate
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
