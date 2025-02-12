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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { base, OAUTH } from '../constant.service';
import { first, tap } from 'rxjs/operators';
import { atobUTF, btoaUTF } from '../utils';
// declare let OAUTH: any;
// import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: Observable<any>;

  base = base;

  constructor(private router: Router,
    private http: HttpClient) { }


  public isLoggedIn(): boolean {
    return !!localStorage.getItem("auth");
  }

  login(cred: any) {
    return this.http.post<any>(`${this.base}/auth/login`, cred);
  }

  register(cred: any) {
    return this.http.post<any>(`${this.base}/auth/signup`, cred);
  }

  changePwd(cred: any) {
    return this.http.post<any>(`${this.base}/auth/changepwd`, cred);
  }

  resetPwd(email: string, appId:number) {
    return this.http.post<any>(`${this.base}/auth/resetpwd?email=${email}&appId=${appId}`, {});
  }

  setUser(user){
    window.localStorage.setItem("user", btoaUTF(JSON.stringify(user)));
  }

  // getUser(): Observable<any> {
  //   // let rt: Observable<any>;
  //   let server = localStorage.getItem('server');

  //   if (localStorage.getItem("user")) {
  //     var access_token = this.getToken();
  //     this.user = of(JSON.parse(localStorage.getItem("user")));
  //     this.http.get<any>(OAUTH.USER_URI + "?access_token=" + access_token)
  //     .subscribe(res => {
  //       window.localStorage.setItem("user", JSON.stringify(res));
  //       this.user = of(res);
  //     }, err => {
  //       window.location.href = OAUTH.AUTH_URI + "/" + server + "?redirect_uri=" + OAUTH.CALLBACK;
  //     });
  //   } else {

  //     if (!localStorage.getItem("auth")) {
  //       this.router.navigate(['/login']);
  //       window.location.href = OAUTH.AUTH_URI + "/" + server + "?redirect_uri=" + OAUTH.CALLBACK;
  //       // location.href = OAUTH[server].AUTH_URI+"?client_id=" + OAUTH[server].CLIENT_ID + "&response_type=token&scope="+OAUTH[server].SCOPE+"&redirect_uri="+OAUTH.CALLBACK;
  //     } else {
  //       // this.router.navigate(['/login']);
  //       var access_token = this.getToken();
  //       // // $http.defaults.headers.common['Authorization'] = 'Bearer '+ this.getToken();
  //       if (!this.user) {
  //         this.http.get<any>(OAUTH.USER_URI + "?access_token=" + access_token)
  //           .subscribe(res => {
  //             window.localStorage.setItem("user", JSON.stringify(res));
  //             this.user = of(res);
  //           }, err => {
  //             window.location.href = OAUTH.AUTH_URI + "/" + server + "?redirect_uri=" + OAUTH.CALLBACK;
  //           });
  //       }
  //     }
  //   }
  //   return this.user;
  // }

  getUser(): Observable<any> {
    const server = localStorage.getItem('server');
    // const user = localStorage.getItem('user');
    // const userexp = localStorage.getItem('userexp');
    
    // NO NEED FOR MANUAL USER-INFO CACHE. USE SW.
    // if (user && !userexp) {
    //   const userStr = atobUTF(user);
    //   const accessToken = this.getToken();
    //   this.user = of(JSON.parse(userStr));
    //   return this.user;
    // } else {
    //   if (!localStorage.getItem('auth')) {
    //     window.location.href = `${OAUTH.AUTH_URI}/${server}?redirect_uri=${OAUTH.CALLBACK}`;
    //     return of();
    //   } else {
        var keyType, keyValue;
        var auth = this.getAuth();
        if (auth.accessToken){
          keyType = "access_token";
          keyValue = auth.accessToken;
        }else{
          keyType = "api_key";
          keyValue = auth.apiKey;
        }
        return this.http.get<any>(`${OAUTH.USER_URI}?${keyType}=${keyValue}`).pipe(
          tap({
            next: (res) => {
              window.localStorage.setItem('user', btoaUTF(JSON.stringify(res)));
              this.user = of(res);
              window.localStorage.removeItem('userexp');
            },
            error: () => {
              if (server){
                // if ada server info
                window.location.href = `${OAUTH.AUTH_URI}/${server}?redirect_uri=${OAUTH.CALLBACK}`;
              }else{
                // else redirect to login
                this.router.navigate(['/login']);
              }
            }
          }),
          first()
        );
      // }
    // }
  }

  getToken = () =>  {
    // #####TO-DO need to change to atob later when the time is ready;
    var authStr=atobUTF(localStorage.getItem("auth"));
    return JSON.parse(authStr).accessToken;
  };

  getAuth = () => {
    const server = localStorage.getItem('server');
    if (!localStorage.getItem('auth'))
      window.location.href = `${OAUTH.AUTH_URI}/${server}?redirect_uri=${OAUTH.CALLBACK}`;

    // #####TO-DO need to change to atob later when the time is ready;
    var authStr = atobUTF(localStorage.getItem("auth"));
    return JSON.parse(authStr);
  };

  public clearStorage(attr){
    attr.split(',').forEach(att => {
      localStorage.removeItem(att);
    });
    // localStorage.removeItem("auth");
    // localStorage.removeItem("user");
    // localStorage.removeItem("server");
  }
  public logout() {
    this.clearStorage('auth,user,server,pushDismissed');
    this.router.navigate(['/login']);
  }
}
