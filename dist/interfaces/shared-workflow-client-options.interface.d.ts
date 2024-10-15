import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { WorkflowClientOptions } from '@temporalio/client';
export interface SharedWorkflowClientOptionsFactory {
    createSharedConfiguration(): Promise<WorkflowClientOptions> | WorkflowClientOptions;
}
export interface SharedWorkflowClientOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useExisting?: Type<SharedWorkflowClientOptionsFactory>;
    useClass?: Type<SharedWorkflowClientOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<WorkflowClientOptions> | WorkflowClientOptions;
    useValue?: WorkflowClientOptions;
    inject?: FactoryProvider['inject'];
}
