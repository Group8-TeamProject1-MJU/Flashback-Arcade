import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from './Footer';
import { Container } from "react-bootstrap";

export default function MainLayout() {
    return (
        <>
            <Container fluid className="m-0 p-0">
                <NavBar />

                <div className='min-vh-100'>
                    <Container fluid="md">
                        <Outlet />
                    </Container>
                </div>

                <Footer />
            </Container>
        </>
    )
}
