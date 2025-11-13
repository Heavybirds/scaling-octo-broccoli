const express = require('express');
const router = express.Router();

// Mock workflow database
const workflows = [];
const tasks = [];

// AI-driven workflow hub - Create workflow
router.post('/', (req, res) => {
  try {
    const { title, description, steps, assignees, priority } = req.body;
    
    if (!title || !steps) {
      return res.status(400).json({ error: 'Title and steps are required' });
    }
    
    const workflow = {
      id: workflows.length + 1,
      title,
      description,
      steps: steps.map((step, index) => ({
        id: index + 1,
        ...step,
        status: 'pending'
      })),
      assignees: assignees || [],
      priority: priority || 'medium',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    workflows.push(workflow);
    
    res.status(201).json({
      message: 'Workflow created successfully',
      workflow
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

// Get all workflows
router.get('/', (req, res) => {
  try {
    res.json({ workflows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Get workflow by ID
router.get('/:id', (req, res) => {
  try {
    const workflow = workflows.find(w => w.id === parseInt(req.params.id));
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json({ workflow });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
});

// Update workflow step status
router.patch('/:id/steps/:stepId', (req, res) => {
  try {
    const { id, stepId } = req.params;
    const { status } = req.body;
    
    const workflow = workflows.find(w => w.id === parseInt(id));
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    const step = workflow.steps.find(s => s.id === parseInt(stepId));
    
    if (!step) {
      return res.status(404).json({ error: 'Step not found' });
    }
    
    step.status = status;
    step.completedAt = status === 'completed' ? new Date().toISOString() : null;
    
    // Check if all steps are completed
    const allCompleted = workflow.steps.every(s => s.status === 'completed');
    if (allCompleted) {
      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();
    }
    
    res.json({
      message: 'Step updated successfully',
      workflow
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update step' });
  }
});

// AI workflow optimization suggestion
router.post('/:id/optimize', (req, res) => {
  try {
    const workflow = workflows.find(w => w.id === parseInt(req.params.id));
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    // Mock AI suggestions
    const suggestions = [
      'Parallel processing: Steps 2 and 3 can be executed simultaneously',
      'Automation: Step 4 can be automated using integration with FBO systems',
      'Resource optimization: Reassign tasks based on current workload'
    ];
    
    res.json({
      message: 'AI optimization suggestions generated',
      suggestions,
      estimatedTimeSavings: '30%'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate optimization suggestions' });
  }
});

// Create task
router.post('/tasks', (req, res) => {
  try {
    const { title, description, assignee, dueDate, workflowId } = req.body;
    
    const task = {
      id: tasks.length + 1,
      title,
      description,
      assignee,
      dueDate,
      workflowId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    
    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get all tasks
router.get('/tasks', (req, res) => {
  try {
    const { assignee, status } = req.query;
    
    let filteredTasks = tasks;
    
    if (assignee) {
      filteredTasks = filteredTasks.filter(t => t.assignee === assignee);
    }
    
    if (status) {
      filteredTasks = filteredTasks.filter(t => t.status === status);
    }
    
    res.json({ tasks: filteredTasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

module.exports = router;
