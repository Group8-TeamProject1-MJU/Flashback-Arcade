import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import ENDPOINTS, { API_BASE_URL } from '../../../configs/api-endpoints'
import { UserContext } from '../../../contexts/UserContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CustomPacmanLoader from '../../../components/PacmanLoader';
import { toast } from 'react-toastify';
import kakaoButton from '../../../assets/images/kakao_login_medium_narrow.png'
import '../../../assets/styles/SignIn.css'

export default function Signin() {
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [errMsgs, setErrMsgs] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });

    let [loading, setLoading] = useState(false);

    const redirected = searchParams.get("redirected");
    const provider = searchParams.get("provider");

    useEffect(() => {
        if (redirected === "true")
            toast("접근 권한이 없습니다!😒 로그인을 해주세요");
        // else if (provider === "KakaoTalk" || provider === "Google")
        //     toast(`${provider} 로그인에 실패했습니다..😥 다시 시도해주세요`);
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

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
                else {
                    setLoading(false);
                    setErrMsgs(responseFromServer.Errors);
                }
            })
            .catch(error => console.log(error));
    }

    function GoogleLogin(e) {
        e.preventDefault();
        setLoading(true);
        window.location.href = API_BASE_URL + "/api/account/google-signin";
        // setLoading(false);
    }

    function KakaotalkLogin(e) {
        e.preventDefault();
        setLoading(true);
        window.location.href = API_BASE_URL + "/api/account/kakaotalk-signin";
        // setLoading(false);
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center vh-100">
                {loading ? (
                    <CustomPacmanLoader
                        loading={loading}
                    />
                ) : (
                    <div className="p-4 rounded text-warning">
                        <h2 className="text-center mb-4">로그인</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label className='text-warning'>아이디</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    placeholder="아이디를 입력하세요"
                                />
                            </Form.Group>

                            <Form.Group className='mt-3' controlId="formBasicPassword">
                                <Form.Label className='text-warning'>비밀번호</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </Form.Group>

                            <div className='mt-3'>
                                <Button className="m-1" variant="primary" type="submit">
                                    로그인
                                </Button>
                                <Button className="m-1" variant="primary" type="submit">
                                    <Nav.Link as={Link} to="/account/signup">회원가입</Nav.Link>
                                </Button>
                            </div>
                            <div className='mt-5'>
                                <button className="gsi-material-button" onClick={GoogleLogin}>
                                    <div className="gsi-material-button-state" />
                                    <div className="gsi-material-button-content-wrapper">
                                        <div className="gsi-material-button-icon">
                                            <svg
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 48 48"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                style={{ display: "block" }}
                                            >
                                                <path
                                                    fill="#EA4335"
                                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                                />
                                                <path
                                                    fill="#4285F4"
                                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                                />
                                                <path
                                                    fill="#FBBC05"
                                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                                />
                                                <path
                                                    fill="#34A853"
                                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                                />
                                                <path fill="none" d="M0 0h48v48H0z" />
                                            </svg>
                                        </div>
                                        <span className="gsi-material-button-contents">Sign in with Google</span>
                                        <span style={{ display: "none" }}>Sign in with Google</span>
                                    </div>
                                </button>
                            </div>
                            <div className='mt-3'>
                                <img src={kakaoButton} alt='Kakaotalk Login Button' className="m-1" onClick={KakaotalkLogin} style={{ cursor: 'pointer' }}></img>
                            </div>
                            <div className='mt-3 text-danger w-auto'>
                                {errMsgs !== undefined && errMsgs.length > 0 && errMsgs.map((msg, idx) => (
                                    <p key={idx}>{msg}</p>
                                ))}
                            </div>
                        </Form>
                    </div>

                )
                }
            </Container>
        </>
    );
};
