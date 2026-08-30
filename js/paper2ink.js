(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var app = $("paper2ink-app");
  if (!app) return;

  var state = { file: null, url: "", mode: "pen", zoom: 100, ready: false, shapes: [], strokes: [], erasures: [], drawing: null };
  var input = $("file-input"), drop = $("drop-zone"), workspace = $("workspace"), artboard = $("artboard");
  var preview = $("vector-preview"), canvas = $("edit-layer"), ctx = canvas.getContext("2d");
  var neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  function setStatus(message, ready) { $("status").textContent = message; $("status").classList.toggle("is-ready", !!ready); }
  function download(contents, type, name) { var url = URL.createObjectURL(new Blob([contents], { type: type })); var a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); }
  function baseName() { return state.file.name.replace(/\.[^.]+$/, ""); }
  function pointPath(points, close) { return points.map(function (p, i) { return (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1); }).join(" ") + (close ? " Z" : ""); }

  function render() {
    var holes = state.erasures.map(function (e) { return '<circle cx="' + e.x.toFixed(1) + '" cy="' + e.y.toFixed(1) + '" r="' + e.radius + '" fill="black"/>'; }).join("");
    var mask = '<defs><mask id="paper2ink-mask"><rect width="1200" height="800" fill="white"/>' + holes + '</mask></defs>';
    var shapes = state.shapes.map(function (shape) { return '<path d="' + shape.contours.map(function (c) { return pointPath(c, true); }).join(" ") + '" fill="#24231f" fill-rule="evenodd"/>'; }).join("");
    var strokes = state.strokes.filter(function (s) { return s.points.length > 1; }).map(function (s) { return '<path d="' + pointPath(s.points, false) + '" fill="none" stroke="#24231f" stroke-width="' + s.width + '" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>'; }).join("");
    preview.innerHTML = mask + '<g mask="url(#paper2ink-mask)">' + shapes + strokes + '</g>';
  }

  function accept(file) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 25 * 1024 * 1024) { alert("请选择 25MB 以内的 PNG、JPG 或 WebP 图片。"); return; }
    if (state.url) URL.revokeObjectURL(state.url);
    state.file = file; state.url = URL.createObjectURL(file); state.ready = false; state.shapes = []; state.strokes = []; state.erasures = [];
    var sourceImage=$("source-image");sourceImage.classList.remove("is-loaded");sourceImage.onload=function(){sourceImage.classList.add("is-loaded");};sourceImage.onerror=function(){sourceImage.classList.remove("is-loaded");};sourceImage.src=state.url; $("file-name").textContent = file.name; $("file-size").textContent = (file.size / 1024 / 1024).toFixed(2) + " MB";
    drop.hidden = true; workspace.hidden = false; artboard.classList.remove("is-converted"); $("ready-badge").hidden = true;
    $("export-svg").disabled = true; $("export-json").disabled = true; setStatus("图片已就绪，可以开始转换。"); render();
  }
  input.addEventListener("change", function () { accept(input.files[0]); });
  ["dragenter", "dragover"].forEach(function (name) { drop.addEventListener(name, function (e) { e.preventDefault(); drop.classList.add("is-dragging"); }); });
  ["dragleave", "drop"].forEach(function (name) { drop.addEventListener(name, function (e) { e.preventDefault(); drop.classList.remove("is-dragging"); }); });
  drop.addEventListener("drop", function (e) { accept(e.dataTransfer.files[0]); });
  $("remove-file").addEventListener("click", function () { if (state.url) URL.revokeObjectURL(state.url); state.file = null; input.value = ""; workspace.hidden = true; drop.hidden = false; });
  $("smoothness").addEventListener("input", function () { $("smooth-value").textContent = this.value; });

  function otsu(gray) { var hist = new Uint32Array(256), sum = 0, bg = 0, wBg = 0, best = 0, threshold = 127; gray.forEach(function (v) { hist[v]++; }); for (var i=0;i<256;i++) sum += i*hist[i]; for (i=0;i<256;i++) { wBg += hist[i]; if (!wBg) continue; var wFg=gray.length-wBg; if (!wFg) break; bg += i*hist[i]; var d=bg/wBg-(sum-bg)/wFg, variance=wBg*wFg*d*d; if (variance>best) { best=variance; threshold=i; } } return threshold; }
  function morphology(src,w,h,dilate) { var out=new Uint8Array(src.length); for(var y=1;y<h-1;y++) for(var x=1;x<w-1;x++){var value=dilate?0:1; for(var yy=-1;yy<=1;yy++) for(var xx=-1;xx<=1;xx++){var p=src[(y+yy)*w+x+xx]; value=dilate?(value||p?1:0):(value&&p?1:0);} out[y*w+x]=value;} return out; }
  function removeNoise(src,w,h,minPixels) { var out=src.slice(),seen=new Uint8Array(src.length),queue=new Int32Array(src.length); for(var start=0;start<src.length;start++){if(!src[start]||seen[start])continue;var head=0,tail=0,component=[];queue[tail++]=start;seen[start]=1;while(head<tail){var current=queue[head++];component.push(current);var x=current%w,y=Math.floor(current/w);for(var n=0;n<neighbors.length;n++){var nx=x+neighbors[n][1],ny=y+neighbors[n][0];if(nx<0||ny<0||nx>=w||ny>=h)continue;var next=ny*w+nx;if(src[next]&&!seen[next]){seen[next]=1;queue[tail++]=next;}}}if(component.length<minPixels)for(var i=0;i<component.length;i++)out[component[i]]=0;}return out; }
  function rdp(pts,eps) { if(pts.length<3)return pts; var a=pts[0],b=pts[pts.length-1],dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy,best=0,index=0; for(var i=1;i<pts.length-1;i++){var p=pts[i],t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0,d=Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy));if(d>best){best=d;index=i;}} if(best<=eps)return[a,b]; var left=rdp(pts.slice(0,index+1),eps),right=rdp(pts.slice(index),eps);return left.slice(0,-1).concat(right); }
  function traceShapes(binary,w,h) { var edges=[], key=function(x,y){return y*(w+1)+x;}, ink=function(x,y){return x>=0&&y>=0&&x<w&&y<h&&binary[y*w+x]===1;}; for(var y=0;y<h;y++)for(var x=0;x<w;x++){if(!ink(x,y))continue;if(!ink(x,y-1))edges.push([key(x,y),key(x+1,y)]);if(!ink(x+1,y))edges.push([key(x+1,y),key(x+1,y+1)]);if(!ink(x,y+1))edges.push([key(x+1,y+1),key(x,y+1)]);if(!ink(x-1,y))edges.push([key(x,y+1),key(x,y)]);} var outgoing=new Map();edges.forEach(function(e){var list=outgoing.get(e[0])||[];list.push(e[1]);outgoing.set(e[0],list);});var loops=[];while(outgoing.size){var start=outgoing.keys().next().value,current=start,loop=[start];for(var guard=0;guard<edges.length+1;guard++){var list=outgoing.get(current);if(!list||!list.length)break;var next=list.pop();if(!list.length)outgoing.delete(current);current=next;if(current===start)break;loop.push(current);}if(loop.length>=4)loops.push(loop);}return loops; }

  async function vectorize(file, smoothness) {
    var bitmap=await createImageBitmap(file), maxEdge=520, ratio=Math.min(1,maxEdge/Math.max(bitmap.width,bitmap.height)), w=Math.max(1,Math.round(bitmap.width*ratio)), h=Math.max(1,Math.round(bitmap.height*ratio));
    var c=document.createElement("canvas");c.width=w;c.height=h;var cctx=c.getContext("2d",{willReadFrequently:true});cctx.drawImage(bitmap,0,0,w,h);bitmap.close();
    var rgba=cctx.getImageData(0,0,w,h).data,gray=new Uint8Array(w*h);for(var i=0;i<gray.length;i++)gray[i]=Math.round(.299*rgba[i*4]+.587*rgba[i*4+1]+.114*rgba[i*4+2]);
    var integral=new Float64Array((w+1)*(h+1));for(var y=1;y<=h;y++){var row=0;for(var x=1;x<=w;x++){row+=gray[(y-1)*w+x-1];integral[y*(w+1)+x]=integral[(y-1)*(w+1)+x]+row;}}
    var normalized=new Uint8Array(gray.length),radius=12;for(y=0;y<h;y++)for(x=0;x<w;x++){var x0=Math.max(0,x-radius),y0=Math.max(0,y-radius),x1=Math.min(w-1,x+radius),y1=Math.min(h-1,y+radius),area=(x1-x0+1)*(y1-y0+1),mean=(integral[(y1+1)*(w+1)+x1+1]-integral[y0*(w+1)+x1+1]-integral[(y1+1)*(w+1)+x0]+integral[y0*(w+1)+x0])/area;normalized[y*w+x]=Math.max(0,Math.min(255,Math.round(gray[y*w+x]*255/(mean||255))));}
    await new Promise(function(resolve){setTimeout(resolve,0);});
    var threshold=otsu(normalized),binary=new Uint8Array(w*h);for(i=0;i<binary.length;i++)binary[i]=normalized[i]<threshold?1:0;var closed=removeNoise(morphology(morphology(binary,w,h,true),w,h,false),w,h,8);
    await new Promise(function(resolve){setTimeout(resolve,0);});
    var raw=traceShapes(closed,w,h);if(raw.length>12000)throw new Error("图片背景过于复杂，请先裁剪到笔记区域后重试");var epsilon=.45+(smoothness/100)*2.2,scale=Math.min(1200/w,800/h),offsetX=(1200-w*scale)/2,offsetY=(800-h*scale)/2;
    var contours=raw.map(function(loop){var step=Math.max(1,Math.ceil(loop.length/1600)),sampled=step===1?loop:loop.filter(function(_,index){return index%step===0;});return rdp(sampled.map(function(n){return{x:(n%(w+1))*scale+offsetX,y:Math.floor(n/(w+1))*scale+offsetY};}),Math.max(.3,epsilon*.55)*scale);}).filter(function(cn){return cn.length>=3;});
    return contours.length ? [{contours:contours}] : [];
  }

  function vectorizeSafely(file, smoothness) {
    if (!window.Worker) return vectorize(file, smoothness);
    return new Promise(function (resolve, reject) {
      var worker = new Worker("/js/paper2ink-worker.js?v=1");
      var timer = setTimeout(function () { worker.terminate(); reject(new Error("处理时间过长，请裁剪到笔记区域或降低图片分辨率后重试")); }, 15000);
      worker.onmessage = function (event) { clearTimeout(timer); worker.terminate(); if (event.data.error) reject(new Error(event.data.error)); else resolve(event.data.shapes); };
      worker.onerror = function () { clearTimeout(timer); worker.terminate(); reject(new Error("浏览器无法启动图像处理，请刷新页面后重试")); };
      worker.postMessage({ file:file, smoothness:smoothness });
    });
  }

  $("convert").addEventListener("click", async function () {
    if (!state.file) return; var button=this; button.disabled=true; $("processing").hidden=false; $("ready-badge").hidden=true; setStatus("正在清理背景并构建矢量轮廓…");
    try { await new Promise(function(r){setTimeout(r,30);}); state.shapes=await vectorizeSafely(state.file,Number($("smoothness").value)); state.strokes=[];state.erasures=[];state.ready=true;render();artboard.classList.add("is-converted");$("ready-badge").hidden=false;$("export-svg").disabled=false;$("export-json").disabled=false;var count=state.shapes.reduce(function(n,s){return n+s.contours.length;},0);setStatus("转换完成：重建了 "+count+" 个轮廓。可继续擦除或补画。",true);button.textContent="重新转换";
    } catch (error) { setStatus("转换失败："+(error.message||"无法读取这张图片")); } finally { button.disabled=false;$("processing").hidden=true; }
  });

  document.querySelectorAll("[data-mode]").forEach(function(button){button.addEventListener("click",function(){state.mode=this.dataset.mode;document.querySelectorAll("[data-mode]").forEach(function(b){b.classList.toggle("is-active",b.dataset.mode===state.mode);});});});
  function coordinates(e){var r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(1200/r.width),y:(e.clientY-r.top)*(800/r.height)};}
  function eraseAt(p){var last=state.erasures[state.erasures.length-1];if(last&&Math.hypot(last.x-p.x,last.y-p.y)<10)return;state.erasures.push({x:p.x,y:p.y,radius:22});render();}
  canvas.addEventListener("pointerdown",function(e){if(!state.ready)return;canvas.setPointerCapture(e.pointerId);var p=coordinates(e);if(state.mode==="eraser")eraseAt(p);else{state.drawing={points:[p],width:3};state.strokes.push(state.drawing);}});
  canvas.addEventListener("pointermove",function(e){if(!canvas.hasPointerCapture(e.pointerId)||!state.ready)return;var p=coordinates(e);if(state.mode==="eraser")eraseAt(p);else if(state.drawing){state.drawing.points.push(p);render();}});
  ["pointerup","pointercancel"].forEach(function(name){canvas.addEventListener(name,function(){state.drawing=null;});});
  function setZoom(value){state.zoom=Math.max(50,Math.min(200,value));artboard.style.transform="scale("+(state.zoom/100)+")";$("zoom-value").textContent=state.zoom+"%";}
  $("zoom-out").addEventListener("click",function(){setZoom(state.zoom-10);});$("zoom-in").addEventListener("click",function(){setZoom(state.zoom+10);});

  function svgMarkup(){var shapePaths=state.shapes.map(function(shape,i){return '<path id="shape-'+(i+1)+'" d="'+shape.contours.map(function(c){return pointPath(c,true);}).join(" ")+'" fill="#24231f" fill-rule="evenodd"/>';}).join("");var strokePaths=state.strokes.filter(function(s){return s.points.length>1;}).map(function(s,i){return '<path id="stroke-'+(i+1)+'" d="'+pointPath(s.points,false)+'" fill="none" stroke="#24231f" stroke-width="'+s.width+'" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';}).join("");var holes=state.erasures.map(function(e){return '<circle cx="'+e.x.toFixed(1)+'" cy="'+e.y.toFixed(1)+'" r="'+e.radius+'" fill="black"/>';}).join("");var mask=holes?'<defs><mask id="eraser-mask"><rect width="100%" height="100%" fill="white"/>'+holes+'</mask></defs>':"";var content=holes?'<g mask="url(#eraser-mask)">'+shapePaths+strokePaths+'</g>':shapePaths+strokePaths;return '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">'+mask+content+'</svg>';}
  $("export-svg").addEventListener("click",function(){download(svgMarkup(),"image/svg+xml;charset=utf-8",baseName()+"-paper2ink.svg");});
  $("export-json").addEventListener("click",function(){download(JSON.stringify({version:1,canvas:{width:1200,height:800},shapes:state.shapes,strokes:state.strokes,erasures:state.erasures},null,2),"application/json",baseName()+"-paper2ink.json");});
})();
