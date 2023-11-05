import { createContext, useContext, useEffect, useState } from 'react';
import ENDPOINTS from '../configs/api-endpoints';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isAuthenticated: false,
        username: ""
    });

    useEffect(() => {
        fetch(ENDPOINTS.GET_API_ACCOUNT_AUTHENTICATE, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                if (json.isAuthenticated)
                    setUser({
                        isAuthenticated: json.isAuthenticated,
                        username: json.username
                    });
                else
                    setUser({
                        isAuthenticated: json.isAuthenticated,
                        username: generateRandomUsername(6)
                    });
            })
            .catch(error => console.log(error));
    }, []);

    function generateRandomUsername(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const random = Math.floor(Math.random() * chars.length);
        let result = '익명-';

        for (let i = 0; i < length; i++) {
            const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
            result += randomChar;
        }

        return result;
    }

    return (
        <UserContext.Provider
            value={{
                user, setUser
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
