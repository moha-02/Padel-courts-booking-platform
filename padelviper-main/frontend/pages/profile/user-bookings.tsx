import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import User from "../../components/Profile/User";
import BookingsUser from "../../components/Profile/BookingsUser"


export default function UserBookingPage({ children }: { children: React.ReactNode }){

    return(
        <>
        <Nav />
        <User><BookingsUser/></User>
        <div>{children}</div>
        <Footer />
    </>
    )
}