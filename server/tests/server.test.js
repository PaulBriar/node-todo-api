const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todos');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

//Seed db
beforeEach(populateUsers);
beforeEach(populateTodos);


describe('Post/todos', () => {
    it('should create new todo', (done) => {
        let text = 'Test todo text';
        request(app)
            .post("/todos")
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err))
            });
    });
    it('Should not create todo with invalid body data', (done) => {
        request(app)
            .post("/todos")
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err))
            });
    });
});

describe('GET/todos', () => {
    it('Should return all todos', (done) => {
        request(app)
            .get("/todos")
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
        .delete("/todos/" + hexId)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(hexId).then((res) => {
                expect(res).toBeFalsy();
                done();
            }).catch(() => {})
        });
  });

  it('Should not remove a todo created by others', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
        .delete("/todos/" + hexId)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(hexId).then((res) => {
                expect(res).toBeTruthy();
                done();
            }).catch((err) => done(err));
        });
  });

  it('Should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

        request(app)
            .delete("/todos/" + hexId)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
  });

  it('Should return 404 if object ID is invalid', (done) => {
    request(app)
            .delete('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = "123";
    request(app)
        .patch("/todos/" + hexId)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true,
            text: text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("123")
            expect(res.body.todo.completed).toBe(true)
            expect(typeof res.body.todo.completedAt).toBe('number')
        })
        .end(done)
  });
  it('Should not update the todo created by other user', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = "123";
    request(app)
        .patch("/todos/" + hexId)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            completed: true,
            text: text
        })
        .expect(404)
        .end(done)
  });
  it('Should clear completedAt when todo is not completed', (done) => {
      let hexId = todos[0]._id.toHexString();
      request(app)
        .patch("/todos/" + hexId)
        .set('x-auth', users[0].tokens[0].token)
        .send({
            text: "Updated text",
            completed: false,
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("Updated text")
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toBeFalsy();
        })
        .end(done)
  });
});

describe('GET /user/me', () => {
  it('Should return user if authenticated', (done) => {
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
  it('should return 401 if not authenticated', (done) => {
    request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    let email = 'example@example.com';
    let password = 'password1'

    request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err) {
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((err) => done(err));
        });
  });
  it('Should return validation errors if request invalid', (done) => {
      let email = 'paul';
      let password = '123';
    request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
  });
  it('Should not create user, if email in use', (done) => {
    let email = 'paul@google.com';
    let password = 'abc123';

    request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
  });
});

describe("POST /user/login", () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });
    });
    it('Should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'fake1234'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                    User.findById(users[0]._id).then((user) => {
                        expect(user.tokens.length).toBe(0)
                        done();
                    }).catch((err) => done(err));
            })
    })
})




