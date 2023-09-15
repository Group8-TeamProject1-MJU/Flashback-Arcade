import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import LoadLoginSession from "../../utils/Account";

export default function NotFound() {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    LoadLoginSessionssion();
    if (!user.isAuthenticated)
      navigate("/account/signin");
    else
      navigate("/");
  }, [])

  return <>
    <h1>Not Found</h1>
  </>
}
