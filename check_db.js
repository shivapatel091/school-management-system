const sequelize = require('./server/config/database');
const Student = require('./server/models/Student');

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync to be sure
        await sequelize.sync({ alter: true });
        console.log('Synced.');

        // Check if we can query with status
        const students = await Student.findAll({
            where: { status: 'Active' }
        });
        console.log(`Found ${students.length} active students.`);

        // Check table info (sqlite specific)
        const [results, metadata] = await sequelize.query("PRAGMA table_info(Students);");
        console.log('Columns:', results.map(c => c.name));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkSchema();
