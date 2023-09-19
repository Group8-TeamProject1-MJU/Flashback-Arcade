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
            })
            .catch(error => console.log(error));
    }, []);


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
