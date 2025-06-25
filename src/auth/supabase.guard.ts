import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private client = jwksClient({
    jwksUri: `${process.env.SUPABASE_URL}/auth/v1/keys`,
    cache: true,
    rateLimit: true,
  });

  private getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    this.client.getSigningKey(header.kid as string, (err, key) => {
      if (err) {
        callback(err, undefined);
      } else {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
      }
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    const token = auth.replace('Bearer ', '');
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, this.getKey.bind(this), {
          audience: process.env.SUPABASE_URL,
          issuer: `${process.env.SUPABASE_URL}/auth/v1`,
        }, (err, decodedToken) => {
          if (err) {
            return reject(err);
          }
          resolve(decodedToken);
        });
      });
      request['user'] = decoded;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
