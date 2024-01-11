import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { UserProvider1 } from "./context/UserContext1";
import Login from "./components/Login";
import Register from "./components/Register";
import Services from "./components/Services";
import Service1 from "./components/Service1";
import Profile from "./components/Profile";
import Requests from "./components/Requests";
import RequestDetail from "./components/RequestDetail.jsx";
import Service2 from "./components/Service2";

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
        ]
    },
    {
        path: "auth/login",
        element: <Login/>,
    },
    {
        path: "auth/register",
        element: <Register/>,
    },
    {
        path: "profile",
        element: <Profile/>,
    },
    {
        path: "services",
        element: <Services/>,
    },
    {
        path: "services/editInfo",
        element: <Service1/>,
    },
    {
        path: "services/getInfo",
        element: <Service2/>,
    },
    {
        path: "requests",
        element: <Requests/>,
    },
    {
        path: "requests/:id",
        element: <RequestDetail/>,
    }
])
root.render(
    <UserProvider>
        <UserProvider1>
            <RouterProvider router = {router} />
        </UserProvider1>
    </UserProvider>,

);