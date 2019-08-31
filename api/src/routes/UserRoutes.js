import { Router } from 'express';
import UserController from '../controllers/UserController';
import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { User } from '../models';

const router = Router();
const responseBuilder = new ResponseBuilder();

router.param('id', async (req, res, next, id) => {
  if (!Number(id)) {
    responseBuilder.setError(400, 'Please input a valid numeric value');
    return responseBuilder.send(res);
  }

  try {
    const theUser = await User.findOne({ where: { id: Number(id) } });
    if (!theUser) {
      responseBuilder.setError(404, `Cannot find user with the id ${id}`);
      return responseBuilder.send(res);
    }
    req.theUser = theUser;
    return next();
  } catch (error) {
    responseBuilder.setError(404, error);
    return responseBuilder.send(res);
  }
});

router.get('/', UserController.index);
router.post('/', UserController.create);
router.get('/:id', UserController.show);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

export default router;
