import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Iframe from "react-iframe";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { Outlet } from "react-router-dom";

export default function Games() {
    const { user, setUser } = useContext(UserContext);

    return (
        <>
            <Outlet  />

            <div className="about-section p-0">
                <Iframe
                    url={`${API_BASE_URL}/reactchat/${user.username}`}
                    // width="640px"
                    // height="320px"
                    className="w-100"
                    id=""
                />
            </div>
        </>
    );
}
