// Updated App.jsx - Use your existing but add error boundary
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UpdatedHome from "./components/UpdatedHome";

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1>Something went wrong</h1>
                    <p>The application encountered an unexpected error.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginTop: '16px'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<UpdatedHome />} />
                    <Route path="/home/:movieName/:ETNO" element={<UpdatedHome />} />
                    <Route path="/home/:movieName/buytickets/:ETNO/:currentDate" element={<UpdatedHome />} />
                    <Route path="/home/:movieName/buytickets/:ETNO/:Code/:currentDate" element={<UpdatedHome />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
