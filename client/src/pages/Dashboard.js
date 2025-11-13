import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    activeFlights: 0,
    upcomingAppointments: 0,
    pendingTasks: 0,
    activeWorkflows: 0
  });

  useEffect(() => {
    // Mock stats - in production, fetch from API
    setStats({
      activeFlights: 24,
      upcomingAppointments: 7,
      pendingTasks: 15,
      activeWorkflows: 5
    });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="alert alert-info">
        <strong>🔒 Security Notice:</strong> All data is encrypted and hosted on private servers. Zero data leakage guarantee.
      </div>

      <div className="grid">
        <div className="card">
          <h3>✈️ Active Flights</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.activeFlights}</p>
          <p>Real-time ADS-B tracking (Free, No Ads)</p>
        </div>

        <div className="card">
          <h3>📅 Upcoming Appointments</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.upcomingAppointments}</p>
          <p>Smart scheduling with timezone sync</p>
        </div>

        <div className="card">
          <h3>✓ Pending Tasks</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.pendingTasks}</p>
          <p>AI-driven workflow management</p>
        </div>

        <div className="card">
          <h3>🔄 Active Workflows</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.activeWorkflows}</p>
          <p>Automated process optimization</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3>Platform Features</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li>🤖 <strong>AI-Driven Workflow Hub</strong> - Automate and optimize business processes</li>
          <li>📡 <strong>ADS-B Flight Tracker</strong> - Free real-time tracking, no ads</li>
          <li>🌍 <strong>Smart Scheduling</strong> - Automatic timezone synchronization</li>
          <li>📝 <strong>AI Meeting Notes</strong> - Automated transcription and action items</li>
          <li>💰 <strong>Financing Estimator</strong> - Calculate aircraft financing options</li>
          <li>🔒 <strong>Secure Hosting</strong> - Private servers with end-to-end encryption</li>
        </ul>
      </div>

      <div className="card">
        <h3>Stakeholder Network</h3>
        <div className="grid">
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Brokers</strong>
            <p>Aircraft sales and acquisition services</p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <strong>FBOs</strong>
            <p>Fixed-base operations and ground services</p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <strong>MROs</strong>
            <p>Maintenance, repair, and overhaul</p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Operators</strong>
            <p>Aircraft management and operations</p>
          </div>
          <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Advisors</strong>
            <p>Consulting and strategic guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
