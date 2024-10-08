import * as fs from 'fs';
import * as path from 'path';
import { City } from './City'; // Make sure to import your City class

class City {
  id: number;      // Unique identifier for the city
  name: string;    // Name of the city
  lat?: number;    // Latitude of the city (optional)
  lon?: number;    // Longitude of the city (optional)

  constructor(id: number, name: string, lat?: number, lon?: number) {
      this.id = id;
      this.name = name;
      this.lat = lat; // Optional property
      this.lon = lon; // Optional property
  }
}

class HistoryService {
  private filePath: string;

  constructor() {
      // Define the path to the searchHistory.json file
      this.filePath = path.join(__dirname, 'searchHistory.json');
  }

   // Method to read from the searchHistory.json file
   private async read(): Promise<City[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(this.filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                // Parse the JSON data and resolve the promise
                resolve(JSON.parse(data));
            }
        });
    });
}
  // Method to write the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    return new Promise((resolve, reject) => {
        // Convert the cities array to a JSON string
        const jsonData = JSON.stringify(cities, null, 2); // Pretty print with 2 spaces

        fs.writeFile(this.filePath, jsonData, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
  }

// Method to get cities from the searchHistory.json file
async getCities(): Promise<City[]> {
  try {
      const cities = await this.read(); // Read the cities from the file
      return cities; // Return the cities as an array of City objects
  } catch (error) {
      console.error('Error getting cities:', error);
      return []; // Return an empty array in case of an error
    }
  }

// Method to add a new city to the searchHistory.json file
async addCity(cityName: string): Promise<void> {
  try {
      const cities = await this.getCities(); // Get the existing cities
      const newId = cities.length > 0 ? cities[cities.length - 1].id + 1 : 1; // Generate a new ID
      const newCity = new City(newId, cityName); // Create a new City object
      cities.push(newCity); // Add the new city to the array
      await this.write(cities); // Write the updated array back to the file
      console.log(`City "${cityName}" added successfully.`);
  } catch (error) {
      console.error('Error adding city:', error);
  }
}
// Method to remove a city from the searchHistory.json file
async removeCity(id: string): Promise<void> {
  try {
      const cities = await this.getCities(); // Get the existing cities
      const updatedCities = cities.filter(city => city.id !== parseInt(id)); // Filter out the city with the specified ID
      await this.write(updatedCities); // Write the updated array back to the file
      console.log(`City with ID "${id}" removed successfully.`);
  } catch (error) {
      console.error('Error removing city:', error);
    }
  }
}

// Example usage
const historyService = new HistoryService();

historyService.addCity('Chicago')
.then(() => {
  console.log('City added to search history.');
})
.catch(error => {
  console.error('Error:', error);
});

export default new HistoryService();
