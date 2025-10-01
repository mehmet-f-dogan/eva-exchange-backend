import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { sequelize } from './models';


const PORT = process.env.PORT || 3000;


async function start() {
    try {
        await sequelize.authenticate();
        console.log('DB authenticated');
        await sequelize.sync();
        console.log('DB synced');
    } catch (err) {
        console.error('DB connection failed:', err);
        process.exit(1);
    }


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


start();