import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { SharedModule } from './_shared/shared.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthenticationInterceptor } from './_shared/service/auth-interceptor.service';
// import { LoadingInterceptor } from './_shared/service/loading-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
        importProvidersFrom(SharedModule),
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes, withHashLocation()), 
        provideServiceWorker('ngsw-worker.js', {
          enabled: !isDevMode(),
          registrationStrategy: 'registerWhenStable:30000'
        }), 
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        },
        //  {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: LoadingInterceptor,
        //     multi: true
        // },
        provideHttpClient(withInterceptorsFromDi()), 
          provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
        ]
};
