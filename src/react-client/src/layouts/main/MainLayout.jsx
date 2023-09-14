import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Container, Row, Col } from "react-bootstrap";
import Iframe from 'react-iframe'
import { API_BASE_URL } from "../../configs/api-endpoints";

export default function MainLayout(props) {
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
                                url={`${API_BASE_URL}/reactchat/jeheecheon`}
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
