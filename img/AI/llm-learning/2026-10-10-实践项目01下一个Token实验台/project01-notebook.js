(function () {
  "use strict";
  var root = document.getElementById("p01-notebook");
  if (!root) return;
  var worker = null, ready = false, pending = null, timeout = null, initTimeout = null;
  var status = root.querySelector("[data-status]");
  function setStatus(message) { status.textContent = message; }
  function enableRuns(enabled) {
    root.querySelectorAll("[data-run]").forEach(function (b) { b.disabled = !enabled; });
  }
  function stopWorker(message) {
    if (pending) {
      var cell = root.querySelector('[data-cell="' + pending.id + '"]');
      if (cell && cell.querySelector("[data-output]").textContent === "运行中……") {
        cell.querySelector("[data-output]").textContent = "运行未完成。";
      }
    }
    if (worker) worker.terminate();
    worker = null; ready = false; pending = null;
    if (timeout) clearTimeout(timeout);
    if (initTimeout) clearTimeout(initTimeout);
    timeout = null; initTimeout = null; enableRuns(true); setStatus(message);
  }
  function startWorker() {
    if (worker) return;
    setStatus("正在加载 Python 运行环境，首次打开可能需要一些时间……");
    try {
      worker = new Worker("/img/AI/llm-learning/2026-10-10-实践项目01下一个Token实验台/project01-notebook-worker.js");
    } catch (error) {
      stopWorker("浏览器无法启动 Python 运行环境：" + String(error));
      return;
    }
    initTimeout = setTimeout(function () { if (!ready) stopWorker("Python 加载超时；请检查网络后重试。"); }, 45000);
    worker.onmessage = function (event) {
      var data = event.data || {};
      if (data.type === "ready") {
        if (initTimeout) clearTimeout(initTimeout);
        initTimeout = null;
        ready = true; setStatus("Python 已就绪。修改代码后，点击对应单元的“运行”。");
        if (pending) sendPending();
      } else if (data.type === "fatal") {
        stopWorker("加载失败：" + data.message + "。请检查网络；也可以下载本地作业包。 ");
      } else if (data.type === "result") {
        if (timeout) clearTimeout(timeout);
        timeout = null;
        var cell = root.querySelector('[data-cell="' + data.id + '"]');
        if (cell) cell.querySelector("[data-output]").textContent = data.output;
        pending = null; enableRuns(true); setStatus("运行完成。代码只在你的浏览器中执行。");
      }
    };
    worker.onerror = function () { stopWorker("Python 运行环境无法启动。请检查网络后重试。"); };
    worker.postMessage({type: "init"});
  }
  function sendPending() {
    if (!worker || !ready || !pending) return;
    worker.postMessage({type: "run", id: pending.id, code: pending.code});
    timeout = setTimeout(function () {
      if (pending) {
        var cell = root.querySelector('[data-cell="' + pending.id + '"]');
        if (cell) cell.querySelector("[data-output]").textContent = "运行超过 15 秒，已停止。检查是否有死循环。";
        stopWorker("运行已停止；下次点击运行会重新加载 Python。");
      }
    }, 15000);
  }
  root.querySelectorAll("[data-cell]").forEach(function (cell) {
    var id = cell.dataset.cell, editor = cell.querySelector("textarea"), output = cell.querySelector("[data-output]");
    var initial = editor.value, key = "p01-notebook-" + id;
    try { var saved = localStorage.getItem(key); if (saved !== null) editor.value = saved; } catch (_) {}
    editor.addEventListener("input", function () { try { localStorage.setItem(key, editor.value); } catch (_) {} });
    cell.querySelector("[data-run]").addEventListener("click", function () {
      if (pending) return;
      pending = {id: id, code: editor.value};
      output.textContent = "运行中……";
      enableRuns(false);
      if (!worker) startWorker(); else sendPending();
    });
    cell.querySelector("[data-restore]").addEventListener("click", function () {
      editor.value = initial; output.textContent = "尚未运行";
      try { localStorage.removeItem(key); } catch (_) {}
    });
  });
  root.querySelector("[data-stop]").addEventListener("click", function () { stopWorker("运行环境已重置；再次点击运行会重新加载 Python。"); });
})();
