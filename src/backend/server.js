const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
const EMAIL_SECRET = 'email-verification-secret'; // For email verification tokens

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // For testing purposes
  port: 587,
  secure: false,
  auth: {
    user: 'dewitt.reilly@ethereal.email', // Testing email account - replace with your actual email in production
    pass: 'tXh2BKzcJKc7dNaeaV'            // Testing password - replace with your actual password in production
  }
});

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Helper function to send verification emails
const sendVerificationEmail = async (email, verificationToken) => {
  // Create verification URL that user will click
  const url = `http://localhost:5000/api/verify-email/${verificationToken}`;
  
  // Email content
  const mailOptions = {
    from: 'noreply@upworkclone.com', // Replace with your company email
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #14a800;">Welcome to Upwork Clone!</h2>
        <p>Thank you for signing up. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #14a800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p>If the button above doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
        <p><a href="${url}" style="color: #14a800; word-break: break-all;">${url}</a></p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    // For ethereal email testing, log the test URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Helper function to send login notification emails
const sendLoginNotificationEmail = async (user, location, successful) => {
  const mailOptions = {
    from: 'security@upworkclone.com',
    to: user.email,
    subject: `${successful ? 'Successful' : 'Failed'} Login Attempt`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${successful ? '#14a800' : '#d93025'};">
          ${successful ? 'Successful Login' : 'Failed Login Attempt'}
        </h2>
        <p>We detected a ${successful ? 'successful' : 'failed'} login attempt to your Upwork Clone account.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Device:</strong> Web Browser</p>
        </div>
        ${!successful ? `
          <p>If this was you, you may have entered incorrect login credentials. Please try again.</p>
          <p>If this wasn't you, we recommend changing your password immediately.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/reset-password" style="background-color: #d93025; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
        ` : `
          <p>If this was you, no action is needed.</p>
          <p>If this wasn't you, please secure your account immediately by changing your password.</p>
        `}
        <p>Thank you for helping us keep your account secure.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Login notification email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending login notification email:', error);
    return false;
  }
};

// ROUTES

// User registration with email verification
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
    
    // Generate verification token
    const verificationToken = jwt.sign(
      { email },
      EMAIL_SECRET,
      { expiresIn: '24h' }
    );
    
    // Insert user with verified=0
    const [result] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, account_type, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, accountType, 0, verificationToken]
    );
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    
    res.status(201).json({ 
      message: 'User registered successfully. Please check your email to verify your account.',
      userId: result.insertId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification endpoint
app.get('/api/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, EMAIL_SECRET);
    const { email } = decoded;
    
    // Update user to verified
    const [result] = await pool.query(
      'UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ? AND verification_token = ?',
      [email, token]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).send('Email verification failed. Invalid or expired token.');
    }
    
    // Redirect to frontend verification success page
    res.redirect(`http://localhost:3000/login?verify=${token}`);
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).send('Email verification failed. Invalid or expired token.');
  }
});

// Email verification API endpoint for direct verification
app.post('/api/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the token
    const decoded = jwt.verify(token, EMAIL_SECRET);
    const { email } = decoded;
    
    // Update user to verified
    const [result] = await pool.query(
      'UPDATE users SET is_verified = 1, verification_token = NULL WHERE email = ? AND verification_token = ?',
      [email, token]
    );
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Email verification failed. Invalid or expired token.' });
    }
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ message: 'Email verification failed. Invalid or expired token.' });
  }
});

// User login with verification check
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const location = req.body.location || 'Unknown Location';
    
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      // Send login failure notification if email exists but wrong password
      await sendLoginNotificationEmail({ email }, location, false);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Send login failure notification 
      await sendLoginNotificationEmail(user, location, false);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if email is verified
    if (!user.is_verified && user.is_verified !== 1) {
      return res.status(403).json({ 
        message: 'Email not verified', 
        needsVerification: true,
        email: user.email
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, accountType: user.account_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Send successful login notification
    await sendLoginNotificationEmail(user, location, true);
    
    // Log login attempt
    await pool.query(
      'INSERT INTO login_attempts (user_id, ip_address, user_agent, location, success) VALUES (?, ?, ?, ?, ?)',
      [user.id, req.ip, req.headers['user-agent'], location, 1]
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
        hourly_rate: user.hourly_rate,
        is_verified: user.is_verified
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend verification email
app.post('/api/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists and is not verified
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND is_verified = 0',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found or already verified' });
    }
    
    // Generate new verification token
    const verificationToken = jwt.sign(
      { email },
      EMAIL_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update user with new verification token
    await pool.query(
      'UPDATE users SET verification_token = ? WHERE email = ?',
      [verificationToken, email]
    );
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken);
    
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password - request reset
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      // For security, still return success even if email doesn't exist
      return res.json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    
    // Set token expiry (1 hour from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    
    // Save token to database
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [hashedToken, expiryDate, email]
    );
    
    // Construct reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    
    // Send reset email
    const mailOptions = {
      from: 'noreply@upworkclone.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #14a800;">Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #14a800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'If your email is registered, you will receive a password reset link' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password with token
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Find user with valid reset token
    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token_expires > NOW()'
    );
    
    // Check each user's hashed reset token
    let validUser = null;
    for (const user of users) {
      const isValidToken = await bcrypt.compare(token, user.reset_token);
      if (isValidToken) {
        validUser = user;
        break;
      }
    }
    
    if (!validUser) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, validUser.id]
    );
    
    // Send password changed confirmation email
    const mailOptions = {
      from: 'security@upworkclone.com',
      to: validUser.email,
      subject: 'Password Changed Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #14a800;">Password Changed</h2>
          <p>Your password has been reset successfully.</p>
          <p>If you did not make this change, please contact support immediately.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
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
      'SELECT id, first_name, last_name, email, account_type, bio, skills, hourly_rate, avatar_url FROM users WHERE id = ?',
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

// Upload profile picture
app.post('/api/profile/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const userId = req.user.userId;

    await pool.query(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, userId]
    );

    res.json({ avatarUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add JWT verification endpoint
app.get('/api/login/verify', authenticateToken, async (req, res) => {
  try {
    // The user data is already verified by the authenticateToken middleware
    // Fetch the latest user data from the database
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, account_type, bio, skills, hourly_rate, avatar_url, is_verified FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
