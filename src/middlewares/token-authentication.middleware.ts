import { NextFunction, Request, Response } from "express";
import { AuthService } from "modules/auth/auth.service";
import { RequestWithUser } from "./auth.interfaces";

export async function authenticateTokenMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  const authHeader = req.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1] || "";
  if (token.length === 0) {
    return res.sendStatus(401);
  }

  let user;
  const authService = new AuthService();
  try {
    user = await authService.getUserFromToken(token);
  } catch {
    return res.sendStatus(403);
  }

  (<unknown>req as RequestWithUser).user = user;

  next();
}
