import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../index';
import { Author, Book } from '../src/models';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing book endpoints:', () => {
  before(async () => {
    const author = await Author.create({ name: 'Howard Stark' });
    await Book.create({ title: 'How to be Iron Man', authorId: author.id });
  });

  it('It should create a book', async () => {
    const author = await Author.findOne();
    const book = {
      authorId: author.id,
      title: 'The Great Gatsby',
      description: 'Living in the fictional towns of West Egg and East Egg.',
      datePublished: '1925-10-25',
      imageUrl:
        'https://images-na.ssl-images-amazon.com/images/I/41iers%2BHLSL._SX326_BO1,204,203,200_.jpg',
    };
    const res = await chai
      .request(app)
      .post('/api/v1/books')
      .set('Accept', 'application/json')
      .send(book);
    expect(res).to.have.status(201);
    expect(res.body.data).to.include.all.keys([
      'id',
      'title',
      'description',
      'datePublished',
      'imageUrl',
      'authorId',
    ]);
    expect(res.body.data.title).to.equal(book.title);
    expect(res.body.data.description).to.equal(book.description);
    expect(res.body.data.datePublished).to.equal(book.datePublished);
    expect(res.body.data.imageUrl).to.equal(book.imageUrl);
    expect(res.body.data.authorId).to.equal(author.id);
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
        expect(res).to.have.status(400);
        done();
      });
  });

  it('It should get all books', (done) => {
    chai
      .request(app)
      .get('/api/v1/books')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.not.be.empty;
        expect(res.body.data[0]).to.include.all.keys([
          'id',
          'title',
          'description',
          'datePublished',
          'imageUrl',
          'authorId',
        ]);
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
        expect(res.body.data).to.include.all.keys([
          'id',
          'title',
          'description',
          'datePublished',
          'imageUrl',
          'authorId',
        ]);
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
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
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
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should update a book', async () => {
    const book = await Book.findOne();
    const updatedBook = {
      title: 'The Little Prince',
      description:
        'The most famous work of French aristocrat Antoine de Saint-Exupéry',
    };
    const res = await chai
      .request(app)
      .patch(`/api/v1/books/${book.id}`)
      .set('Accept', 'application/json')
      .send(updatedBook);
    expect(res).to.have.status(200);
    expect(res.body.data.title).to.equal(updatedBook.title);
    expect(res.body.data.description).to.equal(updatedBook.description);
    expect(res.body.data.id).to.equal(book.id);
    expect(res.body.data.datePublished).to.equal(book.datePublished);
    expect(res.body.data.imageUrl).to.equal(book.imageUrl);
    expect(res.body.data.authorId).to.equal(book.authorId);
  });

  it('It should not update a book with invalid id', (done) => {
    const bookId = 9999;
    const updatedBook = {
      title: 'The Hobbit',
    };
    chai
      .request(app)
      .patch(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .send(updatedBook)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
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
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });

  it('It should delete a book', async () => {
    const bookId = 1;
    const res = await chai
      .request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json');
    expect(res).to.have.status(200);
    const book = await Book.findByPk(bookId);
    expect(book).to.be.null;
  });

  it('It should not delete a book with invalid id', (done) => {
    const bookId = 777;
    chai
      .request(app)
      .delete(`/api/v1/books/${bookId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
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
        expect(res).to.have.status(400);
        expect(res.body).to.include.property('message').that.is.a('string').not.empty;
        done();
      });
  });
});
