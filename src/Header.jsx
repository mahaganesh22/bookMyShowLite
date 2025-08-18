import { Link, useNavigate } from "react-router-dom"
import Location from "./Location"
import SignInPage from "./SignInPage"
import { useState } from "react";
import AutoComplete from "./AutoComplete";



function Header () {

    const [setLocation, setShowLocation] = useState(false);
    const [setLogInPage, setShowLogInPage] = useState(false);
    const [logInVerification, setLogInVerification] = useState(false);
    const navigate = useNavigate();
    
    return (
        <header className="Header">
            <div>
                <img className="mainLogo"
                    src = "/logo-image.png"
                />
            </div>

            {<AutoComplete/>}

            <div className="location">
                <button className = "locationButton" onClick={() => setShowLocation(true)}>Location</button>
                {/* <a href = "/Location" target="_blank" rel="noopener noreferrer">Location</a> */}
                {setLocation && <Location onClose = {() => setShowLocation(false)}/>}

                {
                    !logInVerification ? 
                        (
                            <button 
                                className = "signInButton" 
                                onClick = {() => setShowLogInPage(true)}
                            >
                                sign in
                            </button>
                        ) :
                        (
                            <button
                                className = "profile"
                                type = "button"
                            >
                                Hi, Guest
                            </button>
                        )

                }

                {
                    setLogInPage && 
                    <SignInPage 
                        verified = {() => setLogInVerification(true)}
                        onClose = {() => setShowLogInPage(false)}
                    />
                }
            </div>

            <div>
                {
                    !logInVerification && 
                    <a href="/menu">
                        <img 
                            className = "HamBurgerMenu" 
                            src = "/hamburgerMenu.png"
                        />
                    </a>
                }
            </div>
        </header>
    )
}

export default Header

