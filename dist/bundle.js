!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=8)}([function(t,e,i){"use strict";e.a=100},function(t,e,i){"use strict";e.a=function(t){return n[t]},e.c=s,e.b=function(t){return t+3&3};const n=Array.from({length:4}).map((t,e)=>(function(t){const e=t>1?-1:1;return 1&t?{y:e,x:0}:{x:e,y:0}})(e));function s(t){return 2^t}},function(t,e,i){"use strict";e.a=s,e.d=r,e.c=function(t,...e){return e.reduce(r,t)},e.b=function(t){return 4&t?t:3&-t},e.e=function(t,e){return e?3&t|4:3&t};var n=i(1);i(3);function s(t,e){return(3&t)+(4&t?-e:e)&3}function r(t,e){const i=s(t,s(e,0)),r=s(t,s(e,1));return window.debug&&console.log(i,r),i|(Object(n.b)(i)===r?4:0)}},function(t,e,i){"use strict";var n=i(1);class s{constructor(t){this.x=t.x,this.y=t.y}step(t,e=1){const{x:i,y:s}=Object(n.a)(t);return this.x+=i*e,this.y+=s*e,this}fork(){return new s(this)}}e.a=s},function(t,e,i){"use strict";var n=i(15),s=i(1),r=i(16);let o=0;e.a=class{constructor(){this.links=[null,null,null,null],this.id=o++,this.entities=new Set,this.tileViews=Array(8);for(let t=0;t<8;t++)this.tileViews[t]=new r.a(this,t)}getReference(t){return this.links[t]}unlink(t,e=!0){if(this.links[t]){const i=this.links[t];e&&i.to.unlink(i.destSide,!1),this.links[t]=null}}link(t,e,i=Object(s.c)(t),{reflect:r=!1,addReverse:o=!0}={}){this.unlink(t),this.links[t]=n.a.fromOpts(e,t,i,r),o&&e.link(i,this,t,{addReverse:!1,reflect:r})}getView(t){return this.tileViews[t]}render(t,e){this.loadTimer=e}isolate(){for(let t=0;t<4;t++)this.unlink(t)}stepOn(t){}interact(t){}track(t){this.entities.add(t)}}},function(t,e,i){"use strict";var n=i(4),s=i(0);e.a=class extends n.a{constructor(t){super(),this.stepTime=0,this.color=t,this.noiseLevel=1-.2*Math.random()}render(t,e){super.render(t,e),t.globalAlpha=(1-Math.pow(2,(this.stepTime-e)/1e3)/3)*this.noiseLevel,t.fillStyle=this.color,t.fillRect(0,0,s.a,s.a),t.globalAlpha=1,t.strokeStyle="black"}stepOn(t){this.stepTime=t}}},function(t,e,i){"use strict";e.a=function(t){return t.reduce((t,e)=>i=>t(e(i)),t=>t)}},function(t,e,i){"use strict";var n=i(19),s=i(2),r=i(0);e.a=class extends n.a{constructor(t,e,i){super(t,e,i),this.gone=!1,console.log(this.trackingTiles),this.register()}move(t,e){const i=super.move(t,e);return this.register(),i}respawn(t){super.respawn(t),this.register()}render(t){}kill(){this.gone=!0}isOnTile(t){if(this.gone)return!1;for(let e=0;e<this.trackWidth;e++)for(let i=0;i<this.trackWidth;i++)if(this.trackingTiles[e][i].view.tile.id===t.id)return!0;return!1}register(){for(let t=0;t<this.trackWidth;t++)for(let e=0;e<this.trackWidth;e++)this.trackingTiles[t][e].view.track(this)}renderInContext(t,e){const i=new Set;window.rh=i;for(let n=0;n<this.trackWidth;n++)for(let o=0;o<this.trackWidth;o++){const h=this.trackingTiles[n][o];if(h.view.tile===e){const e=`${h.view.orientation}/${h.pt.x-h.onEntityX}/${h.pt.y-h.onEntityY}`;i.has(e)||(i.add(e),t.ctx.save(),t.applyOrientation(Object(s.b)(h.view.orientation)),t.ctx.translate((h.pt.x-h.onEntityX)*r.a,(h.pt.y-h.onEntityY)*r.a),this.render(t.ctx),t.ctx.restore())}}}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=new(i(9).a);window.app=n},function(t,e,i){"use strict";var n=i(10),s=i(13),r=i(3),o=i(18),h=i(0);const a=s.a(),c={w:3,a:2,s:1,d:0},l={i:3,l:0,k:1,j:2},u=.005;e.a=class{constructor(){this.stepables=new Set,this.vel=new r.a({x:0,y:0}),this.monitorKeys={w:!1,a:!1,s:!1,d:!1},this.interactLock=!1,this.can=document.getElementById("can"),this.renderer=new n.a(this.can),requestAnimationFrame(t=>requestAnimationFrame(e=>this.tick(e,e-t,Math.random()))),document.onkeydown=(t=>{this.keyDown(t)}),document.onkeyup=(t=>{this.keyUp(t)}),this.can.ondblclick=(t=>{this.can.requestPointerLock(),this.allEvt(t)}),this.can.onmousemove=(t=>{document.pointerLockElement===this.can&&Math.abs(t.movementX)<200&&Math.abs(t.movementY)<200&&this.player.move(t.movementX/h.a,t.movementY/h.a),this.allEvt(t)}),this.player=new o.a(a.getView(0).getNeighbor(0),this),this.cam=this.player.center.clone()}tick(t,e,i){this.can.width===innerWidth&&this.can.height===innerHeight||(this.can.width=innerWidth,this.can.height=innerHeight),this.tryMove(e);for(let t of this.stepables)t.step(e)||this.stepables.delete(t);const n=this.locCam||this.player.center;this.cam.copy(n),n.view.stepOn(t),this.cam.move(0,0)||console.log("wat"),this.renderer.render(this.cam.view,this.cam.pt.x,this.cam.pt.y,t,0,0),this.watNumber!==i&&console.log("wat"),this.watNumber=i,requestAnimationFrame(e=>this.tick(e,e-t,i))}keyDown(t){t.key in this.monitorKeys&&(this.monitorKeys[t.key]=!0),"e"!==t.key||this.interactLock||(this.interactLock=!0,this.player.center.view.interact(performance.now())),t.key in l&&this.player.shoot(l[t.key]),this.allEvt(t)}allEvt(t){t.shiftKey&&!this.locCam&&(this.locCam=this.player.center.clone()),t.shiftKey||(this.locCam=null)}keyUp(t){t.key in this.monitorKeys&&(this.monitorKeys[t.key]=!1),"e"===t.key&&(this.interactLock=!1),"h"===t.key&&this.player.respawn(a.getView(0)),this.allEvt(t)}tryMove(t){this.vel.x=0,this.vel.y=0;for(let e in c)this.monitorKeys[e]&&this.vel.step(c[e],u*t);0===this.vel.x&&0===this.vel.y||this.player.move(this.vel.x,this.vel.y)}addStepable(t){this.stepables.add(t)}}},function(t,e,i){"use strict";var n=i(11),s=i(0);function r(t){return Math.max(t**2,(t+1)**2)}const o=!1,h=!1,a=12;e.a=class{constructor(t){this.projector=new n.a,this.can=t,this.ctx=t.getContext("2d")}render(t,e,i,n,c,l){const u=this.scale=1/Math.max(s.a*a/this.can.width,s.a*a/this.can.height),g=this.projector.project(t,e,i,this.can.width/s.a/2/u,this.can.height/s.a/2/u,c,l);this.ctx.fillStyle="rgba(0,0,0,1)",this.ctx.fillRect(0,0,this.can.width,this.can.height),this.ctx.save(),this.ctx.translate(this.can.width/2,this.can.height/2),this.ctx.scale(u,u),this.ctx.translate(c*s.a,l*s.a);for(let t of g){this.ctx.save(),h&&(0!==t.x||-2!==t.y?(this.ctx.beginPath(),this.ctx.rect((t.x-e)*s.a,(t.y-i)*s.a,s.a,s.a),this.ctx.clip()):(this.ctx.beginPath(),this.ctx.moveTo(1e3*Math.cos(t.minTheta),1e3*Math.sin(t.minTheta)),this.ctx.lineTo(0,0),this.ctx.lineTo(1e3*Math.cos(t.maxTheta),1e3*Math.sin(t.maxTheta)),this.ctx.strokeStyle="orange",this.ctx.stroke()));const a=Math.sqrt(r(t.x-e)+r(t.y-i))+Math.sqrt(2);if(!t.isRoot&&2!==t.anglesLength){this.ctx.beginPath();for(let e=0;e<t.anglesLength;e+=2){const i=t.angles[e],n=t.angles[e+1];if(i===n)continue;const r=Math.abs(1/Math.cos((i-n)/2));this.ctx.moveTo(0,0),this.ctx.lineTo(Math.cos(i)*a*s.a*r,Math.sin(i)*a*s.a*r),this.ctx.lineTo(Math.cos(n)*a*s.a*r,Math.sin(n)*a*s.a*r),this.ctx.lineTo(0,0)}o&&(this.ctx.lineWidth=1,this.ctx.strokeStyle="pink",this.ctx.stroke()),this.ctx.clip()}this.ctx.translate((t.x-e)*s.a,(t.y-i)*s.a),this.applyOrientation(t.view.orientation),t.view.tile.render(this.ctx,n),o&&(this.ctx.fillStyle="black",this.ctx.fillText(`${t.view.id}`,10,10));let c=!1;const l=t.view.tile;for(let e of t.view.tile.entities)e.isOnTile(t.view.tile)?(c||(this.ctx.beginPath(),this.ctx.rect(0,0,s.a,s.a),this.ctx.clip(),c=!0),e.renderInContext(this,t.view.tile)):l.entities.delete(e);this.ctx.restore()}this.ctx.restore()}applyOrientation(t,e=!0){const{ctx:i}=this;e&&this.ctx.translate(.5*s.a,.5*s.a),i.rotate((3&t)*Math.PI/2),4&t&&i.scale(1,-1),e&&this.ctx.translate(-.5*s.a,-.5*s.a)}}},function(t,e,i){"use strict";var n=i(12);function s(t){return e=t+Math.PI,i=2*Math.PI,(e%i+i)%i-Math.PI;var e,i}function r(t,e){return s(e-t)+t}const o=Math.PI/1e5;const h=!1,a=Math.PI/1e5;class c{constructor(){this.angles=new Float64Array(32),this.anglesLength=0}static id(t,e,i){return`${t.id},${e},${i}`}init(t,e,i,n=!1,s,o){if(this.view=t,this.x=e,this.y=i,this.anglesLength=0,this.centerAngle=Math.atan2(i,e),this.offsetX=s,this.offsetY=o,n)for(let t=0;t<3;t++)this.angles[this.anglesLength++]=2*Math.PI/3*(t+.5),this.angles[this.anglesLength++]=2*Math.PI/3*(t+1.5);else{let t=1/0,n=-1/0;for(let h=0;h<2;h++)for(let a=0;a<2;a++){const c=r(this.centerAngle,Math.atan2(i-o+a,e-s+h));c<t&&(t=c),c>n&&(n=c)}this.minTheta=t,this.maxTheta=n,this.angles[this.anglesLength++]=t,this.angles[this.anglesLength++]=t,this.angles[this.anglesLength++]=n,this.angles[this.anglesLength++]=n}return this.id=c.id(t,e,i),this.isRoot=n,this}addRange(t,e){this.addRangeImpl(r(this.centerAngle,t),r(this.centerAngle,e))}addRangeImpl(t,e){if(this.isRoot)return;if(h&&console.log("adding range",this.id,t,e),e===t)return;if(e<t)return void this.addRangeImpl(e,t);let i=0;for(;i<this.angles.length&&!(i%2==1?this.angles[i]+o>=t:this.angles[i]>=t+o);i++);let n=i;for(;n<this.angles.length&&!(n%2==1?this.angles[n]+o>e:this.angles[n]>o+e);n++);const s=i%2==0,r=n%2==0,a=i-n+(s?1:0)+(r?1:0);this.angles.copyWithin(n+a,n,this.anglesLength),this.anglesLength+=a,s&&(this.angles[i++]=t),r&&(this.angles[i++]=e)}clean(){this.view=null}}const l=1e-5;e.a=class{constructor(){this.lookup=new Map,this.projectionPathPool=new n.a(()=>new c)}project(t,e,i,n,s,r,o){this.projectionPathPool.done(),this.que=[],this.lookup.clear(),this.offsetX=e,this.offsetY=i,this.renderRadiusX=n,this.renderRadiusY=s,this.displayOffsetX=r,this.displayOffsetY=o;const h=(t,n,s)=>{if(!t)return;0===n&&0===s&&(e<=l&&h(t.getNeighbor(2),-1,s),e>=1-l&&h(t.getNeighbor(0),1,s),i<=l&&h(t.getNeighbor(3),n,-1),i>=1-l&&h(t.getNeighbor(1),n,1));const r=this.projectionPathPool.pop().init(t,n,s,!0,e,i);this.lookup.set(r.id,r),this.que.push(r)};for(h(t,0,0);this.que.length>0;){const t=this.que.shift();if(this.considerItem(t),this.que.length>1e3){console.warn("oversize que");break}}return this.lookup.values()}considerItem(t){Math.sqrt(t.x**2+t.y**2)>100||((t.x>=0||t.isRoot)&&this.considerSide(t,!0,1,t.view.getNeighbor(0),t.x+1,t.y),(t.y>=0||t.isRoot)&&this.considerSide(t,!1,1,t.view.getNeighbor(1),t.x,t.y+1),(t.x<1||t.isRoot)&&this.considerSide(t,!0,0,t.view.getNeighbor(2),t.x-1,t.y),(t.y<1||t.isRoot)&&this.considerSide(t,!1,0,t.view.getNeighbor(3),t.x,t.y-1))}considerSide(t,e,i,n,r,o){if(r-this.offsetX+this.displayOffsetX>this.renderRadiusX||r-this.offsetX+1+this.displayOffsetX<-this.renderRadiusX||o-this.offsetY+this.displayOffsetY>this.renderRadiusY||o-this.offsetY+1+this.displayOffsetY<-this.renderRadiusY)return;if(!n)return;h&&console.log("consider side",e,i,n,r,o,t.id);const l=e?t.x+i-this.offsetX:t.y+i-this.offsetY,u=e?t.y-this.offsetY:t.x-this.offsetX,g=u+1;function f(t){return e?Math.atan2(t,l):-Math.atan2(t,l)+Math.PI/2}function d(t){if(Math.abs(s(t+(e?Math.PI/2:Math.PI)))<a)return f(u);if(Math.abs(s(t+(e?Math.PI/2:0)))<a)return f(g);const i=e?Math.tan(t):Math.tan(Math.PI/2-t),n=i*l;return h&&console.log("proj",t,i,n),(e?Math.cos(t):Math.sin(t))*l<0?(e?Math.sin(t):Math.cos(t))<0?f(u):f(g):n<u?f(u):n>g?f(g):t}let k=null;const p=(e,i)=>{const s=d(e),a=d(i);if(h&&console.log("proj section",t.id,e,i,s,a),!1!==s&&!1!==a&&s!==a){if(null===k){const t=c.id(n,r,o);this.lookup.has(t)?k=this.lookup.get(t):((k=this.projectionPathPool.pop()).init(n,r,o,!1,this.offsetX,this.offsetY),this.lookup.set(t,k),this.que.push(k))}k.addRange(s,a)}},w=(t,e)=>{if(Math.abs(s(e-t))>Math.PI/2){const i=s((t+e)/2);return p(s(t),i),void p(i,s(e))}p(s(t),s(e))};for(let e=0;e<t.angles.length/2;e++){const i=t.angles[2*e],n=t.angles[2*e+1];i!==n&&w(i,n)}}}},function(t,e,i){"use strict";e.a=class{constructor(t,e=64){this.usedIndex=0,this.makeT=t,this.items=[...Array(e)].map(()=>t())}pop(){return this.usedIndex+1>=this.items.length&&(this.items.push(this.makeT()),window.usedSize=this.items.length),this.items[this.usedIndex++]}done(){for(let t=this.usedIndex;t>=0;t--)this.items[t].clean();this.usedIndex=0}clean(){this.done()}}},function(t,e,i){"use strict";e.a=function(){return d([d([function(){const t=new n.a(9,9,[g("red")]),e=new n.a(9,9,[g("blue")]);return t.get(4,4).link(0,e.get(4,4)),e.get(8,8).link(1,t.get(0,0)),e.get(6,4).link(0,t.get(2,4)),t.get(4,7)}(),function(){const t=new n.a(9,9,[g("red")]),e=new n.a(9,9,[g("blue")]),i=t.get(4,4),r=e.get(4,4);let o;for(let t=0;t<4;t++){const e=(t+2)%4;t%2==0&&(o=new s.a("pink")),i.getReference(t).to.link(e,o),r.getReference(e).to.link(t,o)}return t.get(4,7)}(),function(){const t=new n.a(5,5,[a(5,5)]);for(let e=1;e<4;e++)t.get(2,e).link(0,t.get(2,e),0,{reflect:!0});return t.get(0,4)}(),function(){const t=new n.a(5,5,[l(2,2),a(5,5)]),e=new s.a("orange");return console.log(t),t.get(0,0).link(3,e),t.get(4,0).link(3,e,3,{reflect:!0}),t.get(4,4).link(0,e),t.get(2,2)}()],"pink"),d([function(){const t=new n.a(11,5,[l(5,2),a(10,5)]);for(let e=2;e<9;e++)t.get(e,2).isolate();for(let e=0;e<2;e++)t.get(1,e).link(0,t.get(8,e));return t.get(0,4)}(),function(){const t=new n.a(27,4,[a(27,4)]);for(let e=0;e<27;e+=2)for(let i=0;i<2;i++)e<25&&t.get(e,i).link(0,t.get(e+2,i)),e<26&&t.get(e+1,i).isolate();return t.get(0,3)}(),function(){const t=new n.a(50,2,[c(50/3)]);for(let e=0;e<5;e++){const i=new n.a(10,2,[c(10/3,e/5)]);for(let n=0;n<10;n++){const s=t.get(5*n+e,0);i.get(n,1).link(1,s)}}return t.get(0,1)}(),function(){const t=new n.a(7,7,[l(2,2),h(0,0,"pink"),a(7,7)]);for(let e=0;e<7;e++)1!==e&&5!==e&&(t.get(e,3).isolate(),t.get(3,e).isolate());return t.get(3,5).link(0,t.get(5,2),1),t.get(2,2)}()],"cyan"),d([function t(e=7){if(0===e)return new s.a("red");const i=`hsl(${360*Math.random()},50%,50%)`;const n=new s.a(i);function r(r){const o=new s.a(i);n.link(r,o,1),o.link(3,t(e-1),1)}r(3);r(1);r(2);r(0);return n}(),function(){const t=4;return function e(i=7){const s=`hsl(${360*Math.random()},50%,50%)`;if(0===i)return new n.a(t,t,[g(s)]);const r=new n.a(t,t,[g(s)]);const o=e(i-1);const h=e(i-1);const a=e(i-1);for(let e=0;e<t;e++)r.get(e,0).link(3,o.get(e,t-1)),r.get(0,t-1-e).link(2,h.get(e,t-1),1),r.get(t-1,e).link(0,a.get(e,t-1),1);return r}().get(Math.floor(t/2),t-1)}()],"red"),d([new n.a(3,3,[u()]).get(0,2),function(){const t=new n.a(3,3,[u()]),e=new s.a("white");for(let e=0;e<3;e++)t.get(0,e).link(2,t.get(2,e)),t.get(e,0).link(3,t.get(e,2));return e.link(3,t.get(0,2),1,{addReverse:!1}),e}(),function(){const t=new n.a(3,3,[u(4)]),e=new s.a("white");for(let e=0;e<3;e++)t.get(0,e).link(2,t.get(2,e),0,{reflect:!1}),t.get(e,0).link(3,t.get(2-e,2),1,{reflect:!0});return e.link(3,t.get(0,2),1,{addReverse:!1}),e}(),function(){const t=new n.a(3,3,[u(5)]),e=new s.a("white");for(let e=0;e<3;e++)t.get(0,e).link(2,t.get(0,e),2,{reflect:!0,addReverse:!1}),t.get(2,e).link(0,t.get(2,e),0,{reflect:!0,addReverse:!1}),t.get(e,2).link(1,t.get(e,2),1,{reflect:!0,addReverse:!1}),t.get(e,0).link(3,t.get(e,0),3,{reflect:!0,addReverse:!1});return e.link(3,t.get(0,2),1,{addReverse:!1}),e}(),function(){const t=new n.a(3,3,[u(4)]),e=new s.a("white");for(let e=0;e<3;e++)t.get(0,e).link(2,t.get(2,e)),t.get((e+1)%3,0).link(3,t.get(e,2));return e.link(3,t.get(0,2),1,{addReverse:!1}),e}()],"grey"),d([f(),f(30),function(t=10){let e=t-2,i=0;const s=new n.a(t,t,[a(t,t)]);let r=s.get(0,t-1);for(;e>2;){e-=.5;for(let t=0;t<e;t++)r=r.links[i].to;const t=r,n=i-1&3,s=r.links[i].to;r=s.links[n].to,s.isolate(),t.link(i,r,n+2&3),i=n}return s.get(0,t-1)}()],"blue")])[0][1]};var n=i(14),s=i(5),r=i(6),o=i(17);function h(t,e,i){return n=>(r,o)=>r===t&&o===e?new s.a(i):n(r,o)}function a(t,e,i=255){return n=>(n,r)=>new s.a(`rgb(${(n/t)**.5*255|0},${i},${(r/e)**.5*255|0})`)}function c(t,e=0){return i=>(i,n)=>new s.a(`hsl(${(i+e)/t*360|0},50%,50%)`)}function l(t,e){return Object(r.a)([h(t+1,e,"red"),h(t,e+1,"green"),h(t-1,e,"blue"),h(t,e-1,"cyan")])}function u(t=3){return e=>(e,i)=>new o.a(t)}function g(t){return e=>(e,i)=>new s.a(t)}function f(t=5,e=5){const i=new n.a(t,e,[a(t,e)]);for(let n=0;n<e;n++)i.get(t-1,n).link(0,i.get(0,e-n-1),2,{reflect:!0});return i.get(0,e-1)}function d(t,e="gold"){const i=[new s.a("red"),new s.a("pink")];for(let e=0;e<t.length-1;e++){const i=t[e],n=t[e+1];i instanceof Array&&n instanceof Array&&i[1].forEach((t,e)=>{t.link(0,n[0][e])})}const n=t.reduceRight(([t,i],n)=>{const r=new s.a(e),o=new s.a(e),h=new s.a(e),a=new s.a(e);return r.link(0,t),o.link(0,i),a.link(0,r),h.link(0,o),o.link(1,r),!1!==n&&o.link(3,n instanceof Array?n[1][0]:n),n instanceof Array&&h.link(3,n[0][0]),r.link(3,o),h.link(1,a),n instanceof Array?[a,h]:[r,o]},i);console.log(i);const r=i.map(t=>t.links[2].to);return i.map(t=>t.isolate()),[n,r]}},function(t,e,i){"use strict";var n=i(4);e.a=class{constructor(t,e,i=[]){const s=i.reduce((t,e)=>i=>t(e(i)),t=>t)((t,e)=>new n.a);this.tiles=[...Array(e)].map((e,i)=>[...Array(t)].map((t,e)=>s(e,i))),this.tiles.forEach((t,e)=>{t.forEach((i,n)=>{0!==e&&this.tiles[e-1][n].link(1,i),0!==n&&t[n-1].link(0,i)})})}get(t,e){return this.tiles[e][t]}}},function(t,e,i){"use strict";var n=i(2),s=i(1);class r{constructor(t,e,i){this.to=t,this.mtx=e,this.destSide=i}static fromOpts(t,e,i,o){return new r(t,Object(n.c)(Object(n.e)(-Object(s.c)(i),o),e),i)}}e.a=r},function(t,e,i){"use strict";var n=i(2);[...Array(8)].map(t=>new WeakMap);class s{static lookup(t,e){return t.tileViews[e]}constructor(t,e){this.tile=t,this.orientation=e,this.id=`${t.id},${e}`}getNeighbor(t){const e=this.tile.getReference(Object(n.a)(Object(n.b)(this.orientation),t));return e?s.lookup(e.to,Object(n.d)(this.orientation,e.mtx)):null}stepOn(t){this.tile.stepOn(t)}interact(t){this.tile.interact(t)}track(t){this.tile.track(t)}}e.a=s},function(t,e,i){"use strict";var n,s=i(5),r=i(0),o=i(6);function h(t){return t===n.RED?"RED":t===n.BLACK?"black":"grey"}!function(t){t[t.RED=-1]="RED",t[t.NONE=0]="NONE",t[t.BLACK=1]="BLACK"}(n||(n={}));class a{constructor(){this.turn=n.RED,this.won=n.NONE,this.blankTiles=0}}const c=r.a/6;function l(t){return e=>e?e.getNeighbor(t):null}function u(t){return Object(o.a)(t.map(l))}const g=[[3,1].map(l),[2,0].map(l),[[2,1],[3,0]].map(u),[[1,2],[0,3]].map(u),[[2,3],[1,0]].map(u),[[3,2],[0,1]].map(u)];class f extends s.a{constructor(t=3){super("white"),this.occupied=n.NONE,this.game=null,this.isWinningLine=!1,this.lengthForWin=t}render(t,e){super.render(t,e),t.fillStyle=h(this.occupied);const i=!this.game||this.game.won===n.NONE&&0!==this.game.blankTiles||this.isWinningLine?c:2*c;t.fillRect(i,i,r.a-2*i,r.a-2*i),this.game&&e-this.stepTime<100&&(t.strokeStyle=h(this.game.turn),t.lineWidth=5,t.strokeRect(i,i,r.a-2*i,r.a-2*i))}tallyInDir(t){let e=this.getView(0);for(let i=0;i<this.lengthForWin;i++)if(!(e=t(e))||!(e.tile instanceof f&&e.tile.occupied===this.occupied))return i;return this.lengthForWin}drawWinningLine(t){let e=this.getView(0);for(let i=0;i<this.lengthForWin;i++){if(!(e=t(e))||!(e.tile instanceof f&&e.tile.occupied===this.occupied))return;e.tile.isWinningLine=!0}}didWin(){for(let t of g){if(this.tallyInDir(t[0])+this.tallyInDir(t[1])+1>=this.lengthForWin)return this.drawWinningLine(t[0]),this.drawWinningLine(t[1]),this.isWinningLine=!0,!0}return!1}linkGame(t=new a){this.game!==t&&(this.occupied=n.NONE,this.isWinningLine=!1,this.game=t,t.blankTiles++,this.links.forEach(e=>{if(!e)return;const i=e.to;i instanceof f&&i.linkGame(t)}))}stepOn(t){super.stepOn(t),null===this.game&&this.linkGame()}interact(){null!==this.game&&this.game.won===n.NONE&&0!==this.game.blankTiles?this.occupied===n.NONE&&(this.occupied=this.game.turn,this.game.turn=-this.game.turn,this.game.blankTiles--,this.didWin()&&(this.game.won=this.occupied)):this.linkGame()}}e.a=f},function(t,e,i){"use strict";var n=i(7),s=i(0),r=i(21);const o=1/3,h=s.a*o;e.a=class extends n.a{constructor(t,e){super(o,o,t),this.app=e}render(t){t.fillStyle="black",t.strokeStyle="white",t.lineWidth=1,t.strokeRect(0,0,h/2,h/2),t.fillRect(0,0,h/2,h/2),t.strokeRect(0,h/2,h,h/2),t.fillRect(0,h/2,h,h/2)}shoot(t=this.lastMovementDir){const e=new r.a(t,this.center.view);e.move(this.center.pt.x-e.center.pt.x,this.center.pt.y-e.center.pt.y),this.app.addStepable(e)}}},function(t,e,i){"use strict";var n=i(20);e.a=class{constructor(t,e,i){this.trackWidth=2,this.trackHeight=2,this.init(t,e,i)}respawn(t){this.init(this.width,this.height,t)}init(t,e,i){if(this.width=t,this.height=e,t>1||e>1)throw new RangeError("we do not yet suport entities larger than one tile");this.trackingTiles=Array(this.trackWidth),this.trackingTilesOld=Array(this.trackWidth);for(let s=0;s<this.trackWidth;s++){this.trackingTiles[s]=Array(this.trackHeight),this.trackingTilesOld[s]=Array(this.trackHeight);for(let r=0;r<this.trackHeight;r++){const o=t/(this.trackWidth-1)*s,h=e/(this.trackHeight-1)*r,a=new n.a(i,.5-t/2+o,.5-e/2+h,o,h);this.trackingTiles[s][r]=a,this.trackingTilesOld[s][r]=a.clone()}}this.center=new n.a(i,.5,.5,t/2,e/2),this.centerOld=this.center.clone()}move(t,e){let i=t<0?2:0,n=e<0?3:1,s=Math.abs(t),r=Math.abs(e),o=0===s,h=0===r,a=0;for(this.lastMovementDir=s>=r?i:n;(s>0||r>0)&&a<100;){if(a++,!o&&s>0){let t=s;s=this.tryMove(i,s),h=h&&(t===s||r<=0),o=!0}if(h)break;if(!h&&r>0){let t=r;r=this.tryMove(n,r),o=o&&(t===r||s<=0),h=!0}if(o)break}return 0===s&&0===r}tryMove(t,e){let i=e,n=0;for(;i>0&&n<100;){n++;let e=i;for(let i=0;i<this.trackWidth;i++)for(let n=0;n<this.trackWidth;n++){const s=this.trackingTiles[i][n].movementUpToEdge(t);s<e&&(e=s)}const s=this.center.movementUpToEdge(t);if(s<e&&(e=s),e>0){for(let i=0;i<this.trackWidth;i++)for(let n=0;n<this.trackWidth;n++)this.trackingTiles[i][n].moveWithinTile(t,e);this.center.moveWithinTile(t,e)}if(e===i){i=0;break}i-=e;let r=!0;for(let e=0;e<this.trackWidth;e++)for(let i=0;i<this.trackWidth;i++){const n=this.trackingTiles[e][i];this.trackingTilesOld[e][i].copy(n),r=r&&n.tryCrossEdge(t)}if(this.centerOld.copy(this.center),r=r&&this.center.tryCrossEdge(t))t:for(let t=0;t<this.trackWidth;t++)for(let e=0;e<this.trackWidth;e++){const i=this.trackingTiles[t][e].view;if(0!==t){const n=this.trackingTiles[t-1][e].view;r=r&&(i===n||i.getNeighbor(2)===n)}if(0!==e){const n=this.trackingTiles[t][e-1].view;r=r&&(i===n||i.getNeighbor(3)===n)}if(!r)break t}if(!r){for(let t=0;t<this.trackWidth;t++)for(let e=0;e<this.trackWidth;e++)this.trackingTiles[t][e].copy(this.trackingTilesOld[t][e]);this.center.copy(this.centerOld);break}}return i}}},function(t,e,i){"use strict";var n=i(3);class s{constructor(t,e,i,s,r){this.view=t,this.pt=new n.a({x:e,y:i}),this.onEntityX=s,this.onEntityY=r}movementUpToEdge(t){switch(t){case 2:return this.pt.x;case 0:return 1-this.pt.x;case 3:return this.pt.y;case 1:return 1-this.pt.y}}moveWithinTile(t,e){this.pt.step(t,e)}tryCrossEdge(t){if(0===this.movementUpToEdge(t)){const e=this.view.getNeighbor(t);return!!e&&(this.pt.step(t,-1),this.view=e,!0)}return!0}copy(t){this.pt=t.pt.fork(),this.view=t.view,this.onEntityY=t.onEntityY,this.onEntityX=t.onEntityX}clone(){return new s(this.view,this.pt.x,this.pt.y,this.onEntityX,this.onEntityY)}move(t,e){let i=t<0?2:0,n=e<0?3:1,s=Math.abs(t),r=Math.abs(e),o=0===s,h=0===r,a=0;for(;(s>0||r>0)&&a<100;){if(a++,!o&&s>0){let t=s;s=this.tryMove(i,s),h=h&&(t===s||r<=0),o=!0}if(h)break;if(!h&&r>0){let t=r;r=this.tryMove(n,r),o=o&&(t===r||s<=0),h=!0}if(o)break}return 0!==s&&0!==r&&console.log(s,r),0===s&&0===r}tryMove(t,e){let i=0,n=e;for(;n>0&&i<100;){i--;const e=Math.min(this.movementUpToEdge(t),n);if(e>0&&this.moveWithinTile(t,e),(n-=e)===e)break;if(!this.tryCrossEdge(t))break}return n}}e.a=s},function(t,e,i){"use strict";var n=i(7),s=i(1),r=i(0);const o=.01;e.a=class extends n.a{constructor(t,e){super(1&t?1/6:5/6,1&t?5/6:1/6,e),this.age=0,this.dir=t,this.dirPt=Object(s.a)(t)}step(t){this.age+=t,!this.move(this.dirPt.x*o*t,this.dirPt.y*o*t)&&(this.age+=10*t);const e=this.age<1e4;return e||this.kill(),e}render(t){t.lineWidth=2,t.fillStyle="red",t.fillRect(0,0,this.width*r.a,this.height*r.a),t.strokeStyle="white",t.strokeRect(0,0,this.width*r.a,this.height*r.a)}}}]);