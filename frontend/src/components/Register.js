import React, { useState } from 'react';
import {Link} from "react-router-dom";
import "./Login.css"
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registration successful, you can redirect or show a success message
        console.log('Registration successful');
        // alert("Registration is successful, now sign in!")
        setSuccessMessage('Registration is successful, now sign in!');
      } else {
        const data = await response.json();
        setErrorMessage(data.detail);
        console.log(formData)
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An error occurred during registration.');
    }
  };

  return (
      <>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></link>
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container">
            <a className="navbar-brand mr-auto" href="#">Egov | 1414</a>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" href="#" id="register-button" to='/auth/login'>Sign in</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="content">
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-md-6">
                <div className="additional-text">
                  <p>
                    <span className="green-text" id="additional-text"></span>
                    <br />
                    <span id="additional-text-content"></span>
                  </p>
                </div>
                <div className="card">
                  <div className="card-header">
                    <h3 className="text-center" id="card-header">User registration</h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3 text-center">
                        <label htmlFor="username" className="form-label" id="username-label"></label>
                        <input  className="form-control" type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required/>
                      </div>
                      <div className="mb-3 text-center">
                        <label htmlFor="password" className="form-label" id="password-label"></label>
                        <input className="form-control" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required
                        />
                      </div>
                      <div className="mb-3">
                        <button type="submit" className="btn btn-primary" id="sign-in-button">Register</button>
                      </div>
                    </form>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="error-message">{successMessage}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">© <span id="footer-text">Electronic Government of the Republic of Kazakhstan</span></div>
      </>
  );
};

export default RegistrationForm;
