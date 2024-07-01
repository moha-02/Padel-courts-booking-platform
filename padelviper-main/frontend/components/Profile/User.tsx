import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../contexts/userContext";
import NavUser from "./NavUser";
import { UseFormRegister, useForm } from "react-hook-form";
import UserForm from "./UserForm";
import LevelQuiz from "../LevelQuiz/LevelQuiz";

export default function User({ children }: { children: React.ReactNode }) {
  const { register } = useForm();
  type UserContextType = React.ContextType<typeof UserContext>;
  const { dataUser, updateUser } = useContext<UserContextType>(UserContext);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  if (!dataUser) {
    return <div>Resgitrates para poder ver tu perfil...</div>;
  }


  return (
    <>
    <LevelQuiz userId={dataUser.user.id} token={dataUser.token} setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} />
    <div className={`${dataUser.user.acces === "admin" ||  dataUser.user.acces === "superadmin" ? "bg-gray-300" : "bg-gray-100"}`}>
      <div className="container mx-auto py-8 px-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 md:mt-20 border-2 border-gray-300">
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 w-36 h-36">
                  <span className="text-5xl text-gray-600 dark:text-gray-300" id="initials"> {dataUser.user.name.charAt(0).toUpperCase()}{dataUser.user.surname.charAt(0).toUpperCase()}</span>
                </div>
                <h1 className="text-xl font-bold mt-3">
                  {dataUser.user.name.toUpperCase()} {dataUser.user.surname.toUpperCase()}
                </h1>
                <p className="text-gray-700">Jugador de Nivel {dataUser.user.nivel}</p>
              </div>
              <hr className=" my-5 md:mt-9 md:mb-5 border-t border-gray-300" />
              <div className="flex flex-col">
                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                  Tu Informacion
                </span>
                <UserForm modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />
              </div>
            </div>
          </div>
          <NavUser>
            {children}
          </NavUser>
        </div>
      </div>
    </div>
    </>
  );
}
