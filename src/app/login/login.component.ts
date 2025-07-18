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

  private route = inject(ActivatedRoute)
  private runService = inject(RunService)
  private userService = inject(UserService)
  private titleService = inject(Title)
  private meta = inject(Meta)

  redirect: string = '';
  app = signal<any>(null);
  baseApi: string = baseApi;

  loginList = signal<any[]>([]);

  cred: any = {};
  privacyPolicy: string = OAUTH.PRIVACY_POLICY;

  passwordType:string="password";

  constructor() { }


  ngOnInit() {
    // Get the query params
    this.route.queryParams
      .subscribe(params => this.redirect = params['redirect'] || '/');

    this.runService.getRunAppByPath(this.getPath())
      .subscribe(res => {
        this.buildLoginList(res);
        this.app.set(res);
        this.runService.$app.set(this.app);
        this.titleService.setTitle('Login ' + res.title);
        let desc = res.title;
        if (res.description){
          desc = res.description;
        }
        this.meta.addTag({name:'description', content: desc})
      })
  }

  buildLoginList(app) {
    let loginList = []
    if (app.useSarawakid) {
      loginList.push({ icon: ['far', 'circle-user'], text: 'Login with SarawakID', key: 'sarawakid' });
    }
    if (app.useUnimasid) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with UNIMAS ID', key: 'unimasid' });
    }
    if (app.useUnimas) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with UNIMAS ID (v1)', key: 'unimas' });
    }
    if (app.useIcatsid) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with i-CATS Identity', key: 'icatsid' });
    }
    if (app.useSsone) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with ssOne', key: 'ssone' });
    }
    if (app.useGoogle) {
      loginList.push({ icon: ['fab', 'google'], text: 'Login with Google', key: 'google' });
    }
    if (app.useAzuread) {
      loginList.push({ icon: ['fab', 'microsoft'], text: 'Login with Microsoft', key: 'azuread' });
    }
    if (app.useFacebook) {
      loginList.push({ icon: ['fab', 'facebook-f'], text: 'Login with Facebook', key: 'facebook' });
    }
    if (app.useTwitter) {
      loginList.push({ icon: ['fab', 'twitter'], text: 'Login with Twitter', key: 'twitter' });
    }
    if (app.useGithub) {
      loginList.push({ icon: ['fab', 'github'], text: 'Login with GitHub', key: 'github' });
    }
    if (app.useLinkedin) {
      loginList.push({ icon: ['fab', 'linkedin'], text: 'Login with LinkedIn', key: 'linkedin' });
    }
    this.loginList.set(loginList);
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
    window.localStorage.setItem('appId',this.app().id);
    location.href = `${OAUTH.AUTH_URI}/${server}?appId=${this.app().id}&redirect_uri=${encodeURIComponent(OAUTH.CALLBACK)}`;
  }

  register = signal<boolean>(false);
  error = signal<any>(null);
  signin(data) {
    data.appId=this.app().id;
    if (this.app().x?.userFromApp){
      data.appId = this.app().x?.userFromApp;
    }
    this.userService.login(data)
    .subscribe({
      next:(res)=>{
        var token = res.accessToken;
        if (token !== undefined && token !== null) {
          var auth = {
            accessToken: token
          };
          window.localStorage.setItem("auth", btoaUTF(JSON.stringify(auth),null));
          fetch(OAUTH.USER_URI, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(function (response) {
              response.json().then(function (json) {
                if (!json.error) {
                  window.localStorage.setItem("user", btoaUTF(JSON.stringify(json),null));
                  location.href = window.localStorage.getItem("redirect") ? "/#" + window.localStorage.getItem("redirect") : OAUTH.FINAL_URI;
                } else {
                  alert(json.error);
                  this.error.set(json.error);
                }

              });
            });

        } else {
          this.error.set({message:"Problem authenticating"});
          alert("Problem authenticating");
        }
      },
      error:(err)=>{
        this.error.set(err.error);
      }
    });
  }

  message = signal<string>(null);
  reset(email){
    this.userService.resetPwd(email,this.app().id)
    .subscribe({
      next: (res)=>{
        this.message.set(res.message);
        this.error.set(false);
      },
      error: (err)=>{
        this.error.set(err.error);
      }
    })
  }

  signup(data) {
    data.appId=this.app().id;
    if (this.app().x?.userFromApp){
      data.appId = this.app().x?.userFromApp;
    }
    this.userService.register(data)
      .subscribe({
        next: (res)=>{
          this.message.set(res.message);
          this.register.set(false);
          this.error.set(false);
        },
        error: (err)=>{
          this.error.set(err.error);
        }
      })
  }

}
