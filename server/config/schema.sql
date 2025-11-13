-- Private Jet Ecosystem Platform Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- broker, fbo, mro, operator, advisor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights table (ADS-B tracking history)
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    callsign VARCHAR(20) NOT NULL,
    altitude INTEGER,
    speed INTEGER,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    heading INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_callsign (callsign),
    INDEX idx_timestamp (timestamp)
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    timezone VARCHAR(50) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment participants
CREATE TABLE appointment_participants (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending' -- pending, accepted, declined
);

-- Meeting notes table
CREATE TABLE meeting_notes (
    id SERIAL PRIMARY KEY,
    meeting_id INTEGER REFERENCES appointments(id),
    summary TEXT,
    transcript TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meeting key points
CREATE TABLE meeting_key_points (
    id SERIAL PRIMARY KEY,
    meeting_note_id INTEGER REFERENCES meeting_notes(id) ON DELETE CASCADE,
    point TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Action items
CREATE TABLE action_items (
    id SERIAL PRIMARY KEY,
    meeting_note_id INTEGER REFERENCES meeting_notes(id) ON DELETE CASCADE,
    task TEXT NOT NULL,
    assignee_id INTEGER REFERENCES users(id),
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflows table
CREATE TABLE workflows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'active',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Workflow steps
CREATE TABLE workflow_steps (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES workflows(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    order_index INTEGER NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee_id INTEGER REFERENCES users(id),
    workflow_id INTEGER REFERENCES workflows(id),
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financing estimates table
CREATE TABLE financing_estimates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    aircraft_price DECIMAL(15, 2) NOT NULL,
    down_payment DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    loan_term INTEGER NOT NULL,
    monthly_payment DECIMAL(15, 2),
    total_payment DECIMAL(15, 2),
    total_interest DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for security and transparency
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id INTEGER,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_flights_callsign_timestamp ON flights(callsign, timestamp);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_tasks_assignee_status ON tasks(assignee_id, status);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_audit_log_user_timestamp ON audit_log(user_id, timestamp);
