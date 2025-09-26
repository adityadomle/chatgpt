require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

async function startServer() {
  try {
    await connectDB(); // await lagao
    console.log('✅ Database connected');

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
}     
  
startServer();   
   