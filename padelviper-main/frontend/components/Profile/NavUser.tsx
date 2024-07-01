import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function NavUser({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { dataUser, updateUser } = useContext(UserContext);

    return (
        <div className="col-span-1 sm:col-span-3">
            <div className="bg-white shadow rounded-full">
                <div className="flex justify-between items-center">
                    <nav className="bg-gray-800 p-1 w-full rounded-md md:rounded-full sm:flex sm:items-center sm:justify-around">
                        <ul className="flex flex-col sm:flex-row sm:w-auto">
                            {(dataUser?.user.acces === "admin" || dataUser?.user.acces === "superadmin") ? (
                                <>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/manage" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/manage" className="block h-full p-3 text-md font-semibold">
                                            Gestionar Admins
                                        </Link>
                                    </li>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/user" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/user" className="block h-full p-3 text-md font-semibold">
                                            Perfil Personal
                                        </Link>
                                    </li>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/centers" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/centers" className="block h-full p-3 text-md font-semibold">
                                            Registrar Centros
                                        </Link>
                                    </li>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/pistas" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/pistas" className="block h-full p-3 text-md font-semibold">
                                            Registrar Pistas
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/user-bookings" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/user-bookings" className="block h-full p-3 text-md font-semibold">
                                            Mis Reservas
                                        </Link>
                                    </li>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/user" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/user" className="block h-full p-3 text-md font-semibold">
                                            Perfil Personal
                                        </Link>
                                    </li>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/user-maches" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/user-maches" className="block h-full p-3 text-md font-semibold">
                                            Mis Partidos
                                        </Link>
                                    </li>
                                    <li className={`mx-2 text-white border-b-2 ${router.pathname === "/profile/user/mis-pagos" ? "border-padel-green" : ""}`}>
                                        <Link href="/profile/user/mis-pagos" className="block h-full p-3 text-md font-semibold">
                                            Pagos
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
            {children}
        </div>
    );
}
