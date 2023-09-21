import { Link } from "react-router-dom";
import AppRoutes from "../../utils/AppRoutes";
import { Card, Col, Row } from "react-bootstrap";
import TrianglePlayLogo from "../../components/TrianglePlayLogo";
import { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Iframe from "react-iframe";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { UserContext } from "../../contexts/UserContext";

const gameRoutes = AppRoutes.filter(r => r.path?.includes("/games"))[0].sub_routes;

console.log(gameRoutes);
export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppRoutes, setFilteredAppRoutes] = useState(gameRoutes);

  const handleSearch = (e) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);

    const filtered =
      inputValue === ''
        ? gameRoutes // Show all values if search query is empty
        : gameRoutes.filter((item) =>
          item.title?.toLowerCase().includes(inputValue.toLowerCase())
        );
    setFilteredAppRoutes(filtered);
  };

  return (
    <>
      <div className="container_landing">
        <div className="pacman"></div>
        <div className="ghost"></div>
        <div className="ghost"></div>
        <div className="ghost"></div>
        <div className="ghost"></div>
        <div className="text"></div>
      </div>
      <div className="page-bg"></div>
      <div className="animation-wrapper">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>

      <div className="about-section p-0">
        <Iframe
          url={`${API_BASE_URL}/reactchat/${user.username}`}
          // width="640px"
          // height="320px"
          className="w-100"
          id=""
        />
      </div>

      {/* Heading of Cards */}
      <div className="header_homepage">
        <h1> Game on!!</h1>
      </div>

      {/* The content in the cards came from mapping data1, if you want to contribute a game kindly add it to data1 in the Data folder first*/}
      <label htmlFor="search-games" className="sr-only text-center">플레이 할 게임을 검색해보세요</label>

      <div className="search-section">
        <input
          id="search-game"
          name="search-game"
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="플레이 ..."

        />
        <label className="search-icon">
          <FaSearch />
        </label>
      </div>

      <div className="body_card">

        <div className="container_card">
          {filteredAppRoutes.map((r, idx) => (
            <div className="card" key={idx}>
              <div className="content">
                {/* Addition of Flip card feature */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front w-100">
                      <div>
                        <h2>{r.serial_number}</h2>
                        <h3>{r.title}</h3>
                      </div>
                    </div>
                    <div className="flip-card-back">
                      <div className="rule_heading">{r.rule_heading}</div>
                      <div className="step">{r.step1}</div>
                      <div className="step">{r.step2}</div>
                      <div className="step">{r.step3}</div>
                    </div>
                  </div>
                </div>
                {/* Flip card feature ends here. */}

                <p>{r.about} </p>
                {/* Create a route for your game and add it in AllRoutes.js in Routes folder then add the link in data1 in Data Folder */}
                <Link to={`/games/${r.path}`}><TrianglePlayLogo /></Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="copyright">
        <div className="social-icons" >
          <a href="https://www.instagram.com/ieeessit/" target="_blank" aria-label="Visit us on Instagram" title="Instagram (External Link)"><i className='bx bxl-instagram-alt' ></i></a>
          <a href="https://github.com/ssitvit/Games-and-Go" target="_blank" aria-label="Visit us on GitHub" title="GitHub (External Link)"><i className='bx bxl-github'></i></a>
        </div>
      </div>


    </>
  );
}
