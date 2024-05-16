const express = require('express');
const app = express();

//swagger dependencies
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//setup swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

require('dotenv').config();
app.use(express.json());
const dbConfig = require('./config/dbConfig');
const port = process.env.PORT || 3000;

const usersRoute = require('./routes/userRoutes');
const projectsRoute = require('./routes/projectRoutes');
const tasksRoute = require('./routes/taskRoutes');
const notificationsRoute = require('./routes/notificationRoutes');

app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/tasks', tasksRoute);
app.use('/api/notifications', notificationsRoute);

// deployment config
const path = require('path');
__dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;