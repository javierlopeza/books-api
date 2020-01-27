import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import bcrypt from 'bcrypt';
import app from '../index';
import { User } from '../src/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing user endpoints:', function () {
  before(async () => {
    const user = {
      email: 'bruce@banner.com',
      password: 'thehulk',
    };
    const otherUser = {
      email: 'steve@rogers.com',
      password: 'america',
    };
    this.currentUser = await User.create(user);
    this.otherUser = await User.create(otherUser);
    this.agent = chai.request.agent(app);
    await this.agent
      .post('/api/v1/session')
      .set('Accept', 'application/json')
      .send(user);
  });

  it('It should create a user', async () => {
    const user = {
      email: 'tony@stark.com',
      password: 'jarvis',
    };
    const res = await chai
      .request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send(user);
    expect(res).to.have.status(201);
    expect(res.body.data).to.include.all.keys(['id', 'email', 'password']);
    expect(res.body.data.email).to.equal(user.email);
    const same = await bcrypt.compare(user.password, res.body.data.password);
    expect(same).to.be.true;
  });

  it('It should not create a user with invalid email', (done) => {
    const user = {
      email: 'peter',
      password: 'jarvis',
    };
    chai
      .request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('It should not create a user with short password', (done) => {
    const user = {
      email: 'tony@stark.com',
      password: 'r2d2',
    };
    chai
      .request(app)
      .post('/api/v1/users')
      .set('Accept', 'application/json')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('It should get all users', (done) => {
    this.agent
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.not.be.empty;
        expect(res.body.data[0]).to.include.all.keys(['id', 'email', 'password']);
        done();
      });
  });

  it('It should not get all users if not logged in', (done) => {
    chai
      .request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should get a particular user', (done) => {
    const userId = this.currentUser.id;
    this.agent
      .get(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.include.all.keys(['id', 'email', 'password']);
        done();
      });
  });

  it('It should not get a particular user if not logged in', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/users/${this.otherUser.id}`)
      .set('Accept', 'application/json');
    expect(res).to.have.status(401);
    expect(res.body).to.include.property('message').that.is.a('string').not.empty;
  });

  it('It should not get a particular user if logged user is not that one', async () => {
    const res = await this.agent
      .get(`/api/v1/users/${this.otherUser.id}`)
      .set('Accept', 'application/json');
    expect(res).to.have.status(403);
    expect(res.body).to.include.property('message').that.is.a('string').not.empty;
  });

  it('It should not get a particular user with invalid id', (done) => {
    const userId = 8888;
    chai
      .request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should not get a particular user with non-numeric id', (done) => {
    const userId = 'aaa';
    chai
      .request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should update a user', async () => {
    const userId = 1;
    const updatedUser = {
      email: 'peter@parker.com',
      password: 'spider',
    };
    const res = await chai
      .request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .send(updatedUser);
    expect(res).to.have.status(200);
    expect(res.body.data.id).to.equal(userId);
    expect(res.body.data.email).to.equal(updatedUser.email);
    const same = await bcrypt.compare(updatedUser.password, res.body.data.password);
    expect(same).to.be.true;
  });

  it('It should not update a user with invalid email', (done) => {
    const userId = 1;
    const updatedUser = {
      email: 'peter',
      password: 'spider',
    };
    chai
      .request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('object').not.empty;
        done();
      });
  });

  it('It should not update a user with short password', (done) => {
    const userId = 1;
    const updatedUser = {
      email: 'peter@parker.com',
      password: 'web',
    };
    chai
      .request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('object').not.empty;
        done();
      });
  });

  it('It should not update an user with invalid id', (done) => {
    const userId = 9999;
    const updatedUser = {
      email: 'peter@parker.com',
      password: 'spider',
    };
    chai
      .request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should not update an user with non-numeric id value', (done) => {
    const userId = 'ggg';
    const updatedUser = {
      name: 'Peter Parker',
    };
    chai
      .request(app)
      .patch(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should delete an user', async () => {
    const userId = 1;
    const res = await chai
      .request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json');
    expect(res).to.have.status(200);
    const user = await User.findByPk(userId);
    expect(user).to.be.null;
  });

  it('It should not delete an user with invalid id', (done) => {
    const userId = 777;
    chai
      .request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should not delete an user with non-numeric id', (done) => {
    const userId = 'bbb';
    chai
      .request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });
});
