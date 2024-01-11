import React, { useEffect, useState, useContext } from "react";
import './Header.css';
import { UserContext } from "../context/UserContext";
import { UserContext1 } from "../context/UserContext1";
import {Link, useNavigate} from "react-router-dom";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [token, setToken] = useContext(UserContext);
  const [user] = useContext(UserContext1);
  const [requests, setRequests] = useState([]);
  const handleLogout = () => {
    setToken(null);
    navigate("/auth/login")
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://0.0.0.0:8000/manager/requests");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  if (!user || !user.user_id) {
    return null;
  }

  const filterRequestsByUserId = (requests, userId) => {
    return requests.filter(request => request.user_id === userId);
  };
  const filteredRequests = filterRequestsByUserId(requests, user.user_id);

  const getStatus = (request) => {
    if (!request.is_done && !request.confirmed) {
      return "In process";
    } else if (request.is_done && request.confirmed) {
      return "Your request is confirmed";
    } else if (request.is_done && !request.confirmed) {
      return "Your request is rejected";
    }
    return "";
  };

  return (
    <div className="has-text-centered m-6">
      <h1 className="title">{title}</h1>
      {token && user ? (
        user.role_id === 1 ? (
          <div>
            <div className="links">
              <Link to="profile">Profile</Link>
              <Link to="services">Services</Link>
              <button className="button1" onClick={handleLogout}>
                Logout
              </button>
            </div>
            <hr className="horizontal-line" />

            <h2>My requests</h2>
            {filteredRequests.map((request) => (
              <div key={request.id}>
                <p>Request type: {request.type}</p>
                <p>Status: {getStatus(request)}</p>
                <hr/>
              </div>
            ))}
          </div>
        ) : user.role_id === 2 ? (
          <div className="container">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="requests">Requests</Link>
              </li>
              <button className="button1" onClick={handleLogout}>
                Logout
              </button>
            </ul>
          </div>
        ) : null
      ) : null}

    </div>
  );
};

export default Header;