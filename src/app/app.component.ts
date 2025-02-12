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

import { Component, OnInit } from '@angular/core';
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
  title = 'app';
  path: string;
  pathExist: any;
  serverDown: boolean;
  appLoading: boolean;
  updateAvailable: boolean = false;

  constructor(private runService: RunService, private swUpdate: SwUpdate, private utilityService: UtilityService,
    ngbConfig: NgbConfig) {

    const updatesAvailable = swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      })));
    updatesAvailable.subscribe(evt => {
      this.updateAvailable = true;
    })
    this.utilityService.testOnline$().subscribe(online => this.offline = !online);

  }

  getPath() {
    if (window.location.host.indexOf(domainBase) > -1) {
      return 'path:' + window.location.host.match(domainRegex)[1];
    } else {
      return 'domain:' + window.location.host;
    }
  }

  offline = false;
  ngOnInit() {
    // this.userService.getUser()
    //   .subscribe((user) => {
    // this.user = user;
    this.path = this.getPath();
    this.checkPath(this.path);
    document.querySelector('#manifest-placeholder').setAttribute('href', `${baseApi}/app/${this.path}/manifest.json`);
    document.querySelector('#favicon-placeholder').setAttribute('href', `${baseApi}/app/${this.path}/logo/16`);

  }

  checkPath(p: string) {
    this.appLoading = true;
    this.runService.checkPath(p)
      .subscribe({
        next: res => {
          this.serverDown = false;
          this.pathExist = res;
          this.appLoading = false;

        }, error: err => {
          this.serverDown = true;
          this.appLoading = false;

        }
      })
  }

  reload() {
    window.location.reload();
  }

}
