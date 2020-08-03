!function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var c=e[n];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(t,c.key,c)}}function n(t,n,c){return n&&e(t.prototype,n),c&&e(t,c),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{k0tg:function(e,c,i){"use strict";i.r(c),i.d(c,"AuthModule",(function(){return k}));var r=i("2kYt"),o=i("DSWM"),a=i("sEIs"),s=i("unpb"),u=i("PIN6"),d=i("espW"),p=i("EM62"),l=i("jWju"),f=function(){function e(n,c){t(this,e),this.cinerino=n,this.router=c,this.environment=Object(u.a)()}return n(e,[{key:"ngOnInit",value:function(){return t=this,e=void 0,n=void 0,c=regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.cinerino.getServices();case 3:this.router.navigate([this.environment.BASE_URL]),t.next=10;break;case 6:return t.prev=6,t.t0=t.catch(0),t.next=10,this.cinerino.signIn();case 10:case"end":return t.stop()}}),t,this,[[0,6]])})),new(n||(n=Promise))((function(i,r){function o(t){try{s(c.next(t))}catch(e){r(e)}}function a(t){try{s(c.throw(t))}catch(e){r(e)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}s((c=c.apply(t,e||[])).next())}));var t,e,n,c}}]),e}();f.\u0275fac=function(t){return new(t||f)(p.Jc(d.a),p.Jc(a.b))},f.\u0275cmp=p.Dc({type:f,selectors:[["app-auth-index"]],decls:1,vars:1,consts:[["process","process.authAction.CheckLogin",3,"isLoading"]],template:function(t,e){1&t&&p.Kc(0,"app-loading",0),2&t&&p.fd("isLoading",!0)},directives:[l.a],styles:[""]});var h=i("sN6X"),v=i("cHUu"),m=i("mOXJ"),g=function(t,e,n,c){return new(n||(n=Promise))((function(i,r){function o(t){try{s(c.next(t))}catch(e){r(e)}}function a(t){try{s(c.throw(t))}catch(e){r(e)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}s((c=c.apply(t,e||[])).next())}))};function w(t,e){if(1&t&&(p.Pc(0,"li",9),p.Pc(1,"div",10),p.Pc(2,"div",11),p.Pc(3,"div",12),p.Pc(4,"div",13),p.Kc(5,"img",14),p.Oc(),p.Pc(6,"p",15),p.xd(7),p.Oc(),p.Oc(),p.Pc(8,"a",16),p.xd(9,"\u9078\u629e"),p.Oc(),p.Oc(),p.Oc(),p.Oc()),2&t){var n=e.$implicit;p.wc(5),p.fd("src",n.logo,p.rd)("alt",n.name),p.wc(2),p.yd(n.name),p.wc(1),p.fd("href","/?projectId="+n.id,p.rd)}}function b(t,e){if(1&t){var n=p.Qc();p.Pc(0,"div",2),p.Pc(1,"h2",3),p.xd(2,"\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u9078\u629e"),p.Oc(),p.Pc(3,"p",4),p.xd(4,"\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044\u3002"),p.Oc(),p.Pc(5,"ul",5),p.vd(6,w,10,4,"li",6),p.Zc(7,"async"),p.Oc(),p.Pc(8,"div",7),p.Pc(9,"button",8),p.Wc("click",(function(){return p.pd(n),p.Yc().signOut()})),p.xd(10,"\u623b\u308b"),p.Oc(),p.Oc(),p.Oc()}if(2&t){var c,i=p.Yc(),r=null==(c=p.ad(7,1,i.master))?null:c.projects;p.wc(6),p.fd("ngForOf",r)}}var x=function(){function e(n,c,i,r){t(this,e),this.store=n,this.masterService=c,this.utilService=i,this.cinerinoService=r}return n(e,[{key:"ngOnInit",value:function(){return g(this,void 0,void 0,regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.isLoading=this.store.pipe(Object(h.m)(m.b)),this.master=this.store.pipe(Object(h.m)(m.c)),this.projects=[],t.next=5,this.masterService.getProjects();case 5:return this.utilService.loadStart({process:"load"}),t.next=8,this.masterService.getData();case 8:1!==(e=t.sent.projects).length?this.utilService.loadEnd():location.href="/?projectId="+e[0].id;case 10:case"end":return t.stop()}}),t,this)})))}},{key:"signOut",value:function(){return g(this,void 0,void 0,regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.cinerinoService.getServices();case 3:return t.next=5,this.cinerinoService.signOut();case 5:t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),console.error(t.t0);case 10:case"end":return t.stop()}}),t,this,[[0,7]])})))}}]),e}();x.\u0275fac=function(t){return new(t||x)(p.Jc(h.b),p.Jc(v.c),p.Jc(v.k),p.Jc(v.a))},x.\u0275cmp=p.Dc({type:x,selectors:[["app-auth-signin"]],decls:4,vars:6,consts:[["class","contents-width mx-auto px-3 py-5",4,"ngIf"],["process","process.masterAction.GetProjects",3,"isLoading"],[1,"contents-width","mx-auto","px-3","py-5"],[1,"text-large","mb-4","text-center","font-weight-bold"],[1,"mb-4","text-md-center"],[1,"d-md-flex","flex-wrap","mb-4"],["class","my-md-2 mb-3",4,"ngFor","ngForOf"],[1,"buttons","mx-auto","text-center"],["type","button",1,"btn","btn-link",3,"click"],[1,"my-md-2","mb-3"],[1,"card","mx-md-2","h-100"],[1,"card-body"],[1,"d-flex","align-items-center","mb-4"],[1,"mr-2"],[1,"logo",3,"src","alt"],[1,"font-weight-bold"],[1,"btn","btn-primary","btn-block","py-3",3,"href"]],template:function(t,e){if(1&t&&(p.vd(0,b,11,3,"div",0),p.Zc(1,"async"),p.Kc(2,"app-loading",1),p.Zc(3,"async")),2&t){var n,c=(null==(n=p.ad(1,2,e.master))?null:n.projects.length)>0;p.fd("ngIf",c),p.wc(2),p.fd("isLoading",p.ad(3,4,e.isLoading))}},directives:[r.l,l.a,r.k],pipes:[r.b],styles:[".logo[_ngcontent-%COMP%]{width:3rem}@media (max-width:767.98px){.logo[_ngcontent-%COMP%]{width:2rem}}.text-overflow[_ngcontent-%COMP%]{overflow:hidden;white-space:nowrap;width:100%;text-overflow:ellipsis}li[_ngcontent-%COMP%]{width:33%}@media (max-width:767.98px){li[_ngcontent-%COMP%]{width:auto}}.btn-primary.disabled[_ngcontent-%COMP%]{opacity:1!important;background-color:#666!important;border-color:#666!important;color:#eee!important}"]});var y=function(){function e(n,c,i){t(this,e),this.router=n,this.purchaseService=c,this.orderService=i}return n(e,[{key:"ngOnInit",value:function(){this.orderService.delete(),this.purchaseService.delete(),this.router.navigate(["/"])}},{key:"selectProject",value:function(){}}]),e}();y.\u0275fac=function(t){return new(t||y)(p.Jc(a.b),p.Jc(v.f),p.Jc(v.d))},y.\u0275cmp=p.Dc({type:y,selectors:[["app-auth-signout"]],decls:1,vars:1,consts:[["process","process.authAction.Logout",3,"isLoading"]],template:function(t,e){1&t&&p.Kc(0,"app-loading",0),2&t&&p.fd("isLoading",!0)},directives:[l.a],styles:[""]});var O=[{path:"",children:[{path:"",component:f},{path:"signin",canActivate:[s.a],component:x},{path:"signout",component:y}]}],P=function e(){t(this,e)};P.\u0275mod=p.Hc({type:P}),P.\u0275inj=p.Gc({factory:function(t){return new(t||P)},imports:[[a.d.forChild(O)],a.d]});var k=function e(){t(this,e)};k.\u0275mod=p.Hc({type:k}),k.\u0275inj=p.Gc({factory:function(t){return new(t||k)},imports:[[r.c,P,o.a]]})}}])}();