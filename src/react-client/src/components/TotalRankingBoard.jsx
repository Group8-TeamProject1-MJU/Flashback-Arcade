import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ENDPOINTS from "../configs/api-endpoints";
import { GameRankersContext } from "../contexts/GameRankersContext";

export function TotalRankingBoard() {
    // 랭킹보드 관련 변수들
    const [page, setPage] = useState(1);
    const [rankers, setRankers] = useState([]);
    const rankerToShow = rankers.slice((page - 1) * 10, ((page - 1) * 10) + 10)

    // 검색관련 변수들
    const [userName, setUserName] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [status, setStatus] = useState('유저 랭킹을 조회해보세요!💥');

    useEffect(() => {
        if (userName !== '')
            getRanks();
        fetchRankers();
    }, []);

    function fetchRankers() {
        fetch(ENDPOINTS.GET_API_SCORE_GET_TOTAL_RANKERS, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
                setRankers(responseFromServer);
            })
            .catch(error => console.log(error));
    }

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

    function handleSearch(e) {
        e.preventDefault();
        if (userName !== '')
            getRanks();
    }

    function getRanks() {
        fetch(`${ENDPOINTS.GET_API_SCORE_GET_RANKS}?userName=${userName}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer);
                if (responseFromServer.status !== 400) {
                    if (responseFromServer.length === 0)
                        setStatus("랭킹 조회 결과 없음..");
                    else setSearchResult(responseFromServer);
                }
                else {
                    setStatus("존재하지 않는 유저 이름입니다");
                    setSearchResult([]);
                }
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <div className="board-section">
                <div className="w-100 h-100 ">
                    <div className="board-heading">
                        - Total Ranking -
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
                                    <Row className="justify-content-between" key={idx}>
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

                    <hr className="cutting-line" />

                    <div className="board-heading">
                        - User Rank Lookup -
                    </div>
                    <form className="user-search-section d-flex justify-content-center">
                        <input
                            id="search-game"
                            name="search-game"
                            type="text"
                            className="search-input text-warning"
                            value={userName}
                            onChange={e =>
                                setUserName(e.target.value)
                            }
                            placeholder="유저이름 입력..."
                        />
                        <label onClick={handleSearch} className="user-search-icon">
                            <FaSearch />
                        </label>
                        <button onClick={handleSearch} className="invisible position-absolute">asdasd</button>
                    </form>

                    <Container className="user-lookup-board">
                        {
                            searchResult.length !== 0
                                ? <Row className="justify-content-between board-row">
                                    <Col className="board-top-col">
                                        Title
                                    </Col>
                                    <Col className="board-top-col">
                                        Rank
                                    </Col>
                                </Row>
                                : <div className="board-heading">{status}</div>
                        }
                        {
                            searchResult.length !== 0 ? searchResult.map((ele, idx) => {
                                return (
                                    <Row className="justify-content-between" key={idx}>
                                        <Col className="board-col">
                                            {ele.Title}
                                        </Col>
                                        <Col className="board-col">
                                            {ele.Rank}
                                        </Col>
                                    </Row>
                                );
                            })
                                : (<></>)
                        }
                    </Container>
                </div>
            </div>
        </>
    );
}
