/* Continuous vine band. Coordinates describe one half-period; B is A rotated
   180 degrees and traversed in reverse, so both shared position and tangent agree. */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  function curve(start, segments) {
    const points = [start]; let p = start;
    for (const s of segments) {
      for (let j = 1; j <= 36; j++) {
        const t = j / 36, q = 1 - t;
        points.push([q*q*q*p[0]+3*q*q*t*s[0]+3*q*t*t*s[2]+t*t*t*s[4],q*q*q*p[1]+3*q*q*t*s[1]+3*q*t*t*s[3]+t*t*t*s[5]]);
      }
      p = [s[4], s[5]];
    }
    return points;
  }
  const stemSegments = [
    [.12,-.32,.10,-.70,.37,-.70],
    [.64,-.70,.69,-.185,.78,-.11],
    [.87,-.035,.94,-.16,1,0]
  ];
  const stem = curve([0,0], stemSegments);
  // Each curling side shoot grows from the upper shoulder of the vine.
  const scroll = curve([.255,-.655], [
    [.32,-.79,.57,-.84,.66,-.65],
    [.75,-.46,.66,-.20,.49,-.22],
    [.32,-.24,.34,-.51,.46,-.52],
    [.58,-.53,.58,-.35,.48,-.36],
    [.38,-.37,.44,-.41,.47,-.43]
  ]);
  const scallop = curve([.18,-.50], [
    [.10,-.63,.18,-.81,.29,-.77],
    [.30,-.91,.43,-.92,.49,-.80],
    [.58,-.87,.72,-.81,.70,-.66]
  ]);
  const shoot = curve([.78,-.11], [[.69,.01,.55,.18,.48,.43]]);
  const flower = curve([.48,.43], [
    [.31,.49,.19,.29,.24,.20],
    [.26,.15,.32,.16,.34,.22],
    [.30,.07,.38,-.005,.43,.08],
    [.45,-.02,.54,-.03,.55,.08],
    [.65,.02,.70,.12,.63,.24],
    [.71,.18,.77,.26,.70,.36],
    [.65,.44,.55,.47,.48,.43]
  ]);
  const veins = [
    curve([.48,.43], [[.43,.34,.34,.28,.28,.23]]),
    curve([.48,.43], [[.45,.31,.42,.20,.40,.12]]),
    curve([.48,.43], [[.52,.31,.52,.19,.52,.10]]),
    curve([.48,.43], [[.57,.36,.61,.30,.66,.27]])
  ];
  const leaf = curve([.66,.085], [[.76,.11,.81,.29,.85,.32],[.74,.30,.64,.22,.66,.085]]);
  const leafVein = curve([.66,.085], [[.72,.17,.78,.27,.85,.32]]);
  const tendril = curve([.08,-.205], [[.17,-.13,.26,-.08,.28,.01],[.31,.13,.17,.19,.14,.09],[.12,.03,.20,.00,.22,.06]]);
  const reflected = p => p.slice().reverse().map(([x,y]) => [2-x,-y]);
  const backbone = stem.concat(reflected(stem).slice(1));
  function offset(points, distance, periodic) {
    return points.map((p,i) => {
      let a = points[Math.max(0,i-1)], b = points[Math.min(points.length-1,i+1)];
      if (periodic && i === 0) a = [points[points.length-2][0]-2,points[points.length-2][1]];
      if (periodic && i === points.length-1) b = [points[1][0]+2,points[1][1]];
      const dx=(b[0]-a[0])*1.7,dy=b[1]-a[1],length=Math.hypot(dx,dy);
      return [p[0]-dy/length*distance/1.7,p[1]+dx/length*distance];
    });
  }
  const stemPaths = [
    ...[-.043,.043].map(d => ({points:offset(backbone,d,true),weight:1.05,whole:true})),
    {points:backbone,weight:.40,whole:true},
    ...[-.024,.024].map(d => ({points:offset(scroll,d,false),weight:.85})),
    {points:scallop,weight:.75}, {points:tendril,weight:.7}
  ];
  const petalPaths = [shoot,flower,...veins,leaf,leafVein].map((points,i)=>({points,weight:i===1?.85:.55}));
  function paint(ctx, paths, count, map) {
    for (let i=0;i<count;i+=2) for (const path of paths) {
      const variants=path.whole?[path.points]:[path.points,reflected(path.points)];
      for (const points of variants) {
        ctx.beginPath();
        points.forEach(([u,v],j)=>{const p=map(i+u,v);j?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
        ctx.lineWidth=path.weight;ctx.stroke();
      }
    }
  }
  function draw(ctx,{cx=0,cy=0,radius=220,halfWidth=65,time=0,showStem=true,showPetals=true}={}) {
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const count=12,angle=time*.011;
    const map=(u,v)=>{const a=u/count*TAU+angle,r=radius+v*halfWidth;return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];};
    if(showStem)paint(ctx,stemPaths,count,map);
    if(showPetals)paint(ctx,petalPaths,count,map);
    ctx.lineWidth=.85;
    for(const r of [radius-halfWidth,radius+halfWidth]){ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();}
    ctx.restore();
  }
  function drawStrip(ctx,{x=0,y=0,width=700,height=140,count=6,showStem=true,showPetals=true,showSeams=false}={}) {
    count=Math.max(2,2*Math.round(count/2));
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const map=(u,v)=>[x+u/count*width,y+height/2+v*height*.46];
    if(showStem)paint(ctx,stemPaths,count,map);
    if(showPetals)paint(ctx,petalPaths,count,map);
    ctx.lineWidth=.75;
    for(const v of [-1,1]){ctx.beginPath();ctx.moveTo(...map(0,v));ctx.lineTo(...map(count,v));ctx.stroke();}
    if(showSeams){ctx.globalAlpha*=.45;ctx.setLineDash([3,5]);for(let i=0;i<=count;i++){ctx.beginPath();ctx.moveTo(...map(i,-1));ctx.lineTo(...map(i,1));ctx.stroke();}ctx.setLineDash([]);}
    ctx.restore();
  }
  const derivativeErrors=stemSegments.slice(1).map((segment,i)=>{const previous=stemSegments[i];return Math.hypot(3*(previous[4]-previous[2])-3*(segment[0]-previous[4]),3*(previous[5]-previous[3])-3*(segment[1]-previous[5]));});
  const analysis={
    atom:'一段鼓起后内卷的双线藤蔓，肩部生出复合卷叶，凹槽中生出带叶脉的花瓣和细枝。',
    composition:'A 与双轴翻转的 B 交错嵌合；六对单元围成一圈。主茎两侧轮廓跨单元连续，花瓣沿枝条从主茎生长。',
    transform:'B(x,y) = (2 − x, −y)，反向遍历控制点；共享端口的位置、切线及参数速度相同（C¹）。',
    halfUnits:12,
    join:{positionError:0,tangentError:0,internalDerivativeError:Math.max(...derivativeErrors)},
    reference:'用户提供的青花瓷中央藤蔓局部；手工贝塞尔线绘变体。'
  };
  window.VinePetal={draw,drawStrip,analysis};
})();
