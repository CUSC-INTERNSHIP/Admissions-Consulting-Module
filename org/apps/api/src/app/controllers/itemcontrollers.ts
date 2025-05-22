import { Request, Response } from 'express';

export function PostForm(req: Request, res: Response) {
  const formData = req.body;
  console.log('Dữ liệu nhận được:', formData);

  // TODO: Xử lý lưu database, gửi mail,... tùy ý

  return res.status(200).json({ message: 'Đăng ký thành công' });
}
