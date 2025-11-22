const Schedule = require('../models/Schedule');
const User = require('../models/User');

// Get teacher's full schedule
exports.getMySchedule = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            where: { user_id: req.userId },
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
        res.send(schedules);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get today's schedule for a teacher
exports.getTodaySchedule = async (req, res) => {
    try {
        const today = new Date().getDay(); // 0=Sunday, 1=Monday, etc.

        const schedules = await Schedule.findAll({
            where: {
                user_id: req.userId,
                day_of_week: today
            },
            order: [['start_time', 'ASC']]
        });

        // Format for display
        const formatted = schedules.map(s => ({
            time: `${s.start_time} - ${s.end_time}`,
            subject: s.subject,
            class: s.class_name
        }));

        res.send(formatted);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get all schedules (admin only)
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [{
                model: User,
                attributes: ['id', 'username']
            }],
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
        res.send(schedules);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Create schedule entry (admin only)
exports.createSchedule = async (req, res) => {
    try {
        const { user_id, class_name, subject, day_of_week, start_time, end_time } = req.body;

        const schedule = await Schedule.create({
            user_id,
            class_name,
            subject,
            day_of_week,
            start_time,
            end_time
        });

        res.send(schedule);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update schedule entry (admin only)
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { class_name, subject, day_of_week, start_time, end_time } = req.body;

        await Schedule.update(
            { class_name, subject, day_of_week, start_time, end_time },
            { where: { id } }
        );

        const updated = await Schedule.findByPk(id);
        res.send(updated);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete schedule entry (admin only)
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        await Schedule.destroy({ where: { id } });
        res.send({ message: 'Schedule deleted successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
