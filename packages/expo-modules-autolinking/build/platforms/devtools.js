"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveModuleAsync = resolveModuleAsync;
exports.resolveExtraBuildDependenciesAsync = resolveExtraBuildDependenciesAsync;
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
async function resolveModuleAsync(packageName, revision) {
    const devtoolsConfig = revision.config?.toJSON().devtools;
    if (devtoolsConfig == null) {
        return null;
    }
    return {
        packageName,
        packageRoot: revision.path,
        webpageRoot: await resolvePackageLocalPath(revision.path, devtoolsConfig.webpageRoot),
        cliBanner: devtoolsConfig.cliBanner ?? false,
        bannerTitle: devtoolsConfig.bannerTitle,
        serverEntryPoint: await resolvePackageLocalPath(revision.path, devtoolsConfig.serverEntryPoint),
        cliExtensions: devtoolsConfig.cliExtensions,
    };
}
async function resolvePackageLocalPath(packageRoot, configuredPath) {
    if (!configuredPath) {
        return undefined;
    }
    const resolvedPath = path_1.default.resolve(packageRoot, configuredPath);
    // NOTE(@kitten): Failing realpath-ing, typically due to ENOENT, results in the original value
    const realPath = (await (0, utils_1.maybeRealpath)(resolvedPath)) ?? resolvedPath;
    return (0, utils_1.isPathInside)(realPath, packageRoot) ? realPath : undefined;
}
async function resolveExtraBuildDependenciesAsync(_projectNativeRoot) {
    return null;
}
//# sourceMappingURL=devtools.js.map