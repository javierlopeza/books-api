import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';
import { Author, Book } from '../src/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing book endpoints:', () => {
  before(async () => {
    await Author.create({ name: 'Howard Stark' });
  });

  it('It should create a book', async () => {
    const author = await Author.findOne();
    const book = {
      authorId: author.id,
      title: 'The Great Gatsby',
      description: 'Living in the fictional towns of West Egg and East Egg.',
      datePublished: '1925-10-25',
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/41iers%2BHLSL._SX326_BO1,204,203,200_.jpg',
    };
    chai
      .request(app)
      .post('/api/v1/books')
      .set('Accept', 'application/json')
      .send(book)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data.id).equal(1);
        expect(res.body.data.title).equal(book.title);
        expect(res.body.data.description).equal(book.description);
        expect(res.body.data.datePublished).equal(book.datePublished);
        expect(res.body.data.imageUrl).equal(book.imageUrl);
      });
  });

  it('It should not create a book with incomplete parameters', (done) => {
    const book = {
      description: 'This is a book missing its title. Very sad.',
    };
    chai
      .request(app)
      .post('/api/v1/books')
      .set('Accept', 'application/json')
      .send(book)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('It should get all books', (done) => {
    chai
      .request(app)
      .get('/api/v1/books')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('title');
        res.body.data[0].should.have.property('description');
        res.body.data[0].should.have.property('datePublished');
        res.body.data[0].should.have.property('imageUrl');
        res.body.data[0].should.have.property('authorId');
        done();
      });
  });

  it('It should get a particular book', (done) => {
    const bookId = 1;
    chai
      .request(app)
      .get(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('title');
        res.body.data.should.have.property('description');
        res.body.data.should.have.property('datePublished');
        res.body.data.should.have.property('imageUrl');
        res.body.data.should.have.property('authorId');
        done();
      });
  });

  it('It should not get a particular book with invalid id', (done) => {
    const bookId = 8888;
    chai
      .request(app)
      .get(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should not get a particular book with non-numeric id', (done) => {
    const bookId = 'aaa';
    chai
      .request(app)
      .get(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should update a book', async () => {
    const book = await Book.findOne();
    const updatedBook = {
      title: 'The Little Prince',
      description: 'The most famous work of French aristocrat Antoine de Saint-Exupéry',
    };
    chai
      .request(app)
      .patch(`/api/v1/books/${book.id}`)
      .set('Accept', 'application/json')
      .send(updatedBook)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.title).equal(updatedBook.title);
        expect(res.body.data.description).equal(updatedBook.description);
        expect(res.body.data.id).equal(book.id);
        expect(res.body.data.datePublished).equal(book.datePublished);
        expect(res.body.data.imageUrl).equal(book.imageUrl);
        expect(res.body.data.authorId).equal(book.authorId);
      });
  });

  it('It should not update a book with invalid id', (done) => {
    const bookId = '9999';
    const updatedBook = {
      title: 'The Hobbit',
    };
    chai
      .request(app)
      .patch(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .send(updatedBook)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should not update a book with non-numeric id value', (done) => {
    const bookId = 'ggg';
    const updatedBook = {
      title: 'The Hobbit',
    };
    chai
      .request(app)
      .patch(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .send(updatedBook)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should delete a book', (done) => {
    const bookId = 1;
    chai
      .request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.include({});
        done();
      });
  });

  it('It should not delete a book with invalid id', (done) => {
    const bookId = 777;
    chai
      .request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        res.body.should.have.property('message');
        done();
      });
  });

  it('It should not delete a book with non-numeric id', (done) => {
    const bookId = 'bbb';
    chai
      .request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        res.body.should.have.property('message');
        done();
      });
  });
});
