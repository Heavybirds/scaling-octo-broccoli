import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Workflow() {
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showWorkflowForm, setShowWorkflowForm] = useState(false);
  const [workflowFormData, setWorkflowFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchWorkflows();
    fetchTasks();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await api.get('/workflow');
      setWorkflows(response.data.workflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/workflow/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workflow', {
        ...workflowFormData,
        steps: [
          { title: 'Initial Review', description: 'Review requirements' },
          { title: 'Implementation', description: 'Execute the workflow' },
          { title: 'Final Check', description: 'Quality assurance' }
        ]
      });
      alert('Workflow created successfully!');
      setShowWorkflowForm(false);
      setWorkflowFormData({ title: '', description: '', priority: 'medium' });
      fetchWorkflows();
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Failed to create workflow');
    }
  };

  const handleOptimize = async (workflowId) => {
    try {
      const response = await api.post(`/workflow/${workflowId}/optimize`);
      alert(`AI Suggestions:\n${response.data.suggestions.join('\n')}\n\nEstimated time savings: ${response.data.estimatedTimeSavings}`);
    } catch (error) {
      console.error('Error optimizing workflow:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-badge status-completed';
      case 'active':
        return 'status-badge status-active';
      default:
        return 'status-badge status-pending';
    }
  };

  return (
    <div>
      <h2>🔄 AI-Driven Workflow Hub</h2>
      
      <div className="alert alert-info">
        <strong>🤖 AI Optimization:</strong> Intelligent workflow management with automated suggestions
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Active Workflows</h3>
          <button onClick={() => setShowWorkflowForm(!showWorkflowForm)} className="btn btn-primary">
            {showWorkflowForm ? 'Cancel' : '+ New Workflow'}
          </button>
        </div>

        {showWorkflowForm && (
          <form onSubmit={handleCreateWorkflow} style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '4px' }}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={workflowFormData.title}
                onChange={(e) => setWorkflowFormData({ ...workflowFormData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={workflowFormData.description}
                onChange={(e) => setWorkflowFormData({ ...workflowFormData, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={workflowFormData.priority}
                onChange={(e) => setWorkflowFormData({ ...workflowFormData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Create Workflow</button>
          </form>
        )}
      </div>

      <div className="grid">
        {workflows.length === 0 ? (
          <div className="card">
            <p>No workflows yet. Create your first AI-driven workflow!</p>
          </div>
        ) : (
          workflows.map((workflow) => (
            <div key={workflow.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <h4>{workflow.title}</h4>
                <span className={getStatusBadgeClass(workflow.status)}>
                  {workflow.status}
                </span>
              </div>
              
              <p style={{ color: '#666', marginBottom: '15px' }}>{workflow.description}</p>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Priority:</strong> <span style={{ textTransform: 'capitalize' }}>{workflow.priority}</span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Steps:</strong>
                {workflow.steps?.map((step) => (
                  <div key={step.id} style={{ marginTop: '8px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{step.title}</span>
                      <span className={getStatusBadgeClass(step.status)}>{step.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleOptimize(workflow.id)} 
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                🤖 Get AI Optimization Suggestions
              </button>

              <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                Created: {new Date(workflow.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h3>Quick Tasks</h3>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          {tasks.length} tasks tracked across all workflows
        </p>
        
        {tasks.slice(0, 5).map((task) => (
          <div key={task.id} style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{task.title}</strong>
              <span className={getStatusBadgeClass(task.status)}>{task.status}</span>
            </div>
            {task.assignee && <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Assignee: {task.assignee}</p>}
            {task.dueDate && <p style={{ fontSize: '12px', color: '#666' }}>Due: {task.dueDate}</p>}
          </div>
        ))}
      </div>

      <div className="card">
        <h3>AI Features</h3>
        <ul style={{ lineHeight: '2', marginLeft: '20px' }}>
          <li>🤖 Automated workflow optimization</li>
          <li>📊 Performance analytics</li>
          <li>⚡ Process automation suggestions</li>
          <li>👥 Smart task assignment</li>
          <li>🔄 Real-time progress tracking</li>
          <li>📈 Efficiency metrics and reporting</li>
        </ul>
      </div>
    </div>
  );
}

export default Workflow;
