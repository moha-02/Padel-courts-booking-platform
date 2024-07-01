import Button from "./common/Button";
import { useTranslation } from "react-i18next";
import Image from 'next/image';


export default function CourtCard({
  id,
  name,
  direction,
  image,
  onClick
}: {
  id?: number;
  name: string;
  direction: string;
  image: string;
  onClick: () => void; 
}) {

  const { t } = useTranslation();

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-2xl bg-gray-900 flex flex-col h-full">
      <div className="relative w-full h-48 md:h-72">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
      </div>
      <div className="px-6 py-4 mt-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-md xl:text-2xl mb-2 text-white">
            {name}
          </div>
          <p className="text-white text-base mb-2 md:mb-5">{direction}</p>
        </div>
        <Button className="bg-transparent mt-5 hover:bg-grey w-52 text-white font-semibold py-2 px-16 border border-greymb-2 hover:text-padel-green rounded-full mr-2 mb-3 md:mb-5"
         onClick={onClick}
        >
          {t("reservar")}
         
        </Button>
      </div>
    </div>
  );
}
