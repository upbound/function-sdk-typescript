import { Resource, RunFunctionRequest } from "../proto/run_function.js";
export declare function getDesiredCompositeResource(req: RunFunctionRequest): Resource | undefined;
export declare function getObservedCompositeResource(req: RunFunctionRequest): Resource | undefined;
export declare function getDesiredComposedResources(req: RunFunctionRequest): {
    [key: string]: Resource;
};
//# sourceMappingURL=request.d.ts.map