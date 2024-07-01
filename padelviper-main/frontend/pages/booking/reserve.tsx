import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Resevere from "../../components/Reserves/Reserve";

export default function Home({ children }: { children: React.ReactNode }) {
 

    return (
        <>
            <Nav />
            <Resevere>
            </Resevere>
            <Footer />
        </>
    );
}