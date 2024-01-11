import {Link} from "react-router-dom";
import React, { useContext } from "react";
import "./Services.css";
import { UserContext } from "../context/UserContext";
const Services = () => {
    const [token] = useContext(UserContext);
    return (

        <>
            {token && (
                <><Link to="/"><button>Back</button>
                </Link><h2>Services</h2>
                <Link to="editInfo">Editing personal info</Link>
                <Link to="getInfo">Getting info by legal entity</Link></>
            )};
        </>
    )
}

export default Services;