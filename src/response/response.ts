import {
  Resource,
  RunFunctionRequest,
  RunFunctionResponse,
  Severity,
} from "../proto/run_function.js";
import { Duration } from "../proto/google/protobuf/duration.js";
import { merge } from "ts-deepmerge";

const DEFAULT_TTL: Duration = { seconds: 60, nanos: 0 };

// to copies the request's tag, desired resources, and context is automatically copied to
// the response. Using response.to is a good pattern to ensure proper initialization
export function to(req: RunFunctionRequest, ttl?: Duration): RunFunctionResponse {
  // Initialize desired state if needed
  let desired = req.desired;

  // If desired is not set, initialize it
  if (!desired) {
    desired = { composite: undefined, resources: {} };
  }

  // If composite is explicitly null, initialize it as an empty resource
  if (desired.composite === null) {
    desired.composite = Resource.fromJSON({});
  }

  return {
    conditions: [],
    context: req.context,
    desired: desired,
    meta: { tag: req.meta?.tag || "", ttl: ttl || DEFAULT_TTL },
    requirements: undefined,
    results: [],
  };
}

type NamedResource = {
  name: string;
  resource: Resource;
};

// addDesiredComposedResource adds desired composed resources to the response
export function updateDesiredComposedResources(
  cds: { [key: string]: Resource },
  res: NamedResource,
): { [key: string]: Resource } {
  cds[res.name] = res.resource;
  return cds;
}

// fatal adds a fatal result to the response.
export function fatal(
  rsp: RunFunctionResponse,
  message: string,
): RunFunctionResponse {
  if (rsp && rsp.results) {
    rsp.results.push({
      severity: Severity.SEVERITY_FATAL,
      message: message,
    });
  }
  return rsp;
}

// fatal adds a normal result to the response.
export function normal(rsp: RunFunctionResponse, message: string) {
  if (rsp && rsp.results) {
    rsp.results.push({
      severity: Severity.SEVERITY_NORMAL,
      message: message,
    });
  }
}

// fatal adds a warning result to the response.
export function warning(rsp: RunFunctionResponse, message: string) {
  if (rsp && rsp.results) {
    rsp.results.push({
      severity: Severity.SEVERITY_NORMAL,
      message: message,
    });
  }
}

// SetDesiredComposedResources sets the desired composed resources in the
// supplied response. We use merge to overwrite any existing values.
// If desired or resources don't exist, they will be initialized.
export function setDesiredComposedResources(
  rsp: RunFunctionResponse,
  dcds: { [key: string]: Resource },
): RunFunctionResponse {
  // Ensure desired state exists
  if (!rsp.desired) {
    rsp.desired = { composite: undefined, resources: {} };
  }

  // Merge the new resources with existing ones
  rsp.desired.resources = merge(rsp.desired.resources || {}, dcds) as {
    [key: string]: Resource;
  };

  return rsp;
}

// update a Resource
// TODO: Can we make this Generic?
export function update(src: Resource, tgt: Resource): Resource {
  return merge(tgt, src) as Resource;
}

// setDesiredCompositeStatus updates the Composite status
export function setDesiredCompositeStatus(
{ rsp, status }: { rsp: RunFunctionResponse; status: { [key: string]: any; }; },
): RunFunctionResponse {
  if (rsp.desired?.composite?.resource) {
    rsp.desired.composite.resource = merge(rsp.desired.composite.resource, {
      "status": status,
    }) as { [key: string]: any };
  }
  return rsp;
}
