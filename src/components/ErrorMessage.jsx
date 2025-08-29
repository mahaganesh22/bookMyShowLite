// components/ErrorMessage.jsx
function ErrorMessage({ message, error, onRetry }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#fff5f5',
            border: '1px solid #fed7d7',
            borderRadius: '8px',
            margin: '20px'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                color: '#e53e3e'
            }}>
                ⚠️
            </div>
            <h2 style={{
                fontSize: '24px',
                color: '#e53e3e',
                marginBottom: '12px'
            }}>
                {message}
            </h2>
            {error && (
                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '24px',
                    maxWidth: '600px'
                }}>
                    {typeof error === 'string' ? error : 'An unexpected error occurred'}
                </p>
            )}
            {onRetry && (
                <button
                    onClick={onRetry}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#cc3333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;