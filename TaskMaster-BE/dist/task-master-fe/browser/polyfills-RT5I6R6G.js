'use strict';
(function (e) {
  let n = e.performance;
  function c(L) {
    n && n.mark && n.mark(L);
  }
  function r(L, t) {
    n && n.measure && n.measure(L, t);
  }
  c('Zone');
  let a = e.__Zone_symbol_prefix || '__zone_symbol__';
  function l(L) {
    return a + L;
  }
  let y = e[l('forceDuplicateZoneCheck')] === !0;
  if (e.Zone) {
    if (y || typeof e.Zone.__symbol__ != 'function')
      throw new Error('Zone already loaded.');
    return e.Zone;
  }
  let se = class se {
    static assertZonePatched() {
      if (e.Promise !== oe.ZoneAwarePromise)
        throw new Error(
          'Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)'
        );
    }
    static get root() {
      let t = se.current;
      for (; t.parent; ) t = t.parent;
      return t;
    }
    static get current() {
      return U.zone;
    }
    static get currentTask() {
      return ne;
    }
    static __load_patch(t, s, o = !1) {
      if (oe.hasOwnProperty(t)) {
        if (!o && y) throw Error('Already loaded patch: ' + t);
      } else if (!e['__Zone_disable_' + t]) {
        let v = 'Zone:' + t;
        c(v), (oe[t] = s(e, se, z)), r(v, v);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(t, s) {
      (this._parent = t),
        (this._name = s ? s.name || 'unnamed' : '<root>'),
        (this._properties = (s && s.properties) || {}),
        (this._zoneDelegate = new k(
          this,
          this._parent && this._parent._zoneDelegate,
          s
        ));
    }
    get(t) {
      let s = this.getZoneWith(t);
      if (s) return s._properties[t];
    }
    getZoneWith(t) {
      let s = this;
      for (; s; ) {
        if (s._properties.hasOwnProperty(t)) return s;
        s = s._parent;
      }
      return null;
    }
    fork(t) {
      if (!t) throw new Error('ZoneSpec required!');
      return this._zoneDelegate.fork(this, t);
    }
    wrap(t, s) {
      if (typeof t != 'function')
        throw new Error('Expecting function got: ' + t);
      let o = this._zoneDelegate.intercept(this, t, s),
        v = this;
      return function () {
        return v.runGuarded(o, this, arguments, s);
      };
    }
    run(t, s, o, v) {
      U = { parent: U, zone: this };
      try {
        return this._zoneDelegate.invoke(this, t, s, o, v);
      } finally {
        U = U.parent;
      }
    }
    runGuarded(t, s = null, o, v) {
      U = { parent: U, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, t, s, o, v);
        } catch (F) {
          if (this._zoneDelegate.handleError(this, F)) throw F;
        }
      } finally {
        U = U.parent;
      }
    }
    runTask(t, s, o) {
      if (t.zone != this)
        throw new Error(
          'A task can only be run in the zone of creation! (Creation: ' +
            (t.zone || $).name +
            '; Execution: ' +
            this.name +
            ')'
        );
      if (t.state === H && (t.type === K || t.type === P)) return;
      let v = t.state != T;
      v && t._transitionTo(T, M), t.runCount++;
      let F = ne;
      (ne = t), (U = { parent: U, zone: this });
      try {
        t.type == P && t.data && !t.data.isPeriodic && (t.cancelFn = void 0);
        try {
          return this._zoneDelegate.invokeTask(this, t, s, o);
        } catch (f) {
          if (this._zoneDelegate.handleError(this, f)) throw f;
        }
      } finally {
        t.state !== H &&
          t.state !== d &&
          (t.type == K || (t.data && t.data.isPeriodic)
            ? v && t._transitionTo(M, T)
            : ((t.runCount = 0),
              this._updateTaskCount(t, -1),
              v && t._transitionTo(H, T, H))),
          (U = U.parent),
          (ne = F);
      }
    }
    scheduleTask(t) {
      if (t.zone && t.zone !== this) {
        let o = this;
        for (; o; ) {
          if (o === t.zone)
            throw Error(
              `can not reschedule task to ${this.name} which is descendants of the original zone ${t.zone.name}`
            );
          o = o.parent;
        }
      }
      t._transitionTo(X, H);
      let s = [];
      (t._zoneDelegates = s), (t._zone = this);
      try {
        t = this._zoneDelegate.scheduleTask(this, t);
      } catch (o) {
        throw (
          (t._transitionTo(d, X, H), this._zoneDelegate.handleError(this, o), o)
        );
      }
      return (
        t._zoneDelegates === s && this._updateTaskCount(t, 1),
        t.state == X && t._transitionTo(M, X),
        t
      );
    }
    scheduleMicroTask(t, s, o, v) {
      return this.scheduleTask(new m(N, t, s, o, v, void 0));
    }
    scheduleMacroTask(t, s, o, v, F) {
      return this.scheduleTask(new m(P, t, s, o, v, F));
    }
    scheduleEventTask(t, s, o, v, F) {
      return this.scheduleTask(new m(K, t, s, o, v, F));
    }
    cancelTask(t) {
      if (t.zone != this)
        throw new Error(
          'A task can only be cancelled in the zone of creation! (Creation: ' +
            (t.zone || $).name +
            '; Execution: ' +
            this.name +
            ')'
        );
      if (!(t.state !== M && t.state !== T)) {
        t._transitionTo(x, M, T);
        try {
          this._zoneDelegate.cancelTask(this, t);
        } catch (s) {
          throw (
            (t._transitionTo(d, x), this._zoneDelegate.handleError(this, s), s)
          );
        }
        return (
          this._updateTaskCount(t, -1),
          t._transitionTo(H, x),
          (t.runCount = 0),
          t
        );
      }
    }
    _updateTaskCount(t, s) {
      let o = t._zoneDelegates;
      s == -1 && (t._zoneDelegates = null);
      for (let v = 0; v < o.length; v++) o[v]._updateTaskCount(t.type, s);
    }
  };
  se.__symbol__ = l;
  let _ = se,
    b = {
      name: '',
      onHasTask: (L, t, s, o) => L.hasTask(s, o),
      onScheduleTask: (L, t, s, o) => L.scheduleTask(s, o),
      onInvokeTask: (L, t, s, o, v, F) => L.invokeTask(s, o, v, F),
      onCancelTask: (L, t, s, o) => L.cancelTask(s, o),
    };
  class k {
    constructor(t, s, o) {
      (this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 }),
        (this.zone = t),
        (this._parentDelegate = s),
        (this._forkZS = o && (o && o.onFork ? o : s._forkZS)),
        (this._forkDlgt = o && (o.onFork ? s : s._forkDlgt)),
        (this._forkCurrZone = o && (o.onFork ? this.zone : s._forkCurrZone)),
        (this._interceptZS = o && (o.onIntercept ? o : s._interceptZS)),
        (this._interceptDlgt = o && (o.onIntercept ? s : s._interceptDlgt)),
        (this._interceptCurrZone =
          o && (o.onIntercept ? this.zone : s._interceptCurrZone)),
        (this._invokeZS = o && (o.onInvoke ? o : s._invokeZS)),
        (this._invokeDlgt = o && (o.onInvoke ? s : s._invokeDlgt)),
        (this._invokeCurrZone =
          o && (o.onInvoke ? this.zone : s._invokeCurrZone)),
        (this._handleErrorZS = o && (o.onHandleError ? o : s._handleErrorZS)),
        (this._handleErrorDlgt =
          o && (o.onHandleError ? s : s._handleErrorDlgt)),
        (this._handleErrorCurrZone =
          o && (o.onHandleError ? this.zone : s._handleErrorCurrZone)),
        (this._scheduleTaskZS =
          o && (o.onScheduleTask ? o : s._scheduleTaskZS)),
        (this._scheduleTaskDlgt =
          o && (o.onScheduleTask ? s : s._scheduleTaskDlgt)),
        (this._scheduleTaskCurrZone =
          o && (o.onScheduleTask ? this.zone : s._scheduleTaskCurrZone)),
        (this._invokeTaskZS = o && (o.onInvokeTask ? o : s._invokeTaskZS)),
        (this._invokeTaskDlgt = o && (o.onInvokeTask ? s : s._invokeTaskDlgt)),
        (this._invokeTaskCurrZone =
          o && (o.onInvokeTask ? this.zone : s._invokeTaskCurrZone)),
        (this._cancelTaskZS = o && (o.onCancelTask ? o : s._cancelTaskZS)),
        (this._cancelTaskDlgt = o && (o.onCancelTask ? s : s._cancelTaskDlgt)),
        (this._cancelTaskCurrZone =
          o && (o.onCancelTask ? this.zone : s._cancelTaskCurrZone)),
        (this._hasTaskZS = null),
        (this._hasTaskDlgt = null),
        (this._hasTaskDlgtOwner = null),
        (this._hasTaskCurrZone = null);
      let v = o && o.onHasTask,
        F = s && s._hasTaskZS;
      (v || F) &&
        ((this._hasTaskZS = v ? o : b),
        (this._hasTaskDlgt = s),
        (this._hasTaskDlgtOwner = this),
        (this._hasTaskCurrZone = t),
        o.onScheduleTask ||
          ((this._scheduleTaskZS = b),
          (this._scheduleTaskDlgt = s),
          (this._scheduleTaskCurrZone = this.zone)),
        o.onInvokeTask ||
          ((this._invokeTaskZS = b),
          (this._invokeTaskDlgt = s),
          (this._invokeTaskCurrZone = this.zone)),
        o.onCancelTask ||
          ((this._cancelTaskZS = b),
          (this._cancelTaskDlgt = s),
          (this._cancelTaskCurrZone = this.zone)));
    }
    fork(t, s) {
      return this._forkZS
        ? this._forkZS.onFork(this._forkDlgt, this.zone, t, s)
        : new _(t, s);
    }
    intercept(t, s, o) {
      return this._interceptZS
        ? this._interceptZS.onIntercept(
            this._interceptDlgt,
            this._interceptCurrZone,
            t,
            s,
            o
          )
        : s;
    }
    invoke(t, s, o, v, F) {
      return this._invokeZS
        ? this._invokeZS.onInvoke(
            this._invokeDlgt,
            this._invokeCurrZone,
            t,
            s,
            o,
            v,
            F
          )
        : s.apply(o, v);
    }
    handleError(t, s) {
      return this._handleErrorZS
        ? this._handleErrorZS.onHandleError(
            this._handleErrorDlgt,
            this._handleErrorCurrZone,
            t,
            s
          )
        : !0;
    }
    scheduleTask(t, s) {
      let o = s;
      if (this._scheduleTaskZS)
        this._hasTaskZS && o._zoneDelegates.push(this._hasTaskDlgtOwner),
          (o = this._scheduleTaskZS.onScheduleTask(
            this._scheduleTaskDlgt,
            this._scheduleTaskCurrZone,
            t,
            s
          )),
          o || (o = s);
      else if (s.scheduleFn) s.scheduleFn(s);
      else if (s.type == N) R(s);
      else throw new Error('Task is missing scheduleFn.');
      return o;
    }
    invokeTask(t, s, o, v) {
      return this._invokeTaskZS
        ? this._invokeTaskZS.onInvokeTask(
            this._invokeTaskDlgt,
            this._invokeTaskCurrZone,
            t,
            s,
            o,
            v
          )
        : s.callback.apply(o, v);
    }
    cancelTask(t, s) {
      let o;
      if (this._cancelTaskZS)
        o = this._cancelTaskZS.onCancelTask(
          this._cancelTaskDlgt,
          this._cancelTaskCurrZone,
          t,
          s
        );
      else {
        if (!s.cancelFn) throw Error('Task is not cancelable');
        o = s.cancelFn(s);
      }
      return o;
    }
    hasTask(t, s) {
      try {
        this._hasTaskZS &&
          this._hasTaskZS.onHasTask(
            this._hasTaskDlgt,
            this._hasTaskCurrZone,
            t,
            s
          );
      } catch (o) {
        this.handleError(t, o);
      }
    }
    _updateTaskCount(t, s) {
      let o = this._taskCounts,
        v = o[t],
        F = (o[t] = v + s);
      if (F < 0) throw new Error('More tasks executed then were scheduled.');
      if (v == 0 || F == 0) {
        let f = {
          microTask: o.microTask > 0,
          macroTask: o.macroTask > 0,
          eventTask: o.eventTask > 0,
          change: t,
        };
        this.hasTask(this.zone, f);
      }
    }
  }
  class m {
    constructor(t, s, o, v, F, f) {
      if (
        ((this._zone = null),
        (this.runCount = 0),
        (this._zoneDelegates = null),
        (this._state = 'notScheduled'),
        (this.type = t),
        (this.source = s),
        (this.data = v),
        (this.scheduleFn = F),
        (this.cancelFn = f),
        !o)
      )
        throw new Error('callback is not defined');
      this.callback = o;
      let u = this;
      t === K && v && v.useG
        ? (this.invoke = m.invokeTask)
        : (this.invoke = function () {
            return m.invokeTask.call(e, u, this, arguments);
          });
    }
    static invokeTask(t, s, o) {
      t || (t = this), ee++;
      try {
        return t.runCount++, t.zone.runTask(t, s, o);
      } finally {
        ee == 1 && E(), ee--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(H, X);
    }
    _transitionTo(t, s, o) {
      if (this._state === s || this._state === o)
        (this._state = t), t == H && (this._zoneDelegates = null);
      else
        throw new Error(
          `${this.type} '${
            this.source
          }': can not transition to '${t}', expecting state '${s}'${
            o ? " or '" + o + "'" : ''
          }, was '${this._state}'.`
        );
    }
    toString() {
      return this.data && typeof this.data.handleId < 'u'
        ? this.data.handleId.toString()
        : Object.prototype.toString.call(this);
    }
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount,
      };
    }
  }
  let I = l('setTimeout'),
    O = l('Promise'),
    Z = l('then'),
    B = [],
    j = !1,
    J;
  function q(L) {
    if ((J || (e[O] && (J = e[O].resolve(0))), J)) {
      let t = J[Z];
      t || (t = J.then), t.call(J, L);
    } else e[I](L, 0);
  }
  function R(L) {
    ee === 0 && B.length === 0 && q(E), L && B.push(L);
  }
  function E() {
    if (!j) {
      for (j = !0; B.length; ) {
        let L = B;
        B = [];
        for (let t = 0; t < L.length; t++) {
          let s = L[t];
          try {
            s.zone.runTask(s, null, null);
          } catch (o) {
            z.onUnhandledError(o);
          }
        }
      }
      z.microtaskDrainDone(), (j = !1);
    }
  }
  let $ = { name: 'NO ZONE' },
    H = 'notScheduled',
    X = 'scheduling',
    M = 'scheduled',
    T = 'running',
    x = 'canceling',
    d = 'unknown',
    N = 'microTask',
    P = 'macroTask',
    K = 'eventTask',
    oe = {},
    z = {
      symbol: l,
      currentZoneFrame: () => U,
      onUnhandledError: W,
      microtaskDrainDone: W,
      scheduleMicroTask: R,
      showUncaughtError: () => !_[l('ignoreConsoleErrorUncaughtError')],
      patchEventTarget: () => [],
      patchOnProperties: W,
      patchMethod: () => W,
      bindArguments: () => [],
      patchThen: () => W,
      patchMacroTask: () => W,
      patchEventPrototype: () => W,
      isIEOrEdge: () => !1,
      getGlobalObjects: () => {},
      ObjectDefineProperty: () => W,
      ObjectGetOwnPropertyDescriptor: () => {},
      ObjectCreate: () => {},
      ArraySlice: () => [],
      patchClass: () => W,
      wrapWithCurrentZone: () => W,
      filterProperties: () => [],
      attachOriginToPatched: () => W,
      _redefineProperty: () => W,
      patchCallbacks: () => W,
      nativeScheduleMicroTask: q,
    },
    U = { parent: null, zone: new _(null, null) },
    ne = null,
    ee = 0;
  function W() {}
  return r('Zone', 'Zone'), (e.Zone = _);
})(globalThis);
var pe = Object.getOwnPropertyDescriptor,
  Ie = Object.defineProperty,
  Me = Object.getPrototypeOf,
  ct = Object.create,
  at = Array.prototype.slice,
  Le = 'addEventListener',
  je = 'removeEventListener',
  De = Zone.__symbol__(Le),
  Oe = Zone.__symbol__(je),
  ce = 'true',
  ae = 'false',
  ge = Zone.__symbol__('');
