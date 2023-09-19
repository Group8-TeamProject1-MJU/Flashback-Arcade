import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LoadLoginSession from "../../utils/Account";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { toast } from 'react-toastify';

export default function NotFound() {
  const [searchParams, setSearchParams] = useSearchParams();
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const stay = searchParams.get("stay");

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
    if (stay !== "stay") {
      if (!user.isAuthenticated) {
        // alert("접근 권한이 없습니다!😒 로그인을 해주세요");
        // toast("접근 권한이 없습니다!😒 로그인을 해주세요");
        navigate("/account/signin");
      }
      else
        navigate("/");
    }
  }, [])

  return <>
    <h1>Not Found Page</h1>
  </>
}
