import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import User from "../../components/Profile/User";
import PistasManage from "../../components/Profile/PistasManage"


export default function UserBookingPage({ children }: { children: React.ReactNode }){

    return(
        <>
        <Nav />
        <User><PistasManage/></User>
        <div>{children}</div>
        <Footer />
    </>
    )
}