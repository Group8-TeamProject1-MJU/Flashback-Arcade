import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

export default function NotFound() {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/account/signin");
    }
  },[])

  return <>
      <h1>Not Found</h1>
  </>
}
