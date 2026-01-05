import { describe, it, expect } from 'vitest';
import {
    getDesiredCompositeResource,
    getObservedCompositeResource,
    getDesiredComposedResources,
    getObservedComposedResources,
    getInput,
    getContextKey,
    getRequiredResources,
    getCredentials,
} from './request.js';
import type { RunFunctionRequest, Resource, Resources, Credentials } from '../proto/run_function.js';

describe('getDesiredCompositeResource', () => {
    it('should return undefined when no desired composite exists', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getDesiredCompositeResource(req);
        expect(result).toBeUndefined();
    });

    it('should return undefined when desired exists but composite is missing', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: {
                composite: undefined,
                resources: {},
            },
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getDesiredCompositeResource(req);
        expect(result).toBeUndefined();
    });

    it('should return the desired composite resource when it exists', () => {
        const compositeResource: Resource = {
            resource: {
                apiVersion: 'example.org/v1',
                kind: 'XR',
                metadata: {
                    name: 'test-xr',
                },
            },
            connectionDetails: {
                'password': Buffer.from('secret'),
            },
            ready: 0,
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: {
                composite: compositeResource,
                resources: {},
            },
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getDesiredCompositeResource(req);
        expect(result).toEqual(compositeResource);
        expect(result?.resource?.metadata?.name).toBe('test-xr');
    });
});

describe('getObservedCompositeResource', () => {
    it('should return undefined when no observed composite exists', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getObservedCompositeResource(req);
        expect(result).toBeUndefined();
    });

    it('should return the observed composite resource when it exists', () => {
        const compositeResource: Resource = {
            resource: {
                apiVersion: 'example.org/v1',
                kind: 'XR',
                metadata: {
                    name: 'observed-xr',
                },
            },
            connectionDetails: {
                'username': Buffer.from('admin'),
            },
            ready: 0,
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: {
                composite: compositeResource,
                resources: {},
            },
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getObservedCompositeResource(req);
        expect(result).toEqual(compositeResource);
        expect(result?.resource?.metadata?.name).toBe('observed-xr');
    });
});

describe('getDesiredComposedResources', () => {
    it('should return empty object when no desired composed resources exist', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getDesiredComposedResources(req);
        expect(result).toEqual({});
        expect(Object.keys(result).length).toBe(0);
    });

    it('should return empty object when desired exists but resources is undefined', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: {
                composite: undefined,
                resources: {},
            },
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getDesiredComposedResources(req);
        expect(result).toEqual({});
    });

    it('should return desired composed resources when they exist', () => {
        const resources: { [key: string]: Resource } = {
            'bucket': {
                resource: {
                    apiVersion: 's3.aws.upbound.io/v1beta1',
                    kind: 'Bucket',
                    metadata: {
                        name: 'my-bucket',
                    },
                },
                connectionDetails: {},
                ready: 2, // READY_TRUE
            },
            'database': {
                resource: {
                    apiVersion: 'rds.aws.upbound.io/v1beta1',
                    kind: 'Instance',
                    metadata: {
                        name: 'my-db',
                    },
                },
                connectionDetails: {},
                ready: 2,
            },
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: {
                composite: undefined,
                resources,
            },
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getDesiredComposedResources(req);
        expect(result).toEqual(resources);
        expect(Object.keys(result).length).toBe(2);
        expect(result['bucket']?.resource?.kind).toBe('Bucket');
        expect(result['database']?.resource?.kind).toBe('Instance');
    });
});

describe('getObservedComposedResources', () => {
    it('should return empty object when no observed composed resources exist', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getObservedComposedResources(req);
        expect(result).toEqual({});
        expect(Object.keys(result).length).toBe(0);
    });

    it('should return observed composed resources when they exist', () => {
        const resources: { [key: string]: Resource } = {
            'server': {
                resource: {
                    apiVersion: 'ec2.aws.upbound.io/v1beta1',
                    kind: 'Instance',
                    metadata: {
                        name: 'my-server',
                        annotations: {
                            'crossplane.io/external-name': 'i-1234567890abcdef0',
                        },
                    },
                },
                connectionDetails: {
                    'endpoint': Buffer.from('https://server.example.com'),
                },
                ready: 0,
            },
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: {
                composite: undefined,
                resources,
            },
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getObservedComposedResources(req);
        expect(result).toEqual(resources);
        expect(Object.keys(result).length).toBe(1);
        expect(result['server']?.resource?.metadata?.name).toBe('my-server');
    });
});

describe('getInput', () => {
    it('should return undefined when no input exists', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getInput(req);
        expect(result).toBeUndefined();
    });

    it('should return the input configuration when it exists', () => {
        const input = {
            apiVersion: 'function.example.org/v1beta1',
            kind: 'Input',
            spec: {
                region: 'us-west-2',
                replicas: 3,
            },
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getInput(req);
        expect(result).toEqual(input);
        expect(result?.spec?.region).toBe('us-west-2');
        expect(result?.spec?.replicas).toBe(3);
    });

    it('should handle empty input object', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: {},
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getInput(req);
        expect(result).toEqual({});
    });
});

