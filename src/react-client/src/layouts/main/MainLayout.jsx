import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Container } from "react-bootstrap";
import Iframe from 'react-iframe'
import { API_BASE_URL } from "../../configs/api-endpoints";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function MainLayout(props) {
    const { user, setUser } = useContext(UserContext);

    return (
        <>
            <Container fluid className="m-0 p-0 w-100">
                <NavBar />

                <div className='min-vh-100'>
                    <Container fluid="md">
                        {props.children}
                        <Outlet />

                        <div className="text-center">
                            <Iframe
                                url={`${API_BASE_URL}/reactchat/${user.username}`}
                                width="640px"
                                height="320px"
                                id=""
                                className="mx-auto border-0"
                            />
                        </div>

                    </Container>
                </div>

                <Footer />
            </Container>
        </>
    )
}
