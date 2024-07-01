import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import User from "../../components/Profile/User";
import MachesUser from "../../components/Profile/MachesUser"


export default function UserBookingPage({ children }: { children: React.ReactNode }){

    return(
        <>
        <Nav />
        <User><MachesUser/></User>
        <div>{children}</div>
        <Footer />
    </>
    )
}