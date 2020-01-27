import { Router } from 'express';
import SessionController from '../controllers/SessionController';

const router = Router();

router.post('/', SessionController.create);
router.delete('/', SessionController.destroy);

export default router;
