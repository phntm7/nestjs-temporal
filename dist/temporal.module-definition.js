"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPORAL_MODULE_ASYNC_OPTIONS_TYPE = exports.TEMPORAL_MODULE_OPTIONS_TYPE = exports.TEMPORAL_MODULE_OPTIONS_TOKEN = exports.ConfigurableModuleClass = void 0;
const common_1 = require("@nestjs/common");
_a = new common_1.ConfigurableModuleBuilder()
    .setClassMethodName('registerWorker')
    .build(), exports.ConfigurableModuleClass = _a.ConfigurableModuleClass, exports.TEMPORAL_MODULE_OPTIONS_TOKEN = _a.MODULE_OPTIONS_TOKEN, exports.TEMPORAL_MODULE_OPTIONS_TYPE = _a.OPTIONS_TYPE, exports.TEMPORAL_MODULE_ASYNC_OPTIONS_TYPE = _a.ASYNC_OPTIONS_TYPE;
