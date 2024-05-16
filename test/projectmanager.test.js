/* process.env.NODE_ENV = 'test'; */

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server/server');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

describe('Testing of routes in project manager app', () => {
    
    let token = '';
    let userId = '';
    let projectId = '';
    let taskId = '';

    // Test for user registration and login
        it('should register a user and login', (done) => {

            // Create a user
            let user = {
                firstName: "Unit",
                lastName: "Test",
                email: "unittest@easv365.dk",
                password: "123456789"
            }
    
            // Register the user
            chai.request(server)
                .post('/api/users/register')
                .send(user)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');


                    // Login recently created user
                    chai.request(server)
                        .post('/api/users/login')
                        .send({ email: "unittest@easv365.dk",
                                password: "123456789"
                        })
                        .end((err, res) => {
                            expect(res.status).to.be.equal(200);
                            //console.log(res.body);
                            token = res.body.data; // Store the token for further tests
                            const decoded = jwt.verify(token, process.env.JWT_SECRET);
                            userId = decoded.userId; // Extract userId from decoded token
                            done();
                        });

                });
        });


        // Test for project creation
        it('should create a project', (done) => {

            // Create a project
            let project = {
                name: "Unit Test Project",
                description: "This is a unit test project creation",
                owner: userId,
                members: [
                    {
                        user: userId,
                        role: "owner"
                    }
                ]
            }

            // Send project data to the server
            chai.request(server)
                .post('/api/projects/create-project')
                .set('Authorization', 'Bearer ' + token)
                .send(project)
                .end((err, res) => {
                    //console.log(res.body); 
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data).to.have.property('name', 'Unit Test Project');
                    expect(res.body.data).to.have.property('description', 'This is a unit test project creation');
                    projectId = res.body.data._id; // Store the project ID for further tests
                    //console.log(projectId);
                    done();
                });
        });


         // Test for editing the project
        it('should edit the project', (done) => {

            // Edit the project
            let updatedProject = {
                _id: projectId,
                name: "Updated Unit Test Project",
                description: "This is updated unit test project",
                owner: userId
            };

            //console.log('Sending update request with data:', updatedProject);

            // Send updated project data to the server
            chai.request(server)
                .post('/api/projects/edit-project')
                .set('Authorization', 'Bearer ' + token)
                .send(updatedProject)
                .end((err, res) => {
                    //console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data).to.have.property('name', 'Updated Unit Test Project');
                    expect(res.body.data).to.have.property('description', 'This is updated unit test project');
                    done();
                });
        });


        // Test for getting project by id
        it('should get project by id', (done) => {

            // Send project ID to the server
            chai.request(server)
                .post('/api/projects/get-project-by-id')
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: projectId })
                .end((err, res) => {
                    //console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data).to.have.property('name', 'Updated Unit Test Project');
                    expect(res.body.data).to.have.property('description', 'This is updated unit test project');
                    done();
                });
        });

        // Test for creating a task
        it('should create a task', (done) => {

            // Create a task
            let task = {
                name: "Unit Test Task",
                description: "This is a unit test task",
                status: "pending",
                project: projectId,
                assignedTo: userId,
                assignedBy: userId
            }

            // Send task data to the server
            chai.request(server)
                .post('/api/tasks/create-task')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    //console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.data).to.have.property('name', 'Unit Test Task');
                    expect(res.body.data).to.have.property('description', 'This is a unit test task');
                    taskId = res.body.data._id; // Store the task ID for further tests
                    done();
                });
        });

        // Test for editing the task
        it('should edit the task', (done) => {

            // Edit the task
            let updatedTask = {
                _id: taskId,
                name: "Updated Unit Test Task",
                description: "This is updated unit test task",
                status: "completed"
            };

            // Send updated task data to the server
            chai.request(server)
                .post('/api/tasks/update-task')
                .set('Authorization', 'Bearer ' + token)
                .send(updatedTask)
                .end((err, res) => {
                    //console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.be.equal('Task updated successfully')
                    done();
                });
        });

        // Test for deleting the task
        it('should delete the task', (done) => {

            // Send task ID to the server
            chai.request(server)
                .post('/api/tasks/delete-task')
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: taskId })
                .end((err, res) => {
                    //console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.be.equal('Task deleted successfully');
                    done();
                });
        });

        // Test for add notification
        it('should add a notification', (done) => {
            let notification = {
                user: userId,
                title: "Task Completion Unit Test",
                description: "Your task has been completed successfully.",
                onClick: "project/664387e4389800762ffc1b7d"
            };
    
            chai.request(server)
                .post('/api/notifications/add-notification')
                .set('Authorization', 'Bearer ' + token)
                .send(notification)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('Notification added successfully');
                    expect(res.body.data).to.have.property('title', 'Task Completion Unit Test');
                    expect(res.body.data).to.have.property('description', 'Your task has been completed successfully.');
                    expect(res.body.data).to.have.property('onClick', 'project/664387e4389800762ffc1b7d');
                    expect(res.body.data).to.have.property('user', userId);
                    done();
                });
        });

        // Test for another add notification
        it('should add another notification', (done) => {
            let notification = {
                user: userId,
                title: "Task Assignment Unit Test",
                description: "You have been assigned a new task.",
                onClick: "project/664387e4389800762ffc1b7d"
            };
    
            chai.request(server)
                .post('/api/notifications/add-notification')
                .set('Authorization', 'Bearer ' + token)
                .send(notification)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('Notification added successfully');
                    expect(res.body.data).to.have.property('title', 'Task Assignment Unit Test');
                    expect(res.body.data).to.have.property('description', 'You have been assigned a new task.');
                    expect(res.body.data).to.have.property('onClick', 'project/664387e4389800762ffc1b7d');
                    expect(res.body.data).to.have.property('user', userId);
                    done();
                });
        });

        // Test for getting all notifications
        it('should retrieve 2 notifications for the user', (done) => {
            chai.request(server)
                .get('/api/notifications/get-all-notifications') // Ensure this matches your actual endpoint URL
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('Notifications fetched successfully');
                    expect(res.body.data).to.be.an('array').that.has.lengthOf(2);
                    expect(res.body.data).to.be.an('array');
                    res.body.data.forEach(notification => {
                        expect(notification).to.have.property('user', userId);
                        expect(notification).to.include.keys('title', 'description', 'onClick', 'read');
                    });
                    done();
                });
        });

        // Test for marking notification as read
        it('should mark all notifications as read', (done) => {
            chai.request(server)
                .post('/api/notifications/mark-as-read')
                .set('Authorization', 'Bearer ' + token)
                .send({ userId: userId })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('Notifications marked as read successfully');
                    done();
                });
        });

        // Test for deleting all notifications for the user
        it('should delete all notifications for the user', (done) => {
            chai.request(server)
                .delete('/api/notifications/delete-all-notifications')
                .set('Authorization', 'Bearer ' + token)
                .send({ userId: userId })
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.success).to.be.true;
                    expect(res.body.message).to.equal('All notifications deleted successfully');
                    
                    // Verify that the database has 0 notifications left for the user
                    chai.request(server)
                        .get('/api/notifications/get-all-notifications')
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, verifyRes) => {
                            expect(verifyRes.status).to.be.equal(200);
                            expect(verifyRes.body.data).to.be.an('array').that.is.empty;
                            done();
                        });
                });
        });

        // Test for deleting the project
        it('should delete the project', (done) => {

            // Send project ID to the server
            chai.request(server)
                .post('/api/projects/delete-project')
                .set('Authorization', 'Bearer ' + token)
                .send({ _id: projectId })
                .end((err, res) => {
                    //console.log(res.body);
                    expect(res.status).to.be.equal(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.message).to.be.equal('Project deleted successfully');
                    done();
                });
        });

});
