import dotenv from 'dotenv';
// import fetch from 'node-fetch'; // Make sure to import fetch if you're using it

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

// function getWeatherByCoordinates(coords: Coordinates) {
//   const { lat, lon } = coords;
//   const apiKey = process.env.API_KEY; // Accessing the API key from the environment variables
//   const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
//   // Fetch weather data using the constructed URL...
// }

// class Weather {
//   temperature: number;
//   humidity: number;
//   description: string;
//   coordinates: Coordinates; // Assuming you already defined the Coordinates interface

//   constructor(temperature: number, humidity: number, description: string, coordinates: Coordinates) {
//       this.temperature = temperature;
//       this.humidity = humidity;
//       this.description = description;
//       this.coordinates = coordinates;
//   }

//   // You can add methods to this class as needed
//   getWeatherSummary(): string {
//       return `The weather at (${this.coordinates.lat}, ${this.coordinates.lon}) is ${this.description} with a temperature of ${this.temperature}°C and humidity of ${this.humidity}%.`;
//   }
// }

class WeatherService {
  private baseURL?:string;
  private apiKey?:string;
  private city = '';

  constructor(){
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // async getWeatherByCoordinates(coords: Coordinates): Promise<Weather> {
    
  //     const { lat, lon } = coords;
  //     const apiKey = process.env.API_KEY; // Accessing the API key from the environment variables
  //     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  //     try {
  //         const response = await fetch(url);
  //         if (!response.ok) {
  //             throw new Error('Failed to fetch weather data');
  //         }
  //         const data = await response.json();
  //         // Extract the necessary data from the response
  //         const temperature = data.list[0].main.temp; // Example extraction
  //         const humidity = data.list[0].main.humidity;
  //         const description = data.list[0].weather[0].description;

  //         return new Weather(temperature, humidity, description, coords);
  //     } catch (error) {
  //         console.error('Error fetching weather by coordinates:', error);
  //         throw error; // Re-throw the error for handling in the calling code
  //     }
  // }
// Private method to fetch and destructure location data
private async fetchAndDestructureLocationData(): Promise<Coordinates | null> {
  const url = this.buildGeocodeQuery(); // Call the private method to build the URL

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const data = await response.json();
      // Call the private method to destructure the location data
      return this.createDestructureLocationData(data);
  } catch (error) {
      console.error(error);
      return null; // Return null in case of an error
  }
}

// Private method to build the geocode query URL
private buildGeocodeQuery(): string {
  return `${this.baseURL}?q=${this.city}&appid=${this.apiKey}`;
}

// Private method to build the weather query URL
private buildWeatherQuery(lat: number, lon: number): string {
  return `${this.baseURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
}

// Private method to destructure location data
private createDestructureLocationData(data: any): Coordinates {
  const { coord: { lat, lon } } = data; // Destructuring latitude and longitude
  return { lat, lon }; // Returning the Coordinates object
}

// Private method to fetch weather data based on coordinates
private async fetchWeatherData(lat: number, lon: number): Promise<any> {
  const url = this.buildWeatherQuery(lat, lon); // Call the private method to build the weather query URL

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      const data = await response.json();
      return data; // Return the weather data
  } catch (error) {
      console.error(error);
      return null; // Return null in case of an error
  }
}

// TO DO: parseCurrentWeather (will also use in fetchWeatherMethod
//   fetch weather method data will make array that will be used in the function that renders it on the page)

// Private method to parse current weather data
// private parseCurrentWeather(data: any): { temperature: number; humidity: number; description: string } {
//   const temperature = data.main.temp; // Extract temperature
//   const humidity = data.main.humidity; // Extract humidity
//   const description = data.weather[0].description; // Extract weather description

//   return { temperature, humidity, description }; // Return parsed weather data
// }

// TO DO: use this function in fetchWeatherData method

// Private method to build forecast array
// private buildForecastArray(data: any): Array<{ date: string; temperature: number; description: string }> {
//   const forecastArray: Array<{ date: string; temperature: number; description: string }> = [];

//   // Assuming the API returns a list of forecasts in data.list
//   data.list.forEach((forecast: any) => {
//       const date = forecast.dt_txt; // Extract the date and time
//       const temperature = forecast.main.temp; // Extract temperature
//       const description = forecast.weather[0].description; // Extract weather description

//       // Push the structured forecast into the array
//       forecastArray.push({ date, temperature, description });
//   });

//   return forecastArray; // Return the array of forecasts
// }

// Method to fetch weather data for a city
async getWeatherForCity(cityParam:string): Promise<any> {
  this.city=cityParam;
  const coordinates = await this.fetchAndDestructureLocationData(); // Fetch coordinates for the city
  if (coordinates) {
      const weatherData = await this.fetchWeatherData(coordinates.lat, coordinates.lon); // Fetch current weather data
      if (weatherData) {
          // const currentWeather = this.parseCurrentWeather(weatherData); // Parse current weather data
          // const forecastData = await this.fetchWeatherData(coordinates.lat, coordinates.lon); // Fetch forecast data
          // const forecast
          console.log(weatherData);
        }
      }
    }
  }
 export default new WeatherService();