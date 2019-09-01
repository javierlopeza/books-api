import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';
import { Author } from '../src/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing author endpoints:', () => {
  before(async () => {
    await Author.create({ name: 'Bruce Banner' });
  });

  it('It should create an author', (done) => {
    const author = {
      name: 'Tony Stark',
    };
    chai
      .request(app)
      .post('/api/v1/authors')
      .set('Accept', 'application/json')
      .send(author)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data).to.include.all.keys(['id', 'name']);
        expect(res.body.data.name).to.equal(author.name);
        done();
      });
  });

  it('It should not create an author with incomplete parameters', (done) => {
    const author = {};
    chai
      .request(app)
      .post('/api/v1/authors')
      .set('Accept', 'application/json')
      .send(author)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('It should get all authors', (done) => {
    chai
      .request(app)
      .get('/api/v1/authors')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.not.be.empty;
        expect(res.body.data[0]).to.include.all.keys(['id', 'name']);
        done();
      });
  });

  it('It should get a particular author', (done) => {
    const authorId = 1;
    chai
      .request(app)
      .get(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.include.all.keys(['id', 'name']);
        done();
      });
  });

  it('It should not get a particular author with invalid id', (done) => {
    const authorId = 8888;
    chai
      .request(app)
      .get(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should not get a particular author with non-numeric id', (done) => {
    const authorId = 'aaa';
    chai
      .request(app)
      .get(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should update an author', (done) => {
    const authorId = 1;
    const updatedAuthor = {
      name: 'Peter Parker',
    };
    chai
      .request(app)
      .patch(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .send(updatedAuthor)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.id).to.equal(authorId);
        expect(res.body.data.name).to.equal(updatedAuthor.name);
        done();
      });
  });

  it('It should not update an author with empty name', (done) => {
    const authorId = 1;
    const updatedAuthor = {
      name: '',
    };
    chai
      .request(app)
      .patch(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .send(updatedAuthor)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('object').not.empty;
        done();
      });
  });

  it('It should not update an author with invalid id', (done) => {
    const authorId = 9999;
    const updatedAuthor = {
      name: 'Peter Parker',
    };
    chai
      .request(app)
      .patch(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .send(updatedAuthor)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should not update an author with non-numeric id value', (done) => {
    const authorId = 'ggg';
    const updatedAuthor = {
      name: 'Peter Parker',
    };
    chai
      .request(app)
      .patch(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .send(updatedAuthor)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should delete an author', async () => {
    const authorId = 1;
    const res = await chai
      .request(app)
      .delete(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json');
    expect(res).to.have.status(200);
    const author = await Author.findByPk(authorId);
    expect(author).to.be.null;
  });

  it('It should not delete an author with invalid id', (done) => {
    const authorId = 777;
    chai
      .request(app)
      .delete(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should not delete an author with non-numeric id', (done) => {
    const authorId = 'bbb';
    chai
      .request(app)
      .delete(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });
});
