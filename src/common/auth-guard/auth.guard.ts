import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { IVerifyTokenResponse } from '../interface';

//Admin token
/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEyMzQsImlzVmFsaWQiOnRydWUsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0.2NVyIX8v3u7ZR5V7wr-Y-_FM-f0QAPqq8DiyqdzC8I4
 */

//User token
/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEyMzQsImlzVmFsaWQiOnRydWUsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.ptNQNGvaNGy-N-nAWRbuRXqGqhMn4Je1uQ4WYjyy_SY
 */

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers['authorization'].replace('Bearer', '').trim();
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
  verifyToken(token: string): IVerifyTokenResponse {
    if (!token) {
      return { isValid: false };
    }
    const publicKey = fs.readFileSync('public.pem', 'utf-8');
    try {
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });
      const id = typeof decoded === 'string' ? decoded : decoded?.sub;
      return {
        isValid: true,
        id: id,
      };
    } catch (err) {
      return {
        isValid: false,
      };
    }
  }
}
