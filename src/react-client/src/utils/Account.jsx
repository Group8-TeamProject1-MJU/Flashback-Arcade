import { useContext } from "react";
import ENDPOINTS from "../configs/api-endpoints";
import { UserContext } from "../contexts/UserContext";

export default function LoadLoginSession() {
    // var [user, setUser] = useContext(UserContext);

    // fetch(ENDPOINTS.GET_API_ACCOUNT_AUTHENTICATE, {
    //     method: 'GET',
    //     credentials: 'include'
    // })
    //     .then(response => response.json())
    //     .then(json => {
    //         if (json.username !== "")
    //             setUser({
    //                 isAuthenticated: true,
    //                 username: json.username
    //             });
    //     })
    //     .catch(error => console.log(error));

    // return user;
}
