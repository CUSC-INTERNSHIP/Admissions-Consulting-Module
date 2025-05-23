import { Router } from 'express';
import { PostForm, SendEmailController } from '../controllers/itemcontrollers';

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

/**
 * @swagger
 * /sendemail:
 *   post:
 *     summary: Gửi email
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email người nhận
 *               subject:
 *                 type: string
 *                 description: Tiêu đề email
 *               text:
 *                 type: string
 *                 description: Nội dung email
 *             required:
 *               - to
 *               - subject
 *               - text
 *     responses:
 *       200:
 *         description: Email đã gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email đã được gửi"
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post('/sendemail', SendEmailController);

export default router;
