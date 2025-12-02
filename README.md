# Crossplane Function SDK for TypeScript

A TypeScript SDK for building [Crossplane Composition Functions](https://docs.crossplane.io/latest/concepts/composition-functions/). This SDK provides type-safe interfaces and utilities for creating functions that generate and manage Crossplane resources.

## Overview

This SDK can be used in two ways:

1. **As an importable library**: Install and import into your own projects (recommended for users)
2. **As a development base**: Clone and modify this repository directly

For detailed usage instructions on importing this SDK into your projects, see [USAGE.md](USAGE.md).

## Quick Start (Using as an Importable SDK)

### Installation

```bash
npm install function-sdk-typescript
```

### Creating Your Function

Implement the `FunctionHandler` interface:

```typescript
import type { FunctionHandler, RunFunctionRequest, RunFunctionResponse, Logger } from "function-sdk-typescript";
import { to, normal, setDesiredComposedResources, getDesiredComposedResources, Resource } from "function-sdk-typescript";

export class MyFunction implements FunctionHandler {
    async RunFunction(req: RunFunctionRequest, logger?: Logger): Promise<RunFunctionResponse> {
        let rsp = to(req);
        let dcds = getDesiredComposedResources(req);

        // Your function logic here
        dcds["my-resource"] = Resource.fromJSON({
            resource: {
                apiVersion: "v1",
                kind: "ConfigMap",
                metadata: { name: "my-config" },
                data: { key: "value" }
            }
        });

        rsp = setDesiredComposedResources(rsp, dcds);
        normal(rsp, "Function completed");
        return rsp;
    }
}
```

See [USAGE.md](USAGE.md) for complete examples and API documentation.

## Development Setup (For SDK Contributors)

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for building container images)
- protoc (Protocol Buffer compiler) - `brew install protobuf`

### Setup

```bash
npm install
```

### Running the Example Function

Start the function server in development mode:

```bash
npm run build
npm run local-run
```

The function will listen on `0.0.0.0:9443` by default.

### Testing Your Function

After running `npm run local-run` in another terminal, use the Crossplane CLI to
call your local function using `crossplane render`:

```bash
cd example
./render.sh
```

### Basic Function Structure

The main function logic goes in `src/function/function.ts`:

```typescript
import { Resource, RunFunctionRequest, RunFunctionResponse } from "../proto/run_function.js";
import { to, setDesiredComposedResources, normal } from "../response/response.js";
import { getDesiredComposedResources } from "../request/request.js";

export class FunctionRunner {
    async RunFunction(
        req: RunFunctionRequest,
        logger?: Logger,
    ): Promise<RunFunctionResponse> {
        // Initialize response from request
        let rsp = to(req);

        // Get desired composed resources from request
        let dcds = getDesiredComposedResources(req);

        // Create a new resource using plain JSON
        dcds["my-deployment"] = Resource.fromJSON({
            resource: {
                apiVersion: "apps/v1",
                kind: "Deployment",
                metadata: {
                    name: "my-deployment",
                    namespace: "default",
                },
                spec: {
                    replicas: 3,
                    // ... deployment spec
                },
            },
        });

        // Set desired resources in response
        rsp = setDesiredComposedResources(rsp, dcds);

        // Add a result message
        normal(rsp, "Resources created successfully");

        return rsp;
    }
}
```

### Using Kubernetes Models

You can use type-safe Kubernetes models from the `kubernetes-models` package:

```typescript
import { Deployment } from "kubernetes-models/apps/v1";
import { Pod } from "kubernetes-models/v1";

// Create a type-safe Pod
const pod = new Pod({
    metadata: {
        name: "my-pod",
        namespace: "default",
    },
    spec: {
        containers: [{
            name: "app",
            image: "nginx:latest",
        }],
    },
});

// Validate the pod
pod.validate();

// Convert to Resource
dcds["my-pod"] = Resource.fromJSON({
    resource: pod.toJSON()
});
```

### Helper Functions

#### Request Helpers

