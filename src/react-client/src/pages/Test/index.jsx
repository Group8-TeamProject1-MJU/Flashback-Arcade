import { useEffect, useState } from "react";

export default function Test() {
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetch("https://localhost:7105/api/account/asd", {
            method: 'GET'
        })
            .then(response => {
                return response.json()
            })
            .then(responseFromServer => {
                setMsg(responseFromServer.message);
            })
            .catch(error => {
                console.log(error);
            });

        return () => {};
    }, []);
    
    return (
        <>
            Test Page
            {msg}
        </>
    );
}
