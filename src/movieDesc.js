let index = 0
const today = new Date();

const formatDate = (date) => {
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

const generateDates = (numDays) => {
  const dates = [];

  for (let i = 0; i < numDays; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i);
    dates.push(formatDate(date));
  }

  return dates;
}

const todayDate = today.getFullYear().toString() +
                  String(today.getMonth() + 1).padStart(2, '0') +
                  String(today.getDate()).padStart(2, '0');

                  
const movieDesc = [
    {
        key  : index++,
        src  : "movie1.avif",
        name : "How to Train your Dragon",
        time : "2h 43m . ",
 releaseDate : "24 Jul, 2025",
      censor : "UA 16+ . ",
        type : "Adventure/Family/Fantasy . ",
        tags : ["Adventure", "Family", "Fantasy"],
        ETNO : "ET00308207",
    theaters : [
        {
                           name : 'Harihar Cinemas: Guntur',
                           code : 'HHCG',
                      showtimes : ['06:30 PM', '09:45 PM'],
          cancellationAvailable : true
        },
        {
                           name : 'Siva Cinemas Dolby Atmos: Guntur',
                      showtimes : ['06:30 PM', '10:00 PM'],
                           code : 'SCDG',
          cancellationAvailable : false
        }
      ],
        Date : todayDate,
       dates : generateDates(7),
  aboutMovie : `Veera Mallu, a fearless warrior shaped by the hardships of his early life,emerges as the first Indian to rise against the 
oppressive Mughal empire. Driven by a burning desire for justice, he embarks on a daring mission to confront the 
ruthless actions of the army generals, igniting a revolutionary spark that could change the course of history.`
    },
    {
        key  : index++,
        src  : "movie2.avif",
        name : "Bhairavam",
        time : "2h 43m . ",
 releaseDate : "24 Jul, 2025",
      censor : "UA 16+ . ",
        type : "Action/Drama . ",
        tags : ["Action", "Drama"],
        ETNO : "ET00308208",
    theaters : [
        {
          name: 'Harihar Cinemas: Guntur',
          code : 'HHCG',
          showtimes: ['06:30 PM', '09:45 PM'],
          cancellationAvailable: true
        },
        {
          name: 'Siva Cinemas Dolby Atmos: Guntur',
          code : 'SCDG',
          showtimes: ['06:30 PM', '10:00 PM'],
          cancellationAvailable: false
        }
    ],
        Date : todayDate,
       dates : generateDates(5),
  aboutMovie : `Veera Mallu, a fearless warrior shaped by the hardships of his early life,emerges as the first Indian to rise against the 
oppressive Mughal empire. Driven by a burning desire for justice, he embarks on a daring mission to confront the 
ruthless actions of the army generals, igniting a revolutionary spark that could change the course of history.`
    },
    {
        key  : index++,
        src  : "movie3.avif",
        name : "Andala Rakshasi",
        time : "2h 43m . ",
 releaseDate : "24 Jul, 2025",
      censor : "UA 16+ . ",
        type : "Drama/Romantic . ",
        tags : ["Drama", "Romantic"],
        ETNO : "ET00308209",
    theaters : [
        {
          name: 'Harihar Cinemas: Guntur',
          code : 'HHCG',
          showtimes: ['06:30 PM', '09:45 PM'],
          cancellationAvailable: true
        },
        {
          name: 'Siva Cinemas Dolby Atmos: Guntur',
          code : 'SCDG',
          showtimes: ['06:30 PM', '10:00 PM'],
          cancellationAvailable: false
        }
    ],
        Date : todayDate,
       dates : generateDates(6),
  aboutMovie : `Veera Mallu, a fearless warrior shaped by the hardships of his early life,emerges as the first Indian to rise against the 
oppressive Mughal empire. Driven by a burning desire for justice, he embarks on a daring mission to confront the 
ruthless actions of the army generals, igniting a revolutionary spark that could change the course of history.`
    },
    {
        key  : index++,
        src  : "movie4.avif",
        name : "8 Vasantalu",
        time : "2h 43m . ",
 releaseDate : "24 Jul, 2025",
      censor : "UA 16+ . ",
        type : "Drama/Romantic . ",
        tags : ["Drama", "Romantic"],
        ETNO : "ET00308210",
    theaters : [
        {
          name: 'Harihar Cinemas: Guntur',
          code : 'HHCG',
          showtimes: ['06:30 PM', '09:45 PM'],
          cancellationAvailable: true
        },
        {
          name: 'Siva Cinemas Dolby Atmos: Guntur',
          code : 'SCDG',
          showtimes: ['06:30 PM', '10:00 PM'],
          cancellationAvailable: false
        }
      ],
        Date : todayDate,
       dates : generateDates(2),
  aboutMovie : `Veera Mallu, a fearless warrior shaped by the hardships of his early life,emerges as the first Indian to rise against the 
oppressive Mughal empire. Driven by a burning desire for justice, he embarks on a daring mission to confront the 
ruthless actions of the army generals, igniting a revolutionary spark that could change the course of history.`
    },
    {
        key  : index++,
        src  : "movie5.avif",
        name : "Hari Hara Veera Mallu-Part 1 Sword vs Spirit",
        time : "2h 43m . ",
 releaseDate : "24 Jul, 2025",
      censor : "UA 16+ . ",
        type : "Action/Adventure/Thriller . ",
        tags : ["Action", "Adventure", "Thriller"],
        ETNO : "ET00308211",
    theaters : [
        {
          name: 'Harihar Cinemas: Guntur',
          code : 'HHCG',
          showtimes: ['06:30 PM', '09:45 PM'],
          cancellationAvailable: true
        },
        {
          name: 'Siva Cinemas Dolby Atmos: Guntur',
          code : 'SCDG',
          showtimes: ['06:30 PM', '10:00 PM'],
          cancellationAvailable: false
        }
      ],
        Date : todayDate,
       dates : generateDates(3),
  aboutMovie : `Veera Mallu, a fearless warrior shaped by the hardships of his early life,emerges as the first Indian to rise against the 
oppressive Mughal empire. Driven by a burning desire for justice, he embarks on a daring mission to confront the 
ruthless actions of the army generals, igniting a revolutionary spark that could change the course of history.`
    }
]

export default movieDesc;