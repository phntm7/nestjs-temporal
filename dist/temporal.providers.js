"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClient = buildClient;
exports.createClientProviders = createClientProviders;
const client_1 = require("@temporalio/client");
const utils_1 = require("./utils");
function buildClient(option) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield client_1.Connection.connect(option.connection);
        return (0, utils_1.getWorkflowClient)(Object.assign(Object.assign({}, option.workflowOptions), { connection }));
    });
}
function createClientProviders(options) {
    return options.map((option) => ({
        provide: (0, utils_1.getQueueToken)((option === null || option === void 0 ? void 0 : option.name) || undefined),
        useFactory: () => __awaiter(this, void 0, void 0, function* () {
            return buildClient(option || {});
        }),
    }));
}
