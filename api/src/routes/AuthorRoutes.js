import { Router } from 'express';
import AuthorController from '../controllers/AuthorController';
import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { Author } from '../models';

const router = Router();
const responseBuilder = new ResponseBuilder();

router.param('id', async (req, res, next, id) => {
  if (!Number(id)) {
    responseBuilder.setError(400, 'Please input a valid numeric value');
    return responseBuilder.send(res);
  }

  try {
    const theAuthor = await Author.findOne({ where: { id: Number(id) } });
    if (!theAuthor) {
      responseBuilder.setError(404, `Cannot find author with the id ${id}`);
      return responseBuilder.send(res);
    }
    req.theAuthor = theAuthor;
    return next();
  } catch (error) {
    responseBuilder.setError(404, error);
    return responseBuilder.send(res);
  }
});

router.get('/', AuthorController.index);
router.post('/', AuthorController.create);
router.get('/:id', AuthorController.show);
router.patch('/:id', AuthorController.update);
router.delete('/:id', AuthorController.destroy);

export default router;
