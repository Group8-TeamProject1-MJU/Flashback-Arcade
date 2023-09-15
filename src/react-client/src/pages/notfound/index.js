import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LoadLoginSession from "../../utils/Account";
import { API_BASE_URL } from "../../configs/api-endpoints";

export default function NotFound() {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    // LoadLoginSession();
    fetch(API_BASE_URL + "/api/test/test", {
      method: 'GET',
      credentials: 'include'
  })
      .then(response => response.json())
      .then(json => {
          setUser({
              isAuthenticated: true,
              username: json.username.replace(/\s+/g, '')
          });
      })
      .catch(error => console.log(error));
    if (!user.isAuthenticated)
      navigate("/account/signin");
    else
      navigate("/");
  }, [])

  return <>
    <h1>Not Found</h1>
  </>
}
