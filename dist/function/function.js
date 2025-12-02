import * as grpc from "@grpc/grpc-js";
import { FunctionRunnerServiceService, RunFunctionRequest, RunFunctionResponse, } from "../proto/run_function.js";
import { fatal, to, } from "../response/response.js";
// FunctionRunner implements a function runner that delegates to a user-provided handler
export class FunctionRunner {
    logger;
    handler;
    /**
     * Creates a new FunctionRunner
     * @param handler - User-provided implementation of FunctionHandler
     * @param logger - Optional logger instance
     */
    constructor(handler, logger) {
        this.handler = handler;
        this.logger = logger;
    }
    async RunFunction(req, logger) {
        const startTime = Date.now();
        const log = logger || this.logger;
        try {
            // Delegate to the user-provided handler
            return await this.handler.RunFunction(req, log);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            log?.error({
                error: error instanceof Error ? error.message : String(error),
                duration: `${duration}ms`,
            }, "Function invocation failed");
            // Return a minimal error response
            const rsp = to(req);
            fatal(rsp, error instanceof Error ? error.message : String(error));
            return rsp;
        }
    }
}
// Create gRPC server with FunctionRunner implementation using ts-proto generated service
export function getServer(functionRunner, logger) {
    const server = new grpc.Server();
    // Implement the service using the generated interface
    const implementation = {
        runFunction: (call, callback) => {
            functionRunner.RunFunction(call.request, logger)
                .then((response) => {
                logger.debug("RunFunction succeeded, sending response");
                callback(null, response);
            })
                .catch((error) => {
                logger.error("RunFunction failed:", error);
                callback(error);
            });
        },
    };
    logger.debug(`adding service to grpc server: ${FunctionRunnerServiceService.runFunction.path}`);
    server.addService(FunctionRunnerServiceService, implementation);
    return server;
}
//# sourceMappingURL=function.js.map