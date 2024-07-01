// config/i18n.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next) // Integración de i18next con React
  .init({
    resources: {
      en: {
        translation: {
          // BuscadorHome
          welcomeMessage: 'Welcome to our website!',
          experienceMessage: 'Experience the best paddle experience',
          searchMessage: 'Search for available centers and schedules',
          centerLabel: 'Center',
          padelFactoryOption: 'Padel factory',
          hora: "Hour",
          fecha: "Date",
          buscar: "Search",
          // CourtCardsHome
          h2PistasDisponibles: "C O U R T S",
          h3PistasDisponibles: "AVAILABLE",
          reservar: "Reserve",
          // Info Cards
          buscaPista: "Search Court",
          buscaPistaDescripcion: "It has never been easier to book with PadelViper, search for centers near you and check availability.",
          reservala: "Reserve It",
          reservalaDescripcion: "Once decided, choose your partner and reserve the court immediately with instant confirmation and dynamic payment.",
          disfrutaJugando: "Enjoy Playing",
          disfrutaJugandoDescripcion: "Now just enjoy your padel session and compete at any level thanks to the great community.",
          // Nav
          inicioSesion: "Login Sesion",
          registroUser: "Check in",
          tienda: "Store",
          reservas: "Reservations",
          contacto: "Contact",
          pistas: "Courts",
          trabajaconnosotros: "Work with us"
        }
      },
      es: {
        translation: {
          welcomeMessage: '¡Bienvenido a nuestro sitio web!',
          experienceMessage: 'Vive la mejor experiencia de pádel',
          searchMessage: 'Busca centros y horarios disponibles',
          centerLabel: 'Centro',
          hora: "Hora",
          fecha: "Fecha",
          buscar: "Buscar",
          h2PistasDisponibles: "P I S T A S",
          h3PistasDisponibles: "DISPONIBLES",
          reservar: "Reservar",
          buscaPista: "Busca Pista",
          buscaPistaDescripcion: "Más sencillo que nunca poder reservar con PadelViper, busca centros cercanos a ti y consulta la disponibilidad.",
          reservala: "Resérvala",
          reservalaDescripcion: "Una vez decidido, escoge tu pareja y reserva la pista de una manera inmediata con una confirmación instantánea y un pago dinámico.",
          disfrutaJugando: "Disfruta Jugando",
          disfrutaJugandoDescripcion: "Ya solo te queda disfrutar de tu sesión de pádel y competir a todo tipo de nivel gracias a la gran comunidad.",
          inicioSesion: "Iniciar Sesion",
          registroUser: "Registrar",
          tienda: "Tienda",
          reservas: "Reservas",
          contacto: "Contacto",
          pistas: "Pistas",
          trabajaconnosotros: "Trabaja con nosotros"

        }
      },
      // Otros idiomas...
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18next;
