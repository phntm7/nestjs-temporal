import { OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { NativeConnectionOptions, RuntimeOptions, Worker, WorkerOptions } from '@temporalio/worker';
import { TemporalMetadataAccessor } from './temporal-metadata.accessors';
export declare class TemporalExplorer implements OnModuleInit, OnModuleDestroy, OnApplicationBootstrap {
    private readonly discoveryService;
    private readonly metadataAccessor;
    private readonly metadataScanner;
    private options;
    private readonly logger;
    get worker(): Worker;
    private _worker;
    private workerRunPromise;
    constructor(discoveryService: DiscoveryService, metadataAccessor: TemporalMetadataAccessor, metadataScanner: MetadataScanner);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    onApplicationBootstrap(): void;
    explore(): Promise<void>;
    getWorkerConfigOptions(): WorkerOptions;
    getNativeConnectionOptions(): NativeConnectionOptions | undefined;
    getRuntimeOptions(): RuntimeOptions | undefined;
    getActivityClasses(): object[] | undefined;
    handleActivities(): Promise<{}>;
}
