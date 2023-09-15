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
        LoadLoginSession();
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
