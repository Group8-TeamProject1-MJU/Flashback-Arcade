import { createContext, useContext, useState } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isAuthenticated: false,
        username: ""
    });

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
