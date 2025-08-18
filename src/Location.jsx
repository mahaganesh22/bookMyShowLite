import { useNavigate } from 'react-router-dom';

function Location({onClose}) {

  // Handle click on the outer overlay
  const handleOverlayClick = () => {
    onClose(); // or use navigate(-1) to go back
  };

  // Prevent closing when clicking inside the content box
  const handleContentClick = (e) => {
    e.stopPropagation(); // Stops the event from bubbling up to the overlay
  };

  return (
    <>
      <style>
      {`
        @keyframes slideDown {
          from {
            transform: translateY(-200px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}
      </style>
      <div
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          padding: '10px',
          boxSizing: 'border-box',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          animation: 'slideDown 0.3s ease-out',
          overflow: 'auto',
        }}
        onClick={handleOverlayClick}
      >
        <div
          onClick={handleContentClick}
          style={{
            position : 'absolute',
            top : '60px',
            left: '60px',
            right: '60px',
            bottom: '200px',
            padding : '180px',
            backgroundColor: '#fff',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            margin: '0 auto',
          }}
        >
          <h1>This is the Location page</h1>
          <p>Click outside this box to exit.</p>
        </div>
      </div>
    </>
  );
}

export default Location;