```typescript
import {
    getObservedCompositeResource,
    getDesiredCompositeResource,
    getDesiredComposedResources,
} from "../request/request.js";

// Get the observed composite resource (XR)
const oxr = getObservedCompositeResource(req);

// Get the desired composite resource
const dxr = getDesiredCompositeResource(req);

// Get desired composed resources
const dcds = getDesiredComposedResources(req);
```

#### Response Helpers

```typescript
import {
    to,
    setDesiredComposedResources,
    normal,
    fatal,
    warning,
} from "../response/response.js";

// Initialize response from request
let rsp = to(req);

// Set desired composed resources (merges with existing)
rsp = setDesiredComposedResources(rsp, dcds);

// Add result messages
normal(rsp, "Success message");
warning(rsp, "Warning message");
fatal(rsp, "Fatal error message");
```

### Error Handling

```typescript
try {
    // Your function logic
} catch (error) {
    fatal(rsp, error instanceof Error ? error.message : String(error));
    return rsp;
}
```

## Building and Deployment

### Build TypeScript

```bash
npm run build
```

### Build Docker Image

**note** : package building will move the the template repo.

```bash
npm run docker-build
```

### Build Crossplane Package

```bash
npm run xpkg-build
```

### Push Package

```bash
npm run xpkg-push
```

## Development

### Generating Protobuf Code

This repo uses the Protobuf definitions located at <https://github.com/crossplane/crossplane/tree/main/proto/fn>. If this upstream definition is updated, it can be copied into this repo
and the files regenerated.

To regenerate TypeScript code from the Protobuf definitions, run:

```bash
./scripts/protoc-gen.sh
```

This uses ts-proto to generate:

- Type definitions from protobuf messages
- gRPC service stubs for the FunctionRunner service

### Local Development Workflow

1. Make changes to `src/function/function.ts`
2. Build: `npm run build`
3. Run: `npm run local-run`
4. Test: `cd example && ./render.sh`

### Using with Crossplane

Create a `Function` resource in your cluster:

```yaml
apiVersion: pkg.crossplane.io/v1beta1
kind: Function
metadata:
  name: your-registry-function-typescript
spec:
  package: your-registry/function-typescript:v0.1.0
```

Reference it in your Composition:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: my-composition
spec:
  mode: Pipeline
  pipeline:
  - step: run-typescript-function
    functionRef:
      name: function-typescript
```

### Creating Resources

Resources can be created from Typescript Objects using `Resource.fromJSON()`:

```typescript
// Plain JSON object automatically converted to Struct
Resource.fromJSON({
    resource: {
        apiVersion: "v1",
        kind: "ConfigMap",
        // ... any valid Kubernetes resource
    }
});
```



## Dependencies

### Runtime Dependencies

- `@grpc/grpc-js` - gRPC implementation
- `ts-proto` - TypeScript protobuf code generator
- `ts-deepmerge` - Deep merging utility for resources
- `pino` - Structured logging
- `kubernetes-models` - Type-safe Kubernetes resource models

### Development Dependencies

- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `protoc` - Protocol buffer compiler

## Examples

Check the [example/](example/) directory for:

- Sample Composition and XR definitions
- Test fixtures
- Render scripts

## Troubleshooting

### Port Already in Use

If you see `EADDRINUSE` error, another process is using port 9443:

```bash
lsof -ti:9443 | xargs kill -9
```

### Protobuf Compilation Errors

Ensure protoc is installed and in your PATH:

```bash
protoc --version
```

Should show version 3.x or higher.

### Type Errors After Regenerating Protos

Clean and rebuild:

```bash
npm run clean
./protoc-gen.sh
npm run build
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Apache 2.0

## Resources

- [Crossplane Documentation](https://docs.crossplane.io)
- [Composition Functions](https://docs.crossplane.io/latest/concepts/composition-functions/)
- [Function SDK Guide](https://docs.crossplane.io/knowledge-base/guides/write-a-composition-function-in-go/)
- [ts-proto Documentation](https://github.com/stephenh/ts-proto)
- [kubernetes-models](https://github.com/tommy351/kubernetes-models-ts)
