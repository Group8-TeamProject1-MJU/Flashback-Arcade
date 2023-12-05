import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LoadLoginSession from "../../utils/Account";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { toast } from 'react-toastify';
import { SigninModalContext } from "../../contexts/SigninModalContext";

export default function NotFound() {
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [show, setShow] = useState(false);
  const stay = searchParams.get("stay");
  const { setIsOpen, isOpen } = useContext(SigninModalContext);

  useEffect(() => {
    // LoadLoginSession();
    //   fetch(API_BASE_URL + "/api/test/test", {
    //     method: 'GET',
    //     credentials: 'include'
    // })
    //     .then(response => response.json())
    //     .then(json => {
    //         setUser({
    //             isAuthenticated: true,
    //             username: json.username.replace(/\s+/g, '')
    //         });
    //     })
    //     .catch(error => console.log(error));

    if (!user.isAuthenticated) {
      // alert("접근 권한이 없습니다!😒 로그인을 해주세요");
      // toast("접근 권한이 없습니다!😒 로그인을 해주세요");
      setIsOpen(true);
    }

    navigate("/");


  }, [])

  return <>
    {show && (
      <div className="header_notfound">
        <h1>Not Found Page</h1>
        <h1>404 ERROR...</h1>
      </div>
    )}
  </>
}
