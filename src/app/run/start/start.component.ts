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

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../_shared/service/user.service';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UtilityService } from '../../_shared/service/utility.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlatformLocation, NgClass, NgStyle } from '@angular/common';
import { baseApi, domainRegex, domainBase, base } from '../../_shared/constant.service';
import { Title } from '@angular/platform-browser';
// import { RunService } from '../../service/run.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { PageTitleService } from '../../_shared/service/page-title-service';
import { ServerDate, compileTpl, deepMerge, getQuery, loadScript } from '../../_shared/utils';
import { LogService } from '../../_shared/service/log.service';
import { SwPush } from '@angular/service-worker';
import { PushService } from '../../_shared/service/push.service';
import { first, map, take, tap } from 'rxjs/operators';
import { SafePipe } from '../../_shared/pipe/safe.pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
// import { PageTitleComponent } from '../../_shared/component/page-title.component';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';
import { RxStompService } from '../../_shared/service/rx-stomp.service';
import { ToastService } from '../../_shared/service/toast-service';
// import { EntryService } from '../../service/entry.service';
import * as dayjs from 'dayjs';
import { PageTitleComponent } from '../_component/page-title.component';
import { EntryService } from '../_service/entry.service';
import { RunService } from '../_service/run.service';
// import { BrowserQRCodeReader } from '@zxing/library';
// declare const qrcode: any;
// declare const zdecoder: any;

@Component({
    selector: 'app-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    imports: [RegisterComponent, PageTitleComponent, NgClass, NgStyle, RouterLink, FaIconComponent, RouterLinkActive, RouterOutlet, SafePipe]
})
export class StartComponent implements OnInit {
  appLoading: boolean;
  validPath: boolean;
  baseApi = baseApi;
  base = base;
  readonly VAPID_PUBLIC_KEY = "BIRiQCpjtaORtlvwZ7FzFkf8V799iGvEX1kQtO86y-BdiGpAMvXN4UDU1DWEqrpPEAiDDVilG8WKk62NjFc1Opo";



  constructor(private userService: UserService, private swPush: SwPush, private pushService: PushService,
    private runService: RunService, private router: Router, private route: ActivatedRoute, private utilityService: UtilityService, private modalService: NgbModal,
    private location: PlatformLocation, private titleService: Title, private pageTitleService: PageTitleService,
    private http: HttpClient, private toastService: ToastService,
    private cdr: ChangeDetectorRef,private entryService: EntryService, private rxStompService: RxStompService,
    private logService: LogService) {
    location.onPopState(() => this.modalService.dismissAll(''));
    this.utilityService.testOnline$().subscribe(online => this.offline = !online);
    this.swPush.notificationClicks.subscribe(arg => {
      console.log(
        'Action: ' + arg.action,
        'Notification data: ' + arg.notification.data,
        'Notification data.url: ' + arg.notification.data.url,
        'Notification data.body: ' + arg.notification.body,
      );
    });
  }


  user: any;
  // formList: any;
  badge: any;
  app: any;
  // searchText: string = "";
  active = false;
  path: string;
  pushDismissed:boolean;
  // logs: any[];

  navToggle: any = { 0: true };

  offline = false;

  naviData: any = {}

  navis: any;

  preurl: string = '';
  appId: number;

  subscription: Subscription;
  sidebarActive: boolean = false;
  editMode: boolean = false;
  frameless: boolean = false;

  appUserList: any[];

  getIcon = (str) => str ? str.split(":") : ['far', 'file'];

  $param$: any = {};

  accessToken:string='';

  liveSubscription: any[] = [];

  appUrl:string ='';

