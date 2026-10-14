(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var app = $("paper2ink-app");
  if (!app) return;

  var state = { file: null, url: "", mode: "pen", zoom: 100, ready: false, shapes: [], strokes: [], erasures: [], drawing: null, generation:0, processing:false, cancel:null };
  var input = $("file-input"), drop = $("drop-zone"), workspace = $("workspace"), artboard = $("artboard");
  var preview = $("vector-preview"), canvas = $("edit-layer"), ctx = canvas.getContext("2d");


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
    cancelProcessing();
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
  $("remove-file").addEventListener("click", function () { cancelProcessing(); state.ready=false; if (state.url) URL.revokeObjectURL(state.url); state.file = null; input.value = ""; workspace.hidden = true; drop.hidden = false; });
  [["smoothness","smooth-value"],["background-cleanup","cleanup-value"],["ink-strength","strength-value"]].forEach(function(pair){$(pair[0]).addEventListener("input",function(){$(pair[1]).textContent=this.value;});});

  function setBusy(busy) {
    state.processing=busy; $("convert").disabled=busy; $("processing").hidden=!busy;
    ["smoothness","background-cleanup","ink-strength","shadow-removal"].forEach(function(id){$(id).disabled=busy;});
    $("export-svg").disabled=busy||!state.ready; $("export-json").disabled=busy||!state.ready;
  }
  function cancelProcessing() {
    state.generation++; if(state.cancel)state.cancel(); state.cancel=null; setBusy(false);
  }

  function vectorizeSafely(file, smoothness, options) {
    if (!window.Worker || !window.OffscreenCanvas) return window.Paper2InkCore.vectorizeImage(file,smoothness,options).then(function(r){return r.shapes;});
    return new Promise(function(resolve,reject){
      var worker=new Worker("/js/paper2ink-worker.js?v=20261014"), timer;
      function finish(){clearTimeout(timer);worker.terminate();state.cancel=null;}
      state.cancel=function(){finish();reject(new Error("Conversion cancelled"));};
      timer=setTimeout(function(){finish();reject(new Error("处理时间过长，请裁剪到笔记区域或降低图片分辨率后重试"));},30000);
      worker.onmessage=function(e){finish();e.data.error?reject(new Error(e.data.error)):resolve(e.data.shapes);};
      worker.onerror=function(){finish();reject(new Error("浏览器无法启动图像处理，请刷新页面后重试"));};
      worker.postMessage({file:file,smoothness:smoothness,options:options});
    });
  }
  $("convert").addEventListener("click",async function(){
    if(!state.file||state.processing)return;
    var id=++state.generation; setBusy(true); $("ready-badge").hidden=true; setStatus("正在清理背景并构建矢量轮廓…");
    try{
      await new Promise(function(r){setTimeout(r,30);});
      if(id!==state.generation)return;
      var shapes=await vectorizeSafely(state.file,Number($("smoothness").value),{
        maxEdge:2400,backgroundCleanup:Number($("background-cleanup").value),
        inkStrength:Number($("ink-strength").value),shadowRemoval:$("shadow-removal").checked
      });
      if(id!==state.generation)return;
      var count=shapes.reduce(function(n,s){return n+s.contours.length;},0);
      if(!count)throw new Error("未检测到可用笔迹，请提高笔迹强度或降低背景清理强度");
      state.shapes=shapes;state.strokes=[];state.erasures=[];state.ready=true;render();
      artboard.classList.add("is-converted");$("ready-badge").hidden=false;
      setStatus("转换完成：重建了 "+count+" 个轮廓。可继续擦除或补画。",true);$("convert").textContent="重新转换";
    }catch(error){if(id===state.generation)setStatus("转换失败："+(error.message||"无法读取这张图片"));}
    finally{if(id===state.generation)setBusy(false);}
  });

  document.querySelectorAll("[data-mode]").forEach(function(button){button.addEventListener("click",function(){state.mode=this.dataset.mode;document.querySelectorAll("[data-mode]").forEach(function(b){b.classList.toggle("is-active",b.dataset.mode===state.mode);});});});
  function coordinates(e){var r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(1200/r.width),y:(e.clientY-r.top)*(800/r.height)};}
  function eraseAt(p){var last=state.erasures[state.erasures.length-1];if(last&&Math.hypot(last.x-p.x,last.y-p.y)<10)return;state.erasures.push({x:p.x,y:p.y,radius:22});render();}
  canvas.addEventListener("pointerdown",function(e){if(!state.ready||state.processing)return;canvas.setPointerCapture(e.pointerId);var p=coordinates(e);if(state.mode==="eraser")eraseAt(p);else{state.drawing={points:[p],width:3};state.strokes.push(state.drawing);}});
  canvas.addEventListener("pointermove",function(e){if(!canvas.hasPointerCapture(e.pointerId)||!state.ready)return;var p=coordinates(e);if(state.mode==="eraser")eraseAt(p);else if(state.drawing){state.drawing.points.push(p);render();}});
  ["pointerup","pointercancel"].forEach(function(name){canvas.addEventListener(name,function(){state.drawing=null;});});
  function setZoom(value){state.zoom=Math.max(50,Math.min(200,value));artboard.style.transform="scale("+(state.zoom/100)+")";$("zoom-value").textContent=state.zoom+"%";}
  $("zoom-out").addEventListener("click",function(){setZoom(state.zoom-10);});$("zoom-in").addEventListener("click",function(){setZoom(state.zoom+10);});

  function svgMarkup(){var shapePaths=state.shapes.map(function(shape,i){return '<path id="shape-'+(i+1)+'" d="'+shape.contours.map(function(c){return pointPath(c,true);}).join(" ")+'" fill="#24231f" fill-rule="evenodd"/>';}).join("");var strokePaths=state.strokes.filter(function(s){return s.points.length>1;}).map(function(s,i){return '<path id="stroke-'+(i+1)+'" d="'+pointPath(s.points,false)+'" fill="none" stroke="#24231f" stroke-width="'+s.width+'" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';}).join("");var holes=state.erasures.map(function(e){return '<circle cx="'+e.x.toFixed(1)+'" cy="'+e.y.toFixed(1)+'" r="'+e.radius+'" fill="black"/>';}).join("");var mask=holes?'<defs><mask id="eraser-mask"><rect width="100%" height="100%" fill="white"/>'+holes+'</mask></defs>':"";var content=holes?'<g mask="url(#eraser-mask)">'+shapePaths+strokePaths+'</g>':shapePaths+strokePaths;return '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">'+mask+content+'</svg>';}
  $("export-svg").addEventListener("click",function(){download(svgMarkup(),"image/svg+xml;charset=utf-8",baseName()+"-paper2ink.svg");});
  $("export-json").addEventListener("click",function(){download(JSON.stringify({version:1,canvas:{width:1200,height:800},shapes:state.shapes,strokes:state.strokes,erasures:state.erasures},null,2),"application/json",baseName()+"-paper2ink.json");});
})();
