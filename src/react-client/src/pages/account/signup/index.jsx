import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import ENDPOINTS, { API_BASE_URL } from '../../../configs/api-endpoints'

export default function Signup() {
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const [showIdErrorMsg, setShowIdErrorMsg] = useState(false);
    const [showPwdErrorMsg, setShowPwdErrorMsg] = useState(false);
    const [showPwdConfirmErrorMsg, setShowPwdComfirmErrorMsg] = useState(false);
    const [msgsFromServer, setMsgsFromServer] = useState([]);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value.trim()
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log('입력된 아이디:', formData.id);
        console.log('입력된 이메일:', formData.email);
        console.log('입력된 비밀번호:', formData.password);
        console.log('입력된 비밀번호확인:', formData.passwordConfirm);

        if (formData.id.length < 5)
            setShowIdErrorMsg(true);
        else
            setShowIdErrorMsg(false);
        if (formData.password.length < 5)
            setShowPwdErrorMsg(true);
        else
            setShowPwdErrorMsg(false);
        if (formData.password !== formData.passwordConfirm)
            setShowPwdComfirmErrorMsg(true);
        else
            setShowPwdComfirmErrorMsg(false);

        if (showIdErrorMsg || showPwdConfirmErrorMsg || showPwdErrorMsg)
            return;

        fetch(ENDPOINTS.POST_API_ACCOUNT_SIGNUP, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: formData.id,
                email: formData.email,
                password: formData.password
            })
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer.Errors);
                console.log(responseFromServer.Succeeded);

                var succeeded = responseFromServer.Succeeded;
                if (succeeded)
                    navigate("/account/signin");
                else
                    setMsgsFromServer(responseFromServer.Errors);
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center vh-100">

                <div className="bg-yellow p-4 rounded border-2 border-black">
                    <h2 className="text-center mb-4">회원가입</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicId">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                placeholder="아이디를 입력하세요"
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicId">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="이메일을 입력하세요"
                            />
                        </Form.Group>

                        <Form.Group className='mt-3' controlId="formBasicPassword">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="비밀번호를 입력하세요"
                            />
                        </Form.Group>

                        <Form.Group className='mt-3' controlId="formBasicPasswordConfirm">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control
                                type="password"
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleInputChange}
                                placeholder="비밀번호를 재입력하세요"
                            />
                        </Form.Group>

                        <Button className="mt-3" variant="primary" type="submit">
                            회원가입
                        </Button>


                        <div className='mt-3 text-danger w-auto'>
                            {showIdErrorMsg && (<p>아이디는 5자 이상 입력해주세요</p>)}
                            {showPwdErrorMsg && (<p>비밀번호는 5자 이상 입력해주세요</p>)}
                            {showPwdConfirmErrorMsg && (<p>비밀번호가 일치하지 않습니다</p>)}
                            {msgsFromServer !== "" && msgsFromServer.map((msg, idx) => (<p key={idx}>{msg}</p>))}
                        </div>

                    </Form>
                </div>
            </Container>
        </>
    );
}