function Ae(e, n) {
  return Zone.current.wrap(e, n);
}
function He(e, n, c, r, a) {
  return Zone.current.scheduleMacroTask(e, n, c, r, a);
}
var A = Zone.__symbol__,
  we = typeof window < 'u',
  Te = we ? window : void 0,
  Y = (we && Te) || globalThis,
  lt = 'removeAttribute';
function xe(e, n) {
  for (let c = e.length - 1; c >= 0; c--)
    typeof e[c] == 'function' && (e[c] = Ae(e[c], n + '_' + c));
  return e;
}
function ut(e, n) {
  let c = e.constructor.name;
  for (let r = 0; r < n.length; r++) {
    let a = n[r],
      l = e[a];
    if (l) {
      let y = pe(e, a);
      if (!$e(y)) continue;
      e[a] = ((_) => {
        let b = function () {
          return _.apply(this, xe(arguments, c + '.' + a));
        };
        return le(b, _), b;
      })(l);
    }
  }
}
function $e(e) {
  return e
    ? e.writable === !1
      ? !1
      : !(typeof e.get == 'function' && typeof e.set > 'u')
    : !0;
}
var Je = typeof WorkerGlobalScope < 'u' && self instanceof WorkerGlobalScope,
  Re =
    !('nw' in Y) &&
    typeof Y.process < 'u' &&
    {}.toString.call(Y.process) === '[object process]',
  Ge = !Re && !Je && !!(we && Te.HTMLElement),
  Ke =
    typeof Y.process < 'u' &&
    {}.toString.call(Y.process) === '[object process]' &&
    !Je &&
    !!(we && Te.HTMLElement),
  Pe = {},
  qe = function (e) {
    if (((e = e || Y.event), !e)) return;
    let n = Pe[e.type];
    n || (n = Pe[e.type] = A('ON_PROPERTY' + e.type));
    let c = this || e.target || Y,
      r = c[n],
      a;
    if (Ge && c === Te && e.type === 'error') {
      let l = e;
      (a =
        r && r.call(this, l.message, l.filename, l.lineno, l.colno, l.error)),
        a === !0 && e.preventDefault();
    } else
      (a = r && r.apply(this, arguments)),
        a != null && !a && e.preventDefault();
    return a;
  };
