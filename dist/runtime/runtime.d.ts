import * as grpc from "@grpc/grpc-js";
import type { Logger } from "pino";
import { FunctionRunner } from "../function/function.js";
export interface ServerOptions {
    address: string;
    insecure?: boolean;
    debug?: boolean;
    tlsServerCertsDir?: string;
}
export declare function getCredentials(opts?: ServerOptions): grpc.ServerCredentials;
export declare function newGrpcServer(functionRunner: FunctionRunner, logger: Logger): grpc.Server;
export declare function startServer(server: grpc.Server, opts: ServerOptions, logger: Logger): grpc.Server;
//# sourceMappingURL=runtime.d.ts.map