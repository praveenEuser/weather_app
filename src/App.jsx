import { Card, Metric, Title } from "@tremor/react";
import { City, Country } from "country-state-city";
import { useEffect, useState } from "react";
import  Select  from "react-select"
import AreaChartCard from "./components/AreaChartCard";
import LineChartCard from "./components/LineChartCard";

function App() {
  const [allcountry, setAllcountry] = useState([]);
  const [selectedCountry,setselectcountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState([]);
  const [weatherDetails, setWeatherDetails] = useState([]);
    
    useEffect(()=>{
      setAllcountry(Country.getAllCountries().map((country)=>({
        value:{
          latitude:country.latitude,
          longitude:country.longitude,
          isoCode:country.isoCode,
        },
        label:country.name
      })));
    },[])

  const getWeatherDetails = async (e) =>{
    e.preventDefault();

    const fetchWeather  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,wind_speed_180m,temperature_180m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,wind_speed_10m_max&timezone=GMT`);

    const data = await fetchWeather.json(); 

    setWeatherDetails(data);
  }
  console.log(weatherDetails);
  
  
  const handleSeletedCountry = (option) =>{
    setselectcountry(option);
    setSelectedCity(null)
  }
  const handleSelectedCity = (option) =>{
    setSelectedCity(option)
  }
  
  return (
    <div className="flex max-w-6xl mx-auto space-x-1 h-fit">
      {/*sidebar*/}
      <div className="flex flex-col space-y-3 h-fit bg-blue-900 p-9">
        <Select options={allcountry} value={selectedCountry} onChange={handleSeletedCountry} styles={{ container: (provided) => ({ ...provided, width: '250px' }) }}/>

        <Select options={City.getCitiesOfCountry(selectedCountry?.value?.isoCode).map((cit)=>({
          value:{
            latitude: cit.latitude,
            longitude: cit.longitude,
          },
          label: cit.name,
        }))} value={selectedCity} onChange={handleSelectedCity} styles={{ container: (provided) => ({ ...provided, width: '250px' }) }}/>
        <button onClick={getWeatherDetails} className="bg-green-400  py-3 text-white text-sm font-bold hover:scale-105 transition-all duration-200 ease-in-out w-64">Get Weather</button>
        
        <div className="flex flex-col space-y-2 text-white font-semibold">
        <p>{selectedCountry?.label} | {selectedCity?.label}</p>
        <p>Latitude: {selectedCity?.value?.latitude} | Longitude: {selectedCity?.value?.longitude} </p>
        
        <div>{/*sunset*/}</div>
        </div>
      </div>
      {/*body*/}
      <div className="w-[75%] h-screen space-y-2">
        <div className="flex max-w-7xl space-x-1">
          <Card decoration="top" decorationColor="red" className="bg-gray-300 w-full md:w-1/3">
            <Title>Temperature</Title>
            <Metric>{weatherDetails?.daily?.apparent_temperature_max[0]}&#x2103;</Metric>
          </Card>
          <Card decoration="top" decorationColor="blue" className="bg-gray-300 w-full md:w-1/3">
            <Title>Wind Speed</Title>
            <Metric>{weatherDetails?.daily?.wind_speed_10m_max[0]} {weatherDetails?.daily_units?.wind_speed_10m_max}</Metric>
          </Card>
          <Card decoration="top" decorationColor="green" className="bg-gray-300 w-full md:w-1/3">
            <Title>UV Index</Title>
            <Metric>{weatherDetails?.daily?.uv_index_max[0]}</Metric>
          </Card>
        </div>

        <div className="space-y-1">
          <AreaChartCard weatherDetails={weatherDetails}/>
          <LineChartCard weatherDetails={weatherDetails}/>
        </div>
      </div>
      
    </div>
  )
}

export default App
