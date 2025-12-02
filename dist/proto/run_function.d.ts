import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallOptions, type ChannelCredentials, Client, type ClientOptions, type ClientUnaryCall, type handleUnaryCall, type Metadata, type ServiceError, type UntypedServiceImplementation } from "@grpc/grpc-js";
import { Duration } from "./google/protobuf/duration.js";
export declare const protobufPackage = "apiextensions.fn.proto.v1";
/** Ready indicates whether a resource should be considered ready. */
export declare enum Ready {
    READY_UNSPECIFIED = 0,
    /** READY_TRUE - True means the resource has been observed to be ready. */
    READY_TRUE = 1,
    /** READY_FALSE - False means the resource has not been observed to be ready. */
    READY_FALSE = 2,
    UNRECOGNIZED = -1
}
export declare function readyFromJSON(object: any): Ready;
export declare function readyToJSON(object: Ready): string;
/** Severity of function results. */
export declare enum Severity {
    SEVERITY_UNSPECIFIED = 0,
    /**
     * SEVERITY_FATAL - Fatal results are fatal; subsequent functions may run, but the function
     * pipeline run will be considered a failure and the first fatal result will
     * be returned as an error.
     */
    SEVERITY_FATAL = 1,
    /**
     * SEVERITY_WARNING - Warning results are non-fatal; the entire pipeline will run to completion
     * but warning events and debug logs associated with the XR or Operation will
     * be emitted.
     */
    SEVERITY_WARNING = 2,
    /**
     * SEVERITY_NORMAL - Normal results are emitted as normal events and debug logs associated with
     * the XR or operation.
     */
    SEVERITY_NORMAL = 3,
    UNRECOGNIZED = -1
}
export declare function severityFromJSON(object: any): Severity;
export declare function severityToJSON(object: Severity): string;
/** Target of function results and conditions. */
export declare enum Target {
    /** TARGET_UNSPECIFIED - If the target is unspecified, the result targets the XR. */
    TARGET_UNSPECIFIED = 0,
    /**
     * TARGET_COMPOSITE - Target the XR. Results that target the XR should include detailed, advanced
     * information.
     */
    TARGET_COMPOSITE = 1,
    /**
     * TARGET_COMPOSITE_AND_CLAIM - Target the XR and the claim. Results that target the XR and the claim
     * should include only end-user friendly information.
     */
    TARGET_COMPOSITE_AND_CLAIM = 2,
    UNRECOGNIZED = -1
}
export declare function targetFromJSON(object: any): Target;
export declare function targetToJSON(object: Target): string;
export declare enum Status {
    STATUS_CONDITION_UNSPECIFIED = 0,
    STATUS_CONDITION_UNKNOWN = 1,
    STATUS_CONDITION_TRUE = 2,
    STATUS_CONDITION_FALSE = 3,
    UNRECOGNIZED = -1
}
export declare function statusFromJSON(object: any): Status;
export declare function statusToJSON(object: Status): string;
/** A RunFunctionRequest requests that the function be run. */
export interface RunFunctionRequest {
    /** Metadata pertaining to this request. */
    meta: RequestMeta | undefined;
    /**
     * The observed state prior to invocation of a function pipeline. State passed
     * to each function is fresh as of the time the pipeline was invoked, not as
     * of the time each function was invoked.
     */
    observed: State | undefined;
    /**
     * Desired state according to a function pipeline. The state passed to a
     * particular function may have been accumulated by previous functions in the
     * pipeline.
     *
     * Note that the desired state must be a partial object with only the fields
     * that this function (and its predecessors in the pipeline) wants to have set
     * in the object. Copying a non-partial observed state to desired is most
     * likely not what you want to do. Leaving out fields that had been returned
     * as desired before will result in them being deleted from the objects in the
     * cluster.
     */
    desired: State | undefined;
    /**
     * Optional input specific to this function invocation. A JSON representation
     * of the 'input' block of the relevant entry in a function pipeline.
     */
    input?: {
        [key: string]: any;
    } | undefined;
    /**
     * Optional context. Crossplane may pass arbitrary contextual information to a
     * function. A function may also return context in its RunFunctionResponse,
     * and that context will be passed to subsequent functions. Crossplane
     * discards all context returned by the last function in the pipeline.
     */
    context?: {
        [key: string]: any;
    } | undefined;
    /**
     * Optional resources that the function specified in its requirements. Note
     * that resources is a map to Resources, plural. The map key corresponds to
     * the key in a RunFunctionResponse's requirements.extra_resources field. If a
     * function requested extra resources that did not exist, Crossplane sets
     * the map key to an empty Resources message to indicate that it attempted to
     * satisfy the request. This field is only populated when the function uses
     * extra_resources in its requirements.
     *
     * Deprecated: Use required_resources instead.
     *
     * @deprecated
     */
    extraResources: {
        [key: string]: Resources;
    };
    /**
     * Optional credentials that this function may use to communicate with an
     * external system.
     */
    credentials: {
        [key: string]: Credentials;
    };
    /**
     * Optional resources that the function specified in its requirements. Note
     * that resources is a map to Resources, plural. The map key corresponds to
     * the key in a RunFunctionResponse's requirements.resources field. If a
     * function requested required resources that did not exist, Crossplane sets
     * the map key to an empty Resources message to indicate that it attempted to
     * satisfy the request. This field is only populated when the function uses
     * resources in its requirements.
     */
    requiredResources: {
        [key: string]: Resources;
    };
}
export interface RunFunctionRequest_ExtraResourcesEntry {
    key: string;
    value: Resources | undefined;
}
export interface RunFunctionRequest_CredentialsEntry {
    key: string;
    value: Credentials | undefined;
}
export interface RunFunctionRequest_RequiredResourcesEntry {
    key: string;
    value: Resources | undefined;
}
/** Credentials that a function may use to communicate with an external system. */
export interface Credentials {
    /** Credential data loaded by Crossplane, for example from a Secret. */
    credentialData?: CredentialData | undefined;
}
/** CredentialData loaded by Crossplane, for example from a Secret. */
export interface CredentialData {
    data: {
        [key: string]: Buffer;
    };
}
export interface CredentialData_DataEntry {
    key: string;
    value: Buffer;
}
/** Resources represents the state of several Crossplane resources. */
export interface Resources {
    items: Resource[];
}
/** A RunFunctionResponse contains the result of a function run. */
export interface RunFunctionResponse {
    /** Metadata pertaining to this response. */
    meta: ResponseMeta | undefined;
    /**
     * Desired state according to a function pipeline. functions may add desired
     * state, and may mutate or delete any part of the desired state they are
     * concerned with. A function must pass through any part of the desired state
     * that it is not concerned with.
     *
     * Note that the desired state must be a partial object with only the fields
     * that this function (and its predecessors in the pipeline) wants to have set
     * in the object. Copying a non-partial observed state to desired is most
     * likely not what you want to do. Leaving out fields that had been returned
     * as desired before will result in them being deleted from the objects in the
     * cluster.
     */
    desired: State | undefined;
    /** Results of the function run. Results are used for observability purposes. */
    results: Result[];
    /**
     * Optional context to be passed to the next function in the pipeline as part
     * of the RunFunctionRequest. Dropped on the last function in the pipeline.
     */
    context?: {
        [key: string]: any;
    } | undefined;
    /** Requirements that must be satisfied for this function to run successfully. */
    requirements: Requirements | undefined;
    /**
     * Status conditions to be applied to the XR. Conditions may also optionally
     * be applied to the XR's associated claim.
     *
     * Conditions are only used for composition. They're ignored by Operations.
     */
    conditions: Condition[];
    /**
     * Optional output specific to this function invocation.
     *
     * Only Operations use function output. XRs will discard any function output.
     */
    output?: {
        [key: string]: any;
    } | undefined;
}
/** RequestMeta contains metadata pertaining to a RunFunctionRequest. */
export interface RequestMeta {
    /**
     * An opaque string identifying a request. Requests with identical tags will
     * be otherwise identical.
     */
    tag: string;
}
/** Requirements that must be satisfied for a function to run successfully. */
export interface Requirements {
    /**
     * Resources that this function requires. The map key uniquely identifies the
     * group of resources.
     *
     * Deprecated: Use resources instead.
     *
     * @deprecated
     */
    extraResources: {
        [key: string]: ResourceSelector;
    };
    /**
     * Resources that this function requires. The map key uniquely identifies the
     * group of resources.
     */
    resources: {
        [key: string]: ResourceSelector;
    };
}
export interface Requirements_ExtraResourcesEntry {
    key: string;
    value: ResourceSelector | undefined;
}
export interface Requirements_ResourcesEntry {
    key: string;
    value: ResourceSelector | undefined;
}
/** ResourceSelector selects a group of resources, either by name or by label. */
export interface ResourceSelector {
    /** API version of resources to select. */
    apiVersion: string;
    /** Kind of resources to select. */
    kind: string;
    /** Match the resource with this name. */
    matchName?: string | undefined;
    /** Match all resources with these labels. */
    matchLabels?: MatchLabels | undefined;
    /**
     * Match resources in this namespace. Omit namespace to match cluster scoped
     * resources, or to match namespaced resources by labels across all
     * namespaces.
     */
    namespace?: string | undefined;
}
/** MatchLabels defines a set of labels to match resources against. */
export interface MatchLabels {
    labels: {
        [key: string]: string;
    };
}
export interface MatchLabels_LabelsEntry {
    key: string;
    value: string;
}
/** ResponseMeta contains metadata pertaining to a RunFunctionResponse. */
export interface ResponseMeta {
    /**
     * An opaque string identifying the content of the request. Must match the
     * meta.tag of the corresponding RunFunctionRequest.
     */
    tag: string;
    /**
     * Time-to-live of this response. Crossplane will call the function again when
     * the TTL expires. Crossplane may cache the response to avoid calling the
     * function again until the TTL expires.
     */
    ttl?: Duration | undefined;
}
/** State of the XR (XR) and any resources. */
export interface State {
    /** The state of the XR (XR). */
    composite: Resource | undefined;
    /**
     * The state of any other resources. In composition functions these are the
     * composed resources. In operation functions they're arbitrary resources that
     * the operation wants to create or update.
     */
    resources: {
        [key: string]: Resource;
    };
}
export interface State_ResourcesEntry {
    key: string;
    value: Resource | undefined;
}
/** A Resource represents the state of a Kubernetes resource. */
export interface Resource {
    /**
     * The JSON representation of the resource.
     *
     * * Crossplane will set this field in a RunFunctionRequest to the entire
     * observed state of a resource - including its metadata, spec, and status.
     *
     * * A function should set this field in a RunFunctionRequest to communicate
     * the desired state of the resource.
     *
     * * A function may only specify the desired status of a XR - not its metadata
     * or spec. A function should not return desired metadata or spec for a XR.
     * This will be ignored.
     *
     * * A function may not specify the desired status of any other resource -
     * e.g. composed resources. It may only specify their metadata and spec.
     * Status will be ignored.
     */
    resource: {
        [key: string]: any;
    } | undefined;
    /**
     * The resource's connection details.
     *
     * * Crossplane will set this field in a RunFunctionRequest to communicate the
     * the observed connection details of a composite or composed resource.
     *
     * * A function should set this field in a RunFunctionResponse to indicate the
     * desired connection details of the XR.
     *
     * * A function should not set this field in a RunFunctionResponse to indicate
     * the desired connection details of a composed resource. This will be
     * ignored.
     *
     * Connection details are only used for composition. They're ignored by
     * Operations.
     */
    connectionDetails: {
        [key: string]: Buffer;
    };
    /**
     * Ready indicates whether the resource should be considered ready.
     *
     * * Crossplane will never set this field in a RunFunctionRequest.
     *
     * * A function should set this field to READY_TRUE in a RunFunctionResponse
     * to indicate that a desired resource is ready.
     *
     * * A function should set this field to READY_TRUE in a RunFunctionResponse
     * to indicate that a desired XR is ready. This overwrites the standard
     * readiness detection that determines the ready state of the composite by the
     * ready state of the the composed resources.
     *
     * Ready is only used for composition. It's ignored by Operations.
     */
    ready: Ready;
}
export interface Resource_ConnectionDetailsEntry {
    key: string;
    value: Buffer;
}
/** A Result of running a function. */
export interface Result {
    /** Severity of this result. */
    severity: Severity;
    /** Human-readable details about the result. */
    message: string;
    /**
     * Optional PascalCase, machine-readable reason for this result. If omitted,
     * the value will be ComposeResources.
     */
    reason?: string | undefined;
    /** The resources this result targets. */
    target?: Target | undefined;
}
/**
 * Status condition to be applied to the XR. Condition may also optionally be
 * applied to the XR's associated claim. For detailed information on proper
 * usage of status conditions, please see
 * https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties.
 */
