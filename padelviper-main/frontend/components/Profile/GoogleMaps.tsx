import { useState } from 'react';

export default function GoogleMapsButton ({ address }: { address: string }){
  // Suponiendo que `iconModalLat` es un icono que quieres mostrar en el botón.
  const [iconModalLat] = useState(
    <svg className="h-4 w-4 text-black "  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M6 18v-6a3 3 0 0 1 3 -3h10l-5 -5m0 10l5 -5" /></svg>
  );

  const handleOpenGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <button 
      className="rounded-full bg-padel-green w-14 h-10 mx-6 flex items-center justify-center hover:opacity-75"
      onClick={handleOpenGoogleMaps}
    >
      {iconModalLat}
    </button>
  );
};

;
