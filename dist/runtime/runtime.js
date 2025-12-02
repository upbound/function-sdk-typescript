import * as grpc from "@grpc/grpc-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FunctionRunner, getServer } from "../function/function.js";
// getCredentials creates gRPC ServerCredentials from TLS files on the filesystem
export function getCredentials(opts) {
    if (opts?.insecure || opts?.tlsServerCertsDir === "" || opts?.tlsServerCertsDir === undefined) {
        return grpc.ServerCredentials.createInsecure();
    }
    try {
        const tlsCertsDir = opts?.tlsServerCertsDir;
        const privateKey = readFileSync(join(tlsCertsDir, "tls.key"));
        const certChain = readFileSync(join(tlsCertsDir, "tls.crt"));
        const rootCerts = readFileSync(join(tlsCertsDir, "ca.crt"));
        return grpc.ServerCredentials.createSsl(rootCerts, [{ private_key: privateKey, cert_chain: certChain }], false);
    }
    catch (err) {
        throw err;
    }
}
// newGrpcServer creates a new gRPC server and registers our function runner
export function newGrpcServer(functionRunner, logger) {
    const server = getServer(functionRunner, logger);
    if (logger) {
        logger.debug("grpc server created");
    }
    return server;
}
// Helper function to create and start a server
export function startServer(server, opts, logger) {
    const creds = getCredentials(opts);
    logger.debug(`serverCredentials type: ${creds.constructor.name}`);
    server.bindAsync(opts.address, creds, (err, addr) => {
        if (err) {
            logger.error(`server bind error: ${err.message}`);
            return;
        }
        logger.info(`server started and listening on ${opts.address}`);
    });
    return server;
}
//# sourceMappingURL=runtime.js.map