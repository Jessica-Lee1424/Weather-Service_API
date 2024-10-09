import dotenv from 'dotenv';
// import fetch from 'node-fetch'; // Make sure to import fetch if you're using it

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
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
//fetch weather method data will make array that will be used in the function that renders it on)

// Private method to parse current weather data
private parseCurrentWeather(rawData: any): WeatherData {
  return {
      temperature: rawData.main.temp,
      description: rawData.weather[0].description,
      humidity: rawData.main.humidity,
      windSpeed: rawData.wind.speed,
  };
}

// TO DO: use this function in fetchWeatherData method

// Private method to build forecast array
private async buildForecastArray(lat: number, lon: number): Promise<WeatherData[]> {
  const forecastArray: WeatherData[] = [];
  const apiKey = 'this.apiKey'; // Replace with your actual API key
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // Use the forecast API

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData = await response.json();

      // Assuming the forecast data is in rawData.list and contains daily forecasts
      for (const entry of rawData.list) {
          const weatherData = this.parseCurrentWeather(entry); // Parse each entry
          if (weatherData) {
              forecastArray.push(weatherData); // Add to the forecast array
          }
      }
  } catch (error) {
      console.error('Error fetching forecast data:', error);
  }

  return forecastArray; // Return the built forecast array
}
// Method to fetch weather data for a city
async getWeatherForCity(cityParam: string): Promise<any> {
  this.city = cityParam;
  const coordinates = await this.fetchAndDestructureLocationData(); // Fetch coordinates for the city
  if (coordinates) {
      const currentWeather = await this.fetchWeatherData(coordinates.lat, coordinates.lon); // Fetch and parse current weather data
      if (currentWeather) {
          console.log(currentWeather); // Log the parsed current weather

          // Step 3: Call buildForecastArray here
          const forecastArray = await this.buildForecastArray(coordinates.lat, coordinates.lon);
          console.log(forecastArray); // Log the forecast array
      }
    }
  }
  
}

 export default new WeatherService();
