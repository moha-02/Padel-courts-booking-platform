import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import User from "../../components/Profile/User";
import UserStats from "@/components/Profile/UserStats";

export default function Home({ children }: { children: React.ReactNode }) {
 

    return (
        <>
            <Nav />
            <User>
                <UserStats></UserStats>
                {children}
            </User>
            <Footer />
        </>
    );
}
