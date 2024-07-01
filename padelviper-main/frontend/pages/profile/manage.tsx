import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import User from "../../components/Profile/User";
import ManageUser from "../../components/Profile/ManageUser"


export default function UserBookingPage({ children }: { children: React.ReactNode }){

    return(
        <>
        <Nav />
        <User><ManageUser/></User>
        <div>{children}</div>
        <Footer />
    </>
    )
}