require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const gradeRoutes = require('./routes/grade.routes');
const feeRoutes = require('./routes/fee.routes');
const classRoutes = require('./routes/class.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const teacherAssignmentRoutes = require('./routes/teacherAssignment.routes');
const scheduleRoutes = require('./routes/schedule.routes');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/teacher-assignments', teacherAssignmentRoutes);
app.use('/api/schedules', scheduleRoutes);

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
