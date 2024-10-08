import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST request to get weather data by city name
router.post('/', async (req, res) => {
    const { cityName } = req.body; // Extract city name from the request body

    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const weatherService = new WeatherService(); // Create an instance of WeatherService
        const weatherData = await weatherService.getWeather(cityName); // Fetch weather data

        // Optionally, you can save the city to history if needed
        const historyService = new HistoryService();
        await historyService.addCity(cityName);

        return res.status(200).json(weatherData); // Send the weather data as a response
    } catch (error) {
        console.error('Error retrieving weather data:', error);
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});

// GET request to retrieve search history
router.get('/history', async (req, res) => {
  try {
      const historyService = new HistoryService(); // Create an instance of HistoryService
      const cities = await historyService.getCities(); // Retrieve the search history

      return res.status(200).json(cities); // Send the search history as a response
  } catch (error) {
      console.error('Error retrieving search history:', error);
      return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE request to remove a city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params; // Extract the city ID from the route parameters

  try {
      const historyService = new HistoryService(); // Create an instance of HistoryService
      await historyService.removeCity(id); // Call the removeCity method to delete the city

      return res.status(204).send(); // Send a 204 No Content response
  } catch (error) {
      console.error('Error removing city from history:', error);
      return res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;