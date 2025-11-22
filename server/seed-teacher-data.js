// Seed script to create sample teacher assignments and schedules
// Run this after the server starts to populate the database with test data

const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Login as admin to get token
async function getAdminToken() {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        return response.data.accessToken;
    } catch (error) {
        console.error('Error logging in:', error.message);
        return null;
    }
}

// Create teacher assignments
async function createAssignments(token) {
    const headers = { Authorization: `Bearer ${token}` };

    // Assuming teacher user has ID 2 (check your database)
    const assignments = [
        { user_id: 2, class_name: 'Class 10A', subject: 'Mathematics' },
        { user_id: 2, class_name: 'Class 9B', subject: 'Physics' },
        { user_id: 2, class_name: 'Class 10B', subject: 'Mathematics' }
    ];

    for (const assignment of assignments) {
        try {
            await axios.post(`${API_URL}/teacher-assignments`, assignment, { headers });
            console.log(`✓ Created assignment: ${assignment.class_name} - ${assignment.subject}`);
        } catch (error) {
            console.error(`✗ Error creating assignment:`, error.response?.data || error.message);
        }
    }
}

// Create schedules
async function createSchedules(token) {
    const headers = { Authorization: `Bearer ${token}` };

    // Assuming teacher user has ID 2
    const schedules = [
        { user_id: 2, class_name: 'Class 10A', subject: 'Mathematics', day_of_week: 1, start_time: '09:00', end_time: '10:00' },
        { user_id: 2, class_name: 'Class 9B', subject: 'Physics', day_of_week: 1, start_time: '10:30', end_time: '11:30' },
        { user_id: 2, class_name: 'Class 10B', subject: 'Mathematics', day_of_week: 1, start_time: '13:00', end_time: '14:00' },
        { user_id: 2, class_name: 'Class 10A', subject: 'Mathematics', day_of_week: 3, start_time: '09:00', end_time: '10:00' },
        { user_id: 2, class_name: 'Class 9B', subject: 'Physics', day_of_week: 3, start_time: '11:00', end_time: '12:00' }
    ];

    for (const schedule of schedules) {
        try {
            await axios.post(`${API_URL}/schedules`, schedule, { headers });
            console.log(`✓ Created schedule: ${schedule.class_name} - ${schedule.subject} on day ${schedule.day_of_week}`);
        } catch (error) {
            console.error(`✗ Error creating schedule:`, error.response?.data || error.message);
        }
    }
}

// Main function
async function seed() {
    console.log('🌱 Starting seed process...\n');

    const token = await getAdminToken();
    if (!token) {
        console.error('Failed to get admin token. Make sure the server is running and admin user exists.');
        return;
    }

    console.log('✓ Admin login successful\n');

    console.log('Creating teacher assignments...');
    await createAssignments(token);

    console.log('\nCreating schedules...');
    await createSchedules(token);

    console.log('\n✅ Seed process completed!');
}

seed();
