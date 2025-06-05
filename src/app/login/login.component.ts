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
import { ActivatedRoute } from '@angular/router';
// import { RunService } from '../service/run.service';
import { baseApi, domainBase, domainRegex, OAUTH } from '../_shared/constant.service';
import { UserService } from '../_shared/service/user.service';
import { Meta, Title } from '@angular/platform-browser';
import { btoaUTF } from '../_shared/utils';
import { SafePipe } from '../_shared/pipe/safe.pipe';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RunService } from '../run/_service/run.service';
// declare let OAUTH: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [FaIconComponent, FormsModule, SafePipe]
})
export class LoginComponent implements OnInit {

  redirect: string = '';
  app: any;
  baseApi: string = baseApi;

  loginList: any[] = [];

  useEmail: boolean = false;
  cred: any = {};
  privacyPolicy: string = OAUTH.PRIVACY_POLICY;

  constructor(private route: ActivatedRoute, private runService: RunService, private userService: UserService,
    private titleService: Title, private meta: Meta) { }


  ngOnInit() {
    // Get the query params
    this.route.queryParams
      .subscribe(params => this.redirect = params['redirect'] || '/');

    this.runService.getAppByPath(this.getPath())
      .subscribe(res => {
        this.buildLoginList(res);
        this.app = res;
        this.runService.$app.set(this.app);
        this.titleService.setTitle('Login ' + this.app.title);
        let desc = this.app.title;
        if (this.app?.description){
          desc = this.app?.description;
        }
        this.meta.addTag({name:'description', content: desc})
      })
  }

  buildLoginList(app) {
    if (app.useSarawakid) {
      this.loginList.push({ icon: ['far', 'circle-user'], text: 'Login with SarawakID', key: 'sarawakid' });
    }
    if (app.useUnimasid) {
      this.loginList.push({ icon: ['fas', 'university'], text: 'Login with UNIMAS ID', key: 'unimasid' });
    }
    if (app.useUnimas) {
      this.loginList.push({ icon: ['fas', 'university'], text: 'Login with UNIMAS ID (v1)', key: 'unimas' });
    }
    if (app.useIcatsid) {
      this.loginList.push({ icon: ['fas', 'university'], text: 'Login with i-CATS Identity', key: 'icatsid' });
    }
    if (app.useSsone) {
      this.loginList.push({ icon: ['fas', 'university'], text: 'Login with ssOne', key: 'ssone' });
    }
    if (app.useGoogle) {
      this.loginList.push({ icon: ['fab', 'google'], text: 'Login with Google', key: 'google' });
    }
    if (app.useAzuread) {
      this.loginList.push({ icon: ['fab', 'microsoft'], text: 'Login with Microsoft', key: 'azuread' });
    }
    if (app.useFacebook) {
      this.loginList.push({ icon: ['fab', 'facebook-f'], text: 'Login with Facebook', key: 'facebook' });
    }
    if (app.useTwitter) {
      this.loginList.push({ icon: ['fab', 'twitter'], text: 'Login with Twitter', key: 'twitter' });
    }
    if (app.useGithub) {
      this.loginList.push({ icon: ['fab', 'github'], text: 'Login with GitHub', key: 'github' });
    }
    if (app.useLinkedin) {
      this.loginList.push({ icon: ['fab', 'linkedin'], text: 'Login with LinkedIn', key: 'linkedin' });
    }
  }

  getPath() {
    if (window.location.host.indexOf(domainBase) > -1) {
      return 'path:' + window.location.host.match(domainRegex)[1];
    } else {
      return 'domain:' + window.location.host;
    }
  }
  // getPath() {
  //   return window.location.host.match(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\.)?ia\.unimas\.my/)[1];
  // }

  login(server) {
    window.localStorage.setItem('server', server);
    window.localStorage.setItem('redirect', this.redirect); 
    window.localStorage.setItem('appId',this.app.id);
    location.href = `${OAUTH.AUTH_URI}/${server}?appId=${this.app.id}&redirect_uri=${encodeURIComponent(OAUTH.CALLBACK)}`;
  }

  register = false;
  error: any;
  signin(data) {
    data.appId=this.app.id;
    if (this.app.x?.userFromApp){
      data.appId = this.app.x?.userFromApp;
    }
    this.userService.login(data)
    .subscribe({
      next:(res)=>{
        var token = res.accessToken;
        if (token !== undefined && token !== null) {
          var auth = {
            accessToken: token
          };
          window.localStorage.setItem("auth", btoaUTF(JSON.stringify(auth)));
          fetch(OAUTH.USER_URI, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function (response) {
              response.json().then(function (json) {
                if (!json.error) {
                  window.localStorage.setItem("user", btoaUTF(JSON.stringify(json)));
                  location.href = window.localStorage.getItem("redirect") ? "/#" + window.localStorage.getItem("redirect") : OAUTH.FINAL_URI;
                } else {
                  alert(json.error);
                  this.error = json.error;
                }

              });
            });

        } else {
          this.error = {message:"Problem authenticating"};
          alert("Problem authenticating");
        }
      },
      error:(err)=>{
        this.error = err.error;
      }
    });
  }

  message:string;
  reset(email){
    this.userService.resetPwd(email,this.app.id)
    .subscribe({
      next: (res)=>{
        this.message = res.message;
        this.error = false;
      },
      error: (err)=>{
        this.error = err.error;
      }
    })
  }

  signup(data) {
    data.appId=this.app.id;
    if (this.app.x?.userFromApp){
      data.appId = this.app.x?.userFromApp;
    }
    this.userService.register(data)
      .subscribe({
        next: (res)=>{
          this.message = res.message;
          this.register = false;
          this.error = false;
        },
        error: (err)=>{
          this.error = err.error;
        }
      })
  }

}
