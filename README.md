# 🎓 School Management System

A comprehensive, full-stack school management system built with React, Node.js, Express, and MySQL. This system streamlines administrative tasks, student management, teacher assignments, fee tracking, and grade management with an intuitive, modern interface.

## ✨ Features

### 👨‍💼 Admin Dashboard
- **Student Management**: Add, edit, and manage student profiles with comprehensive details (personal info, parent/guardian details, Aadhar, photos)
- **Teacher Management**: Manage teacher profiles with specializations, employee IDs, and contact information
- **Class Management**: View class statistics, student rankings, and performance metrics
- **Teacher-Class Assignments**: Assign teachers to specific classes and subjects
- **Schedule Management**: Create and manage class schedules with ML-ready architecture for future automation
- **Fee Management**: Assign class-level fees (tuition, exam, library, sports, etc.) with academic year tracking
- **Grade Management**: Comprehensive grade entry and management system
- **Analytics Dashboard**: Real-time statistics and performance insights

### 👨‍🏫 Teacher Dashboard
- **Class-Based View**: View assigned classes and their students
- **Today's Schedule**: Quick access to daily teaching schedule
- **Student Management**: View active students in assigned classes
- **Grade Entry**: Easy grade input for assigned subjects
- **Performance Tracking**: Monitor student progress and class performance

### 📊 Key Capabilities
- **PDF Report Generation**: Generate and download student grade reports
- **Class Statistics**: Average performance, toppers, and student count per class
- **Search & Filter**: Quick search across students, teachers, and classes
- **Responsive Design**: Modern, mobile-friendly UI with smooth animations
- **Role-Based Access Control**: Secure authentication with admin and teacher roles
- **Real-time Updates**: Dynamic data updates across all dashboards

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Fast build tool and dev server
- **Vanilla CSS** - Custom styling with modern design patterns

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - SQL ORM
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
school-project/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context (Auth)
│   │   └── utils/         # Utility functions (PDF generation)
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   └── package.json
│
└── DEPLOYMENT.md         # Deployment guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MySQL 8+ installed and running
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/school-management-system.git
   cd school-management-system
   ```

2. **Setup Database**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE school_management;
   EXIT;
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Start server
   node index.js
   ```

4. **Setup Frontend**
   ```bash
   cd client
   npm install
   
   # Start development server
   npm run dev
   ```

5. **Seed Initial Data**
   ```bash
   # In a new terminal, from server directory
   cd server
   
   # Create admin and teacher users
   curl -X POST http://localhost:3000/api/auth/seed
   
   # (Optional) Seed sample teacher assignments and schedules
   node seed-teacher-data.js
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Default Credentials
```
Admin:
Username: admin
Password: admin123

Teacher:
Username: teacher
Password: teacher123
```

## 🔧 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/seed` - Seed initial admin/teacher users

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `GET /api/students/:id` - Get student by ID

### Teachers
- `GET /api/auth/users` - Get all users (admin only)
- `GET /api/teacher-assignments/my-classes` - Get teacher's assigned classes
- `GET /api/schedules/today` - Get today's schedule for teacher

### Classes
- `GET /api/classes/stats` - Get class statistics
- `GET /api/classes/:className` - Get students in a class

### Grades
- `GET /api/grades/student/:studentId` - Get student grades
- `POST /api/grades` - Create grade entry
- `PUT /api/grades/:id` - Update grade

### Fees
- `GET /api/fees` - Get all fees
- `POST /api/fees` - Assign fee to class
- `GET /api/fees/student/:studentId` - Get student fees

### Teacher Assignments
- `GET /api/teacher-assignments/all` - Get all assignments (admin)
- `POST /api/teacher-assignments` - Assign teacher to class
- `DELETE /api/teacher-assignments/:id` - Remove assignment

### Schedules
- `GET /api/schedules/all` - Get all schedules (admin)
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

## 🎨 Features in Detail

### Student Profile Management
- Comprehensive student information including personal details, parent/guardian information
- Aadhar number tracking
- Photo URL support
- Date of birth, gender, blood group
- Address and contact information
- Status tracking (Active/Left)

### Teacher Management
- Employee ID system
- Specialization tracking (multiple subjects)
- Contact information (email, phone)
- Class and subject assignments
- Schedule management

### Fee Management
- Class-level fee assignment
- Multiple fee types (Tuition, Exam, Library, Sports, Lab, Transport, Annual)
- Academic year tracking
- Due date management
- Automatic application to all students in class

### Grade Management
- Subject-wise grade entry
- Percentage calculation
- Class ranking system
- PDF report generation
- Performance analytics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Teacher)
- Protected API routes
- CORS configuration
- Input validation

## 📱 Responsive Design

- Mobile-friendly interface
- Modern glassmorphism effects
- Smooth animations and transitions
- Intuitive navigation
- Accessible UI components

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions covering:
- Render (Free tier)
- Vercel + Railway
- VPS deployment (DigitalOcean, AWS, etc.)
- SSL setup
- Environment configuration
- Security best practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for educational institutions
- ML-ready architecture for future enhancements

## 📧 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

⭐ Star this repo if you find it helpful!
