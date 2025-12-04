/**
 * Request utilities for working with RunFunctionRequest
 *
 * This module provides helper functions to extract data from RunFunctionRequest objects,
 * including composite resources, composed resources, input configuration, context values,
 * required resources, and credentials.
 */

import { Resource, RunFunctionRequest, Resources, Credentials } from "../proto/run_function.js";

/**
 * Get the desired composite resource (XR) from the request.
 *
 * The desired composite resource represents the intended state of the composite resource
 * as determined by the function pipeline up to this point.
 *
 * @param req - The RunFunctionRequest containing the desired state
 * @returns The desired composite Resource, or undefined if not present
 *
 * @example
 * ```typescript
 * const dxr = getDesiredCompositeResource(req);
 * if (dxr?.resource) {
 *   console.log("Composite resource name:", dxr.resource.metadata.name);
 * }
 * ```
 */
export function getDesiredCompositeResource(req: RunFunctionRequest): Resource | undefined {
    return req.desired?.composite;
}

/**
 * Get the observed composite resource (XR) from the request.
 *
 * The observed composite resource represents the actual current state of the composite
 * resource as observed in the cluster. This includes the resource's metadata, spec, and status.
 *
 * @param req - The RunFunctionRequest containing the observed state
 * @returns The observed composite Resource, or undefined if not present
 *
 * @example
 * ```typescript
 * const oxr = getObservedCompositeResource(req);
 * if (oxr?.resource?.status) {
 *   console.log("Current status:", oxr.resource.status);
 * }
 * ```
 */
export function getObservedCompositeResource(req: RunFunctionRequest): Resource | undefined {
    return req.observed?.composite;
}

/**
 * Get the desired composed resources from the request.
 *
 * Desired composed resources represent the intended state of resources that are part of
 * this composition. These are the resources that the function pipeline wants to create
 * or update. The map key is the resource name used to identify it in the pipeline.
 *
 * @param req - The RunFunctionRequest containing desired composed resources
 * @returns A map of resource names to Resource objects, or empty object if none exist
 *
 * @example
 * ```typescript
 * const dcds = getDesiredComposedResources(req);
 * for (const [name, resource] of Object.entries(dcds)) {
 *   console.log(`Resource ${name}: ${resource.resource?.kind}`);
 * }
 * ```
 */
export function getDesiredComposedResources(req: RunFunctionRequest): { [key: string]: Resource } {
    if (req.desired?.resources) {
        return req.desired?.resources;
    }
    return {};
}

/**
 * Get the observed composed resources from the request.
 *
 * Observed composed resources represent the actual current state of resources that are
 * part of this composition. This includes their current status, connection details,
 * and complete resource state as observed in the cluster.
 *
 * @param req - The RunFunctionRequest containing observed composed resources
 * @returns A map of resource names to Resource objects with connection details, or empty object if none exist
 *
 * @example
 * ```typescript
 * const ocds = getObservedComposedResources(req);
 * for (const [name, resource] of Object.entries(ocds)) {
 *   if (resource.connectionDetails) {
 *     console.log(`Resource ${name} has connection details`);
 *   }
 * }
 * ```
 */
export function getObservedComposedResources(req: RunFunctionRequest): { [key: string]: Resource } {
    if (req.observed?.resources) {
        return req.observed?.resources;
    }
    return {};
}

/**
 * Get the input configuration from the request.
 *
 * The input contains function-specific configuration specified in the Composition's
 * function pipeline. This is the data from the 'input' block of the function's
 * pipeline entry.
 *
 * @param req - The RunFunctionRequest containing input configuration
 * @returns The input object, or undefined if not present
 *
 * @example
 * ```typescript
 * const input = getInput(req);
 * if (input) {
 *   const replicas = input.replicas || 3;
 *   console.log("Desired replicas:", replicas);
 * }
 * ```
 */
export function getInput(req: RunFunctionRequest): { [key: string]: any } | undefined {
    return req.input;
}

/**
 * Get a value from the request context by key.
 *
 * Context is used to pass arbitrary data between functions in a pipeline.
 * Functions can read context set by previous functions and set context for
 * subsequent functions. Crossplane discards all context after the last function
 * in the pipeline completes.
 *
 * @param req - The RunFunctionRequest containing context data
 * @param key - The context key to retrieve
 * @returns A tuple of [value, exists] where exists indicates if the key was found
 *
 * @example
 * ```typescript
 * const [dbEndpoint, exists] = getContextKey(req, "database-endpoint");
 * if (exists) {
 *   console.log("Database endpoint:", dbEndpoint);
 * } else {
 *   console.log("Database endpoint not set by previous function");
 * }
 * ```
 */
export function getContextKey(req: RunFunctionRequest, key: string): [any, boolean] {
    if (req.context && key in req.context) {
        return [req.context[key], true];
    }
    return [undefined, false];
}

/**
 * Get required resources from the request.
 *
 * Required resources are resources that the function specified it needs in its
 * requirements. These are populated by Crossplane based on the ResourceSelector
 * specified in the function's requirements. The map key corresponds to the key
 * in the RunFunctionResponse's requirements.resources field.
 *
 * @param req - The RunFunctionRequest containing required resources
 * @returns A map of required resources by name, or empty object if none exist
 *
 * @example
 * ```typescript
 * const required = getRequiredResources(req);
 * const secrets = required["secrets"];
 * if (secrets?.items) {
 *   console.log(`Found ${secrets.items.length} secrets`);
 * }
 * ```
 */
export function getRequiredResources(req: RunFunctionRequest): { [key: string]: Resources } {
    return req.requiredResources || {};
}

/**
 * Get extra resources from the request.
 *
 * @deprecated Use getRequiredResources instead. This field is deprecated in favor
 * of requiredResources and will be removed in a future version.
 *
 * Extra resources are resources that the function specified it needs in its
 * requirements using the deprecated extra_resources field.
 *
 * @param req - The RunFunctionRequest containing extra resources
 * @returns A map of extra resources by name, or empty object if none exist
 */
export function getExtraResources(req: RunFunctionRequest): { [key: string]: Resources } {
    return req.extraResources || {};
}

/**
 * Get credentials by name from the request.
 *
 * Credentials are provided by Crossplane and typically loaded from Secrets.
 * Functions can use these credentials to authenticate with external systems.
 * The credentials data is a map of keys to binary data (Buffer).
 *
 * @param req - The RunFunctionRequest containing credentials
 * @param name - The credential name to retrieve
 * @returns The Credentials object containing credential data
 * @throws Error if the specified credentials are not found
 *
 * @example
 * ```typescript
 * try {
 *   const creds = getCredentials(req, "aws-credentials");
 *   const accessKey = creds.credentialData?.data["access-key"];
 *   if (accessKey) {
 *     console.log("Access key found");
 *   }
 * } catch (error) {
 *   console.error("Credentials not found:", error.message);
 * }
 * ```
 */
export function getCredentials(req: RunFunctionRequest, name: string): Credentials {
    const creds = req.credentials?.[name];
    if (!creds) {
        throw new Error(`credentials "${name}" not found`);
    }
    return creds;
}
