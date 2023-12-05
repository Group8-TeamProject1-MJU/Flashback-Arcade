import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Iframe from "react-iframe";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { GameRankingBoard } from "../../components/GameRankingBoard";
import { GameRankersProvider } from "../../contexts/GameRankersContext";

export default function Games() {
    const { user, setUser, getChatUserName } = useContext(UserContext);

    function handleSwitchToAnonymous(e) {
        e.preventDefault();

        if (user.username !== undefined && user.username !== "")
            setUser({
                ...user,
                isAnonymous: !user.isAnonymous
            });
    }

    return (
        <>
            <GameRankersProvider>
                <Container className='p-0 text-center'>
                    <Row>
                        <Col>
                            <div className="chat-section p-0">
                                {user !== undefined && (
                                    <Iframe
                                        url={`${API_BASE_URL}/reactchat/${getChatUserName()}`}
                                        // width="640px"
                                        height="480px"
                                        className="w-100"
                                        id=""
                                        styles={{
                                            borderRadius: '30px'
                                        }}
                                    />
                                )}
                            </div>
                            <button onClick={handleSwitchToAnonymous}>익명 on/off</button>
                        </Col>

                        <Col>
                            <Outlet />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <GameRankingBoard />
                        </Col>
                    </Row>
                </Container>
            </GameRankersProvider>
        </>
    );
}
