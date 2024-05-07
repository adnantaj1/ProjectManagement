const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 3000;

const usersRoute = require('./routes/userRoutes');
const projectsRoute = require('./routes/projectRoutes');
const tasksRoute = require('./routes/taskRoutes');

app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/tasks', tasksRoute);

app.listen(port, () => console.log(`listening on port ${port}`));