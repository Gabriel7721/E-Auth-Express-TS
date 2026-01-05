import type http from "node:http";
import { WebSocket } from "ws";
export declare function attachWsServer(server: http.Server): import("ws").Server<typeof WebSocket, typeof http.IncomingMessage>;
//# sourceMappingURL=ws.d.ts.map