import { useRouter } from "next/router";
type LogoutHandler = () => void;

interface NavButtonsProps {
    onLogout: LogoutHandler;
  }

  const iconLoout= <svg className="h-4 w-4 text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />  <polyline points="16 17 21 12 16 7" />  <line x1="21" y1="12" x2="9" y2="12" /></svg>
  const iconUser= <svg className="h-4 w-4 text-padel-green"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="7" r="4" />  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>

  export default function NavButtons({ onLogout }: NavButtonsProps) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push("/");
    console.log("Logout");
  };

  const handleClickPerfil = async () => {
    await router.push("/profile/user");
  };

  return (
    <div className="absolute top-20 right-0 w-1/8 bg-gray-600 border border-gray-200 rounded-lg shadow-md p-1">
      <button
        onClick={handleClickPerfil}
        className="block w-full text-left py-2 px-4 text-sm font-semibold text-padel-green hover:opacity-75"
      >
         <div className="flex items-center">
        <p className="pr-3">Tu Perfil</p>
        {iconUser}
        </div>
      </button>
      <button
        onClick={handleLogout}
        className="block w-full text-left py-2 px-4 text-sm font-bold text-red-500 hover:opacity-75"
      >
        <div className="flex items-center">
        <p className="pr-5">Logout</p>
        {iconLoout}
        </div>
      </button>
    </div>
  );
}
