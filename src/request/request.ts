import { Resource, RunFunctionRequest, Resources, Credentials } from "../proto/run_function.js";

/**
 * Retrieves the desired state of the composite resource (XR) from the function request.
 * The composite resource is the top-level resource that composes other resources.
 *
 * @param req - The RunFunctionRequest containing the desired state
 * @returns The desired composite resource, or undefined if not present
 */
export function getDesiredCompositeResource(
    req: RunFunctionRequest,
): Resource | undefined {
    return req.desired?.composite;
}

/**
 * Retrieves the observed state of the composite resource (XR) from the function request.
 * The observed state represents the current actual state of the resource.
 *
 * @param req - The RunFunctionRequest containing the observed state
 * @returns The observed composite resource, or undefined if not present
 */
export function getObservedCompositeResource(
    req: RunFunctionRequest,
): Resource | undefined {
    return req.observed?.composite;
}

/**
 * Retrieves all desired composed resources from the function request.
 * Composed resources are the managed resources created by the composite resource.
 *
 * @param req - The RunFunctionRequest containing the desired state
 * @returns A map of resource names to their desired Resource objects, or an empty object if none exist
 */
export function getDesiredComposedResources(
    req: RunFunctionRequest,
): { [key: string]: Resource } {
    if (req.desired?.resources) {
        return req.desired.resources;
    }
    return {};
}

/**
 * Retrieves all observed composed resources from the function request.
 * The observed state represents the current actual state of the managed resources.
 *
 * @param req - The RunFunctionRequest containing the observed state
 * @returns A map of resource names to their observed Resource objects, or an empty object if none exist
 */
export function getObservedComposedResources(
    req: RunFunctionRequest,
): { [key: string]: Resource } {
    if (req.observed?.resources) {
        return req.observed.resources;
    }
    return {};
}

/**
 * Retrieves the input configuration specific to this function invocation.
 * The input corresponds to the 'input' block in the function pipeline configuration.
 *
 * @param req - The RunFunctionRequest containing the input
 * @returns The function input as a JSON object, or undefined if not present
 */
export function getInput(
    req: RunFunctionRequest,
): { [key: string]: any } | undefined {
    return req.input;
}

/**
 * Retrieves a specific value from the request context by key.
 * Context can be passed between functions in a pipeline and may contain arbitrary data.
 *
 * @param req - The RunFunctionRequest containing the context
 * @param key - The key to lookup in the context
 * @returns A tuple of [value, found] where value is the context value (or undefined) and found indicates if the key exists
 */
export function getContextKey(
    req: RunFunctionRequest,
    key: string,
): [any, boolean] {
    if (req.context && key in req.context) {
        return [req.context[key], true];
    }
    return [undefined, false];
}

/**
 * Retrieves the required resources that were requested by the function.
 * These are additional resources beyond the standard composed resources that the function
 * needs to perform its work. This replaces the deprecated extraResources field.
 *
 * @param req - The RunFunctionRequest containing the required resources
 * @returns A map of resource keys to their Resources objects
 */
export function getRequiredResources(
    req: RunFunctionRequest,
): { [key: string]: Resources } {
    return req.requiredResources || {};
}

/**
 * Retrieves credentials by name from the request.
 * Credentials are provided by Crossplane and may be used to communicate with external systems.
 *
 * @param req - The RunFunctionRequest containing credentials
 * @param name - The name of the credentials to retrieve
 * @returns The Credentials object, or undefined if not found
 */
export function getCredentials(
    req: RunFunctionRequest,
    name: string,
): Credentials | undefined {
    if (req.credentials && name in req.credentials) {
        return req.credentials[name];
    }
    return undefined;
}
