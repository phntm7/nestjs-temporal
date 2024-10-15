import { Provider } from "@nestjs/common";
import { SharedWorkflowClientOptions } from "../interfaces/shared-workflow-client-options.interface";
import { SharedConnectionAsyncConfiguration, SharedRuntimeAsyncConfiguration, SharedWorkerAsyncConfiguration } from "../interfaces";
export declare function createAsyncProvider(provide: string, options?: SharedWorkerAsyncConfiguration | SharedRuntimeAsyncConfiguration | SharedConnectionAsyncConfiguration | SharedWorkflowClientOptions): Provider;
export declare function createClientAsyncProvider(asyncOptions: SharedWorkflowClientOptions): Provider[];
