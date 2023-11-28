import { Link } from "react-router-dom";
import AppRoutes from "../../utils/AppRoutes";
import { Card, Col, Row } from "react-bootstrap";
import TrianglePlayLogo from "../../components/TrianglePlayLogo";
import { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Iframe from "react-iframe";
import { API_BASE_URL } from "../../configs/api-endpoints";
import { UserContext } from "../../contexts/UserContext";
import { TotalRankingBoard } from "../../components/TotalRankingBoard";

const gameRoutes = AppRoutes.filter(r => r.path?.includes("/games"))[0].sub_routes;

export default function Home() {
  const { user, setUser, getChatUserName } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [tag, setTag] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
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

  function onTagClicked(e) {
    let text = e.target.innerText;

    if (tag === '') {
      setSelectedTag(text);
      setTag(text);
    }
    else {
      if (tag === text) {
        text = '';
        setTag('');
        setSelectedTag('');
      }
      else {
        setTag(text);
        setSelectedTag(text);
      }
    }

    const filtered = text === ''
      ? gameRoutes // Show all values if search query is empty
      : gameRoutes.filter((item) =>
        item.categories?.includes(text)
      );
    setFilteredAppRoutes(filtered);
  }

  function handleSwitchToAnonymous(e) {
    e.preventDefault();

    if (user.username !== undefined && user.username !== "")
      setUser({ 
        ...user,
        isAnonymous: !user.isAnonymous
      });
  }

  return (
    <>
      <div className="container_landing">
        <div className="text"></div>
      </div>

      <TotalRankingBoard />

      <div className="chat-section p-0">
        { user !== undefined && (
          <Iframe
            url={`${API_BASE_URL}/reactchat/${getChatUserName()}`}
            height="480px"
            className="w-100"
            id=""
          />
        )}
      </div>
      <button onClick={handleSwitchToAnonymous}>익명 on/off</button>

      {/* Heading of Cards */}
      <div className="header_homepage">
        <h1> Game on!!</h1>
      </div>

      <div className="search-section">
        <input
          id="search-game"
          name="search-game"
          type="text"
          className="search-input text-warning"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="게임 검색..."
        />
        <label className="search-icon">
          <FaSearch />
        </label>
      </div>

      <div className="category-box d-flex justify-content-around align-items-center">
        <div onClick={onTagClicked} className={`category-tag rounded-5 ${selectedTag === 'Arcade' ? 'selected' : ''}`}>Arcade</div>
        <div onClick={onTagClicked} className={`category-tag rounded-5 ${selectedTag === 'Shooting' ? 'selected' : ''}`}>Shooting</div>
        <div onClick={onTagClicked} className={`category-tag rounded-5 ${selectedTag === 'Puzzle' ? 'selected' : ''}`}>Puzzle</div>
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
    </>
  );
}
