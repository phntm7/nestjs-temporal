import { NativeConnectionOptions, RuntimeOptions, WorkerOptions } from '@temporalio/worker';
export interface TemporalModuleOptions {
    workerOptions: WorkerOptions;
    connectionOptions?: NativeConnectionOptions;
    runtimeOptions?: RuntimeOptions;
    activityClasses?: object[];
}
export declare const ConfigurableModuleClass: import("@nestjs/common").ConfigurableModuleCls<TemporalModuleOptions, "registerWorker", "create", {}>, TEMPORAL_MODULE_OPTIONS_TOKEN: string | symbol, TEMPORAL_MODULE_OPTIONS_TYPE: TemporalModuleOptions & Partial<{}>, TEMPORAL_MODULE_ASYNC_OPTIONS_TYPE: import("@nestjs/common").ConfigurableModuleAsyncOptions<TemporalModuleOptions, "create"> & Partial<{}>;
