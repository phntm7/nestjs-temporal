"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsyncProvider = createAsyncProvider;
exports.createClientAsyncProvider = createClientAsyncProvider;
const client_util_1 = require("./client.util");
const get_queue_token_util_1 = require("./get-queue-token.util");
function createAsyncProvider(provide, options) {
    if (options === null || options === void 0 ? void 0 : options.useFactory) {
        const { useFactory, inject } = options;
        return {
            provide,
            useFactory,
            inject: inject || [],
        };
    }
    return {
        provide,
        useValue: (options === null || options === void 0 ? void 0 : options.useValue) || null,
    };
}
function createClientAsyncProvider(asyncOptions) {
    const name = asyncOptions.name ? asyncOptions.name : undefined;
    const optionsProvide = (0, get_queue_token_util_1.getAsyncQueueToken)(name);
    const clientProvide = (0, get_queue_token_util_1.getQueueToken)(name);
    return [
        createAsyncProvider(optionsProvide, asyncOptions),
        {
            provide: clientProvide,
            useFactory: (options) => (0, client_util_1.getWorkflowClient)(options),
            inject: [optionsProvide],
        },
    ];
}
