import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart } from '@angular/router';

import {
  singleSpaAngular,
  getSingleSpaExtraProviders,
} from 'single-spa-angular';
import { APP_BASE_HREF } from '@angular/common';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

if (environment.production) {
  enableProdMode();
}

const sharePlatformKey = 'designMfe';
(window as any).sharedPlatform = (window as any).sharedPlatform || {};

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps: any) => {
    let platform = (window as any).sharedPlatform[sharePlatformKey];
    singleSpaPropsSubject.next(singleSpaProps);
    console.log(singleSpaProps);
    if (platform) {
      platform.destroy();
    }

    /* Accessing Custom props value using getSingleSpaExtractProviders() method */
    const extraProviders = getSingleSpaExtraProviders();

    extraProviders.push({
      provide: APP_BASE_HREF,
      useValue: (singleSpaProps as any).baseHref,
    });
    extraProviders.push({
      provide: 'MFE_IS_INTERNAL_HOST',
      useValue: (singleSpaProps as any).baseHref === '/' ? true : false,
    });
    extraProviders.push({
      provide: 'MFE_CONCOURSE_WORKSHOP_DATA',
      useValue: {
        engagementId: (singleSpaProps as any).engagementId,
        associationId: (singleSpaProps as any).associationId,
      },
    });

    if (singleSpaProps.bypassUserContext) {
      console.log(
        ':: MFE :: bypassUserContext :: YES :: ID Token',
        singleSpaProps.bypassUserContext
      );
      extraProviders.push({
        provide: 'MFE_BYPASS_USER_CONTEXT',
        useValue: {
          isBypassRequired: true,
          idToken: singleSpaProps.bypassUserContext,
        },
      });
    } else {
      console.log(':: MFE :: bypassUserContext :: NO ');
      extraProviders.push({
        provide: 'MFE_BYPASS_USER_CONTEXT',
        useValue: { isBypassRequired: false, idToken: null },
      });
    }

    platform = platformBrowserDynamic(extraProviders);
    (window as any).sharedPlatform[sharePlatformKey] = platform;

    return platform.bootstrapModule(AppModule);
  },
  template: '<app-root />',
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
