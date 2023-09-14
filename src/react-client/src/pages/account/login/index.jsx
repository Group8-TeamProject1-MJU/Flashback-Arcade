import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ENDPOINTS from '../../../configs/api-endpoints'

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        console.log('입력된 아이디:', formData.username);
        console.log('입력된 비밀번호:', formData.password);
        fetch(ENDPOINTS.POST_API_ACCOUNT_LOGIN, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(responseFromServer => {
                console.log(responseFromServer.message);
            })
            .catch(error => console.log(error));
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Row>
                    <Col lg={10}>
                        <div className="bg-yellow p-4 rounded">
                            <h2 className="text-center mb-4">로그인</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>아이디</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="아이디를 입력하세요"
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="비밀번호를 입력하세요"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    로그인
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