function Xe(e, n, c) {
  let r = pe(e, n);
  if (
    (!r && c && pe(c, n) && (r = { enumerable: !0, configurable: !0 }),
    !r || !r.configurable)
  )
    return;
  let a = A('on' + n + 'patched');
  if (e.hasOwnProperty(a) && e[a]) return;
  delete r.writable, delete r.value;
  let l = r.get,
    y = r.set,
    _ = n.slice(2),
    b = Pe[_];
  b || (b = Pe[_] = A('ON_PROPERTY' + _)),
    (r.set = function (k) {
      let m = this;
      if ((!m && e === Y && (m = Y), !m)) return;
      typeof m[b] == 'function' && m.removeEventListener(_, qe),
        y && y.call(m, null),
        (m[b] = k),
        typeof k == 'function' && m.addEventListener(_, qe, !1);
    }),
    (r.get = function () {
      let k = this;
      if ((!k && e === Y && (k = Y), !k)) return null;
      let m = k[b];
      if (m) return m;
      if (l) {
        let I = l.call(this);
        if (I)
          return (
            r.set.call(this, I),
            typeof k[lt] == 'function' && k.removeAttribute(n),
            I
          );
      }
      return null;
    }),
    Ie(e, n, r),
    (e[a] = !0);
}
function Qe(e, n, c) {
  if (n) for (let r = 0; r < n.length; r++) Xe(e, 'on' + n[r], c);
  else {
    let r = [];
    for (let a in e) a.slice(0, 2) == 'on' && r.push(a);
    for (let a = 0; a < r.length; a++) Xe(e, r[a], c);
  }
}
var re = A('originalInstance');
function ke(e) {
  let n = Y[e];
  if (!n) return;
  (Y[A(e)] = n),
    (Y[e] = function () {
      let a = xe(arguments, e);
      switch (a.length) {
        case 0:
          this[re] = new n();
          break;
        case 1:
          this[re] = new n(a[0]);
          break;
        case 2:
          this[re] = new n(a[0], a[1]);
          break;
        case 3:
          this[re] = new n(a[0], a[1], a[2]);
          break;
        case 4:
          this[re] = new n(a[0], a[1], a[2], a[3]);
          break;
        default:
          throw new Error('Arg list too long.');
      }
    }),
    le(Y[e], n);
  let c = new n(function () {}),
    r;
  for (r in c)
    (e === 'XMLHttpRequest' && r === 'responseBlob') ||
      (function (a) {
        typeof c[a] == 'function'
          ? (Y[e].prototype[a] = function () {
              return this[re][a].apply(this[re], arguments);
            })
          : Ie(Y[e].prototype, a, {
              set: function (l) {
                typeof l == 'function'
                  ? ((this[re][a] = Ae(l, e + '.' + a)), le(this[re][a], l))
                  : (this[re][a] = l);
              },
              get: function () {
                return this[re][a];
              },
            });
      })(r);
  for (r in n) r !== 'prototype' && n.hasOwnProperty(r) && (Y[e][r] = n[r]);
}
function ue(e, n, c) {
  let r = e;
  for (; r && !r.hasOwnProperty(n); ) r = Me(r);
  !r && e[n] && (r = e);
  let a = A(n),
    l = null;
  if (r && (!(l = r[a]) || !r.hasOwnProperty(a))) {
    l = r[a] = r[n];
    let y = r && pe(r, n);
    if ($e(y)) {
      let _ = c(l, a, n);
      (r[n] = function () {
        return _(this, arguments);
      }),
        le(r[n], l);
    }
  }
  return l;
}
function ft(e, n, c) {
  let r = null;
  function a(l) {
    let y = l.data;
    return (
      (y.args[y.cbIdx] = function () {
        l.invoke.apply(this, arguments);
      }),
      r.apply(y.target, y.args),
      l
    );
  }
  r = ue(
    e,
    n,
    (l) =>
      function (y, _) {
        let b = c(y, _);
        return b.cbIdx >= 0 && typeof _[b.cbIdx] == 'function'
          ? He(b.name, _[b.cbIdx], b, a)
          : l.apply(y, _);
      }
  );
}
function le(e, n) {
  e[A('OriginalDelegate')] = n;
}
var ze = !1,
  Ze = !1;
