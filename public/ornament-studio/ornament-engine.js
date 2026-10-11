/* Shared atomic geometry for the catalogue, canvas studio and SVG exports. */
(function () {
  'use strict';
  const TAU = Math.PI * 2, cache = new Map();
  const num = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const fmt = n => Number(n.toFixed(4));
  function cubic(start, segments) {
    const result = [start]; let p = start;
    for (const [a,b,end] of segments) { for (let i=1;i<=36;i++) { const t=i/36,q=1-t; result.push([0,1].map(k=>q*q*q*p[k]+3*q*q*t*a[k]+3*q*t*t*b[k]+t*t*t*end[k])); } p=end; }
    return result;
  }
  function frame(type,t) {
    const pi=Math.PI,s=Math.sin(pi*t),c=Math.cos(pi*t),a=TAU*t,g=s*s*s,g1=3*pi*s*s*c,h=Math.sin(4*pi*t)**2,h1=4*pi*Math.sin(8*pi*t),p=type==='blossom'?.045:0;
    return [[t-Math.sin(a)/TAU+.55*g,.28*Math.sin(a)+.40*g+p*g*h],[1-Math.cos(a)+.55*g1,.56*pi*Math.cos(a)+.40*g1+p*(g1*h+g*h1)]];
  }
  function scrollGeometry(type) {
    const paths=[], weights=[];
    const add=(p,w=1)=>{paths.push(p);weights.push(w);};
    const backbone=[],edge=[];
    for(let j=0;j<=480;j++){const [p,d]=frame(type,j/240),l=Math.hypot(...d);backbone.push(p);edge.push([p[0]-d[1]/l*.018,p[1]+d[0]/l*.018]);}
    add(backbone);add(edge,.37);
    const root=frame(type,.4)[0];
    for(let half=0;half<2;half++){
      const map=([x,y])=>half?[2-x,-y]:[x,y];
      for(let k=0;k<(type==='tide'?9:3);k++){
        const tip=type==='tide'?[.50+.38*k/8,.28+.08*Math.sin(Math.PI*k/8)]:[.49+k*.14,.26+k*.025];
        const segments=type==='tide'?[[[root[0]-.025,root[1]-.075],[tip[0]+.04,tip[1]+.045],tip]]:[[[root[0]-.07,root[1]-.08],[tip[0]-.055,tip[1]+.055],tip],[[tip[0]+.055,tip[1]+.015],[root[0]+.015,root[1]-.08],root]];
        add(cubic(root,segments).map(map),.45);
      }
    }
    const radial=Math.max(...paths.flat().map(p=>Math.abs(p[1])))*2;
    return {mode:'band',paths:paths.map(p=>p.map(([x,y])=>[x/2,y/radial])),weights,defaultCount:8,unitLabel:'一组 A＋B 双轴翻转周期',ports:[[0,0],[1,0]],note:'A 与双轴翻转的 B 组成完整周期；主纹在周期边界共享位置和切线。'};
  }
  function vineGeometry() {
    const paths=[],weights=[];let current=[];
    const capture={save(){},restore(){},beginPath(){current=[];},moveTo(x,y){current.push([x,y]);},lineTo(x,y){current.push([x,y]);},stroke(){paths.push(current);weights.push(this.lineWidth);},setLineDash(){}};
    window.VinePetal.drawStrip(capture,{width:1,height:1,count:2,showSeams:false});
    paths.splice(-2);weights.splice(-2);
    return {mode:'band',paths:paths.map(p=>p.map(([x,y])=>[x,(y-.5)/.92])),weights,defaultCount:6,unitLabel:'一组藤蔓 A＋B 与附生花瓣',ports:[[0,0],[1,0]],note:'双轴翻转的藤蔓以完整 A＋B 周期重复，双线主茎与花瓣共用同一原子坐标。'};
  }
  const studies=[
    {id:'study-vine',name:'藤蔓花瓣',en:'VINE & PETAL',geometry:vineGeometry()},
    {id:'study-tide',name:'对生卷浪',en:'PAIRED WAVE SCROLL',geometry:scrollGeometry('tide')},
    {id:'study-blossom',name:'相生卷瓣',en:'INTERLOCKING LOBED SCROLL',geometry:scrollGeometry('blossom')}
  ];
  const catalog=(window.ORNAMENT_LIBRARY||[]).map(item=>{
    const geometry=window.ORNAMENT_GEOMETRY[item.id];
    if(!geometry)throw new Error('Missing atom geometry: '+item.id);
    return {...item,geometry,mode:geometry.mode,defaultCount:geometry.defaultCount,unitLabel:geometry.unitLabel,note:geometry.note};
  });
  for(const item of studies)catalog.push({...item,mode:'band',kind:'研究纹带',defaultCount:item.geometry.defaultCount,unitLabel:item.geometry.unitLabel,note:item.geometry.note,file:'ornaments/'+item.id+'.svg',atom:item.geometry.unitLabel,composition:item.geometry.note,transform:'完整 A＋B 原子平移复制，再映射至环形。',repeat:item.geometry.defaultCount,referenceNote:'用户青花瓷参考启发的参数化研究纹样。',analysis:{atom:item.geometry.unitLabel,composition:item.geometry.note,transform:'完整 A＋B 原子平移复制，再映射至环形。'}});
  const get=id=>catalog.find(item=>item.id===id);
  function settings(layer) {
    const item=get(layer.patternId); if(!item)throw new Error('Unknown pattern: '+layer.patternId);
    return {item,count:Math.max(1,Math.min(240,Math.round(num(layer.count,item.defaultCount||1)))),radius:Math.max(0,num(layer.radius,160)),thickness:Math.max(.1,num(layer.thickness,50))};
  }
  function build(layer) {
    const {item,count,radius,thickness}=settings(layer),key=[item.id,count,radius,thickness].join('|');
    if(cache.has(key)){const hit=cache.get(key);cache.delete(key);cache.set(key,hit);return hit;}
    const geo=item.geometry,groups=new Map();let extent=0;
    for(let i=0;i<count;i++)for(let j=0;j<geo.paths.length;j++){
      const weight=geo.weights?.[j]??1; if(!groups.has(weight))groups.set(weight,[]);
      const pts=geo.paths[j].map(([u,v])=>{
        let x,y;
        if(geo.mode==='band'){const a=TAU*(i+u)/count,r=radius+v*thickness;x=Math.cos(a)*r;y=Math.sin(a)*r;}
        else if(count===1&&radius===0){x=u*thickness;y=v*thickness;}
        else {const a=TAU*i/count;const radial=radius+v*thickness,tangent=u*thickness;x=Math.cos(a)*radial+Math.sin(a)*tangent;y=Math.sin(a)*radial-Math.cos(a)*tangent;}
        extent=Math.max(extent,Math.hypot(x,y));return [x,y];
      });
      if(pts.length)groups.get(weight).push(pts.map(([x,y],k)=>(k?'L':'M')+fmt(x)+' '+fmt(y)).join(''));
    }
    const strokes=[...groups].map(([weight,ds])=>{const d=ds.join('');return {weight,d,path:new Path2D(d)};});
    const d=strokes.map(s=>s.d).join(''),result={path:new Path2D(d),d,strokes,units:count,extent,radius,thickness,mode:geo.mode,patternId:item.id};
    cache.set(key,result);if(cache.size>12)cache.delete(cache.keys().next().value);return result;
  }
  const angle=(layer,time)=>(num(layer.rotation,0)+num(layer.speed,0)*time)*Math.PI/180+(get(layer.patternId).mode==='band'?num(get(layer.patternId).geometry.sourcePhase,0):0);
  function drawLayer(ctx,layer,time=0){
    if(layer.enabled===false)return;const shape=build(layer);
    ctx.save();ctx.rotate(angle(layer,time));ctx.strokeStyle=layer.color||'#cfb984';ctx.globalAlpha*=Math.max(0,Math.min(1,num(layer.opacity,1)));ctx.lineCap='round';ctx.lineJoin='round';
    for(const stroke of shape.strokes){ctx.lineWidth=Math.max(.05,num(layer.lineWidth,1))*stroke.weight;ctx.stroke(stroke.path);}ctx.restore();
  }
  function drawAtom(ctx,id,{x=0,y=0,width=500,height=150,count=3,showSeams=true}={}){
    const item=get(id),geo=item.geometry,n=Math.max(1,Math.round(count)),cell=width/n,depth=height*.76;
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    const baseWidth=ctx.lineWidth;
    for(let i=0;i<n;i++)for(let j=0;j<geo.paths.length;j++){
      ctx.beginPath();geo.paths[j].forEach(([u,v],k)=>{const p=geo.mode==='band'?[x+(i+u)*cell,y+height/2+v*depth]:[x+(i+.5)*cell+u*Math.min(cell*.8,depth),y+height/2+v*Math.min(cell*.8,depth)];k?ctx.lineTo(...p):ctx.moveTo(...p);});ctx.lineWidth=baseWidth*(geo.weights?.[j]??1);ctx.stroke();
    }
    if(showSeams){ctx.globalAlpha*=.3;ctx.lineWidth=.8;ctx.setLineDash([3,5]);for(let i=0;i<=n;i++){ctx.beginPath();ctx.moveTo(x+i*cell,y);ctx.lineTo(x+i*cell,y+height);ctx.stroke();}}
    ctx.restore();
  }
  function toSVG(layers,{time=0,size=1000,background=null}={}){
    const active=layers.filter(l=>l.enabled!==false),limit=Math.max(1,...active.map(l=>build(l).extent+Math.max(.05,num(l.lineWidth,1))*2)),extent=limit+Math.max(8,limit*.04),side=extent*2;
    let body=background?'<rect x="'+(-extent)+'" y="'+(-extent)+'" width="'+side+'" height="'+side+'" fill="'+esc(background)+'"/>':'';
    for(const layer of active){const shape=build(layer);body+='<g transform="rotate('+fmt(angle(layer,time)*180/Math.PI)+')" stroke="'+esc(layer.color||'#cfb984')+'" opacity="'+Math.max(0,Math.min(1,num(layer.opacity,1)))+'" data-pattern="'+esc(layer.patternId)+'" data-repeat-count="'+shape.units+'">'+shape.strokes.map(s=>'<path stroke-width="'+fmt(Math.max(.05,num(layer.lineWidth,1))*s.weight)+'" d="'+s.d+'"/>').join('')+'</g>';}
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="'+[-extent,-extent,side,side].join(' ')+'" fill="none" stroke-linecap="round" stroke-linejoin="round">'+body+'</svg>';
  }
  for(const item of catalog.filter(i=>i.id.startsWith('study-'))){
    item.svg=toSVG([{patternId:item.id,count:item.defaultCount,radius:100,thickness:35,lineWidth:.9,color:'currentColor'}],{size:240});
    item.atomSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -55 210 110" fill="none" stroke="currentColor" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round">'+item.geometry.paths.map((p,i)=>'<path stroke-width="'+(item.geometry.weights[i]||1)+'" d="'+p.map(([u,v],k)=>(k?'L':'M')+fmt(u*200)+' '+fmt(v*100)).join('')+'"/>').join('')+'</svg>';
  }
  window.ORNAMENT_CATALOG=catalog;
  window.OrnamentEngine={catalog,get,build,drawLayer,drawAtom,toSVG};
})();
