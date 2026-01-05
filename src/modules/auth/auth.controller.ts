import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.js";
import { env } from "../../config/env.js";
import { ok } from "../../utils/http.js";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: env.refreshTokenTtlSeconds * 1000,
    path: "/api/auth",
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(env.refreshCookieName, {
    path: "/api/auth",
  });
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;

    const input = {
      email,
      password,
      ...(userAgent !== undefined ? { userAgent: userAgent } : {}),
      ...(ip !== undefined ? { ip } : {}),
    };

    const { accessToken, refreshToken } = await this.authService.login(input);

    setRefreshCookie(res, refreshToken);
    res.json(ok({ accessToken }));
  };

  // POST /api/auth/refresh
  refresh = async (req: Request, res: Response) => {
    const rt = req.cookies?.[env.refreshCookieName];
    if (!rt) {
      // refresh không có cookie => unauthorized
      res
        .status(401)
        .json({ error: { message: "Missing refresh token cookie" } });
      return;
    }

    const { accessToken, refreshToken } = await this.authService.refresh(rt);
    setRefreshCookie(res, refreshToken);
    res.json(ok({ accessToken }));
  };

  // POST /api/auth/logout
  logout = async (req: Request, res: Response) => {
    const rt = req.cookies?.[env.refreshCookieName];
    if (rt) await this.authService.logout(rt);
    clearRefreshCookie(res);
    res.json(ok({ loggedOut: true }));
  };
}
