import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CourtCard from "./CourtCard";
import { useRouter } from "next/router";


export default function CourtList() {
  interface Court {
    id: number;
    name: string;
    direction: string;
    image: string;
    
  }
  
  const router = useRouter();
  const { t } = useTranslation();
const [courts, setCourts] = useState<Court[]>([]);

useEffect(() => {
  (async () => {
    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs`, {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    });
    setCourts(result.data);
    console.log(result.data);

    
  })();
}, []);

return (
  <div className="md:mb-32 mb-20">
    <h2 className="text-3xl xl:text-5xl font-bold text-center mt-10 mb-5 md:mt-24 md:mb-20">
      <span className="underline underline-offset-8 decoration-padel-green">
        {t("h2PistasDisponibles")}
      </span>
      <span className="text-3xl md:text-5xl text-gray-900"> |</span>{" "}
      <span className="text-sm xl:text-2xl justify-center items-center text-center text-gray-900">
        {t("h3PistasDisponibles")}
      </span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 md:gap-y-32 gap-y-5 items-start h-auto px-5 md:px-20">
      {courts.slice(0, 6).map((court) => (
        <CourtCard
          key={court.id}
          id={court.id}
          name={court.name}
          direction={court.direction}
          image={`${process.env.NEXT_PUBLIC_URL_BACKEND}${court.image}`}
          onClick={() => router.push("/booking/reserve")}
        />
      ))}
    </div>
  </div>
);
}
