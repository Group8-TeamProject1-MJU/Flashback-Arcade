import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Col, Container, Row } from "react-bootstrap";
import Iframe from 'react-iframe'
import { API_BASE_URL } from "../../configs/api-endpoints";
import { useContext } from "react";
import '../../assets/styles/Home.css'
import '../../assets/styles/particles.css'
import { SigninModalContext } from "../../contexts/SigninModalContext";

export default function MainLayout(props) {
    const { SignInModal } = useContext(SigninModalContext);

    return (
        <>
            <div className="animation-wrapper">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
            </div>
            
            <div className="m-0 p-0 min-vh-100">
                <NavBar />

                <Container fluid="md" className='p-0 text-center'>
                    <Row>
                        <Col>
                            {props.children}
                            <SignInModal/>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
