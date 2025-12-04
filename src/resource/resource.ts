// Resource utilities for working with Kubernetes resources and protobuf conversion
import { Resource, Ready } from "../proto/run_function.js";

// Type aliases for better readability
export type ConnectionDetails = { [key: string]: Buffer };

/**
 * Composite represents a Crossplane composite resource (XR) with its state
 */
export interface Composite {
    resource: Resource;
    connectionDetails: ConnectionDetails;
    ready: Ready;
}

/**
 * ObservedComposed represents the observed state of a composed resource
 */
export interface ObservedComposed {
    resource: Resource;
    connectionDetails: ConnectionDetails;
}

/**
 * DesiredComposed represents the desired state of a composed resource
 */
export interface DesiredComposed {
    resource: Resource;
    ready: Ready;
}

/**
 * Create a new empty DesiredComposed resource
 */
export function newDesiredComposed(): DesiredComposed {
    return {
        resource: Resource.fromJSON({}),
        ready: Ready.READY_UNSPECIFIED,
    };
}

/**
 * Convert a protobuf Struct to a Kubernetes object (plain JavaScript object)
 * This is a more efficient conversion that avoids JSON round-trips when possible
 *
 * @param struct - The protobuf Struct to convert
 * @returns A plain JavaScript object representing the Kubernetes resource
 */
export function asObject(struct: { [key: string]: any } | undefined): { [key: string]: any } {
    if (!struct) {
        return {};
    }

    // The struct is already a plain object in our TypeScript implementation
    // In the Go SDK, this does actual protobuf conversion
    return struct;
}

/**
 * Convert a Kubernetes object to a protobuf Struct
 * This is used when creating Resource objects from plain JavaScript objects
 *
 * @param obj - The plain JavaScript object to convert
 * @returns A protobuf Struct representation
 */
export function asStruct(obj: { [key: string]: any }): { [key: string]: any } {
    // In our TypeScript implementation, this is essentially a pass-through
    // The actual conversion happens in the protobuf serialization layer
    return obj;
}

/**
 * Helper function for tests: Convert an object to a Struct, panics on failure
 * Only use this in test code
 *
 * @param obj - The object to convert
 * @returns A Struct representation
 * @throws Error if conversion fails
 */
export function mustStructObject(obj: { [key: string]: any }): { [key: string]: any } {
    try {
        return asStruct(obj);
    } catch (error) {
        throw new Error(`Failed to convert object to struct: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Helper function for tests: Parse a JSON string into a Struct, panics on failure
 * Only use this in test code
 *
 * @param json - The JSON string to parse
 * @returns A Struct representation
 * @throws Error if parsing or conversion fails
 */
export function mustStructJSON(json: string): { [key: string]: any } {
    try {
        const obj = JSON.parse(json);
        return asStruct(obj);
    } catch (error) {
        throw new Error(`Failed to parse JSON to struct: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Create a Resource from a plain JavaScript object
 * This is a convenience wrapper around Resource.fromJSON
 *
 * @param obj - The resource object
 * @param connectionDetails - Optional connection details
 * @param ready - Optional ready status
 * @returns A Resource
 */
export function fromObject(
    obj: { [key: string]: any },
    connectionDetails?: ConnectionDetails,
    ready?: Ready
): Resource {
    return Resource.fromJSON({
        resource: obj,
        connectionDetails: connectionDetails || {},
        ready: ready !== undefined ? ready : Ready.READY_UNSPECIFIED,
    });
}

/**
 * Get the resource object from a Resource
 * This extracts the plain JavaScript object from the Resource wrapper
 *
 * @param resource - The Resource to extract from
 * @returns The plain JavaScript object, or undefined if not present
 */
export function toObject(resource: Resource): { [key: string]: any } | undefined {
    return resource.resource;
}
