import React, { useState, useEffect } from 'react';
import api from '../services/api';

function MeetingNotes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [participants, setParticipants] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/meeting-notes');
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/meeting-notes/generate', {
        transcript,
        participants: participants.split(',').map(p => p.trim())
      });
      alert('Meeting notes generated successfully!');
      setShowForm(false);
      setTranscript('');
      setParticipants('');
      fetchNotes();
    } catch (error) {
      console.error('Error generating notes:', error);
      alert('Failed to generate meeting notes');
    }
  };

  return (
    <div>
      <h2>📝 AI Meeting Notes</h2>
      
      <div className="alert alert-info">
        <strong>🤖 AI-Powered:</strong> Automatically generate summaries, key points, and action items from meeting transcripts
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Meeting Notes</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Generate Notes'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleGenerateNotes} style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '4px' }}>
            <div className="form-group">
              <label>Meeting Transcript *</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here..."
                rows="8"
                required
              />
            </div>

            <div className="form-group">
              <label>Participants (comma-separated)</label>
              <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="John Doe, Jane Smith, Bob Johnson"
              />
            </div>

            <button type="submit" className="btn btn-primary">Generate AI Notes</button>
          </form>
        )}
      </div>

      <div className="grid">
        {notes.length === 0 ? (
          <div className="card">
            <p>No meeting notes yet. Generate your first AI-powered notes!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="card">
              <h4>Meeting #{note.id}</h4>
              
              <div style={{ marginTop: '15px' }}>
                <strong>Summary:</strong>
                <p style={{ marginTop: '5px', color: '#555' }}>{note.summary}</p>
              </div>

              <div style={{ marginTop: '15px' }}>
                <strong>Key Points:</strong>
                <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                  {note.keyPoints?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '15px' }}>
                <strong>Action Items:</strong>
                {note.actionItems?.map((item, idx) => (
                  <div key={idx} style={{ marginTop: '8px', padding: '8px', background: '#fff3cd', borderRadius: '4px' }}>
                    <p><strong>Task:</strong> {item.task}</p>
                    <p><strong>Assignee:</strong> {item.assignee}</p>
                    <p><strong>Due:</strong> {item.dueDate}</p>
                  </div>
                ))}
              </div>

              {note.participants && (
                <div style={{ marginTop: '15px' }}>
                  <strong>Participants:</strong>
                  <p style={{ color: '#666' }}>{note.participants.join(', ')}</p>
                </div>
              )}

              <p style={{ fontSize: '12px', color: '#666', marginTop: '15px' }}>
                Created: {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>AI Features</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li>🤖 Automatic summary generation</li>
          <li>📋 Key points extraction</li>
          <li>✅ Action items identification</li>
          <li>👥 Participant tracking</li>
          <li>🔍 Searchable transcripts</li>
          <li>📊 Analytics and insights (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}

export default MeetingNotes;
