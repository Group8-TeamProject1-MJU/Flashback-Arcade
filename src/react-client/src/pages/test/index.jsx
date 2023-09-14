import { Button } from "react-bootstrap";
import ENDPOINTS, { API_BASE_URL } from "../../configs/api-endpoints";

export default function Test() {
    function TestCall() {
        fetch(API_BASE_URL + "/api/Test/test", {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(json => {
                console.log(json);
            })
            .catch(error => console.log(error));
    }
    
    return (
        <>
            <Button onClick={TestCall}>Click me</Button>
        </>
    );
}
