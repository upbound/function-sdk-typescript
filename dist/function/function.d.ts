import * as grpc from "@grpc/grpc-js";
import { RunFunctionRequest, RunFunctionResponse } from "../proto/run_function.js";
import type { Logger } from "pino";
export interface FunctionHandler {
    /**
     * RunFunction is called for each function invocation
     * @param req - The RunFunctionRequest containing observed and desired state
     * @param logger - Optional logger instance for structured logging
     * @returns Promise<RunFunctionResponse> - The response containing desired state and results
     */
    RunFunction(req: RunFunctionRequest, logger?: Logger): Promise<RunFunctionResponse>;
}
export declare class FunctionRunner {
    private logger?;
    private handler;
    /**
     * Creates a new FunctionRunner
     * @param handler - User-provided implementation of FunctionHandler
     * @param logger - Optional logger instance
     */
    constructor(handler: FunctionHandler, logger?: Logger);
    RunFunction(req: RunFunctionRequest, logger?: Logger): Promise<RunFunctionResponse>;
}
export declare function getServer(functionRunner: FunctionRunner, logger: Logger): grpc.Server;
//# sourceMappingURL=function.d.ts.map