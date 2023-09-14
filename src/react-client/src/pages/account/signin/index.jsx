import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ENDPOINTS from '../../../configs/api-endpoints'
import { UserContext } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        id: '',
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

        fetch(ENDPOINTS.POST_API_ACCOUNT_SIGNIN, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                username: formData.id,
                password: formData.password
            })
        })
            .then(response => response.json())
            .then(responseFromServer => {
                console.log(responseFromServer.Errors);
                console.log(responseFromServer.Succeeded);

                var succeeded = responseFromServer.Succeeded;
                if (succeeded) {
                    setUser({
                        isAuthenticated: true,
                        username: formData.id
                    });
                    navigate("/");
                }
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
                                        name="id"
                                        value={formData.id}
                                        onChange={handleInputChange}
                                        placeholder="아이디를 입력하세요"
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

                                <Button className="mt-3" variant="primary" type="submit">
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
