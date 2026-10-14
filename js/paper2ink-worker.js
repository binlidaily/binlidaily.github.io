"use strict";
importScripts("/js/paper2ink-core.js?v=20261014");
self.onmessage=async function(event){
  var bitmap;
  try{
    var data=event.data,options=data.options||{};
    bitmap=await createImageBitmap(data.file);
    var maxEdge=Math.max(1,Math.min(4096,options.maxEdge||2400)),ratio=Math.min(1,maxEdge/Math.max(bitmap.width,bitmap.height));
    var w=Math.max(1,Math.round(bitmap.width*ratio)),h=Math.max(1,Math.round(bitmap.height*ratio));
    var canvas=new OffscreenCanvas(w,h),ctx=canvas.getContext("2d",{willReadFrequently:true});
    if(!ctx)throw new Error("无法创建图像处理画布");
    ctx.fillStyle="#fff";ctx.fillRect(0,0,w,h);ctx.drawImage(bitmap,0,0,w,h);
    var result=self.Paper2InkCore.vectorizePixels(ctx.getImageData(0,0,w,h).data,w,h,data.smoothness,options);
    self.postMessage({shapes:result.shapes});
  }catch(error){self.postMessage({error:error&&error.message?error.message:"矢量转换失败"});}
  finally{if(bitmap)bitmap.close();}
};
