import { Router } from 'express';
import AuthorRoutes from './AuthorRoutes';
import BookRoutes from './BookRoutes';
import SessionRoutes from './SessionRoutes';
import UserRoutes from './UserRoutes';

const router = Router();

router.use('/authors', AuthorRoutes);
router.use('/books', BookRoutes);
router.use('/session', SessionRoutes);
router.use('/users', UserRoutes);

export default router;
