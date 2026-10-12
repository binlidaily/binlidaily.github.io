/* Browser-only Python runner for the project 01 notebook cells. */
var py = null;
self.onmessage = async function (event) {
  var data = event.data || {};
  if (data.type === "init") {
    try {
      importScripts("./pyodide/v314.0.7/pyodide.js");
      py = await loadPyodide({indexURL: new URL("./pyodide/v314.0.7/", self.location.href).href});
      self.postMessage({type: "ready"});
    } catch (error) {
      self.postMessage({type: "fatal", message: String(error)});
    }
    return;
  }
  if (data.type !== "run" || !py) return;
  try {
    py.globals.set("student_code", String(data.code || ""));
    var result = await py.runPythonAsync(
      "import contextlib, io, traceback\n" +
      "_out = io.StringIO()\n" +
      "try:\n" +
      "    with contextlib.redirect_stdout(_out):\n" +
      "        exec(student_code, {})\n" +
      "except Exception:\n" +
      "    traceback.print_exc(limit=5, file=_out)\n" +
      "_out.getvalue()"
    );
    self.postMessage({type: "result", id: data.id, output: String(result || "执行完成（没有输出）").slice(0, 12000)});
  } catch (error) {
    self.postMessage({type: "result", id: data.id, output: String(error)});
  }
};
