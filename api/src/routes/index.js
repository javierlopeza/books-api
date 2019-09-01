import { Router } from 'express';
import AuthorRoutes from './AuthorRoutes';
import BookRoutes from './BookRoutes';
import SessionRoutes from './SessionRoutes';
import UserRoutes from './UserRoutes';
import { User } from '../models';

const router = Router();

router.use(async (req, res, next) => {
  req.currentUser = req.session.userId && await User.findByPk(req.session.userId);
  return next();
});

router.use('/authors', AuthorRoutes);
router.use('/books', BookRoutes);
router.use('/session', SessionRoutes);
router.use('/users', UserRoutes);

export default router;
