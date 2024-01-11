
import axios from 'axios';
import React, { useState, useContext } from "react";
import { UserContext1 } from "../context/UserContext1";
import { UserContext } from "../context/UserContext";
import {useNavigate} from "react-router-dom";
const Service2 = () => {
  const [token] = useContext(UserContext);
  const navigate = useNavigate()
  const [bin, setBin] = useState('');
  const [name, setName] = useState('');
  const [companyExists, setCompanyExists] = useState(null);
  const [showSendRequestButton, setShowSendRequestButton] = useState(false);
  const [user] = useContext(UserContext1);
  const handleCheckCompany = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/services/check-company/${bin}/ru`);

      if (response.status === 200) {
        console.log(response.data)
        const { exists, Name} = response.data;
        setCompanyExists(exists);
        setShowSendRequestButton(exists); 
        setName(Name)
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleSendRequest = async () => {
    console.log('Send Request button clicked!');
    try {
        const payload = {
                username: user.username,
                bin: bin,
                status: false 
        }
        console.log(payload)
        const response = await fetch('http://localhost:8000/services/getInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            const link = "https://t.me/egovProjectAdvP_bot";
            alert(`Your request is sent. Please follow this link to launch the Telegram bot: ${link}`);
            window.open(link, "_blank");
            navigate("/services");
        } else {
            alert(response.detail)
            navigate("/services")
        }
    } catch (error) {
        console.error('Login error:', error);
        
    }
  };

  return (
    <div>
      <label>
        BIN/IN:
        <input
          type="text"
          value={bin}
          onChange={(e) => setBin(e.target.value)}
        />
      </label>

      <button onClick={handleCheckCompany}>Check Company</button>

      {companyExists ? (
        <p style={{ color: 'green' }}>Company exists!</p>
      ) : (
        <p style={{ color: 'red' }}>Company does not exist!</p>
      )}

      {showSendRequestButton && (
        <>
          <label>
            Name: {name}
          </label>
          <button onClick={handleSendRequest}>Send Request</button>
        </>
      )}
    </div>
  );
};

export default Service2;
