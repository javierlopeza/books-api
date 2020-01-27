import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';
import { User } from '../src/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing session endpoints:', () => {
  before(async () => {
    await User.create({ email: 'roger@federer.com', password: 'tennis' });
  });

  it('It should log in', async () => {
    const user = {
      email: 'roger@federer.com',
      password: 'tennis',
    };
    const res = await chai
      .request(app)
      .post('/api/v1/session')
      .set('Accept', 'application/json')
      .send(user);
    expect(res).to.have.status(201);
  });

  it('It should not log in with invalid password', async () => {
    const user = {
      email: 'roger@federer.com',
      password: 'wimbledon',
    };
    const res = await chai
      .request(app)
      .post('/api/v1/session')
      .set('Accept', 'application/json')
      .send(user);
    expect(res).to.have.status(401);
  });

  it('It should not log in with non-existing email', async () => {
    const user = {
      email: 'rafael@nadal.com',
      password: 'rolandgarros',
    };
    const res = await chai
      .request(app)
      .post('/api/v1/session')
      .set('Accept', 'application/json')
      .send(user);
    expect(res).to.have.status(401);
  });

  it('It should log out after logging in', async () => {
    const agent = chai.request.agent(app);
    const user = {
      email: 'roger@federer.com',
      password: 'tennis',
    };
    const logInRes = await agent
      .post('/api/v1/session')
      .set('Accept', 'application/json')
      .send(user);
    expect(logInRes).to.have.status(201);
    expect(logInRes).to.have.cookie('express:sess');
    expect(logInRes).to.have.cookie('express:sess.sig');
    expect(logInRes).to.have.header('set-cookie');
    expect(logInRes.headers['set-cookie']).to.have.length(2);
    expect(logInRes.headers['set-cookie'][0]).to.match(/^express:sess=[A-z0-9]{16};/);
    expect(logInRes.headers['set-cookie'][1]).to.match(/^express:sess.sig=[A-z0-9]+;/);
    const logOutRes = await agent
      .delete('/api/v1/session')
      .set('Accept', 'application/json')
      .send();
    expect(logOutRes).to.have.status(200);
    expect(logOutRes.headers['set-cookie'][0]).to.match(/^express:sess=;/);
    agent.close();
  });
});
