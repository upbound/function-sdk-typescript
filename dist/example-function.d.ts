import { RunFunctionRequest, RunFunctionResponse } from "./proto/run_function.js";
import type { Logger } from "pino";
import type { FunctionHandler } from "./function/function.js";
/**
 * ExampleFunction is a sample implementation showing how to use the SDK
 * This creates a Deployment and Pod as example resources
 */
export declare class ExampleFunction implements FunctionHandler {
    RunFunction(req: RunFunctionRequest, logger?: Logger): Promise<RunFunctionResponse>;
}
//# sourceMappingURL=example-function.d.ts.map