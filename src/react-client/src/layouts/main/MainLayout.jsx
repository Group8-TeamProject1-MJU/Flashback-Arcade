import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Container, Row, Col } from "react-bootstrap";
import Iframe from 'react-iframe'
import { API_BASE_URL } from "../../configs/api-endpoints";

export default function MainLayout() {
    return (
        <>
            <Container fluid className="m-0 p-0">
                <NavBar />

                <div className='min-vh-100'>
                    <Container fluid="md">
                        <Row>
                            <Col>
                                <Outlet />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center">
                                <Iframe
                                    url={`${API_BASE_URL}/jeheecheon`}
                                    width="640px"
                                    height="320px"
                                    id=""
                                    className="mx-auto border-0"
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Footer />
            </Container>
        </>
    )
}
