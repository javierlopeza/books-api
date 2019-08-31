import { Router } from 'express';
import BookController from '../controllers/BookController';
import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Book } from '../models';

const router = Router();
const responseBuilder = new ResponseBuilder();

router.param('id', async (req, res, next, id) => {
  if (!Number(id)) {
    responseBuilder.setError(400, 'Please input a valid numeric value');
    return responseBuilder.send(res);
  }

  try {
    const theBook = await Book.findOne({ where: { id: Number(id) } });
    if (!theBook) {
      responseBuilder.setError(404, `Cannot find book with the id ${id}`);
      return responseBuilder.send(res);
    }
    req.theBook = theBook;
    return next();
  } catch (error) {
    responseBuilder.setError(404, error);
    return responseBuilder.send(res);
  }
});

router.get('/', BookController.index);
router.post('/', BookController.create);
router.get('/:id', BookController.show);
router.patch('/:id', BookController.update);
router.delete('/:id', BookController.destroy);

export default router;
