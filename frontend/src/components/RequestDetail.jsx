import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { UserContext1 } from "../context/UserContext1";
import { Link, useNavigate, useParams } from "react-router-dom";

const RequestDetail = () => {
    const navigate = useNavigate()
  const { id } = useParams();
  const [request, setRequest] = useState({});
  const [user] = useContext(UserContext1);
  const [token] = useContext(UserContext);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`http://0.0.0.0:8000/manager/requests/${id}`);
        const data = await response.json();
        setRequest(data);
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };
    fetchRequest();
  }, [id]);

  const handleConfirm = async (request) => {
    try {
      const response = await fetch("http://0.0.0.0:8000/manager/confirm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      alert(data.message); 
      navigate("/requests")
    } catch (error) {
      console.error("Error confirming request:", error);
    }
  };

  const handleReject = async (request) => {
    try {
      const response = await fetch("http://0.0.0.0:8000/manager/reject", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      alert(data.message);
      navigate("/requests")
    } catch (error) {
      alert("Error rejecting request:", error);
    }
  };

  return (
    <div>
        <Link to="/requests"/><button>Back</button>
      {token && user.role_id === 2 && (
        <div>
          <h1>Request Detail</h1>
          {request && (
            <div>
              <p>Request ID: {request.id}</p>
              <p>User ID: {request.user_id}</p>
              <div className="attributes">
                {request.datas_from_users && (
                    <>
                    <ul>
                        <li>Username: {request.datas_from_users.username}</li>
                        <li>Firstname: {request.datas_from_users.firstname}</li>
                        <li/>Lastname: {request.datas_from_users.lastname}
                        <li/>Age: {request.datas_from_users.age}
                        <li/>Nationality: {request.datas_from_users.nationality}
                        <li/>Country: {request.datas_from_users.country}
                        <li/>City: {request.datas_from_users.city}
                        <li/>Education: {request.datas_from_users.education}
                        <li/>Phone_number: {request.datas_from_users.phone_number}
                        <li/>Gender: {request.datas_from_users.gender}
                        <li/>Birthdate: {request.datas_from_users.birthdate}
                        <li/>Telegram_account: {request.datas_from_users.telegram_account}
                        <li/>Email: {request.datas_from_users.email}
                    </ul>
                    </>
                )}
              </div>
              <div>
                <button onClick={() => handleConfirm(request)}>Confirm</button>
                <button onClick={() => handleReject(request)}>Reject</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
