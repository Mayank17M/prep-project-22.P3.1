import { useEffect, useState } from 'react';
import { BiError } from 'react-icons/bi';
import backgrounds from './components/weatherCard/backgroundArray';
import './App.css';
import Navbar from './components/Navbar/navbar';
import Footer from './components/Footer/footer';
import WeatherCard from './components/weatherCard/weatherCard';
import logo from './mlh-prep.png';
import softwaresimbas from './softwaresimbas.gif';
import Search from './components/Navbar/Search';
import useLocation from './hooks/useLocation';
import WeatherMap from './components/weatherMap/weatherMap';
import ForecastCarousel from './components/forecast/forecast';
import Alert from './components/Alerts/Alert';
import MusicRecommender from './components/MusicRecommender/MusicRecommender';
import WeatherNews from './components/News/WeatherNews';
import LocationImage from './assets/images/my_location.png';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState(null);
  const [results, setResults] = useState(null);
  const [cardBackground, setcardBackground] = useState('Clear');
  const [tempUnits, setTempUnits] = useState('metric');
  const geoLocation = useLocation();
  const [backToHome, setBackToHome] = useState(false);
  const [cityCoordinates, setCityCoordinates] = useState({
    lat: geoLocation.coordinates.lat,
    lon: geoLocation.coordinates.lng,
  });

  console.log(geoLocation.coordinates.lat, 'Lat');
  console.log(geoLocation.coordinates.lng, 'Lat');

  const handleGoBackButtonOnClick = () => {
    setBackToHome(!backToHome);
    // call the function to get lat and long
    // call api with the coordinates received above
  };

  /**
   * Below is the method for location based weather results
   */

  useEffect(() => {
    const urlGeo = `https://api.openweathermap.org/data/2.5/weather?lat=${geoLocation.coordinates.lat}&lon=${geoLocation.coordinates.lng}&appid=${process.env.REACT_APP_APIKEY}`;
    fetch(urlGeo)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.cod !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
            setcardBackground(result.weather[0].main);
            setCityCoordinates({
              lat: result.coord.lat,
              lon: result.coord.lon,
            });
            setCity(`${result.name}, ${result.sys.country}`);
          }
        },
        (err) => {
          setIsLoaded(true);
          setError(err);
        }
      );
  }, [geoLocation.coordinates.lat, geoLocation.coordinates.lng, backToHome]);
  /**
   * Below is the method to city based search
   */

  const handleKeyDown = () => {};

  useEffect(() => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempUnits}&appid=${process.env.REACT_APP_APIKEY}`;
    fetch(url)
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.cod !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
            setcardBackground(result.weather[0].main);
            setCityCoordinates({
              lat: result.coord.lat,
              lon: result.coord.lon,
            });
          }
        },
        (err) => {
          setIsLoaded(true);
          setError(err);
        }
      );
  }, [city, tempUnits]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const getTempUnit = (tempUnit) => {
    setTempUnits(tempUnit);
  };

  return (
    <div
      className="entirePage"
      style={{
        backgroundImage: `url(${backgrounds[cardBackground][0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar src={logo} />
      <Alert city={city} isLoaded={isLoaded} cityCoordinates={results?.coord} />
      <div>
        <h2 className="search-prompt">Enter a city below 👇</h2>
        <div className="search-interface">
          <Search className="s-i-o" setCity={setCity} />
          <div
            className="s-i-t"
            onClick={handleGoBackButtonOnClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex="0"
            style={{ cursor: 'pointer' }}
          >
            <img alt="my-location" src={LocationImage} />
          </div>
        </div>
        {/* <News/> */}
      </div>
      <div className="Results">
        {!isLoaded && (
          <>
            <div className="error-prompt">
              <BiError className="error-icon" /> <br />
              Location not found <br />
              Please enter a valid location.
            </div>
            <div className="weather-map">
              <WeatherMap
                city={city}
                setCity={setCity}
                cityCoordinates={cityCoordinates}
                setCityCoordinates={setCityCoordinates}
              />
            </div>
          </>
        )}
        {isLoaded && results && (
          <>
            <WeatherCard
              results={results}
              cardBackground={cardBackground}
              onUnitsChanged={getTempUnit}
            />
            <div className="weather-map">
              <WeatherMap
                city={city}
                setCity={setCity}
                cityCoordinates={cityCoordinates}
                setCityCoordinates={setCityCoordinates}
              />
            </div>
          </>
        )}
      </div>
      {isLoaded && results && (
        <div className="forecast-carousel">
          <ForecastCarousel lat={results.coord.lat} lng={results.coord.lon} />
        </div>
      )}

      <WeatherNews />
      <MusicRecommender results={results} isloaded={isLoaded} />
      <Footer src={softwaresimbas} />
    </div>
  );
}

export default App;
