const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todos');
const {todos, populateTodos} = require('./seed/seed');

//Seed db
beforeEach(populateTodos);


describe('Post/todos', () => {
    it('should create new todo', (done) => {
        let text = 'Test todo text';
        request(app)
            .post("/todos")
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });

    // it('Should return 404 if todo not found', (done) => {
    //     let hexId = new ObjectID().toHexString();
    //     request(app)
    //         .get("/todos/" + hexId)
    //         .expect(404)
    //         .end(done);
    // });


});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', () => {
    let hexId = todos[1]._id.toHexString();
    request(app)
        .delete("/todos/" + hexId)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(hexId).then((res) => {
                expect(res).toNotExist();
                done();
            }).catch(() => {})
        });
  });

  it('Should return 404 if todo not found', (done) => {
    let hexId = new ObjectID().toHexString();

        request(app)
            .delete("/todos/" + hexId)
            .expect(404)
            .end(done);
  });

  it('Should return 404 if object ID is invalid', (done) => {
    request(app)
            .delete('/todos/123')
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
        .send({
            completed: true,
            text: text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("123")
            expect(res.body.todo.completed).toBe(true)
        })

        .end(done)
  });
  it('Should clear completedAt when todo is not completed', (done) => {
      let hexId = todos[1]._id.toHexString();
      request(app)
        .patch("/todos/" + hexId)
        .send({
            text: "Updated text",
            completed: false,
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("Updated text")
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done)
  });
});


