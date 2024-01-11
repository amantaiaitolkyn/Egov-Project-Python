import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { UserContext1 } from "../context/UserContext1";
import {Link, useNavigate} from "react-router-dom";
import "./Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [user] = useContext(UserContext1);
  const [token] = useContext(UserContext);

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


  return (
    <>
      {token && user.role_id === 2 && (
        <div>
          <h1>All Requests</h1>
          <h1>New request</h1>
          {requests.map((request) => (
            <div key={request.id}>
              {!request.is_done && (
                <>
                <Link to={`${request.id}`}>
                  <p>Request type: {request.type}</p>
                  {request.datas_from_users && request.datas_from_users.username && (
                    <>
                    <p>From {request.datas_from_users.username}</p>
                    </>
                  )}
                </Link>
                </>
              )}
              <hr />
            </div>
          ))}
          <h1>Completed requests</h1>
          {requests.map((request) => (
            <div key={request.id}>
              {request.is_done && (
                <>
                  <p>Request type: {request.type}</p>
                  {request.datas_from_users && request.datas_from_users.username && (
                    <>
                    <p>From {request.datas_from_users.username}</p>
                    </>
                  )}
                </>
              )}
              <hr />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Requests;
