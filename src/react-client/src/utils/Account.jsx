import { useContext } from "react";
import { API_BASE_URL } from "../configs/api-endpoints";
import { UserContext } from "../contexts/UserContext";

export default function LoadLoginSession() {
    const { user, setUser } = useContext(UserContext);

    fetch(API_BASE_URL + "/api/test/test", {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(json => {
            setUser({
                isAuthenticated: true,
                username: json.username.replace(/\s+/g, '')
            });
        })
        .catch(error => console.log(error));
}
