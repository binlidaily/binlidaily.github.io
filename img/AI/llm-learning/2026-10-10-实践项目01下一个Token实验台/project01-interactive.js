(function () {
  "use strict";
  var root = document.getElementById("p01-lab");
  if (!root) return;

  // A real, tiny neural bigram trained locally from the bundled example sentences.
  // It is deliberately separate from the student's PyTorch homework.
  var lines = [
    "我喜欢苹果。", "我喜欢香蕉。", "我喜欢学习。", "我喜欢散步。",
    "苹果喜欢阳光。", "苹果喜欢雨水。", "苹果很好吃。", "香蕉很好吃。",
    "今天我学习模型。", "今天我学习代码。", "明天我继续学习。", "学习需要练习。",
    "代码需要测试。", "模型预测字符。", "字符组成句子。", "句子有开始和结束。",
    "我今天读一本书。", "我明天写一点代码。", "苹果是水果。", "香蕉是水果。",
    "天气很好。", "今天阳光很好。", "我喝一杯水。", "我吃一个苹果。",
    "我写一行代码。", "模型会犯错。", "错误也能帮助学习。", "我喜欢做实验。",
    "实验需要记录。", "记录帮助我复盘。"
  ];
  var tokens = ["<BOS>", "<EOS>", "<UNK>"].concat(Array.from(new Set(Array.from(lines.join("")))).sort());
  var ids = Object.create(null);
  tokens.forEach(function (t, i) { ids[t] = i; });
  var V = tokens.length, D = 8, seed = 42;
  function rand() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }
  var E = Array.from({length: V}, function () { return Array.from({length: D}, function () { return (rand() - .5) * .25; }); });
  var W = Array.from({length: D}, function () { return Array.from({length: V}, function () { return (rand() - .5) * .25; }); });
  var bias = Array(V).fill(0);
  function raw(id) {
    return bias.map(function (b, j) {
      var x = b;
      for (var k = 0; k < D; k++) x += E[id][k] * W[k][j];
      return x;
    });
  }
  function softmax(values) {
    var max = Math.max.apply(null, values);
    var exp = values.map(function (x) { return isFinite(x) ? Math.exp(x - max) : 0; });
    var total = exp.reduce(function (a, b) { return a + b; }, 0);
    return exp.map(function (x) { return x / total; });
  }
  var pairs = [];
  lines.forEach(function (s) {
    var seq = [ids["<BOS>"]].concat(Array.from(s).map(function (c) { return ids[c]; }), [ids["<EOS>"]]);
    for (var i = 0; i < seq.length - 1; i++) pairs.push([seq[i], seq[i + 1]]);
  });
  for (var epoch = 0; epoch < 80; epoch++) {
    pairs.forEach(function (pair) {
      var x = pair[0], y = pair[1], p = softmax(raw(x)), oldE = E[x].slice(), lr = .055;
      var gradE = Array(D).fill(0);
      for (var j = 0; j < V; j++) {
        var g = p[j] - (j === y ? 1 : 0);
        bias[j] -= lr * g;
        for (var k = 0; k < D; k++) {
          gradE[k] += g * W[k][j];
          W[k][j] -= lr * g * oldE[k];
        }
      }
      for (var k2 = 0; k2 < D; k2++) E[x][k2] -= lr * gradE[k2];
    });
  }
  function q(selector) { return root.querySelector(selector); }
  var input = q("[data-prompt]"), temp = q("[data-temp]"), topK = q("[data-k]"), topP = q("[data-p]");
  var current = null, stopped = false;
  function lastId(text) {
    var chars = Array.from(text);
    return chars.length ? (ids[chars[chars.length - 1]] === undefined ? ids["<UNK>"] : ids[chars[chars.length - 1]]) : ids["<BOS>"];
  }
  function distribution(logits) {
    var t = Number(temp.value), k = Number(topK.value), p = Number(topP.value);
    var scores = logits.map(function (x, i) { return i < 3 ? -Infinity : x / t; });
    var ranked = scores.map(function (_, i) { return i; }).filter(function (i) { return isFinite(scores[i]); })
      .sort(function (a, b) { return scores[b] - scores[a]; });
    if (k > 0) ranked = ranked.slice(0, k);
    var keep = new Set(ranked), masked = scores.map(function (x, i) { return keep.has(i) ? x : -Infinity; });
    var probs = softmax(masked);
    var kept = [], cumulative = 0;
    ranked.forEach(function (i) {
      if (cumulative < p || kept.length === 0) { kept.push(i); cumulative += probs[i]; }
    });
    keep = new Set(kept);
    masked = scores.map(function (x, i) { return keep.has(i) ? x : -Infinity; });
    return softmax(masked);
  }
  function put(el, value) { el.textContent = value; }
  function render() {
    var text = input.value, chars = Array.from(text), id = lastId(text), logits = raw(id), prob = distribution(logits);
    current = {logits: logits, prob: prob};
    put(q("[data-temp-value]"), Number(temp.value).toFixed(1));
    put(q("[data-p-value]"), Number(topP.value).toFixed(2));
    put(q("[data-id]"), (chars.length ? JSON.stringify(chars[chars.length - 1]) : "<BOS>") + " → " + id);
    put(q("[data-vector]"), "[" + E[id].map(function (x) { return x.toFixed(2); }).join(", ") + "]");
    var tokenBox = q("[data-tokens]"); tokenBox.replaceChildren();
    chars.slice(-14).forEach(function (c) {
      var box = document.createElement("span"), small = document.createElement("small");
      box.className = "p01-token"; box.textContent = c === " " ? "空格" : c;
      small.textContent = ids[c] === undefined ? ids["<UNK>"] + " (UNK)" : ids[c];
      box.appendChild(small); tokenBox.appendChild(box);
    });
    if (!chars.length) put(tokenBox, "<BOS> → " + ids["<BOS>"]);
    var tbody = q("[data-candidates]"); tbody.replaceChildren();
    var order = prob.map(function (_, i) { return i; }).filter(function (i) { return prob[i] > 0; })
      .sort(function (a, b) { return prob[b] - prob[a]; });
    order.slice(0, 8).forEach(function (i) {
      var tr = document.createElement("tr"), name = document.createElement("td"), score = document.createElement("td"), value = document.createElement("td"), barCell = document.createElement("td"), bar = document.createElement("div");
      name.textContent = tokens[i] === " " ? "空格" : tokens[i];
      score.textContent = logits[i].toFixed(2); value.textContent = (prob[i] * 100).toFixed(1) + "%";
      bar.className = "p01-bar"; bar.style.width = Math.max(2, prob[i] * 100) + "%";
      barCell.className = "p01-bars"; barCell.appendChild(bar);
      [name, score, value, barCell].forEach(function (cell) { tr.appendChild(cell); }); tbody.appendChild(tr);
    });
    var count = order.length, shown = Math.min(count, 8);
    put(q("[data-count]"), "保留 " + count + " 个候选" + (count > shown ? "，表中显示前 " + shown + " 个" : "") + "；概率和 = " + prob.reduce(function (a, b) { return a + b; }, 0).toFixed(3));
    if (stopped) q("[data-result]").textContent = "抽到 <EOS>，这一句结束。修改输入后可继续。";
  }
  function choose(greedy) {
    if (stopped) { put(q("[data-result]"), "上一轮已遇到 <EOS>；请修改输入或点重置。"); return; }
    var prob = current.prob, id;
    if (greedy) id = prob.indexOf(Math.max.apply(null, prob));
    else {
      var r = Math.random(), sum = 0; id = prob.length - 1;
      for (var i = 0; i < prob.length; i++) { sum += prob[i]; if (r <= sum) { id = i; break; } }
    }
    var token = tokens[id];
    if (token === "<EOS>") { stopped = true; render(); return; }
    input.value += token;
    render();
    put(q("[data-result]"), (greedy ? "选择概率最高项：" : "按当前概率随机抽到：") + JSON.stringify(token) + "；已追加到输入，下一步重新预测。");
  }
  [input, temp, topK, topP].forEach(function (el) { el.addEventListener("input", function () { stopped = false; render(); }); });
  q("[data-greedy]").addEventListener("click", function () { choose(true); });
  q("[data-sample]").addEventListener("click", function () { choose(false); });
  q("[data-reset]").addEventListener("click", function () { input.value = "我喜欢"; stopped = false; render(); put(q("[data-result]"), "已重置。试试改成“苹果喜欢”：两者最后一个字相同，下一步概率也相同。 "); });
  render();
})();
