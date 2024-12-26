import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DateConverter } from 'src/utils/date-converter.util';

@Injectable()
export class TimezoneInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => DateConverter.convertDates(data, false)));
  }
}
