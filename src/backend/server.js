
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'upwork_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT secret
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.accountType !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Client or Admin middleware
const isClientOrAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType === 'admin') {
      return next();
    }
    
    if (req.params.id) {
      const [jobs] = await pool.query('SELECT client_id FROM jobs WHERE id = ?', [req.params.id]);
      if (jobs.length > 0 && jobs[0].client_id === req.user.userId) {
        return next();
      }
    }
    
    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    console.error('Error in isClientOrAdmin middleware:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Routes
// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, account_type) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, accountType]
    );
    
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, accountType: user.account_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        email: user.email, 
        account_type: user.account_type,
        bio: user.bio,
        skills: user.skills,
        hourly_rate: user.hourly_rate
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(jobs[0]);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (protected)
app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, description, budget, skills, duration } = req.body;
    const clientId = req.user.userId;
    
    // Ensure user is a client or admin
    if (req.user.accountType !== 'client' && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Only clients can post jobs' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO jobs (title, description, budget, skills, duration, client_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, budget, skills, duration, clientId]
    );
    
    res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job by ID (protected)
app.put('/api/jobs/:id', authenticateToken, isClientOrAdmin, async (req, res) => {
  try {
    const { title, description, budget, skills, duration, status } = req.body;
    const jobId = req.params.id;
    
    await pool.query(
      'UPDATE jobs SET title = ?, description = ?, budget = ?, skills = ?, duration = ?, status = ? WHERE id = ?',
      [title, description, budget, skills, duration, status, jobId]
    );
    
    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job status (protected)
app.patch('/api/jobs/:id/status', authenticateToken, isClientOrAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const jobId = req.params.id;
    
    // Validate status
    const validStatuses = ['open', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    await pool.query(
      'UPDATE jobs SET status = ? WHERE id = ?',
      [status, jobId]
    );
    
    res.json({ message: 'Job status updated successfully' });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (protected)
app.delete('/api/jobs/:id', authenticateToken, isClientOrAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Delete proposals for this job first (foreign key constraint)
    await pool.query('DELETE FROM proposals WHERE job_id = ?', [jobId]);
    
    // Then delete the job
    await pool.query('DELETE FROM jobs WHERE id = ?', [jobId]);
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit proposal for a job (protected)
app.post('/api/jobs/:id/proposals', authenticateToken, async (req, res) => {
  try {
    const { cover_letter, bid_amount } = req.body;
    const jobId = req.params.id;
    const freelancerId = req.user.userId;
    
    // Ensure user is a freelancer
    if (req.user.accountType !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can submit proposals' });
    }
    
    // Check if job exists
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already submitted a proposal
    const [existingProposals] = await pool.query(
      'SELECT * FROM proposals WHERE job_id = ? AND freelancer_id = ?',
      [jobId, freelancerId]
    );
    
    if (existingProposals.length > 0) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this job' });
    }
    
    // Insert proposal
    const [result] = await pool.query(
      'INSERT INTO proposals (job_id, freelancer_id, cover_letter, bid_amount) VALUES (?, ?, ?, ?)',
      [jobId, freelancerId, cover_letter, bid_amount]
    );
    
    res.status(201).json({ message: 'Proposal submitted successfully', proposalId: result.insertId });
  } catch (error) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get proposals for a job (protected)
app.get('/api/jobs/:id/proposals', authenticateToken, isClientOrAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const [proposals] = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, u.email, u.bio, u.skills, u.hourly_rate
       FROM proposals p
       JOIN users u ON p.freelancer_id = u.id
       WHERE p.job_id = ?`,
      [jobId]
    );
    
    res.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update proposal status (accept/reject)
app.patch('/api/proposals/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const proposalId = req.params.id;
    
    // Validate status
    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Get the job id for this proposal to verify ownership
    const [proposals] = await pool.query(
      'SELECT job_id FROM proposals WHERE id = ?',
      [proposalId]
    );
    
    if (proposals.length === 0) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    const jobId = proposals[0].job_id;
    
    // Verify the user is the job owner or admin
    const [jobs] = await pool.query(
      'SELECT client_id FROM jobs WHERE id = ?',
      [jobId]
    );
    
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (jobs[0].client_id !== req.user.userId && req.user.accountType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update proposal status
    await pool.query(
      'UPDATE proposals SET status = ? WHERE id = ?',
      [status, proposalId]
    );
    
    // If accepting, update job status to in_progress
    if (status === 'accepted') {
      await pool.query(
        'UPDATE jobs SET status = ? WHERE id = ?',
        ['in_progress', jobId]
      );
    }
    
    res.json({ message: 'Proposal status updated successfully' });
  } catch (error) {
    console.error('Error updating proposal status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile/:id', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, account_type, bio, skills, hourly_rate FROM users WHERE id = ?',
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (protected)
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, bio, skills, hourly_rate } = req.body;
    const userId = req.user.userId;
    
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, bio = ?, skills = ?, hourly_rate = ? WHERE id = ?',
      [first_name, last_name, bio, skills, hourly_rate, userId]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
