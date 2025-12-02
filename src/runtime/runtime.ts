import * as grpc from "@grpc/grpc-js";
import type { Logger } from "pino";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FunctionRunner, getServer } from "../function/function.js";

// serverOptions are options for the gRPC server
export interface ServerOptions {
    // port is the address to listen on default is ":9443"
    address: string;
    // insecure indicates if TLS is used or not, defaults to false
    insecure?: boolean;
    // debug turns on debug logging
    debug?: boolean;
    // tlsCertsDir is the filesystem directory containing TLS Certificates
    // ignored if insecure is set to true
    tlsServerCertsDir?: string;
}

// getCredentials creates gRPC ServerCredentials from TLS files on the filesystem
export function getCredentials(
    opts?: ServerOptions,
): grpc.ServerCredentials {
    if (opts?.insecure || opts?.tlsServerCertsDir === "" || opts?.tlsServerCertsDir === undefined ) {
        return grpc.ServerCredentials.createInsecure();
    }
    try {
        const tlsCertsDir = opts?.tlsServerCertsDir;
        const privateKey = readFileSync(join(tlsCertsDir, "tls.key"));
        const certChain = readFileSync(join(tlsCertsDir, "tls.crt"));
        const rootCerts = readFileSync(join(tlsCertsDir, "ca.crt"));
        return grpc.ServerCredentials.createSsl(
            rootCerts,
            [{ private_key: privateKey, cert_chain: certChain }],
            false, // Set to false to make client certificates optional
        );
    } catch (err) {
        throw err;
    }
}

// newGrpcServer creates a new gRPC server and registers our function runner
export function newGrpcServer(functionRunner: FunctionRunner, logger: Logger): grpc.Server {
    const server = getServer(functionRunner, logger);
    if (logger) {
        logger.debug("grpc server created");
    }
    return server;
}

// Helper function to create and start a server
export function startServer(server: grpc.Server, opts: ServerOptions, logger: Logger): grpc.Server {
    const creds = getCredentials(opts)
    logger.debug(`serverCredentials type: ${creds.constructor.name}`);

    server.bindAsync(
        opts.address,
        creds,
        (err, addr) => {
            if (err) {
                logger.error(`server bind error: ${err.message}`);
                return;
            }
            logger.info(`server started and listening on ${opts.address}`);
        }
    );
    return server;
}
