import { Button } from "react-bootstrap";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

import Modal from 'react-modal';

export default function Test() {
    const Navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [modalIsOpen, setIsOpen] = useState(true);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

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

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                // style={customStyles}
                contentLabel="Example Modal"
            >
                Hello Modal!
            </Modal>

            {/* <Button onClick={GoogleLogin}>Google login</Button> */}
        </>
    );
}
