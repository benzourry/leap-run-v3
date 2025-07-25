// Copyright (C) 2018 Razif Baital
// 
// This file is part of LEAP.
// 
// LEAP is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
// 
// LEAP is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with LEAP.  If not, see <http://www.gnu.org/licenses/>.

import { Component, inject, OnInit, signal } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
// import { PushService } from './_shared/service/push.service';
// import { RunService } from './service/run.service';
import { UtilityService } from './_shared/service/utility.service';
import { domainRegex, baseApi, domainBase } from './_shared/constant.service';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { filter, map } from 'rxjs';
import { RouterOutlet } from '@angular/router';
// import { ToastsContainer } from './_shared/component/toasts-container.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ToastsContainer } from './run/_component/toasts-container.component';
import { RunService } from './run/_service/run.service';
// import { Title } from '@angular/platform-browser';
// import { Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet, ToastsContainer, FaIconComponent]
})
export class AppComponent implements OnInit {

  private runService = inject(RunService)
  private swUpdate = inject(SwUpdate)
  private utilityService = inject(UtilityService)
  private ngbConfig = inject(NgbConfig)

  title = 'app';
  path = signal<string>('');
  pathExist = signal<boolean>(true);
  serverDown = signal<boolean>(false);
  appLoading = signal<boolean>(false);
  updateAvailable = signal<boolean>(false);

  constructor() {

    const updatesAvailable = this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      })));
    updatesAvailable.subscribe(evt => {
      this.updateAvailable.set(true);
    })
    this.utilityService.testOnline$().subscribe(online => this.offline.set(!online));

  }

  getPath() {
    if (window.location.host.indexOf(domainBase) > -1) {
      return 'path:' + window.location.host.match(domainRegex)[1];
    } else {
      return 'domain:' + window.location.host;
    }
  }

  offline = signal<boolean>(false);

  ngOnInit() {
    this.path.set(this.getPath());
    this.checkPath(this.path());
    document.querySelector('#manifest-placeholder').setAttribute('href', `${baseApi}/app/${this.path()}/manifest.json`);
    document.querySelector('#favicon-placeholder').setAttribute('href', `${baseApi}/app/${this.path()}/logo/16`);

  }

  checkPath(p: string) {
    this.appLoading.set(true);
    this.runService.checkPath(p)
      .subscribe({
        next: res => {
          this.serverDown.set(false);
          this.pathExist.set(res);
          this.appLoading.set(false);

        }, error: err => {
          this.serverDown.set(true);
          this.appLoading.set(false);

        }
      })
  }

  reload() {
    window.location.reload();
  }

}
