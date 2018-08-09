const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {NewTodo} = require('./../models/NewTodo');
var {Users} = require('./../models/Users');
var {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should check if new todo gets added correctly', (done) => {
        var text = 'First test todo';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err,res) => {
            if(err) {
               return done(err);
            }
            NewTodo.find().then((todos) => {
                expect(todos.length).toBe(3);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((err) => done(err));
        });
    });

    it('should not create a todo with invalid text', (done) => {
        var text = '';
        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end((err,res) => {
            if(err) {
               return done(err);
            }
            NewTodo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((err) => done(err));
        });

        
    });
});

describe('GET/todos', () => {
    it('should not create a todo if invalid data is passed', (done) => {

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res) => {
            if(err) {
                return done(err);
            }

            NewTodo.find().then((newtodos) => {
                expect(newtodos.length).toBe(2);
                done();
            }).catch((err) => done(err));
        });
    });
});
   
describe('GET/todos/:id', () => {
    it('should return the correct todo for an id', (done) => {

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = todos[0]._id.toHexString()+'ww';
        // var id = new ObjectID().toHexString();

        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 is object id is invalid', (done) => {

        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});

describe('DELETE/todos/:id', () => {
    it('should return the correct todo for an id', (done) => {

        var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }

            NewTodo.findById(hexId).then((newtodos) => {
               expect(newtodos).toBeFalsy();
                done();
            }).catch((err) => done(err));
        });
    });

    it('should return 404 if todo not found', (done) => {
        var id = todos[0]._id.toHexString()+'ww';
        // var id = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 is object id is invalid', (done) => {

        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var body = {
            text: 'updating record',
            completed: true
        };

        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.text).toBe(body.text);
            expect(res.body.todos.completed).toBe(true);
            expect(typeof res.body.todos.completedAt).toBe('number');
        })
        .end(done);
    });

    it('should set the value of completedAt to null if completed is not true', (done) => {
        var id = todos[1]._id.toHexString();
        var body = {
            text: 'trying second one'
        };

        request(app)
        .patch(`/todos/${id}`)
        .send(body)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.text).toBe(body.text);
            expect(res.body.todos.completed).toBe(false);
            expect(res.body.todos.completedAt).toBeFalsy();
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return the user when authenticated', (done) => {

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return status 401 when authentication fails', (done) => {

        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users/me', () => {
    it('should create a new user', (done) => {
        var email = 'example@example.com';
        var password = 'password12';

        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }

            Users.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            });
        });
    });

    it('should give a validation error for invalid email, password', (done) => {
       
        request(app)
        .post('/users')
        .send({
            email: 'example.com',
            password: '123'})
        .expect(400)
        .end(done);
    });

    it('should give an error for an email already in use', (done) => {
       
        request(app)
        .post('/users')
        .send({email:  'simran@example.com',
               password: 'password@12'})
        .expect(400)
        .end(done);
    });
});