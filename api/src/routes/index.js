import { Router } from 'express';
import AuthorRoutes from './AuthorRoutes';
import BookRoutes from './BookRoutes';

const router = Router();

router.use('/authors', AuthorRoutes);
router.use('/books', BookRoutes);

export default router;
