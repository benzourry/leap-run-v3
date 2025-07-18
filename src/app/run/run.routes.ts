import { Routes } from "@angular/router";
import { AuthGuardService } from "../_shared/service/auth-guard.service";
import { CanDeactivateGuard } from "../_shared/service/can-deactivate-guard.service";
import { StartComponent } from "./start/start.component";
import { HeadlessComponent } from "./headless/headless.component";

export const RUN_ROUTES: Routes = [
    { path: 'register', loadComponent: () => import('./register/register.component').then(mod => mod.RegisterComponent) },
    {
      path: '', component: StartComponent,
      children: [
        { path: 'form/:formId/view', loadComponent: () => import('./view/view-web.component').then(mod => mod.ViewWebComponent) },
        { path: 'form/:formId/view-single', loadComponent: () => import('./view/view-web.component').then(mod => mod.ViewWebComponent) },// Normally, used /view above. But buildGo use /view-single
        { path: 'form/:formId/:action', loadComponent: () => import('./form/form-web.component').then(mod => mod.FormWebComponent), canDeactivate: [CanDeactivateGuard] },
        { path: 'dataset/:datasetId', loadComponent: () => import('./list/list-web.component').then(mod => mod.ListWebComponent) },
        { path: 'dataset/:datasetId/:page', loadComponent: () => import('./list/list-web.component').then(mod => mod.ListWebComponent) },
        { path: 'dashboard/:dashboardId', loadComponent: () => import('./dashboard/dashboard-web.component').then(mod => mod.DashboardWebComponent) },
        { path: 'screen/:screenId', loadComponent: () => import('./screen/screen-web.component').then(mod => mod.ScreenWebComponent) },
        { path: 'lookup/:lookupId', loadComponent: () => import('./lookup/lookup.component').then(mod => mod.LookupComponent) },
        { path: 'user', loadComponent: () => import('./user/user.component').then(mod => mod.UserComponent) },
        { path: 'user/:groupId', loadComponent: () => import('./user/user.component').then(mod => mod.UserComponent) },
        { path: 'profile', loadComponent: () => import('./profile/profile.component').then(mod => mod.ProfileComponent)},
        { path: 'start', loadComponent: () => import('./tiles/tiles.component').then(mod => mod.TilesComponent)},
        { path: 'path/:encodedUrl', redirectTo: (urlInfo)=>{
            let decodedUrl = atob(urlInfo.params.encodedUrl);
            return decodedUrl;
          }
        },
  
      ],
      canActivate: [AuthGuardService]
    },{      
      path: 'embed', component: HeadlessComponent,
      children: [
        { path: '', loadComponent: () => import('./tiles/tiles.component').then(mod => mod.TilesComponent)},
        { path: 'form/:formId/view', loadComponent: () => import('./view/view-web.component').then(mod => mod.ViewWebComponent) },
        { path: 'form/:formId/view-single', loadComponent: () => import('./view/view-web.component').then(mod => mod.ViewWebComponent) },// Normally, used /view above. But buildGo use /view-single
        { path: 'form/:formId/:action', loadComponent: () => import('./form/form-web.component').then(mod => mod.FormWebComponent), canDeactivate: [CanDeactivateGuard] },
        { path: 'dataset/:datasetId', loadComponent: () => import('./list/list-web.component').then(mod => mod.ListWebComponent) },
        { path: 'dataset/:datasetId/:page', loadComponent: () => import('./list/list-web.component').then(mod => mod.ListWebComponent) },
        { path: 'dashboard/:dashboardId', loadComponent: () => import('./dashboard/dashboard-web.component').then(mod => mod.DashboardWebComponent) },
        { path: 'screen/:screenId', loadComponent: () => import('./screen/screen-web.component').then(mod => mod.ScreenWebComponent) },
        { path: 'lookup/:lookupId', loadComponent: () => import('./lookup/lookup.component').then(mod => mod.LookupComponent) },
        { path: 'user', loadComponent: () => import('./user/user.component').then(mod => mod.UserComponent) },
        { path: 'user/:groupId', loadComponent: () => import('./user/user.component').then(mod => mod.UserComponent) },
        { path: 'profile', loadComponent: () => import('./profile/profile.component').then(mod => mod.ProfileComponent)},
        { path: 'start', loadComponent: () => import('./tiles/tiles.component').then(mod => mod.TilesComponent)}
  
      ],
      canActivate: [AuthGuardService]
    },
    {
      // path: 'web/:path', component: WebComponent
      path: 'web/:path', loadComponent: () => import('./web/web.component').then(mod => mod.WebComponent)
    }
  ]