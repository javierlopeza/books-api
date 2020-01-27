import { Router } from 'express';
import UserController from '../controllers/UserController';
import ResponseBuilder from '../utils/controllers/ResponseBuilder';
import { isLoggedIn, isSelf } from '../utils/routes/Permissions';
import { User } from '../models';

const router = Router();
const responseBuilder = new ResponseBuilder();

router.param('id', async (req, res, next, id) => {
  if (!Number(id)) {
    responseBuilder.setError(400, 'Please input a valid numeric value');
    return responseBuilder.send(res);
  }

  try {
    const user = await User.findOne({ where: { id: Number(id) } });
    if (!user) {
      responseBuilder.setError(404, `Cannot find user with the id ${id}`);
      return responseBuilder.send(res);
    }
    req.state.user = user;
    return next();
  } catch (error) {
    responseBuilder.setError(404, error);
    return responseBuilder.send(res);
  }
});

router.get('/', isLoggedIn, UserController.index);
router.post('/', UserController.create);
router.get('/:id', isSelf, UserController.show);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

export default router;
