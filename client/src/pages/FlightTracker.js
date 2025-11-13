import React, { useEffect, useState } from 'react';
import api from '../services/api';

function FlightTracker() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCallsign, setSearchCallsign] = useState('');

  useEffect(() => {
    fetchFlights();
    // Set up real-time updates
    const interval = setInterval(fetchFlights, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await api.get('/flights');
      setFlights(response.data.flights);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setLoading(false);
    }
  };

  const handleTrackAircraft = async () => {
    if (!searchCallsign) return;
    try {
      await api.post('/flights/track', { callsign: searchCallsign });
      alert(`Now tracking ${searchCallsign}`);
      setSearchCallsign('');
      fetchFlights();
    } catch (error) {
      console.error('Error tracking aircraft:', error);
    }
  };

  return (
    <div>
      <h2>🛩️ ADS-B Flight Tracker</h2>
      
      <div className="alert alert-info">
        <strong>✨ Free & Ad-Free:</strong> Real-time flight tracking powered by ADS-B data from OpenSky Network
      </div>

      <div className="card">
        <h3>Track Aircraft</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter callsign (e.g., N123AB)"
            value={searchCallsign}
            onChange={(e) => setSearchCallsign(e.target.value)}
            style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button onClick={handleTrackAircraft} className="btn btn-primary">
            Track
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Active Flights ({flights.length})</h3>
        {loading ? (
          <p>Loading flights...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Callsign</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Altitude (ft)</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Speed (kts)</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Heading</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Position</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{flight.callsign}</td>
                    <td style={{ padding: '12px' }}>{flight.altitude?.toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{flight.speed}</td>
                    <td style={{ padding: '12px' }}>{flight.heading}°</td>
                    <td style={{ padding: '12px' }}>
                      {flight.lat?.toFixed(4)}, {flight.lon?.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Features</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li>📡 Real-time ADS-B data integration</li>
          <li>🌍 Global coverage via OpenSky Network</li>
          <li>🚫 Completely ad-free experience</li>
          <li>💯 Free to use - no subscriptions</li>
          <li>🔄 Auto-refresh every 10 seconds</li>
          <li>🔒 Secure and private tracking</li>
        </ul>
      </div>
    </div>
  );
}

export default FlightTracker;
