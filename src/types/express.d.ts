declare namespace Express {
  interface Request {
    user?: { id: string };
    tokenPayload?: { sub: string; jti: string };
  }
}
