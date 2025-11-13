import React, { useState, useEffect } from 'react';
import api from '../services/api';
import moment from 'moment-timezone';

function Scheduling() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [timezone, setTimezone] = useState(moment.tz.guess());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    timezone: moment.tz.guess(),
    participants: []
  });

  useEffect(() => {
    fetchAppointments();
  }, [timezone]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/scheduling?timezone=${timezone}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/scheduling', formData);
      alert('Appointment created successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        timezone: moment.tz.guess(),
        participants: []
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const timezones = moment.tz.names();

  return (
    <div>
      <h2>📅 Smart Scheduling</h2>
      
      <div className="alert alert-info">
        <strong>🌍 Timezone Sync:</strong> All appointments automatically adjust to your local timezone
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>Your Appointments</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Appointment'}
          </button>
        </div>

        <div className="form-group">
          <label>View in Timezone:</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {timezones.slice(0, 50).map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '4px' }}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Timezone *</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                required
              >
                {timezones.slice(0, 50).map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Create Appointment</button>
          </form>
        )}
      </div>

      <div className="grid">
        {appointments.length === 0 ? (
          <div className="card">
            <p>No appointments scheduled yet</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="card">
              <h4>{apt.title}</h4>
              <p>{apt.description}</p>
              <p><strong>Start:</strong> {apt.startTimeLocal || apt.startTime}</p>
              {apt.endTimeLocal && <p><strong>End:</strong> {apt.endTimeLocal}</p>}
              <p><strong>Timezone:</strong> {apt.timezone}</p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                Created: {moment(apt.createdAt).fromNow()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>Features</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li>🌍 Automatic timezone conversion</li>
          <li>🔄 Real-time synchronization</li>
          <li>👥 Multi-participant support</li>
          <li>📧 Email notifications (coming soon)</li>
          <li>🔗 Calendar integration (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}

export default Scheduling;
