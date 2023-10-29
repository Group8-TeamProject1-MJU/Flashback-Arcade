import { Col, Container, Row } from "react-bootstrap";
import AppRoutes from "../utils/AppRoutes";
import { useContext } from "react";
import { GameRankersContext } from "../contexts/GameRankersContext";

export function GameRankingBoard() {
    let rankersCnt = 0;
    const { rankers, game } = useContext(GameRankersContext);

    function PrintRest() {
        let elements = [];

        for (let i = rankersCnt; i < 10; ++i) {
            elements.push(
                <Row className="justify-content-between" key={i}>
                    <Col className="board-col">
                        {i + 1}
                    </Col>
                    <Col className="board-col">
                        XXX
                    </Col>
                    <Col className="board-col">
                        XXX
                    </Col>
                </Row>

            )
        }
        return elements;
    }

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
                            {
                                rankers && rankers.map((ranker, idx) => {
                                    ++rankersCnt;
                                    return (
                                        <Row className="justify-content-between" key={ranker.Id}>
                                            <Col className="board-col">
                                                {idx + 1}
                                            </Col>
                                            <Col className="board-col">
                                                {ranker.UserName}
                                            </Col>
                                            <Col className="board-col">
                                                {ranker.Score}
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            {PrintRest()}
                            <Row className="justify-content-center">
                                <Col className="pagination-button">
                                    &lt;
                                </Col>
                                <Col className="pagination-button">
                                    &gt;
                                </Col>
                            </Row>
                        </Container>

                        <Container>
                        </Container>
                    </div>
                </div>
            )}
        </>
    );
}
