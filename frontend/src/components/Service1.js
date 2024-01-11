import React, { useEffect, useState, useContext } from "react";
import { UserContext1 } from "../context/UserContext1";
import { UserContext } from "../context/UserContext";
import './Service1.css';
import {Link, useNavigate} from "react-router-dom";

const Service1 = () => {
    const [user] = useContext(UserContext1);
    const [token] = useContext(UserContext);

    const navigate = useNavigate()
    const months = [
        '01', '02', '03', '04', '05', '06',
        '07', '08', '09', '10', '11', '12',
    ];
    const [editable, setEditable] = useState(true);
    const handleToggleEdit = () => {
        setEditable(!editable);
    };

    const toServices = () => {
        navigate("/services")
    }
    const years = Array.from({ length: 100 }, (_, index) => new Date().getFullYear() - index);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const kazakhstanCities = [
        "Almaty", "Nur-Sultan", "Shymkent", "Karaganda", "Aktobe", "Taraz",
        "Pavlodar", "Ust-Kamenogorsk", "Semey", "Aktobe", "Atyrau", "Kyzylorda", 
        "Petropavl", "Oral", "Kostanay", "Aktau", "Turkestan"
    ];

    const genders = ["Male", "Female", "Other"];
    const educationOptions = ["High School", "College", "Bachelor's Degree", "Master's Degree", "Ph.D.", "Other"];
    const [formData, setUserProfile] = useState({
        user_id: '',
        username: '',
        firstname: '',
        lastname: '',
        age: 0,
        nationality: '',
        country: '',
        city: '',
        education: '',
        phone_number: '',
        gender: '',
        birthdate: {
        day: '',
        month: '',
        year: '',
        },
        telegram_account: '',
        email: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleBirthdateChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prevProfile) => ({
            ...prevProfile,
            birthdate: {
                ...prevProfile.birthdate,
                [name]: value,
            },
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateString = `${formData.birthdate.year}-${formData.birthdate.month}-${formData.birthdate.day}`;
        formData.birthdate = dateString
        formData.user_id = user.user_id
        formData.username = user.username
        formData.country = user.country
        console.log(JSON.stringify(formData))
        try {
            const response = await fetch('http://localhost:8000/services/editInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                alert("Your request is send")
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
        <>
            <Link to="/services"/><button>Back</button>
            { token && (
                <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>First Name:</label>
                        <input type="text" value={formData.firstname} name="firstname"  onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        <label>Age:</label>
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        <label>Nationality:</label>
                        <input type="text" name="nationality" placeholder={user.nationality} value={editable ? formData.nationality : user.nationality} onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} readOnly={!editable} required>
                            <option value="">Select a gender</option>
                            {genders.map((gender, index) => (
                                <option key={index} value={gender}>
                                {gender}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>City:</label>
                        <select name="city" value={formData.city} onChange={handleInputChange} readOnly={!editable} required>
                            <option value="">Select a city</option>
                            {kazakhstanCities.map((city, index) => (
                                <option key={index} value={city}>
                                {city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Education:</label>
                        <select name="education" value={formData.education} onChange={handleInputChange} readOnly={!editable} required>
                            <option value="">Select education level</option>
                            {educationOptions.map((education, index) => (
                                <option key={index} value={education}>
                                {education}
                                </option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        <label>Birthdate:</label>
                            <div>
                            <select
                                name="day"
                                value={formData.birthdate.day}
                                onChange={handleBirthdateChange}
                                disabled={!editable}
                                required
                            >
                                {[...Array(31).keys()].map((day) => (
                                    <option key={day + 1} value={day + 1}>
                                        {day + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="month"
                                value={formData.birthdate.month}
                                onChange={handleBirthdateChange}
                                disabled={!editable}
                                required
                            >
                                {months.map((month, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="year"
                                value={formData.birthdate.year }
                                onChange={handleBirthdateChange}
                                disabled={!editable} 
                                required
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Telegram Account:</label>
                        <input type="text" name="telegram_account" value={formData.telegram_account} onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly={!editable} required/>
                    </div>
                    <div>
                        {editable ? (
                            <><button type="button" onClick={toServices}>Cancel</button>
                            <button type="button" onClick={handleToggleEdit}>Check and Send</button></>
                        ) : (
                            <>
                            <button type="submit">Send Request</button>
                            <button type="button" onClick={handleToggleEdit}> Edit </button></>
                        )}
                    </div>
                </form>
                </div>
            )};
            
        </>
        
    );
};

export default Service1;