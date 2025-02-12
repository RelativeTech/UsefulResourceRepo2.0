//CdnPath=http://ajax.aspnetcdn.com/ajax/4.5.1/1/MicrosoftAjaxHistory.js
//----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
//----------------------------------------------------------
// MicrosoftAjaxHistory.js
Type._registerScript("MicrosoftAjaxHistory.js", [
  "MicrosoftAjaxComponentModel.js",
  "MicrosoftAjaxSerialization.js",
]);
Sys.HistoryEventArgs = function (a) {
  Sys.HistoryEventArgs.initializeBase(this);
  this._state = a;
};
Sys.HistoryEventArgs.prototype = {
  get_state: function () {
    return this._state;
  },
};
Sys.HistoryEventArgs.registerClass("Sys.HistoryEventArgs", Sys.EventArgs);
Sys.Application._appLoadHandler = null;
Sys.Application._beginRequestHandler = null;
Sys.Application._clientId = null;
Sys.Application._currentEntry = "";
Sys.Application._endRequestHandler = null;
Sys.Application._history = null;
Sys.Application._enableHistory = false;
Sys.Application._historyFrame = null;
Sys.Application._historyInitialized = false;
Sys.Application._historyPointIsNew = false;
Sys.Application._ignoreTimer = false;
Sys.Application._initialState = null;
Sys.Application._state = {};
Sys.Application._timerCookie = 0;
Sys.Application._timerHandler = null;
Sys.Application._uniqueId = null;
Sys._Application.prototype.get_stateString = function () {
  var a = null;
  if (Sys.Browser.agent === Sys.Browser.Firefox) {
    var c = window.location.href,
      b = c.indexOf("#");
    if (b !== -1) a = c.substring(b + 1);
    else a = "";
    return a;
  } else a = window.location.hash;
  if (a.length > 0 && a.charAt(0) === "#") a = a.substring(1);
  return a;
};
Sys._Application.prototype.get_enableHistory = function () {
  return this._enableHistory;
};
Sys._Application.prototype.set_enableHistory = function (a) {
  this._enableHistory = a;
};
Sys._Application.prototype.add_navigate = function (a) {
  this.get_events().addHandler("navigate", a);
};
Sys._Application.prototype.remove_navigate = function (a) {
  this.get_events().removeHandler("navigate", a);
};
Sys._Application.prototype.addHistoryPoint = function (c, f) {
  this._ensureHistory();
  var b = this._state;
  for (var a in c) {
    var d = c[a];
    if (d === null) {
      if (typeof b[a] !== "undefined") delete b[a];
    } else b[a] = d;
  }
  var e = this._serializeState(b);
  this._historyPointIsNew = true;
  this._setState(e, f);
  this._raiseNavigate();
};
Sys._Application.prototype.setServerId = function (a, b) {
  this._clientId = a;
  this._uniqueId = b;
};
Sys._Application.prototype.setServerState = function (a) {
  this._ensureHistory();
  this._state.__s = a;
  this._updateHiddenField(a);
};
Sys._Application.prototype._deserializeState = function (a) {
  var e = {};
  a = a || "";
  var b = a.indexOf("&&");
  if (b !== -1 && b + 2 < a.length) {
    e.__s = a.substr(b + 2);
    a = a.substr(0, b);
  }
  var g = a.split("&");
  for (var f = 0, j = g.length; f < j; f++) {
    var d = g[f],
      c = d.indexOf("=");
    if (c !== -1 && c + 1 < d.length) {
      var i = d.substr(0, c),
        h = d.substr(c + 1);
      e[i] = decodeURIComponent(h);
    }
  }
  return e;
};
Sys._Application.prototype._enableHistoryInScriptManager = function () {
  this._enableHistory = true;
};
Sys._Application.prototype._ensureHistory = function () {
  if (!this._historyInitialized && this._enableHistory) {
    if (
      Sys.Browser.agent === Sys.Browser.InternetExplorer &&
      document.documentMode < 8
    ) {
      this._historyFrame = document.getElementById("__historyFrame");
      this._ignoreIFrame = true;
    }
    this._timerHandler = Function.createDelegate(this, this._onIdle);
    this._timerCookie = window.setTimeout(this._timerHandler, 100);
    try {
      this._initialState = this._deserializeState(this.get_stateString());
    } catch (a) {}
    this._historyInitialized = true;
  }
};
Sys._Application.prototype._navigate = function (c) {
  this._ensureHistory();
  var b = this._deserializeState(c);
  if (this._uniqueId) {
    var d = this._state.__s || "",
      a = b.__s || "";
    if (a !== d) {
      this._updateHiddenField(a);
      __doPostBack(this._uniqueId, a);
      this._state = b;
      return;
    }
  }
  this._setState(c);
  this._state = b;
  this._raiseNavigate();
};
Sys._Application.prototype._onIdle = function () {
  delete this._timerCookie;
  var a = this.get_stateString();
  if (a !== this._currentEntry) {
    if (!this._ignoreTimer) {
      this._historyPointIsNew = false;
      this._navigate(a);
    }
  } else this._ignoreTimer = false;
  this._timerCookie = window.setTimeout(this._timerHandler, 100);
};
Sys._Application.prototype._onIFrameLoad = function (a) {
  if (document.documentMode < 8) {
    this._ensureHistory();
    if (!this._ignoreIFrame) {
      this._historyPointIsNew = false;
      this._navigate(a);
    }
    this._ignoreIFrame = false;
  }
};
Sys._Application.prototype._onPageRequestManagerBeginRequest = function () {
  this._ignoreTimer = true;
  this._originalTitle = document.title;
};
Sys._Application.prototype._onPageRequestManagerEndRequest = function (g, f) {
  var d = f.get_dataItems()[this._clientId],
    c = this._originalTitle;
  this._originalTitle = null;
  var b = document.getElementById("__EVENTTARGET");
  if (b && b.value === this._uniqueId) b.value = "";
  if (typeof d !== "undefined") {
    this.setServerState(d);
    this._historyPointIsNew = true;
  } else this._ignoreTimer = false;
  var a = this._serializeState(this._state);
  if (a !== this._currentEntry) {
    this._ignoreTimer = true;
    if (typeof c === "string") {
      if (
        Sys.Browser.agent !== Sys.Browser.InternetExplorer ||
        Sys.Browser.version > 7
      ) {
        var e = document.title;
        document.title = c;
        this._setState(a);
        document.title = e;
      } else this._setState(a);
      this._raiseNavigate();
    } else {
      this._setState(a);
      this._raiseNavigate();
    }
  }
};
Sys._Application.prototype._raiseNavigate = function () {
  var d = this._historyPointIsNew,
    c = this.get_events().getHandler("navigate"),
    b = {};
  for (var a in this._state) if (a !== "__s") b[a] = this._state[a];
  var e = new Sys.HistoryEventArgs(b);
  if (c) c(this, e);
  if (!d) {
    var f;
    try {
      if (
        Sys.Browser.agent === Sys.Browser.Firefox &&
        window.location.hash &&
        (!window.frameElement || window.top.location.hash)
      )
        Sys.Browser.version < 3.5
          ? window.history.go(0)
          : (location.hash = this.get_stateString());
    } catch (g) {}
  }
};
Sys._Application.prototype._serializeState = function (d) {
  var b = [];
  for (var a in d) {
    var e = d[a];
    if (a === "__s") var c = e;
    else b[b.length] = a + "=" + encodeURIComponent(e);
  }
  return b.join("&") + (c ? "&&" + c : "");
};
Sys._Application.prototype._setState = function (a, b) {
  if (this._enableHistory) {
    a = a || "";
    if (a !== this._currentEntry) {
      if (window.theForm) {
        var d = window.theForm.action,
          e = d.indexOf("#");
        window.theForm.action = (e !== -1 ? d.substring(0, e) : d) + "#" + a;
      }
      if (this._historyFrame && this._historyPointIsNew) {
        var f = document.createElement("div");
        f.appendChild(document.createTextNode(b || document.title));
        var g = f.innerHTML;
        this._ignoreIFrame = true;
        var c = this._historyFrame.contentWindow.document;
        c.open("javascript:'<html></html>'");
        c.write(
          "<html><head><title>" +
            g +
            "</title><scri" +
            'pt type="text/javascript">parent.Sys.Application._onIFrameLoad(' +
            Sys.Serialization.JavaScriptSerializer.serialize(a) +
            ");</scri" +
            "pt></head><body></body></html>"
        );
        c.close();
      }
      this._ignoreTimer = false;
      this._currentEntry = a;
      if (this._historyFrame || this._historyPointIsNew) {
        var h = this.get_stateString();
        if (a !== h) {
          window.location.hash = a;
          this._currentEntry = this.get_stateString();
          if (typeof b !== "undefined" && b !== null) document.title = b;
        }
      }
      this._historyPointIsNew = false;
    }
  }
};
Sys._Application.prototype._updateHiddenField = function (b) {
  if (this._clientId) {
    var a = document.getElementById(this._clientId);
    if (a) a.value = b;
  }
};
