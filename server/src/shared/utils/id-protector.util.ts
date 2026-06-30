import { env } from '@presentation/express/utils/constants/env.constants';
import jwt from 'jsonwebtoken';

export const IdProtector = {

  encodeId(id: string): string {
    if (!id) return id;
    return jwt.sign({ id }, env.JWT_SECRET);
  },

  decodeId(token: string): string {
    if (!token) return token;
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    return decoded.id;
  }
}
