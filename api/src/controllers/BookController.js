import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Book } from '../models';
import cloudStorage from '../utils/storage/CloudStorage';

const responseBuilder = new ResponseBuilder();

class BookController {
  static async index(req, res) {
    const allBooks = await Book.findAll();
    responseBuilder.setSuccess(200, 'Books retrieved', allBooks);
    return responseBuilder.send(res);
  }

  static async create(req, res) {
    const newBook = req.body;
    try {
      const createdBook = await Book.create(newBook);
      const imageRemotePath = await cloudStorage.uploadFile(
        req.file,
        { directoryPath: 'books', namePrefix: createdBook.id },
      );
      if (imageRemotePath) {
        createdBook.update({ imageUrl: imageRemotePath });
      }
      responseBuilder.setSuccess(201, 'Book created', createdBook);
    } catch (error) {
      responseBuilder.setError(400, error.message);
    }
    return responseBuilder.send(res);
  }

  static async update(req, res) {
    const { book } = req.state;
    const alteredBook = req.body;
    try {
      await book.update(alteredBook);
      const updatedBook = await Book.findByPk(book.id);
      const imageRemotePath = await cloudStorage.uploadFile(
        req.file,
        { directoryPath: 'books', namePrefix: updatedBook.id },
      );
      if (imageRemotePath) {
        updatedBook.update({ imageUrl: imageRemotePath });
      }
      responseBuilder.setSuccess(200, 'Book updated', updatedBook);
    } catch (error) {
      responseBuilder.setError(400, error);
    }
    return responseBuilder.send(res);
  }

  static async show(req, res) {
    const { book } = req.state;
    responseBuilder.setSuccess(200, 'Found Book', book);
    return responseBuilder.send(res);
  }

  static async getImage(req, res) {
    const { imageUrl } = req.state.book;
    if (/^https?:\/\//.test(imageUrl)) {
      responseBuilder.setRedirection(301, imageUrl);
      return responseBuilder.send(res);
    }
    const fileStream = cloudStorage.download(imageUrl);
    return fileStream.pipe(res);
  }

  static async destroy(req, res) {
    const { book } = req.state;
    await book.destroy();
    responseBuilder.setSuccess(200, 'Book deleted');
    return responseBuilder.send(res);
  }
}

export default BookController;
