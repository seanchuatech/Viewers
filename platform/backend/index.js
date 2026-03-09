const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Datastore = require('nedb-promise');
const path = require('path');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'dental-secret-key'; // In production, move to env

// Database setup
const db = {};
db.measurements = Datastore({ filename: path.join(__dirname, 'data', 'measurements.db'), autoload: true });

app.use(cors());
app.use(bodyParser.json());

// --- Authentication ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple mock authentication
  if (username === 'admin' && password === 'dental123') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ success: true, token });
  }
  
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Measurements Persistence ---

app.get('/api/measurements/:StudyInstanceUID', authenticateToken, async (req, res) => {
  try {
    const { StudyInstanceUID } = req.params;
    const measurements = await db.measurements.find({ StudyInstanceUID });
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/measurements', authenticateToken, async (req, res) => {
  try {
    const { StudyInstanceUID, measurements } = req.body;
    
    // Simple strategy: Remove old and insert new for this study
    // Alternatively, upsert individually.
    await db.measurements.remove({ StudyInstanceUID }, { multi: true });
    
    if (measurements && measurements.length > 0) {
      const docs = measurements.map(m => ({ ...m, StudyInstanceUID }));
      await db.measurements.insert(docs);
    }
    
    res.json({ success: true, count: measurements.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dental Backend running on http://localhost:${PORT}`);
});
