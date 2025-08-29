import React, { useState } from 'react';


const SeatsAvailable = ({ theaterDetails }) => {
  const SEAT_PRICE = 147;
  
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [selectedShowTime, setSelectedShowTime] = useState(
    theaterDetails?.show_times?.[0] || ""
  );

  // Generate some random booked seats for demonstration
  const initialBookedSeats = new Set();
  
  React.useEffect(() => {
    setBookedSeats(initialBookedSeats);
  }, []);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.has(seatId)) return; // Can't select booked seats
    
    const newSelectedSeats = new Set(selectedSeats);
    if (newSelectedSeats.has(seatId)) {
      newSelectedSeats.delete(seatId);
    } else {
      newSelectedSeats.add(seatId);
    }
    setSelectedSeats(newSelectedSeats);
  };

  const handleShowTimeClick = (time) => {
    setSelectedShowTime(time);
  };

  const handlePayment = () => {
    if (selectedSeats.size === 0) {
      alert('Please select at least one seat!');
      return;
    }
    
    // Move selected seats to booked seats
    const newBookedSeats = new Set([...bookedSeats, ...selectedSeats]);
    setBookedSeats(newBookedSeats);
    setSelectedSeats(new Set());
    
    alert(`Payment successful! ₹${selectedSeats.size * SEAT_PRICE} paid for ${selectedSeats.size} seat(s).`);
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.has(seatId)) return 'booked';
    if (selectedSeats.has(seatId)) return 'selected';
    return 'available';
  };

  const totalAmount = selectedSeats.size * SEAT_PRICE;

  // Handle case where theaterDetails is not provided
  if (!theaterDetails) {
    return <div className="SeatsAvailable-container">Theater details not available</div>;
  }

  return (
    <div className="SeatsAvailable-container">
      <div className="SeatsAvailable-main-wrapper">
        
        {/* Header */}
        <div className="SeatsAvailable-header">
          <div className="SeatsAvailable-header-content">
            <div className="SeatsAvailable-movie-info">
              <h1>{theaterDetails.movie_name}</h1>
              <p className="SeatsAvailable-movie-details">
                Movie ID: {theaterDetails.movie_id}
              </p>
              <p className="SeatsAvailable-theater-name">{theaterDetails.theater_name}</p>
              <p className="SeatsAvailable-theater-id">{theaterDetails.theater_id}</p>
              <p className="SeatsAvailable-cancellation">
                Cancellation: {theaterDetails.cancellation ? 'Available' : 'Not Available'}
              </p>
            </div>
            <div className="SeatsAvailable-price-info">
              <p className="SeatsAvailable-price">₹{SEAT_PRICE}</p>
              <p className="SeatsAvailable-price-label">per seat</p>
            </div>
          </div>
        </div>

        {/* Show Times */}
        {/* <div className="SeatsAvailable-showtimes">
          <h2>Select Show Time</h2>
          <div className="SeatsAvailable-showtime-buttons">
            {theaterDetails.show_times?.map((time) => (
              <button
                key={time}
                onClick={() => handleShowTimeClick(time)}
                className={`SeatsAvailable-showtime-btn ${
                  selectedShowTime === time ? 'active' : ''
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div> */}

        {/* Available Dates */}
        {/* <div className="SeatsAvailable-dates">
          <h2>Available Dates</h2>
          <div className="SeatsAvailable-dates-list">
            {theaterDetails.available_dates?.map((date, index) => (
              <div key={index} className="SeatsAvailable-date-item">
                {new Date(date).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            ))}
          </div>
        </div> */}

        {/* Screen */}
        <div className="SeatsAvailable-screen-section">
          <div className="SeatsAvailable-screen">SCREEN</div>
        </div>

        {/* Seat Layout */}
        <div className="SeatsAvailable-seat-layout">
          <div className="SeatsAvailable-seat-rows">
            {Object.entries(theaterDetails.seat_layout || {}).map(([row, seatCount]) => (
              <div key={row} className="SeatsAvailable-seat-row">
                <div className="SeatsAvailable-row-label">{row}</div>
                <div className="SeatsAvailable-seats">
                  {[...Array(seatCount)].map((_, index) => {
                    const seatNumber = index + 1;
                    const seatId = `${row}${seatNumber}`;
                    const status = getSeatStatus(seatId);
                    
                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={status === 'booked'}
                        className={`SeatsAvailable-seat ${status}`}
                        title={`Seat ${seatId} - ${status === 'booked' ? 'Booked' : status === 'selected' ? 'Selected' : 'Available'}`}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="SeatsAvailable-legend">
            <div className="SeatsAvailable-legend-item">
              <div className="SeatsAvailable-legend-color available"></div>
              <span className="SeatsAvailable-legend-text">Available</span>
            </div>
            <div className="SeatsAvailable-legend-item">
              <div className="SeatsAvailable-legend-color selected"></div>
              <span className="SeatsAvailable-legend-text">Selected</span>
            </div>
            <div className="SeatsAvailable-legend-item">
              <div className="SeatsAvailable-legend-color booked"></div>
              <span className="SeatsAvailable-legend-text">Booked</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        {selectedSeats.size > 0 && (
          <div className="SeatsAvailable-summary">
            <h3>Booking Summary</h3>
            <div className="SeatsAvailable-summary-row">
              <span>Movie:</span>
              <span className="SeatsAvailable-summary-value">{theaterDetails.movie_name}</span>
            </div>
            <div className="SeatsAvailable-summary-row">
              <span>Theater:</span>
              <span className="SeatsAvailable-summary-value">{theaterDetails.theater_name}</span>
            </div>
            <div className="SeatsAvailable-summary-row">
              <span>Booking Date:</span>
              <span className="SeatsAvailable-summary-value">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="SeatsAvailable-summary-row">
              <span>Selected Seats:</span>
              <span className="SeatsAvailable-summary-value">{Array.from(selectedSeats).join(', ')}</span>
            </div>
            <div className="SeatsAvailable-summary-row">
              <span>Show Time:</span>
              <span className="SeatsAvailable-summary-value">{selectedShowTime}</span>
            </div>
            <div className="SeatsAvailable-summary-row">
              <span>Number of Seats:</span>
              <span className="SeatsAvailable-summary-value">{selectedSeats.size}</span>
            </div>
            <div className="SeatsAvailable-summary-row">
              <span>Total Amount:</span>
              <span className="SeatsAvailable-summary-value SeatsAvailable-summary-total">₹{totalAmount}</span>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="SeatsAvailable-payment-section">
          <button
            onClick={handlePayment}
            disabled={selectedSeats.size === 0}
            className={`SeatsAvailable-pay-btn ${
              selectedSeats.size > 0 ? 'enabled' : 'disabled'
            }`}
          >
            {selectedSeats.size > 0 
              ? `Pay ₹${totalAmount}` 
              : 'Select Seats to Continue'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatsAvailable;