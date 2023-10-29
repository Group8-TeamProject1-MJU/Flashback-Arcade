import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ENDPOINTS from "../configs/api-endpoints";

export function TotalRankingBoard() {
    const [userName, setUserName] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [status, setStatus] = useState('유저 랭킹을 조회해보세요!💥');

    useEffect(() => {
        if (userName !== '')
            getRanks();
    }, []);

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
