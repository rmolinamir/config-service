import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';

export function retry(
  retryAttempts = 9,
  retryDelay = 3000
): <T>(source: Observable<T>) => Observable<T> {
  const logger = new Logger('ConfigServiceModule');
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            logger.error(
              `Unable to load the configuration. Retrying (${
                errorCount + 1
              })...`
            );

            if (errorCount + 1 >= retryAttempts) throw error;

            return errorCount + 1;
          }, 0),
          delay(retryDelay)
        )
      )
    );
}
