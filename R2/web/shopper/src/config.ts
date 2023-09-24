import * as crypto from 'crypto';

export const appSecret =
  process.env.APP_SECRET ?? crypto.randomBytes(32).toString('base64url');

export const flag = process.env.FLAG as string;
if (!flag) {
  throw Error('Flag was not found!');
}

export const flagId = 'f9faaa12-bab4-46f9-9789-7dd4f139e017';
