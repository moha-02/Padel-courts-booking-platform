import CloseButton from "../common/CloseButton";
import Input from "../common/Input";
import Button from "../common/Button";
import calculateLevel from "@/services/calculateLevel";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function LevelQuiz({
  modalIsOpen,
  setModalIsOpen,
  userId,
  token,
}: {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  userId: string;
  token: string;
}) {
  type UserContextType = React.ContextType<typeof UserContext>;
  const { dataUser, updateUser } = useContext<UserContextType>(UserContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const level = calculateLevel({
      questions: [
        Number(data.question1),
        Number(data.question2),
        Number(data.question3),
      ],
    });

    try {
      const response = await axios.put(
        process.env.NEXT_PUBLIC_API_URL + "/user/" + userId + "/updatenivel",
        {
          nivel: level.toString(),
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        {
          if (dataUser) {
            updateUser({
              ...dataUser,
              user: {
                ...dataUser?.user,
                nivel: level.toString(),
              },
              token: token,
            });
          }
        }
        setModalIsOpen(false);
      }
      console.log(response);
    } catch (error) {
      setModalIsOpen(false);
      console.error(error);
    }
  };

  if (!modalIsOpen) {
    return null;
  }
  return (
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
            className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
            onSubmit={handleSubmit}
          >
            {/* <CloseButton onClose={onClose} /> */}
            <h2 className="text-3xl font-bold text-gray-900 underline underline-offset-4 decoration-padel-green">
              Asignación de nivel
            </h2>
            <p className="text-md text-gray-500 mt-3 mb-10">
              Responde estas preguntas para poder competir con jugadores de tu
              nivel
            </p>
            <p className="text-sm text-gray-500 mt-3">
              ¿Cúanto tiempo llevas jugando al pádel?
            </p>
            <select
              id="question1"
              name="question1"
              autoComplete="question1"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-padel-green focus:border-padel-green sm:text-sm rounded-md"
            >
              <option value={"0"}>Menos de 1 año</option>
              <option value={"1"}>Entre 1 y 3 años</option>
              <option value={"2"}>Más de 3 años</option>
            </select>
            <p className="text-sm text-gray-500 mt-3">
              ¿Ganarías a Viktorio en un 1vs1?
            </p>
            <select
              id="question1"
              name="question2"
              autoComplete="question2"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-padel-green focus:border-padel-green sm:text-sm rounded-md"
            >
              <option value={"0"}>No, soy muy malo</option>
              <option value={"1"}>Puede ser</option>
              <option value={"2"}>Seguro, soy sinior.</option>
            </select>
            <p className="text-sm text-gray-500 mt-3">
              ¿Te sientes cómodo ejecutando golpes básicos como la volea, el
              smash y el globo?
            </p>
            <select
              id="question1"
              name="question3"
              autoComplete="question3"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-padel-green focus:border-padel-green sm:text-sm rounded-md"
            >
              <option value={"0"}>No</option>
              <option value={"1"}>Estoy aprendiendo a dominarlos</option>
              <option value={"2"}>Los tengo totalmente dominados.</option>
            </select>

            <Button type="button">Consiguir mi nivel</Button>
          </form>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 text-center"></div>
        </div>
      </div>
    </div>
  );
}
