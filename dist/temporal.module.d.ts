import { DynamicModule } from '@nestjs/common';
import { SharedWorkflowClientOptions, TemporalModuleOptions } from './interfaces';
import { ConfigurableModuleClass, TEMPORAL_MODULE_ASYNC_OPTIONS_TYPE, TEMPORAL_MODULE_OPTIONS_TYPE } from './temporal.module-definition';
export declare class TemporalModule extends ConfigurableModuleClass {
    static forRoot(options: typeof TEMPORAL_MODULE_OPTIONS_TYPE): DynamicModule;
    static forRootAsync(options: typeof TEMPORAL_MODULE_ASYNC_OPTIONS_TYPE): DynamicModule;
    static registerWorker(options: typeof TEMPORAL_MODULE_OPTIONS_TYPE): DynamicModule;
    static registerWorkerAsync(options: typeof TEMPORAL_MODULE_ASYNC_OPTIONS_TYPE): DynamicModule;
    static registerClient(options?: TemporalModuleOptions): DynamicModule;
    static registerClientAsync(asyncSharedWorkflowClientOptions: SharedWorkflowClientOptions): DynamicModule;
}
