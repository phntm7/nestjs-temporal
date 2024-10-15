import { WorkflowClient, WorkflowClientOptions } from '@temporalio/client';
export declare function assignOnAppShutdownHook(client: WorkflowClient): WorkflowClient;
export declare function getWorkflowClient(options?: WorkflowClientOptions): WorkflowClient;
