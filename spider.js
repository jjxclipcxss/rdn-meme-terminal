// RDN procedural spider: spring-followed carrot on curved paths, 8 legs, 2-segment IK, tetrapod gait.
(function(){
const RM=matchMedia("(prefers-reduced-motion: reduce)");
const FX=[1.314, 0.448, -0.524, -1.324],FY=[0.821, 1.379, 1.298, 0.704],HX=[.22,.1,-.02,-.14],GA=[0,5,2,7];
const lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,ang=a=>Math.atan2(Math.sin(a),Math.cos(a));
class Spider{
 constructor(o){Object.assign(this,{S:22,c1:"#ff2bd6",c2:"#39ff14",leg:"#e8e0ff",speed:260,x:0,y:0},o);this.vx=this.vy=0;this.h=-Math.PI/2;
  this.cx=this.x;this.cy=this.y;this.path=null;this.tx=this.x;this.ty=this.y;this.idle=0;this.tw=1+Math.random()*2;this.bob=0;
  this.legs=[];for(let i=0;i<8;i++){const p=this.rest(i);this.legs.push({fx:p[0],fy:p[1],step:null})}}
 w(lx,ly){const c=Math.cos(this.h),s=Math.sin(this.h);return[this.x+lx*c-ly*s,this.y+lx*s+ly*c]}
 side(i){return i<4?-1:1}
 rest(i,lead=0){const k=i%4,sd=this.side(i);return this.w(FX[k]*this.S+lead,sd*FY[k]*this.S)}
 hip(i){const k=i%4;return this.w(HX[k]*this.S,this.side(i)*.12*this.S)}
 // curved path to a target (skull mode)
 setTarget(tx,ty,bend=.35){if(this.jump){this.jump.pend=[tx,ty];return}if(Math.hypot(tx-this.tx,ty-this.ty)<3)return;this.tx=tx;this.ty=ty;
  if(RM.matches){this.x=this.cx=tx;this.y=this.cy=ty;this.path=null;for(let i=0;i<8;i++){const p=this.rest(i);this.legs[i].fx=p[0];this.legs[i].fy=p[1];this.legs[i].step=null}return}
  const sx=this.cx,sy=this.cy,dx=tx-sx,dy=ty-sy,L=Math.hypot(dx,dy)||1,sg=(Math.random()<.5?-1:1)*bend*L;
  this.path={sx,sy,qx:(sx+tx)/2-dy/L*sg,qy:(sy+ty)/2+dx/L*sg,tx,ty,t:0,dur:Math.max(.35,L/this.speed)}}
 // fast parabolic leap
 leap(tx,ty,dur){if(RM.matches){this.setTarget(tx,ty);return}if(this.jump)return;const d=Math.hypot(tx-this.x,ty-this.y);dur=dur||Math.min(.7,Math.max(.4,.3+d/1600));
  this.jump={sx:this.x,sy:this.y,tx,ty,t:0,dur,h:Math.min(140,30+d*.35)};this.path=null;this.cx=tx;this.cy=ty;this.tx=tx;this.ty=ty;for(const L of this.legs)L.step=null}
 hop(r){const a=Math.random()*6.283,d=r*(.5+Math.random()*.5);this.leap(this.x+Math.cos(a)*d,this.y+Math.sin(a)*d*.6,.32+Math.random()*.12)}
 get airborne(){return!!this.jump}
 // direct carrot (desk mode)
 setCarrot(x,y){if(this.jump){this.jump.pend=null;this.jump.carrot=[x,y];return}this.path=null;this.cx=x;this.cy=y;this.tx=x;this.ty=y;if(RM.matches){this.x=x;this.y=y}}
 update(dt){dt=Math.min(dt,.05);this.squash=Math.max(0,(this.squash||0)-dt);
  if(this.jump){const j=this.jump;j.t=Math.min(1,j.t+dt/j.dur);const px=this.x,py=this.y,k=j.t; this.x=lerp(j.sx,j.tx,k);this.y=lerp(j.sy,j.ty,k)-j.h*4*k*(1-k);this.vx=(this.x-px)/dt;this.vy=(this.y-py)/dt;
   const d=ang(Math.atan2(j.ty-j.sy,j.tx-j.sx)-this.h);this.h+=d*Math.min(1,dt*14);
   for(let i=0;i<8;i++){const r=this.rest(i),L=this.legs[i];L.fx=lerp(this.x,r[0],.38);L.fy=lerp(this.y,r[1],.38)-this.S*.15;L.lift=0}
   if(j.t>=1){this.jump=null;this.vx=this.vy=0;this.squash=.22;this.x=j.tx;this.y=j.ty;this.cx=j.tx;this.cy=j.ty;
    for(let i=0;i<8;i++){const r=this.rest(i),L=this.legs[i];L.step={ox:L.fx,oy:L.fy,nx:r[0],ny:r[1],t:0,d:.12}}
    if(j.carrot){this.cx=j.carrot[0];this.cy=j.carrot[1]}else if(j.pend){const p=j.pend;this.tx=this.ty=1e9;this.setTarget(p[0],p[1])}}
   else return}if(this.path){const p=this.path;p.t=Math.min(1,p.t+dt/p.dur);const e=ease(p.t),u=1-e;
   this.cx=u*u*p.sx+2*u*e*p.qx+e*e*p.tx;this.cy=u*u*p.sy+2*u*e*p.qy+e*e*p.ty;if(p.t>=1)this.path=null}
  if(RM.matches){this.x=this.cx;this.y=this.cy;return}
  const k=60,ax=k*(this.cx-this.x)-2*Math.sqrt(k)*this.vx,ay=k*(this.cy-this.y)-2*Math.sqrt(k)*this.vy;
  this.vx+=ax*dt;this.vy+=ay*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;const sp=Math.hypot(this.vx,this.vy);
  if(sp>12){const d=ang(Math.atan2(this.vy,this.vx)-this.h);this.h+=d*Math.min(1,dt*8)}
  // gait
  const thr=this.S*.42,lead=Math.min(sp*.09,this.S*.6),dur=Math.max(.07,Math.min(.16,this.S*3/(sp+1)));
  const busy=g=>g.some(i=>this.legs[i].step),A=GA,B=[0,1,2,3,4,5,6,7].filter(i=>!A.includes(i));
  for(const g of [A,B]){const other=g===A?B:A;if(busy(g)||busy(other))continue;
   if(g.some(i=>{const r=this.rest(i);return Math.hypot(r[0]-this.legs[i].fx,r[1]-this.legs[i].fy)>thr})){
    const vn=sp>1?[this.vx/sp,this.vy/sp]:[0,0];for(const i of g){const r=this.rest(i),L=this.legs[i];L.step={ox:L.fx,oy:L.fy,nx:r[0]+vn[0]*lead,ny:r[1]+vn[1]*lead,t:0,d:dur}}break}}
  for(let i=0;i<8;i++){const L=this.legs[i],r=this.rest(i);if(!L.step&&Math.hypot(r[0]-L.fx,r[1]-L.fy)>this.S*1.6)L.step={ox:L.fx,oy:L.fy,nx:r[0],ny:r[1],t:0,d:dur}}
  this.idle=sp<6?this.idle+dt:0;
  if(this.idle>.8&&(this.tw-=dt)<0){this.tw=1.2+Math.random()*2.5;const i=Math.floor(Math.random()*8),L=this.legs[i];if(!L.step){const r=this.rest(i),j=this.S*.18;L.step={ox:L.fx,oy:L.fy,nx:r[0]+(Math.random()-.5)*j,ny:r[1]+(Math.random()-.5)*j,t:0,d:.18,tw:1}}}
  let lift=0;for(const L of this.legs){if(!L.step)continue;const s=L.step;s.t=Math.min(1,s.t+dt/s.d);const e=ease(s.t);L.fx=lerp(s.ox,s.nx,e);L.fy=lerp(s.oy,s.ny,e);L.lift=Math.sin(Math.PI*s.t)*(s.tw?.12:.3)*this.S;lift=Math.max(lift,s.tw?0:Math.sin(Math.PI*s.t));if(s.t>=1){L.step=null;L.lift=0}}
  this.bob=lerp(this.bob,lift,Math.min(1,dt*20))}
 draw(g){const S=this.S;g.save();g.lineCap="round";g.lineJoin="round";
  g.shadowColor=this.c2;g.shadowBlur=8;g.strokeStyle=this.leg;g.lineWidth=Math.max(1.4,S*.09);
  this.legs.forEach((L,i)=>{const[hx,hy]=this.hip(i),R0=this.rest(i),rd=Math.hypot(R0[0]-hx,R0[1]-hy),a=rd*.56,b=rd*.56;let fx=L.fx,fy=L.fy-(L.lift||0)*.5;{const q=Math.hypot(fx-hx,fy-hy),m=(a+b)*.98;if(q>m){fx=hx+(fx-hx)/q*m;fy=hy+(fy-hy)/q*m}}const dx=fx-hx,dy=fy-hy,d=Math.min(Math.hypot(dx,dy),a+b-.01),base=Math.atan2(dy,dx);
   const ca=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));let best=null,bd=-Infinity;for(const sg of[-1,1]){const kx=hx+Math.cos(base+sg*ca)*a,ky=hy+Math.sin(base+sg*ca)*a,dd=((kx-this.x)*-Math.sin(this.h)+(ky-this.y)*Math.cos(this.h))*this.side(i);if(dd>bd){bd=dd;best=[kx,ky]}}
   const kx=best[0],ky=best[1]-(L.lift||0);g.beginPath();g.moveTo(hx,hy);g.lineTo(kx,ky);g.lineTo(fx,fy);g.stroke()});
  const bb=(1+this.bob*.06)*.8;g.translate(this.x,this.y-this.bob*S*.08);g.rotate(this.h);const q=this.squash>0?Math.sin(this.squash/.22*Math.PI):0,st=this.jump?1+.18*Math.sin(Math.PI*this.jump.t):1;g.scale(bb*(1+.28*q)*st,bb*(1-.25*q)/st);
  g.shadowColor=this.c1;g.shadowBlur=14;g.fillStyle="#1a0b2e";g.strokeStyle=this.c1;g.lineWidth=Math.max(1.2,S*.07);
  g.beginPath();g.ellipse(-.48*S,0,.5*S,.38*S,0,0,7);g.fill();g.stroke();
  g.fillStyle="#ff3860";g.shadowBlur=0;g.beginPath();g.moveTo(-.68*S,-.12*S);g.lineTo(-.48*S,0);g.lineTo(-.68*S,.12*S);g.moveTo(-.28*S,-.12*S);g.lineTo(-.48*S,0);g.lineTo(-.28*S,.12*S);g.strokeStyle="#ff3860";g.stroke();
  g.shadowColor=this.c2;g.shadowBlur=10;g.fillStyle="#1a0b2e";g.strokeStyle=this.c2;g.beginPath();g.ellipse(.12*S,0,.26*S,.22*S,0,0,7);g.fill();g.stroke();
  g.fillStyle=this.c2;for(const s of[-1,1]){g.beginPath();g.arc(.3*S,s*.09*S,.06*S+.6,0,7);g.fill()}g.fillStyle=this.c1;for(const s of[-1,1]){g.beginPath();g.arc(.36*S,s*.035*S,.03*S+.4,0,7);g.fill()}
  g.restore()}}
window.RDNSpider=Spider;window.RDN_REDUCED=RM;
})();
