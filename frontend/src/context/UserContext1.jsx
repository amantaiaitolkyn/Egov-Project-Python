import React, { createContext, useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
export const UserContext1 = createContext();

// export const UserProvider1 = (props) => {
//     const [user, setUser] = useState(localStorage.getItem("awesomeLeadsToken"));
//     const [token] = useContext(UserContext);
//     useEffect(() => {
//       const fetchUser = async () => {
//         const requestOptions = {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         };
  
//         const response = await fetch("http://localhost:8000/users/profile/", requestOptions);
  
//         if (!response.ok) {
//           setUser(null);
//         }
//         localStorage.setItem("awesomeLeadsToken", user);
//         console.log(response.json().then())
//       };
//       fetchUser();
//     }, [user]);
  
//     return (
//         <UserContext1.Provider value={[user, setUser]}>
//           {props.children}
//         </UserContext1.Provider>
//     );
//   };
// export const UserProvider1 = (props) => {
//     const [user, setUser] = useState(null); // Initialize user state as null initially
//     const [token] = useContext(UserContext);
  
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const requestOptions = {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: "Bearer " + token,
//                     },
//                 };

//                 const response = await fetch("http://localhost:8000/users/profile/", requestOptions);

//                 if (response.ok) {
//                     const userData = await response.json();
//                     setUser(userData); // Update the user state with fetched data
//                     localStorage.setItem("awesomeLeadsToken", JSON.stringify(userData)); // Update localStorage with the new user data
//                 } else {
//                     setUser(null);
//                     localStorage.removeItem("awesomeLeadsToken"); // Remove token if fetching fails
//                 }
//             } catch (error) {
//                 console.error('Error fetching user:', error);
//                 setUser(null);
//                 localStorage.removeItem("awesomeLeadsToken"); // Remove token if an error occurs during fetching
//             }
//         };
      
//         fetchUser();
//     }, [token]);
  
//     return (
//         <UserContext1.Provider value={[user, setUser]}>
//           {props.children}
//         </UserContext1.Provider>
//     );
// };

export const UserProvider1 = (props) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("awesomeLeadsUser")) || {});
  const [token] = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          };

          const response = await fetch(
            "http://localhost:8000/users/profile/",
            requestOptions
          );

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem("awesomeLeadsUser", JSON.stringify(userData));
            console.log(userData); 
          } else {
            setUser(null);
            localStorage.removeItem("awesomeLeadsUser");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext1.Provider value={[user, setUser]}>
      {props.children}
    </UserContext1.Provider>
  );
};
