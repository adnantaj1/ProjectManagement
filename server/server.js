const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 3000;

const usersRoute = require('./routes/userRoutes');
const projectsRoute = require('./routes/projectRoutes');

app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRoute);

app.listen(port, () => console.log(`listening on port ${port}`));