import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { RuntimeOptions } from '@temporalio/worker';
export interface SharedRuntimeConfigurationFactory {
    createSharedConfiguration(): Promise<RuntimeOptions> | RuntimeOptions;
}
export interface SharedRuntimeAsyncConfiguration extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<SharedRuntimeConfigurationFactory>;
    useClass?: Type<SharedRuntimeConfigurationFactory>;
    useFactory?: (...args: any[]) => Promise<RuntimeOptions> | RuntimeOptions;
    useValue?: RuntimeOptions;
    inject?: FactoryProvider['inject'];
}
