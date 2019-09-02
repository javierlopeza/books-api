import { Router } from 'express';
import multer from 'multer';
import BookController from '../controllers/BookController';
import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Book } from '../models';

const router = Router();
const responseBuilder = new ResponseBuilder();
const upload = multer({ dest: 'temp/' });

router.param('id', async (req, res, next, id) => {
  if (!Number(id)) {
    responseBuilder.setError(400, 'Please input a valid numeric value');
    return responseBuilder.send(res);
  }

  try {
    const book = await Book.findOne({ where: { id: Number(id) } });
    if (!book) {
      responseBuilder.setError(404, `Cannot find book with the id ${id}`);
      return responseBuilder.send(res);
    }
    req.state.book = book;
    return next();
  } catch (error) {
    responseBuilder.setError(404, error);
    return responseBuilder.send(res);
  }
});

router.get('/', BookController.index);
router.post('/', upload.single('image'), BookController.create);
router.get('/:id', BookController.show);
router.patch('/:id', upload.single('image'), BookController.update);
router.get('/:id/image', BookController.getImage);
router.delete('/:id', BookController.destroy);

export default router;
