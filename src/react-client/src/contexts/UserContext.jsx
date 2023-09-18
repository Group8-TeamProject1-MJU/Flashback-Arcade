import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../configs/api-endpoints';
import LoadLoginSession from '../utils/Account';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isAuthenticated: false,
        username: ""
    });

    useEffect(() => {
        // LoadLoginSession();
        // fetch(API_BASE_URL + "/api/test/test", {
        //     method: 'GET',
        //     credentials: 'include'
        // })
        //     .then(response => response.json())
        //     .then(json => {
        //         setUser({
        //             isAuthenticated: true,
        //             username: json.username.replace(/\s+/g, '')
        //         });
        //     })
        //     .catch(error => console.log(error));
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
