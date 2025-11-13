const express = require('express');
const router = express.Router();

// Mock meeting notes database
const meetingNotes = [];

// AI-powered meeting notes generation
router.post('/generate', async (req, res) => {
  try {
    const { transcript, meetingId, participants } = req.body;
    
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }
    
    // In production, use OpenAI API for actual AI processing
    // const completion = await openai.chat.completions.create({...});
    
    // Mock AI-generated notes
    const notes = {
      id: meetingNotes.length + 1,
      meetingId,
      summary: 'AI-generated summary of key discussion points',
      keyPoints: [
        'Discussion about aircraft acquisition',
        'Review of maintenance schedules',
        'Budget planning for Q4'
      ],
      actionItems: [
        { task: 'Follow up with vendor', assignee: 'John Doe', dueDate: '2025-11-20' },
        { task: 'Review contract terms', assignee: 'Jane Smith', dueDate: '2025-11-22' }
      ],
      participants,
      transcript,
      createdAt: new Date().toISOString()
    };
    
    meetingNotes.push(notes);
    
    res.status(201).json({
      message: 'Meeting notes generated successfully',
      notes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate meeting notes' });
  }
});

// Get all meeting notes
router.get('/', (req, res) => {
  try {
    res.json({ notes: meetingNotes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting notes' });
  }
});

// Get meeting notes by ID
router.get('/:id', (req, res) => {
  try {
    const notes = meetingNotes.find(n => n.id === parseInt(req.params.id));
    
    if (!notes) {
      return res.status(404).json({ error: 'Meeting notes not found' });
    }
    
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting notes' });
  }
});

// Update meeting notes
router.put('/:id', (req, res) => {
  try {
    const index = meetingNotes.findIndex(n => n.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Meeting notes not found' });
    }
    
    const { summary, keyPoints, actionItems } = req.body;
    
    meetingNotes[index] = {
      ...meetingNotes[index],
      ...(summary && { summary }),
      ...(keyPoints && { keyPoints }),
      ...(actionItems && { actionItems }),
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Meeting notes updated successfully',
      notes: meetingNotes[index]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting notes' });
  }
});

module.exports = router;
