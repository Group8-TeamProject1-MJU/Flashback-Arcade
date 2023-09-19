import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Col, Container, Row } from "react-bootstrap";
import Iframe from 'react-iframe'
import { API_BASE_URL } from "../../configs/api-endpoints";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function MainLayout(props) {
    const { user, setUser } = useContext(UserContext);

    return (
        <>
            <div className="m-0 p-0 min-vh-100">
                <NavBar />

                <Container fluid className='p-0 text-center'>
                    <Row>
                        <Col>
                            {props.children}
                            {/* <Outlet /> */}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Iframe
                                url={`${API_BASE_URL}/reactchat/${user.username}`}
                                width="640px"
                                height="320px"
                                id=""
                            />
                        </Col>
                    </Row>
                </Container>

                <Footer />
            </div>
        </>
    )
}
