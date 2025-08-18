import React, { useState } from 'react';
import { Heart, Info, ChevronDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TheaterPage({movieDetails}) {

  const formatDate = (date1) => {
    const date = new Date(date1)

    if (isNaN(date)) {
        console.error("Invalid date provided:", date1);
        return null;
    }

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                   'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    return {
         day : days[date.getDay()],
        date : date.getDate().toString(),
       month : months[date.getMonth()],
     urlMode : date.getFullYear().toString() +
                  String(date.getMonth() + 1).padStart(2, '0') +
                  String(date.getDate()).padStart(2, '0')
    };
  };

  // Filter show times based on current time (30 minutes buffer) - only for today
  const getAvailableShowTimes = (showTimes, selectedDate) => {
    if (!showTimes) return [];
    
    // Check if selected date is today
    const now = new Date();
    const today = now.toDateString();
    
    // Find the selected date object
    const selectedDateObj = dates.find(d => d.date === selectedDate);
    if (!selectedDateObj) return showTimes;
    
    // Convert urlMode back to date for comparison
    const year = parseInt(selectedDateObj.urlMode.substring(0, 4));
    const month = parseInt(selectedDateObj.urlMode.substring(4, 6)) - 1;
    const day = parseInt(selectedDateObj.urlMode.substring(6, 8));
    const selectedDateForComparison = new Date(year, month, day);
    
    // If booking is for a future date, show all show times
    if (selectedDateForComparison.toDateString() !== today) {
      return showTimes;
    }
    
    // If booking is for today, filter based on current time
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return showTimes.filter(showTime => {
      // Parse show time (e.g., "11:30 AM" or "09:50 PM")
      const [time, period] = showTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      
      let showTimeIn24Hours = hours;
      if (period === 'PM' && hours !== 12) {
        showTimeIn24Hours += 12;
      } else if (period === 'AM' && hours === 12) {
        showTimeIn24Hours = 0;
      }
      
      const showTimeInMinutes = showTimeIn24Hours * 60 + minutes;
      
      // Show time should be at least 30 minutes from now
      return showTimeInMinutes >= (currentTime + 30);
    });
  };

  const {currentDate} = useParams();

  const movieTheaters = movieDetails
  const availableDates = movieTheaters.theaters[0].available_dates

  const dates = availableDates.map((date) => (
    formatDate(date)
  ))

  const tags = movieDetails.tags;

  const [selectedDate, setSelectedDate] = useState(() => {
    if (currentDate && dates.length > 0) {
      const matchingDate = dates.find((d) => d.urlMode === currentDate);
      return matchingDate ? matchingDate.date : dates[0]?.date || '';
    }
    return dates[0]?.date || '';
  });

  useEffect(() => {
    if (currentDate && dates.length > 0) {
      const matchingDate = dates.find((d) => d.urlMode === currentDate);
      if (matchingDate && matchingDate.urlMode !== currentDate) {
        setSelectedDate(matchingDate.date);
      }
    }
  }, [currentDate, dates, selectedDate]);

  const navigate = useNavigate();

  const handleClickOnDate = (date) => {
    setSelectedDate(date.date)
    const movieSlug = movieDetails.name.toLowerCase().replace(/\s+/g, "-");
    const etno = movieDetails.etno.toUpperCase().replace(/\s+/g, "-");
    navigate(`/home/${movieSlug}/buytickets/${etno}/${date.urlMode}`, {replace : true})
  }

  const handleClickOnShowTimings = (index) => {
    const date = currentDate
    const movieSlug = movieDetails.name.toLowerCase().replace(/\s+/g, "-");
    const etno = movieDetails.etno.toUpperCase().replace(/\s+/g, "-");
    const code = movieDetails.theaters[index].theater_id;
    navigate(`/home/${movieSlug}/buytickets/${etno}/${code}/${date}`)
  }

  // Filter theaters that have available show times
  const availableTheaters = movieDetails.theaters.filter(cinema => {
    const availableShowTimes = getAvailableShowTimes(cinema.show_times, selectedDate);
    return availableShowTimes.length > 0;
  });

  return (
    <>
      <div className="TheaterPage">
        {/* Header */}
        <div className="TheaterPage__header">
          <div className="TheaterPage__headerContent">
            <h1 className="TheaterPage__title">
              {movieDetails.name}
            </h1>
            
            <div className="TheaterPage__tags">
              {tags.map((tag, index) => (
                <span key = {index} className="TheaterPage__tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Date Selection and Filters */}
        <div className="TheaterPage__controls">
          <div className="TheaterPage__dateSelector">
            {dates.map((date) => (
              <button
                key={date.date}
                type = "button"
                onClick={() => handleClickOnDate(date)}
                className={`TheaterPage__dateButton ${
                  selectedDate === date.date ? 'TheaterPage__dateButton--selected' : ''
                }`}
              >
                <span className="TheaterPage__dateDay">{date.day}</span>
                <span className="TheaterPage__dateNumber">{date.date}</span>
                <span className="TheaterPage__dateMonth">{date.month}</span>
              </button>
            ))}
          </div>

          <div className="TheaterPage__filters">
            <div className="TheaterPage__filter">
              <span>Telugu - 2D</span>
            </div>
            
            <div className="TheaterPage__filter">
              <span>Price Range</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            
            <div className="TheaterPage__filter">
              <span>Preferred Time</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            
            <button className="TheaterPage__searchButton">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subtitle Info */}
        <div className="TheaterPage__subtitleInfo">
          <div className="TheaterPage__subtitleContent">
            <div className="TheaterPage__subtitleLeft">
              <span className="TheaterPage__languageTag">LAN</span>
              <span className="TheaterPage__subtitleText">
                indicates subtitle language, if subtitles are available
              </span>
              <button className="TheaterPage__gotItButton">Got it</button>
            </div>
            
            <div className="TheaterPage__statusLegend">
              <div className="TheaterPage__statusItem">
                <div className="TheaterPage__statusDot TheaterPage__statusDot--available"></div>
                <span className="TheaterPage__statusText">AVAILABLE</span>
              </div>
              <div className="TheaterPage__statusItem">
                <div className="TheaterPage__statusDot TheaterPage__statusDot--fastFilling"></div>
                <span className="TheaterPage__statusText">FAST FILLING</span>
              </div>
              <div className="TheaterPage__statusItem">
                <span className="TheaterPage__languageTag">LAN</span>
                <span className="TheaterPage__statusText">SUBTITLES LANGUAGE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cinema Listings */}
        <div className="TheaterPage__cinemaList">
          <div className="TheaterPage__cinemaListContent">
            {availableTheaters.length > 0 ? (
              availableTheaters.map((cinema, index) => {
                const originalIndex = movieDetails.theaters.findIndex(t => t.theater_id === cinema.theater_id);
                const availableShowTimes = getAvailableShowTimes(cinema.show_times, selectedDate);
                
                return (
                  <div key={index} className="TheaterPage__cinemaCard">
                    <div className="TheaterPage__cinemaHeader">
                      <div className="TheaterPage__cinemaLeft">
                        <div className="TheaterPage__cinemaIcon">
                          <div className="TheaterPage__cinemaIconInner">
                            <span style={{color: 'white'}}>🎬</span>
                          </div>
                        </div>
                        
                        <div className="TheaterPage__cinemaInfo">
                          <h3 className="TheaterPage__cinemaName">{cinema.theater_name}</h3>
                          <Info className="w-4 h-4 text-gray-400" />
                        </div>
                        
                        <button className="TheaterPage__heartButton">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="TheaterPage__showtimes">
                        {availableShowTimes.map((time, timeIndex) => (
                          <button 
                            key={timeIndex}
                            className="TheaterPage__showtimeButton"
                            type = 'button'
                            onClick = {() => handleClickOnShowTimings(originalIndex)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="TheaterPage__cancellationInfo">
                      <span className={`TheaterPage__cancellationText ${
                        cinema.cancellationAvailable 
                          ? 'TheaterPage__cancellationText--available' 
                          : 'TheaterPage__cancellationText--unavailable'
                      }`}>
                        {cinema.cancellationAvailable 
                          ? 'Cancellation available' 
                          : 'Non-cancellable'
                        }
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="TheaterPage__noTheaters">
                <p>No theaters available for the selected date and time. All shows have either started or will start within 30 minutes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TheaterPage;