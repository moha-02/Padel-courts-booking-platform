import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import LoginModal from "./Login/LoginModal";
import NavButtons from "./common/NavButtons";
import RegisterModal from "./Register/RegisterModal";
import LangSelect from "./LangSelect";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/router';
import { UserContext } from "./contexts/userContext";

export default function Nav() {
  const router = useRouter();
  type UserContextType = React.ContextType<typeof UserContext>;
  const { dataUser, updateUser } = useContext<UserContextType>(UserContext);
  const [isLoginVisible, setLoginIsVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(!!dataUser);
  const [showButtons, setShowButtons] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (dataUser) {
      setIsLogged(true);
    }
  }, [dataUser]);

  const handleLogout = () => {
    setIsLogged(false);
    setShowButtons(false);
    router.replace("/");
    updateUser(null);
  };

  return (
    <div>
      <nav className="h-auto bg-white fixed w-full z-20 top-0 border-b">
        <div className="flex flex-wrap items-center justify-between p-2 md:ml-20">
          <Link href="/" className="flex items-center p-1">
            <Image src="/images/logo.png" width={110} height={110} alt="PadelViper Logo" />
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center px-2 py-1 border rounded text-gray-500 border-gray-600 hover:text-black hover:border-black"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>

          <div className={`w-full md:flex md:items-center md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col md:flex-row md:order-2 space-x-3 rtl:space-x-reverse items-center py-5 md:py-0">
              {isLogged ? (
                <div className="relative flex items-center space-x-3">
                  <LangSelect />
                  <button
                    onClick={() => setShowButtons(!showButtons)}
                    className="flex items-center px-6 justify-center overflow-hidden bg-gray-100 rounded-full font-semibold dark:bg-gray-600 w-12 h-12 hover:bg-gray-500 text-gray-200"
                  >
                    {dataUser?.user.name.charAt(0).toUpperCase()}{dataUser?.user.surname.charAt(0).toUpperCase()}
                  </button>
                  {showButtons && (
                      <NavButtons onLogout={handleLogout} />
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <LangSelect />
                  <button
                    onClick={() => setLoginIsVisible(true)}
                    className="text-black bg-white border border-black hover:bg-gray-200 font-semibold rounded-lg px-5 py-2"
                  >
                    {t("inicioSesion")}
                  </button>
                  <button
                    onClick={() => setIsRegisterVisible(true)}
                    className="text-white bg-black border border-black hover:bg-gray-700 font-semibold rounded-lg px-5 py-2"
                  >
                    {t("registroUser")}
                  </button>
                </div>
              )}
            </div>
            <ul className="flex flex-col md:flex-row md:items-center p-1 md:p-6 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link href="#" className="py-2 px-1 text-dark hover:underline underline-offset-8 decoration-2 hover:decoration-padel-green">
                  {t('tienda')}
                </Link>
              </li>
              <li>
                <Link href="/booking/reserve" className="py-2 px-1 text-dark hover:underline underline-offset-8 decoration-2 hover:decoration-padel-green">
                  {t('reservas')}
                </Link>
            </li>
            <li>
                <Link href="/workwithus" className="py-2 px-1 text-dark hover:underline underline-offset-8 decoration-2 hover:decoration-padel-green">
                    {t('trabajaconnosotros')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="pt-28">
        {/* Renderizar los modales */}
        <LoginModal
          isLogged={isLogged}
          isVisible={isLoginVisible}
          onChange={() => {
            setLoginIsVisible(false);
            setIsRegisterVisible(true);
          }}
          onClose={() => setLoginIsVisible(false)}
        />
        <RegisterModal
          isVisible={isRegisterVisible}
          onChange={() => {
            setIsRegisterVisible(false);
            setLoginIsVisible(true);
          }}
          onClose={() => setIsRegisterVisible(false)}
        />
      </div>
    </div>
  );
}
