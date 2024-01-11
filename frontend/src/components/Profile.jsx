import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "./Profile.css";  
import {Link} from "react-router-dom";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [token] = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch("http://localhost:8000/users/profile/", requestOptions);

      const userData = await response.json();

      setUser(userData);
    };
    fetchUser();
  }, [token]);


  return (
    <>
      <Link to="/"/><button>Back</button>
      {user && token && (
        <><h2 className="profile-header">Profile</h2>
          <div className="profile-container">
          <h3 className="username">Username: {user.username}</h3>
          {/* {birthdateComponents && (
      <div className="birthdate-info">
        <strong>Birthdate:</strong> {user.birthdate}
        <div>
          <strong>Day:</strong> {birthdateComponents.day}
        </div>
        <div>
          <strong>Month:</strong> {birthdateComponents.month}
        </div>
        <div>
          <strong>Year:</strong> {birthdateComponents.year}
        </div>
      </div>
    )} */}
          <div>
            <strong>First Name:</strong> {user.firstname || "No info"}
          </div>
          <div>
            <strong>Last Name:</strong> {user.lastname || "No info"}
          </div>
          <div>
            <strong>Gender:</strong> {user.gender || "No info"}
          </div>
          <div>
            <strong>Nationality:</strong> {user.nationality || "No info"}
          </div>
          <div>
            <strong>Country:</strong> {user.country || "No info"}
          </div>
          <div>
            <strong>City:</strong> {user.city || "No info"}
          </div>
          <div>
            <strong>Education:</strong> {user.education || "No info"}
          </div>
          <div>
            <strong>Phone Number:</strong> {user.phone_number || "No info"}
          </div>
          <div>
            <strong>Email:</strong> {user.email || "No info"}
          </div>
          <div>
            <strong>Telegram Account:</strong> {user.telegram_account || "No info"}
          </div>
        </div></>
      )}
    </>
  );
};

export default Profile;
