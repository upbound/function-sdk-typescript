import { Resource, RunFunctionRequest, RunFunctionResponse } from "../proto/run_function.js";
import { Duration } from "../proto/google/protobuf/duration.js";
export declare function to(req: RunFunctionRequest, ttl?: Duration): RunFunctionResponse;
type NamedResource = {
    name: string;
    resource: Resource;
};
export declare function updateDesiredComposedResources(cds: {
    [key: string]: Resource;
}, res: NamedResource): {
    [key: string]: Resource;
};
export declare function fatal(rsp: RunFunctionResponse, message: string): RunFunctionResponse;
export declare function normal(rsp: RunFunctionResponse, message: string): void;
export declare function warning(rsp: RunFunctionResponse, message: string): void;
export declare function setDesiredComposedResources(rsp: RunFunctionResponse, dcds: {
    [key: string]: Resource;
}): RunFunctionResponse;
export declare function update(src: Resource, tgt: Resource): Resource;
export declare function setDesiredCompositeStatus({ rsp, status }: {
    rsp: RunFunctionResponse;
    status: {
        [key: string]: any;
    };
}): RunFunctionResponse;
export {};
//# sourceMappingURL=response.d.ts.map