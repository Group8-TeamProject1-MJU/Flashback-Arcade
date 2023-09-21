import { Button } from "react-bootstrap";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function Test() {
    const Navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    function TestCall() {
        fetch(API_BASE_URL + "/api/test/test", {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                console.log(json.username);
                console.log(user.isAuthenticated);
            })
            .catch(error => console.log(error));
    }

    function GoogleLogin() {
        window.location.href = API_BASE_URL + "/api/account/google-signin";
        // fetch(API_BASE_URL + "/api/account/google-signin", {
        //     method: 'GET',
        //     credentials: 'include'
        // })
        //     .then(response => response.json())
        //     .then(json => {
        //         console.log(json);
        //     })
        //     .catch(error => console.log(error));
    }

    return (
        <>
            <Button onClick={TestCall}>Click me</Button>
            {/* <Button onClick={GoogleLogin}>Google login</Button> */}
        </>
    );
}