function ht() {
  try {
    let e = Te.navigator.userAgent;
    if (e.indexOf('MSIE ') !== -1 || e.indexOf('Trident/') !== -1) return !0;
  } catch {}
  return !1;
}
function dt() {
  if (ze) return Ze;
  ze = !0;
  try {
    let e = Te.navigator.userAgent;
    (e.indexOf('MSIE ') !== -1 ||
      e.indexOf('Trident/') !== -1 ||
      e.indexOf('Edge/') !== -1) &&
      (Ze = !0);
  } catch {}
  return Ze;
}
Zone.__load_patch('ZoneAwarePromise', (e, n, c) => {
  let r = Object.getOwnPropertyDescriptor,
    a = Object.defineProperty;
  function l(f) {
    if (f && f.toString === Object.prototype.toString) {
      let u = f.constructor && f.constructor.name;
      return (u || '') + ': ' + JSON.stringify(f);
    }
    return f ? f.toString() : Object.prototype.toString.call(f);
  }
  let y = c.symbol,
    _ = [],
    b = e[y('DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION')] !== !1,
    k = y('Promise'),
    m = y('then'),
    I = '__creationTrace__';
  (c.onUnhandledError = (f) => {
    if (c.showUncaughtError()) {
      let u = f && f.rejection;
      u
        ? console.error(
            'Unhandled Promise rejection:',
            u instanceof Error ? u.message : u,
            '; Zone:',
            f.zone.name,
            '; Task:',
            f.task && f.task.source,
            '; Value:',
            u,
            u instanceof Error ? u.stack : void 0
          )
        : console.error(f);
    }
  }),
    (c.microtaskDrainDone = () => {
      for (; _.length; ) {
        let f = _.shift();
        try {
          f.zone.runGuarded(() => {
            throw f.throwOriginal ? f.rejection : f;
          });
        } catch (u) {
          Z(u);
        }
      }
    });
  let O = y('unhandledPromiseRejectionHandler');
  function Z(f) {
    c.onUnhandledError(f);
    try {
      let u = n[O];
      typeof u == 'function' && u.call(this, f);
    } catch {}
  }
  function B(f) {
    return f && f.then;
  }
  function j(f) {
    return f;
  }
  function J(f) {
    return t.reject(f);
  }
  let q = y('state'),
    R = y('value'),
    E = y('finally'),
    $ = y('parentPromiseValue'),
    H = y('parentPromiseState'),
    X = 'Promise.then',
    M = null,
    T = !0,
    x = !1,
    d = 0;
  function N(f, u) {
    return (i) => {
      try {
        z(f, u, i);
      } catch (h) {
        z(f, !1, h);
      }
    };
  }
  let P = function () {
      let f = !1;
      return function (i) {
        return function () {
          f || ((f = !0), i.apply(null, arguments));
        };
      };
    },
    K = 'Promise resolved with itself',
    oe = y('currentTaskTrace');
  function z(f, u, i) {
    let h = P();
    if (f === i) throw new TypeError(K);
    if (f[q] === M) {
      let g = null;
      try {
        (typeof i == 'object' || typeof i == 'function') && (g = i && i.then);
      } catch (w) {
        return (
          h(() => {
            z(f, !1, w);
          })(),
          f
        );
      }
      if (
        u !== x &&
        i instanceof t &&
        i.hasOwnProperty(q) &&
        i.hasOwnProperty(R) &&
        i[q] !== M
      )
        ne(i), z(f, i[q], i[R]);
      else if (u !== x && typeof g == 'function')
        try {
          g.call(i, h(N(f, u)), h(N(f, !1)));
        } catch (w) {
          h(() => {
            z(f, !1, w);
          })();
        }
      else {
        f[q] = u;
        let w = f[R];
        if (
          ((f[R] = i),
          f[E] === E && u === T && ((f[q] = f[H]), (f[R] = f[$])),
          u === x && i instanceof Error)
        ) {
          let p = n.currentTask && n.currentTask.data && n.currentTask.data[I];
          p &&
            a(i, oe, {
              configurable: !0,
              enumerable: !1,
              writable: !0,
              value: p,
            });
        }
        for (let p = 0; p < w.length; ) ee(f, w[p++], w[p++], w[p++], w[p++]);
        if (w.length == 0 && u == x) {
          f[q] = d;
          let p = i;
          try {
            throw new Error(
              'Uncaught (in promise): ' +
                l(i) +
                (i && i.stack
                  ? `
` + i.stack
                  : '')
            );
          } catch (C) {
            p = C;
          }
          b && (p.throwOriginal = !0),
            (p.rejection = i),
            (p.promise = f),
            (p.zone = n.current),
            (p.task = n.currentTask),
            _.push(p),
            c.scheduleMicroTask();
        }
      }
    }
    return f;
  }
  let U = y('rejectionHandledHandler');
  function ne(f) {
    if (f[q] === d) {
      try {
        let u = n[U];
        u &&
          typeof u == 'function' &&
          u.call(this, { rejection: f[R], promise: f });
      } catch {}
      f[q] = x;
      for (let u = 0; u < _.length; u++) f === _[u].promise && _.splice(u, 1);
    }
  }
  function ee(f, u, i, h, g) {
    ne(f);
    let w = f[q],
      p = w ? (typeof h == 'function' ? h : j) : typeof g == 'function' ? g : J;
    u.scheduleMicroTask(
      X,
      () => {
        try {
          let C = f[R],
            S = !!i && E === i[E];
          S && ((i[$] = C), (i[H] = w));
          let D = u.run(p, void 0, S && p !== J && p !== j ? [] : [C]);
          z(i, !0, D);
        } catch (C) {
          z(i, !1, C);
        }
      },
      i
    );
  }
  let W = 'function ZoneAwarePromise() { [native code] }',
    se = function () {},
    L = e.AggregateError;
  class t {
    static toString() {
      return W;
    }
    static resolve(u) {
      return u instanceof t ? u : z(new this(null), T, u);
    }
    static reject(u) {
      return z(new this(null), x, u);
    }
    static withResolvers() {
      let u = {};
      return (
        (u.promise = new t((i, h) => {
          (u.resolve = i), (u.reject = h);
        })),
        u
      );
    }
    static any(u) {
      if (!u || typeof u[Symbol.iterator] != 'function')
        return Promise.reject(new L([], 'All promises were rejected'));
      let i = [],
        h = 0;
      try {
        for (let p of u) h++, i.push(t.resolve(p));
      } catch {
        return Promise.reject(new L([], 'All promises were rejected'));
      }
      if (h === 0)
        return Promise.reject(new L([], 'All promises were rejected'));
      let g = !1,
        w = [];
      return new t((p, C) => {
        for (let S = 0; S < i.length; S++)
          i[S].then(
            (D) => {
              g || ((g = !0), p(D));
            },
            (D) => {
              w.push(D),
                h--,
                h === 0 &&
                  ((g = !0), C(new L(w, 'All promises were rejected')));
            }
          );
      });
    }
    static race(u) {
      let i,
        h,
        g = new this((C, S) => {
          (i = C), (h = S);
        });
      function w(C) {
        i(C);
      }
      function p(C) {
        h(C);
      }
      for (let C of u) B(C) || (C = this.resolve(C)), C.then(w, p);
      return g;
    }
    static all(u) {
      return t.allWithCallback(u);
    }
    static allSettled(u) {
      return (this && this.prototype instanceof t ? this : t).allWithCallback(
        u,
        {
          thenCallback: (h) => ({ status: 'fulfilled', value: h }),
          errorCallback: (h) => ({ status: 'rejected', reason: h }),
        }
      );
    }
    static allWithCallback(u, i) {
      let h,
        g,
        w = new this((D, G) => {
          (h = D), (g = G);
        }),
        p = 2,
        C = 0,
        S = [];
      for (let D of u) {
        B(D) || (D = this.resolve(D));
        let G = C;
        try {
          D.then(
            (V) => {
              (S[G] = i ? i.thenCallback(V) : V), p--, p === 0 && h(S);
            },
            (V) => {
              i ? ((S[G] = i.errorCallback(V)), p--, p === 0 && h(S)) : g(V);
            }
          );
        } catch (V) {
          g(V);
        }
        p++, C++;
      }
      return (p -= 2), p === 0 && h(S), w;
    }
    constructor(u) {
      let i = this;
      if (!(i instanceof t)) throw new Error('Must be an instanceof Promise.');
      (i[q] = M), (i[R] = []);
      try {
        let h = P();
        u && u(h(N(i, T)), h(N(i, x)));
      } catch (h) {
        z(i, !1, h);
      }
    }
    get [Symbol.toStringTag]() {
      return 'Promise';
    }
    get [Symbol.species]() {
      return t;
    }
    then(u, i) {
      let h = this.constructor?.[Symbol.species];
      (!h || typeof h != 'function') && (h = this.constructor || t);
      let g = new h(se),
        w = n.current;
      return this[q] == M ? this[R].push(w, g, u, i) : ee(this, w, g, u, i), g;
    }
    catch(u) {
      return this.then(null, u);
    }
    finally(u) {
      let i = this.constructor?.[Symbol.species];
      (!i || typeof i != 'function') && (i = t);
      let h = new i(se);
      h[E] = E;
      let g = n.current;
      return this[q] == M ? this[R].push(g, h, u, u) : ee(this, g, h, u, u), h;
    }
  }
  (t.resolve = t.resolve),
    (t.reject = t.reject),
    (t.race = t.race),
    (t.all = t.all);
  let s = (e[k] = e.Promise);
  e.Promise = t;
  let o = y('thenPatched');
  function v(f) {
    let u = f.prototype,
      i = r(u, 'then');
    if (i && (i.writable === !1 || !i.configurable)) return;
    let h = u.then;
    (u[m] = h),
      (f.prototype.then = function (g, w) {
        return new t((C, S) => {
          h.call(this, C, S);
        }).then(g, w);
      }),
      (f[o] = !0);
  }
  c.patchThen = v;
  function F(f) {
    return function (u, i) {
      let h = f.apply(u, i);
      if (h instanceof t) return h;
      let g = h.constructor;
      return g[o] || v(g), h;
    };
  }
  return (
    s && (v(s), ue(e, 'fetch', (f) => F(f))),
    (Promise[n.__symbol__('uncaughtPromiseErrors')] = _),
    t
  );
});
Zone.__load_patch('toString', (e) => {
  let n = Function.prototype.toString,
    c = A('OriginalDelegate'),
    r = A('Promise'),
    a = A('Error'),
    l = function () {
      if (typeof this == 'function') {
        let k = this[c];
        if (k)
          return typeof k == 'function'
            ? n.call(k)
            : Object.prototype.toString.call(k);
        if (this === Promise) {
          let m = e[r];
          if (m) return n.call(m);
        }
        if (this === Error) {
          let m = e[a];
          if (m) return n.call(m);
        }
      }
      return n.call(this);
    };
  (l[c] = n), (Function.prototype.toString = l);
  let y = Object.prototype.toString,
    _ = '[object Promise]';
  Object.prototype.toString = function () {
    return typeof Promise == 'function' && this instanceof Promise
      ? _
      : y.call(this);
  };
});
var _e = !1;
if (typeof window < 'u')
  try {
    let e = Object.defineProperty({}, 'passive', {
      get: function () {
        _e = !0;
      },
    });
    window.addEventListener('test', e, e),
      window.removeEventListener('test', e, e);
  } catch {
    _e = !1;
  }
