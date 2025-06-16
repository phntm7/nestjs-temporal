import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import {
  NativeConnection,
  NativeConnectionOptions,
  Runtime,
  RuntimeOptions,
  Worker,
  WorkerOptions,
} from '@temporalio/worker';
import {
  TEMPORAL_MODULE_OPTIONS_TOKEN,
  TemporalModuleOptions,
} from './temporal.module-definition';
import { TemporalMetadataAccessor } from './temporal-metadata.accessors';
import { ActivityOptions } from './decorators';

@Injectable()
export class TemporalExplorer
  implements OnModuleInit, OnModuleDestroy, OnApplicationBootstrap
{
  @Inject(TEMPORAL_MODULE_OPTIONS_TOKEN) private options: TemporalModuleOptions;
  private readonly logger = new Logger(TemporalExplorer.name);
  public get worker() {
    return this._worker;
  }
  private _worker: Worker | undefined;
  private workerRunPromise: Promise<void>

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: TemporalMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onModuleInit() {
    await this.explore();
  }

  async onModuleDestroy() {
    // Workers automatically listen for an overlapping but distinct set of
    // signals to NestJS (notably, SIGTERM and SIGINT), and will start shutting
    // down when they're received.
    //
    // Unfortunately, the .shutdown() method isn't idempotent, and will throw
    // errors if called on a worker that's already in the process of shutting
    // down.
    //
    // Since it's possible for NestJS to exit with app.close(), which would
    // *not* trigger workers to automatically shut down, we need to check the
    // worker's state and only call .shutdown() if it's still running.
    //
    // This is racy (e.g. a signal could be received just after the check and
    // before the shutdown), but the race is pretty long, so I think it's fine.
    if (this.worker && (this.worker.getState() === 'INITIALIZED' || this.worker.getState() === 'RUNNING')) {
      this.worker.shutdown();
    }

    try {
      await this.workerRunPromise;

    } catch (err: any) {
      this.logger.warn('Temporal worker was not cleanly shutdown.', {
        err: err instanceof Error ? err.message : err,
        stack: err instanceof Error ? err.stack : undefined,
      });
    }
  }

  onApplicationBootstrap() {
    this.workerRunPromise = this.worker?.run();
  }

  async explore() {
    const workerConfig = this.getWorkerConfigOptions();
    const runTimeOptions = this.getRuntimeOptions();
    const connectionOptions = this.getNativeConnectionOptions();

    // should contain taskQueue
    if (workerConfig.taskQueue) {
      const activitiesFunc = await this.handleActivities();

      if (runTimeOptions) {
        this.logger.verbose('Instantiating a new Core object');
        Runtime.install(runTimeOptions);
      }

      const workerOptions = {
        activities: activitiesFunc,
      } as WorkerOptions;
      if (connectionOptions) {
        this.logger.verbose('Connecting to the Temporal server');
        workerOptions.connection = await NativeConnection.connect(
          connectionOptions,
        );
      }

      this.logger.verbose('Creating a new Worker');
      this._worker = await Worker.create(
        Object.assign(workerOptions, workerConfig),
      );
    }
  }

  getWorkerConfigOptions(): WorkerOptions {
    return this.options.workerOptions;
  }

  getNativeConnectionOptions(): NativeConnectionOptions | undefined {
    return this.options.connectionOptions;
  }

  getRuntimeOptions(): RuntimeOptions | undefined {
    return this.options.runtimeOptions;
  }

  getActivityClasses(): object[] | undefined {
    return this.options.activityClasses;
  }

  async handleActivities() {
    const activitiesMethod = {};

    const activityClasses = this.getActivityClasses();
    const activities: InstanceWrapper[] = this.discoveryService
      .getProviders()
      .filter(
        (wrapper: InstanceWrapper) =>
          this.metadataAccessor.isActivities(
            !wrapper.metatype || wrapper.inject
              ? wrapper.instance?.constructor
              : wrapper.metatype,
          ) &&
          (!activityClasses || activityClasses.includes(wrapper.metatype)),
      );

      const activitiesLoader = activities.flatMap((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      const isRequestScoped = !wrapper.isDependencyTreeStatic();

      return this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        async (key: string) => {
          if (this.metadataAccessor.isActivity(instance[key])) {
            const metadata = this.metadataAccessor.getActivity(instance[key]) as ActivityOptions;

            let activityName = key;
            if (metadata?.name) {
              if (typeof metadata.name === 'string') {
                activityName = metadata.name;
              } else {
                // @ts-expect-error - metadata.name can be a function
                const activityNameResult = metadata.name(instance);
                if (typeof activityNameResult === 'string') {
                  activityName = activityNameResult;
                } else {
                  activityName = await activityNameResult;
                }
              }
            }
            if (isRequestScoped) {
              // TODO: handle request scoped
            } else {
              activitiesMethod[activityName] = instance[key].bind(instance);            }
          }
        },
      );
    });

    await Promise.all(activitiesLoader);
    return activitiesMethod;
  }
}
