const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');

// Mock appointments database
const appointments = [];

// Create appointment with timezone sync
router.post('/', (req, res) => {
  try {
    const { title, description, startTime, endTime, timezone, participants } = req.body;
    
    if (!title || !startTime || !timezone) {
      return res.status(400).json({ error: 'Title, start time, and timezone are required' });
    }
    
    // Convert to UTC for storage
    const startUTC = moment.tz(startTime, timezone).utc().toISOString();
    const endUTC = endTime ? moment.tz(endTime, timezone).utc().toISOString() : null;
    
    const appointment = {
      id: appointments.length + 1,
      title,
      description,
      startTime: startUTC,
      endTime: endUTC,
      timezone,
      participants: participants || [],
      createdAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
    
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get all appointments
router.get('/', (req, res) => {
  try {
    const { timezone } = req.query;
    
    // Convert times to requested timezone
    const appointmentsInTimezone = appointments.map(apt => ({
      ...apt,
      startTimeLocal: timezone ? moment(apt.startTime).tz(timezone).format() : apt.startTime,
      endTimeLocal: apt.endTime && timezone ? moment(apt.endTime).tz(timezone).format() : apt.endTime
    }));
    
    res.json({ appointments: appointmentsInTimezone });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
router.get('/:id', (req, res) => {
  try {
    const appointment = appointments.find(a => a.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Update appointment
router.put('/:id', (req, res) => {
  try {
    const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const { title, description, startTime, endTime, timezone } = req.body;
    
    if (startTime && timezone) {
      appointments[index].startTime = moment.tz(startTime, timezone).utc().toISOString();
    }
    if (endTime && timezone) {
      appointments[index].endTime = moment.tz(endTime, timezone).utc().toISOString();
    }
    
    appointments[index] = {
      ...appointments[index],
      ...(title && { title }),
      ...(description && { description }),
      ...(timezone && { timezone })
    };
    
    res.json({
      message: 'Appointment updated successfully',
      appointment: appointments[index]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
router.delete('/:id', (req, res) => {
  try {
    const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    appointments.splice(index, 1);
    
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

module.exports = router;
