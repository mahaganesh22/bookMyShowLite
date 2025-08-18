// import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function SignInPage({onClose, verified}) {

    const [userId, setUserId] = useState("");
    const [otp, setOTP] = useState("");
    const [otpPage, setOTPPage] = useState(false);
    const generatedOTP = useRef("");

    const handleOverLayClick = () => {
        // console.log("Before onClose()");
        onClose();
        // console.log("After onClose()");
    }

    const handleUserIdChange = (e) => {
        const value = e.target.value;
        if (!otpPage) {
            setUserId(value)
            setOTP("");
        } else {
            setOTP(value);
            setUserId("");
        }
    }

    const isValidEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(userId);
    }

    const isValidPhone = () => {
        const regex = /^[0-9]{10}$/;
        return regex.test(userId)
    }

    async function getOTP () {
        try {
            const res = await fetch("http://localhost:3000")
            const data = await res.json();
            generatedOTP.current = data.toString();
            console.log("generatedOTP = " + generatedOTP.current);
            // console.log(typeof(data))
            // console.log(typeof(generatedOTP))
        } catch(err) {
            console.log("Error identified" + err);
        }
    }

    const handleContentClick = (e) => {
        e.stopPropagation();
    }

    const handleOTPPage = async (e) => {
        e.preventDefault();

        if (otpPage == false) {
            if (isValidEmail() || isValidPhone()) {
                await getOTP();
                setOTPPage(prev => !prev);
            } else {
                alert("Enter a valid Email or Phone Number");
            }
        } else {
            // console.log(otp);
            // console.log("type = " + typeof(otp));
            if (otp === generatedOTP.current) {
                // console.log("Inside true");
                handleOverLayClick();
                verified();
            } else {
                alert("The otp is incorrect");
                setOTP("");
            }
        }
    }

    return (
        <div>
            <div className = "signInPageClickOutside">
                <form 
                    className = "signInPageClickInside" 
                    onSubmit = {handleOTPPage} 
                    onClick={handleContentClick}
                >
                    <button 
                        type = "button"
                        className = "crossButton" 
                        onClick = {handleOverLayClick}
                    >
                        ❌
                    </button>
                    <img 
                        className = "logoImage" 
                        src = "/bookMyShowLogo.png" 
                        alt = "Logo Image"
                    />
                    {!otpPage && (<input
                        className = "userId"
                        key = "gmailInput"
                        type = "text"
                        value = {userId}
                        onChange = {handleUserIdChange}
                        placeholder = "Enter Gmail or Phone Number"
                    />)}

                    {otpPage && (<input
                        className = "userId"
                        key = "otpInput"
                        type = "text"
                        value = {otp}
                        onChange = {handleUserIdChange}
                        placeholder = "Enter OTP"
                    />)}

                    <button 
                        type = "submit" 
                        className = "signInSubmit" 
                    >
                        {otpPage ? "Verify OTP" : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignInPage;