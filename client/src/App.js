import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import FlightTracker from './pages/FlightTracker';
import Scheduling from './pages/Scheduling';
import MeetingNotes from './pages/MeetingNotes';
import Financing from './pages/Financing';
import Workflow from './pages/Workflow';

function App() {

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>✈️ Private Jet Ecosystem Platform</h1>
            <p>Connecting Brokers, FBOs, MROs, Operators, and Advisors</p>
            <nav className="nav">
              <NavLink to="/" className="nav-link">Dashboard</NavLink>
              <NavLink to="/flights" className="nav-link">Flight Tracker</NavLink>
              <NavLink to="/scheduling" className="nav-link">Scheduling</NavLink>
              <NavLink to="/meeting-notes" className="nav-link">Meeting Notes</NavLink>
              <NavLink to="/financing" className="nav-link">Financing</NavLink>
              <NavLink to="/workflow" className="nav-link">Workflow Hub</NavLink>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/flights" element={<FlightTracker />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/meeting-notes" element={<MeetingNotes />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/workflow" element={<Workflow />} />
          </Routes>
        </main>

        <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', color: '#666' }}>
          <p>🔒 Secure Data Hosting | 🚫 Zero Data Leakage | 📊 Full Transparency</p>
          <p>Private Jet Ecosystem Platform © 2025</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