describe('getContextKey', () => {
    it('should return [undefined, false] when context does not exist', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const [value, found] = getContextKey(req, 'apiserver-kind');
        expect(value).toBeUndefined();
        expect(found).toBe(false);
    });

    it('should return [undefined, false] when key does not exist in context', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: {
                'existing-key': 'some-value',
            },
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const [value, found] = getContextKey(req, 'non-existent-key');
        expect(value).toBeUndefined();
        expect(found).toBe(false);
    });

    it('should return [value, true] when key exists in context', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: {
                'apiserver-kind': 'ConfigMap',
                'apiserver-name': 'my-config',
                'custom-data': {
                    nested: {
                        value: 42,
                    },
                },
            },
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const [kind, kindFound] = getContextKey(req, 'apiserver-kind');
        expect(kind).toBe('ConfigMap');
        expect(kindFound).toBe(true);

        const [name, nameFound] = getContextKey(req, 'apiserver-name');
        expect(name).toBe('my-config');
        expect(nameFound).toBe(true);

        const [data, dataFound] = getContextKey(req, 'custom-data');
        expect(data).toEqual({ nested: { value: 42 } });
        expect(dataFound).toBe(true);
    });

    it('should handle context with null or undefined values', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: {
                'null-value': null,
                'undefined-value': undefined,
            },
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const [nullValue, nullFound] = getContextKey(req, 'null-value');
        expect(nullValue).toBeNull();
        expect(nullFound).toBe(true);

        const [undefinedValue, undefinedFound] = getContextKey(req, 'undefined-value');
        expect(undefinedValue).toBeUndefined();
        expect(undefinedFound).toBe(true);
    });
});

describe('getRequiredResources', () => {
    it('should return empty object when no required resources exist', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        const result = getRequiredResources(req);
        expect(result).toEqual({});
        expect(Object.keys(result).length).toBe(0);
    });

    it('should return required resources for cluster-scoped resources', () => {
        const resources: Resources = {
            items: [
                {
                    resource: {
                        apiVersion: 'v1',
                        kind: 'Namespace',
                        metadata: {
                            name: 'production',
                        },
                    },
                    connectionDetails: {},
                    ready: 0,
                },
            ],
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {
                'namespaces': resources,
            },
        };

        const result = getRequiredResources(req);
        expect(Object.keys(result).length).toBe(1);
        expect(result['namespaces']).toEqual(resources);
        expect(result['namespaces']?.items[0]?.resource?.kind).toBe('Namespace');
    });

    it('should return required resources for namespace-scoped resources', () => {
        const resources: Resources = {
            items: [
                {
                    resource: {
                        apiVersion: 'v1',
                        kind: 'ConfigMap',
                        metadata: {
                            name: 'app-config',
                            namespace: 'production',
                        },
                    },
                    connectionDetails: {},
                    ready: 0,
                },
                {
                    resource: {
                        apiVersion: 'v1',
                        kind: 'Secret',
                        metadata: {
                            name: 'app-secret',
                            namespace: 'production',
                        },
                    },
                    connectionDetails: {},
                    ready: 0,
                },
            ],
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {
                'config-and-secrets': resources,
            },
        };

        const result = getRequiredResources(req);
        expect(Object.keys(result).length).toBe(1);
        expect(result['config-and-secrets']?.items.length).toBe(2);
        expect(result['config-and-secrets']?.items[0]?.resource?.kind).toBe('ConfigMap');
        expect(result['config-and-secrets']?.items[1]?.resource?.kind).toBe('Secret');
    });

    it('should handle multiple required resource groups', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {
                'group1': { items: [] },
                'group2': { items: [] },
                'group3': { items: [] },
            },
        };

        const result = getRequiredResources(req);
        expect(Object.keys(result).length).toBe(3);
        expect(result['group1']).toBeDefined();
        expect(result['group2']).toBeDefined();
        expect(result['group3']).toBeDefined();
    });
});

describe('getCredentials', () => {
    it('should throw error when no credentials exist', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {},
            requiredResources: {},
        };

        expect(() => getCredentials(req, 'aws-creds')).toThrow('credentials "aws-creds" not found');
    });

    it('should throw error when credential name does not exist', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {
                'azure-creds': {
                    credentialData: {
                        data: {
                            'clientId': Buffer.from('azure-client-id'),
                        },
                    },
                },
            },
            requiredResources: {},
        };

        expect(() => getCredentials(req, 'aws-creds')).toThrow('credentials "aws-creds" not found');
    });

    it('should return credentials when they exist', () => {
        const awsCreds: Credentials = {
            credentialData: {
                data: {
                    'access_key_id': Buffer.from('AKIAIOSFODNN7EXAMPLE'),
                    'secret_access_key': Buffer.from('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'),
                },
            },
        };

        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {
                'aws-creds': awsCreds,
            },
            requiredResources: {},
        };

        const result = getCredentials(req, 'aws-creds');
        expect(result).toEqual(awsCreds);
        expect(result?.credentialData?.data['access_key_id']).toEqual(Buffer.from('AKIAIOSFODNN7EXAMPLE'));
    });

    it('should handle multiple credentials', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {
                'aws-creds': {
                    credentialData: {
                        data: {
                            'key': Buffer.from('aws-key'),
                        },
                    },
                },
                'gcp-creds': {
                    credentialData: {
                        data: {
                            'json': Buffer.from('{"type":"service_account"}'),
                        },
                    },
                },
            },
            requiredResources: {},
        };

        const awsResult = getCredentials(req, 'aws-creds');
        expect(awsResult).toBeDefined();
        expect(awsResult?.credentialData?.data['key']).toEqual(Buffer.from('aws-key'));

        const gcpResult = getCredentials(req, 'gcp-creds');
        expect(gcpResult).toBeDefined();
        expect(gcpResult?.credentialData?.data['json']).toEqual(Buffer.from('{"type":"service_account"}'));
    });

    it('should handle credentials with empty data', () => {
        const req: RunFunctionRequest = {
            meta: undefined,
            observed: undefined,
            desired: undefined,
            input: undefined,
            context: undefined,
            extraResources: {},
            credentials: {
                'empty-creds': {
                    credentialData: {
                        data: {},
                    },
                },
            },
            requiredResources: {},
        };

        const result = getCredentials(req, 'empty-creds');
        expect(result).toBeDefined();
        expect(result?.credentialData?.data).toEqual({});
    });
});
