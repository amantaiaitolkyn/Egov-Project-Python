import React, {useContext, useState} from 'react';
import {UserContext} from "../context/UserContext";
import './Login.css';
import "https://code.jquery.com/jquery-3.5.1.slim.min.js"
import "https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
import "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"

import {Link, useNavigate} from "react-router-dom";
import { UserContext1 } from '../context/UserContext1';

const Login = () => {
    const navigate = useNavigate();
    const [, setToken] = useContext(UserContext);
    const [, setUser] = useContext(UserContext1);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the login data to your backend for authentication
        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful');
                setToken(data.access_token);
                setUser();
                navigate("/");
            } else {
                setErrorMessage(data.detail);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login.');
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
                            <Link className="nav-link" href="#" id="register-button" to='/auth/register'>Register</Link>
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
                                    <span className="green-text" id="additional-text">Dear users!</span>
                                    <br />
                                    <span id="additional-text-content">For the purpose of enhancing security and protecting your profiles, we inform you that multi-factor authorization (mandatory confirmation by entering SMS code after entering a login (IIN/BIN) and password) is used during the authorization process. The approach is being implemented pursuant to the Single Requirements in the field of information and communication technologies and information security approved by the Decree of the Government of the Republic of Kazakhstan as of December 20, 2016 No. 832.</span>
                                </p>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-center" id="card-header">Login to the portal</h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3 text-center">
                                            <label htmlFor="username" className="form-label" id="username-label">Username</label>
                                            <input  className="form-control" type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required/>
                                        </div>
                                        <div className="mb-3 text-center">
                                            <label htmlFor="password" className="form-label" id="password-label">Password</label>
                                            <input className="form-control" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required
                                                        />
                                        </div>
                                        <div className="mb-3">
                                            <button type="submit" className="btn btn-primary" id="sign-in-button">Sign In</button>
                                        </div>
                                    </form>
                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">© <span id="footer-text">Electronic Government of the Republic of Kazakhstan</span></div>
            <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

        </>
    );
};

export default Login;
