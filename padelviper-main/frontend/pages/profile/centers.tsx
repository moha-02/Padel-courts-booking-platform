import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import User from "../../components/Profile/User";
import Centers from "../../components/Profile/Centers"


export default function UserBookingPage({ children }: { children: React.ReactNode }){

    return(
        <>
        <Nav />
        <User><Centers/></User>
        <div>{children}</div>
        <Footer />
    </>
    )
}