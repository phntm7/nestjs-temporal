import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { NativeConnectionOptions } from '@temporalio/worker';
export interface SharedConnectionConfigurationFactory {
    createSharedConfiguration(): Promise<NativeConnectionOptions> | NativeConnectionOptions;
}
export interface SharedConnectionAsyncConfiguration extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<SharedConnectionConfigurationFactory>;
    useClass?: Type<SharedConnectionConfigurationFactory>;
    useFactory?: (...args: any[]) => Promise<NativeConnectionOptions> | NativeConnectionOptions;
    useValue?: NativeConnectionOptions;
    inject?: FactoryProvider['inject'];
}
