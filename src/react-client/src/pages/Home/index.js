import { Link } from "react-router-dom";
import AppRoutes from "../../utils/AppRoutes";
import { Card, Col, Row } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <h1>
        Home Page
      </h1>

      <Row xs={1} md={2} className="g-4">
        {AppRoutes.filter(r => r.path?.includes("games/")).map((r, idx) => (
          <Col key={idx}>
            <Card as={Link} to={r.path}>
              <Card.Body>
                <Card.Title>{r.title}</Card.Title>
                <Card.Text>
                  {r.path}
                  게임설명
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
