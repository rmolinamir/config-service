import { Logger } from '@nestjs/common';
import { Observable, timer } from 'rxjs';
import { retry as rxjsRetry } from 'rxjs/operators';

export function retry(
  retryAttempts = 9,
  retryDelay = 3000
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger('ConfigServiceModule');

  return <T>(source: Observable<T>) =>
    source.pipe(
      rxjsRetry({
        count: retryAttempts,
        delay: (error: unknown, retryCount: number) => {
          logger.error(
            `Unable to load the configuration. Retrying (${retryCount + 1})...`
          );

          if (retryCount + 1 >= retryAttempts) throw error;

          return timer(retryDelay);
        },
        resetOnSuccess: true
      })
    );
}
