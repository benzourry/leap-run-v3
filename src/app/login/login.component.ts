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
import { baseApi, domainBase, domainRegex, OAUTH } from '../_shared/constant.service';
import { UserService } from '../_shared/service/user.service';
import { Meta, Title } from '@angular/platform-browser';
import { btoaUTF } from '../_shared/utils';
import { SafePipe } from '../_shared/pipe/safe.pipe';
import { FormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RunService } from '../run/_service/run.service';
import { IconSplitPipe } from '../_shared/pipe/icon-split.pipe';

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

  iconSplitPipe = new IconSplitPipe();

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
    let loginList = [];
    const enabled = app.enabledSignin || [];

    // Helper to check standard legacy booleans and the new dynamic array
    const hasProvider = (key: string, legacyFlag?: boolean) => {
      return legacyFlag || enabled.includes(key);
    };

    if (hasProvider('sarawakid', app.useSarawakid)) {
      loginList.push({ icon: ['far', 'circle-user'], text: 'Login with SarawakID', key: 'sarawakid' });
    }
    if (hasProvider('unimasid', app.useUnimasid)) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with UNIMAS ID', key: 'unimasid' });
    }
    if (hasProvider('unimas', app.useUnimas)) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with UNIMAS ID (v1)', key: 'unimas' });
    }
    if (hasProvider('icatsid', app.useIcatsid)) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with i-CATS Identity', key: 'icatsid' });
    }
    if (hasProvider('ssone', app.useSsone)) {
      loginList.push({ icon: ['fas', 'university'], text: 'Login with ssOne', key: 'ssone' });
    }
    if (hasProvider('google', app.useGoogle)) {
      loginList.push({ icon: ['fab', 'google'], text: 'Login with Google', key: 'google' });
    }
    if (hasProvider('azuread', app.useAzuread)) {
      loginList.push({ icon: ['fab', 'microsoft'], text: 'Login with Microsoft', key: 'azuread' });
    }
    if (hasProvider('facebook', app.useFacebook)) {
      loginList.push({ icon: ['fab', 'facebook-f'], text: 'Login with Facebook', key: 'facebook' });
    }
    if (hasProvider('twitter', app.useTwitter)) {
      loginList.push({ icon: ['fab', 'twitter'], text: 'Login with Twitter', key: 'twitter' });
    }
    if (hasProvider('github', app.useGithub)) {
      loginList.push({ icon: ['fab', 'github'], text: 'Login with GitHub', key: 'github' });
    }
    if (hasProvider('linkedin', app.useLinkedin)) {
      loginList.push({ icon: ['fab', 'linkedin'], text: 'Login with LinkedIn', key: 'linkedin' });
    }

 // Append newly added dynamic custom providers directly from enabledSignin
    const standardKeys = [
      'sarawakid', 'unimasid', 'unimas', 'icatsid', 'ssone', 
      'google', 'azuread', 'facebook', 'twitter', 'github', 'linkedin'
    ];

    enabled.forEach((providerKey: string) => {
      if (!standardKeys.includes(providerKey)) {
        
        // 1. Attempt to get the real name from the backend map
        let displayName = app.providerNames?.[providerKey];
        
        // 2. Fallback to formatting the ID if the map fails for any reason
        if (!displayName) {
          displayName = providerKey.replace(/^custom-/, '');
          displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        }

        let iconStr = this.iconSplitPipe.transform(app.providerIcons?.[providerKey]??'fas:id-badge');
                
        loginList.push({ 
          icon: iconStr, 
          text: 'Login with ' + displayName, 
          key: providerKey 
        });
      }
    });

    this.loginList.set(loginList);
  }

  getPath() {
    if (window.location.host.indexOf(domainBase) > -1) {
      return 'path:' + window.location.host.match(domainRegex)[1];
    } else {
      return 'domain:' + window.location.host;
    }
  }

  login(server) {
    window.localStorage.setItem('server', server);
    window.localStorage.setItem('redirect', this.redirect); 
    window.localStorage.setItem('appId',this.app().id);
    // Dynamic provider login triggers the standard OAuth2 pipeline transparently
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
            .then(res => res.json())
            .then(json => {
                if (!json.error) {
                  window.localStorage.setItem("user", btoaUTF(JSON.stringify(json),null));
                  location.href = this.redirect ? "/#" + this.redirect : OAUTH.FINAL_URI;
                } else {
                  alert(json.error);
                  this.error.set(json.error);
                }
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