import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import bcrypt from 'bcrypt';
import app from '../index';
import { User } from '../src/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing user endpoints:', () => {
  before(async () => {
    await User.create({ email: 'bruce@banner.com', password: 'thehulk' });
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
    expect(res.status).to.equal(201);
    res.body.data.should.have.property('id');
    expect(res.body.data.email).equal(user.email);
    const same = await bcrypt.compare(user.password, res.body.data.password);
    expect(same).equal(true);
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
        expect(res.status).to.equal(400);
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
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('It should get all users', (done) => {
    chai
      .request(app)
      .get('/api/v1/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('email');
        res.body.data[0].should.have.property('password');
        done();
      });
  });

  it('It should get a particular user', (done) => {
    const userId = 1;
    chai
      .request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        done();
      });
  });

  it('It should not get a particular user with invalid id', (done) => {
    const userId = 8888;
    chai
      .request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should update a user', (done) => {
    const userId = 1;
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
        expect(res.status).to.equal(200);
        expect(res.body.data.id).equal(userId);
        expect(res.body.data.email).equal(updatedUser.email);
        done();
      });
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should delete an user', (done) => {
    const userId = 1;
    chai
      .request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({});
        done();
      });
  });

  it('It should not delete an user with invalid id', (done) => {
    const userId = 777;
    chai
      .request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });
});