export interface Condition {
    /** Type of condition in PascalCase. */
    type: string;
    /** Status of the condition. */
    status: Status;
    /**
     * Reason contains a programmatic identifier indicating the reason for the
     * condition's last transition. Producers of specific condition types may
     * define expected values and meanings for this field, and whether the values
     * are considered a guaranteed API. The value should be a PascalCase string.
     * This field may not be empty.
     */
    reason: string;
    /**
     * Message is a human readable message indicating details about the
     * transition. This may be an empty string.
     */
    message?: string | undefined;
    /** The resources this condition targets. */
    target?: Target | undefined;
}
export declare const RunFunctionRequest: MessageFns<RunFunctionRequest>;
export declare const RunFunctionRequest_ExtraResourcesEntry: MessageFns<RunFunctionRequest_ExtraResourcesEntry>;
export declare const RunFunctionRequest_CredentialsEntry: MessageFns<RunFunctionRequest_CredentialsEntry>;
export declare const RunFunctionRequest_RequiredResourcesEntry: MessageFns<RunFunctionRequest_RequiredResourcesEntry>;
export declare const Credentials: MessageFns<Credentials>;
export declare const CredentialData: MessageFns<CredentialData>;
export declare const CredentialData_DataEntry: MessageFns<CredentialData_DataEntry>;
export declare const Resources: MessageFns<Resources>;
export declare const RunFunctionResponse: MessageFns<RunFunctionResponse>;
export declare const RequestMeta: MessageFns<RequestMeta>;
export declare const Requirements: MessageFns<Requirements>;
export declare const Requirements_ExtraResourcesEntry: MessageFns<Requirements_ExtraResourcesEntry>;
export declare const Requirements_ResourcesEntry: MessageFns<Requirements_ResourcesEntry>;
export declare const ResourceSelector: MessageFns<ResourceSelector>;
export declare const MatchLabels: MessageFns<MatchLabels>;
export declare const MatchLabels_LabelsEntry: MessageFns<MatchLabels_LabelsEntry>;
export declare const ResponseMeta: MessageFns<ResponseMeta>;
export declare const State: MessageFns<State>;
export declare const State_ResourcesEntry: MessageFns<State_ResourcesEntry>;
export declare const Resource: MessageFns<Resource>;
export declare const Resource_ConnectionDetailsEntry: MessageFns<Resource_ConnectionDetailsEntry>;
export declare const Result: MessageFns<Result>;
export declare const Condition: MessageFns<Condition>;
/** A FunctionRunnerService is a function. */
export type FunctionRunnerServiceService = typeof FunctionRunnerServiceService;
export declare const FunctionRunnerServiceService: {
    /** RunFunction runs the function. */
    readonly runFunction: {
        readonly path: "/apiextensions.fn.proto.v1.FunctionRunnerService/RunFunction";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: RunFunctionRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => RunFunctionRequest;
        readonly responseSerialize: (value: RunFunctionResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => RunFunctionResponse;
    };
};
export interface FunctionRunnerServiceServer extends UntypedServiceImplementation {
    /** RunFunction runs the function. */
    runFunction: handleUnaryCall<RunFunctionRequest, RunFunctionResponse>;
}
export interface FunctionRunnerServiceClient extends Client {
    /** RunFunction runs the function. */
    runFunction(request: RunFunctionRequest, callback: (error: ServiceError | null, response: RunFunctionResponse) => void): ClientUnaryCall;
    runFunction(request: RunFunctionRequest, metadata: Metadata, callback: (error: ServiceError | null, response: RunFunctionResponse) => void): ClientUnaryCall;
    runFunction(request: RunFunctionRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: RunFunctionResponse) => void): ClientUnaryCall;
}
export declare const FunctionRunnerServiceClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): FunctionRunnerServiceClient;
    service: typeof FunctionRunnerServiceService;
    serviceName: string;
};
export interface DataLoaderOptions {
    cache?: boolean;
}
export interface DataLoaders {
    rpcDataLoaderOptions?: DataLoaderOptions;
    getDataLoader<T>(identifier: string, constructorFn: () => T): T;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
//# sourceMappingURL=run_function.d.ts.map