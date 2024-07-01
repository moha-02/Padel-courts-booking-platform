import Nav from "./Nav";
import Buscador from "./Buscador";
import CarruselTienda from "./CarruselTienda";
import CourtList from "./CourtList";
import Footer from "./Footer";
import InfoCards from "./InfoCards";

export default function Page() {
  return (
    <div>
      <Nav />
      <Buscador />
      <CourtList />
      <InfoCards></InfoCards>
      <CarruselTienda />
      <Footer></Footer>
    </div>
  );
}