var _t = { useG: !0 },
  te = {},
  et = {},
  tt = new RegExp('^' + ge + '(\\w+)(true|false)$'),
  nt = A('propagationStopped');
function rt(e, n) {
  let c = (n ? n(e) : e) + ae,
    r = (n ? n(e) : e) + ce,
    a = ge + c,
    l = ge + r;
  (te[e] = {}), (te[e][ae] = a), (te[e][ce] = l);
}
function Et(e, n, c, r) {
  let a = (r && r.add) || Le,
    l = (r && r.rm) || je,
    y = (r && r.listeners) || 'eventListeners',
    _ = (r && r.rmAll) || 'removeAllListeners',
    b = A(a),
    k = '.' + a + ':',
    m = 'prependListener',
    I = '.' + m + ':',
    O = function (R, E, $) {
      if (R.isRemoved) return;
      let H = R.callback;
      typeof H == 'object' &&
        H.handleEvent &&
        ((R.callback = (T) => H.handleEvent(T)), (R.originalDelegate = H));
      let X;
      try {
        R.invoke(R, E, [$]);
      } catch (T) {
        X = T;
      }
      let M = R.options;
      if (M && typeof M == 'object' && M.once) {
        let T = R.originalDelegate ? R.originalDelegate : R.callback;
        E[l].call(E, $.type, T, M);
      }
      return X;
    };
  function Z(R, E, $) {
    if (((E = E || e.event), !E)) return;
    let H = R || E.target || e,
      X = H[te[E.type][$ ? ce : ae]];
    if (X) {
      let M = [];
      if (X.length === 1) {
        let T = O(X[0], H, E);
        T && M.push(T);
      } else {
        let T = X.slice();
        for (let x = 0; x < T.length && !(E && E[nt] === !0); x++) {
          let d = O(T[x], H, E);
          d && M.push(d);
        }
      }
      if (M.length === 1) throw M[0];
      for (let T = 0; T < M.length; T++) {
        let x = M[T];
        n.nativeScheduleMicroTask(() => {
          throw x;
        });
      }
    }
  }
  let B = function (R) {
      return Z(this, R, !1);
    },
    j = function (R) {
      return Z(this, R, !0);
    };
  function J(R, E) {
    if (!R) return !1;
    let $ = !0;
    E && E.useG !== void 0 && ($ = E.useG);
    let H = E && E.vh,
      X = !0;
    E && E.chkDup !== void 0 && (X = E.chkDup);
    let M = !1;
    E && E.rt !== void 0 && (M = E.rt);
    let T = R;
    for (; T && !T.hasOwnProperty(a); ) T = Me(T);
    if ((!T && R[a] && (T = R), !T || T[b])) return !1;
    let x = E && E.eventNameToString,
      d = {},
      N = (T[b] = T[a]),
      P = (T[A(l)] = T[l]),
      K = (T[A(y)] = T[y]),
      oe = (T[A(_)] = T[_]),
      z;
    E && E.prepend && (z = T[A(E.prepend)] = T[E.prepend]);
    function U(i, h) {
      return !_e && typeof i == 'object' && i
        ? !!i.capture
        : !_e || !h
        ? i
        : typeof i == 'boolean'
        ? { capture: i, passive: !0 }
        : i
        ? typeof i == 'object' && i.passive !== !1
          ? { ...i, passive: !0 }
          : i
        : { passive: !0 };
    }
    let ne = function (i) {
        if (!d.isExisting)
          return N.call(d.target, d.eventName, d.capture ? j : B, d.options);
      },
      ee = function (i) {
        if (!i.isRemoved) {
          let h = te[i.eventName],
            g;
          h && (g = h[i.capture ? ce : ae]);
          let w = g && i.target[g];
          if (w) {
            for (let p = 0; p < w.length; p++)
              if (w[p] === i) {
                w.splice(p, 1),
                  (i.isRemoved = !0),
                  w.length === 0 && ((i.allRemoved = !0), (i.target[g] = null));
                break;
              }
          }
        }
        if (i.allRemoved)
          return P.call(i.target, i.eventName, i.capture ? j : B, i.options);
      },
      W = function (i) {
        return N.call(d.target, d.eventName, i.invoke, d.options);
      },
      se = function (i) {
        return z.call(d.target, d.eventName, i.invoke, d.options);
      },
      L = function (i) {
        return P.call(i.target, i.eventName, i.invoke, i.options);
      },
      t = $ ? ne : W,
      s = $ ? ee : L,
      o = function (i, h) {
        let g = typeof h;
        return (
          (g === 'function' && i.callback === h) ||
          (g === 'object' && i.originalDelegate === h)
        );
      },
      v = E && E.diff ? E.diff : o,
      F = Zone[A('UNPATCHED_EVENTS')],
      f = e[A('PASSIVE_EVENTS')],
      u = function (i, h, g, w, p = !1, C = !1) {
        return function () {
          let S = this || e,
            D = arguments[0];
          E && E.transferEventName && (D = E.transferEventName(D));
          let G = arguments[1];
          if (!G) return i.apply(this, arguments);
          if (Re && D === 'uncaughtException') return i.apply(this, arguments);
          let V = !1;
          if (typeof G != 'function') {
            if (!G.handleEvent) return i.apply(this, arguments);
            V = !0;
          }
          if (H && !H(i, G, S, arguments)) return;
          let fe = _e && !!f && f.indexOf(D) !== -1,
            Q = U(arguments[2], fe),
            ye =
              Q &&
              typeof Q == 'object' &&
              Q.signal &&
              typeof Q.signal == 'object'
                ? Q.signal
                : void 0;
          if (ye?.aborted) return;
          if (F) {
            for (let he = 0; he < F.length; he++)
              if (D === F[he])
                return fe ? i.call(S, D, G, Q) : i.apply(this, arguments);
          }
          let Ce = Q ? (typeof Q == 'boolean' ? !0 : Q.capture) : !1,
            Ve = Q && typeof Q == 'object' ? Q.once : !1,
            it = Zone.current,
            Se = te[D];
          Se || (rt(D, x), (Se = te[D]));
          let Fe = Se[Ce ? ce : ae],
            de = S[Fe],
            Be = !1;
          if (de) {
            if (((Be = !0), X)) {
              for (let he = 0; he < de.length; he++) if (v(de[he], G)) return;
            }
          } else de = S[Fe] = [];
          let ve,
            Ue = S.constructor.name,
            We = et[Ue];
          We && (ve = We[D]),
            ve || (ve = Ue + h + (x ? x(D) : D)),
            (d.options = Q),
            Ve && (d.options.once = !1),
            (d.target = S),
            (d.capture = Ce),
            (d.eventName = D),
            (d.isExisting = Be);
          let me = $ ? _t : void 0;
          me && (me.taskData = d), ye && (d.options.signal = void 0);
          let ie = it.scheduleEventTask(ve, G, me, g, w);
          if (
            (ye &&
              ((d.options.signal = ye),
              i.call(
                ye,
                'abort',
                () => {
                  ie.zone.cancelTask(ie);
                },
                { once: !0 }
              )),
            (d.target = null),
            me && (me.taskData = null),
            Ve && (Q.once = !0),
            (!_e && typeof ie.options == 'boolean') || (ie.options = Q),
            (ie.target = S),
            (ie.capture = Ce),
            (ie.eventName = D),
            V && (ie.originalDelegate = G),
            C ? de.unshift(ie) : de.push(ie),
            p)
          )
            return S;
        };
      };
    return (
      (T[a] = u(N, k, t, s, M)),
      z && (T[m] = u(z, I, se, s, M, !0)),
      (T[l] = function () {
        let i = this || e,
          h = arguments[0];
        E && E.transferEventName && (h = E.transferEventName(h));
        let g = arguments[2],
          w = g ? (typeof g == 'boolean' ? !0 : g.capture) : !1,
          p = arguments[1];
        if (!p) return P.apply(this, arguments);
        if (H && !H(P, p, i, arguments)) return;
        let C = te[h],
          S;
        C && (S = C[w ? ce : ae]);
        let D = S && i[S];
        if (D)
          for (let G = 0; G < D.length; G++) {
            let V = D[G];
            if (v(V, p)) {
              if (
                (D.splice(G, 1),
                (V.isRemoved = !0),
                D.length === 0 &&
                  ((V.allRemoved = !0), (i[S] = null), typeof h == 'string'))
              ) {
                let fe = ge + 'ON_PROPERTY' + h;
                i[fe] = null;
              }
              return V.zone.cancelTask(V), M ? i : void 0;
            }
          }
        return P.apply(this, arguments);
      }),
      (T[y] = function () {
        let i = this || e,
          h = arguments[0];
        E && E.transferEventName && (h = E.transferEventName(h));
        let g = [],
          w = ot(i, x ? x(h) : h);
        for (let p = 0; p < w.length; p++) {
          let C = w[p],
            S = C.originalDelegate ? C.originalDelegate : C.callback;
          g.push(S);
        }
        return g;
      }),
      (T[_] = function () {
        let i = this || e,
          h = arguments[0];
        if (h) {
          E && E.transferEventName && (h = E.transferEventName(h));
          let g = te[h];
          if (g) {
            let w = g[ae],
              p = g[ce],
              C = i[w],
              S = i[p];
            if (C) {
              let D = C.slice();
              for (let G = 0; G < D.length; G++) {
                let V = D[G],
                  fe = V.originalDelegate ? V.originalDelegate : V.callback;
                this[l].call(this, h, fe, V.options);
              }
            }
            if (S) {
              let D = S.slice();
              for (let G = 0; G < D.length; G++) {
                let V = D[G],
                  fe = V.originalDelegate ? V.originalDelegate : V.callback;
                this[l].call(this, h, fe, V.options);
              }
            }
          }
        } else {
          let g = Object.keys(i);
          for (let w = 0; w < g.length; w++) {
            let p = g[w],
              C = tt.exec(p),
              S = C && C[1];
            S && S !== 'removeListener' && this[_].call(this, S);
          }
          this[_].call(this, 'removeListener');
        }
        if (M) return this;
      }),
      le(T[a], N),
      le(T[l], P),
      oe && le(T[_], oe),
      K && le(T[y], K),
      !0
    );
  }
  let q = [];
  for (let R = 0; R < c.length; R++) q[R] = J(c[R], r);
  return q;
}
function ot(e, n) {
  if (!n) {
    let l = [];
    for (let y in e) {
      let _ = tt.exec(y),
        b = _ && _[1];
      if (b && (!n || b === n)) {
        let k = e[y];
        if (k) for (let m = 0; m < k.length; m++) l.push(k[m]);
      }
    }
    return l;
  }
  let c = te[n];
  c || (rt(n), (c = te[n]));
  let r = e[c[ae]],
    a = e[c[ce]];
  return r ? (a ? r.concat(a) : r.slice()) : a ? a.slice() : [];
}
function Tt(e, n) {
  let c = e.Event;
  c &&
    c.prototype &&
    n.patchMethod(
      c.prototype,
      'stopImmediatePropagation',
      (r) =>
        function (a, l) {
          (a[nt] = !0), r && r.apply(a, l);
        }
    );
}
function yt(e, n, c, r, a) {
  let l = Zone.__symbol__(r);
  if (n[l]) return;
  let y = (n[l] = n[r]);
  (n[r] = function (_, b, k) {
    return (
      b &&
        b.prototype &&
        a.forEach(function (m) {
          let I = `${c}.${r}::` + m,
            O = b.prototype;
          try {
            if (O.hasOwnProperty(m)) {
              let Z = e.ObjectGetOwnPropertyDescriptor(O, m);
              Z && Z.value
                ? ((Z.value = e.wrapWithCurrentZone(Z.value, I)),
                  e._redefineProperty(b.prototype, m, Z))
                : O[m] && (O[m] = e.wrapWithCurrentZone(O[m], I));
            } else O[m] && (O[m] = e.wrapWithCurrentZone(O[m], I));
          } catch {}
        }),
      y.call(n, _, b, k)
    );
  }),
    e.attachOriginToPatched(n[r], y);
}
function st(e, n, c) {
  if (!c || c.length === 0) return n;
  let r = c.filter((l) => l.target === e);
  if (!r || r.length === 0) return n;
  let a = r[0].ignoreProperties;
  return n.filter((l) => a.indexOf(l) === -1);
}
function Ye(e, n, c, r) {
  if (!e) return;
  let a = st(e, n, c);
  Qe(e, a, r);
}
function Ne(e) {
  return Object.getOwnPropertyNames(e)
    .filter((n) => n.startsWith('on') && n.length > 2)
    .map((n) => n.substring(2));
}
function mt(e, n) {
  if ((Re && !Ke) || Zone[e.symbol('patchEvents')]) return;
  let c = n.__Zone_ignore_on_properties,
    r = [];
  if (Ge) {
    let a = window;
    r = r.concat([
      'Document',
      'SVGElement',
      'Element',
      'HTMLElement',
      'HTMLBodyElement',
      'HTMLMediaElement',
      'HTMLFrameSetElement',
      'HTMLFrameElement',
      'HTMLIFrameElement',
      'HTMLMarqueeElement',
      'Worker',
    ]);
    let l = ht() ? [{ target: a, ignoreProperties: ['error'] }] : [];
    Ye(a, Ne(a), c && c.concat(l), Me(a));
  }
  r = r.concat([
    'XMLHttpRequest',
    'XMLHttpRequestEventTarget',
    'IDBIndex',
    'IDBRequest',
    'IDBOpenDBRequest',
    'IDBDatabase',
    'IDBTransaction',
    'IDBCursor',
    'WebSocket',
  ]);
  for (let a = 0; a < r.length; a++) {
    let l = n[r[a]];
    l && l.prototype && Ye(l.prototype, Ne(l.prototype), c);
  }
}
Zone.__load_patch('util', (e, n, c) => {
  let r = Ne(e);
  (c.patchOnProperties = Qe),
    (c.patchMethod = ue),
    (c.bindArguments = xe),
    (c.patchMacroTask = ft);
  let a = n.__symbol__('BLACK_LISTED_EVENTS'),
    l = n.__symbol__('UNPATCHED_EVENTS');
  e[l] && (e[a] = e[l]),
    e[a] && (n[a] = n[l] = e[a]),
    (c.patchEventPrototype = Tt),
    (c.patchEventTarget = Et),
    (c.isIEOrEdge = dt),
    (c.ObjectDefineProperty = Ie),
    (c.ObjectGetOwnPropertyDescriptor = pe),
    (c.ObjectCreate = ct),
    (c.ArraySlice = at),
    (c.patchClass = ke),
    (c.wrapWithCurrentZone = Ae),
    (c.filterProperties = st),
    (c.attachOriginToPatched = le),
    (c._redefineProperty = Object.defineProperty),
    (c.patchCallbacks = yt),
    (c.getGlobalObjects = () => ({
      globalSources: et,
      zoneSymbolEventNames: te,
      eventNames: r,
      isBrowser: Ge,
      isMix: Ke,
      isNode: Re,
      TRUE_STR: ce,
      FALSE_STR: ae,
      ZONE_SYMBOL_PREFIX: ge,
      ADD_EVENT_LISTENER_STR: Le,
      REMOVE_EVENT_LISTENER_STR: je,
    }));
});
function pt(e, n) {
  n.patchMethod(
    e,
    'queueMicrotask',
    (c) =>
      function (r, a) {
        Zone.current.scheduleMicroTask('queueMicrotask', a[0]);
      }
  );
}
var be = A('zoneTask');
function Ee(e, n, c, r) {
  let a = null,
    l = null;
  (n += r), (c += r);
  let y = {};
  function _(k) {
    let m = k.data;
    return (
      (m.args[0] = function () {
        return k.invoke.apply(this, arguments);
      }),
      (m.handleId = a.apply(e, m.args)),
      k
    );
  }
  function b(k) {
    return l.call(e, k.data.handleId);
  }
  (a = ue(
    e,
    n,
    (k) =>
      function (m, I) {
        if (typeof I[0] == 'function') {
          let O = {
              isPeriodic: r === 'Interval',
              delay: r === 'Timeout' || r === 'Interval' ? I[1] || 0 : void 0,
              args: I,
            },
            Z = I[0];
          I[0] = function () {
            try {
              return Z.apply(this, arguments);
            } finally {
              O.isPeriodic ||
                (typeof O.handleId == 'number'
                  ? delete y[O.handleId]
                  : O.handleId && (O.handleId[be] = null));
            }
          };
          let B = He(n, I[0], O, _, b);
          if (!B) return B;
          let j = B.data.handleId;
          return (
            typeof j == 'number' ? (y[j] = B) : j && (j[be] = B),
            j &&
              j.ref &&
              j.unref &&
              typeof j.ref == 'function' &&
              typeof j.unref == 'function' &&
              ((B.ref = j.ref.bind(j)), (B.unref = j.unref.bind(j))),
            typeof j == 'number' || j ? j : B
          );
        } else return k.apply(e, I);
      }
  )),
    (l = ue(
      e,
      c,
      (k) =>
        function (m, I) {
          let O = I[0],
            Z;
          typeof O == 'number' ? (Z = y[O]) : ((Z = O && O[be]), Z || (Z = O)),
            Z && typeof Z.type == 'string'
              ? Z.state !== 'notScheduled' &&
                ((Z.cancelFn && Z.data.isPeriodic) || Z.runCount === 0) &&
                (typeof O == 'number' ? delete y[O] : O && (O[be] = null),
                Z.zone.cancelTask(Z))
              : k.apply(e, I);
        }
    ));
}
function gt(e, n) {
  let { isBrowser: c, isMix: r } = n.getGlobalObjects();
  if ((!c && !r) || !e.customElements || !('customElements' in e)) return;
  let a = [
    'connectedCallback',
    'disconnectedCallback',
    'adoptedCallback',
    'attributeChangedCallback',
    'formAssociatedCallback',
    'formDisabledCallback',
    'formResetCallback',
    'formStateRestoreCallback',
  ];
  n.patchCallbacks(n, e.customElements, 'customElements', 'define', a);
}
function kt(e, n) {
  if (Zone[n.symbol('patchEventTarget')]) return;
  let {
    eventNames: c,
    zoneSymbolEventNames: r,
    TRUE_STR: a,
    FALSE_STR: l,
    ZONE_SYMBOL_PREFIX: y,
  } = n.getGlobalObjects();
  for (let b = 0; b < c.length; b++) {
    let k = c[b],
      m = k + l,
      I = k + a,
      O = y + m,
      Z = y + I;
    (r[k] = {}), (r[k][l] = O), (r[k][a] = Z);
  }
  let _ = e.EventTarget;
  if (!(!_ || !_.prototype))
    return n.patchEventTarget(e, n, [_ && _.prototype]), !0;
}
function vt(e, n) {
  n.patchEventPrototype(e, n);
}
Zone.__load_patch('legacy', (e) => {
  let n = e[Zone.__symbol__('legacyPatch')];
  n && n();
});
Zone.__load_patch('timers', (e) => {
  let n = 'set',
    c = 'clear';
  Ee(e, n, c, 'Timeout'), Ee(e, n, c, 'Interval'), Ee(e, n, c, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', (e) => {
  Ee(e, 'request', 'cancel', 'AnimationFrame'),
    Ee(e, 'mozRequest', 'mozCancel', 'AnimationFrame'),
    Ee(e, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', (e, n) => {
  let c = ['alert', 'prompt', 'confirm'];
  for (let r = 0; r < c.length; r++) {
    let a = c[r];
    ue(
      e,
      a,
      (l, y, _) =>
        function (b, k) {
          return n.current.run(l, e, k, _);
        }
    );
  }
});
Zone.__load_patch('EventTarget', (e, n, c) => {
  vt(e, c), kt(e, c);
  let r = e.XMLHttpRequestEventTarget;
  r && r.prototype && c.patchEventTarget(e, c, [r.prototype]);
});
Zone.__load_patch('MutationObserver', (e, n, c) => {
  ke('MutationObserver'), ke('WebKitMutationObserver');
});
Zone.__load_patch('IntersectionObserver', (e, n, c) => {
  ke('IntersectionObserver');
});
Zone.__load_patch('FileReader', (e, n, c) => {
  ke('FileReader');
});
Zone.__load_patch('on_property', (e, n, c) => {
  mt(c, e);
});
Zone.__load_patch('customElements', (e, n, c) => {
  gt(e, c);
});
Zone.__load_patch('XHR', (e, n) => {
  b(e);
  let c = A('xhrTask'),
    r = A('xhrSync'),
    a = A('xhrListener'),
    l = A('xhrScheduled'),
    y = A('xhrURL'),
    _ = A('xhrErrorBeforeScheduled');
  function b(k) {
    let m = k.XMLHttpRequest;
    if (!m) return;
    let I = m.prototype;
    function O(d) {
      return d[c];
    }
    let Z = I[De],
      B = I[Oe];
    if (!Z) {
      let d = k.XMLHttpRequestEventTarget;
      if (d) {
        let N = d.prototype;
        (Z = N[De]), (B = N[Oe]);
      }
    }
    let j = 'readystatechange',
      J = 'scheduled';
    function q(d) {
      let N = d.data,
        P = N.target;
      (P[l] = !1), (P[_] = !1);
      let K = P[a];
      Z || ((Z = P[De]), (B = P[Oe])), K && B.call(P, j, K);
      let oe = (P[a] = () => {
        if (P.readyState === P.DONE)
          if (!N.aborted && P[l] && d.state === J) {
            let U = P[n.__symbol__('loadfalse')];
            if (P.status !== 0 && U && U.length > 0) {
              let ne = d.invoke;
              (d.invoke = function () {
                let ee = P[n.__symbol__('loadfalse')];
                for (let W = 0; W < ee.length; W++)
                  ee[W] === d && ee.splice(W, 1);
                !N.aborted && d.state === J && ne.call(d);
              }),
                U.push(d);
            } else d.invoke();
          } else !N.aborted && P[l] === !1 && (P[_] = !0);
      });
      return (
        Z.call(P, j, oe), P[c] || (P[c] = d), T.apply(P, N.args), (P[l] = !0), d
      );
    }
    function R() {}
    function E(d) {
      let N = d.data;
      return (N.aborted = !0), x.apply(N.target, N.args);
    }
    let $ = ue(
        I,
        'open',
        () =>
          function (d, N) {
            return (d[r] = N[2] == !1), (d[y] = N[1]), $.apply(d, N);
          }
      ),
      H = 'XMLHttpRequest.send',
      X = A('fetchTaskAborting'),
      M = A('fetchTaskScheduling'),
      T = ue(
        I,
        'send',
        () =>
          function (d, N) {
            if (n.current[M] === !0 || d[r]) return T.apply(d, N);
            {
              let P = {
                  target: d,
                  url: d[y],
                  isPeriodic: !1,
                  args: N,
                  aborted: !1,
                },
                K = He(H, R, P, q, E);
              d && d[_] === !0 && !P.aborted && K.state === J && K.invoke();
            }
          }
      ),
      x = ue(
        I,
        'abort',
        () =>
          function (d, N) {
            let P = O(d);
            if (P && typeof P.type == 'string') {
              if (P.cancelFn == null || (P.data && P.data.aborted)) return;
              P.zone.cancelTask(P);
            } else if (n.current[X] === !0) return x.apply(d, N);
          }
      );
  }
});
Zone.__load_patch('geolocation', (e) => {
  e.navigator &&
    e.navigator.geolocation &&
    ut(e.navigator.geolocation, ['getCurrentPosition', 'watchPosition']);
});
Zone.__load_patch('PromiseRejectionEvent', (e, n) => {
  function c(r) {
    return function (a) {
      ot(e, r).forEach((y) => {
        let _ = e.PromiseRejectionEvent;
        if (_) {
          let b = new _(r, { promise: a.promise, reason: a.rejection });
          y.invoke(b);
        }
      });
    };
  }
  e.PromiseRejectionEvent &&
    ((n[A('unhandledPromiseRejectionHandler')] = c('unhandledrejection')),
    (n[A('rejectionHandledHandler')] = c('rejectionhandled')));
});
Zone.__load_patch('queueMicrotask', (e, n, c) => {
  pt(e, c);
});
