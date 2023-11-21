import { createContext, useContext, useEffect, useState } from 'react';
import ENDPOINTS from '../configs/api-endpoints';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isAuthenticated: false,
        username: "",
        anonymousName: generateRandomUsername(6),
        isAnonymous: true
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
                        ...user,
                        isAuthenticated: json.isAuthenticated,
                        username: json.username, 
                        isAnonymous: false
                    });
            })
            .catch(error => console.log(error));
    }, []);

    function getChatUserName() {
        if (user.isAnonymous)
            return user.anonymousName;
        return user.username;
    }

    function generateRandomUsername(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
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
                user, setUser, getChatUserName
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
