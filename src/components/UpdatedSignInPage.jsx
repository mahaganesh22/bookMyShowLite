
// components/UpdatedSignInPage.jsx
import { useState, useRef } from "react";
import { apiService } from "../services/api.js";

function UpdatedSignInPage({ onClose, verified }) {
    const [userId, setUserId] = useState("");
    const [otp, setOTP] = useState("");
    const [otpPage, setOTPPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [developmentOtp, setDevelopmentOtp] = useState("");

    const handleOverLayClick = () => {
        onClose();
    };

    const handleUserIdChange = (e) => {
        const value = e.target.value;
        setError(""); // Clear error when user types
        
        if (!otpPage) {
            setUserId(value);
            setOTP("");
        } else {
            setOTP(value);
        }
    };

    const isValidEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(userId);
    };

    const isValidPhone = () => {
        const regex = /^[0-9]{10}$/;
        return regex.test(userId);
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleOTPPage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (!otpPage) {
                // Send OTP
                if (!isValidEmail() && !isValidPhone()) {
                    setError("Enter a valid Email or Phone Number");
                    return;
                }

                const response = await apiService.sendOTP(userId);
                
                if (response.success) {
                    setOTPPage(true);
                    // Store development OTP if provided
                    if (response.development_otp) {
                        setDevelopmentOtp(response.development_otp);
                    }
                } else {
                    setError(response.error || "Failed to send OTP");
                }
            } else {
                // Verify OTP
                if (!otp.trim()) {
                    setError("Please enter the OTP");
                    return;
                }

                const response = await apiService.verifyOTP(userId, otp);
                
                if (response.success) {
                    // Store user session if provided
                    if (response.user?.sessionToken) {
                        sessionStorage.setItem('userSession', JSON.stringify(response.user));
                    }
                    
                    handleOverLayClick();
                    verified();
                } else {
                    setError(response.error || "Invalid OTP");
                    setOTP("");
                }
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signInPageClickOutside" onClick={handleOverLayClick}>
            <form 
                className="signInPageClickInside" 
                onSubmit={handleOTPPage} 
                onClick={handleContentClick}
            >
                <button 
                    type="button"
                    className="crossButton" 
                    onClick={handleOverLayClick}
                    disabled={isLoading}
                >
                    ✕
                </button>
                
                <img 
                    className="logoImage" 
                    src="/bookMyShowLogo.png" 
                    alt="Logo Image"
                />

                {error && (
                    <div style={{
                        position: 'absolute',
                        top: '150px',
                        left: '30px',
                        right: '30px',
                        padding: '8px 12px',
                        backgroundColor: '#fed7d7',
                        color: '#c53030',
                        border: '1px solid #feb2b2',
                        borderRadius: '4px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {!otpPage ? (
                    <input
                        className="userId"
                        key="gmailInput"
                        type="text"
                        value={userId}
                        onChange={handleUserIdChange}
                        placeholder="Enter Gmail or Phone Number"
                        disabled={isLoading}
                        style={{
                            opacity: isLoading ? 0.6 : 1
                        }}
                    />
                ) : (
                    <>
                        <input
                            className="userId"
                            key="otpInput"
                            type="text"
                            value={otp}
                            onChange={handleUserIdChange}
                            placeholder="Enter OTP"
                            disabled={isLoading}
                            maxLength="6"
                            style={{
                                opacity: isLoading ? 0.6 : 1
                            }}
                        />
                        {developmentOtp && (
                            <div style={{
                                position: 'absolute',
                                top: '240px',
                                left: '30px',
                                right: '30px',
                                padding: '4px 8px',
                                backgroundColor: '#d4edda',
                                color: '#155724',
                                border: '1px solid #c3e6cb',
                                borderRadius: '4px',
                                fontSize: '12px',
                                textAlign: 'center'
                            }}>
                                Dev OTP: {developmentOtp}
                            </div>
                        )}
                    </>
                )}

                <button 
                    type="submit" 
                    className="signInSubmit"
                    disabled={isLoading || (!otpPage && !userId.trim()) || (otpPage && !otp.trim())}
                    style={{
                        opacity: isLoading ? 0.6 : 1,
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Please wait...' : (otpPage ? "Verify OTP" : "Continue")}
                </button>

                {otpPage && (
                    <button
                        type="button"
                        onClick={() => {
                            setOTPPage(false);
                            setOTP("");
                            setError("");
                        }}
                        style={{
                            position: 'absolute',
                            top: '310px',
                            left: '150px',
                            padding: '5px 20px',
                            backgroundColor: 'transparent',
                            color: '#666',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}
                        disabled={isLoading}
                    >
                        Back
                    </button>
                )}
            </form>
        </div>
    );
}

export default UpdatedSignInPage;