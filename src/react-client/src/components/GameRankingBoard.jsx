import { Col, Container, Row } from "react-bootstrap";
import AppRoutes from "../utils/AppRoutes";


export function GameRankingBoard() {
    const url = window.location.href;
    const path = new URL(url).pathname; // URL의 경로 부분 추출

    // '/games/' 다음의 문자열을 추출
    const gamePath = path.substring(path.lastIndexOf('/') + 1);
    const gameRoutes = AppRoutes.find(r => r.path === '/games').sub_routes;
    const game = gameRoutes.find(r => r.path === gamePath);

    return (
        <>
            {game && (
                <div className="board-section">
                    <div className="w-100 h-100 ">
                        <div className="board-heading">
                            {game?.title} Ranking
                        </div>

                        <Container className="" >
                            <Row className="justify-content-between board-row">
                                <Col className="board-top-col">
                                    Rank
                                </Col>
                                <Col className="board-top-col">
                                    User
                                </Col>
                                <Col className="board-top-col">
                                    Score
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    1
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    2
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    3
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    4
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    5
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    6
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    7
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    8
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    9
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                            <Row className="justify-content-between" >
                                <Col className="board-col">
                                    10
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                                <Col className="board-col">
                                    ???
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            )}
        </>
    );
}
