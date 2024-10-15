import { Provider } from '@nestjs/common';
import { WorkflowClient } from '@temporalio/client';
import { TemporalModuleOptions } from './interfaces';
export declare function buildClient(option: TemporalModuleOptions): Promise<WorkflowClient>;
export declare function createClientProviders(options: TemporalModuleOptions[]): Provider[];
