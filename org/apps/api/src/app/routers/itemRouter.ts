import { Router } from 'express';
import { PostForm } from '../controllers/itemcontrollers';

const router: Router = Router();

/**
 * @swagger
 * /submitform:
 *   post:
 *     summary: Gửi dữ liệu form
 *     tags:
 *       - Form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       200:
 *         description: Gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post('/submitform', PostForm);

export default router;
