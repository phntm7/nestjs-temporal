"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var TemporalExplorer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalExplorer = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const worker_1 = require("@temporalio/worker");
const temporal_module_definition_1 = require("./temporal.module-definition");
const temporal_metadata_accessors_1 = require("./temporal-metadata.accessors");
let TemporalExplorer = TemporalExplorer_1 = class TemporalExplorer {
    constructor(discoveryService, metadataAccessor, metadataScanner) {
        this.discoveryService = discoveryService;
        this.metadataAccessor = metadataAccessor;
        this.metadataScanner = metadataScanner;
        this.logger = new common_1.Logger(TemporalExplorer_1.name);
    }
    onModuleInit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.explore();
        });
    }
    onModuleDestroy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.worker && (this.worker.getState() === 'INITIALIZED' || this.worker.getState() === 'RUNNING')) {
                this.worker.shutdown();
            }
            try {
                yield this.workerRunPromise;
            }
            catch (err) {
                this.logger.warn('Temporal worker was not cleanly shutdown.', {
                    err: err instanceof Error ? err.message : err,
                    stack: err instanceof Error ? err.stack : undefined,
                });
            }
        });
    }
    onApplicationBootstrap() {
        var _a;
        this.workerRunPromise = (_a = this.worker) === null || _a === void 0 ? void 0 : _a.run();
    }
    explore() {
        return __awaiter(this, void 0, void 0, function* () {
            const workerConfig = this.getWorkerConfigOptions();
            const runTimeOptions = this.getRuntimeOptions();
            const connectionOptions = this.getNativeConnectionOptions();
            if (workerConfig.taskQueue) {
                const activitiesFunc = yield this.handleActivities();
                if (runTimeOptions) {
                    this.logger.verbose('Instantiating a new Core object');
                    worker_1.Runtime.install(runTimeOptions);
                }
                const workerOptions = {
                    activities: activitiesFunc,
                };
                if (connectionOptions) {
                    this.logger.verbose('Connecting to the Temporal server');
                    workerOptions.connection = yield worker_1.NativeConnection.connect(connectionOptions);
                }
                this.logger.verbose('Creating a new Worker');
                this.worker = yield worker_1.Worker.create(Object.assign(workerOptions, workerConfig));
            }
        });
    }
    getWorkerConfigOptions() {
        return this.options.workerOptions;
    }
    getNativeConnectionOptions() {
        return this.options.connectionOptions;
    }
    getRuntimeOptions() {
        return this.options.runtimeOptions;
    }
    getActivityClasses() {
        return this.options.activityClasses;
    }
    handleActivities() {
        return __awaiter(this, void 0, void 0, function* () {
            const activitiesMethod = {};
            const activityClasses = this.getActivityClasses();
            const activities = this.discoveryService
                .getProviders()
                .filter((wrapper) => {
                var _a;
                return this.metadataAccessor.isActivities(!wrapper.metatype || wrapper.inject
                    ? (_a = wrapper.instance) === null || _a === void 0 ? void 0 : _a.constructor
                    : wrapper.metatype) &&
                    (!activityClasses || activityClasses.includes(wrapper.metatype));
            });
            activities.forEach((wrapper) => {
                const { instance } = wrapper;
                const isRequestScoped = !wrapper.isDependencyTreeStatic();
                this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (key) => __awaiter(this, void 0, void 0, function* () {
                    if (this.metadataAccessor.isActivity(instance[key])) {
                        if (isRequestScoped) {
                        }
                        else {
                            activitiesMethod[key] = instance[key].bind(instance);
                        }
                    }
                }));
            });
            return activitiesMethod;
        });
    }
};
exports.TemporalExplorer = TemporalExplorer;
__decorate([
    (0, common_1.Inject)(temporal_module_definition_1.TEMPORAL_MODULE_OPTIONS_TOKEN),
    __metadata("design:type", Object)
], TemporalExplorer.prototype, "options", void 0);
exports.TemporalExplorer = TemporalExplorer = TemporalExplorer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        temporal_metadata_accessors_1.TemporalMetadataAccessor,
        core_1.MetadataScanner])
], TemporalExplorer);
