import { createContext, useContext, useEffect, useState } from 'react';
import ENDPOINTS from '../configs/api-endpoints';
import AppRoutes from '../utils/AppRoutes';

export const GameRankersContext = createContext(null);

export function GameRankersProvider({ children }) {
    const [rankers, setRankers] = useState([]);

    const url = window.location.href;
    const path = new URL(url).pathname; // URL의 경로 부분 추출
    // '/games/' 다음의 문자열을 추출
    const gamePath = path.substring(path.lastIndexOf('/') + 1);
    const gameRoutes = AppRoutes.find(r => r.path === '/games').sub_routes;
    const game = gameRoutes.find(r => r.path === gamePath);

    useEffect(() => {
        fetchRankers();
    }, []);

    function fetchRankers() {
        fetch(`${ENDPOINTS.GET_API_SCORE_GET_RANKERS}?title=${game.title}`, {
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

    function sendScore(score) {
        fetch(ENDPOINTS.POST_API_SCORE_ADD_SCORE, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                score: score,
                title: game.title
            })
        })
            .catch(error => console.log(error));
        fetchRankers();
    }

    return (
        <GameRankersContext.Provider
            value={{
                rankers, setRankers, sendScore, game
            }}
        >
            {children}
        </GameRankersContext.Provider>
    );
}
