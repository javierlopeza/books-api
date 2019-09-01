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
});
