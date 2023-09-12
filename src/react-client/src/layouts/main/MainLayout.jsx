import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Container, Row, Col } from "react-bootstrap";
import Iframe from 'react-iframe'

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
                                    url="https://localhost:7105"
                                    width="640px"
                                    height="320px"
                                    id=""
                                    className="mx-auto border-0"
                                    style=""
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