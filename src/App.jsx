/*
    In this website mainly "useParams()" hook is used for the "Routing" where it easier 
    to implement.
*/


import {useState, useEffect, useRef} from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Location from "./Location"
import SignInPage from "./SignInPage"
import Home from "./Home"

// function DefaultReDirect () {
//   const navigate = useNavigate();

//   useEffect(() => {
//     navigate("/home")
//   }, [navigate])
// }

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* when ever the path is "/" it is changed to "/home" and below method is executed
        by taking path = "/home" automatically when the url includes "/home it opens the 
        home page" */}

        {/* <Route path = "/" element = {<DefaultReDirect/>}></Route> */}

        <Route path = "/home" element = {<Home/>}></Route>
        <Route path = "/home/:movieName/:ETNO" element = {<Home/>}/>
        <Route path = "/home/:movieName/buytickets/:ETNO/:currentDate" element = {<Home/>}/>
        <Route path = "/home/:movieName/buytickets/:ETNO/:Code/:currentDate" element = {<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App