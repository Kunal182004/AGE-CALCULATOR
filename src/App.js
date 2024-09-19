import React, { useState } from 'react';
import { useLocalStorage } from 'react-use';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import './App.css';

// Enable duration and relative time plugins in dayjs
dayjs.extend(duration);
dayjs.extend(relativeTime);

// Helper function to calculate Zodiac sign
const getZodiacSign = (month, day) => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
};

// Helper function to calculate Chinese Zodiac
const getChineseZodiac = (year) => {
  const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
  return animals[year % 12];
};

// Helper function to suggest names based on Zodiac sign or Chinese Zodiac
const getNameSuggestions = (zodiacSign, chineseZodiac) => {
  const nameSuggestions = {
    Aries: ['Aiden', 'Aria'],
    Taurus: ['Tara', 'Tobias'],
    Gemini: ['Gemma', 'Gavin'],
    Cancer: ['Cara', 'Caleb'],
    Leo: ['Liam', 'Leah'],
    Virgo: ['Vivian', 'Vincent'],
    Libra: ['Lila', 'Lukas'],
    Scorpio: ['Sophie', 'Samuel'],
    Sagittarius: ['Sage', 'Santiago'],
    Capricorn: ['Carter', 'Clara'],
    Aquarius: ['Aqua', 'August'],
    Pisces: ['Piper', 'Peter'],
    Monkey: ['Mona', 'Mark'],
    Rooster: ['Rosa', 'Ray'],
    Dog: ['Diana', 'Daniel'],
    Pig: ['Pia', 'Paul'],
    Rat: ['Rachel', 'Ryan'],
    Ox: ['Olivia', 'Oscar'],
    Tiger: ['Tina', 'Theo'],
    Rabbit: ['Ruby', 'Robert'],
    Dragon: ['Daisy', 'David'],
    Snake: ['Sara', 'Sam'],
    Horse: ['Holly', 'Harry'],
    Goat: ['Grace', 'George'],
  };

  // Combine both zodiac sign and Chinese zodiac suggestions
  return [...(nameSuggestions[zodiacSign] || []), ...(nameSuggestions[chineseZodiac] || [])];
};

function App() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [exactAge, setExactAge] = useState(null);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [loading, setLoading] = useState(false);
  const [zodiacSign, setZodiacSign] = useState('');
  const [chineseZodiac, setChineseZodiac] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState([]);

  const calculateExactAge = () => {
    if (dateOfBirth) {
      setLoading(true);
      setTimeout(() => {
        const birthDate = dayjs(dateOfBirth);
        const currentDate = dayjs();

        // Calculate exact age
        const years = currentDate.diff(birthDate, 'year');
        const months = currentDate.diff(birthDate.add(years, 'year'), 'month');
        const days = currentDate.diff(birthDate.add(years, 'year').add(months, 'month'), 'day');
        const hours = currentDate.diff(birthDate.add(years, 'year').add(months, 'month').add(days, 'day'), 'hour');
        const minutes = currentDate.diff(birthDate.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour'), 'minute');
        const seconds = currentDate.diff(birthDate.add(years, 'year').add(months, 'month').add(days, 'day').add(hours, 'hour').add(minutes, 'minute'), 'second');

        // Calculate Zodiac sign and other information
        const month = birthDate.month() + 1; // dayjs months are zero-indexed
        const day = birthDate.date();
        const year = birthDate.year();

        const zodiac = getZodiacSign(month, day);
        const chineseZodiacSign = getChineseZodiac(year);

        setZodiacSign(zodiac);
        setChineseZodiac(chineseZodiacSign);
        setDayOfWeek(birthDate.format('dddd')); // Get the day of the week

        // Set name suggestions based on Zodiac signs
        setNameSuggestions(getNameSuggestions(zodiac, chineseZodiacSign));

        setExactAge({ years, months, days, hours, minutes, seconds });
        setLoading(false);
      }, 1000);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Exact Age Calculator</h1>
        <button onClick={toggleTheme}>
          Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>
      <div className="container">
        <label htmlFor="dob">Enter your Date and Time of Birth:</label>
        <input
          type="datetime-local"
          id="dob"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <button onClick={calculateExactAge} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Exact Age'}
        </button>

        {loading && <div className="loader"></div>}

        {exactAge && !loading && (
          <>
            <p>
              You are {exactAge.years} years, {exactAge.months} months, {exactAge.days} days,{' '}
              {exactAge.hours} hours, {exactAge.minutes} minutes, and {exactAge.seconds} seconds old.
            </p>
            <p>Your Zodiac sign is <strong>{zodiacSign}</strong>.</p>
            <p>Your Chinese Zodiac sign is <strong>{chineseZodiac}</strong>.</p>
            <p>You were born on a <strong>{dayOfWeek}</strong>.</p>
            <p>Suggested names based on your Zodiac: {nameSuggestions.join(', ')}.</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
