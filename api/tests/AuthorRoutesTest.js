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
        expect(res.status).to.equal(201);
        res.body.data.should.have.property('id');
        expect(res.body.data.name).equal(author.name);
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
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('It should get all authors', (done) => {
    chai
      .request(app)
      .get('/api/v1/authors')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('name');
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
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('name');
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
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(200);
        expect(res.body.data.id).equal(authorId);
        expect(res.body.data.name).equal(updatedAuthor.name);
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
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should delete an author', (done) => {
    const authorId = 1;
    chai
      .request(app)
      .delete(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({});
        done();
      });
  });

  it('It should not delete an author with invalid id', (done) => {
    const authorId = 777;
    chai
      .request(app)
      .delete(`/api/v1/authors/${authorId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
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
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });
});
