import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <Navbar expand='md' className="bg-dark-subtle m-0">
      <Container fluid>
        <Navbar.Brand href="/" className="">asdf</Navbar.Brand>

        <Nav className="mx-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <NavDropdown
            title="Dropdown"
            id={`offcanvasNavbarDropdown-expand-md`}
          >
            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action4">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action5">
              Something else here
            </NavDropdown.Item>
          </NavDropdown>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default Footer;
