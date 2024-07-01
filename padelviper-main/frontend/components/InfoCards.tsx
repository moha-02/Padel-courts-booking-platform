import { useTranslation } from "react-i18next";
import { NeonGradientCard } from "./commonEfects/neon-gradient-card";
import WordRotate from "./commonEfects/word-rotate";
import Bi from "../components/commonEfects/bi-direcional";

export default function InfoCards() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-full p-10 md:pb-24 md:pt-10 bg-[url('../public/images/bg-info2.jpg')] bg-cover bg-center mb-20">
            <div className="text-center mt-5 mb-5 md:mb-10">
                <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white">
                    PadelViper es
                    <WordRotate
                        className="mt-2 text-4xl md:text-6xl font-bold text-black dark:text-white"
                        words={["Facilidad", "Flexibilidad", "Disposición", "Eficacia", "Rapidez"]}
                    />
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 h-auto gap-10 md:gap-x-5  md:gap-y-20 items-center justify-center pb-10">
                <NeonGradientCard className="max-w-xs mx-auto items-center justify-center text-center">
                    <div className="flex font-bold text-xl mb-2 pb-5 border-b-2 rou">
                        <span className="bg-padel-green rounded-full text-black w-8 h-8 flex items-center justify-center">1</span> &nbsp; {t('buscaPista')}
                    </div>
                    <p className="text-gray-700 text-md mt-4">{t('buscaPistaDescripcion')}</p>
                </NeonGradientCard>

                    <Bi />
  
                <NeonGradientCard className=" max-w-xs mx-auto items-center justify-center text-center  md:order-2 order-3">
                    <div className="flex font-bold text-xl mb-2 pb-5 border-b-2">
                        <span className="bg-padel-green rounded-full text-black w-8 h-8 flex items-center justify-center">3</span> &nbsp; {t('disfrutaJugando')}
                    </div>
                    <p className="text-gray-700 text-md mt-4">{t('disfrutaJugandoDescripcion')}</p>
                </NeonGradientCard>
                <NeonGradientCard className=" md:col-start-2 md:col-end-2 max-w-xs mx-auto items-center justify-center text-center md:order-3 order-2">
                    <div className="flex font-bold text-xl mb-2 pb-5 border-b-2">
                        <span className="bg-padel-green rounded-full text-black w-8 h-8 flex items-center justify-center">2</span> &nbsp; {t('reservala')}
                    </div>
                    <p className="text-gray-700 text-md mt-4">{t('reservalaDescripcion')}</p>
                </NeonGradientCard>
            </div>
        </div>
    );
}
