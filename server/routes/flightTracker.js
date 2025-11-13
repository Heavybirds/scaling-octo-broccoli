const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock flight data for demonstration
const mockFlights = [
  { id: 1, callsign: 'N123AB', altitude: 35000, speed: 450, lat: 40.7128, lon: -74.0060, heading: 270 },
  { id: 2, callsign: 'N456CD', altitude: 41000, speed: 480, lat: 34.0522, lon: -118.2437, heading: 90 }
];

// Get all tracked flights (ADS-B data)
router.get('/', async (req, res) => {
  try {
    // In production, fetch from ADS-B API like OpenSky Network (free, no API key required)
    // const response = await axios.get(`${process.env.ADSB_API_URL}/states/all`);
    
    // For now, return mock data
    res.json({
      flights: mockFlights,
      timestamp: new Date().toISOString(),
      source: 'ADS-B (OpenSky Network)',
      ads: false, // No ads policy
      free: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

// Get flight by callsign
router.get('/:callsign', async (req, res) => {
  try {
    const { callsign } = req.params;
    const flight = mockFlights.find(f => f.callsign === callsign);
    
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    
    res.json({ flight });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

// Track specific aircraft
router.post('/track', (req, res) => {
  try {
    const { callsign } = req.body;
    
    // Add tracking logic here
    res.json({ 
      message: 'Aircraft tracking started',
      callsign,
      realtime: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start tracking' });
  }
});

module.exports = router;