  ngOnInit() {

    // console.log("start-init");
    this.frameless = (getQuery("noframe") || window.localStorage.getItem("noframe")) == 'true';
    window.localStorage.setItem("noframe", this.frameless + '');


    this.pushDismissed = localStorage.getItem("pushDismissed")=='1';

    this.accessToken = this.userService.getToken();

    this.userService.getUser()
      .subscribe((user) => {
        this.user = user;
        this.route.params
          .subscribe((params: Params) => {
            this.$param$ = params;
            this.appId = params['appId'];
            if (this.appId) {
              // console.log("App by id", this.appId)
              this.preurl = `/run/${this.appId}`;
              this.runService.$preurl.set(this.preurl);
              this.getApp(this.appId);

              // ONLY RUN IN DESIGN TO MIMICK ACTUAL USER FOR APP
              // var runas = prompt("Run preview as (email): ", user.email);
              // if (runas) {
              //   this.userService.getUserDebug(runas, this.appId)
              //     .subscribe(user_debug => {
              //       this.user = user_debug;
              //     })
              // }
              ////////////
              if (!this.frameless) {
                this.getNavis(this.appId, this.user.email);
                this.getNaviData(this.appId, this.user.email);
              }
              // this.getStart(this.appId);
              this.editMode = true;
              this.getDesignUrl();
            } else {
              // console.log("App by path", this.getPath())
              this.getAppByPath(this.getPath());
            }
            this.baseUrl = (location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')) + '/#' + this.preurl;
          });
      })

    this.subscription = this.pageTitleService.openAnnounced$.subscribe(
      opened => {
        this.sidebarActive = opened
      }
    )
  }

  dismissPush(){
    localStorage.setItem("pushDismissed","1");
    this.pushDismissed = true;
  }

  saveAppUser(selectedRoles) {
    var payload = {
      email: this.user.email,
      groups: selectedRoles,
      name: this.user.name,
      autoReg: false
    }
    this.runService.regAppUser(this.app.id, payload)
      .subscribe(res => {
        this.user = res.user;
        this.userService.setUser(res.user);
        if (!this.frameless) {
          this.getNavis(this.app.id, this.user.email);
          this.getNaviData(this.app.id, this.user.email);
        }
      });
  }

  // saveUserDetail(user){
  //   this.runService.saveUserDetails(this.user.id,user)
  //   .subscribe(user=>{
  //     this.user=user;
  //   })
  // }


  pushSub: any;
  actualSub: any;
  pushSubError: any;
  checkPush(app) {
    if (app.canPush) {
      this.swPush.subscription
        .pipe(take(1))
        .subscribe(sub => {
          if (sub) {
            this.actualSub = sub;
            this.pushService.checkPush(sub.endpoint)
              .subscribe(res => this.pushSub = res)
          }
        })
    }
  }

  subscribePush() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        this.actualSub = sub;
        this.pushService.subscribePush(this.user.id, sub)
          .subscribe(res => this.pushSub = res);
      })
      .catch(err => { this.pushSubError = { err: err }; console.log(err) });

  }

  onceDone() {
    this.runService.onceDone(this.app.id, this.user.email, true)
    .subscribe({
      next:res=>{
        this.user = res;
        this.userService.setUser(res);
      },
      error:err=>{
        this.user.once = true;
        this.userService.setUser(this.user);
      }
    })
  }

  logout() {
    // this.userService.clearStorage('user');
    this.userService.logout();
    // .subscribe(user=>this.user=user);
  }


  getPath() {
    if (window.location.host.indexOf(domainBase) > -1) {
      return 'path:' + window.location.host.match(domainRegex)[1];
    } else {
      return 'domain:' + window.location.hostname;
    }
  }

  hideSb() {
    setTimeout(() => { this.sidebarActive = false }, 300)
  }

  screen: any;
  mismode: boolean;
  startPage:string='start';
  getAppByPath(path) {
    this.appLoading = true;
    this.runService.getAppByPath(path, { email: this.user.email })
      .subscribe({
        next: (res) => {
          this.appLoading = false;
          if (res) {
            this.validPath = true;
            this.app = res;
            this.runService.$app.set(this.app);
            // this.runService.appId = this.app.id;
            // this.runService.app = this.app;
            if (!this.frameless) {
              this.getNavis(res.id, this.user.email);
              this.getNaviData(res.id, this.user.email);
            }
            if (this.app.layout == 'topnav') {
              this.navToggle = {};
            }
            this.titleService.setTitle(this.app.title);
            if (this.app.once) {
              this.runService.getScreen(this.app.once)
                .subscribe(screen => this.screen = screen);
            }

            if (!this.app.live){
              if (!path.includes("--dev")){ // app is dev && path not --dev
                this.mismode = true;
                // Show mismode: App is under maintenance
              }
            }else{
              if (path.includes("--dev")){  // app is live && path --dev
                this.mismode = true;
                // show mismode: App is live at url
              }
            }
            this.appUrl = location.protocol + '//' + this.app.appPath + "." + domainBase;

            this.startPage = res.startPage??'start'; // make sure startPage always set if defined

            let url = this.router.url.split('?')[0].replace('/', '');
            
            if (!url){
              if (res.startPage) {
                // console.log('ada startpage', url);
                // this.startPage = res.startPage;
                this.router.navigate([res.startPage], { relativeTo: this.route, queryParams: this.route.snapshot.queryParams });
              }else{
                // console.log('x ada startpage', url);
                this.router.navigate(['start'],{ relativeTo: this.route});
              }
            }

          } else {
            this.validPath = false;
          }
          this.checkPush(this.app);
          this.initScreen(this.app.f);
        },
        error: (err) => {
          this.validPath = false;
          this.appLoading = false;
        }
      });
  }

  isDev: boolean;
  getApp(id) {
    this.appLoading = true;
    this.runService.getApp(id, { email: this.user.email })
      .subscribe({
        next: (res) => {
          this.app = res;
          this.runService.$app.set(this.app); 

          this.appLoading = false;
          // this.isDev = this.app.email.indexOf(this.userService.getActualUser().email) > -1;

          this.runService.getAppUserByEmail(id, { email: this.user.email })
            .subscribe(appUserList => {
              this.appUserList = appUserList;
            });

          if (this.app.layout == 'topnav') {
            this.navToggle = {};
          }
          if (this.app.once) {
            this.runService.getScreen(this.app.once)
              .subscribe(screen => this.screen = screen);
          }
          this.checkPush(this.app);
          this.initScreen(this.app.f);
        },
        error: (err) => this.appLoading = false
      })
  }

  getNavis(id, email) {
    this.runService.getNavis(id, email)
      .subscribe(res => {
        this.navis = res;
        this.runService.$navis.set(res);   
        this.runPre();
      })
  }

  getNaviData(id, email) {
    this.runService.getNaviData(id, email)
      .subscribe(res => {
        this.naviData = res;
        this.runService.$naviData.set(res);
        this.runPre();
      })
  }

  darkMode: boolean = false;
  toggleDark() {
    this.darkMode = !this.darkMode;
    // localStorage.setItem("darkMode",this.darkMode+"");
  }

  designUrl: any;
  getDesignUrl() {
    var split = location.hash.split('/');
    var appId = split[2].replace(/\D/g,'');
    if (split[3]) {
      if (['form', 'dataset', 'dashboard', 'screen'].indexOf(split[3]) > -1) {
        this.designUrl = {
          url: `/design/${appId}/ui/${split[3]}`,
          query: { id: split[4] }
        }
      } else if(['profile'].indexOf(split[3]) > -1){
        this.designUrl = {
          url: `/design/${appId}/`,
          query: undefined
        }
      }else if(['start'].indexOf(split[3]) > -1){
        this.designUrl = {
          url: `/design/${appId}/ui/navi`,
          query: undefined
        }
      } else {
        this.designUrl = {
          url: `/design/${appId}/${split[3]}`,
          query: { id: split[4] }
        }
      }
    } else {
      this.designUrl = {
        url: `/design/${appId}/`,
        query: undefined
      }
    }
  }

  baseUrl: string = '';
  $this$: any = {}

  preCheck(f) {
    let res = undefined;
    try {
      if (f.pre){
        let pre = f.pre.trim();
        res = this._pre(pre);//new Function('$', '$prev$', '$user$', 'return ' + f.pre)(this.entry.data, this.entry && this.entry.prev, this.user);
      }
    } catch (e) { this.logService.log(`{form-${f?.code}-precheck}-${e}`) }
    return !f.pre || res;
  }

  preGroup:any={}
  preItem:any={}
  runPre(){
    this.navis?.forEach(group=>{
      this.preGroup[group.id]=this.preCheck(group);
      group.items?.forEach(item=>{
        this.preItem[item.id]=this.preCheck(item);
      })
    })
  }


  _pre = (v) => new Function('$app$','$navi$','$navis$', '$badge$', '$user$','$conf$', '$this$', '$param$','$baseUrl$','$token$', `return ${v}`)
  (this.app,this.naviData,this.navis, this.badge, this.user, this.runService?.appConfig, this.$this$, this.$param$, this.baseUrl, this.accessToken);

  
  // _eval = (v) => new Function('$app$', '$navi$', '$navis$', '$badge$', '$user$', '$conf$', '$this$','$loadjs$', '$param$','$http$', '$post$', '$endpoint$', 'ServerDate', '$base$', '$baseUrl$','$baseApi$', '$token$', `return ${v}`)
  //   (this.app, this.naviData, this.navis, this.badge, this.user, this.runService?.appConfig, this.$this$, this.loadScript, this.$param$, this.httpGet, this.httpPost, this.endpointGet, ServerDate, this.base, this.baseUrl, this.baseApi, this.accessToken);

  _eval = (v) => new Function('$app$','$_', '$', '$prev$', '$user$', '$conf$', '$http$', '$post$', '$endpoint$', '$this$', '$loadjs$','$digest$', '$param$', '$log$', '$update$', '$updateLookup$', '$toast$', '$base$', '$baseUrl$', '$baseApi$', 'dayjs', 'ServerDate', 'echarts', '$live$', '$token$', '$merge$', '$web$', '$go','$pop','$q$','$showNav$',
  `return ${v}`)(this.app, {}, {}, {}, this.user, this.runService?.appConfig, this.httpGet, this.httpPost, this.endpointGet, this.$this$, this.loadScript, this.$digest$, this.$param$, this.log, this.updateField, this.updateLookup, this.$toast$, this.base, this.baseUrl, this.baseApi, dayjs, ServerDate, null, this.runService?.$live$(this.liveSubscription, this.$digest$), this.accessToken, deepMerge, this.http, null, null, this.$q, this.openNav);



  compileTpl(html, data) {
    var f = "";
    try {
      f = compileTpl(html, data);
    } catch (e) {
      this.logService.log(`{start-compiletpl}-${e}`)
    }
    return f;
  }

  initScreen(js) {
    let res = undefined;
    let jsTxt = this.compileTpl(js, {$param$:this.$param$,$this$:this.$this$,$user$:this.user, $conf$:this.runService.appConfig,$base$:base, $baseUrl$:this.baseUrl, $baseApi$:baseApi})
    try {
      res = this._eval(jsTxt);// new Function('$', '$prev$', '$user$', '$http$', 'return ' + f)(this.entry.data, this.entry && this.entry.prev, this.user, this.httpGet);
    } catch (e) { this.logService.log(`{tiles-${this.app.title}-initNavi}-${e}`) }
    this.runPre();
    return res;
  }

  httpGet = (url, callback, error) => lastValueFrom(this.runService.httpGet(url, callback, error).pipe(tap(()=>this.$digest$())));
  httpPost = (url, body, callback, error) => lastValueFrom(this.runService.httpPost(url, body, callback, error).pipe(tap(()=>this.$digest$())));
  endpointGet = (code, params, callback, error) => lastValueFrom(this.runService.endpointGet(code, this.app?.id, params, callback, error).pipe(tap(()=>this.$digest$())));
  
  loadScript = loadScript;

  $digest$ = () => {
    this.runService.$startTimestamp.set(Date.now());
    this.runPre();
    this.cdr.detectChanges()
  }

  $toast$ = (content, opt) => this.toastService.show(content, opt);

  log = (log) => this.logService.log(JSON.stringify(log));

  elMap:any = {}
  $q = (el)=>{
    if (!this.elMap[el]){
      this.elMap[el] = document.querySelector(el);
    }
    return this.elMap[el];
  }

  openNav = (opened: boolean)=>{
    this.pageTitleService.open(opened);
  }

  
  updateField = (entryId, value, callback, error) => {
    return lastValueFrom(this.entryService.updateField(entryId, value, this.runService.$app().id)
      .pipe(
        tap({ next: callback, error: error }), first()
      ));
  }

  updateLookup = (entryId, value, callback, error) => {
    return lastValueFrom(this.entryService.updateLookup(entryId, value, this.runService.$app().id)
      .pipe(
        tap({ next: callback, error: error }), first()
      ));
  }

  // getUrl(){
  //   return location.protocol + '//' + this.app.appPath + "." + domainBase;
  // }

  // showEdit() {
  //   var email = this.userService.getActualUser().email
  //   return this.app?.email.indexOf(email) > -1;
  // }

}
