import { Col, Container, Row } from "react-bootstrap";
import AppRoutes from "../utils/AppRoutes";
import { useContext, useEffect, useState } from "react";
import { GameRankersContext } from "../contexts/GameRankersContext";

export function GameRankingBoard() {
    const [page, setPage] = useState(1);
    const { rankers, game, fetchRankers } = useContext(GameRankersContext);

    const rankerToShow = rankers.slice((page - 1) * 10, ((page - 1) * 10) + 10)

    useEffect(() => {
        const interval = setInterval(() => {
            fetchRankers();
        }, 10000);
    
        return () => {
          clearInterval(interval);
        };
    
      }, []);

    function PrintRest() {
        let elements = [];

        for (let i = rankerToShow.length + 1; i <= 10; ++i) {
            elements.push(
                <Row className="justify-content-between" key={i}>
                    <Col className="board-col">
                        {i + (page - 1) * 10}
                    </Col>
                    <Col className="board-col">
                        ???
                    </Col>
                    <Col className="board-col">
                        ???
                    </Col>
                </Row>
            )
        }
        return elements;
    }

    function OnLeftButtonClicked() {
        if (page > 1)
            setPage(page - 1);
    }

    function OnRightButtonClicked() {
        if (page < 10)
            setPage(page + 1);
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
                                rankerToShow && rankerToShow.map((ranker, idx) => {
                                    return (
                                        <Row className="justify-content-between" key={ranker.Id}>
                                            <Col className="board-col">
                                                {(page - 1) * 10 + ++idx}
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
                                <Col className="pagination-button" onClick={OnLeftButtonClicked}>
                                    &lt;
                                </Col>
                                <Col className="pagination-button" onClick={OnRightButtonClicked}>
                                    &gt;
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            )}
        </>
    );
}
