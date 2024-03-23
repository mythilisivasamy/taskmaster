'use strict';
var Hf = Object.defineProperty,
  zf = Object.defineProperties;
var bf = Object.getOwnPropertyDescriptors;
var Qa = Object.getOwnPropertySymbols;
var wf = Object.prototype.hasOwnProperty,
  Df = Object.prototype.propertyIsEnumerable;
var Za = (t, e, r) =>
    e in t
      ? Hf(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  M = (t, e) => {
    for (var r in (e ||= {})) wf.call(e, r) && Za(t, r, e[r]);
    if (Qa) for (var r of Qa(e)) Df.call(e, r) && Za(t, r, e[r]);
    return t;
  },
  J = (t, e) => zf(t, bf(e));
var Xa = null;
var C6 = 1,
  Ka = Symbol('SIGNAL');
function G(t) {
  let e = Xa;
  return (Xa = t), e;
}
var Ja = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function xf(t) {
  if (!(V6(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === C6)) {
    if (!t.producerMustRecompute(t) && !M6(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = C6);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = C6);
  }
}
function es(t) {
  return t && (t.nextProducerIndex = 0), G(t);
}
function ts(t, e) {
  if (
    (G(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (V6(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        y6(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function M6(t) {
  z4(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (xf(r), n !== r.version)) return !0;
  }
  return !1;
}
function ns(t) {
  if ((z4(t), V6(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      y6(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function y6(t, e) {
  if ((Lf(t), z4(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      y6(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    z4(i), (i.producerIndexOfThis[n] = e);
  }
}
function V6(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function z4(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function Lf(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Sf() {
  throw new Error();
}
var Nf = Sf;
function rs(t) {
  Nf = t;
}
function T(t) {
  return typeof t == 'function';
}
function dt(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var b4 = dt(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = r);
    }
);
function l3(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var y2 = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let c of r) c.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (T(n))
        try {
          n();
        } catch (c) {
          e = c instanceof b4 ? c.errors : [c];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let c of i)
          try {
            is(c);
          } catch (a) {
            (e = e ?? []),
              a instanceof b4 ? (e = [...e, ...a.errors]) : e.push(a);
          }
      }
      if (e) throw new b4(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) is(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && l3(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && l3(r, e), e instanceof t && e._removeParent(this);
  }
};
y2.EMPTY = (() => {
  let t = new y2();
  return (t.closed = !0), t;
})();
var H6 = y2.EMPTY;
function w4(t) {
  return (
    t instanceof y2 ||
    (t && 'closed' in t && T(t.remove) && T(t.add) && T(t.unsubscribe))
  );
}
function is(t) {
  T(t) ? t() : t.unsubscribe();
}
var f1 = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var ht = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = ht;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = ht;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function D4(t) {
  ht.setTimeout(() => {
    let { onUnhandledError: e } = f1;
    if (e) e(t);
    else throw t;
  });
}
function f3() {}
var cs = z6('C', void 0, void 0);
function as(t) {
  return z6('E', void 0, t);
}
function ss(t) {
  return z6('N', t, void 0);
}
function z6(t, e, r) {
  return { kind: t, value: e, error: r };
}
var Re = null;
function pt(t) {
  if (f1.useDeprecatedSynchronousErrorHandling) {
    let e = !Re;
    if ((e && (Re = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = Re;
      if (((Re = null), r)) throw n;
    }
  } else t();
}
function os(t) {
  f1.useDeprecatedSynchronousErrorHandling &&
    Re &&
    ((Re.errorThrown = !0), (Re.error = t));
}
var Pe = class extends y2 {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), w4(e) && e.add(this))
          : (this.destination = Af);
    }
    static create(e, r, n) {
      return new mt(e, r, n);
    }
    next(e) {
      this.isStopped ? w6(ss(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? w6(as(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? w6(cs, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Ef = Function.prototype.bind;
function b6(t, e) {
  return Ef.call(t, e);
}
var D6 = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          x4(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          x4(n);
        }
      else x4(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          x4(r);
        }
    }
  },
  mt = class extends Pe {
    constructor(e, r, n) {
      super();
      let i;
      if (T(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let c;
        this && f1.useDeprecatedNextContext
          ? ((c = Object.create(e)),
            (c.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && b6(e.next, c),
              error: e.error && b6(e.error, c),
              complete: e.complete && b6(e.complete, c),
            }))
          : (i = e);
      }
      this.destination = new D6(i);
    }
  };
function x4(t) {
  f1.useDeprecatedSynchronousErrorHandling ? os(t) : D4(t);
}
function If(t) {
  throw t;
}
function w6(t, e) {
  let { onStoppedNotification: r } = f1;
  r && ht.setTimeout(() => r(t, e));
}
var Af = { closed: !0, next: f3, error: If, complete: f3 };
var gt = (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
function q2(t) {
  return t;
}
function x6(...t) {
  return L6(t);
}
function L6(t) {
  return t.length === 0
    ? q2
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var q = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let c = kf(r) ? r : new mt(r, n, i);
      return (
        pt(() => {
          let { operator: a, source: s } = this;
          c.add(
            a ? a.call(c, s) : s ? this._subscribe(c) : this._trySubscribe(c)
          );
        }),
        c
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = ls(n)),
        new n((i, c) => {
          let a = new mt({
            next: (s) => {
              try {
                r(s);
              } catch (o) {
                c(o), a.unsubscribe();
              }
            },
            error: c,
            complete: i,
          });
          this.subscribe(a);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [gt]() {
      return this;
    }
    pipe(...r) {
      return L6(r)(this);
    }
    toPromise(r) {
      return (
        (r = ls(r)),
        new r((n, i) => {
          let c;
          this.subscribe(
            (a) => (c = a),
            (a) => i(a),
            () => n(c)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function ls(t) {
  var e;
  return (e = t ?? f1.Promise) !== null && e !== void 0 ? e : Promise;
}
function Tf(t) {
  return t && T(t.next) && T(t.error) && T(t.complete);
}
function kf(t) {
  return (t && t instanceof Pe) || (Tf(t) && w4(t));
}
function S6(t) {
  return T(t?.lift);
}
function j(t) {
  return (e) => {
    if (S6(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function O(t, e, r, n, i) {
  return new N6(t, e, r, n, i);
}
var N6 = class extends Pe {
  constructor(e, r, n, i, c, a) {
    super(e),
      (this.onFinalize = c),
      (this.shouldUnsubscribe = a),
      (this._next = r
        ? function (s) {
            try {
              r(s);
            } catch (o) {
              e.error(o);
            }
          }
        : super._next),
      (this._error = i
        ? function (s) {
            try {
              i(s);
            } catch (o) {
              e.error(o);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (s) {
              e.error(s);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function vt() {
  return j((t, e) => {
    let r = null;
    t._refCount++;
    let n = O(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        c = r;
      (r = null), i && (!c || i === c) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var Ct = class extends q {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      S6(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new y2();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          O(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = y2.EMPTY));
    }
    return e;
  }
  refCount() {
    return vt()(this);
  }
};
var fs = dt(
  (t) =>
    function () {
      t(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed');
    }
);
var T2 = (() => {
    class t extends q {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new L4(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new fs();
      }
      next(r) {
        pt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        pt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        pt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: c } = this;
        return n || i
          ? H6
          : ((this.currentObservers = null),
            c.push(r),
            new y2(() => {
              (this.currentObservers = null), l3(c, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: c } = this;
        n ? r.error(i) : c && r.complete();
      }
      asObservable() {
        let r = new q();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new L4(e, r)), t;
  })(),
  L4 = class extends T2 {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : H6;
    }
  };
var L2 = class extends T2 {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var W2 = new q((t) => t.complete());
function us(t) {
  return t && T(t.schedule);
}
function ds(t) {
  return t[t.length - 1];
}
function S4(t) {
  return T(ds(t)) ? t.pop() : void 0;
}
function ce(t) {
  return us(ds(t)) ? t.pop() : void 0;
}
function ps(t, e, r, n) {
  function i(c) {
    return c instanceof r
      ? c
      : new r(function (a) {
          a(c);
        });
  }
  return new (r || (r = Promise))(function (c, a) {
    function s(f) {
      try {
        l(n.next(f));
      } catch (u) {
        a(u);
      }
    }
    function o(f) {
      try {
        l(n.throw(f));
      } catch (u) {
        a(u);
      }
    }
    function l(f) {
      f.done ? c(f.value) : i(f.value).then(s, o);
    }
    l((n = n.apply(t, e || [])).next());
  });
}
function hs(t) {
  var e = typeof Symbol == 'function' && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
  );
}
function Fe(t) {
  return this instanceof Fe ? ((this.v = t), this) : new Fe(t);
}
function ms(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var n = r.apply(t, e || []),
    i,
    c = [];
  return (
    (i = {}),
    a('next'),
    a('throw'),
    a('return'),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function a(d) {
    n[d] &&
      (i[d] = function (h) {
        return new Promise(function (C, N) {
          c.push([d, h, C, N]) > 1 || s(d, h);
        });
      });
  }
  function s(d, h) {
    try {
      o(n[d](h));
    } catch (C) {
      u(c[0][3], C);
    }
  }
  function o(d) {
    d.value instanceof Fe
      ? Promise.resolve(d.value.v).then(l, f)
      : u(c[0][2], d);
  }
  function l(d) {
    s('next', d);
  }
  function f(d) {
    s('throw', d);
  }
  function u(d, h) {
    d(h), c.shift(), c.length && s(c[0][0], c[0][1]);
  }
}
function gs(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.');
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof hs == 'function' ? hs(t) : t[Symbol.iterator]()),
      (r = {}),
      n('next'),
      n('throw'),
      n('return'),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(c) {
    r[c] =
      t[c] &&
      function (a) {
        return new Promise(function (s, o) {
          (a = t[c](a)), i(s, o, a.done, a.value);
        });
      };
  }
  function i(c, a, s, o) {
    Promise.resolve(o).then(function (l) {
      c({ value: l, done: s });
    }, a);
  }
}
var N4 = (t) => t && typeof t.length == 'number' && typeof t != 'function';
function E4(t) {
  return T(t?.then);
}
function I4(t) {
  return T(t[gt]);
}
function A4(t) {
  return Symbol.asyncIterator && T(t?.[Symbol.asyncIterator]);
}
function T4(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function _f() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator;
}
var k4 = _f();
function _4(t) {
  return T(t?.[k4]);
}
function R4(t) {
  return ms(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Fe(r.read());
        if (i) return yield Fe(void 0);
        yield yield Fe(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function P4(t) {
  return T(t?.getReader);
}
function p2(t) {
  if (t instanceof q) return t;
  if (t != null) {
    if (I4(t)) return Rf(t);
    if (N4(t)) return Pf(t);
    if (E4(t)) return Ff(t);
    if (A4(t)) return vs(t);
    if (_4(t)) return Of(t);
    if (P4(t)) return Bf(t);
  }
  throw T4(t);
}
function Rf(t) {
  return new q((e) => {
    let r = t[gt]();
    if (T(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable'
    );
  });
}
function Pf(t) {
  return new q((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Ff(t) {
  return new q((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, D4);
  });
}
function Of(t) {
  return new q((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function vs(t) {
  return new q((e) => {
    jf(t, e).catch((r) => e.error(r));
  });
}
function Bf(t) {
  return vs(R4(t));
}
function jf(t, e) {
  var r, n, i, c;
  return ps(this, void 0, void 0, function* () {
    try {
      for (r = gs(t); (n = yield r.next()), !n.done; ) {
        let a = n.value;
        if ((e.next(a), e.closed)) return;
      }
    } catch (a) {
      i = { error: a };
    } finally {
      try {
        n && !n.done && (c = r.return) && (yield c.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function O2(t, e, r, n = 0, i = !1) {
  let c = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(c), !i)) return c;
}
function F4(t, e = 0) {
  return j((r, n) => {
    r.subscribe(
      O(
        n,
        (i) => O2(n, t, () => n.next(i), e),
        () => O2(n, t, () => n.complete(), e),
        (i) => O2(n, t, () => n.error(i), e)
      )
    );
  });
}
function O4(t, e = 0) {
  return j((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function Cs(t, e) {
  return p2(t).pipe(O4(e), F4(e));
}
function Ms(t, e) {
  return p2(t).pipe(O4(e), F4(e));
}
function ys(t, e) {
  return new q((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function Vs(t, e) {
  return new q((r) => {
    let n;
    return (
      O2(r, e, () => {
        (n = t[k4]()),
          O2(
            r,
            e,
            () => {
              let i, c;
              try {
                ({ value: i, done: c } = n.next());
              } catch (a) {
                r.error(a);
                return;
              }
              c ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => T(n?.return) && n.return()
    );
  });
}
function B4(t, e) {
  if (!t) throw new Error('Iterable cannot be null');
  return new q((r) => {
    O2(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      O2(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Hs(t, e) {
  return B4(R4(t), e);
}
function zs(t, e) {
  if (t != null) {
    if (I4(t)) return Cs(t, e);
    if (N4(t)) return ys(t, e);
    if (E4(t)) return Ms(t, e);
    if (A4(t)) return B4(t, e);
    if (_4(t)) return Vs(t, e);
    if (P4(t)) return Hs(t, e);
  }
  throw T4(t);
}
function i2(t, e) {
  return e ? zs(t, e) : p2(t);
}
function S(...t) {
  let e = ce(t);
  return i2(t, e);
}
function ae(t, e) {
  let r = T(t) ? t : () => t,
    n = (i) => i.error(r());
  return new q(e ? (i) => e.schedule(n, 0, i) : n);
}
function E6(t) {
  return !!t && (t instanceof q || (T(t.lift) && T(t.subscribe)));
}
var _1 = dt(
  (t) =>
    function () {
      t(this),
        (this.name = 'EmptyError'),
        (this.message = 'no elements in sequence');
    }
);
function k(t, e) {
  return j((r, n) => {
    let i = 0;
    r.subscribe(
      O(n, (c) => {
        n.next(t.call(e, c, i++));
      })
    );
  });
}
var { isArray: Uf } = Array;
function $f(t, e) {
  return Uf(e) ? t(...e) : t(e);
}
function j4(t) {
  return k((e) => $f(t, e));
}
var { isArray: Gf } = Array,
  { getPrototypeOf: qf, prototype: Wf, keys: Yf } = Object;
function U4(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Gf(e)) return { args: e, keys: null };
    if (Qf(e)) {
      let r = Yf(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Qf(t) {
  return t && typeof t == 'object' && qf(t) === Wf;
}
function $4(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function u3(...t) {
  let e = ce(t),
    r = S4(t),
    { args: n, keys: i } = U4(t);
  if (n.length === 0) return i2([], e);
  let c = new q(Zf(n, e, i ? (a) => $4(i, a) : q2));
  return r ? c.pipe(j4(r)) : c;
}
function Zf(t, e, r = q2) {
  return (n) => {
    bs(
      e,
      () => {
        let { length: i } = t,
          c = new Array(i),
          a = i,
          s = i;
        for (let o = 0; o < i; o++)
          bs(
            e,
            () => {
              let l = i2(t[o], e),
                f = !1;
              l.subscribe(
                O(
                  n,
                  (u) => {
                    (c[o] = u), f || ((f = !0), s--), s || n.next(r(c.slice()));
                  },
                  () => {
                    --a || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function bs(t, e, r) {
  t ? O2(r, t, e) : e();
}
function ws(t, e, r, n, i, c, a, s) {
  let o = [],
    l = 0,
    f = 0,
    u = !1,
    d = () => {
      u && !o.length && !l && e.complete();
    },
    h = (N) => (l < n ? C(N) : o.push(N)),
    C = (N) => {
      c && e.next(N), l++;
      let L = !1;
      p2(r(N, f++)).subscribe(
        O(
          e,
          (b) => {
            i?.(b), c ? h(b) : e.next(b);
          },
          () => {
            L = !0;
          },
          void 0,
          () => {
            if (L)
              try {
                for (l--; o.length && l < n; ) {
                  let b = o.shift();
                  a ? O2(e, a, () => C(b)) : C(b);
                }
                d();
              } catch (b) {
                e.error(b);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      O(e, h, () => {
        (u = !0), d();
      })
    ),
    () => {
      s?.();
    }
  );
}
function m2(t, e, r = 1 / 0) {
  return T(e)
    ? m2((n, i) => k((c, a) => e(n, c, i, a))(p2(t(n, i))), r)
    : (typeof e == 'number' && (r = e), j((n, i) => ws(n, i, t, r)));
}
function Mt(t = 1 / 0) {
  return m2(q2, t);
}
function Ds() {
  return Mt(1);
}
function yt(...t) {
  return Ds()(i2(t, ce(t)));
}
function G4(t) {
  return new q((e) => {
    p2(t()).subscribe(e);
  });
}
function I6(...t) {
  let e = S4(t),
    { args: r, keys: n } = U4(t),
    i = new q((c) => {
      let { length: a } = r;
      if (!a) {
        c.complete();
        return;
      }
      let s = new Array(a),
        o = a,
        l = a;
      for (let f = 0; f < a; f++) {
        let u = !1;
        p2(r[f]).subscribe(
          O(
            c,
            (d) => {
              u || ((u = !0), l--), (s[f] = d);
            },
            () => o--,
            void 0,
            () => {
              (!o || !u) && (l || c.next(n ? $4(n, s) : s), c.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(j4(e)) : i;
}
function B2(t, e) {
  return j((r, n) => {
    let i = 0;
    r.subscribe(O(n, (c) => t.call(e, c, i++) && n.next(c)));
  });
}
function n1(t) {
  return j((e, r) => {
    let n = null,
      i = !1,
      c;
    (n = e.subscribe(
      O(r, void 0, void 0, (a) => {
        (c = p2(t(a, n1(t)(e)))),
          n ? (n.unsubscribe(), (n = null), c.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), c.subscribe(r));
  });
}
function xs(t, e, r, n, i) {
  return (c, a) => {
    let s = r,
      o = e,
      l = 0;
    c.subscribe(
      O(
        a,
        (f) => {
          let u = l++;
          (o = s ? t(o, f, u) : ((s = !0), f)), n && a.next(o);
        },
        i &&
          (() => {
            s && a.next(o), a.complete();
          })
      )
    );
  };
}
function R1(t, e) {
  return T(e) ? m2(t, e, 1) : m2(t, 1);
}
function se(t) {
  return j((e, r) => {
    let n = !1;
    e.subscribe(
      O(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function P1(t) {
  return t <= 0
    ? () => W2
    : j((e, r) => {
        let n = 0;
        e.subscribe(
          O(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function A6(t) {
  return k(() => t);
}
function q4(t = Xf) {
  return j((e, r) => {
    let n = !1;
    e.subscribe(
      O(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function Xf() {
  return new _1();
}
function oe(t) {
  return j((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function H1(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? B2((i, c) => t(i, c, n)) : q2,
      P1(1),
      r ? se(e) : q4(() => new _1())
    );
}
function Vt(t) {
  return t <= 0
    ? () => W2
    : j((e, r) => {
        let n = [];
        e.subscribe(
          O(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function T6(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? B2((i, c) => t(i, c, n)) : q2,
      Vt(1),
      r ? se(e) : q4(() => new _1())
    );
}
function k6(t, e) {
  return j(xs(t, e, arguments.length >= 2, !0));
}
function _6(...t) {
  let e = ce(t);
  return j((r, n) => {
    (e ? yt(t, r, e) : yt(t, r)).subscribe(n);
  });
}
function j2(t, e) {
  return j((r, n) => {
    let i = null,
      c = 0,
      a = !1,
      s = () => a && !i && n.complete();
    r.subscribe(
      O(
        n,
        (o) => {
          i?.unsubscribe();
          let l = 0,
            f = c++;
          p2(t(o, f)).subscribe(
            (i = O(
              n,
              (u) => n.next(e ? e(o, u, f, l++) : u),
              () => {
                (i = null), s();
              }
            ))
          );
        },
        () => {
          (a = !0), s();
        }
      )
    );
  });
}
function R6(t) {
  return j((e, r) => {
    p2(t).subscribe(O(r, () => r.complete(), f3)), !r.closed && e.subscribe(r);
  });
}
function g2(t, e, r) {
  let n = T(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? j((i, c) => {
        var a;
        (a = n.subscribe) === null || a === void 0 || a.call(n);
        let s = !0;
        i.subscribe(
          O(
            c,
            (o) => {
              var l;
              (l = n.next) === null || l === void 0 || l.call(n, o), c.next(o);
            },
            () => {
              var o;
              (s = !1),
                (o = n.complete) === null || o === void 0 || o.call(n),
                c.complete();
            },
            (o) => {
              var l;
              (s = !1),
                (l = n.error) === null || l === void 0 || l.call(n, o),
                c.error(o);
            },
            () => {
              var o, l;
              s && ((o = n.unsubscribe) === null || o === void 0 || o.call(n)),
                (l = n.finalize) === null || l === void 0 || l.call(n);
            }
          )
        );
      })
    : q2;
}
var Co = 'https://g.co/ng/security#xss',
  V = class extends Error {
    constructor(e, r) {
      super(Ln(e, r)), (this.code = e);
    }
  };
function Ln(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`;
}
function w3(t) {
  return { toString: t }.toString();
}
var W4 = '__parameters__';
function Jf(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function Mo(t, e, r) {
  return w3(() => {
    let n = Jf(e);
    function i(...c) {
      if (this instanceof i) return n.apply(this, c), this;
      let a = new i(...c);
      return (s.annotation = a), s;
      function s(o, l, f) {
        let u = o.hasOwnProperty(W4)
          ? o[W4]
          : Object.defineProperty(o, W4, { value: [] })[W4];
        for (; u.length <= f; ) u.push(null);
        return (u[f] = u[f] || []).push(a), o;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
var u2 = globalThis;
function t2(t) {
  for (let e in t) if (t[e] === t2) return e;
  throw Error('Could not find renamed property on target object.');
}
function eu(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function _2(t) {
  if (typeof t == 'string') return t;
  if (Array.isArray(t)) return '[' + t.map(_2).join(', ') + ']';
  if (t == null) return '' + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return '' + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function Ls(t, e) {
  return t == null || t === ''
    ? e === null
      ? ''
      : e
    : e == null || e === ''
    ? t
    : t + ' ' + e;
}
var tu = t2({ __forward_ref__: t2 });
function me(t) {
  return (
    (t.__forward_ref__ = me),
    (t.toString = function () {
      return _2(this());
    }),
    t
  );
}
function k2(t) {
  return yo(t) ? t() : t;
}
function yo(t) {
  return (
    typeof t == 'function' && t.hasOwnProperty(tu) && t.__forward_ref__ === me
  );
}
function H(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function b2(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Sn(t) {
  return Ss(t, Ho) || Ss(t, zo);
}
function Vo(t) {
  return Sn(t) !== null;
}
function Ss(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function nu(t) {
  let e = t && (t[Ho] || t[zo]);
  return e || null;
}
function Ns(t) {
  return t && (t.hasOwnProperty(Es) || t.hasOwnProperty(ru)) ? t[Es] : null;
}
var Ho = t2({ ɵprov: t2 }),
  Es = t2({ ɵinj: t2 }),
  zo = t2({ ngInjectableDef: t2 }),
  ru = t2({ ngInjectorDef: t2 }),
  w = class {
    constructor(e, r) {
      (this._desc = e),
        (this.ngMetadataName = 'InjectionToken'),
        (this.ɵprov = void 0),
        typeof r == 'number'
          ? (this.__NG_ELEMENT_ID__ = r)
          : r !== void 0 &&
            (this.ɵprov = H({
              token: this,
              providedIn: r.providedIn || 'root',
              factory: r.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function bo(t) {
  return t && !!t.ɵproviders;
}
var iu = t2({ ɵcmp: t2 }),
  cu = t2({ ɵdir: t2 }),
  au = t2({ ɵpipe: t2 }),
  su = t2({ ɵmod: t2 }),
  sn = t2({ ɵfac: t2 }),
  d3 = t2({ __NG_ELEMENT_ID__: t2 }),
  Is = t2({ __NG_ENV_ID__: t2 });
function Nn(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t);
}
function ou(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
    ? t.type.name || t.type.toString()
    : Nn(t);
}
function lu(t, e) {
  let r = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : '';
  throw new V(-200, t);
}
function tc(t, e) {
  throw new V(-201, !1);
}
var P = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    );
  })(P || {}),
  J6;
function wo() {
  return J6;
}
function U2(t) {
  let e = J6;
  return (J6 = t), e;
}
function Do(t, e, r) {
  let n = Sn(t);
  if (n && n.providedIn == 'root')
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & P.Optional) return null;
  if (e !== void 0) return e;
  tc(t, 'Injector');
}
var fu = {},
  p3 = fu,
  ei = '__NG_DI_FLAG__',
  on = 'ngTempTokenPath',
  uu = 'ngTokenPath',
  du = /\n/gm,
  hu = '\u0275',
  As = '__source',
  Dt;
function pu() {
  return Dt;
}
function le(t) {
  let e = Dt;
  return (Dt = t), e;
}
function mu(t, e = P.Default) {
  if (Dt === void 0) throw new V(-203, !1);
  return Dt === null
    ? Do(t, void 0, e)
    : Dt.get(t, e & P.Optional ? null : void 0, e);
}
function D(t, e = P.Default) {
  return (wo() || mu)(k2(t), e);
}
function g(t, e = P.Default) {
  return D(t, En(e));
}
function En(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function ti(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = k2(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new V(900, !1);
      let i,
        c = P.Default;
      for (let a = 0; a < n.length; a++) {
        let s = n[a],
          o = gu(s);
        typeof o == 'number' ? (o === -1 ? (i = s.token) : (c |= o)) : (i = s);
      }
      e.push(D(i, c));
    } else e.push(D(n));
  }
  return e;
}
function xo(t, e) {
  return (t[ei] = e), (t.prototype[ei] = e), t;
}
function gu(t) {
  return t[ei];
}
function vu(t, e, r, n) {
  let i = t[on];
  throw (
    (e[As] && i.unshift(e[As]),
    (t.message = Cu(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[uu] = i),
    (t[on] = null),
    t)
  );
}
function Cu(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == hu
      ? t.slice(2)
      : t;
  let i = _2(e);
  if (Array.isArray(e)) i = e.map(_2).join(' -> ');
  else if (typeof e == 'object') {
    let c = [];
    for (let a in e)
      if (e.hasOwnProperty(a)) {
        let s = e[a];
        c.push(a + ':' + (typeof s == 'string' ? JSON.stringify(s) : _2(s)));
      }
    i = `{${c.join(', ')}}`;
  }
  return `${r}${n ? '(' + n + ')' : ''}[${i}]: ${t.replace(
    du,
    `
  `
  )}`;
}
var In = xo(Mo('Optional'), 8);
var nc = xo(Mo('SkipSelf'), 4);
function Ue(t, e) {
  let r = t.hasOwnProperty(sn);
  return r ? t[sn] : null;
}
function Mu(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      c = e[n];
    if ((r && ((i = r(i)), (c = r(c))), c !== i)) return !1;
  }
  return !0;
}
function yu(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function rc(t, e) {
  t.forEach((r) => (Array.isArray(r) ? rc(r, e) : e(r)));
}
function Lo(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function ln(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Vu(t, e) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(e);
  return r;
}
function Hu(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let c = i - 2;
      (t[i] = t[c]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function zu(t, e, r) {
  let n = D3(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), Hu(t, n, e, r)), n;
}
function P6(t, e) {
  let r = D3(t, e);
  if (r >= 0) return t[r | 1];
}
function D3(t, e) {
  return bu(t, e, 1);
}
function bu(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let c = n + ((i - n) >> 1),
      a = t[c << r];
    if (e === a) return c << r;
    a > e ? (i = c) : (n = c + 1);
  }
  return ~(i << r);
}
var Lt = {},
  r1 = [],
  St = new w(''),
  So = new w('', -1),
  No = new w(''),
  fn = class {
    get(e, r = p3) {
      if (r === p3) {
        let n = new Error(`NullInjectorError: No provider for ${_2(e)}!`);
        throw ((n.name = 'NullInjectorError'), n);
      }
      return r;
    }
  },
  Eo = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t;
  })(Eo || {}),
  w1 = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    );
  })(w1 || {}),
  Q2 = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    );
  })(Q2 || {});
function wu(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let c = e.length;
      if (i + c === n || t.charCodeAt(i + c) <= 32) return i;
    }
    r = i + 1;
  }
}
function ni(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == 'number') {
      if (i !== 0) break;
      n++;
      let c = r[n++],
        a = r[n++],
        s = r[n++];
      t.setAttribute(e, a, s, c);
    } else {
      let c = i,
        a = r[++n];
      xu(c) ? t.setProperty(e, c, a) : t.setAttribute(e, c, a), n++;
    }
  }
  return n;
}
function Du(t) {
  return t === 3 || t === 4 || t === 6;
}
function xu(t) {
  return t.charCodeAt(0) === 64;
}
function m3(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == 'number'
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? Ts(t, r, i, null, e[++n])
              : Ts(t, r, i, null, null));
      }
    }
  return t;
}
function Ts(t, e, r, n, i) {
  let c = 0,
    a = t.length;
  if (e === -1) a = -1;
  else
    for (; c < t.length; ) {
      let s = t[c++];
      if (typeof s == 'number') {
        if (s === e) {
          a = -1;
          break;
        } else if (s > e) {
          a = c - 1;
          break;
        }
      }
    }
  for (; c < t.length; ) {
    let s = t[c];
    if (typeof s == 'number') break;
    if (s === r) {
      if (n === null) {
        i !== null && (t[c + 1] = i);
        return;
      } else if (n === t[c + 1]) {
        t[c + 2] = i;
        return;
      }
    }
    c++, n !== null && c++, i !== null && c++;
  }
  a !== -1 && (t.splice(a, 0, e), (c = a + 1)),
    t.splice(c++, 0, r),
    n !== null && t.splice(c++, 0, n),
    i !== null && t.splice(c++, 0, i);
}
var Io = 'ng-template';
function Lu(t, e, r, n) {
  let i = 0;
  if (n) {
    for (; i < e.length && typeof e[i] == 'string'; i += 2)
      if (e[i] === 'class' && wu(e[i + 1].toLowerCase(), r, 0) !== -1)
        return !0;
  } else if (ic(t)) return !1;
  if (((i = e.indexOf(1, i)), i > -1)) {
    let c;
    for (; ++i < e.length && typeof (c = e[i]) == 'string'; )
      if (c.toLowerCase() === r) return !0;
  }
  return !1;
}
function ic(t) {
  return t.type === 4 && t.value !== Io;
}
function Su(t, e, r) {
  let n = t.type === 4 && !r ? Io : t.value;
  return e === n;
}
function Nu(t, e, r) {
  let n = 4,
    i = t.attrs,
    c = i !== null ? Au(i) : 0,
    a = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s];
    if (typeof o == 'number') {
      if (!a && !u1(n) && !u1(o)) return !1;
      if (a && u1(o)) continue;
      (a = !1), (n = o | (n & 1));
      continue;
    }
    if (!a)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (o !== '' && !Su(t, o, r)) || (o === '' && e.length === 1))
        ) {
          if (u1(n)) return !1;
          a = !0;
        }
      } else if (n & 8) {
        if (i === null || !Lu(t, i, o, r)) {
          if (u1(n)) return !1;
          a = !0;
        }
      } else {
        let l = e[++s],
          f = Eu(o, i, ic(t), r);
        if (f === -1) {
          if (u1(n)) return !1;
          a = !0;
          continue;
        }
        if (l !== '') {
          let u;
          if (
            (f > c ? (u = '') : (u = i[f + 1].toLowerCase()), n & 2 && l !== u)
          ) {
            if (u1(n)) return !1;
            a = !0;
          }
        }
      }
  }
  return u1(n) || a;
}
function u1(t) {
  return (t & 1) === 0;
}
function Eu(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let c = !1;
    for (; i < e.length; ) {
      let a = e[i];
      if (a === t) return i;
      if (a === 3 || a === 6) c = !0;
      else if (a === 1 || a === 2) {
        let s = e[++i];
        for (; typeof s == 'string'; ) s = e[++i];
        continue;
      } else {
        if (a === 4) break;
        if (a === 0) {
          i += 4;
          continue;
        }
      }
      i += c ? 1 : 2;
    }
    return -1;
  } else return Tu(e, t);
}
function Ao(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Nu(t, e[n], r)) return !0;
  return !1;
}
function Iu(t) {
  let e = t.attrs;
  if (e != null) {
    let r = e.indexOf(5);
    if (!(r & 1)) return e[r + 1];
  }
  return null;
}
function Au(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (Du(r)) return e;
  }
  return t.length;
}
function Tu(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == 'number') return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function ku(t, e) {
  e: for (let r = 0; r < e.length; r++) {
    let n = e[r];
    if (t.length === n.length) {
      for (let i = 0; i < t.length; i++) if (t[i] !== n[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function ks(t, e) {
  return t ? ':not(' + e.trim() + ')' : e;
}
function _u(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = '',
    c = !1;
  for (; r < t.length; ) {
    let a = t[r];
    if (typeof a == 'string')
      if (n & 2) {
        let s = t[++r];
        i += '[' + a + (s.length > 0 ? '="' + s + '"' : '') + ']';
      } else n & 8 ? (i += '.' + a) : n & 4 && (i += ' ' + a);
    else
      i !== '' && !u1(a) && ((e += ks(c, i)), (i = '')),
        (n = a),
        (c = c || !u1(n));
    r++;
  }
  return i !== '' && (e += ks(c, i)), e;
}
function Ru(t) {
  return t.map(_u).join(',');
}
function Pu(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let c = t[n];
    if (typeof c == 'string')
      i === 2 ? c !== '' && e.push(c, t[++n]) : i === 8 && r.push(c);
    else {
      if (!u1(i)) break;
      i = c;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function H2(t) {
  return w3(() => {
    let e = Po(t),
      r = J(M({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Eo.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || w1.Emulated,
        styles: t.styles || r1,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      });
    Fo(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = Rs(n, !1)), (r.pipeDefs = Rs(n, !0)), (r.id = Bu(r)), r
    );
  });
}
function Fu(t) {
  return ue(t) || To(t);
}
function Ou(t) {
  return t !== null;
}
function w2(t) {
  return w3(() => ({
    type: t.type,
    bootstrap: t.bootstrap || r1,
    declarations: t.declarations || r1,
    imports: t.imports || r1,
    exports: t.exports || r1,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function _s(t, e) {
  if (t == null) return Lt;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        c,
        a,
        s = Q2.None;
      Array.isArray(i)
        ? ((s = i[0]), (c = i[1]), (a = i[2] ?? c))
        : ((c = i), (a = i)),
        e ? ((r[c] = s !== Q2.None ? [n, s] : n), (e[c] = a)) : (r[c] = n);
    }
  return r;
}
function v2(t) {
  return w3(() => {
    let e = Po(t);
    return Fo(e), e;
  });
}
function cc(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function ue(t) {
  return t[iu] || null;
}
function To(t) {
  return t[cu] || null;
}
function ko(t) {
  return t[au] || null;
}
function _o(t) {
  let e = ue(t) || To(t) || ko(t);
  return e !== null ? e.standalone : !1;
}
function Ro(t, e) {
  let r = t[su] || null;
  if (!r && e === !0)
    throw new Error(`Type ${_2(t)} does not have '\u0275mod' property.`);
  return r;
}
function Po(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Lt,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || r1,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: _s(t.inputs, e),
    outputs: _s(t.outputs),
    debugInfo: null,
  };
}
function Fo(t) {
  t.features?.forEach((e) => e(t));
}
function Rs(t, e) {
  if (!t) return null;
  let r = e ? ko : Fu;
  return () => (typeof t == 'function' ? t() : t).map((n) => r(n)).filter(Ou);
}
function Bu(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join('|');
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), 'c' + e;
}
function An(t) {
  return { ɵproviders: t };
}
function ju(...t) {
  return { ɵproviders: Oo(!0, t), ɵfromNgModule: !0 };
}
function Oo(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    c = (a) => {
      r.push(a);
    };
  return (
    rc(e, (a) => {
      let s = a;
      ri(s, c, [], n) && ((i ||= []), i.push(s));
    }),
    i !== void 0 && Bo(i, c),
    r
  );
}
function Bo(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    ac(i, (c) => {
      e(c, n);
    });
  }
}
function ri(t, e, r, n) {
  if (((t = k2(t)), !t)) return !1;
  let i = null,
    c = Ns(t),
    a = !c && ue(t);
  if (!c && !a) {
    let o = t.ngModule;
    if (((c = Ns(o)), c)) i = o;
    else return !1;
  } else {
    if (a && !a.standalone) return !1;
    i = t;
  }
  let s = n.has(i);
  if (a) {
    if (s) return !1;
    if ((n.add(i), a.dependencies)) {
      let o =
        typeof a.dependencies == 'function' ? a.dependencies() : a.dependencies;
      for (let l of o) ri(l, e, r, n);
    }
  } else if (c) {
    if (c.imports != null && !s) {
      n.add(i);
      let l;
      try {
        rc(c.imports, (f) => {
          ri(f, e, r, n) && ((l ||= []), l.push(f));
        });
      } finally {
      }
      l !== void 0 && Bo(l, e);
    }
    if (!s) {
      let l = Ue(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: r1 }, i),
        e({ provide: No, useValue: i, multi: !0 }, i),
        e({ provide: St, useValue: () => D(i), multi: !0 }, i);
    }
    let o = c.providers;
    if (o != null && !s) {
      let l = t;
      ac(o, (f) => {
        e(f, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function ac(t, e) {
  for (let r of t)
    bo(r) && (r = r.ɵproviders), Array.isArray(r) ? ac(r, e) : e(r);
}
var Uu = t2({ provide: String, useValue: t2 });
function jo(t) {
  return t !== null && typeof t == 'object' && Uu in t;
}
function $u(t) {
  return !!(t && t.useExisting);
}
function Gu(t) {
  return !!(t && t.useFactory);
}
function Nt(t) {
  return typeof t == 'function';
}
function qu(t) {
  return !!t.useClass;
}
var Tn = new w(''),
  en = {},
  Wu = {},
  F6;
function sc() {
  return F6 === void 0 && (F6 = new fn()), F6;
}
var R2 = class {},
  g3 = class extends R2 {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        ci(e, (a) => this.processProvider(a)),
        this.records.set(So, Ht(void 0, this)),
        i.has('environment') && this.records.set(R2, Ht(void 0, this));
      let c = this.records.get(Tn);
      c != null && typeof c.value == 'string' && this.scopes.add(c.value),
        (this.injectorDefTypes = new Set(this.get(No, r1, P.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let e = G(null);
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy();
        let r = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let n of r) n();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          G(e);
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = le(this),
        n = U2(void 0),
        i;
      try {
        return e();
      } finally {
        le(r), U2(n);
      }
    }
    get(e, r = p3, n = P.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Is))) return e[Is](this);
      n = En(n);
      let i,
        c = le(this),
        a = U2(void 0);
      try {
        if (!(n & P.SkipSelf)) {
          let o = this.records.get(e);
          if (o === void 0) {
            let l = Ku(e) && Sn(e);
            l && this.injectableDefInScope(l)
              ? (o = Ht(ii(e), en))
              : (o = null),
              this.records.set(e, o);
          }
          if (o != null) return this.hydrate(e, o);
        }
        let s = n & P.Self ? sc() : this.parent;
        return (r = n & P.Optional && r === p3 ? null : r), s.get(e, r);
      } catch (s) {
        if (s.name === 'NullInjectorError') {
          if (((s[on] = s[on] || []).unshift(_2(e)), c)) throw s;
          return vu(s, e, 'R3InjectorError', this.source);
        } else throw s;
      } finally {
        U2(a), le(c);
      }
    }
    resolveInjectorInitializers() {
      let e = G(null),
        r = le(this),
        n = U2(void 0),
        i;
      try {
        let c = this.get(St, r1, P.Self);
        for (let a of c) a();
      } finally {
        le(r), U2(n), G(e);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(_2(n));
      return `R3Injector[${e.join(', ')}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new V(205, !1);
    }
    processProvider(e) {
      e = k2(e);
      let r = Nt(e) ? e : k2(e && e.provide),
        n = Qu(e);
      if (!Nt(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = Ht(void 0, en, !0)),
          (i.factory = () => ti(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      let n = G(null);
      try {
        return (
          r.value === en && ((r.value = Wu), (r.value = r.factory())),
          typeof r.value == 'object' &&
            r.value &&
            Xu(r.value) &&
            this._ngOnDestroyHooks.add(r.value),
          r.value
        );
      } finally {
        G(n);
      }
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = k2(e.providedIn);
      return typeof r == 'string'
        ? r === 'any' || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function ii(t) {
  let e = Sn(t),
    r = e !== null ? e.factory : Ue(t);
  if (r !== null) return r;
  if (t instanceof w) throw new V(204, !1);
  if (t instanceof Function) return Yu(t);
  throw new V(204, !1);
}
function Yu(t) {
  if (t.length > 0) throw new V(204, !1);
  let r = nu(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function Qu(t) {
  if (jo(t)) return Ht(void 0, t.useValue);
  {
    let e = Uo(t);
    return Ht(e, en);
  }
}
function Uo(t, e, r) {
  let n;
  if (Nt(t)) {
    let i = k2(t);
    return Ue(i) || ii(i);
  } else if (jo(t)) n = () => k2(t.useValue);
  else if (Gu(t)) n = () => t.useFactory(...ti(t.deps || []));
  else if ($u(t)) n = () => D(k2(t.useExisting));
  else {
    let i = k2(t && (t.useClass || t.provide));
    if (Zu(t)) n = () => new i(...ti(t.deps));
    else return Ue(i) || ii(i);
  }
  return n;
}
function Ht(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function Zu(t) {
  return !!t.deps;
}
function Xu(t) {
  return (
    t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function'
  );
}
function Ku(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof w);
}
function ci(t, e) {
  for (let r of t)
    Array.isArray(r) ? ci(r, e) : r && bo(r) ? ci(r.ɵproviders, e) : e(r);
}
function g1(t, e) {
  t instanceof g3 && t.assertNotDestroyed();
  let r,
    n = le(t),
    i = U2(void 0);
  try {
    return e();
  } finally {
    le(n), U2(i);
  }
}
function $o() {
  return wo() !== void 0 || pu() != null;
}
function Ju(t) {
  if (!$o()) throw new V(-203, !1);
}
function ed(t) {
  let e = u2.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error('JIT compiler unavailable');
}
function td(t) {
  return typeof t == 'function';
}
var j1 = 0,
  R = 1,
  I = 2,
  S2 = 3,
  d1 = 4,
  Z2 = 5,
  v3 = 6,
  C3 = 7,
  h1 = 8,
  Et = 9,
  p1 = 10,
  V2 = 11,
  M3 = 12,
  Ps = 13,
  kt = 14,
  m1 = 15,
  x3 = 16,
  zt = 17,
  F1 = 18,
  kn = 19,
  Go = 20,
  fe = 21,
  O6 = 22,
  $e = 23,
  i1 = 25,
  qo = 1;
var Ge = 7,
  un = 8,
  It = 9,
  Y2 = 10,
  oc = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      t
    );
  })(oc || {});
function Be(t) {
  return Array.isArray(t) && typeof t[qo] == 'object';
}
function U1(t) {
  return Array.isArray(t) && t[qo] === !0;
}
function Wo(t) {
  return (t.flags & 4) !== 0;
}
function _n(t) {
  return t.componentOffset > -1;
}
function lc(t) {
  return (t.flags & 1) === 1;
}
function de(t) {
  return !!t.template;
}
function nd(t) {
  return (t[I] & 512) !== 0;
}
var ai = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Yo(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function X2() {
  return Qo;
}
function Qo(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = id), rd;
}
X2.ngInherit = !0;
function rd() {
  let t = Xo(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === Lt) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function id(t, e, r, n, i) {
  let c = this.declaredInputs[n],
    a = Xo(t) || cd(t, { previous: Lt, current: null }),
    s = a.current || (a.current = {}),
    o = a.previous,
    l = o[c];
  (s[c] = new ai(l && l.currentValue, r, o === Lt)), Yo(t, e, i, r);
}
var Zo = '__ngSimpleChanges__';
function Xo(t) {
  return t[Zo] || null;
}
function cd(t, e) {
  return (t[Zo] = e);
}
var Fs = null;
var z1 = function (t, e, r) {
    Fs?.(t, e, r);
  },
  ad = 'svg',
  sd = 'math',
  od = !1;
function ld() {
  return od;
}
function D1(t) {
  for (; Array.isArray(t); ) t = t[j1];
  return t;
}
function Ko(t, e) {
  return D1(e[t]);
}
function c1(t, e) {
  return D1(e[t.index]);
}
function Jo(t, e) {
  return t.data[e];
}
function e8(t, e) {
  return t[e];
}
function ge(t, e) {
  let r = e[t];
  return Be(r) ? r : r[j1];
}
function fd(t) {
  return (t[I] & 4) === 4;
}
function fc(t) {
  return (t[I] & 128) === 128;
}
function ud(t) {
  return U1(t[S2]);
}
function dn(t, e) {
  return e == null ? null : t[e];
}
function t8(t) {
  t[zt] = 0;
}
function dd(t) {
  t[I] & 1024 || ((t[I] |= 1024), fc(t) && y3(t));
}
function hd(t, e) {
  for (; t > 0; ) (e = e[kt]), t--;
  return e;
}
function uc(t) {
  return !!(t[I] & 9216 || t[$e]?.dirty);
}
function si(t) {
  t[p1].changeDetectionScheduler?.notify(1),
    uc(t)
      ? y3(t)
      : t[I] & 64 &&
        (ld()
          ? ((t[I] |= 1024), y3(t))
          : t[p1].changeDetectionScheduler?.notify());
}
function y3(t) {
  t[p1].changeDetectionScheduler?.notify();
  let e = V3(t);
  for (; e !== null && !(e[I] & 8192 || ((e[I] |= 8192), !fc(e))); ) e = V3(e);
}
function n8(t, e) {
  if ((t[I] & 256) === 256) throw new V(911, !1);
  t[fe] === null && (t[fe] = []), t[fe].push(e);
}
function pd(t, e) {
  if (t[fe] === null) return;
  let r = t[fe].indexOf(e);
  r !== -1 && t[fe].splice(r, 1);
}
function V3(t) {
  let e = t[S2];
  return U1(e) ? e[S2] : e;
}
var F = { lFrame: d8(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function md() {
  return F.lFrame.elementDepthCount;
}
function gd() {
  F.lFrame.elementDepthCount++;
}
function vd() {
  F.lFrame.elementDepthCount--;
}
function r8() {
  return F.bindingsEnabled;
}
function i8() {
  return F.skipHydrationRootTNode !== null;
}
function Cd(t) {
  return F.skipHydrationRootTNode === t;
}
function Md() {
  F.skipHydrationRootTNode = null;
}
function W() {
  return F.lFrame.lView;
}
function I2() {
  return F.lFrame.tView;
}
function _t(t) {
  return (F.lFrame.contextLView = t), t[h1];
}
function Rt(t) {
  return (F.lFrame.contextLView = null), t;
}
function a1() {
  let t = c8();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function c8() {
  return F.lFrame.currentTNode;
}
function yd() {
  let t = F.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function L3(t, e) {
  let r = F.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function a8() {
  return F.lFrame.isParent;
}
function s8() {
  F.lFrame.isParent = !1;
}
function o8() {
  let t = F.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function Vd(t) {
  return (F.lFrame.bindingIndex = t);
}
function Rn() {
  return F.lFrame.bindingIndex++;
}
function Hd(t) {
  let e = F.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function zd() {
  return F.lFrame.inI18n;
}
function bd(t, e) {
  let r = F.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), oi(e);
}
function wd() {
  return F.lFrame.currentDirectiveIndex;
}
function oi(t) {
  F.lFrame.currentDirectiveIndex = t;
}
function Dd(t) {
  let e = F.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function l8() {
  return F.lFrame.currentQueryIndex;
}
function dc(t) {
  F.lFrame.currentQueryIndex = t;
}
function xd(t) {
  let e = t[R];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Z2] : null;
}
function f8(t, e, r) {
  if (r & P.SkipSelf) {
    let i = e,
      c = t;
    for (; (i = i.parent), i === null && !(r & P.Host); )
      if (((i = xd(c)), i === null || ((c = c[kt]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = c);
  }
  let n = (F.lFrame = u8());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function hc(t) {
  let e = u8(),
    r = t[R];
  (F.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function u8() {
  let t = F.lFrame,
    e = t === null ? null : t.child;
  return e === null ? d8(t) : e;
}
function d8(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function h8() {
  let t = F.lFrame;
  return (F.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var p8 = h8;
function pc() {
  let t = h8();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function Ld(t) {
  return (F.lFrame.contextLView = hd(t, F.lFrame.contextLView))[h1];
}
function Pt() {
  return F.lFrame.selectedIndex;
}
function qe(t) {
  F.lFrame.selectedIndex = t;
}
function mc() {
  let t = F.lFrame;
  return Jo(t.tView, t.selectedIndex);
}
function Sd() {
  return F.lFrame.currentNamespace;
}
var m8 = !0;
function gc() {
  return m8;
}
function vc(t) {
  m8 = t;
}
function Nd(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: c } = e.type.prototype;
  if (n) {
    let a = Qo(e);
    (r.preOrderHooks ??= []).push(t, a),
      (r.preOrderCheckHooks ??= []).push(t, a);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    c &&
      ((r.preOrderHooks ??= []).push(t, c),
      (r.preOrderCheckHooks ??= []).push(t, c));
}
function Cc(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let c = t.data[r].type.prototype,
      {
        ngAfterContentInit: a,
        ngAfterContentChecked: s,
        ngAfterViewInit: o,
        ngAfterViewChecked: l,
        ngOnDestroy: f,
      } = c;
    a && (t.contentHooks ??= []).push(-r, a),
      s &&
        ((t.contentHooks ??= []).push(r, s),
        (t.contentCheckHooks ??= []).push(r, s)),
      o && (t.viewHooks ??= []).push(-r, o),
      l &&
        ((t.viewHooks ??= []).push(r, l), (t.viewCheckHooks ??= []).push(r, l)),
      f != null && (t.destroyHooks ??= []).push(r, f);
  }
}
function tn(t, e, r) {
  g8(t, e, 3, r);
}
function nn(t, e, r, n) {
  (t[I] & 3) === r && g8(t, e, r, n);
}
function B6(t, e) {
  let r = t[I];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[I] = r));
}
function g8(t, e, r, n) {
  let i = n !== void 0 ? t[zt] & 65535 : 0,
    c = n ?? -1,
    a = e.length - 1,
    s = 0;
  for (let o = i; o < a; o++)
    if (typeof e[o + 1] == 'number') {
      if (((s = e[o]), n != null && s >= n)) break;
    } else
      e[o] < 0 && (t[zt] += 65536),
        (s < c || c == -1) &&
          (Ed(t, r, e, o), (t[zt] = (t[zt] & 4294901760) + o + 2)),
        o++;
}
function Os(t, e) {
  z1(4, t, e);
  let r = G(null);
  try {
    e.call(t);
  } finally {
    G(r), z1(5, t, e);
  }
}
function Ed(t, e, r, n) {
  let i = r[n] < 0,
    c = r[n + 1],
    a = i ? -r[n] : r[n],
    s = t[a];
  i
    ? t[I] >> 14 < t[zt] >> 16 &&
      (t[I] & 3) === e &&
      ((t[I] += 16384), Os(s, c))
    : Os(s, c);
}
var xt = -1,
  We = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function Id(t) {
  return t instanceof We;
}
function Ad(t) {
  return (t.flags & 8) !== 0;
}
function Td(t) {
  return (t.flags & 16) !== 0;
}
function v8(t) {
  return t !== xt;
}
function hn(t) {
  return t & 32767;
}
function kd(t) {
  return t >> 16;
}
function pn(t, e) {
  let r = kd(t),
    n = e;
  for (; r > 0; ) (n = n[kt]), r--;
  return n;
}
var li = !0;
function mn(t) {
  let e = li;
  return (li = t), e;
}
var _d = 256,
  C8 = _d - 1,
  M8 = 5,
  Rd = 0,
  b1 = {};
function Pd(t, e, r) {
  let n;
  typeof r == 'string'
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(d3) && (n = r[d3]),
    n == null && (n = r[d3] = Rd++);
  let i = n & C8,
    c = 1 << i;
  e.data[t + (i >> M8)] |= c;
}
function gn(t, e) {
  let r = y8(t, e);
  if (r !== -1) return r;
  let n = e[R];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    j6(n.data, t),
    j6(e, null),
    j6(n.blueprint, null));
  let i = Mc(t, e),
    c = t.injectorIndex;
  if (v8(i)) {
    let a = hn(i),
      s = pn(i, e),
      o = s[R].data;
    for (let l = 0; l < 8; l++) e[c + l] = s[a + l] | o[a + l];
  }
  return (e[c + 8] = i), c;
}
function j6(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function y8(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Mc(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = w8(i)), n === null)) return xt;
    if ((r++, (i = i[kt]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return xt;
}
function fi(t, e, r) {
  Pd(t, e, r);
}
function V8(t, e, r) {
  if (r & P.Optional || t !== void 0) return t;
  tc(e, 'NodeInjector');
}
function H8(t, e, r, n) {
  if (
    (r & P.Optional && n === void 0 && (n = null), !(r & (P.Self | P.Host)))
  ) {
    let i = t[Et],
      c = U2(void 0);
    try {
      return i ? i.get(e, n, r & P.Optional) : Do(e, n, r & P.Optional);
    } finally {
      U2(c);
    }
  }
  return V8(n, e, r);
}
function z8(t, e, r, n = P.Default, i) {
  if (t !== null) {
    if (e[I] & 2048 && !(n & P.Self)) {
      let a = jd(t, e, r, n, b1);
      if (a !== b1) return a;
    }
    let c = b8(t, e, r, n, b1);
    if (c !== b1) return c;
  }
  return H8(e, r, n, i);
}
function b8(t, e, r, n, i) {
  let c = Od(r);
  if (typeof c == 'function') {
    if (!f8(e, t, n)) return n & P.Host ? V8(i, r, n) : H8(e, r, n, i);
    try {
      let a;
      if (((a = c(n)), a == null && !(n & P.Optional))) tc(r);
      else return a;
    } finally {
      p8();
    }
  } else if (typeof c == 'number') {
    let a = null,
      s = y8(t, e),
      o = xt,
      l = n & P.Host ? e[m1][Z2] : null;
    for (
      (s === -1 || n & P.SkipSelf) &&
      ((o = s === -1 ? Mc(t, e) : e[s + 8]),
      o === xt || !js(n, !1)
        ? (s = -1)
        : ((a = e[R]), (s = hn(o)), (e = pn(o, e))));
      s !== -1;

    ) {
      let f = e[R];
      if (Bs(c, s, f.data)) {
        let u = Fd(s, e, r, a, n, l);
        if (u !== b1) return u;
      }
      (o = e[s + 8]),
        o !== xt && js(n, e[R].data[s + 8] === l) && Bs(c, s, e)
          ? ((a = f), (s = hn(o)), (e = pn(o, e)))
          : (s = -1);
    }
  }
  return i;
}
function Fd(t, e, r, n, i, c) {
  let a = e[R],
    s = a.data[t + 8],
    o = n == null ? _n(s) && li : n != a && (s.type & 3) !== 0,
    l = i & P.Host && c === s,
    f = rn(s, a, r, o, l);
  return f !== null ? Ye(e, a, f, s) : b1;
}
function rn(t, e, r, n, i) {
  let c = t.providerIndexes,
    a = e.data,
    s = c & 1048575,
    o = t.directiveStart,
    l = t.directiveEnd,
    f = c >> 20,
    u = n ? s : s + f,
    d = i ? s + f : l;
  for (let h = u; h < d; h++) {
    let C = a[h];
    if ((h < o && r === C) || (h >= o && C.type === r)) return h;
  }
  if (i) {
    let h = a[o];
    if (h && de(h) && h.type === r) return o;
  }
  return null;
}
function Ye(t, e, r, n) {
  let i = t[r],
    c = e.data;
  if (Id(i)) {
    let a = i;
    a.resolving && lu(ou(c[r]));
    let s = mn(a.canSeeViewProviders);
    a.resolving = !0;
    let o,
      l = a.injectImpl ? U2(a.injectImpl) : null,
      f = f8(t, n, P.Default);
    try {
      (i = t[r] = a.factory(void 0, c, t, n)),
        e.firstCreatePass && r >= n.directiveStart && Nd(r, c[r], e);
    } finally {
      l !== null && U2(l), mn(s), (a.resolving = !1), p8();
    }
  }
  return i;
}
function Od(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(d3) ? t[d3] : void 0;
  return typeof e == 'number' ? (e >= 0 ? e & C8 : Bd) : e;
}
function Bs(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> M8)] & n);
}
function js(t, e) {
  return !(t & P.Self) && !(t & P.Host && e);
}
var je = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return z8(this._tNode, this._lView, e, En(n), r);
  }
};
function Bd() {
  return new je(a1(), W());
}
function ve(t) {
  return w3(() => {
    let e = t.prototype.constructor,
      r = e[sn] || ui(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let c = i[sn] || ui(i);
      if (c && c !== r) return c;
      i = Object.getPrototypeOf(i);
    }
    return (c) => new c();
  });
}
function ui(t) {
  return yo(t)
    ? () => {
        let e = ui(k2(t));
        return e && e();
      }
    : Ue(t);
}
function jd(t, e, r, n, i) {
  let c = t,
    a = e;
  for (; c !== null && a !== null && a[I] & 2048 && !(a[I] & 512); ) {
    let s = b8(c, a, r, n | P.Self, b1);
    if (s !== b1) return s;
    let o = c.parent;
    if (!o) {
      let l = a[Go];
      if (l) {
        let f = l.get(r, b1, n);
        if (f !== b1) return f;
      }
      (o = w8(a)), (a = a[kt]);
    }
    c = o;
  }
  return i;
}
function w8(t) {
  let e = t[R],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Z2] : null;
}
function Us(t, e = null, r = null, n) {
  let i = D8(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function D8(t, e = null, r = null, n, i = new Set()) {
  let c = [r || r1, ju(t)];
  return (
    (n = n || (typeof t == 'object' ? void 0 : _2(t))),
    new g3(c, e || sc(), n || null, i)
  );
}
var v1 = (() => {
  let e = class e {
    static create(n, i) {
      if (Array.isArray(n)) return Us({ name: '' }, i, n, '');
      {
        let c = n.name ?? '';
        return Us({ name: c }, n.parent, n.providers, c);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = p3),
    (e.NULL = new fn()),
    (e.ɵprov = H({ token: e, providedIn: 'any', factory: () => D(So) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var Ud = 'ngOriginalError';
function U6(t) {
  return t[Ud];
}
var x1 = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error('ERROR', e),
        r && this._console.error('ORIGINAL ERROR', r);
    }
    _findOriginalError(e) {
      let r = e && U6(e);
      for (; r && U6(r); ) r = U6(r);
      return r || null;
    }
  },
  x8 = new w('', {
    providedIn: 'root',
    factory: () => g(x1).handleError.bind(void 0),
  }),
  yc = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = $d), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  di = class extends yc {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return n8(this._lView, e), () => pd(this._lView, e);
    }
  };
function $d() {
  return new di(W());
}
function Gd() {
  return Ft(a1(), W());
}
function Ft(t, e) {
  return new $2(c1(t, e));
}
var $2 = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = Gd;
  let t = e;
  return t;
})();
function qd(t) {
  return t instanceof $2 ? t.nativeElement : t;
}
var hi = class extends T2 {
  constructor(e = !1) {
    super(),
      (this.destroyRef = void 0),
      (this.__isAsync = e),
      $o() && (this.destroyRef = g(yc, { optional: !0 }) ?? void 0);
  }
  emit(e) {
    let r = G(null);
    try {
      super.next(e);
    } finally {
      G(r);
    }
  }
  subscribe(e, r, n) {
    let i = e,
      c = r || (() => null),
      a = n;
    if (e && typeof e == 'object') {
      let o = e;
      (i = o.next?.bind(o)), (c = o.error?.bind(o)), (a = o.complete?.bind(o));
    }
    this.__isAsync && ((c = $6(c)), i && (i = $6(i)), a && (a = $6(a)));
    let s = super.subscribe({ next: i, error: c, complete: a });
    return e instanceof y2 && e.add(s), s;
  }
};
function $6(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var o2 = hi;
function Wd() {
  return this._results[Symbol.iterator]();
}
var pi = class t {
  get changes() {
    return (this._changes ??= new o2());
  }
  constructor(e = !1) {
    (this._emitDistinctChangesOnly = e),
      (this.dirty = !0),
      (this._onDirty = void 0),
      (this._results = []),
      (this._changesDetected = !1),
      (this._changes = void 0),
      (this.length = 0),
      (this.first = void 0),
      (this.last = void 0);
    let r = t.prototype;
    r[Symbol.iterator] || (r[Symbol.iterator] = Wd);
  }
  get(e) {
    return this._results[e];
  }
  map(e) {
    return this._results.map(e);
  }
  filter(e) {
    return this._results.filter(e);
  }
  find(e) {
    return this._results.find(e);
  }
  reduce(e, r) {
    return this._results.reduce(e, r);
  }
  forEach(e) {
    this._results.forEach(e);
  }
  some(e) {
    return this._results.some(e);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(e, r) {
    this.dirty = !1;
    let n = yu(e);
    (this._changesDetected = !Mu(this._results, n, r)) &&
      ((this._results = n),
      (this.length = n.length),
      (this.last = n[this.length - 1]),
      (this.first = n[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.emit(this);
  }
  onDirty(e) {
    this._onDirty = e;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
};
function L8(t) {
  return (t.flags & 128) === 128;
}
var mi;
function S8(t) {
  mi = t;
}
function N8() {
  if (mi !== void 0) return mi;
  if (typeof document < 'u') return document;
  throw new V(210, !1);
}
var Pn = new w('', { providedIn: 'root', factory: () => Yd }),
  Yd = 'ng',
  Vc = new w(''),
  L1 = new w('', { providedIn: 'platform', factory: () => 'unknown' });
var Hc = new w('', {
  providedIn: 'root',
  factory: () =>
    N8().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
});
var Qd = 'h',
  Zd = 'b';
var Xd = () => null;
function zc(t, e, r = !1) {
  return Xd(t, e, r);
}
var E8 = !1,
  Kd = new w('', { providedIn: 'root', factory: () => E8 });
var Y4;
function Jd() {
  if (Y4 === void 0 && ((Y4 = null), u2.trustedTypes))
    try {
      Y4 = u2.trustedTypes.createPolicy('angular', {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return Y4;
}
function Fn(t) {
  return Jd()?.createHTML(t) || t;
}
var Q4;
function eh() {
  if (Q4 === void 0 && ((Q4 = null), u2.trustedTypes))
    try {
      Q4 = u2.trustedTypes.createPolicy('angular#unsafe-bypass', {
        createHTML: (t) => t,
        createScript: (t) => t,
        createScriptURL: (t) => t,
      });
    } catch {}
  return Q4;
}
function $s(t) {
  return eh()?.createHTML(t) || t;
}
var O1 = class {
    constructor(e) {
      this.changingThisBreaksApplicationSecurity = e;
    }
    toString() {
      return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Co})`;
    }
  },
  gi = class extends O1 {
    getTypeName() {
      return 'HTML';
    }
  },
  vi = class extends O1 {
    getTypeName() {
      return 'Style';
    }
  },
  Ci = class extends O1 {
    getTypeName() {
      return 'Script';
    }
  },
  Mi = class extends O1 {
    getTypeName() {
      return 'URL';
    }
  },
  yi = class extends O1 {
    getTypeName() {
      return 'ResourceURL';
    }
  };
function $1(t) {
  return t instanceof O1 ? t.changingThisBreaksApplicationSecurity : t;
}
function Je(t, e) {
  let r = th(t);
  if (r != null && r !== e) {
    if (r === 'ResourceURL' && e === 'URL') return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${Co})`);
  }
  return r === e;
}
function th(t) {
  return (t instanceof O1 && t.getTypeName()) || null;
}
function I8(t) {
  return new gi(t);
}
function A8(t) {
  return new vi(t);
}
function T8(t) {
  return new Ci(t);
}
function k8(t) {
  return new Mi(t);
}
function _8(t) {
  return new yi(t);
}
function nh(t) {
  let e = new Hi(t);
  return rh() ? new Vi(e) : e;
}
var Vi = class {
    constructor(e) {
      this.inertDocumentHelper = e;
    }
    getInertBodyElement(e) {
      e = '<body><remove></remove>' + e;
      try {
        let r = new window.DOMParser().parseFromString(Fn(e), 'text/html').body;
        return r === null
          ? this.inertDocumentHelper.getInertBodyElement(e)
          : (r.removeChild(r.firstChild), r);
      } catch {
        return null;
      }
    }
  },
  Hi = class {
    constructor(e) {
      (this.defaultDoc = e),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            'sanitization-inert'
          ));
    }
    getInertBodyElement(e) {
      let r = this.inertDocument.createElement('template');
      return (r.innerHTML = Fn(e)), r;
    }
  };
function rh() {
  try {
    return !!new window.DOMParser().parseFromString(Fn(''), 'text/html');
  } catch {
    return !1;
  }
}
var ih = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function bc(t) {
  return (t = String(t)), t.match(ih) ? t : 'unsafe:' + t;
}
function G1(t) {
  let e = {};
  for (let r of t.split(',')) e[r] = !0;
  return e;
}
function S3(...t) {
  let e = {};
  for (let r of t) for (let n in r) r.hasOwnProperty(n) && (e[n] = !0);
  return e;
}
var R8 = G1('area,br,col,hr,img,wbr'),
  P8 = G1('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'),
  F8 = G1('rp,rt'),
  ch = S3(F8, P8),
  ah = S3(
    P8,
    G1(
      'address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'
    )
  ),
  sh = S3(
    F8,
    G1(
      'a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'
    )
  ),
  Gs = S3(R8, ah, sh, ch),
  O8 = G1('background,cite,href,itemtype,longdesc,poster,src,xlink:href'),
  oh = G1(
    'abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width'
  ),
  lh = G1(
    'aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext'
  ),
  fh = S3(O8, oh, lh),
  uh = G1('script,style,template'),
  zi = class {
    constructor() {
      (this.sanitizedSomething = !1), (this.buf = []);
    }
    sanitizeChildren(e) {
      let r = e.firstChild,
        n = !0,
        i = [];
      for (; r; ) {
        if (
          (r.nodeType === Node.ELEMENT_NODE
            ? (n = this.startElement(r))
            : r.nodeType === Node.TEXT_NODE
            ? this.chars(r.nodeValue)
            : (this.sanitizedSomething = !0),
          n && r.firstChild)
        ) {
          i.push(r), (r = ph(r));
          continue;
        }
        for (; r; ) {
          r.nodeType === Node.ELEMENT_NODE && this.endElement(r);
          let c = hh(r);
          if (c) {
            r = c;
            break;
          }
          r = i.pop();
        }
      }
      return this.buf.join('');
    }
    startElement(e) {
      let r = qs(e).toLowerCase();
      if (!Gs.hasOwnProperty(r))
        return (this.sanitizedSomething = !0), !uh.hasOwnProperty(r);
      this.buf.push('<'), this.buf.push(r);
      let n = e.attributes;
      for (let i = 0; i < n.length; i++) {
        let c = n.item(i),
          a = c.name,
          s = a.toLowerCase();
        if (!fh.hasOwnProperty(s)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let o = c.value;
        O8[s] && (o = bc(o)), this.buf.push(' ', a, '="', Ws(o), '"');
      }
      return this.buf.push('>'), !0;
    }
    endElement(e) {
      let r = qs(e).toLowerCase();
      Gs.hasOwnProperty(r) &&
        !R8.hasOwnProperty(r) &&
        (this.buf.push('</'), this.buf.push(r), this.buf.push('>'));
    }
    chars(e) {
      this.buf.push(Ws(e));
    }
  };
function dh(t, e) {
  return (
    (t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function hh(t) {
  let e = t.nextSibling;
  if (e && t !== e.previousSibling) throw B8(e);
  return e;
}
function ph(t) {
  let e = t.firstChild;
  if (e && dh(t, e)) throw B8(e);
  return e;
}
function qs(t) {
  let e = t.nodeName;
  return typeof e == 'string' ? e : 'FORM';
}
function B8(t) {
  return new Error(
    `Failed to sanitize html because the element is clobbered: ${t.outerHTML}`
  );
}
var mh = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  gh = /([^\#-~ |!])/g;
function Ws(t) {
  return t
    .replace(/&/g, '&amp;')
    .replace(mh, function (e) {
      let r = e.charCodeAt(0),
        n = e.charCodeAt(1);
      return '&#' + ((r - 55296) * 1024 + (n - 56320) + 65536) + ';';
    })
    .replace(gh, function (e) {
      return '&#' + e.charCodeAt(0) + ';';
    })
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
var Z4;
function wc(t, e) {
  let r = null;
  try {
    Z4 = Z4 || nh(t);
    let n = e ? String(e) : '';
    r = Z4.getInertBodyElement(n);
    let i = 5,
      c = n;
    do {
      if (i === 0)
        throw new Error(
          'Failed to sanitize html because the input is unstable'
        );
      i--, (n = c), (c = r.innerHTML), (r = Z4.getInertBodyElement(n));
    } while (n !== c);
    let s = new zi().sanitizeChildren(Ys(r) || r);
    return Fn(s);
  } finally {
    if (r) {
      let n = Ys(r) || r;
      for (; n.firstChild; ) n.removeChild(n.firstChild);
    }
  }
}
function Ys(t) {
  return 'content' in t && vh(t) ? t.content : null;
}
function vh(t) {
  return t.nodeType === Node.ELEMENT_NODE && t.nodeName === 'TEMPLATE';
}
var q1 = (function (t) {
  return (
    (t[(t.NONE = 0)] = 'NONE'),
    (t[(t.HTML = 1)] = 'HTML'),
    (t[(t.STYLE = 2)] = 'STYLE'),
    (t[(t.SCRIPT = 3)] = 'SCRIPT'),
    (t[(t.URL = 4)] = 'URL'),
    (t[(t.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    t
  );
})(q1 || {});
function j8(t) {
  let e = Ch();
  return e
    ? $s(e.sanitize(q1.HTML, t) || '')
    : Je(t, 'HTML')
    ? $s($1(t))
    : wc(N8(), Nn(t));
}
function Ch() {
  let t = W();
  return t && t[p1].sanitizer;
}
var U8 = new Map(),
  Mh = 0;
function yh() {
  return Mh++;
}
function Vh(t) {
  U8.set(t[kn], t);
}
function Hh(t) {
  U8.delete(t[kn]);
}
var Qs = '__ngContext__';
function Qe(t, e) {
  Be(e) ? ((t[Qs] = e[kn]), Vh(e)) : (t[Qs] = e);
}
function $8(t) {
  return t instanceof Function ? t() : t;
}
function zh(t) {
  return (t ?? g(v1)).get(L1) === 'browser';
}
var B1 = (function (t) {
    return (
      (t[(t.Important = 1)] = 'Important'),
      (t[(t.DashCase = 2)] = 'DashCase'),
      t
    );
  })(B1 || {}),
  bh;
function Dc(t, e) {
  return bh(t, e);
}
function bt(t, e, r, n, i) {
  if (n != null) {
    let c,
      a = !1;
    U1(n) ? (c = n) : Be(n) && ((a = !0), (n = n[j1]));
    let s = D1(n);
    t === 0 && r !== null
      ? i == null
        ? Z8(e, r, s)
        : vn(e, r, s, i || null, !0)
      : t === 1 && r !== null
      ? vn(e, r, s, i || null, !0)
      : t === 2
      ? Fh(e, s, a)
      : t === 3 && e.destroyNode(s),
      c != null && Bh(e, t, c, r, i);
  }
}
function wh(t, e) {
  return t.createText(e);
}
function Dh(t, e, r) {
  t.setValue(e, r);
}
function G8(t, e, r) {
  return t.createElement(e, r);
}
function xh(t, e) {
  q8(t, e), (e[j1] = null), (e[Z2] = null);
}
function Lh(t, e, r, n, i, c) {
  (n[j1] = i), (n[Z2] = e), On(t, n, r, 1, i, c);
}
function q8(t, e) {
  e[p1].changeDetectionScheduler?.notify(1), On(t, e, e[V2], 2, null, null);
}
function Sh(t) {
  let e = t[M3];
  if (!e) return G6(t[R], t);
  for (; e; ) {
    let r = null;
    if (Be(e)) r = e[M3];
    else {
      let n = e[Y2];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[d1] && e !== t; ) Be(e) && G6(e[R], e), (e = e[S2]);
      e === null && (e = t), Be(e) && G6(e[R], e), (r = e && e[d1]);
    }
    e = r;
  }
}
function Nh(t, e, r, n) {
  let i = Y2 + n,
    c = r.length;
  n > 0 && (r[i - 1][d1] = e),
    n < c - Y2
      ? ((e[d1] = r[i]), Lo(r, Y2 + n, e))
      : (r.push(e), (e[d1] = null)),
    (e[S2] = r);
  let a = e[x3];
  a !== null && r !== a && Eh(a, e);
  let s = e[F1];
  s !== null && s.insertView(t), si(e), (e[I] |= 128);
}
function Eh(t, e) {
  let r = t[It],
    i = e[S2][S2][m1];
  e[m1] !== i && (t[I] |= oc.HasTransplantedViews),
    r === null ? (t[It] = [e]) : r.push(e);
}
function W8(t, e) {
  let r = t[It],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function bi(t, e) {
  if (t.length <= Y2) return;
  let r = Y2 + e,
    n = t[r];
  if (n) {
    let i = n[x3];
    i !== null && i !== t && W8(i, n), e > 0 && (t[r - 1][d1] = n[d1]);
    let c = ln(t, Y2 + e);
    xh(n[R], n);
    let a = c[F1];
    a !== null && a.detachView(c[R]),
      (n[S2] = null),
      (n[d1] = null),
      (n[I] &= -129);
  }
  return n;
}
function Y8(t, e) {
  if (!(e[I] & 256)) {
    let r = e[V2];
    r.destroyNode && On(t, e, r, 3, null, null), Sh(e);
  }
}
function G6(t, e) {
  if (e[I] & 256) return;
  let r = G(null);
  try {
    (e[I] &= -129),
      (e[I] |= 256),
      e[$e] && ns(e[$e]),
      Ah(t, e),
      Ih(t, e),
      e[R].type === 1 && e[V2].destroy();
    let n = e[x3];
    if (n !== null && U1(e[S2])) {
      n !== e[S2] && W8(n, e);
      let i = e[F1];
      i !== null && i.detachView(t);
    }
    Hh(e);
  } finally {
    G(r);
  }
}
function Ih(t, e) {
  let r = t.cleanup,
    n = e[C3];
  if (r !== null)
    for (let c = 0; c < r.length - 1; c += 2)
      if (typeof r[c] == 'string') {
        let a = r[c + 3];
        a >= 0 ? n[a]() : n[-a].unsubscribe(), (c += 2);
      } else {
        let a = n[r[c + 1]];
        r[c].call(a);
      }
  n !== null && (e[C3] = null);
  let i = e[fe];
  if (i !== null) {
    e[fe] = null;
    for (let c = 0; c < i.length; c++) {
      let a = i[c];
      a();
    }
  }
}
function Ah(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof We)) {
        let c = r[n + 1];
        if (Array.isArray(c))
          for (let a = 0; a < c.length; a += 2) {
            let s = i[c[a]],
              o = c[a + 1];
            z1(4, s, o);
            try {
              o.call(s);
            } finally {
              z1(5, s, o);
            }
          }
        else {
          z1(4, i, c);
          try {
            c.call(i);
          } finally {
            z1(5, i, c);
          }
        }
      }
    }
}
function Q8(t, e, r) {
  return Th(t, e.parent, r);
}
function Th(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[j1];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: c } = t.data[n.directiveStart + i];
      if (c === w1.None || c === w1.Emulated) return null;
    }
    return c1(n, r);
  }
}
function vn(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function Z8(t, e, r) {
  t.appendChild(e, r);
}
function Zs(t, e, r, n, i) {
  n !== null ? vn(t, e, r, n, i) : Z8(t, e, r);
}
function kh(t, e, r, n) {
  t.removeChild(e, r, n);
}
function xc(t, e) {
  return t.parentNode(e);
}
function _h(t, e) {
  return t.nextSibling(e);
}
function X8(t, e, r) {
  return Ph(t, e, r);
}
function Rh(t, e, r) {
  return t.type & 40 ? c1(t, r) : null;
}
var Ph = Rh,
  Xs;
function Lc(t, e, r, n) {
  let i = Q8(t, n, e),
    c = e[V2],
    a = n.parent || e[Z2],
    s = X8(a, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let o = 0; o < r.length; o++) Zs(c, i, r[o], s, !1);
    else Zs(c, i, r, s, !1);
  Xs !== void 0 && Xs(c, n, e, r, i);
}
function cn(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return c1(e, t);
    if (r & 4) return wi(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return cn(t, n);
      {
        let i = t[e.index];
        return U1(i) ? wi(-1, i) : D1(i);
      }
    } else {
      if (r & 32) return Dc(e, t)() || D1(t[e.index]);
      {
        let n = K8(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = V3(t[m1]);
          return cn(i, n);
        } else return cn(t, e.next);
      }
    }
  }
  return null;
}
function K8(t, e) {
  if (e !== null) {
    let n = t[m1][Z2],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function wi(t, e) {
  let r = Y2 + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[R].firstChild;
    if (i !== null) return cn(n, i);
  }
  return e[Ge];
}
function Fh(t, e, r) {
  let n = xc(t, e);
  n && kh(t, n, e, r);
}
function Sc(t, e, r, n, i, c, a) {
  for (; r != null; ) {
    let s = n[r.index],
      o = r.type;
    if (
      (a && e === 0 && (s && Qe(D1(s), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (o & 8) Sc(t, e, r.child, n, i, c, !1), bt(e, t, i, s, c);
      else if (o & 32) {
        let l = Dc(r, n),
          f;
        for (; (f = l()); ) bt(e, t, i, f, c);
        bt(e, t, i, s, c);
      } else o & 16 ? J8(t, e, n, r, i, c) : bt(e, t, i, s, c);
    r = a ? r.projectionNext : r.next;
  }
}
function On(t, e, r, n, i, c) {
  Sc(r, n, t.firstChild, e, i, c, !1);
}
function Oh(t, e, r) {
  let n = e[V2],
    i = Q8(t, r, e),
    c = r.parent || e[Z2],
    a = X8(c, r, e);
  J8(n, 0, e, r, i, a);
}
function J8(t, e, r, n, i, c) {
  let a = r[m1],
    o = a[Z2].projection[n.projection];
  if (Array.isArray(o))
    for (let l = 0; l < o.length; l++) {
      let f = o[l];
      bt(e, t, i, f, c);
    }
  else {
    let l = o,
      f = a[S2];
    L8(n) && (l.flags |= 128), Sc(t, e, l, f, i, c, !0);
  }
}
function Bh(t, e, r, n, i) {
  let c = r[Ge],
    a = D1(r);
  c !== a && bt(e, t, n, c, i);
  for (let s = Y2; s < r.length; s++) {
    let o = r[s];
    On(o[R], o, t, e, n, c);
  }
}
function jh(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let c = n.indexOf('-') === -1 ? void 0 : B1.DashCase;
    i == null
      ? t.removeStyle(r, n, c)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (c |= B1.Important)),
        t.setStyle(r, n, i, c));
  }
}
function Uh(t, e, r) {
  t.setAttribute(e, 'style', r);
}
function e5(t, e, r) {
  r === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', r);
}
function t5(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: c } = r;
  n !== null && ni(t, e, n),
    i !== null && e5(t, e, i),
    c !== null && Uh(t, e, c);
}
var et = {};
function E(t = 1) {
  n5(I2(), W(), Pt() + t, !1);
}
function n5(t, e, r, n) {
  if (!n)
    if ((e[I] & 3) === 3) {
      let c = t.preOrderCheckHooks;
      c !== null && tn(e, c, r);
    } else {
      let c = t.preOrderHooks;
      c !== null && nn(e, c, 0, r);
    }
  qe(r);
}
function z(t, e = P.Default) {
  let r = W();
  if (r === null) return D(t, e);
  let n = a1();
  return z8(n, r, k2(t), e);
}
function r5() {
  let t = 'invalid';
  throw new Error(t);
}
function i5(t, e, r, n, i, c) {
  let a = G(null);
  try {
    let s = null;
    i & Q2.SignalBased && (s = e[n][Ka]),
      s !== null && s.transformFn !== void 0 && (c = s.transformFn(c)),
      i & Q2.HasDecoratorInputTransform &&
        (c = t.inputTransforms[n].call(e, c)),
      t.setInput !== null ? t.setInput(e, s, c, r, n) : Yo(e, s, n, c);
  } finally {
    G(a);
  }
}
function $h(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) qe(~i);
        else {
          let c = i,
            a = r[++n],
            s = r[++n];
          bd(a, c);
          let o = e[c];
          s(2, o);
        }
      }
    } finally {
      qe(-1);
    }
}
function Bn(t, e, r, n, i, c, a, s, o, l, f) {
  let u = e.blueprint.slice();
  return (
    (u[j1] = i),
    (u[I] = n | 4 | 128 | 8 | 64),
    (l !== null || (t && t[I] & 2048)) && (u[I] |= 2048),
    t8(u),
    (u[S2] = u[kt] = t),
    (u[h1] = r),
    (u[p1] = a || (t && t[p1])),
    (u[V2] = s || (t && t[V2])),
    (u[Et] = o || (t && t[Et]) || null),
    (u[Z2] = c),
    (u[kn] = yh()),
    (u[v3] = f),
    (u[Go] = l),
    (u[m1] = e.type == 2 ? t[m1] : u),
    u
  );
}
function N3(t, e, r, n, i) {
  let c = t.data[e];
  if (c === null) (c = Gh(t, e, r, n, i)), zd() && (c.flags |= 32);
  else if (c.type & 64) {
    (c.type = r), (c.value = n), (c.attrs = i);
    let a = yd();
    c.injectorIndex = a === null ? -1 : a.injectorIndex;
  }
  return L3(c, !0), c;
}
function Gh(t, e, r, n, i) {
  let c = c8(),
    a = a8(),
    s = a ? c : c && c.parent,
    o = (t.data[e] = Xh(t, s, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = o),
    c !== null &&
      (a
        ? c.child == null && o.parent !== null && (c.child = o)
        : c.next === null && ((c.next = o), (o.prev = c))),
    o
  );
}
function c5(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let c = 0; c < r; c++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function a5(t, e, r, n, i) {
  let c = Pt(),
    a = n & 2;
  try {
    qe(-1), a && e.length > i1 && n5(t, e, i1, !1), z1(a ? 2 : 0, i), r(n, i);
  } finally {
    qe(c), z1(a ? 3 : 1, i);
  }
}
function s5(t, e, r) {
  if (Wo(e)) {
    let n = G(null);
    try {
      let i = e.directiveStart,
        c = e.directiveEnd;
      for (let a = i; a < c; a++) {
        let s = t.data[a];
        if (s.contentQueries) {
          let o = r[a];
          s.contentQueries(1, o, a);
        }
      }
    } finally {
      G(n);
    }
  }
}
function o5(t, e, r) {
  r8() && (rp(t, e, r, c1(r, e)), (r.flags & 64) === 64 && p5(t, e, r));
}
function l5(t, e, r = c1) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let c = 0; c < n.length; c += 2) {
      let a = n[c + 1],
        s = a === -1 ? r(e, t) : t[a];
      t[i++] = s;
    }
  }
}
function f5(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Nc(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function Nc(t, e, r, n, i, c, a, s, o, l, f) {
  let u = i1 + n,
    d = u + i,
    h = qh(u, d),
    C = typeof l == 'function' ? l() : l;
  return (h[R] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: s,
    declTNode: e,
    data: h.slice().fill(null, u),
    bindingStartIndex: u,
    expandoStartIndex: d,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof c == 'function' ? c() : c,
    pipeRegistry: typeof a == 'function' ? a() : a,
    firstChild: null,
    schemas: o,
    consts: C,
    incompleteFirstPass: !1,
    ssrId: f,
  });
}
function qh(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : et);
  return r;
}
function Wh(t, e, r, n) {
  let c = n.get(Kd, E8) || r === w1.ShadowDom,
    a = t.selectRootElement(e, c);
  return Yh(a), a;
}
function Yh(t) {
  Qh(t);
}
var Qh = () => null;
function Zh(t, e, r, n) {
  let i = v5(e);
  i.push(r), t.firstCreatePass && C5(t).push(n, i.length - 1);
}
function Xh(t, e, r, n, i, c) {
  let a = e ? e.injectorIndex : -1,
    s = 0;
  return (
    i8() && (s |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: a,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: s,
      providerIndexes: 0,
      value: i,
      attrs: c,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Ks(t, e, r, n, i) {
  for (let c in e) {
    if (!e.hasOwnProperty(c)) continue;
    let a = e[c];
    if (a === void 0) continue;
    n ??= {};
    let s,
      o = Q2.None;
    Array.isArray(a) ? ((s = a[0]), (o = a[1])) : (s = a);
    let l = c;
    if (i !== null) {
      if (!i.hasOwnProperty(c)) continue;
      l = i[c];
    }
    t === 0 ? Js(n, r, l, s, o) : Js(n, r, l, s);
  }
  return n;
}
function Js(t, e, r, n, i) {
  let c;
  t.hasOwnProperty(r) ? (c = t[r]).push(e, n) : (c = t[r] = [e, n]),
    i !== void 0 && c.push(i);
}
function Kh(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    c = t.data,
    a = e.attrs,
    s = [],
    o = null,
    l = null;
  for (let f = n; f < i; f++) {
    let u = c[f],
      d = r ? r.get(u) : null,
      h = d ? d.inputs : null,
      C = d ? d.outputs : null;
    (o = Ks(0, u.inputs, f, o, h)), (l = Ks(1, u.outputs, f, l, C));
    let N = o !== null && a !== null && !ic(e) ? pp(o, f, a) : null;
    s.push(N);
  }
  o !== null &&
    (o.hasOwnProperty('class') && (e.flags |= 8),
    o.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = s),
    (e.inputs = o),
    (e.outputs = l);
}
function Jh(t) {
  return t === 'class'
    ? 'className'
    : t === 'for'
    ? 'htmlFor'
    : t === 'formaction'
    ? 'formAction'
    : t === 'innerHtml'
    ? 'innerHTML'
    : t === 'readonly'
    ? 'readOnly'
    : t === 'tabindex'
    ? 'tabIndex'
    : t;
}
function u5(t, e, r, n, i, c, a, s) {
  let o = c1(e, r),
    l = e.inputs,
    f;
  !s && l != null && (f = l[n])
    ? (Ec(t, r, f, n, i), _n(e) && ep(r, e.index))
    : e.type & 3
    ? ((n = Jh(n)),
      (i = a != null ? a(i, e.value || '', n) : i),
      c.setProperty(o, n, i))
    : e.type & 12;
}
function ep(t, e) {
  let r = ge(e, t);
  r[I] & 16 || (r[I] |= 64);
}
function d5(t, e, r, n) {
  if (r8()) {
    let i = n === null ? null : { '': -1 },
      c = cp(t, r),
      a,
      s;
    c === null ? (a = s = null) : ([a, s] = c),
      a !== null && h5(t, e, r, a, i, s),
      i && ap(r, n, i);
  }
  r.mergedAttrs = m3(r.mergedAttrs, r.attrs);
}
function h5(t, e, r, n, i, c) {
  for (let l = 0; l < n.length; l++) fi(gn(r, e), t, n[l].type);
  op(r, t.data.length, n.length);
  for (let l = 0; l < n.length; l++) {
    let f = n[l];
    f.providersResolver && f.providersResolver(f);
  }
  let a = !1,
    s = !1,
    o = c5(t, e, n.length, null);
  for (let l = 0; l < n.length; l++) {
    let f = n[l];
    (r.mergedAttrs = m3(r.mergedAttrs, f.hostAttrs)),
      lp(t, r, e, o, f),
      sp(o, f, i),
      f.contentQueries !== null && (r.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) &&
        (r.flags |= 64);
    let u = f.type.prototype;
    !a &&
      (u.ngOnChanges || u.ngOnInit || u.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (a = !0)),
      !s &&
        (u.ngOnChanges || u.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (s = !0)),
      o++;
  }
  Kh(t, r, c);
}
function tp(t, e, r, n, i) {
  let c = i.hostBindings;
  if (c) {
    let a = t.hostBindingOpCodes;
    a === null && (a = t.hostBindingOpCodes = []);
    let s = ~e.index;
    np(a) != s && a.push(s), a.push(r, n, c);
  }
}
function np(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == 'number' && r < 0) return r;
  }
  return 0;
}
function rp(t, e, r, n) {
  let i = r.directiveStart,
    c = r.directiveEnd;
  _n(r) && fp(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || gn(r, e),
    Qe(n, e);
  let a = r.initialInputs;
  for (let s = i; s < c; s++) {
    let o = t.data[s],
      l = Ye(e, t, s, r);
    if ((Qe(l, e), a !== null && hp(e, s - i, l, o, r, a), de(o))) {
      let f = ge(r.index, e);
      f[h1] = Ye(e, t, s, r);
    }
  }
}
function p5(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    c = r.index,
    a = wd();
  try {
    qe(c);
    for (let s = n; s < i; s++) {
      let o = t.data[s],
        l = e[s];
      oi(s),
        (o.hostBindings !== null || o.hostVars !== 0 || o.hostAttrs !== null) &&
          ip(o, l);
    }
  } finally {
    qe(-1), oi(a);
  }
}
function ip(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function cp(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let c = 0; c < r.length; c++) {
      let a = r[c];
      if (Ao(e, a.selectors, !1))
        if ((n || (n = []), de(a)))
          if (a.findHostDirectiveDefs !== null) {
            let s = [];
            (i = i || new Map()),
              a.findHostDirectiveDefs(a, s, i),
              n.unshift(...s, a);
            let o = s.length;
            Di(t, e, o);
          } else n.unshift(a), Di(t, e, 0);
        else
          (i = i || new Map()), a.findHostDirectiveDefs?.(a, n, i), n.push(a);
    }
  return n === null ? null : [n, i];
}
function Di(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function ap(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let c = r[e[i + 1]];
      if (c == null) throw new V(-301, !1);
      n.push(e[i], c);
    }
  }
}
function sp(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    de(e) && (r[''] = t);
  }
}
function op(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function lp(t, e, r, n, i) {
  t.data[n] = i;
  let c = i.factory || (i.factory = Ue(i.type, !0)),
    a = new We(c, de(i), z);
  (t.blueprint[n] = a), (r[n] = a), tp(t, e, n, c5(t, r, i.hostVars, et), i);
}
function fp(t, e, r) {
  let n = c1(e, t),
    i = f5(r),
    c = t[p1].rendererFactory,
    a = 16;
  r.signals ? (a = 4096) : r.onPush && (a = 64);
  let s = jn(
    t,
    Bn(t, i, null, a, n, e, null, c.createRenderer(n, r), null, null, null)
  );
  t[e.index] = s;
}
function up(t, e, r, n, i, c) {
  let a = c1(t, e);
  dp(e[V2], a, c, t.value, r, n, i);
}
function dp(t, e, r, n, i, c, a) {
  if (c == null) t.removeAttribute(e, i, r);
  else {
    let s = a == null ? Nn(c) : a(c, n || '', i);
    t.setAttribute(e, i, s, r);
  }
}
function hp(t, e, r, n, i, c) {
  let a = c[e];
  if (a !== null)
    for (let s = 0; s < a.length; ) {
      let o = a[s++],
        l = a[s++],
        f = a[s++],
        u = a[s++];
      i5(n, r, o, l, f, u);
    }
}
function pp(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let c = r[i];
    if (c === 0) {
      i += 4;
      continue;
    } else if (c === 5) {
      i += 2;
      continue;
    }
    if (typeof c == 'number') break;
    if (t.hasOwnProperty(c)) {
      n === null && (n = []);
      let a = t[c];
      for (let s = 0; s < a.length; s += 3)
        if (a[s] === e) {
          n.push(c, a[s + 1], a[s + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function m5(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function g5(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = G(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let c = r[i],
          a = r[i + 1];
        if (a !== -1) {
          let s = t.data[a];
          dc(c), s.contentQueries(2, e[a], a);
        }
      }
    } finally {
      G(n);
    }
  }
}
function jn(t, e) {
  return t[M3] ? (t[Ps][d1] = e) : (t[M3] = e), (t[Ps] = e), e;
}
function xi(t, e, r) {
  dc(0);
  let n = G(null);
  try {
    e(t, r);
  } finally {
    G(n);
  }
}
function v5(t) {
  return t[C3] || (t[C3] = []);
}
function C5(t) {
  return t.cleanup || (t.cleanup = []);
}
function M5(t, e) {
  let r = t[Et],
    n = r ? r.get(x1, null) : null;
  n && n.handleError(e);
}
function Ec(t, e, r, n, i) {
  for (let c = 0; c < r.length; ) {
    let a = r[c++],
      s = r[c++],
      o = r[c++],
      l = e[a],
      f = t.data[a];
    i5(f, l, n, s, o, i);
  }
}
function mp(t, e, r) {
  let n = Ko(e, t);
  Dh(t[V2], n, r);
}
function gp(t, e) {
  let r = ge(e, t),
    n = r[R];
  vp(n, r);
  let i = r[j1];
  i !== null && r[v3] === null && (r[v3] = zc(i, r[Et])), Ic(n, r, r[h1]);
}
function vp(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function Ic(t, e, r) {
  hc(e);
  try {
    let n = t.viewQuery;
    n !== null && xi(1, n, r);
    let i = t.template;
    i !== null && a5(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      e[F1]?.finishViewCreation(t),
      t.staticContentQueries && g5(t, e),
      t.staticViewQueries && xi(2, t.viewQuery, r);
    let c = t.components;
    c !== null && Cp(e, c);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[I] &= -5), pc();
  }
}
function Cp(t, e) {
  for (let r = 0; r < e.length; r++) gp(t, e[r]);
}
function Mp(t, e, r, n) {
  let i = G(null);
  try {
    let c = e.tView,
      s = t[I] & 4096 ? 4096 : 16,
      o = Bn(
        t,
        c,
        r,
        s,
        null,
        e,
        null,
        null,
        null,
        n?.injector ?? null,
        n?.dehydratedView ?? null
      ),
      l = t[e.index];
    o[x3] = l;
    let f = t[F1];
    return f !== null && (o[F1] = f.createEmbeddedView(c)), Ic(c, o, r), o;
  } finally {
    G(i);
  }
}
function eo(t, e) {
  return !e || e.firstChild === null || L8(t);
}
function yp(t, e, r, n = !0) {
  let i = e[R];
  if ((Nh(i, e, t, r), n)) {
    let a = wi(r, t),
      s = e[V2],
      o = xc(s, t[Ge]);
    o !== null && Lh(i, t[Z2], s, e, o, a);
  }
  let c = e[v3];
  c !== null && c.firstChild !== null && (c.firstChild = null);
}
function Cn(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let c = e[r.index];
    c !== null && n.push(D1(c)), U1(c) && Vp(c, n);
    let a = r.type;
    if (a & 8) Cn(t, e, r.child, n);
    else if (a & 32) {
      let s = Dc(r, e),
        o;
      for (; (o = s()); ) n.push(o);
    } else if (a & 16) {
      let s = K8(e, r);
      if (Array.isArray(s)) n.push(...s);
      else {
        let o = V3(e[m1]);
        Cn(o[R], o, s, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function Vp(t, e) {
  for (let r = Y2; r < t.length; r++) {
    let n = t[r],
      i = n[R].firstChild;
    i !== null && Cn(n[R], n, i, e);
  }
  t[Ge] !== t[j1] && e.push(t[Ge]);
}
var y5 = [];
function Hp(t) {
  return t[$e] ?? zp(t);
}
function zp(t) {
  let e = y5.pop() ?? Object.create(wp);
  return (e.lView = t), e;
}
function bp(t) {
  t.lView[$e] !== t && ((t.lView = null), y5.push(t));
}
var wp = J(M({}, Ja), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    y3(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[$e] = this;
  },
});
function V5(t) {
  return z5(t[M3]);
}
function H5(t) {
  return z5(t[d1]);
}
function z5(t) {
  for (; t !== null && !U1(t); ) t = t[d1];
  return t;
}
var b5 = 100;
function w5(t, e = !0, r = 0) {
  let n = t[p1],
    i = n.rendererFactory,
    c = !1;
  c || i.begin?.();
  try {
    Dp(t, r);
  } catch (a) {
    throw (e && M5(t, a), a);
  } finally {
    c || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function Dp(t, e) {
  Li(t, e);
  let r = 0;
  for (; uc(t); ) {
    if (r === b5) throw new V(103, !1);
    r++, Li(t, 1);
  }
}
function xp(t, e, r, n) {
  let i = e[I];
  if ((i & 256) === 256) return;
  let c = !1;
  !c && e[p1].inlineEffectRunner?.flush(), hc(e);
  let a = null,
    s = null;
  !c && Lp(t) && ((s = Hp(e)), (a = es(s)));
  try {
    t8(e), Vd(t.bindingStartIndex), r !== null && a5(t, e, r, 2, n);
    let o = (i & 3) === 3;
    if (!c)
      if (o) {
        let u = t.preOrderCheckHooks;
        u !== null && tn(e, u, null);
      } else {
        let u = t.preOrderHooks;
        u !== null && nn(e, u, 0, null), B6(e, 0);
      }
    if ((Sp(e), D5(e, 0), t.contentQueries !== null && g5(t, e), !c))
      if (o) {
        let u = t.contentCheckHooks;
        u !== null && tn(e, u);
      } else {
        let u = t.contentHooks;
        u !== null && nn(e, u, 1), B6(e, 1);
      }
    $h(t, e);
    let l = t.components;
    l !== null && L5(e, l, 0);
    let f = t.viewQuery;
    if ((f !== null && xi(2, f, n), !c))
      if (o) {
        let u = t.viewCheckHooks;
        u !== null && tn(e, u);
      } else {
        let u = t.viewHooks;
        u !== null && nn(e, u, 2), B6(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[O6])) {
      for (let u of e[O6]) u();
      e[O6] = null;
    }
    c || (e[I] &= -73);
  } catch (o) {
    throw (y3(e), o);
  } finally {
    s !== null && (ts(s, a), bp(s)), pc();
  }
}
function Lp(t) {
  return t.type !== 2;
}
function D5(t, e) {
  for (let r = V5(t); r !== null; r = H5(r))
    for (let n = Y2; n < r.length; n++) {
      let i = r[n];
      x5(i, e);
    }
}
function Sp(t) {
  for (let e = V5(t); e !== null; e = H5(e)) {
    if (!(e[I] & oc.HasTransplantedViews)) continue;
    let r = e[It];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        c = i[S2];
      dd(i);
    }
  }
}
function Np(t, e, r) {
  let n = ge(e, t);
  x5(n, r);
}
function x5(t, e) {
  fc(t) && Li(t, e);
}
function Li(t, e) {
  let n = t[R],
    i = t[I],
    c = t[$e],
    a = !!(e === 0 && i & 16);
  if (
    ((a ||= !!(i & 64 && e === 0)),
    (a ||= !!(i & 1024)),
    (a ||= !!(c?.dirty && M6(c))),
    c && (c.dirty = !1),
    (t[I] &= -9217),
    a)
  )
    xp(n, t, n.template, t[h1]);
  else if (i & 8192) {
    D5(t, 1);
    let s = n.components;
    s !== null && L5(t, s, 1);
  }
}
function L5(t, e, r) {
  for (let n = 0; n < e.length; n++) Np(t, e[n], r);
}
function Ac(t) {
  for (t[p1].changeDetectionScheduler?.notify(); t; ) {
    t[I] |= 64;
    let e = V3(t);
    if (nd(t) && !e) return t;
    t = e;
  }
  return null;
}
var Ze = class {
    get rootNodes() {
      let e = this._lView,
        r = e[R];
      return Cn(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[h1];
    }
    set context(e) {
      this._lView[h1] = e;
    }
    get destroyed() {
      return (this._lView[I] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[S2];
        if (U1(e)) {
          let r = e[un],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (bi(e, n), ln(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      Y8(this._lView[R], this._lView);
    }
    onDestroy(e) {
      n8(this._lView, e);
    }
    markForCheck() {
      Ac(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[I] &= -129;
    }
    reattach() {
      si(this._lView), (this._lView[I] |= 128);
    }
    detectChanges() {
      (this._lView[I] |= 1024), w5(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new V(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), q8(this._lView[R], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new V(902, !1);
      (this._appRef = e), si(this._lView);
    }
  },
  Xe = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = Ap;
    let t = e;
    return t;
  })(),
  Ep = Xe,
  Ip = class extends Ep {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = Mp(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new Ze(i);
    }
  };
function Ap() {
  return Tc(a1(), W());
}
function Tc(t, e) {
  return t.type & 4 ? new Ip(e, t, Ft(t, e)) : null;
}
var pS = new RegExp(`^(\\d+)*(${Zd}|${Qd})*(.*)`);
var Tp = () => null;
function to(t, e) {
  return Tp(t, e);
}
var Mn = class {},
  Si = class {},
  yn = class {};
function kp(t) {
  let e = Error(`No component factory found for ${_2(t)}.`);
  return (e[_p] = t), e;
}
var _p = 'ngComponent';
var Ni = class {
    resolveComponentFactory(e) {
      throw kp(e);
    }
  },
  Un = (() => {
    let e = class e {};
    e.NULL = new Ni();
    let t = e;
    return t;
  })(),
  H3 = class {},
  S1 = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => Rp();
    let t = e;
    return t;
  })();
function Rp() {
  let t = W(),
    e = a1(),
    r = ge(e.index, t);
  return (Be(r) ? r : t)[V2];
}
var Pp = (() => {
    let e = class e {};
    e.ɵprov = H({ token: e, providedIn: 'root', factory: () => null });
    let t = e;
    return t;
  })(),
  q6 = {};
var no = new Set();
function $n(t) {
  no.has(t) ||
    (no.add(t),
    performance?.mark?.('mark_feature_usage', { detail: { feature: t } }));
}
function ro(...t) {}
function Fp() {
  let t = typeof u2.requestAnimationFrame == 'function',
    e = u2[t ? 'requestAnimationFrame' : 'setTimeout'],
    r = u2[t ? 'cancelAnimationFrame' : 'clearTimeout'];
  if (typeof Zone < 'u' && e && r) {
    let n = e[Zone.__symbol__('OriginalDelegate')];
    n && (e = n);
    let i = r[Zone.__symbol__('OriginalDelegate')];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var e2 = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new o2(!1)),
        (this.onMicrotaskEmpty = new o2(!1)),
        (this.onStable = new o2(!1)),
        (this.onError = new o2(!1)),
        typeof Zone > 'u')
      )
        throw new V(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = Fp().nativeRequestAnimationFrame),
        jp(i);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new V(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new V(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let c = this._inner,
        a = c.scheduleEventTask('NgZoneEvent: ' + i, e, Op, ro, ro);
      try {
        return c.runTask(a, r, n);
      } finally {
        c.cancelTask(a);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  Op = {};
function kc(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function Bp(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      u2,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              (t.lastRequestAnimationFrameId = -1),
                Ei(t),
                (t.isCheckStableRunning = !0),
                kc(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    Ei(t));
}
function jp(t) {
  let e = () => {
    Bp(t);
  };
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, c, a, s) => {
      if (Up(s)) return r.invokeTask(i, c, a, s);
      try {
        return io(t), r.invokeTask(i, c, a, s);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && c.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          co(t);
      }
    },
    onInvoke: (r, n, i, c, a, s, o) => {
      try {
        return io(t), r.invoke(i, c, a, s, o);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), co(t);
      }
    },
    onHasTask: (r, n, i, c) => {
      r.hasTask(i, c),
        n === i &&
          (c.change == 'microTask'
            ? ((t._hasPendingMicrotasks = c.microTask), Ei(t), kc(t))
            : c.change == 'macroTask' &&
              (t.hasPendingMacrotasks = c.macroTask));
    },
    onHandleError: (r, n, i, c) => (
      r.handleError(i, c), t.runOutsideAngular(() => t.onError.emit(c)), !1
    ),
  });
}
function Ei(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function io(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function co(t) {
  t._nesting--, kc(t);
}
var Ii = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new o2()),
      (this.onMicrotaskEmpty = new o2()),
      (this.onStable = new o2()),
      (this.onError = new o2());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function Up(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function $p(t = 'zone.js', e) {
  return t === 'noop' ? new Ii() : t === 'zone.js' ? new e2(e) : t;
}
var wt = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = 'EarlyRead'),
      (t[(t.Write = 1)] = 'Write'),
      (t[(t.MixedReadWrite = 2)] = 'MixedReadWrite'),
      (t[(t.Read = 3)] = 'Read'),
      t
    );
  })(wt || {}),
  Gp = { destroy() {} };
function _c(t, e) {
  !e && Ju(_c);
  let r = e?.injector ?? g(v1);
  if (!zh(r)) return Gp;
  $n('NgAfterNextRender');
  let n = r.get(Rc),
    i = (n.handler ??= new Ti()),
    c = e?.phase ?? wt.MixedReadWrite,
    a = () => {
      i.unregister(o), s();
    },
    s = r.get(yc).onDestroy(a),
    o = g1(
      r,
      () =>
        new Ai(c, () => {
          a(), t();
        })
    );
  return i.register(o), { destroy: a };
}
var Ai = class {
    constructor(e, r) {
      (this.phase = e),
        (this.callbackFn = r),
        (this.zone = g(e2)),
        (this.errorHandler = g(x1, { optional: !0 })),
        g(Mn, { optional: !0 })?.notify(1);
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  Ti = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [wt.EarlyRead]: new Set(),
          [wt.Write]: new Set(),
          [wt.MixedReadWrite]: new Set(),
          [wt.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  Rc = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        this.executeInternalCallbacks(), this.handler?.execute();
      }
      executeInternalCallbacks() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = H({ token: e, providedIn: 'root', factory: () => new e() });
    let t = e;
    return t;
  })();
function ki(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    c = 0;
  if (e !== null)
    for (let a = 0; a < e.length; a++) {
      let s = e[a];
      if (typeof s == 'number') c = s;
      else if (c == 1) i = Ls(i, s);
      else if (c == 2) {
        let o = s,
          l = e[++a];
        n = Ls(n, o + ': ' + l + ';');
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Vn = class extends Un {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = ue(e);
    return new At(r, this.ngModule);
  }
};
function ao(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function qp(t) {
  let e = t.toLowerCase();
  return e === 'svg' ? ad : e === 'math' ? sd : null;
}
var _i = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = En(n);
      let i = this.injector.get(e, q6, n);
      return i !== q6 || r === q6 ? i : this.parentInjector.get(e, r, n);
    }
  },
  At = class extends yn {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = ao(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return ao(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = Ru(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      let c = G(null);
      try {
        i = i || this.ngModule;
        let a = i instanceof R2 ? i : i?.injector;
        a &&
          this.componentDef.getStandaloneInjector !== null &&
          (a = this.componentDef.getStandaloneInjector(a) || a);
        let s = a ? new _i(e, a) : e,
          o = s.get(H3, null);
        if (o === null) throw new V(407, !1);
        let l = s.get(Pp, null),
          f = s.get(Rc, null),
          u = s.get(Mn, null),
          d = {
            rendererFactory: o,
            sanitizer: l,
            inlineEffectRunner: null,
            afterRenderEventManager: f,
            changeDetectionScheduler: u,
          },
          h = o.createRenderer(null, this.componentDef),
          C = this.componentDef.selectors[0][0] || 'div',
          N = n
            ? Wh(h, n, this.componentDef.encapsulation, s)
            : G8(h, C, qp(C)),
          L = 512;
        this.componentDef.signals
          ? (L |= 4096)
          : this.componentDef.onPush || (L |= 16);
        let b = null;
        N !== null && (b = zc(N, s, !0));
        let U = Nc(0, null, null, 1, 0, null, null, null, null, null, null),
          $ = Bn(null, U, null, L, null, null, d, h, s, null, b);
        hc($);
        let B, s2;
        try {
          let f2 = this.componentDef,
            E2,
            _e = null;
          f2.findHostDirectiveDefs
            ? ((E2 = []),
              (_e = new Map()),
              f2.findHostDirectiveDefs(f2, E2, _e),
              E2.push(f2))
            : (E2 = [f2]);
          let V1 = Wp($, N),
            v6 = Yp(V1, N, f2, E2, $, d, h);
          (s2 = Jo(U, i1)),
            N && Xp(h, f2, N, n),
            r !== void 0 && Kp(s2, this.ngContentSelectors, r),
            (B = Zp(v6, f2, E2, _e, $, [Jp])),
            Ic(U, $, null);
        } finally {
          pc();
        }
        return new Ri(this.componentType, B, Ft(s2, $), $, s2);
      } finally {
        G(c);
      }
    }
  },
  Ri = class extends Si {
    constructor(e, r, n, i, c) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = c),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new Ze(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let c = this._rootLView;
        Ec(c[R], c, i, e, r), this.previousInputValues.set(e, r);
        let a = ge(this._tNode.index, c);
        Ac(a);
      }
    }
    get injector() {
      return new je(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function Wp(t, e) {
  let r = t[R],
    n = i1;
  return (t[n] = e), N3(r, n, 2, '#host', null);
}
function Yp(t, e, r, n, i, c, a) {
  let s = i[R];
  Qp(n, t, e, a);
  let o = null;
  e !== null && (o = zc(e, i[Et]));
  let l = c.rendererFactory.createRenderer(e, r),
    f = 16;
  r.signals ? (f = 4096) : r.onPush && (f = 64);
  let u = Bn(i, f5(r), null, f, i[t.index], t, c, l, null, null, o);
  return (
    s.firstCreatePass && Di(s, t, n.length - 1), jn(i, u), (i[t.index] = u)
  );
}
function Qp(t, e, r, n) {
  for (let i of t) e.mergedAttrs = m3(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (ki(e, e.mergedAttrs, !0), r !== null && t5(n, r, e));
}
function Zp(t, e, r, n, i, c) {
  let a = a1(),
    s = i[R],
    o = c1(a, i);
  h5(s, i, a, r, null, n);
  for (let f = 0; f < r.length; f++) {
    let u = a.directiveStart + f,
      d = Ye(i, s, u, a);
    Qe(d, i);
  }
  p5(s, i, a), o && Qe(o, i);
  let l = Ye(i, s, a.directiveStart + a.componentOffset, a);
  if (((t[h1] = i[h1] = l), c !== null)) for (let f of c) f(l, e);
  return s5(s, a, i), l;
}
function Xp(t, e, r, n) {
  if (n) ni(t, r, ['ng-version', '17.3.0']);
  else {
    let { attrs: i, classes: c } = Pu(e.selectors[0]);
    i && ni(t, r, i), c && c.length > 0 && e5(t, r, c.join(' '));
  }
}
function Kp(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let c = r[i];
    n.push(c != null ? Array.from(c) : null);
  }
}
function Jp() {
  let t = a1();
  Cc(W()[R], t);
}
var Ce = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = em;
  let t = e;
  return t;
})();
function em() {
  let t = a1();
  return N5(t, W());
}
var tm = Ce,
  S5 = class extends tm {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return Ft(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new je(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Mc(this._hostTNode, this._hostLView);
      if (v8(e)) {
        let r = pn(e, this._hostLView),
          n = hn(e),
          i = r[R].data[n + 8];
        return new je(i, r);
      } else return new je(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = so(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - Y2;
    }
    createEmbeddedView(e, r, n) {
      let i, c;
      typeof n == 'number'
        ? (i = n)
        : n != null && ((i = n.index), (c = n.injector));
      let a = to(this._lContainer, e.ssrId),
        s = e.createEmbeddedViewImpl(r || {}, c, a);
      return this.insertImpl(s, i, eo(this._hostTNode, a)), s;
    }
    createComponent(e, r, n, i, c) {
      let a = e && !td(e),
        s;
      if (a) s = r;
      else {
        let C = r || {};
        (s = C.index),
          (n = C.injector),
          (i = C.projectableNodes),
          (c = C.environmentInjector || C.ngModuleRef);
      }
      let o = a ? e : new At(ue(e)),
        l = n || this.parentInjector;
      if (!c && o.ngModule == null) {
        let N = (a ? l : this.parentInjector).get(R2, null);
        N && (c = N);
      }
      let f = ue(o.componentType ?? {}),
        u = to(this._lContainer, f?.id ?? null),
        d = u?.firstChild ?? null,
        h = o.create(l, i, d, c);
      return this.insertImpl(h.hostView, s, eo(this._hostTNode, u)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (ud(i)) {
        let s = this.indexOf(e);
        if (s !== -1) this.detach(s);
        else {
          let o = i[S2],
            l = new S5(o, o[Z2], o[S2]);
          l.detach(l.indexOf(e));
        }
      }
      let c = this._adjustIndex(r),
        a = this._lContainer;
      return yp(a, i, c, n), e.attachToViewContainerRef(), Lo(W6(a), c, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = so(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = bi(this._lContainer, r);
      n && (ln(W6(this._lContainer), r), Y8(n[R], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = bi(this._lContainer, r);
      return n && ln(W6(this._lContainer), r) != null ? new Ze(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function so(t) {
  return t[un];
}
function W6(t) {
  return t[un] || (t[un] = []);
}
function N5(t, e) {
  let r,
    n = e[t.index];
  return (
    U1(n) ? (r = n) : ((r = m5(n, e, null, t)), (e[t.index] = r), jn(e, r)),
    rm(r, e, t, n),
    new S5(r, t, e)
  );
}
function nm(t, e) {
  let r = t[V2],
    n = r.createComment(''),
    i = c1(e, t),
    c = xc(r, i);
  return vn(r, c, n, _h(r, i), !1), n;
}
var rm = am,
  im = () => !1;
function cm(t, e, r) {
  return im(t, e, r);
}
function am(t, e, r, n) {
  if (t[Ge]) return;
  let i;
  r.type & 8 ? (i = D1(n)) : (i = nm(e, r)), (t[Ge] = i);
}
var Pi = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  Fi = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let c = 0; c < n; c++) {
          let a = r.getByIndex(c),
            s = this.queries[a.indexInDeclarationView];
          i.push(s.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    finishViewCreation(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++)
        Pc(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  Oi = class {
    constructor(e, r, n = null) {
      (this.flags = r),
        (this.read = n),
        typeof e == 'string' ? (this.predicate = pm(e)) : (this.predicate = e);
    }
  },
  Bi = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          c = this.getByIndex(n).embeddedTView(e, i);
        c &&
          ((c.indexInDeclarationView = n), r !== null ? r.push(c) : (r = [c]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  ji = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, r),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let c = n[i];
          this.matchTNodeWithReadOption(e, r, sm(r, c)),
            this.matchTNodeWithReadOption(e, r, rn(r, e, c, !1, !1));
        }
      else
        n === Xe
          ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1)
          : this.matchTNodeWithReadOption(e, r, rn(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === $2 || i === Ce || (i === Xe && r.type & 4))
            this.addMatch(r.index, -2);
          else {
            let c = rn(r, e, i, !1, !1);
            c !== null && this.addMatch(r.index, c);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function sm(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function om(t, e) {
  return t.type & 11 ? Ft(t, e) : t.type & 4 ? Tc(t, e) : null;
}
function lm(t, e, r, n) {
  return r === -1 ? om(e, t) : r === -2 ? fm(t, e, n) : Ye(t, t[R], r, e);
}
function fm(t, e, r) {
  if (r === $2) return Ft(e, t);
  if (r === Xe) return Tc(e, t);
  if (r === Ce) return N5(e, t);
}
function E5(t, e, r, n) {
  let i = e[F1].queries[n];
  if (i.matches === null) {
    let c = t.data,
      a = r.matches,
      s = [];
    for (let o = 0; a !== null && o < a.length; o += 2) {
      let l = a[o];
      if (l < 0) s.push(null);
      else {
        let f = c[l];
        s.push(lm(e, f, a[o + 1], r.metadata.read));
      }
    }
    i.matches = s;
  }
  return i.matches;
}
function Ui(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    c = i.matches;
  if (c !== null) {
    let a = E5(t, e, i, r);
    for (let s = 0; s < c.length; s += 2) {
      let o = c[s];
      if (o > 0) n.push(a[s / 2]);
      else {
        let l = c[s + 1],
          f = e[-o];
        for (let u = Y2; u < f.length; u++) {
          let d = f[u];
          d[x3] === d[S2] && Ui(d[R], d, l, n);
        }
        if (f[It] !== null) {
          let u = f[It];
          for (let d = 0; d < u.length; d++) {
            let h = u[d];
            Ui(h[R], h, l, n);
          }
        }
      }
    }
  }
  return n;
}
function um(t, e) {
  return t[F1].queries[e].queryList;
}
function dm(t, e, r) {
  let n = new pi((r & 4) === 4);
  return (
    Zh(t, e, n, n.destroy), (e[F1] ??= new Fi()).queries.push(new Pi(n)) - 1
  );
}
function hm(t, e, r) {
  let n = I2();
  return (
    n.firstCreatePass &&
      (mm(n, new Oi(t, e, r), -1), (e & 2) === 2 && (n.staticViewQueries = !0)),
    dm(n, W(), e)
  );
}
function pm(t) {
  return t.split(',').map((e) => e.trim());
}
function mm(t, e, r) {
  t.queries === null && (t.queries = new Bi()), t.queries.track(new ji(e, r));
}
function Pc(t, e) {
  return t.queries.getByIndex(e);
}
function gm(t, e) {
  let r = t[R],
    n = Pc(r, e);
  return n.crossesNgTemplate ? Ui(r, t, e, []) : E5(r, t, n, e);
}
function vm(t) {
  let e = [],
    r = new Map();
  function n(i) {
    let c = r.get(i);
    if (!c) {
      let a = t(i);
      r.set(i, (c = a.then(Vm)));
    }
    return c;
  }
  return (
    Hn.forEach((i, c) => {
      let a = [];
      i.templateUrl &&
        a.push(
          n(i.templateUrl).then((l) => {
            i.template = l;
          })
        );
      let s = typeof i.styles == 'string' ? [i.styles] : i.styles || [];
      if (((i.styles = s), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          '@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple'
        );
      if (i.styleUrls?.length) {
        let l = i.styles.length,
          f = i.styleUrls;
        i.styleUrls.forEach((u, d) => {
          s.push(''),
            a.push(
              n(u).then((h) => {
                (s[l + d] = h),
                  f.splice(f.indexOf(u), 1),
                  f.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          a.push(
            n(i.styleUrl).then((l) => {
              s.push(l), (i.styleUrl = void 0);
            })
          );
      let o = Promise.all(a).then(() => Hm(c));
      e.push(o);
    }),
    Mm(),
    Promise.all(e).then(() => {})
  );
}
var Hn = new Map(),
  Cm = new Set();
function Mm() {
  let t = Hn;
  return (Hn = new Map()), t;
}
function ym() {
  return Hn.size === 0;
}
function Vm(t) {
  return typeof t == 'string' ? t : t.text();
}
function Hm(t) {
  Cm.delete(t);
}
function zm(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function C1(t) {
  let e = zm(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (de(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new V(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let a = t;
        (a.inputs = X4(t.inputs)),
          (a.inputTransforms = X4(t.inputTransforms)),
          (a.declaredInputs = X4(t.declaredInputs)),
          (a.outputs = X4(t.outputs));
        let s = i.hostBindings;
        s && Lm(t, s);
        let o = i.viewQuery,
          l = i.contentQueries;
        if (
          (o && Dm(t, o),
          l && xm(t, l),
          bm(t, i),
          eu(t.outputs, i.outputs),
          de(i) && i.data.animation)
        ) {
          let f = t.data;
          f.animation = (f.animation || []).concat(i.data.animation);
        }
      }
      let c = i.features;
      if (c)
        for (let a = 0; a < c.length; a++) {
          let s = c[a];
          s && s.ngInherit && s(t), s === C1 && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  wm(n);
}
function bm(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function wm(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = m3(i.hostAttrs, (r = m3(r, i.hostAttrs))));
  }
}
function X4(t) {
  return t === Lt ? {} : t === r1 ? [] : t;
}
function Dm(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function xm(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, c) => {
        e(n, i, c), r(n, i, c);
      })
    : (t.contentQueries = e);
}
function Lm(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
var he = class {},
  z3 = class {};
var zn = class extends he {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new Vn(this));
      let i = Ro(e);
      (this._bootstrapComponents = $8(i.bootstrap)),
        (this._r3Injector = D8(
          e,
          r,
          [
            { provide: he, useValue: this },
            { provide: Un, useValue: this.componentFactoryResolver },
            ...n,
          ],
          _2(e),
          new Set(['environment'])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  bn = class extends z3 {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new zn(this.moduleType, e, []);
    }
  };
function Sm(t, e, r) {
  return new zn(t, e, r);
}
var $i = class extends he {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Vn(this)),
      (this.instance = null);
    let r = new g3(
      [
        ...e.providers,
        { provide: he, useValue: this },
        { provide: Un, useValue: this.componentFactoryResolver },
      ],
      e.parent || sc(),
      e.debugName,
      new Set(['environment'])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function Gn(t, e, r = null) {
  return new $i({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var tt = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new L2(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function I5(t) {
  return Em(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function Nm(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function Em(t) {
  return t !== null && (typeof t == 'function' || typeof t == 'object');
}
function A5(t, e, r) {
  return (t[e] = r);
}
function pe(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function Im(t, e, r, n) {
  let i = pe(t, e, r);
  return pe(t, e + 1, n) || i;
}
function Am(t) {
  return (t.flags & 32) === 32;
}
function Tm(t, e, r, n, i, c, a, s, o) {
  let l = e.consts,
    f = N3(e, t, 4, a || null, dn(l, s));
  d5(e, r, f, dn(l, o)), Cc(e, f);
  let u = (f.tView = Nc(
    2,
    f,
    n,
    i,
    c,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    l,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, f), (u.queries = e.queries.embeddedTView(f))),
    f
  );
}
function K(t, e, r, n, i, c, a, s) {
  let o = W(),
    l = I2(),
    f = t + i1,
    u = l.firstCreatePass ? Tm(f, l, o, e, r, n, i, c, a) : l.data[f];
  L3(u, !1);
  let d = km(l, o, u, t);
  gc() && Lc(l, o, d, u), Qe(d, o);
  let h = m5(d, o, d, u);
  return (
    (o[f] = h),
    jn(o, h),
    cm(h, u, o),
    lc(u) && o5(l, o, u),
    a != null && l5(o, u, s),
    K
  );
}
var km = _m;
function _m(t, e, r, n) {
  return vc(!0), e[V2].createComment('');
}
function E3(t, e, r, n) {
  let i = W(),
    c = Rn();
  if (pe(i, c, e)) {
    let a = I2(),
      s = mc();
    up(s, i, t, e, r, n);
  }
  return E3;
}
function Rm(t, e, r, n) {
  return pe(t, Rn(), r) ? e + Nn(r) + n : et;
}
function K4(t, e) {
  return (t << 17) | (e << 2);
}
function Ke(t) {
  return (t >> 17) & 32767;
}
function Pm(t) {
  return (t & 2) == 2;
}
function Fm(t, e) {
  return (t & 131071) | (e << 17);
}
function Gi(t) {
  return t | 2;
}
function Tt(t) {
  return (t & 131068) >> 2;
}
function Y6(t, e) {
  return (t & -131069) | (e << 2);
}
function Om(t) {
  return (t & 1) === 1;
}
function qi(t) {
  return t | 1;
}
function Bm(t, e, r, n, i, c) {
  let a = c ? e.classBindings : e.styleBindings,
    s = Ke(a),
    o = Tt(a);
  t[n] = r;
  let l = !1,
    f;
  if (Array.isArray(r)) {
    let u = r;
    (f = u[1]), (f === null || D3(u, f) > 0) && (l = !0);
  } else f = r;
  if (i)
    if (o !== 0) {
      let d = Ke(t[s + 1]);
      (t[n + 1] = K4(d, s)),
        d !== 0 && (t[d + 1] = Y6(t[d + 1], n)),
        (t[s + 1] = Fm(t[s + 1], n));
    } else
      (t[n + 1] = K4(s, 0)), s !== 0 && (t[s + 1] = Y6(t[s + 1], n)), (s = n);
  else
    (t[n + 1] = K4(o, 0)),
      s === 0 ? (s = n) : (t[o + 1] = Y6(t[o + 1], n)),
      (o = n);
  l && (t[n + 1] = Gi(t[n + 1])),
    oo(t, f, n, !0),
    oo(t, f, n, !1),
    jm(e, f, t, n, c),
    (a = K4(s, o)),
    c ? (e.classBindings = a) : (e.styleBindings = a);
}
function jm(t, e, r, n, i) {
  let c = i ? t.residualClasses : t.residualStyles;
  c != null &&
    typeof e == 'string' &&
    D3(c, e) >= 0 &&
    (r[n + 1] = qi(r[n + 1]));
}
function oo(t, e, r, n) {
  let i = t[r + 1],
    c = e === null,
    a = n ? Ke(i) : Tt(i),
    s = !1;
  for (; a !== 0 && (s === !1 || c); ) {
    let o = t[a],
      l = t[a + 1];
    Um(o, e) && ((s = !0), (t[a + 1] = n ? qi(l) : Gi(l))),
      (a = n ? Ke(l) : Tt(l));
  }
  s && (t[r + 1] = n ? Gi(i) : qi(i));
}
function Um(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
    ? D3(t, e) >= 0
    : !1;
}
function A(t, e, r) {
  let n = W(),
    i = Rn();
  if (pe(n, i, e)) {
    let c = I2(),
      a = mc();
    u5(c, a, n, t, e, n[V2], r, !1);
  }
  return A;
}
function lo(t, e, r, n, i) {
  let c = e.inputs,
    a = i ? 'class' : 'style';
  Ec(t, r, c[a], a, n);
}
function I3(t, e) {
  return $m(t, e, null, !0), I3;
}
function $m(t, e, r, n) {
  let i = W(),
    c = I2(),
    a = Hd(2);
  if ((c.firstUpdatePass && qm(c, t, a, n), e !== et && pe(i, a, e))) {
    let s = c.data[Pt()];
    Xm(c, s, i, i[V2], t, (i[a + 1] = Km(e, r)), n, a);
  }
}
function Gm(t, e) {
  return e >= t.expandoStartIndex;
}
function qm(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let c = i[Pt()],
      a = Gm(t, r);
    Jm(c, n) && e === null && !a && (e = !1),
      (e = Wm(i, c, e, n)),
      Bm(i, c, e, r, a, n);
  }
}
function Wm(t, e, r, n) {
  let i = Dd(t),
    c = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = Q6(null, t, e, r, n)), (r = b3(r, e.attrs, n)), (c = null));
  else {
    let a = e.directiveStylingLast;
    if (a === -1 || t[a] !== i)
      if (((r = Q6(i, t, e, r, n)), c === null)) {
        let o = Ym(t, e, n);
        o !== void 0 &&
          Array.isArray(o) &&
          ((o = Q6(null, t, e, o[1], n)),
          (o = b3(o, e.attrs, n)),
          Qm(t, e, n, o));
      } else c = Zm(t, e, n);
  }
  return (
    c !== void 0 && (n ? (e.residualClasses = c) : (e.residualStyles = c)), r
  );
}
function Ym(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Tt(n) !== 0) return t[Ke(n)];
}
function Qm(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[Ke(i)] = n;
}
function Zm(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let c = 1 + e.directiveStylingLast; c < i; c++) {
    let a = t[c].hostAttrs;
    n = b3(n, a, r);
  }
  return b3(n, e.attrs, r);
}
function Q6(t, e, r, n, i) {
  let c = null,
    a = r.directiveEnd,
    s = r.directiveStylingLast;
  for (
    s === -1 ? (s = r.directiveStart) : s++;
    s < a && ((c = e[s]), (n = b3(n, c.hostAttrs, i)), c !== t);

  )
    s++;
  return t !== null && (r.directiveStylingLast = s), n;
}
function b3(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let c = 0; c < e.length; c++) {
      let a = e[c];
      typeof a == 'number'
        ? (i = a)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]),
          zu(t, a, r ? !0 : e[++c]));
    }
  return t === void 0 ? null : t;
}
function Xm(t, e, r, n, i, c, a, s) {
  if (!(e.type & 3)) return;
  let o = t.data,
    l = o[s + 1],
    f = Om(l) ? fo(o, e, r, i, Tt(l), a) : void 0;
  if (!wn(f)) {
    wn(c) || (Pm(l) && (c = fo(o, null, r, i, s, a)));
    let u = Ko(Pt(), r);
    jh(n, a, u, i, c);
  }
}
function fo(t, e, r, n, i, c) {
  let a = e === null,
    s;
  for (; i > 0; ) {
    let o = t[i],
      l = Array.isArray(o),
      f = l ? o[1] : o,
      u = f === null,
      d = r[i + 1];
    d === et && (d = u ? r1 : void 0);
    let h = u ? P6(d, n) : f === n ? d : void 0;
    if ((l && !wn(h) && (h = P6(o, n)), wn(h) && ((s = h), a))) return s;
    let C = t[i + 1];
    i = a ? Ke(C) : Tt(C);
  }
  if (e !== null) {
    let o = c ? e.residualClasses : e.residualStyles;
    o != null && (s = P6(o, n));
  }
  return s;
}
function wn(t) {
  return t !== void 0;
}
function Km(t, e) {
  return (
    t == null ||
      t === '' ||
      (typeof e == 'string'
        ? (t = t + e)
        : typeof t == 'object' && (t = _2($1(t)))),
    t
  );
}
function Jm(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function eg(t, e, r, n, i, c) {
  let a = e.consts,
    s = dn(a, i),
    o = N3(e, t, 2, n, s);
  return (
    d5(e, r, o, dn(a, c)),
    o.attrs !== null && ki(o, o.attrs, !1),
    o.mergedAttrs !== null && ki(o, o.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, o),
    o
  );
}
function m(t, e, r, n) {
  let i = W(),
    c = I2(),
    a = i1 + t,
    s = i[V2],
    o = c.firstCreatePass ? eg(a, c, i, e, r, n) : c.data[a],
    l = tg(c, i, o, s, e, t);
  i[a] = l;
  let f = lc(o);
  return (
    L3(o, !0),
    t5(s, l, o),
    !Am(o) && gc() && Lc(c, i, l, o),
    md() === 0 && Qe(l, i),
    gd(),
    f && (o5(c, i, o), s5(c, o, i)),
    n !== null && l5(i, o),
    m
  );
}
function p() {
  let t = a1();
  a8() ? s8() : ((t = t.parent), L3(t, !1));
  let e = t;
  Cd(e) && Md(), vd();
  let r = I2();
  return (
    r.firstCreatePass && (Cc(r, t), Wo(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      Ad(e) &&
      lo(r, e, W(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      Td(e) &&
      lo(r, e, W(), e.stylesWithoutHost, !1),
    p
  );
}
function Z(t, e, r, n) {
  return m(t, e, r, n), p(), Z;
}
var tg = (t, e, r, n, i, c) => (vc(!0), G8(n, i, Sd()));
function A3() {
  return W();
}
function Fc(t, e, r) {
  let n = W(),
    i = Rn();
  if (pe(n, i, e)) {
    let c = I2(),
      a = mc();
    u5(c, a, n, t, e, n[V2], r, !0);
  }
  return Fc;
}
var Oe = void 0;
function ng(t) {
  let e = t,
    r = Math.floor(Math.abs(t)),
    n = t.toString().replace(/^[^.]*\.?/, '').length;
  return r === 1 && n === 0 ? 1 : 5;
}
var rg = [
    'en',
    [['a', 'p'], ['AM', 'PM'], Oe],
    [['AM', 'PM'], Oe, Oe],
    [
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    ],
    Oe,
    [
      ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    ],
    Oe,
    [
      ['B', 'A'],
      ['BC', 'AD'],
      ['Before Christ', 'Anno Domini'],
    ],
    0,
    [6, 0],
    ['M/d/yy', 'MMM d, y', 'MMMM d, y', 'EEEE, MMMM d, y'],
    ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
    ['{1}, {0}', Oe, "{1} 'at' {0}", Oe],
    ['.', ',', ';', '%', '+', '-', 'E', '\xD7', '\u2030', '\u221E', 'NaN', ':'],
    ['#,##0.###', '#,##0%', '\xA4#,##0.00', '#E0'],
    'USD',
    '$',
    'US Dollar',
    {},
    'ltr',
    ng,
  ],
  Z6 = {};
function s1(t) {
  let e = ig(t),
    r = uo(e);
  if (r) return r;
  let n = e.split('-')[0];
  if (((r = uo(n)), r)) return r;
  if (n === 'en') return rg;
  throw new V(701, !1);
}
function uo(t) {
  return (
    t in Z6 ||
      (Z6[t] =
        u2.ng &&
        u2.ng.common &&
        u2.ng.common.locales &&
        u2.ng.common.locales[t]),
    Z6[t]
  );
}
var d2 = (function (t) {
  return (
    (t[(t.LocaleId = 0)] = 'LocaleId'),
    (t[(t.DayPeriodsFormat = 1)] = 'DayPeriodsFormat'),
    (t[(t.DayPeriodsStandalone = 2)] = 'DayPeriodsStandalone'),
    (t[(t.DaysFormat = 3)] = 'DaysFormat'),
    (t[(t.DaysStandalone = 4)] = 'DaysStandalone'),
    (t[(t.MonthsFormat = 5)] = 'MonthsFormat'),
    (t[(t.MonthsStandalone = 6)] = 'MonthsStandalone'),
    (t[(t.Eras = 7)] = 'Eras'),
    (t[(t.FirstDayOfWeek = 8)] = 'FirstDayOfWeek'),
    (t[(t.WeekendRange = 9)] = 'WeekendRange'),
    (t[(t.DateFormat = 10)] = 'DateFormat'),
    (t[(t.TimeFormat = 11)] = 'TimeFormat'),
    (t[(t.DateTimeFormat = 12)] = 'DateTimeFormat'),
    (t[(t.NumberSymbols = 13)] = 'NumberSymbols'),
    (t[(t.NumberFormats = 14)] = 'NumberFormats'),
    (t[(t.CurrencyCode = 15)] = 'CurrencyCode'),
    (t[(t.CurrencySymbol = 16)] = 'CurrencySymbol'),
    (t[(t.CurrencyName = 17)] = 'CurrencyName'),
    (t[(t.Currencies = 18)] = 'Currencies'),
    (t[(t.Directionality = 19)] = 'Directionality'),
    (t[(t.PluralCase = 20)] = 'PluralCase'),
    (t[(t.ExtraData = 21)] = 'ExtraData'),
    t
  );
})(d2 || {});
function ig(t) {
  return t.toLowerCase().replace(/_/g, '-');
}
var Dn = 'en-US';
var cg = Dn;
function ag(t) {
  typeof t == 'string' && (cg = t.toLowerCase().replace(/_/g, '-'));
}
function h2(t, e, r, n) {
  let i = W(),
    c = I2(),
    a = a1();
  return og(c, i, i[V2], a, t, e, n), h2;
}
function sg(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let c = 0; c < i.length - 1; c += 2) {
      let a = i[c];
      if (a === r && i[c + 1] === n) {
        let s = e[C3],
          o = i[c + 2];
        return s.length > o ? s[o] : null;
      }
      typeof a == 'string' && (c += 2);
    }
  return null;
}
function og(t, e, r, n, i, c, a) {
  let s = lc(n),
    l = t.firstCreatePass && C5(t),
    f = e[h1],
    u = v5(e),
    d = !0;
  if (n.type & 3 || a) {
    let N = c1(n, e),
      L = a ? a(N) : N,
      b = u.length,
      U = a ? (B) => a(D1(B[n.index])) : n.index,
      $ = null;
    if ((!a && s && ($ = sg(t, e, i, n.index)), $ !== null)) {
      let B = $.__ngLastListenerFn__ || $;
      (B.__ngNextListenerFn__ = c), ($.__ngLastListenerFn__ = c), (d = !1);
    } else {
      c = po(n, e, f, c, !1);
      let B = r.listen(L, i, c);
      u.push(c, B), l && l.push(i, U, b, b + 1);
    }
  } else c = po(n, e, f, c, !1);
  let h = n.outputs,
    C;
  if (d && h !== null && (C = h[i])) {
    let N = C.length;
    if (N)
      for (let L = 0; L < N; L += 2) {
        let b = C[L],
          U = C[L + 1],
          s2 = e[b][U].subscribe(c),
          f2 = u.length;
        u.push(c, s2), l && l.push(i, n.index, f2, -(f2 + 1));
      }
  }
}
function ho(t, e, r, n) {
  let i = G(null);
  try {
    return z1(6, e, r), r(n) !== !1;
  } catch (c) {
    return M5(t, c), !1;
  } finally {
    z1(7, e, r), G(i);
  }
}
function po(t, e, r, n, i) {
  return function c(a) {
    if (a === Function) return n;
    let s = t.componentOffset > -1 ? ge(t.index, e) : e;
    Ac(s);
    let o = ho(e, r, n, a),
      l = c.__ngNextListenerFn__;
    for (; l; ) (o = ho(e, r, l, a) && o), (l = l.__ngNextListenerFn__);
    return i && o === !1 && a.preventDefault(), o;
  };
}
function D2(t = 1) {
  return Ld(t);
}
function lg(t, e) {
  let r = null,
    n = Iu(t);
  for (let i = 0; i < e.length; i++) {
    let c = e[i];
    if (c === '*') {
      r = i;
      continue;
    }
    if (n === null ? Ao(t, c, !0) : ku(n, c)) return i;
  }
  return r;
}
function T5(t) {
  let e = W()[m1][Z2];
  if (!e.projection) {
    let r = t ? t.length : 1,
      n = (e.projection = Vu(r, null)),
      i = n.slice(),
      c = e.child;
    for (; c !== null; ) {
      let a = t ? lg(c, t) : 0;
      a !== null && (i[a] ? (i[a].projectionNext = c) : (n[a] = c), (i[a] = c)),
        (c = c.next);
    }
  }
}
function k5(t, e = 0, r) {
  let n = W(),
    i = I2(),
    c = N3(i, i1 + t, 16, null, r || null);
  c.projection === null && (c.projection = e),
    s8(),
    (!n[v3] || i8()) && (c.flags & 32) !== 32 && Oh(i, n, c);
}
function _5(t, e, r) {
  hm(t, e, r);
}
function Oc(t) {
  let e = W(),
    r = I2(),
    n = l8();
  dc(n + 1);
  let i = Pc(r, n);
  if (t.dirty && fd(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let c = gm(e, n);
      t.reset(c, qd), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Bc() {
  return um(W(), l8());
}
function fg(t, e, r, n) {
  r >= t.data.length && ((t.data[r] = null), (t.blueprint[r] = null)),
    (e[r] = n);
}
function v(t, e = '') {
  let r = W(),
    n = I2(),
    i = t + i1,
    c = n.firstCreatePass ? N3(n, i, 1, e, null) : n.data[i],
    a = ug(n, r, c, e, t);
  (r[i] = a), gc() && Lc(n, r, a, c), L3(c, !1);
}
var ug = (t, e, r, n, i) => (vc(!0), wh(e[V2], n));
function G2(t) {
  return R5('', t, ''), G2;
}
function R5(t, e, r) {
  let n = W(),
    i = Rm(n, t, e, r);
  return i !== et && mp(n, Pt(), i), R5;
}
function dg(t, e, r) {
  let n = I2();
  if (n.firstCreatePass) {
    let i = de(t);
    Wi(r, n.data, n.blueprint, i, !0), Wi(e, n.data, n.blueprint, i, !1);
  }
}
function Wi(t, e, r, n, i) {
  if (((t = k2(t)), Array.isArray(t)))
    for (let c = 0; c < t.length; c++) Wi(t[c], e, r, n, i);
  else {
    let c = I2(),
      a = W(),
      s = a1(),
      o = Nt(t) ? t : k2(t.provide),
      l = Uo(t),
      f = s.providerIndexes & 1048575,
      u = s.directiveStart,
      d = s.providerIndexes >> 20;
    if (Nt(t) || !t.multi) {
      let h = new We(l, i, z),
        C = K6(o, e, i ? f : f + d, u);
      C === -1
        ? (fi(gn(s, a), c, o),
          X6(c, t, e.length),
          e.push(o),
          s.directiveStart++,
          s.directiveEnd++,
          i && (s.providerIndexes += 1048576),
          r.push(h),
          a.push(h))
        : ((r[C] = h), (a[C] = h));
    } else {
      let h = K6(o, e, f + d, u),
        C = K6(o, e, f, f + d),
        N = h >= 0 && r[h],
        L = C >= 0 && r[C];
      if ((i && !L) || (!i && !N)) {
        fi(gn(s, a), c, o);
        let b = mg(i ? pg : hg, r.length, i, n, l);
        !i && L && (r[C].providerFactory = b),
          X6(c, t, e.length, 0),
          e.push(o),
          s.directiveStart++,
          s.directiveEnd++,
          i && (s.providerIndexes += 1048576),
          r.push(b),
          a.push(b);
      } else {
        let b = P5(r[i ? C : h], l, !i && n);
        X6(c, t, h > -1 ? h : C, b);
      }
      !i && n && L && r[C].componentProviders++;
    }
  }
}
function X6(t, e, r, n) {
  let i = Nt(e),
    c = qu(e);
  if (i || c) {
    let o = (c ? k2(e.useClass) : e).prototype.ngOnDestroy;
    if (o) {
      let l = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let f = l.indexOf(r);
        f === -1 ? l.push(r, [n, o]) : l[f + 1].push(n, o);
      } else l.push(r, o);
    }
  }
}
function P5(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function K6(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function hg(t, e, r, n) {
  return Yi(this.multi, []);
}
function pg(t, e, r, n) {
  let i = this.multi,
    c;
  if (this.providerFactory) {
    let a = this.providerFactory.componentProviders,
      s = Ye(r, r[R], this.providerFactory.index, n);
    (c = s.slice(0, a)), Yi(i, c);
    for (let o = a; o < s.length; o++) c.push(s[o]);
  } else (c = []), Yi(i, c);
  return c;
}
function Yi(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function mg(t, e, r, n, i) {
  let c = new We(t, r, z);
  return (
    (c.multi = []),
    (c.index = e),
    (c.componentProviders = 0),
    P5(c, i, n && !r),
    c
  );
}
function Ot(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => dg(n, i ? i(t) : t, e);
  };
}
var gg = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = Oo(!1, n.type),
          c =
            i.length > 0
              ? Gn([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, c);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = H({
    token: e,
    providedIn: 'environment',
    factory: () => new e(D(R2)),
  });
  let t = e;
  return t;
})();
function T3(t) {
  $n('NgStandalone'),
    (t.getStandaloneInjector = (e) =>
      e.get(gg).getOrCreateStandaloneInjector(t));
}
function F5(t, e) {
  let r = t[e];
  return r === et ? void 0 : r;
}
function vg(t, e, r, n, i, c) {
  let a = e + r;
  return pe(t, a, i) ? A5(t, a + 1, c ? n.call(c, i) : n(i)) : F5(t, a + 1);
}
function Cg(t, e, r, n, i, c, a) {
  let s = e + r;
  return Im(t, s, i, c)
    ? A5(t, s + 2, a ? n.call(a, i, c) : n(i, c))
    : F5(t, s + 2);
}
function jc(t, e) {
  let r = I2(),
    n,
    i = t + i1;
  r.firstCreatePass
    ? ((n = Mg(e, r.pipeRegistry)),
      (r.data[i] = n),
      n.onDestroy && (r.destroyHooks ??= []).push(i, n.onDestroy))
    : (n = r.data[i]);
  let c = n.factory || (n.factory = Ue(n.type, !0)),
    a,
    s = U2(z);
  try {
    let o = mn(!1),
      l = c();
    return mn(o), fg(r, W(), i, l), l;
  } finally {
    U2(s);
  }
}
function Mg(t, e) {
  if (e)
    for (let r = e.length - 1; r >= 0; r--) {
      let n = e[r];
      if (t === n.name) return n;
    }
}
function O5(t, e, r) {
  let n = t + i1,
    i = W(),
    c = e8(i, n);
  return j5(i, n) ? vg(i, o8(), e, c.transform, r, c) : c.transform(r);
}
function B5(t, e, r, n) {
  let i = t + i1,
    c = W(),
    a = e8(c, i);
  return j5(c, i) ? Cg(c, o8(), e, a.transform, r, n, a) : a.transform(r, n);
}
function j5(t, e) {
  return t[R].data[e].pure;
}
var J4 = null;
function yg(t) {
  (J4 !== null &&
    (t.defaultEncapsulation !== J4.defaultEncapsulation ||
      t.preserveWhitespaces !== J4.preserveWhitespaces)) ||
    (J4 = t);
}
var qn = (() => {
  let e = class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'platform' }));
  let t = e;
  return t;
})();
var Uc = new w(''),
  k3 = new w(''),
  Wn = (() => {
    let e = class e {
      constructor(n, i, c) {
        (this._ngZone = n),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          $c || (Vg(c), c.addToWindow(i)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > 'u' ? null : Zone.current.get('TaskTrackingZone');
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                e2.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error('pending async requests below zero');
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(n) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, i, c) {
        let a = -1;
        i &&
          i > 0 &&
          (a = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (s) => s.timeoutId !== a
            )),
              n();
          }, i)),
          this._callbacks.push({ doneCb: n, timeoutId: a, updateCb: c });
      }
      whenStable(n, i, c) {
        if (c && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, i, c), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, i, c) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(e2), D(Yn), D(k3));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Yn = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, i) {
        this._applications.set(n, i);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, i = !0) {
        return $c?.findTestabilityInTree(this, n, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'platform' }));
    let t = e;
    return t;
  })();
function Vg(t) {
  $c = t;
}
var $c;
function Me(t) {
  return !!t && typeof t.then == 'function';
}
function Gc(t) {
  return !!t && typeof t.subscribe == 'function';
}
var Qn = new w(''),
  U5 = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = g(Qn, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let c of this.appInits) {
          let a = c();
          if (Me(a)) n.push(a);
          else if (Gc(a)) {
            let s = new Promise((o, l) => {
              a.subscribe({ complete: o, error: l });
            });
            n.push(s);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((c) => {
            this.reject(c);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Zn = new w('');
function Hg() {
  rs(() => {
    throw new V(600, !1);
  });
}
function zg(t) {
  return t.isBoundToModule;
}
function bg(t, e, r) {
  try {
    let n = r();
    return Me(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function $5(t, e) {
  return Array.isArray(e) ? e.reduce($5, t) : M(M({}, t), e);
}
var nt = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = g(x8)),
        (this.afterRenderEffectManager = g(Rc)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new T2()),
        (this.afterTick = new T2()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = g(tt).hasPendingTasks.pipe(k((n) => !n))),
        (this._injector = g(R2));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let c = n instanceof yn;
      if (!this._injector.get(U5).done) {
        let h = !c && _o(n),
          C = !1;
        throw new V(405, C);
      }
      let s;
      c ? (s = n) : (s = this._injector.get(Un).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let o = zg(s) ? void 0 : this._injector.get(he),
        l = i || s.selector,
        f = s.create(v1.NULL, [], l, o),
        u = f.location.nativeElement,
        d = f.injector.get(Uc, null);
      return (
        d?.registerApplication(u),
        f.onDestroy(() => {
          this.detachView(f.hostView),
            an(this.components, f),
            d?.unregisterApplication(u);
        }),
        this._loadComponent(f),
        f
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(n) {
      if (this._runningTick) throw new V(101, !1);
      let i = G(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(n);
      } catch (c) {
        this.internalErrorHandler(c);
      } finally {
        this.afterTick.next(), (this._runningTick = !1), G(i);
      }
    }
    detectChangesInAttachedViews(n) {
      let i = 0,
        c = this.afterRenderEffectManager;
      for (;;) {
        if (i === b5) throw new V(103, !1);
        if (n) {
          let a = i === 0;
          this.beforeRender.next(a);
          for (let { _lView: s, notifyErrorHandler: o } of this._views)
            wg(s, a, o);
        }
        if (
          (i++,
          c.executeInternalCallbacks(),
          ![...this.externalTestViews.keys(), ...this._views].some(
            ({ _lView: a }) => Qi(a)
          ) &&
            (c.execute(),
            ![...this.externalTestViews.keys(), ...this._views].some(
              ({ _lView: a }) => Qi(a)
            )))
        )
          break;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      an(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(Zn, []);
      [...this._bootstrapListeners, ...i].forEach((c) => c(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => an(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new V(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function an(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function wg(t, e, r) {
  (!e && !Qi(t)) || Dg(t, r, e);
}
function Qi(t) {
  return uc(t);
}
function Dg(t, e, r) {
  let n;
  r ? ((n = 0), (t[I] |= 1024)) : t[I] & 64 ? (n = 0) : (n = 1), w5(t, e, n);
}
var Zi = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  Xn = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new bn(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          c = Ro(n),
          a = $8(c.declarations).reduce((s, o) => {
            let l = ue(o);
            return l && s.push(new At(l)), s;
          }, []);
        return new Zi(i, a);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  xg = new w('');
function Lg(t, e, r) {
  let n = new bn(r);
  return Promise.resolve(n);
}
function mo(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
var Sg = (() => {
  let e = class e {
    constructor() {
      (this.zone = g(e2)), (this.applicationRef = g(nt));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function Ng(t) {
  return [
    { provide: e2, useFactory: t },
    {
      provide: St,
      multi: !0,
      useFactory: () => {
        let e = g(Sg, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: St,
      multi: !0,
      useFactory: () => {
        let e = g(Ag);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: x8, useFactory: Eg },
  ];
}
function Eg() {
  let t = g(e2),
    e = g(x1);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function Ig(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var Ag = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new y2()),
        (this.initialized = !1),
        (this.zone = g(e2)),
        (this.pendingTasks = g(tt));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              e2.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            e2.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function Tg() {
  return (typeof $localize < 'u' && $localize.locale) || Dn;
}
var Kn = new w('', {
  providedIn: 'root',
  factory: () => g(Kn, P.Optional | P.SkipSelf) || Tg(),
});
var G5 = new w(''),
  q5 = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, i) {
        let c = $p(
          i?.ngZone,
          Ig({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return c.run(() => {
          let a = Sm(
              n.moduleType,
              this.injector,
              Ng(() => c)
            ),
            s = a.injector.get(x1, null);
          return (
            c.runOutsideAngular(() => {
              let o = c.onError.subscribe({
                next: (l) => {
                  s.handleError(l);
                },
              });
              a.onDestroy(() => {
                an(this._modules, a), o.unsubscribe();
              });
            }),
            bg(s, c, () => {
              let o = a.injector.get(U5);
              return (
                o.runInitializers(),
                o.donePromise.then(() => {
                  let l = a.injector.get(Kn, Dn);
                  return ag(l || Dn), this._moduleDoBootstrap(a), a;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, i = []) {
        let c = $5({}, i);
        return Lg(this.injector, c, n).then((a) =>
          this.bootstrapModuleFactory(a, c)
        );
      }
      _moduleDoBootstrap(n) {
        let i = n.injector.get(nt);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((c) => i.bootstrap(c));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(i);
        else throw new V(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new V(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let n = this._injector.get(G5, null);
        n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(v1));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'platform' }));
    let t = e;
    return t;
  })(),
  h3 = null,
  W5 = new w('');
function kg(t) {
  if (h3 && !h3.get(W5, !1)) throw new V(400, !1);
  Hg(), (h3 = t);
  let e = t.get(q5);
  return Pg(t), e;
}
function qc(t, e, r = []) {
  let n = `Platform: ${e}`,
    i = new w(n);
  return (c = []) => {
    let a = Y5();
    if (!a || a.injector.get(W5, !1)) {
      let s = [...r, ...c, { provide: i, useValue: !0 }];
      t ? t(s) : kg(_g(s, n));
    }
    return Rg(i);
  };
}
function _g(t = [], e) {
  return v1.create({
    name: e,
    providers: [
      { provide: Tn, useValue: 'platform' },
      { provide: G5, useValue: new Set([() => (h3 = null)]) },
      ...t,
    ],
  });
}
function Rg(t) {
  let e = Y5();
  if (!e) throw new V(401, !1);
  return e;
}
function Y5() {
  return h3?.get(q5) ?? null;
}
function Pg(t) {
  t.get(Vc, null)?.forEach((r) => r());
}
var rt = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = Fg;
  let t = e;
  return t;
})();
function Fg(t) {
  return Og(a1(), W(), (t & 16) === 16);
}
function Og(t, e, r) {
  if (_n(t) && !r) {
    let n = ge(t.index, e);
    return new Ze(n, n);
  } else if (t.type & 47) {
    let n = e[m1];
    return new Ze(n, e);
  }
  return null;
}
var Xi = class {
    constructor() {}
    supports(e) {
      return I5(e);
    }
    create(e) {
      return new Ki(e);
    }
  },
  Bg = (t, e) => e,
  Ki = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || Bg);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        c = null;
      for (; r || n; ) {
        let a = !n || (r && r.currentIndex < go(n, i, c)) ? r : n,
          s = go(a, i, c),
          o = a.currentIndex;
        if (a === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), a.previousIndex == null)) i++;
        else {
          c || (c = []);
          let l = s - i,
            f = o - i;
          if (l != f) {
            for (let d = 0; d < l; d++) {
              let h = d < c.length ? c[d] : (c[d] = 0),
                C = h + d;
              f <= C && C < l && (c[d] = h + 1);
            }
            let u = a.previousIndex;
            c[u] = f - l;
          }
        }
        s !== o && e(a, s, o);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !I5(e))) throw new V(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        c,
        a;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let s = 0; s < this.length; s++)
          (c = e[s]),
            (a = this._trackByFn(s, c)),
            r === null || !Object.is(r.trackById, a)
              ? ((r = this._mismatch(r, c, a, s)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, c, a, s)),
                Object.is(r.item, c) || this._addIdentityChange(r, c)),
            (r = r._next);
      } else
        (i = 0),
          Nm(e, (s) => {
            (a = this._trackByFn(i, s)),
              r === null || !Object.is(r.trackById, a)
                ? ((r = this._mismatch(r, s, a, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, s, a, i)),
                  Object.is(r.item, s) || this._addIdentityChange(r, s)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let c;
      return (
        e === null ? (c = this._itTail) : ((c = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, c, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, c, i))
              : (e = this._addAfter(new Ji(r, n), c, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let c =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        c !== null
          ? (e = this._reinsertAfter(c, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        c = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = c) : (i._nextRemoved = c),
        c === null ? (this._removalsTail = i) : (c._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new xn()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new xn()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  Ji = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  ec = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  xn = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new ec()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function go(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function vo() {
  return new Wc([new Xi()]);
}
var Wc = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let c = i.factories.slice();
        n = n.concat(c);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || vo()),
        deps: [[e, new nc(), new In()]],
      };
    }
    find(n) {
      let i = this.factories.find((c) => c.supports(n));
      if (i != null) return i;
      throw new V(901, !1);
    }
  };
  e.ɵprov = H({ token: e, providedIn: 'root', factory: vo });
  let t = e;
  return t;
})();
var Q5 = qc(null, 'core', []),
  Z5 = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(nt));
    }),
      (e.ɵmod = w2({ type: e })),
      (e.ɵinj = b2({}));
    let t = e;
    return t;
  })();
function Yc(t) {
  let e = G(null);
  try {
    return t();
  } finally {
    G(e);
  }
}
function X5(t) {
  let e = ue(t);
  if (!e) return null;
  let r = new At(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var i7 = null;
function N1() {
  return i7;
}
function c7(t) {
  i7 ??= t;
}
var sr = class {};
var N2 = new w(''),
  c0 = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error('');
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => g($g), providedIn: 'platform' }));
    let t = e;
    return t;
  })(),
  a7 = new w(''),
  $g = (() => {
    let e = class e extends c0 {
      constructor() {
        super(),
          (this._doc = g(N2)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return N1().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = N1().getGlobalEventTarget(this._doc, 'window');
        return (
          i.addEventListener('popstate', n, !1),
          () => i.removeEventListener('popstate', n)
        );
      }
      onHashChange(n) {
        let i = N1().getGlobalEventTarget(this._doc, 'window');
        return (
          i.addEventListener('hashchange', n, !1),
          () => i.removeEventListener('hashchange', n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, c) {
        this._history.pushState(n, i, c);
      }
      replaceState(n, i, c) {
        this._history.replaceState(n, i, c);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({
        token: e,
        factory: () => new e(),
        providedIn: 'platform',
      }));
    let t = e;
    return t;
  })();
function a0(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith('/') && r++,
    e.startsWith('/') && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + '/' + e
  );
}
function K5(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === '/' ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function Y1(t) {
  return t && t[0] !== '?' ? '?' + t : t;
}
var it = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error('');
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => g(s0), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  s7 = new w(''),
  s0 = (() => {
    let e = class e extends it {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            g(N2).location?.origin ??
            '');
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return a0(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + Y1(this._platformLocation.search),
          c = this._platformLocation.hash;
        return c && n ? `${i}${c}` : i;
      }
      pushState(n, i, c, a) {
        let s = this.prepareExternalUrl(c + Y1(a));
        this._platformLocation.pushState(n, i, s);
      }
      replaceState(n, i, c, a) {
        let s = this.prepareExternalUrl(c + Y1(a));
        this._platformLocation.replaceState(n, i, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(c0), D(s7, 8));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  o7 = (() => {
    let e = class e extends it {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ''),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash ?? '#';
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = a0(this._baseHref, n);
        return i.length > 0 ? '#' + i : i;
      }
      pushState(n, i, c, a) {
        let s = this.prepareExternalUrl(c + Y1(a));
        s.length == 0 && (s = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, s);
      }
      replaceState(n, i, c, a) {
        let s = this.prepareExternalUrl(c + Y1(a));
        s.length == 0 && (s = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(c0), D(s7, 8));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  jt = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new o2()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = Wg(K5(J5(i)))),
          this._locationStrategy.onPopState((c) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: c.state,
              type: c.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = '') {
        return this.path() == this.normalize(n + Y1(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(qg(this._basePath, J5(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== '/' && (n = '/' + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = '', c = null) {
        this._locationStrategy.pushState(c, '', n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Y1(i)), c);
      }
      replaceState(n, i = '', c = null) {
        this._locationStrategy.replaceState(c, '', n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Y1(i)), c);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = '', i) {
        this._urlChangeListeners.forEach((c) => c(n, i));
      }
      subscribe(n, i, c) {
        return this._subject.subscribe({ next: n, error: i, complete: c });
      }
    };
    (e.normalizeQueryParams = Y1),
      (e.joinWithSlash = a0),
      (e.stripTrailingSlash = K5),
      (e.ɵfac = function (i) {
        return new (i || e)(D(it));
      }),
      (e.ɵprov = H({ token: e, factory: () => Gg(), providedIn: 'root' }));
    let t = e;
    return t;
  })();
function Gg() {
  return new jt(D(it));
}
function qg(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === '' || ['/', ';', '?', '#'].includes(r[0]) ? r : e;
}
function J5(t) {
  return t.replace(/\/index.html$/, '');
}
function Wg(t) {
  if (new RegExp('^(https?:)?//').test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
var P2 = (function (t) {
    return (
      (t[(t.Format = 0)] = 'Format'), (t[(t.Standalone = 1)] = 'Standalone'), t
    );
  })(P2 || {}),
  n2 = (function (t) {
    return (
      (t[(t.Narrow = 0)] = 'Narrow'),
      (t[(t.Abbreviated = 1)] = 'Abbreviated'),
      (t[(t.Wide = 2)] = 'Wide'),
      (t[(t.Short = 3)] = 'Short'),
      t
    );
  })(n2 || {}),
  K2 = (function (t) {
    return (
      (t[(t.Short = 0)] = 'Short'),
      (t[(t.Medium = 1)] = 'Medium'),
      (t[(t.Long = 2)] = 'Long'),
      (t[(t.Full = 3)] = 'Full'),
      t
    );
  })(K2 || {}),
  ye = {
    Decimal: 0,
    Group: 1,
    List: 2,
    PercentSign: 3,
    PlusSign: 4,
    MinusSign: 5,
    Exponential: 6,
    SuperscriptingExponent: 7,
    PerMille: 8,
    Infinity: 9,
    NaN: 10,
    TimeSeparator: 11,
    CurrencyDecimal: 12,
    CurrencyGroup: 13,
  };
function Yg(t) {
  return s1(t)[d2.LocaleId];
}
function Qg(t, e, r) {
  let n = s1(t),
    i = [n[d2.DayPeriodsFormat], n[d2.DayPeriodsStandalone]],
    c = o1(i, e);
  return o1(c, r);
}
function Zg(t, e, r) {
  let n = s1(t),
    i = [n[d2.DaysFormat], n[d2.DaysStandalone]],
    c = o1(i, e);
  return o1(c, r);
}
function Xg(t, e, r) {
  let n = s1(t),
    i = [n[d2.MonthsFormat], n[d2.MonthsStandalone]],
    c = o1(i, e);
  return o1(c, r);
}
function Kg(t, e) {
  let n = s1(t)[d2.Eras];
  return o1(n, e);
}
function Jn(t, e) {
  let r = s1(t);
  return o1(r[d2.DateFormat], e);
}
function er(t, e) {
  let r = s1(t);
  return o1(r[d2.TimeFormat], e);
}
function tr(t, e) {
  let n = s1(t)[d2.DateTimeFormat];
  return o1(n, e);
}
function lr(t, e) {
  let r = s1(t),
    n = r[d2.NumberSymbols][e];
  if (typeof n > 'u') {
    if (e === ye.CurrencyDecimal) return r[d2.NumberSymbols][ye.Decimal];
    if (e === ye.CurrencyGroup) return r[d2.NumberSymbols][ye.Group];
  }
  return n;
}
function l7(t) {
  if (!t[d2.ExtraData])
    throw new Error(
      `Missing extra locale data for the locale "${
        t[d2.LocaleId]
      }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
    );
}
function Jg(t) {
  let e = s1(t);
  return (
    l7(e),
    (e[d2.ExtraData][2] || []).map((n) =>
      typeof n == 'string' ? Qc(n) : [Qc(n[0]), Qc(n[1])]
    )
  );
}
function ev(t, e, r) {
  let n = s1(t);
  l7(n);
  let i = [n[d2.ExtraData][0], n[d2.ExtraData][1]],
    c = o1(i, e) || [];
  return o1(c, r) || [];
}
function o1(t, e) {
  for (let r = e; r > -1; r--) if (typeof t[r] < 'u') return t[r];
  throw new Error('Locale data API: locale data undefined');
}
function Qc(t) {
  let [e, r] = t.split(':');
  return { hours: +e, minutes: +r };
}
var tv =
    /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
  nr = {},
  nv =
    /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/,
  Q1 = (function (t) {
    return (
      (t[(t.Short = 0)] = 'Short'),
      (t[(t.ShortGMT = 1)] = 'ShortGMT'),
      (t[(t.Long = 2)] = 'Long'),
      (t[(t.Extended = 3)] = 'Extended'),
      t
    );
  })(Q1 || {}),
  Q = (function (t) {
    return (
      (t[(t.FullYear = 0)] = 'FullYear'),
      (t[(t.Month = 1)] = 'Month'),
      (t[(t.Date = 2)] = 'Date'),
      (t[(t.Hours = 3)] = 'Hours'),
      (t[(t.Minutes = 4)] = 'Minutes'),
      (t[(t.Seconds = 5)] = 'Seconds'),
      (t[(t.FractionalSeconds = 6)] = 'FractionalSeconds'),
      (t[(t.Day = 7)] = 'Day'),
      t
    );
  })(Q || {}),
  Y = (function (t) {
    return (
      (t[(t.DayPeriods = 0)] = 'DayPeriods'),
      (t[(t.Days = 1)] = 'Days'),
      (t[(t.Months = 2)] = 'Months'),
      (t[(t.Eras = 3)] = 'Eras'),
      t
    );
  })(Y || {});
function rv(t, e, r, n) {
  let i = dv(t);
  e = W1(r, e) || e;
  let a = [],
    s;
  for (; e; )
    if (((s = nv.exec(e)), s)) {
      a = a.concat(s.slice(1));
      let f = a.pop();
      if (!f) break;
      e = f;
    } else {
      a.push(e);
      break;
    }
  let o = i.getTimezoneOffset();
  n && ((o = u7(n, o)), (i = uv(i, n, !0)));
  let l = '';
  return (
    a.forEach((f) => {
      let u = lv(f);
      l += u
        ? u(i, r, o)
        : f === "''"
        ? "'"
        : f.replace(/(^'|'$)/g, '').replace(/''/g, "'");
    }),
    l
  );
}
function or(t, e, r) {
  let n = new Date(0);
  return n.setFullYear(t, e, r), n.setHours(0, 0, 0), n;
}
function W1(t, e) {
  let r = Yg(t);
  if (((nr[r] ??= {}), nr[r][e])) return nr[r][e];
  let n = '';
  switch (e) {
    case 'shortDate':
      n = Jn(t, K2.Short);
      break;
    case 'mediumDate':
      n = Jn(t, K2.Medium);
      break;
    case 'longDate':
      n = Jn(t, K2.Long);
      break;
    case 'fullDate':
      n = Jn(t, K2.Full);
      break;
    case 'shortTime':
      n = er(t, K2.Short);
      break;
    case 'mediumTime':
      n = er(t, K2.Medium);
      break;
    case 'longTime':
      n = er(t, K2.Long);
      break;
    case 'fullTime':
      n = er(t, K2.Full);
      break;
    case 'short':
      let i = W1(t, 'shortTime'),
        c = W1(t, 'shortDate');
      n = rr(tr(t, K2.Short), [i, c]);
      break;
    case 'medium':
      let a = W1(t, 'mediumTime'),
        s = W1(t, 'mediumDate');
      n = rr(tr(t, K2.Medium), [a, s]);
      break;
    case 'long':
      let o = W1(t, 'longTime'),
        l = W1(t, 'longDate');
      n = rr(tr(t, K2.Long), [o, l]);
      break;
    case 'full':
      let f = W1(t, 'fullTime'),
        u = W1(t, 'fullDate');
      n = rr(tr(t, K2.Full), [f, u]);
      break;
  }
  return n && (nr[r][e] = n), n;
}
function rr(t, e) {
  return (
    e &&
      (t = t.replace(/\{([^}]+)}/g, function (r, n) {
        return e != null && n in e ? e[n] : r;
      })),
    t
  );
}
function M1(t, e, r = '-', n, i) {
  let c = '';
  (t < 0 || (i && t <= 0)) && (i ? (t = -t + 1) : ((t = -t), (c = r)));
  let a = String(t);
  for (; a.length < e; ) a = '0' + a;
  return n && (a = a.slice(a.length - e)), c + a;
}
function iv(t, e) {
  return M1(t, 3).substring(0, e);
}
function C2(t, e, r = 0, n = !1, i = !1) {
  return function (c, a) {
    let s = cv(t, c);
    if (((r > 0 || s > -r) && (s += r), t === Q.Hours))
      s === 0 && r === -12 && (s = 12);
    else if (t === Q.FractionalSeconds) return iv(s, e);
    let o = lr(a, ye.MinusSign);
    return M1(s, e, o, n, i);
  };
}
function cv(t, e) {
  switch (t) {
    case Q.FullYear:
      return e.getFullYear();
    case Q.Month:
      return e.getMonth();
    case Q.Date:
      return e.getDate();
    case Q.Hours:
      return e.getHours();
    case Q.Minutes:
      return e.getMinutes();
    case Q.Seconds:
      return e.getSeconds();
    case Q.FractionalSeconds:
      return e.getMilliseconds();
    case Q.Day:
      return e.getDay();
    default:
      throw new Error(`Unknown DateType value "${t}".`);
  }
}
function r2(t, e, r = P2.Format, n = !1) {
  return function (i, c) {
    return av(i, c, t, e, r, n);
  };
}
function av(t, e, r, n, i, c) {
  switch (r) {
    case Y.Months:
      return Xg(e, i, n)[t.getMonth()];
    case Y.Days:
      return Zg(e, i, n)[t.getDay()];
    case Y.DayPeriods:
      let a = t.getHours(),
        s = t.getMinutes();
      if (c) {
        let l = Jg(e),
          f = ev(e, i, n),
          u = l.findIndex((d) => {
            if (Array.isArray(d)) {
              let [h, C] = d,
                N = a >= h.hours && s >= h.minutes,
                L = a < C.hours || (a === C.hours && s < C.minutes);
              if (h.hours < C.hours) {
                if (N && L) return !0;
              } else if (N || L) return !0;
            } else if (d.hours === a && d.minutes === s) return !0;
            return !1;
          });
        if (u !== -1) return f[u];
      }
      return Qg(e, i, n)[a < 12 ? 0 : 1];
    case Y.Eras:
      return Kg(e, n)[t.getFullYear() <= 0 ? 0 : 1];
    default:
      let o = r;
      throw new Error(`unexpected translation type ${o}`);
  }
}
function ir(t) {
  return function (e, r, n) {
    let i = -1 * n,
      c = lr(r, ye.MinusSign),
      a = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
    switch (t) {
      case Q1.Short:
        return (i >= 0 ? '+' : '') + M1(a, 2, c) + M1(Math.abs(i % 60), 2, c);
      case Q1.ShortGMT:
        return 'GMT' + (i >= 0 ? '+' : '') + M1(a, 1, c);
      case Q1.Long:
        return (
          'GMT' +
          (i >= 0 ? '+' : '') +
          M1(a, 2, c) +
          ':' +
          M1(Math.abs(i % 60), 2, c)
        );
      case Q1.Extended:
        return n === 0
          ? 'Z'
          : (i >= 0 ? '+' : '') +
              M1(a, 2, c) +
              ':' +
              M1(Math.abs(i % 60), 2, c);
      default:
        throw new Error(`Unknown zone width "${t}"`);
    }
  };
}
var sv = 0,
  ar = 4;
function ov(t) {
  let e = or(t, sv, 1).getDay();
  return or(t, 0, 1 + (e <= ar ? ar : ar + 7) - e);
}
function f7(t) {
  let e = t.getDay(),
    r = e === 0 ? -3 : ar - e;
  return or(t.getFullYear(), t.getMonth(), t.getDate() + r);
}
function Zc(t, e = !1) {
  return function (r, n) {
    let i;
    if (e) {
      let c = new Date(r.getFullYear(), r.getMonth(), 1).getDay() - 1,
        a = r.getDate();
      i = 1 + Math.floor((a + c) / 7);
    } else {
      let c = f7(r),
        a = ov(c.getFullYear()),
        s = c.getTime() - a.getTime();
      i = 1 + Math.round(s / 6048e5);
    }
    return M1(i, t, lr(n, ye.MinusSign));
  };
}
function cr(t, e = !1) {
  return function (r, n) {
    let c = f7(r).getFullYear();
    return M1(c, t, lr(n, ye.MinusSign), e);
  };
}
var Xc = {};
function lv(t) {
  if (Xc[t]) return Xc[t];
  let e;
  switch (t) {
    case 'G':
    case 'GG':
    case 'GGG':
      e = r2(Y.Eras, n2.Abbreviated);
      break;
    case 'GGGG':
      e = r2(Y.Eras, n2.Wide);
      break;
    case 'GGGGG':
      e = r2(Y.Eras, n2.Narrow);
      break;
    case 'y':
      e = C2(Q.FullYear, 1, 0, !1, !0);
      break;
    case 'yy':
      e = C2(Q.FullYear, 2, 0, !0, !0);
      break;
    case 'yyy':
      e = C2(Q.FullYear, 3, 0, !1, !0);
      break;
    case 'yyyy':
      e = C2(Q.FullYear, 4, 0, !1, !0);
      break;
    case 'Y':
      e = cr(1);
      break;
    case 'YY':
      e = cr(2, !0);
      break;
    case 'YYY':
      e = cr(3);
      break;
    case 'YYYY':
      e = cr(4);
      break;
    case 'M':
    case 'L':
      e = C2(Q.Month, 1, 1);
      break;
    case 'MM':
    case 'LL':
      e = C2(Q.Month, 2, 1);
      break;
    case 'MMM':
      e = r2(Y.Months, n2.Abbreviated);
      break;
    case 'MMMM':
      e = r2(Y.Months, n2.Wide);
      break;
    case 'MMMMM':
      e = r2(Y.Months, n2.Narrow);
      break;
    case 'LLL':
      e = r2(Y.Months, n2.Abbreviated, P2.Standalone);
      break;
    case 'LLLL':
      e = r2(Y.Months, n2.Wide, P2.Standalone);
      break;
    case 'LLLLL':
      e = r2(Y.Months, n2.Narrow, P2.Standalone);
      break;
    case 'w':
      e = Zc(1);
      break;
    case 'ww':
      e = Zc(2);
      break;
    case 'W':
      e = Zc(1, !0);
      break;
    case 'd':
      e = C2(Q.Date, 1);
      break;
    case 'dd':
      e = C2(Q.Date, 2);
      break;
    case 'c':
    case 'cc':
      e = C2(Q.Day, 1);
      break;
    case 'ccc':
      e = r2(Y.Days, n2.Abbreviated, P2.Standalone);
      break;
    case 'cccc':
      e = r2(Y.Days, n2.Wide, P2.Standalone);
      break;
    case 'ccccc':
      e = r2(Y.Days, n2.Narrow, P2.Standalone);
      break;
    case 'cccccc':
      e = r2(Y.Days, n2.Short, P2.Standalone);
      break;
    case 'E':
    case 'EE':
    case 'EEE':
      e = r2(Y.Days, n2.Abbreviated);
      break;
    case 'EEEE':
      e = r2(Y.Days, n2.Wide);
      break;
    case 'EEEEE':
      e = r2(Y.Days, n2.Narrow);
      break;
    case 'EEEEEE':
      e = r2(Y.Days, n2.Short);
      break;
    case 'a':
    case 'aa':
    case 'aaa':
      e = r2(Y.DayPeriods, n2.Abbreviated);
      break;
    case 'aaaa':
      e = r2(Y.DayPeriods, n2.Wide);
      break;
    case 'aaaaa':
      e = r2(Y.DayPeriods, n2.Narrow);
      break;
    case 'b':
    case 'bb':
    case 'bbb':
      e = r2(Y.DayPeriods, n2.Abbreviated, P2.Standalone, !0);
      break;
    case 'bbbb':
      e = r2(Y.DayPeriods, n2.Wide, P2.Standalone, !0);
      break;
    case 'bbbbb':
      e = r2(Y.DayPeriods, n2.Narrow, P2.Standalone, !0);
      break;
    case 'B':
    case 'BB':
    case 'BBB':
      e = r2(Y.DayPeriods, n2.Abbreviated, P2.Format, !0);
      break;
    case 'BBBB':
      e = r2(Y.DayPeriods, n2.Wide, P2.Format, !0);
      break;
    case 'BBBBB':
      e = r2(Y.DayPeriods, n2.Narrow, P2.Format, !0);
      break;
    case 'h':
      e = C2(Q.Hours, 1, -12);
      break;
    case 'hh':
      e = C2(Q.Hours, 2, -12);
      break;
    case 'H':
      e = C2(Q.Hours, 1);
      break;
    case 'HH':
      e = C2(Q.Hours, 2);
      break;
    case 'm':
      e = C2(Q.Minutes, 1);
      break;
    case 'mm':
      e = C2(Q.Minutes, 2);
      break;
    case 's':
      e = C2(Q.Seconds, 1);
      break;
    case 'ss':
      e = C2(Q.Seconds, 2);
      break;
    case 'S':
      e = C2(Q.FractionalSeconds, 1);
      break;
    case 'SS':
      e = C2(Q.FractionalSeconds, 2);
      break;
    case 'SSS':
      e = C2(Q.FractionalSeconds, 3);
      break;
    case 'Z':
    case 'ZZ':
    case 'ZZZ':
      e = ir(Q1.Short);
      break;
    case 'ZZZZZ':
      e = ir(Q1.Extended);
      break;
    case 'O':
    case 'OO':
    case 'OOO':
    case 'z':
    case 'zz':
    case 'zzz':
      e = ir(Q1.ShortGMT);
      break;
    case 'OOOO':
    case 'ZZZZ':
    case 'zzzz':
      e = ir(Q1.Long);
      break;
    default:
      return null;
  }
  return (Xc[t] = e), e;
}
function u7(t, e) {
  t = t.replace(/:/g, '');
  let r = Date.parse('Jan 01, 1970 00:00:00 ' + t) / 6e4;
  return isNaN(r) ? e : r;
}
function fv(t, e) {
  return (t = new Date(t.getTime())), t.setMinutes(t.getMinutes() + e), t;
}
function uv(t, e, r) {
  let n = r ? -1 : 1,
    i = t.getTimezoneOffset(),
    c = u7(e, i);
  return fv(t, n * (c - i));
}
function dv(t) {
  if (e7(t)) return t;
  if (typeof t == 'number' && !isNaN(t)) return new Date(t);
  if (typeof t == 'string') {
    if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
      let [i, c = 1, a = 1] = t.split('-').map((s) => +s);
      return or(i, c - 1, a);
    }
    let r = parseFloat(t);
    if (!isNaN(t - r)) return new Date(r);
    let n;
    if ((n = t.match(tv))) return hv(n);
  }
  let e = new Date(t);
  if (!e7(e)) throw new Error(`Unable to convert "${t}" into a date`);
  return e;
}
function hv(t) {
  let e = new Date(0),
    r = 0,
    n = 0,
    i = t[8] ? e.setUTCFullYear : e.setFullYear,
    c = t[8] ? e.setUTCHours : e.setHours;
  t[9] && ((r = Number(t[9] + t[10])), (n = Number(t[9] + t[11]))),
    i.call(e, Number(t[1]), Number(t[2]) - 1, Number(t[3]));
  let a = Number(t[4] || 0) - r,
    s = Number(t[5] || 0) - n,
    o = Number(t[6] || 0),
    l = Math.floor(parseFloat('0.' + (t[7] || 0)) * 1e3);
  return c.call(e, a, s, o, l), e;
}
function e7(t) {
  return t instanceof Date && !isNaN(t.valueOf());
}
function fr(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(';')) {
    let n = r.indexOf('='),
      [i, c] = n == -1 ? [r, ''] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(c);
  }
  return null;
}
var Kc = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  d7 = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, c) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = c),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((c, a, s) => {
          if (c.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Kc(c.item, this._ngForOf, -1, -1),
              s === null ? void 0 : s
            );
          else if (s == null) i.remove(a === null ? void 0 : a);
          else if (a !== null) {
            let o = i.get(a);
            i.move(o, s), t7(o, c);
          }
        });
        for (let c = 0, a = i.length; c < a; c++) {
          let o = i.get(c).context;
          (o.index = c), (o.count = a), (o.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((c) => {
          let a = i.get(c.currentIndex);
          t7(a, c);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(Ce), z(Xe), z(Wc));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['', 'ngFor', '', 'ngForOf', '']],
        inputs: {
          ngForOf: 'ngForOf',
          ngForTrackBy: 'ngForTrackBy',
          ngForTemplate: 'ngForTemplate',
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function t7(t, e) {
  t.context.$implicit = e.item;
}
var E1 = (() => {
    let e = class e {
      constructor(n, i) {
        (this._viewContainer = n),
          (this._context = new Jc()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i);
      }
      set ngIf(n) {
        (this._context.$implicit = this._context.ngIf = n), this._updateView();
      }
      set ngIfThen(n) {
        n7('ngIfThen', n),
          (this._thenTemplateRef = n),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(n) {
        n7('ngIfElse', n),
          (this._elseTemplateRef = n),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(Ce), z(Xe));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['', 'ngIf', '']],
        inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  Jc = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function n7(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${_2(e)}'.`);
}
function h7(t, e) {
  return new V(2100, !1);
}
var e0 = class {
    createSubscription(e, r) {
      return Yc(() =>
        e.subscribe({
          next: r,
          error: (n) => {
            throw n;
          },
        })
      );
    }
    dispose(e) {
      Yc(() => e.unsubscribe());
    }
  },
  t0 = class {
    createSubscription(e, r) {
      return e.then(r, (n) => {
        throw n;
      });
    }
    dispose(e) {}
  },
  pv = new t0(),
  mv = new e0(),
  p7 = (() => {
    let e = class e {
      constructor(n) {
        (this._latestValue = null),
          (this.markForCheckOnValueUpdate = !0),
          (this._subscription = null),
          (this._obj = null),
          (this._strategy = null),
          (this._ref = n);
      }
      ngOnDestroy() {
        this._subscription && this._dispose(), (this._ref = null);
      }
      transform(n) {
        if (!this._obj) {
          if (n)
            try {
              (this.markForCheckOnValueUpdate = !1), this._subscribe(n);
            } finally {
              this.markForCheckOnValueUpdate = !0;
            }
          return this._latestValue;
        }
        return n !== this._obj
          ? (this._dispose(), this.transform(n))
          : this._latestValue;
      }
      _subscribe(n) {
        (this._obj = n),
          (this._strategy = this._selectStrategy(n)),
          (this._subscription = this._strategy.createSubscription(n, (i) =>
            this._updateLatestValue(n, i)
          ));
      }
      _selectStrategy(n) {
        if (Me(n)) return pv;
        if (Gc(n)) return mv;
        throw h7(e, n);
      }
      _dispose() {
        this._strategy.dispose(this._subscription),
          (this._latestValue = null),
          (this._subscription = null),
          (this._obj = null);
      }
      _updateLatestValue(n, i) {
        n === this._obj &&
          ((this._latestValue = i),
          this.markForCheckOnValueUpdate && this._ref?.markForCheck());
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(rt, 16));
    }),
      (e.ɵpipe = cc({ name: 'async', type: e, pure: !1, standalone: !0 }));
    let t = e;
    return t;
  })();
var gv = 'mediumDate',
  vv = new w(''),
  Cv = new w(''),
  m7 = (() => {
    let e = class e {
      constructor(n, i, c) {
        (this.locale = n),
          (this.defaultTimezone = i),
          (this.defaultOptions = c);
      }
      transform(n, i, c, a) {
        if (n == null || n === '' || n !== n) return null;
        try {
          let s = i ?? this.defaultOptions?.dateFormat ?? gv,
            o =
              c ??
              this.defaultOptions?.timezone ??
              this.defaultTimezone ??
              void 0;
          return rv(n, s, a || this.locale, o);
        } catch (s) {
          throw h7(e, s.message);
        }
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(Kn, 16), z(vv, 24), z(Cv, 24));
    }),
      (e.ɵpipe = cc({ name: 'date', type: e, pure: !0, standalone: !0 }));
    let t = e;
    return t;
  })();
var g7 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = w2({ type: e })),
      (e.ɵinj = b2({}));
    let t = e;
    return t;
  })(),
  o0 = 'browser',
  Mv = 'server';
function yv(t) {
  return t === o0;
}
function l0(t) {
  return t === Mv;
}
var v7 = (() => {
    let e = class e {};
    e.ɵprov = H({
      token: e,
      providedIn: 'root',
      factory: () => (yv(g(L1)) ? new n0(g(N2), window) : new r0()),
    });
    let t = e;
    return t;
  })(),
  n0 = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = Vv(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        c = this.offset();
      this.window.scrollTo(n - c[0], i - c[1]);
    }
  };
function Vv(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == 'function' &&
    t.body &&
    typeof t.body.attachShadow == 'function'
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let c = i.shadowRoot;
      if (c) {
        let a = c.getElementById(e) || c.querySelector(`[name="${e}"]`);
        if (a) return a;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var r0 = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  Bt = class {};
var R3 = class {},
  dr = class {},
  Z1 = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == 'string'
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(':');
                      if (n > 0) {
                        let i = r.slice(0, n),
                          c = i.toLowerCase(),
                          a = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, c),
                          this.headers.has(c)
                            ? this.headers.get(c).push(a)
                            : this.headers.set(c, [a]);
                      }
                    });
              })
            : typeof Headers < 'u' && e instanceof Headers
            ? ((this.headers = new Map()),
              e.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(e).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let r = this.headers.get(e.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, r) {
      return this.clone({ name: e, value: r, op: 'a' });
    }
    set(e, r) {
      return this.clone({ name: e, value: r, op: 's' });
    }
    delete(e, r) {
      return this.clone({ name: e, value: r, op: 'd' });
    }
    maybeSetNormalizedName(e, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((r) => {
          this.headers.set(r, e.headers.get(r)),
            this.normalizedNames.set(r, e.normalizedNames.get(r));
        });
    }
    clone(e) {
      let r = new t();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        r
      );
    }
    applyUpdate(e) {
      let r = e.name.toLowerCase();
      switch (e.op) {
        case 'a':
        case 's':
          let n = e.value;
          if ((typeof n == 'string' && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(e.name, r);
          let i = (e.op === 'a' ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case 'd':
          let c = e.value;
          if (!c) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let a = this.headers.get(r);
            if (!a) return;
            (a = a.filter((s) => c.indexOf(s) === -1)),
              a.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, a);
          }
          break;
      }
    }
    setHeaderEntries(e, r) {
      let n = (Array.isArray(r) ? r : [r]).map((c) => c.toString()),
        i = e.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          e(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var u0 = class {
  encodeKey(e) {
    return C7(e);
  }
  encodeValue(e) {
    return C7(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function bv(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, '')
        .split('&')
        .forEach((i) => {
          let c = i.indexOf('='),
            [a, s] =
              c == -1
                ? [e.decodeKey(i), '']
                : [e.decodeKey(i.slice(0, c)), e.decodeValue(i.slice(c + 1))],
            o = r.get(a) || [];
          o.push(s), r.set(a, o);
        }),
    r
  );
}
var wv = /%(\d[a-f0-9])/gi,
  Dv = {
    40: '@',
    '3A': ':',
    24: '$',
    '2C': ',',
    '3B': ';',
    '3D': '=',
    '3F': '?',
    '2F': '/',
  };
function C7(t) {
  return encodeURIComponent(t).replace(wv, (e, r) => Dv[r] ?? e);
}
function ur(t) {
  return `${t}`;
}
var Ve = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new u0()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error('Cannot specify both fromString and fromObject.');
      this.map = bv(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(ur) : [ur(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: 'a' });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((c) => {
              r.push({ param: n, value: c, op: 'a' });
            })
          : r.push({ param: n, value: i, op: 'a' });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: 's' });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: 'd' });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + '=' + this.encoder.encodeValue(n))
            .join('&');
        })
        .filter((e) => e !== '')
        .join('&')
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case 'a':
            case 's':
              let r = (e.op === 'a' ? this.map.get(e.param) : void 0) || [];
              r.push(ur(e.value)), this.map.set(e.param, r);
              break;
            case 'd':
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(ur(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var d0 = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function xv(t) {
  switch (t) {
    case 'DELETE':
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
    case 'JSONP':
      return !1;
    default:
      return !0;
  }
}
function M7(t) {
  return typeof ArrayBuffer < 'u' && t instanceof ArrayBuffer;
}
function y7(t) {
  return typeof Blob < 'u' && t instanceof Blob;
}
function V7(t) {
  return typeof FormData < 'u' && t instanceof FormData;
}
function Lv(t) {
  return typeof URLSearchParams < 'u' && t instanceof URLSearchParams;
}
var _3 = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = 'json'),
        (this.method = e.toUpperCase());
      let c;
      if (
        (xv(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (c = i))
          : (c = n),
        c &&
          ((this.reportProgress = !!c.reportProgress),
          (this.withCredentials = !!c.withCredentials),
          c.responseType && (this.responseType = c.responseType),
          c.headers && (this.headers = c.headers),
          c.context && (this.context = c.context),
          c.params && (this.params = c.params),
          (this.transferCache = c.transferCache)),
        (this.headers ??= new Z1()),
        (this.context ??= new d0()),
        !this.params)
      )
        (this.params = new Ve()), (this.urlWithParams = r);
      else {
        let a = this.params.toString();
        if (a.length === 0) this.urlWithParams = r;
        else {
          let s = r.indexOf('?'),
            o = s === -1 ? '?' : s < r.length - 1 ? '&' : '';
          this.urlWithParams = r + o + a;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : M7(this.body) ||
          y7(this.body) ||
          V7(this.body) ||
          Lv(this.body) ||
          typeof this.body == 'string'
        ? this.body
        : this.body instanceof Ve
        ? this.body.toString()
        : typeof this.body == 'object' ||
          typeof this.body == 'boolean' ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || V7(this.body)
        ? null
        : y7(this.body)
        ? this.body.type || null
        : M7(this.body)
        ? null
        : typeof this.body == 'string'
        ? 'text/plain'
        : this.body instanceof Ve
        ? 'application/x-www-form-urlencoded;charset=UTF-8'
        : typeof this.body == 'object' ||
          typeof this.body == 'number' ||
          typeof this.body == 'boolean'
        ? 'application/json'
        : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        c = e.body !== void 0 ? e.body : this.body,
        a =
          e.withCredentials !== void 0
            ? e.withCredentials
            : this.withCredentials,
        s =
          e.reportProgress !== void 0 ? e.reportProgress : this.reportProgress,
        o = e.headers || this.headers,
        l = e.params || this.params,
        f = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (o = Object.keys(e.setHeaders).reduce(
            (u, d) => u.set(d, e.setHeaders[d]),
            o
          )),
        e.setParams &&
          (l = Object.keys(e.setParams).reduce(
            (u, d) => u.set(d, e.setParams[d]),
            l
          )),
        new t(r, n, c, {
          params: l,
          headers: o,
          context: f,
          reportProgress: s,
          responseType: i,
          withCredentials: a,
        })
      );
    }
  },
  Ut = (function (t) {
    return (
      (t[(t.Sent = 0)] = 'Sent'),
      (t[(t.UploadProgress = 1)] = 'UploadProgress'),
      (t[(t.ResponseHeader = 2)] = 'ResponseHeader'),
      (t[(t.DownloadProgress = 3)] = 'DownloadProgress'),
      (t[(t.Response = 4)] = 'Response'),
      (t[(t.User = 5)] = 'User'),
      t
    );
  })(Ut || {}),
  P3 = class {
    constructor(e, r = mr.Ok, n = 'OK') {
      (this.headers = e.headers || new Z1()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  h0 = class t extends P3 {
    constructor(e = {}) {
      super(e), (this.type = Ut.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  hr = class t extends P3 {
    constructor(e = {}) {
      super(e),
        (this.type = Ut.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  pr = class extends P3 {
    constructor(e) {
      super(e, 0, 'Unknown Error'),
        (this.name = 'HttpErrorResponse'),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || '(unknown url)'
            }`)
          : (this.message = `Http failure response for ${
              e.url || '(unknown url)'
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  mr = (function (t) {
    return (
      (t[(t.Continue = 100)] = 'Continue'),
      (t[(t.SwitchingProtocols = 101)] = 'SwitchingProtocols'),
      (t[(t.Processing = 102)] = 'Processing'),
      (t[(t.EarlyHints = 103)] = 'EarlyHints'),
      (t[(t.Ok = 200)] = 'Ok'),
      (t[(t.Created = 201)] = 'Created'),
      (t[(t.Accepted = 202)] = 'Accepted'),
      (t[(t.NonAuthoritativeInformation = 203)] =
        'NonAuthoritativeInformation'),
      (t[(t.NoContent = 204)] = 'NoContent'),
      (t[(t.ResetContent = 205)] = 'ResetContent'),
      (t[(t.PartialContent = 206)] = 'PartialContent'),
      (t[(t.MultiStatus = 207)] = 'MultiStatus'),
      (t[(t.AlreadyReported = 208)] = 'AlreadyReported'),
      (t[(t.ImUsed = 226)] = 'ImUsed'),
      (t[(t.MultipleChoices = 300)] = 'MultipleChoices'),
      (t[(t.MovedPermanently = 301)] = 'MovedPermanently'),
      (t[(t.Found = 302)] = 'Found'),
      (t[(t.SeeOther = 303)] = 'SeeOther'),
      (t[(t.NotModified = 304)] = 'NotModified'),
      (t[(t.UseProxy = 305)] = 'UseProxy'),
      (t[(t.Unused = 306)] = 'Unused'),
      (t[(t.TemporaryRedirect = 307)] = 'TemporaryRedirect'),
      (t[(t.PermanentRedirect = 308)] = 'PermanentRedirect'),
      (t[(t.BadRequest = 400)] = 'BadRequest'),
      (t[(t.Unauthorized = 401)] = 'Unauthorized'),
      (t[(t.PaymentRequired = 402)] = 'PaymentRequired'),
      (t[(t.Forbidden = 403)] = 'Forbidden'),
      (t[(t.NotFound = 404)] = 'NotFound'),
      (t[(t.MethodNotAllowed = 405)] = 'MethodNotAllowed'),
      (t[(t.NotAcceptable = 406)] = 'NotAcceptable'),
      (t[(t.ProxyAuthenticationRequired = 407)] =
        'ProxyAuthenticationRequired'),
      (t[(t.RequestTimeout = 408)] = 'RequestTimeout'),
      (t[(t.Conflict = 409)] = 'Conflict'),
      (t[(t.Gone = 410)] = 'Gone'),
      (t[(t.LengthRequired = 411)] = 'LengthRequired'),
      (t[(t.PreconditionFailed = 412)] = 'PreconditionFailed'),
      (t[(t.PayloadTooLarge = 413)] = 'PayloadTooLarge'),
      (t[(t.UriTooLong = 414)] = 'UriTooLong'),
      (t[(t.UnsupportedMediaType = 415)] = 'UnsupportedMediaType'),
      (t[(t.RangeNotSatisfiable = 416)] = 'RangeNotSatisfiable'),
      (t[(t.ExpectationFailed = 417)] = 'ExpectationFailed'),
      (t[(t.ImATeapot = 418)] = 'ImATeapot'),
      (t[(t.MisdirectedRequest = 421)] = 'MisdirectedRequest'),
      (t[(t.UnprocessableEntity = 422)] = 'UnprocessableEntity'),
      (t[(t.Locked = 423)] = 'Locked'),
      (t[(t.FailedDependency = 424)] = 'FailedDependency'),
      (t[(t.TooEarly = 425)] = 'TooEarly'),
      (t[(t.UpgradeRequired = 426)] = 'UpgradeRequired'),
      (t[(t.PreconditionRequired = 428)] = 'PreconditionRequired'),
      (t[(t.TooManyRequests = 429)] = 'TooManyRequests'),
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        'RequestHeaderFieldsTooLarge'),
      (t[(t.UnavailableForLegalReasons = 451)] = 'UnavailableForLegalReasons'),
      (t[(t.InternalServerError = 500)] = 'InternalServerError'),
      (t[(t.NotImplemented = 501)] = 'NotImplemented'),
      (t[(t.BadGateway = 502)] = 'BadGateway'),
      (t[(t.ServiceUnavailable = 503)] = 'ServiceUnavailable'),
      (t[(t.GatewayTimeout = 504)] = 'GatewayTimeout'),
      (t[(t.HttpVersionNotSupported = 505)] = 'HttpVersionNotSupported'),
      (t[(t.VariantAlsoNegotiates = 506)] = 'VariantAlsoNegotiates'),
      (t[(t.InsufficientStorage = 507)] = 'InsufficientStorage'),
      (t[(t.LoopDetected = 508)] = 'LoopDetected'),
      (t[(t.NotExtended = 510)] = 'NotExtended'),
      (t[(t.NetworkAuthenticationRequired = 511)] =
        'NetworkAuthenticationRequired'),
      t
    );
  })(mr || {});
function f0(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var p0 = (() => {
  let e = class e {
    constructor(n) {
      this.handler = n;
    }
    request(n, i, c = {}) {
      let a;
      if (n instanceof _3) a = n;
      else {
        let l;
        c.headers instanceof Z1 ? (l = c.headers) : (l = new Z1(c.headers));
        let f;
        c.params &&
          (c.params instanceof Ve
            ? (f = c.params)
            : (f = new Ve({ fromObject: c.params }))),
          (a = new _3(n, i, c.body !== void 0 ? c.body : null, {
            headers: l,
            context: c.context,
            params: f,
            reportProgress: c.reportProgress,
            responseType: c.responseType || 'json',
            withCredentials: c.withCredentials,
            transferCache: c.transferCache,
          }));
      }
      let s = S(a).pipe(R1((l) => this.handler.handle(l)));
      if (n instanceof _3 || c.observe === 'events') return s;
      let o = s.pipe(B2((l) => l instanceof hr));
      switch (c.observe || 'body') {
        case 'body':
          switch (a.responseType) {
            case 'arraybuffer':
              return o.pipe(
                k((l) => {
                  if (l.body !== null && !(l.body instanceof ArrayBuffer))
                    throw new Error('Response is not an ArrayBuffer.');
                  return l.body;
                })
              );
            case 'blob':
              return o.pipe(
                k((l) => {
                  if (l.body !== null && !(l.body instanceof Blob))
                    throw new Error('Response is not a Blob.');
                  return l.body;
                })
              );
            case 'text':
              return o.pipe(
                k((l) => {
                  if (l.body !== null && typeof l.body != 'string')
                    throw new Error('Response is not a string.');
                  return l.body;
                })
              );
            case 'json':
            default:
              return o.pipe(k((l) => l.body));
          }
        case 'response':
          return o;
        default:
          throw new Error(`Unreachable: unhandled observe type ${c.observe}}`);
      }
    }
    delete(n, i = {}) {
      return this.request('DELETE', n, i);
    }
    get(n, i = {}) {
      return this.request('GET', n, i);
    }
    head(n, i = {}) {
      return this.request('HEAD', n, i);
    }
    jsonp(n, i) {
      return this.request('JSONP', n, {
        params: new Ve().append(i, 'JSONP_CALLBACK'),
        observe: 'body',
        responseType: 'json',
      });
    }
    options(n, i = {}) {
      return this.request('OPTIONS', n, i);
    }
    patch(n, i, c = {}) {
      return this.request('PATCH', n, f0(c, i));
    }
    post(n, i, c = {}) {
      return this.request('POST', n, f0(c, i));
    }
    put(n, i, c = {}) {
      return this.request('PUT', n, f0(c, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(R3));
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function w7(t, e) {
  return e(t);
}
function Sv(t, e) {
  return (r, n) => e.intercept(r, { handle: (i) => t(i, n) });
}
function Nv(t, e, r) {
  return (n, i) => g1(r, () => e(n, (c) => t(c, i)));
}
var Ev = new w(''),
  m0 = new w(''),
  Iv = new w(''),
  Av = new w('');
function Tv() {
  let t = null;
  return (e, r) => {
    t === null && (t = (g(Ev, { optional: !0 }) ?? []).reduceRight(Sv, w7));
    let n = g(tt),
      i = n.add();
    return t(e, r).pipe(oe(() => n.remove(i)));
  };
}
var H7 = (() => {
  let e = class e extends R3 {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = g(tt));
      let c = g(Av, { optional: !0 });
      this.backend = c ?? n;
    }
    handle(n) {
      if (this.chain === null) {
        let c = Array.from(
          new Set([...this.injector.get(m0), ...this.injector.get(Iv, [])])
        );
        this.chain = c.reduceRight((a, s) => Nv(a, s, this.injector), w7);
      }
      let i = this.pendingTasks.add();
      return this.chain(n, (c) => this.backend.handle(c)).pipe(
        oe(() => this.pendingTasks.remove(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(dr), D(R2));
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var kv = /^\)\]\}',?\n/;
function _v(t) {
  return 'responseURL' in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader('X-Request-URL')
    : null;
}
var z7 = (() => {
    let e = class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === 'JSONP') throw new V(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? i2(i.ɵloadImpl()) : S(null)).pipe(
          j2(
            () =>
              new q((a) => {
                let s = i.build();
                if (
                  (s.open(n.method, n.urlWithParams),
                  n.withCredentials && (s.withCredentials = !0),
                  n.headers.forEach((L, b) =>
                    s.setRequestHeader(L, b.join(','))
                  ),
                  n.headers.has('Accept') ||
                    s.setRequestHeader(
                      'Accept',
                      'application/json, text/plain, */*'
                    ),
                  !n.headers.has('Content-Type'))
                ) {
                  let L = n.detectContentTypeHeader();
                  L !== null && s.setRequestHeader('Content-Type', L);
                }
                if (n.responseType) {
                  let L = n.responseType.toLowerCase();
                  s.responseType = L !== 'json' ? L : 'text';
                }
                let o = n.serializeBody(),
                  l = null,
                  f = () => {
                    if (l !== null) return l;
                    let L = s.statusText || 'OK',
                      b = new Z1(s.getAllResponseHeaders()),
                      U = _v(s) || n.url;
                    return (
                      (l = new h0({
                        headers: b,
                        status: s.status,
                        statusText: L,
                        url: U,
                      })),
                      l
                    );
                  },
                  u = () => {
                    let { headers: L, status: b, statusText: U, url: $ } = f(),
                      B = null;
                    b !== mr.NoContent &&
                      (B =
                        typeof s.response > 'u' ? s.responseText : s.response),
                      b === 0 && (b = B ? mr.Ok : 0);
                    let s2 = b >= 200 && b < 300;
                    if (n.responseType === 'json' && typeof B == 'string') {
                      let f2 = B;
                      B = B.replace(kv, '');
                      try {
                        B = B !== '' ? JSON.parse(B) : null;
                      } catch (E2) {
                        (B = f2),
                          s2 && ((s2 = !1), (B = { error: E2, text: B }));
                      }
                    }
                    s2
                      ? (a.next(
                          new hr({
                            body: B,
                            headers: L,
                            status: b,
                            statusText: U,
                            url: $ || void 0,
                          })
                        ),
                        a.complete())
                      : a.error(
                          new pr({
                            error: B,
                            headers: L,
                            status: b,
                            statusText: U,
                            url: $ || void 0,
                          })
                        );
                  },
                  d = (L) => {
                    let { url: b } = f(),
                      U = new pr({
                        error: L,
                        status: s.status || 0,
                        statusText: s.statusText || 'Unknown Error',
                        url: b || void 0,
                      });
                    a.error(U);
                  },
                  h = !1,
                  C = (L) => {
                    h || (a.next(f()), (h = !0));
                    let b = { type: Ut.DownloadProgress, loaded: L.loaded };
                    L.lengthComputable && (b.total = L.total),
                      n.responseType === 'text' &&
                        s.responseText &&
                        (b.partialText = s.responseText),
                      a.next(b);
                  },
                  N = (L) => {
                    let b = { type: Ut.UploadProgress, loaded: L.loaded };
                    L.lengthComputable && (b.total = L.total), a.next(b);
                  };
                return (
                  s.addEventListener('load', u),
                  s.addEventListener('error', d),
                  s.addEventListener('timeout', d),
                  s.addEventListener('abort', d),
                  n.reportProgress &&
                    (s.addEventListener('progress', C),
                    o !== null &&
                      s.upload &&
                      s.upload.addEventListener('progress', N)),
                  s.send(o),
                  a.next({ type: Ut.Sent }),
                  () => {
                    s.removeEventListener('error', d),
                      s.removeEventListener('abort', d),
                      s.removeEventListener('load', u),
                      s.removeEventListener('timeout', d),
                      n.reportProgress &&
                        (s.removeEventListener('progress', C),
                        o !== null &&
                          s.upload &&
                          s.upload.removeEventListener('progress', N)),
                      s.readyState !== s.DONE && s.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Bt));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  D7 = new w(''),
  Rv = 'XSRF-TOKEN',
  Pv = new w('', { providedIn: 'root', factory: () => Rv }),
  Fv = 'X-XSRF-TOKEN',
  Ov = new w('', { providedIn: 'root', factory: () => Fv }),
  gr = class {},
  Bv = (() => {
    let e = class e {
      constructor(n, i, c) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = c),
          (this.lastCookieString = ''),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === 'server') return null;
        let n = this.doc.cookie || '';
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = fr(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(N2), D(L1), D(Pv));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function jv(t, e) {
  let r = t.url.toLowerCase();
  if (
    !g(D7) ||
    t.method === 'GET' ||
    t.method === 'HEAD' ||
    r.startsWith('http://') ||
    r.startsWith('https://')
  )
    return e(t);
  let n = g(gr).getToken(),
    i = g(Ov);
  return (
    n != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, n) })),
    e(t)
  );
}
var x7 = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = 'Interceptors'),
    (t[(t.LegacyInterceptors = 1)] = 'LegacyInterceptors'),
    (t[(t.CustomXsrfConfiguration = 2)] = 'CustomXsrfConfiguration'),
    (t[(t.NoXsrfProtection = 3)] = 'NoXsrfProtection'),
    (t[(t.JsonpSupport = 4)] = 'JsonpSupport'),
    (t[(t.RequestsMadeViaParent = 5)] = 'RequestsMadeViaParent'),
    (t[(t.Fetch = 6)] = 'Fetch'),
    t
  );
})(x7 || {});
function Uv(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function $v(...t) {
  let e = [
    p0,
    z7,
    H7,
    { provide: R3, useExisting: H7 },
    { provide: dr, useExisting: z7 },
    { provide: m0, useValue: jv, multi: !0 },
    { provide: D7, useValue: !0 },
    { provide: gr, useClass: Bv },
  ];
  for (let r of t) e.push(...r.ɵproviders);
  return An(e);
}
var b7 = new w('');
function Gv() {
  return Uv(x7.LegacyInterceptors, [
    { provide: b7, useFactory: Tv },
    { provide: m0, useExisting: b7, multi: !0 },
  ]);
}
var L7 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = w2({ type: e })),
    (e.ɵinj = b2({ providers: [$v(Gv())] }));
  let t = e;
  return t;
})();
var C0 = class extends sr {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  M0 = class t extends C0 {
    static makeCurrent() {
      c7(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === 'window'
        ? window
        : r === 'document'
        ? e
        : r === 'body'
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = Wv();
      return r == null ? null : Yv(r);
    }
    resetBaseElement() {
      F3 = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return fr(document.cookie, e);
    }
  },
  F3 = null;
function Wv() {
  return (
    (F3 = F3 || document.querySelector('base')),
    F3 ? F3.getAttribute('href') : null
  );
}
function Yv(t) {
  return new URL(t, document.baseURI).pathname;
}
var y0 = class {
    addToWindow(e) {
      (u2.getAngularTestability = (n, i = !0) => {
        let c = e.findTestabilityInTree(n, i);
        if (c == null) throw new V(5103, !1);
        return c;
      }),
        (u2.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (u2.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let i = u2.getAllAngularTestabilities(),
          c = i.length,
          a = function () {
            c--, c == 0 && n();
          };
        i.forEach((s) => {
          s.whenStable(a);
        });
      };
      u2.frameworkStabilizers || (u2.frameworkStabilizers = []),
        u2.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let i = e.getTestability(r);
      return (
        i ??
        (n
          ? N1().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  Qv = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  V0 = new w(''),
  I7 = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((c) => {
            c.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, c) {
        return this._findPluginFor(i).addEventListener(n, i, c);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((a) => a.supports(n))), !i))
          throw new V(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(V0), D(e2));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  vr = class {
    constructor(e) {
      this._doc = e;
    }
  },
  g0 = 'ng-app-id',
  A7 = (() => {
    let e = class e {
      constructor(n, i, c, a = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = c),
          (this.platformId = a),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = l0(a)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((c) => c.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${g0}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((c) => {
              c.textContent != null && i.set(c.textContent, c);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let c = this.styleRef;
        if (c.has(n)) {
          let a = c.get(n);
          return (a.usage += i), a.usage;
        }
        return c.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let c = this.styleNodesInDOM,
          a = c?.get(i);
        if (a?.parentNode === n) return c.delete(i), a.removeAttribute(g0), a;
        {
          let s = this.doc.createElement('style');
          return (
            this.nonce && s.setAttribute('nonce', this.nonce),
            (s.textContent = i),
            this.platformIsServer && s.setAttribute(g0, this.appId),
            n.appendChild(s),
            s
          );
        }
      }
      addStyleToHost(n, i) {
        let c = this.getStyleElement(n, i),
          a = this.styleRef,
          s = a.get(i)?.elements;
        s ? s.push(c) : a.set(i, { elements: [c], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(N2), D(Pn), D(Hc, 8), D(L1));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  v0 = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  z0 = /%COMP%/g,
  T7 = '%COMP%',
  Zv = `_nghost-${T7}`,
  Xv = `_ngcontent-${T7}`,
  Kv = !0,
  Jv = new w('', { providedIn: 'root', factory: () => Kv });
function eC(t) {
  return Xv.replace(z0, t);
}
function tC(t) {
  return Zv.replace(z0, t);
}
function k7(t, e) {
  return e.map((r) => r.replace(z0, t));
}
var S7 = (() => {
    let e = class e {
      constructor(n, i, c, a, s, o, l, f = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = c),
          (this.removeStylesOnCompDestroy = a),
          (this.doc = s),
          (this.platformId = o),
          (this.ngZone = l),
          (this.nonce = f),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = l0(o)),
          (this.defaultRenderer = new O3(n, s, l, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === w1.ShadowDom &&
          (i = J(M({}, i), { encapsulation: w1.Emulated }));
        let c = this.getOrCreateRenderer(n, i);
        return (
          c instanceof Cr
            ? c.applyToHost(n)
            : c instanceof B3 && c.applyStyles(),
          c
        );
      }
      getOrCreateRenderer(n, i) {
        let c = this.rendererByCompId,
          a = c.get(i.id);
        if (!a) {
          let s = this.doc,
            o = this.ngZone,
            l = this.eventManager,
            f = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (i.encapsulation) {
            case w1.Emulated:
              a = new Cr(l, f, i, this.appId, u, s, o, d);
              break;
            case w1.ShadowDom:
              return new H0(l, f, n, i, s, o, this.nonce, d);
            default:
              a = new B3(l, f, i, u, s, o, d);
              break;
          }
          c.set(i.id, a);
        }
        return a;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        D(I7),
        D(A7),
        D(Pn),
        D(Jv),
        D(N2),
        D(L1),
        D(e2),
        D(Hc)
      );
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  O3 = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(v0[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (N7(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (N7(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == 'string' ? this.doc.querySelector(e) : e;
      if (!n) throw new V(-5104, !1);
      return r || (n.textContent = ''), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ':' + r;
        let c = v0[i];
        c ? e.setAttributeNS(c, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = v0[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (B1.DashCase | B1.Important)
        ? e.style.setProperty(r, n, i & B1.Important ? 'important' : '')
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & B1.DashCase ? e.style.removeProperty(r) : (e.style[r] = '');
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == 'string' &&
        ((e = N1().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === '__ngUnwrap__') return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function N7(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0;
}
var H0 = class extends O3 {
    constructor(e, r, n, i, c, a, s, o) {
      super(e, c, a, o),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = k7(i.id, i.styles);
      for (let f of l) {
        let u = document.createElement('style');
        s && u.setAttribute('nonce', s),
          (u.textContent = f),
          this.shadowRoot.appendChild(u);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  B3 = class extends O3 {
    constructor(e, r, n, i, c, a, s, o) {
      super(e, c, a, s),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = o ? k7(o, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Cr = class extends B3 {
    constructor(e, r, n, i, c, a, s, o) {
      let l = i + '-' + n.id;
      super(e, r, n, c, a, s, o, l),
        (this.contentAttr = eC(l)),
        (this.hostAttr = tC(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '');
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ''), n;
    }
  },
  nC = (() => {
    let e = class e extends vr {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, c) {
        return (
          n.addEventListener(i, c, !1), () => this.removeEventListener(n, i, c)
        );
      }
      removeEventListener(n, i, c) {
        return n.removeEventListener(i, c);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(N2));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  E7 = ['alt', 'control', 'meta', 'shift'],
  rC = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  iC = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  cC = (() => {
    let e = class e extends vr {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, c) {
        let a = e.parseEventName(i),
          s = e.eventCallback(a.fullKey, c, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => N1().onAndCancel(n, a.domEventName, s));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split('.'),
          c = i.shift();
        if (i.length === 0 || !(c === 'keydown' || c === 'keyup')) return null;
        let a = e._normalizeKey(i.pop()),
          s = '',
          o = i.indexOf('code');
        if (
          (o > -1 && (i.splice(o, 1), (s = 'code.')),
          E7.forEach((f) => {
            let u = i.indexOf(f);
            u > -1 && (i.splice(u, 1), (s += f + '.'));
          }),
          (s += a),
          i.length != 0 || a.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = c), (l.fullKey = s), l;
      }
      static matchEventFullKeyCode(n, i) {
        let c = rC[n.key] || n.key,
          a = '';
        return (
          i.indexOf('code.') > -1 && ((c = n.code), (a = 'code.')),
          c == null || !c
            ? !1
            : ((c = c.toLowerCase()),
              c === ' ' ? (c = 'space') : c === '.' && (c = 'dot'),
              E7.forEach((s) => {
                if (s !== c) {
                  let o = iC[s];
                  o(n) && (a += s + '.');
                }
              }),
              (a += c),
              a === i)
        );
      }
      static eventCallback(n, i, c) {
        return (a) => {
          e.matchEventFullKeyCode(a, n) && c.runGuarded(() => i(a));
        };
      }
      static _normalizeKey(n) {
        return n === 'esc' ? 'escape' : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(N2));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function aC() {
  M0.makeCurrent();
}
function sC() {
  return new x1();
}
function oC() {
  return S8(document), document;
}
var lC = [
    { provide: L1, useValue: o0 },
    { provide: Vc, useValue: aC, multi: !0 },
    { provide: N2, useFactory: oC, deps: [] },
  ],
  _7 = qc(Q5, 'browser', lC),
  fC = new w(''),
  uC = [
    { provide: k3, useClass: y0, deps: [] },
    { provide: Uc, useClass: Wn, deps: [e2, Yn, k3] },
    { provide: Wn, useClass: Wn, deps: [e2, Yn, k3] },
  ],
  dC = [
    { provide: Tn, useValue: 'root' },
    { provide: x1, useFactory: sC, deps: [] },
    { provide: V0, useClass: nC, multi: !0, deps: [N2, e2, L1] },
    { provide: V0, useClass: cC, multi: !0, deps: [N2] },
    S7,
    A7,
    I7,
    { provide: H3, useExisting: S7 },
    { provide: Bt, useClass: Qv, deps: [] },
    [],
  ],
  R7 = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: Pn, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(fC, 12));
    }),
      (e.ɵmod = w2({ type: e })),
      (e.ɵinj = b2({ providers: [...dC, ...uC], imports: [g7, Z5] }));
    let t = e;
    return t;
  })();
var P7 = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || '';
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(N2));
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var b0 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({
        token: e,
        factory: function (i) {
          let c = null;
          return i ? (c = new (i || e)()) : (c = D(hC)), c;
        },
        providedIn: 'root',
      }));
    let t = e;
    return t;
  })(),
  hC = (() => {
    let e = class e extends b0 {
      constructor(n) {
        super(), (this._doc = n);
      }
      sanitize(n, i) {
        if (i == null) return null;
        switch (n) {
          case q1.NONE:
            return i;
          case q1.HTML:
            return Je(i, 'HTML') ? $1(i) : wc(this._doc, String(i)).toString();
          case q1.STYLE:
            return Je(i, 'Style') ? $1(i) : i;
          case q1.SCRIPT:
            if (Je(i, 'Script')) return $1(i);
            throw new V(5200, !1);
          case q1.URL:
            return Je(i, 'URL') ? $1(i) : bc(String(i));
          case q1.RESOURCE_URL:
            if (Je(i, 'ResourceURL')) return $1(i);
            throw new V(5201, !1);
          default:
            throw new V(5202, !1);
        }
      }
      bypassSecurityTrustHtml(n) {
        return I8(n);
      }
      bypassSecurityTrustStyle(n) {
        return A8(n);
      }
      bypassSecurityTrustScript(n) {
        return T8(n);
      }
      bypassSecurityTrustUrl(n) {
        return k8(n);
      }
      bypassSecurityTrustResourceUrl(n) {
        return _8(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(N2));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var _ = 'primary',
  n4 = Symbol('RouteTitle'),
  N0 = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Yt(t) {
  return new N0(t);
}
function pC(t, e, r) {
  let n = r.path.split('/');
  if (
    n.length > t.length ||
    (r.pathMatch === 'full' && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let c = 0; c < n.length; c++) {
    let a = n[c],
      s = t[c];
    if (a.startsWith(':')) i[a.substring(1)] = s;
    else if (a !== s.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function mC(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!I1(t[r], e[r])) return !1;
  return !0;
}
function I1(t, e) {
  let r = t ? E0(t) : void 0,
    n = e ? E0(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let c = 0; c < r.length; c++)
    if (((i = r[c]), !W7(t[i], e[i]))) return !1;
  return !0;
}
function E0(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function W7(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, c) => n[c] === i);
  } else return t === e;
}
function Y7(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function we(t) {
  return E6(t) ? t : Me(t) ? i2(Promise.resolve(t)) : S(t);
}
var gC = { exact: Z7, subset: X7 },
  Q7 = { exact: vC, subset: CC, ignored: () => !0 };
function F7(t, e, r) {
  return (
    gC[r.paths](t.root, e.root, r.matrixParams) &&
    Q7[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === 'exact' && t.fragment !== e.fragment)
  );
}
function vC(t, e) {
  return I1(t, e);
}
function Z7(t, e, r) {
  if (
    !st(t.segments, e.segments) ||
    !Vr(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !Z7(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function CC(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => W7(t[r], e[r]))
  );
}
function X7(t, e, r) {
  return K7(t, e, e.segments, r);
}
function K7(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!st(i, r) || e.hasChildren() || !Vr(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!st(t.segments, r) || !Vr(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !X7(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      c = r.slice(t.segments.length);
    return !st(t.segments, i) || !Vr(t.segments, i, n) || !t.children[_]
      ? !1
      : K7(t.children[_], e, c, n);
  }
}
function Vr(t, e, r) {
  return e.every((n, i) => Q7[r](t[i].parameters, n.parameters));
}
var He = class {
    constructor(e = new X([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Yt(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return VC.serialize(this);
    }
  },
  X = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Hr(this);
    }
  },
  at = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= Yt(this.parameters)), this._parameterMap;
    }
    toString() {
      return el(this);
    }
  };
function MC(t, e) {
  return st(t, e) && t.every((r, n) => I1(r.parameters, e[n].parameters));
}
function st(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function yC(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === _ && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== _ && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var r4 = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => new Y3(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Y3 = class {
    parse(e) {
      let r = new A0(e);
      return new He(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${j3(e.root, !0)}`,
        n = bC(e.queryParams),
        i = typeof e.fragment == 'string' ? `#${HC(e.fragment)}` : '';
      return `${r}${n}${i}`;
    }
  },
  VC = new Y3();
function Hr(t) {
  return t.segments.map((e) => el(e)).join('/');
}
function j3(t, e) {
  if (!t.hasChildren()) return Hr(t);
  if (e) {
    let r = t.children[_] ? j3(t.children[_], !1) : '',
      n = [];
    return (
      Object.entries(t.children).forEach(([i, c]) => {
        i !== _ && n.push(`${i}:${j3(c, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join('//')})` : r
    );
  } else {
    let r = yC(t, (n, i) =>
      i === _ ? [j3(t.children[_], !1)] : [`${i}:${j3(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[_] != null
      ? `${Hr(t)}/${r[0]}`
      : `${Hr(t)}/(${r.join('//')})`;
  }
}
function J7(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',');
}
function Mr(t) {
  return J7(t).replace(/%3B/gi, ';');
}
function HC(t) {
  return encodeURI(t);
}
function I0(t) {
  return J7(t)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/%26/gi, '&');
}
function zr(t) {
  return decodeURIComponent(t);
}
function O7(t) {
  return zr(t.replace(/\+/g, '%20'));
}
function el(t) {
  return `${I0(t.path)}${zC(t.parameters)}`;
}
function zC(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${I0(e)}=${I0(r)}`)
    .join('');
}
function bC(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${Mr(r)}=${Mr(i)}`).join('&')
        : `${Mr(r)}=${Mr(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join('&')}` : '';
}
var wC = /^[^\/()?;#]+/;
function D0(t) {
  let e = t.match(wC);
  return e ? e[0] : '';
}
var DC = /^[^\/()?;=#]+/;
function xC(t) {
  let e = t.match(DC);
  return e ? e[0] : '';
}
var LC = /^[^=?&#]+/;
function SC(t) {
  let e = t.match(LC);
  return e ? e[0] : '';
}
var NC = /^[^&#]+/;
function EC(t) {
  let e = t.match(NC);
  return e ? e[0] : '';
}
var A0 = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' ||
      this.peekStartsWith('?') ||
      this.peekStartsWith('#')
        ? new X([], {})
        : new X([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(e);
      while (this.consumeOptional('&'));
    return e;
  }
  parseFragment() {
    return this.consumeOptional('#')
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let e = [];
    for (
      this.peekStartsWith('(') || e.push(this.parseSegment());
      this.peekStartsWith('/') &&
      !this.peekStartsWith('//') &&
      !this.peekStartsWith('/(');

    )
      this.capture('/'), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith('/(') &&
      (this.capture('/'), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith('(') && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[_] = new X(e, r)),
      n
    );
  }
  parseSegment() {
    let e = D0(this.remaining);
    if (e === '' && this.peekStartsWith(';')) throw new V(4009, !1);
    return this.capture(e), new at(zr(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(';'); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = xC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = '';
    if (this.consumeOptional('=')) {
      let i = D0(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[zr(r)] = zr(n);
  }
  parseQueryParam(e) {
    let r = SC(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = '';
    if (this.consumeOptional('=')) {
      let a = EC(this.remaining);
      a && ((n = a), this.capture(n));
    }
    let i = O7(r),
      c = O7(n);
    if (e.hasOwnProperty(i)) {
      let a = e[i];
      Array.isArray(a) || ((a = [a]), (e[i] = a)), a.push(c);
    } else e[i] = c;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture('(');
      !this.consumeOptional(')') && this.remaining.length > 0;

    ) {
      let n = D0(this.remaining),
        i = this.remaining[n.length];
      if (i !== '/' && i !== ')' && i !== ';') throw new V(4010, !1);
      let c;
      n.indexOf(':') > -1
        ? ((c = n.slice(0, n.indexOf(':'))), this.capture(c), this.capture(':'))
        : e && (c = _);
      let a = this.parseChildren();
      (r[c] = Object.keys(a).length === 1 ? a[_] : new X([], a)),
        this.consumeOptional('//');
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new V(4011, !1);
  }
};
function tl(t) {
  return t.segments.length > 0 ? new X([], { [_]: t }) : t;
}
function nl(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let c = nl(i);
    if (n === _ && c.segments.length === 0 && c.hasChildren())
      for (let [a, s] of Object.entries(c.children)) e[a] = s;
    else (c.segments.length > 0 || c.hasChildren()) && (e[n] = c);
  }
  let r = new X(t.segments, e);
  return IC(r);
}
function IC(t) {
  if (t.numberOfChildren === 1 && t.children[_]) {
    let e = t.children[_];
    return new X(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function Qt(t) {
  return t instanceof He;
}
function AC(t, e, r = null, n = null) {
  let i = rl(t);
  return il(i, e, r, n);
}
function rl(t) {
  let e;
  function r(c) {
    let a = {};
    for (let o of c.children) {
      let l = r(o);
      a[o.outlet] = l;
    }
    let s = new X(c.url, a);
    return c === t && (e = s), s;
  }
  let n = r(t.root),
    i = tl(n);
  return e ?? i;
}
function il(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return x0(i, i, i, r, n);
  let c = TC(e);
  if (c.toRoot()) return x0(i, i, new X([], {}), r, n);
  let a = kC(c, i, t),
    s = a.processChildren
      ? G3(a.segmentGroup, a.index, c.commands)
      : al(a.segmentGroup, a.index, c.commands);
  return x0(i, a.segmentGroup, s, r, n);
}
function br(t) {
  return typeof t == 'object' && t != null && !t.outlets && !t.segmentPath;
}
function Q3(t) {
  return typeof t == 'object' && t != null && t.outlets;
}
function x0(t, e, r, n, i) {
  let c = {};
  n &&
    Object.entries(n).forEach(([o, l]) => {
      c[o] = Array.isArray(l) ? l.map((f) => `${f}`) : `${l}`;
    });
  let a;
  t === e ? (a = r) : (a = cl(t, e, r));
  let s = tl(nl(a));
  return new He(s, c, i);
}
function cl(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, c]) => {
      c === e ? (n[i] = r) : (n[i] = cl(c, e, r));
    }),
    new X(t.segments, n)
  );
}
var wr = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && br(n[0]))
    )
      throw new V(4003, !1);
    let i = n.find(Q3);
    if (i && i !== Y7(n)) throw new V(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/'
    );
  }
};
function TC(t) {
  if (typeof t[0] == 'string' && t.length === 1 && t[0] === '/')
    return new wr(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, c, a) => {
      if (typeof c == 'object' && c != null) {
        if (c.outlets) {
          let s = {};
          return (
            Object.entries(c.outlets).forEach(([o, l]) => {
              s[o] = typeof l == 'string' ? l.split('/') : l;
            }),
            [...i, { outlets: s }]
          );
        }
        if (c.segmentPath) return [...i, c.segmentPath];
      }
      return typeof c != 'string'
        ? [...i, c]
        : a === 0
        ? (c.split('/').forEach((s, o) => {
            (o == 0 && s === '.') ||
              (o == 0 && s === ''
                ? (r = !0)
                : s === '..'
                ? e++
                : s != '' && i.push(s));
          }),
          i)
        : [...i, c];
    }, []);
  return new wr(r, e, n);
}
var qt = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function kC(t, e, r) {
  if (t.isAbsolute) return new qt(e, !0, 0);
  if (!r) return new qt(e, !1, NaN);
  if (r.parent === null) return new qt(r, !0, 0);
  let n = br(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return _C(r, i, t.numberOfDoubleDots);
}
function _C(t, e, r) {
  let n = t,
    i = e,
    c = r;
  for (; c > i; ) {
    if (((c -= i), (n = n.parent), !n)) throw new V(4005, !1);
    i = n.segments.length;
  }
  return new qt(n, !1, i - c);
}
function RC(t) {
  return Q3(t[0]) ? t[0].outlets : { [_]: t };
}
function al(t, e, r) {
  if (((t ??= new X([], {})), t.segments.length === 0 && t.hasChildren()))
    return G3(t, e, r);
  let n = PC(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let c = new X(t.segments.slice(0, n.pathIndex), {});
    return (
      (c.children[_] = new X(t.segments.slice(n.pathIndex), t.children)),
      G3(c, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new X(t.segments, {})
      : n.match && !t.hasChildren()
      ? T0(t, e, r)
      : n.match
      ? G3(t, 0, i)
      : T0(t, e, r);
}
function G3(t, e, r) {
  if (r.length === 0) return new X(t.segments, {});
  {
    let n = RC(r),
      i = {};
    if (
      Object.keys(n).some((c) => c !== _) &&
      t.children[_] &&
      t.numberOfChildren === 1 &&
      t.children[_].segments.length === 0
    ) {
      let c = G3(t.children[_], e, r);
      return new X(t.segments, c.children);
    }
    return (
      Object.entries(n).forEach(([c, a]) => {
        typeof a == 'string' && (a = [a]),
          a !== null && (i[c] = al(t.children[c], e, a));
      }),
      Object.entries(t.children).forEach(([c, a]) => {
        n[c] === void 0 && (i[c] = a);
      }),
      new X(t.segments, i)
    );
  }
}
function PC(t, e, r) {
  let n = 0,
    i = e,
    c = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return c;
    let a = t.segments[i],
      s = r[n];
    if (Q3(s)) break;
    let o = `${s}`,
      l = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && o === void 0) break;
    if (o && l && typeof l == 'object' && l.outlets === void 0) {
      if (!j7(o, l, a)) return c;
      n += 2;
    } else {
      if (!j7(o, {}, a)) return c;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function T0(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let c = r[i];
    if (Q3(c)) {
      let o = FC(c.outlets);
      return new X(n, o);
    }
    if (i === 0 && br(r[0])) {
      let o = t.segments[e];
      n.push(new at(o.path, B7(r[0]))), i++;
      continue;
    }
    let a = Q3(c) ? c.outlets[_] : `${c}`,
      s = i < r.length - 1 ? r[i + 1] : null;
    a && s && br(s)
      ? (n.push(new at(a, B7(s))), (i += 2))
      : (n.push(new at(a, {})), i++);
  }
  return new X(n, {});
}
function FC(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == 'string' && (n = [n]),
        n !== null && (e[r] = T0(new X([], {}), 0, n));
    }),
    e
  );
}
function B7(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function j7(t, e, r) {
  return t == r.path && I1(e, r.parameters);
}
var q3 = 'imperative',
  x2 = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = 'NavigationStart'),
      (t[(t.NavigationEnd = 1)] = 'NavigationEnd'),
      (t[(t.NavigationCancel = 2)] = 'NavigationCancel'),
      (t[(t.NavigationError = 3)] = 'NavigationError'),
      (t[(t.RoutesRecognized = 4)] = 'RoutesRecognized'),
      (t[(t.ResolveStart = 5)] = 'ResolveStart'),
      (t[(t.ResolveEnd = 6)] = 'ResolveEnd'),
      (t[(t.GuardsCheckStart = 7)] = 'GuardsCheckStart'),
      (t[(t.GuardsCheckEnd = 8)] = 'GuardsCheckEnd'),
      (t[(t.RouteConfigLoadStart = 9)] = 'RouteConfigLoadStart'),
      (t[(t.RouteConfigLoadEnd = 10)] = 'RouteConfigLoadEnd'),
      (t[(t.ChildActivationStart = 11)] = 'ChildActivationStart'),
      (t[(t.ChildActivationEnd = 12)] = 'ChildActivationEnd'),
      (t[(t.ActivationStart = 13)] = 'ActivationStart'),
      (t[(t.ActivationEnd = 14)] = 'ActivationEnd'),
      (t[(t.Scroll = 15)] = 'Scroll'),
      (t[(t.NavigationSkipped = 16)] = 'NavigationSkipped'),
      t
    );
  })(x2 || {}),
  l1 = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  Zt = class extends l1 {
    constructor(e, r, n = 'imperative', i = null) {
      super(e, r),
        (this.type = x2.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  X1 = class extends l1 {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = x2.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  e1 = (function (t) {
    return (
      (t[(t.Redirect = 0)] = 'Redirect'),
      (t[(t.SupersededByNewNavigation = 1)] = 'SupersededByNewNavigation'),
      (t[(t.NoDataFromResolver = 2)] = 'NoDataFromResolver'),
      (t[(t.GuardRejected = 3)] = 'GuardRejected'),
      t
    );
  })(e1 || {}),
  Dr = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = 'IgnoredSameUrlNavigation'),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        'IgnoredByUrlHandlingStrategy'),
      t
    );
  })(Dr || {}),
  ze = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = x2.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  be = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = x2.NavigationSkipped);
    }
  },
  Z3 = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = x2.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  xr = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = x2.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  k0 = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = x2.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  _0 = class extends l1 {
    constructor(e, r, n, i, c) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = c),
        (this.type = x2.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  R0 = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = x2.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  P0 = class extends l1 {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = x2.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  F0 = class {
    constructor(e) {
      (this.route = e), (this.type = x2.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  O0 = class {
    constructor(e) {
      (this.route = e), (this.type = x2.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  B0 = class {
    constructor(e) {
      (this.snapshot = e), (this.type = x2.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
      }')`;
    }
  },
  j0 = class {
    constructor(e) {
      (this.snapshot = e), (this.type = x2.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
      }')`;
    }
  },
  U0 = class {
    constructor(e) {
      (this.snapshot = e), (this.type = x2.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
      }')`;
    }
  },
  $0 = class {
    constructor(e) {
      (this.snapshot = e), (this.type = x2.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''
      }')`;
    }
  },
  Lr = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = x2.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  X3 = class {},
  K3 = class {
    constructor(e) {
      this.url = e;
    }
  };
var G0 = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new i4()),
        (this.attachRef = null);
    }
  },
  i4 = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let c = this.getOrCreateContext(n);
        (c.outlet = i), this.contexts.set(n, c);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new G0()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Sr = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = q0(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = q0(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = W0(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return W0(e, this._root).map((r) => r.value);
    }
  };
function q0(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = q0(t, r);
    if (n) return n;
  }
  return null;
}
function W0(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = W0(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var J2 = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Gt(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Nr = class extends Sr {
  constructor(e, r) {
    super(e), (this.snapshot = r), ra(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function sl(t) {
  let e = OC(t),
    r = new L2([new at('', {})]),
    n = new L2({}),
    i = new L2({}),
    c = new L2({}),
    a = new L2(''),
    s = new Xt(r, n, c, a, i, _, t, e.root);
  return (s.snapshot = e.root), new Nr(new J2(s, []), e);
}
function OC(t) {
  let e = {},
    r = {},
    n = {},
    i = '',
    c = new J3([], e, n, i, r, _, t, null, {});
  return new Er('', new J2(c, []));
}
var Xt = class {
  constructor(e, r, n, i, c, a, s, o) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = c),
      (this.outlet = a),
      (this.component = s),
      (this._futureSnapshot = o),
      (this.title = this.dataSubject?.pipe(k((l) => l[n4])) ?? S(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = c);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(k((e) => Yt(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(k((e) => Yt(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function na(t, e, r = 'emptyOnly') {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === 'always' ||
      i?.path === '' ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: M(M({}, e.params), t.params),
          data: M(M({}, e.data), t.data),
          resolve: M(M(M(M({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: M({}, t.params),
          data: M({}, t.data),
          resolve: M(M({}, t.data), t._resolvedData ?? {}),
        }),
    i && ll(i) && (n.resolve[n4] = i.title),
    n
  );
}
var J3 = class {
    get title() {
      return this.data?.[n4];
    }
    constructor(e, r, n, i, c, a, s, o, l) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = c),
        (this.outlet = a),
        (this.component = s),
        (this.routeConfig = o),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Yt(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Yt(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join('/'),
        r = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  Er = class extends Sr {
    constructor(e, r) {
      super(r), (this.url = e), ra(this, r);
    }
    toString() {
      return ol(this._root);
    }
  };
function ra(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => ra(t, r));
}
function ol(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(ol).join(', ')} } ` : '';
  return `${t.value}${e}`;
}
function L0(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      I1(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      I1(e.params, r.params) || t.paramsSubject.next(r.params),
      mC(e.url, r.url) || t.urlSubject.next(r.url),
      I1(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function Y0(t, e) {
  let r = I1(t.params, e.params) && MC(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Y0(t.parent, e.parent));
}
function ll(t) {
  return typeof t.title == 'string' || t.title === null;
}
var ia = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = _),
          (this.activateEvents = new o2()),
          (this.deactivateEvents = new o2()),
          (this.attachEvents = new o2()),
          (this.detachEvents = new o2()),
          (this.parentContexts = g(i4)),
          (this.location = g(Ce)),
          (this.changeDetector = g(rt)),
          (this.environmentInjector = g(R2)),
          (this.inputBinder = g(_r, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: c } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(c) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(c)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new V(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new V(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new V(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new V(4013, !1);
        this._activatedRoute = n;
        let c = this.location,
          s = n.snapshot.component,
          o = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Q0(n, o, c.injector);
        (this.activated = c.createComponent(s, {
          index: c.length,
          injector: l,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['router-outlet']],
        inputs: { name: 'name' },
        outputs: {
          activateEvents: 'activate',
          deactivateEvents: 'deactivate',
          attachEvents: 'attach',
          detachEvents: 'detach',
        },
        exportAs: ['outlet'],
        standalone: !0,
        features: [X2],
      }));
    let t = e;
    return t;
  })(),
  Q0 = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === Xt
        ? this.route
        : e === i4
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  _r = new w(''),
  U7 = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          c = u3([i.queryParams, i.params, i.data])
            .pipe(
              j2(
                ([a, s, o], l) => (
                  (o = M(M(M({}, a), s), o)),
                  l === 0 ? S(o) : Promise.resolve(o)
                )
              )
            )
            .subscribe((a) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let s = X5(i.component);
              if (!s) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: o } of s.inputs)
                n.activatedComponentRef.setInput(o, a[o]);
            });
        this.outletDataSubscriptions.set(n, c);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function BC(t, e, r) {
  let n = e4(t, e._root, r ? r._root : void 0);
  return new Nr(n, e);
}
function e4(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = jC(t, e, r);
    return new J2(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let c = t.retrieve(e.value);
      if (c !== null) {
        let a = c.route;
        return (
          (a.value._futureSnapshot = e.value),
          (a.children = e.children.map((s) => e4(t, s))),
          a
        );
      }
    }
    let n = UC(e.value),
      i = e.children.map((c) => e4(t, c));
    return new J2(n, i);
  }
}
function jC(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return e4(t, n, i);
    return e4(t, n);
  });
}
function UC(t) {
  return new Xt(
    new L2(t.url),
    new L2(t.params),
    new L2(t.queryParams),
    new L2(t.fragment),
    new L2(t.data),
    t.outlet,
    t.component,
    t
  );
}
var fl = 'ngNavigationCancelingError';
function ul(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = Qt(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = dl(!1, e1.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function dl(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ''}`);
  return (r[fl] = !0), (r.cancellationCode = e), r;
}
function $C(t) {
  return hl(t) && Qt(t.url);
}
function hl(t) {
  return !!t && t[fl];
}
var GC = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['ng-component']],
      standalone: !0,
      features: [T3],
      decls: 1,
      vars: 0,
      template: function (i, c) {
        i & 1 && Z(0, 'router-outlet');
      },
      dependencies: [ia],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function qC(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = Gn(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function ca(t) {
  let e = t.children && t.children.map(ca),
    r = e ? J(M({}, t), { children: e }) : M({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== _ &&
      (r.component = GC),
    r
  );
}
function A1(t) {
  return t.outlet || _;
}
function WC(t, e) {
  let r = t.filter((n) => A1(n) === e);
  return r.push(...t.filter((n) => A1(n) !== e)), r;
}
function c4(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var YC = (t, e, r, n) =>
    k(
      (i) => (
        new Z0(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Z0 = class {
    constructor(e, r, n, i, c) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = c);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        L0(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = Gt(r);
      e.children.forEach((c) => {
        let a = c.value.outlet;
        this.deactivateRoutes(c, i[a], n), delete i[a];
      }),
        Object.values(i).forEach((c) => {
          this.deactivateRouteAndItsChildren(c, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        c = r ? r.value : null;
      if (i === c)
        if (i.component) {
          let a = n.getContext(i.outlet);
          a && this.deactivateChildRoutes(e, r, a.children);
        } else this.deactivateChildRoutes(e, r, n);
      else c && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        c = Gt(e);
      for (let a of Object.values(c)) this.deactivateRouteAndItsChildren(a, i);
      if (n && n.outlet) {
        let a = n.outlet.detach(),
          s = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: a,
          route: e,
          contexts: s,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        c = Gt(e);
      for (let a of Object.values(c)) this.deactivateRouteAndItsChildren(a, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = Gt(r);
      e.children.forEach((c) => {
        this.activateRoutes(c, i[c.value.outlet], n),
          this.forwardEvent(new $0(c.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new j0(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        c = r ? r.value : null;
      if ((L0(i), i === c))
        if (i.component) {
          let a = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, a.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let a = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let s = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            a.children.onOutletReAttached(s.contexts),
            (a.attachRef = s.componentRef),
            (a.route = s.route.value),
            a.outlet && a.outlet.attach(s.componentRef, s.route.value),
            L0(s.route.value),
            this.activateChildRoutes(e, null, a.children);
        } else {
          let s = c4(i.snapshot);
          (a.attachRef = null),
            (a.route = i),
            (a.injector = s),
            a.outlet && a.outlet.activateWith(i, a.injector),
            this.activateChildRoutes(e, null, a.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  Ir = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Wt = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function QC(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return U3(n, i, r, [n.value]);
}
function ZC(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Jt(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == 'function' && !Vo(t) ? t : e.get(t)) : n;
}
function U3(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let c = Gt(e);
  return (
    t.children.forEach((a) => {
      XC(a, c[a.value.outlet], r, n.concat([a.value]), i),
        delete c[a.value.outlet];
    }),
    Object.entries(c).forEach(([a, s]) => W3(s, r.getContext(a), i)),
    i
  );
}
function XC(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let c = t.value,
    a = e ? e.value : null,
    s = r ? r.getContext(t.value.outlet) : null;
  if (a && c.routeConfig === a.routeConfig) {
    let o = KC(a, c, c.routeConfig.runGuardsAndResolvers);
    o
      ? i.canActivateChecks.push(new Ir(n))
      : ((c.data = a.data), (c._resolvedData = a._resolvedData)),
      c.component ? U3(t, e, s ? s.children : null, n, i) : U3(t, e, r, n, i),
      o &&
        s &&
        s.outlet &&
        s.outlet.isActivated &&
        i.canDeactivateChecks.push(new Wt(s.outlet.component, a));
  } else
    a && W3(e, s, i),
      i.canActivateChecks.push(new Ir(n)),
      c.component
        ? U3(t, null, s ? s.children : null, n, i)
        : U3(t, null, r, n, i);
  return i;
}
function KC(t, e, r) {
  if (typeof r == 'function') return r(t, e);
  switch (r) {
    case 'pathParamsChange':
      return !st(t.url, e.url);
    case 'pathParamsOrQueryParamsChange':
      return !st(t.url, e.url) || !I1(t.queryParams, e.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !Y0(t, e) || !I1(t.queryParams, e.queryParams);
    case 'paramsChange':
    default:
      return !Y0(t, e);
  }
}
function W3(t, e, r) {
  let n = Gt(t),
    i = t.value;
  Object.entries(n).forEach(([c, a]) => {
    i.component
      ? e
        ? W3(a, e.children.getContext(c), r)
        : W3(a, null, r)
      : W3(a, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Wt(e.outlet.component, i))
        : r.canDeactivateChecks.push(new Wt(null, i))
      : r.canDeactivateChecks.push(new Wt(null, i));
}
function a4(t) {
  return typeof t == 'function';
}
function JC(t) {
  return typeof t == 'boolean';
}
function eM(t) {
  return t && a4(t.canLoad);
}
function tM(t) {
  return t && a4(t.canActivate);
}
function nM(t) {
  return t && a4(t.canActivateChild);
}
function rM(t) {
  return t && a4(t.canDeactivate);
}
function iM(t) {
  return t && a4(t.canMatch);
}
function pl(t) {
  return t instanceof _1 || t?.name === 'EmptyError';
}
var yr = Symbol('INITIAL_VALUE');
function Kt() {
  return j2((t) =>
    u3(t.map((e) => e.pipe(P1(1), _6(yr)))).pipe(
      k((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === yr) return yr;
            if (r === !1 || r instanceof He) return r;
          }
        return !0;
      }),
      B2((e) => e !== yr),
      P1(1)
    )
  );
}
function cM(t, e) {
  return m2((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: c, canDeactivateChecks: a },
    } = r;
    return a.length === 0 && c.length === 0
      ? S(J(M({}, r), { guardsResult: !0 }))
      : aM(a, n, i, t).pipe(
          m2((s) => (s && JC(s) ? sM(n, c, t, e) : S(s))),
          k((s) => J(M({}, r), { guardsResult: s }))
        );
  });
}
function aM(t, e, r, n) {
  return i2(t).pipe(
    m2((i) => dM(i.component, i.route, r, e, n)),
    H1((i) => i !== !0, !0)
  );
}
function sM(t, e, r, n) {
  return i2(e).pipe(
    R1((i) =>
      yt(
        lM(i.route.parent, n),
        oM(i.route, n),
        uM(t, i.path, r),
        fM(t, i.route, r)
      )
    ),
    H1((i) => i !== !0, !0)
  );
}
function oM(t, e) {
  return t !== null && e && e(new U0(t)), S(!0);
}
function lM(t, e) {
  return t !== null && e && e(new B0(t)), S(!0);
}
function fM(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return S(!0);
  let i = n.map((c) =>
    G4(() => {
      let a = c4(e) ?? r,
        s = Jt(c, a),
        o = tM(s) ? s.canActivate(e, t) : g1(a, () => s(e, t));
      return we(o).pipe(H1());
    })
  );
  return S(i).pipe(Kt());
}
function uM(t, e, r) {
  let n = e[e.length - 1],
    c = e
      .slice(0, e.length - 1)
      .reverse()
      .map((a) => ZC(a))
      .filter((a) => a !== null)
      .map((a) =>
        G4(() => {
          let s = a.guards.map((o) => {
            let l = c4(a.node) ?? r,
              f = Jt(o, l),
              u = nM(f) ? f.canActivateChild(n, t) : g1(l, () => f(n, t));
            return we(u).pipe(H1());
          });
          return S(s).pipe(Kt());
        })
      );
  return S(c).pipe(Kt());
}
function dM(t, e, r, n, i) {
  let c = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!c || c.length === 0) return S(!0);
  let a = c.map((s) => {
    let o = c4(e) ?? i,
      l = Jt(s, o),
      f = rM(l) ? l.canDeactivate(t, e, r, n) : g1(o, () => l(t, e, r, n));
    return we(f).pipe(H1());
  });
  return S(a).pipe(Kt());
}
function hM(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return S(!0);
  let c = i.map((a) => {
    let s = Jt(a, t),
      o = eM(s) ? s.canLoad(e, r) : g1(t, () => s(e, r));
    return we(o);
  });
  return S(c).pipe(Kt(), ml(n));
}
function ml(t) {
  return x6(
    g2((e) => {
      if (Qt(e)) throw ul(t, e);
    }),
    k((e) => e === !0)
  );
}
function pM(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return S(!0);
  let c = i.map((a) => {
    let s = Jt(a, t),
      o = iM(s) ? s.canMatch(e, r) : g1(t, () => s(e, r));
    return we(o);
  });
  return S(c).pipe(Kt(), ml(n));
}
var t4 = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Ar = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function $t(t) {
  return ae(new t4(t));
}
function mM(t) {
  return ae(new V(4e3, !1));
}
function gM(t) {
  return ae(dl(!1, e1.GuardRejected));
}
var X0 = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return S(n);
        if (i.numberOfChildren > 1 || !i.children[_]) return mM(e.redirectTo);
        i = i.children[_];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith('/')) throw new Ar(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let c = this.createSegmentGroup(e, r.root, n, i);
      return new He(
        c,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, c]) => {
          if (typeof c == 'string' && c.startsWith(':')) {
            let s = c.substring(1);
            n[i] = r[s];
          } else n[i] = c;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let c = this.createSegments(e, r.segments, n, i),
        a = {};
      return (
        Object.entries(r.children).forEach(([s, o]) => {
          a[s] = this.createSegmentGroup(e, o, n, i);
        }),
        new X(c, a)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((c) =>
        c.path.startsWith(':')
          ? this.findPosParam(e, c, i)
          : this.findOrReturn(c, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new V(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  K0 = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function vM(t, e, r, n, i) {
  let c = aa(t, e, r);
  return c.matched
    ? ((n = qC(e, n)),
      pM(n, e, r, i).pipe(k((a) => (a === !0 ? c : M({}, K0)))))
    : S(c);
}
function aa(t, e, r) {
  if (e.path === '**') return CM(r);
  if (e.path === '')
    return e.pathMatch === 'full' && (t.hasChildren() || r.length > 0)
      ? M({}, K0)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || pC)(r, t, e);
  if (!i) return M({}, K0);
  let c = {};
  Object.entries(i.posParams ?? {}).forEach(([s, o]) => {
    c[s] = o.path;
  });
  let a =
    i.consumed.length > 0
      ? M(M({}, c), i.consumed[i.consumed.length - 1].parameters)
      : c;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: a,
    positionalParamSegments: i.posParams ?? {},
  };
}
function CM(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Y7(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function $7(t, e, r, n) {
  return r.length > 0 && VM(t, r, n)
    ? {
        segmentGroup: new X(e, yM(n, new X(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && HM(t, r, n)
    ? {
        segmentGroup: new X(t.segments, MM(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new X(t.segments, t.children), slicedSegments: r };
}
function MM(t, e, r, n) {
  let i = {};
  for (let c of r)
    if (Rr(t, e, c) && !n[A1(c)]) {
      let a = new X([], {});
      i[A1(c)] = a;
    }
  return M(M({}, n), i);
}
function yM(t, e) {
  let r = {};
  r[_] = e;
  for (let n of t)
    if (n.path === '' && A1(n) !== _) {
      let i = new X([], {});
      r[A1(n)] = i;
    }
  return r;
}
function VM(t, e, r) {
  return r.some((n) => Rr(t, e, n) && A1(n) !== _);
}
function HM(t, e, r) {
  return r.some((n) => Rr(t, e, n));
}
function Rr(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === 'full'
    ? !1
    : r.path === '';
}
function zM(t, e, r, n) {
  return A1(t) !== n && (n === _ || !Rr(e, r, t)) ? !1 : aa(e, t, r).matched;
}
function bM(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var J0 = class {};
function wM(t, e, r, n, i, c, a = 'emptyOnly') {
  return new ea(t, e, r, n, i, a, c).recognize();
}
var DM = 31,
  ea = class {
    constructor(e, r, n, i, c, a, s) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = c),
        (this.paramsInheritanceStrategy = a),
        (this.urlSerializer = s),
        (this.applyRedirects = new X0(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new V(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = $7(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        k((r) => {
          let n = new J3(
              [],
              Object.freeze({}),
              Object.freeze(M({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              _,
              this.rootComponentType,
              null,
              {}
            ),
            i = new J2(n, r),
            c = new Er('', i),
            a = AC(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (a.queryParams = this.urlTree.queryParams),
            (c.url = this.urlSerializer.serialize(a)),
            this.inheritParamsAndData(c._root, null),
            { state: c, tree: a }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, _).pipe(
        n1((n) => {
          if (n instanceof Ar)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof t4 ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = na(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((c) => this.inheritParamsAndData(c, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            k((c) => (c instanceof J2 ? [c] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let c of Object.keys(n.children))
        c === 'primary' ? i.unshift(c) : i.push(c);
      return i2(i).pipe(
        R1((c) => {
          let a = n.children[c],
            s = WC(r, c);
          return this.processSegmentGroup(e, s, a, c);
        }),
        k6((c, a) => (c.push(...a), c)),
        se(null),
        T6(),
        m2((c) => {
          if (c === null) return $t(n);
          let a = gl(c);
          return xM(a), S(a);
        })
      );
    }
    processSegment(e, r, n, i, c, a) {
      return i2(r).pipe(
        R1((s) =>
          this.processSegmentAgainstRoute(
            s._injector ?? e,
            r,
            s,
            n,
            i,
            c,
            a
          ).pipe(
            n1((o) => {
              if (o instanceof t4) return S(null);
              throw o;
            })
          )
        ),
        H1((s) => !!s),
        n1((s) => {
          if (pl(s)) return bM(n, i, c) ? S(new J0()) : $t(n);
          throw s;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, c, a, s) {
      return zM(n, i, c, a)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, c, a)
          : this.allowRedirects && s
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, c, a)
          : $t(i)
        : $t(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, c, a) {
      let {
        matched: s,
        consumedSegments: o,
        positionalParamSegments: l,
        remainingSegments: f,
      } = aa(r, i, c);
      if (!s) return $t(r);
      i.redirectTo.startsWith('/') &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > DM && (this.allowRedirects = !1));
      let u = this.applyRedirects.applyRedirectCommands(o, i.redirectTo, l);
      return this.applyRedirects
        .lineralizeSegments(i, u)
        .pipe(m2((d) => this.processSegment(e, n, r, d.concat(f), a, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, c) {
      let a = vM(r, n, i, e, this.urlSerializer);
      return (
        n.path === '**' && (r.children = {}),
        a.pipe(
          j2((s) =>
            s.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  j2(({ routes: o }) => {
                    let l = n._loadedInjector ?? e,
                      {
                        consumedSegments: f,
                        remainingSegments: u,
                        parameters: d,
                      } = s,
                      h = new J3(
                        f,
                        d,
                        Object.freeze(M({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        SM(n),
                        A1(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        NM(n)
                      ),
                      { segmentGroup: C, slicedSegments: N } = $7(r, f, u, o);
                    if (N.length === 0 && C.hasChildren())
                      return this.processChildren(l, o, C).pipe(
                        k((b) => (b === null ? null : new J2(h, b)))
                      );
                    if (o.length === 0 && N.length === 0)
                      return S(new J2(h, []));
                    let L = A1(n) === c;
                    return this.processSegment(l, o, C, N, L ? _ : c, !0).pipe(
                      k((b) => new J2(h, b instanceof J2 ? [b] : []))
                    );
                  })
                ))
              : $t(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? S({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? S({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : hM(e, r, n, this.urlSerializer).pipe(
              m2((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      g2((c) => {
                        (r._loadedRoutes = c.routes),
                          (r._loadedInjector = c.injector);
                      })
                    )
                  : gM(r)
              )
            )
        : S({ routes: [], injector: e });
    }
  };
function xM(t) {
  t.sort((e, r) =>
    e.value.outlet === _
      ? -1
      : r.value.outlet === _
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function LM(t) {
  let e = t.value.routeConfig;
  return e && e.path === '';
}
function gl(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!LM(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((c) => n.value.routeConfig === c.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = gl(n.children);
    e.push(new J2(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function SM(t) {
  return t.data || {};
}
function NM(t) {
  return t.resolve || {};
}
function EM(t, e, r, n, i, c) {
  return m2((a) =>
    wM(t, e, r, n, a.extractedUrl, i, c).pipe(
      k(({ state: s, tree: o }) =>
        J(M({}, a), { targetSnapshot: s, urlAfterRedirects: o })
      )
    )
  );
}
function IM(t, e) {
  return m2((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return S(r);
    let c = new Set(i.map((o) => o.route)),
      a = new Set();
    for (let o of c) if (!a.has(o)) for (let l of vl(o)) a.add(l);
    let s = 0;
    return i2(a).pipe(
      R1((o) =>
        c.has(o)
          ? AM(o, n, t, e)
          : ((o.data = na(o, o.parent, t).resolve), S(void 0))
      ),
      g2(() => s++),
      Vt(1),
      m2((o) => (s === a.size ? S(r) : W2))
    );
  });
}
function vl(t) {
  let e = t.children.map((r) => vl(r)).flat();
  return [t, ...e];
}
function AM(t, e, r, n) {
  let i = t.routeConfig,
    c = t._resolve;
  return (
    i?.title !== void 0 && !ll(i) && (c[n4] = i.title),
    TM(c, t, e, n).pipe(
      k(
        (a) => (
          (t._resolvedData = a), (t.data = na(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function TM(t, e, r, n) {
  let i = E0(t);
  if (i.length === 0) return S({});
  let c = {};
  return i2(i).pipe(
    m2((a) =>
      kM(t[a], e, r, n).pipe(
        H1(),
        g2((s) => {
          c[a] = s;
        })
      )
    ),
    Vt(1),
    A6(c),
    n1((a) => (pl(a) ? W2 : ae(a)))
  );
}
function kM(t, e, r, n) {
  let i = c4(e) ?? n,
    c = Jt(t, i),
    a = c.resolve ? c.resolve(e, r) : g1(i, () => c(e, r));
  return we(a);
}
function S0(t) {
  return j2((e) => {
    let r = t(e);
    return r ? i2(r).pipe(k(() => e)) : S(e);
  });
}
var Cl = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          c = n.root;
        for (; c !== void 0; )
          (i = this.getResolvedTitleForRoute(c) ?? i),
            (c = c.children.find((a) => a.outlet === _));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[n4];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => g(_M), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  _M = (() => {
    let e = class e extends Cl {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(P7));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  s4 = new w('', { providedIn: 'root', factory: () => ({}) }),
  Tr = new w(''),
  sa = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = g(Xn));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return S(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = we(n.loadComponent()).pipe(
            k(Ml),
            g2((a) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = a);
            }),
            oe(() => {
              this.componentLoaders.delete(n);
            })
          ),
          c = new Ct(i, () => new T2()).pipe(vt());
        return this.componentLoaders.set(n, c), c;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return S({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let a = RM(i, this.compiler, n, this.onLoadEndListener).pipe(
            oe(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          s = new Ct(a, () => new T2()).pipe(vt());
        return this.childrenLoaders.set(i, s), s;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function RM(t, e, r, n) {
  return we(t.loadChildren()).pipe(
    k(Ml),
    m2((i) =>
      i instanceof z3 || Array.isArray(i) ? S(i) : i2(e.compileModuleAsync(i))
    ),
    k((i) => {
      n && n(t);
      let c,
        a,
        s = !1;
      return (
        Array.isArray(i)
          ? ((a = i), (s = !0))
          : ((c = i.create(r).injector),
            (a = c.get(Tr, [], { optional: !0, self: !0 }).flat())),
        { routes: a.map(ca), injector: c }
      );
    })
  );
}
function PM(t) {
  return t && typeof t == 'object' && 'default' in t;
}
function Ml(t) {
  return PM(t) ? t.default : t;
}
var oa = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => g(FM), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  FM = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  yl = new w(''),
  Vl = new w('');
function OM(t, e, r) {
  let n = t.get(Vl),
    i = t.get(N2);
  return t.get(e2).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), Promise.resolve();
    let c,
      a = new Promise((l) => {
        c = l;
      }),
      s = i.startViewTransition(() => (c(), BM(t))),
      { onViewTransitionCreated: o } = n;
    return o && g1(t, () => o({ transition: s, from: e, to: r })), a;
  });
}
function BM(t) {
  return new Promise((e) => {
    _c(e, { injector: t });
  });
}
var la = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new T2()),
        (this.transitionAbortSubject = new T2()),
        (this.configLoader = g(sa)),
        (this.environmentInjector = g(R2)),
        (this.urlSerializer = g(r4)),
        (this.rootContexts = g(i4)),
        (this.location = g(jt)),
        (this.inputBindingEnabled = g(_r, { optional: !0 }) !== null),
        (this.titleStrategy = g(Cl)),
        (this.options = g(s4, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || 'emptyOnly'),
        (this.urlHandlingStrategy = g(oa)),
        (this.createViewTransition = g(yl, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => S(void 0)),
        (this.rootComponentType = null);
      let n = (c) => this.events.next(new F0(c)),
        i = (c) => this.events.next(new O0(c));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(J(M(M({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, c) {
      return (
        (this.transitions = new L2({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: q3,
          restoredState: null,
          currentSnapshot: c.snapshot,
          targetSnapshot: null,
          currentRouterState: c,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          B2((a) => a.id !== 0),
          k((a) =>
            J(M({}, a), {
              extractedUrl: this.urlHandlingStrategy.extract(a.rawUrl),
            })
          ),
          j2((a) => {
            let s = !1,
              o = !1;
            return S(a).pipe(
              j2((l) => {
                if (this.navigationId > a.id)
                  return (
                    this.cancelNavigationTransition(
                      a,
                      '',
                      e1.SupersededByNewNavigation
                    ),
                    W2
                  );
                (this.currentTransition = a),
                  (this.currentNavigation = {
                    id: l.id,
                    initialUrl: l.rawUrl,
                    extractedUrl: l.extractedUrl,
                    trigger: l.source,
                    extras: l.extras,
                    previousNavigation: this.lastSuccessfulNavigation
                      ? J(M({}, this.lastSuccessfulNavigation), {
                          previousNavigation: null,
                        })
                      : null,
                  });
                let f =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  u = l.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!f && u !== 'reload') {
                  let d = '';
                  return (
                    this.events.next(
                      new be(
                        l.id,
                        this.urlSerializer.serialize(l.rawUrl),
                        d,
                        Dr.IgnoredSameUrlNavigation
                      )
                    ),
                    l.resolve(null),
                    W2
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return S(l).pipe(
                    j2((d) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Zt(
                            d.id,
                            this.urlSerializer.serialize(d.extractedUrl),
                            d.source,
                            d.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? W2
                          : Promise.resolve(d)
                      );
                    }),
                    EM(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    g2((d) => {
                      (a.targetSnapshot = d.targetSnapshot),
                        (a.urlAfterRedirects = d.urlAfterRedirects),
                        (this.currentNavigation = J(
                          M({}, this.currentNavigation),
                          { finalUrl: d.urlAfterRedirects }
                        ));
                      let h = new xr(
                        d.id,
                        this.urlSerializer.serialize(d.extractedUrl),
                        this.urlSerializer.serialize(d.urlAfterRedirects),
                        d.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  f &&
                  this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)
                ) {
                  let {
                      id: d,
                      extractedUrl: h,
                      source: C,
                      restoredState: N,
                      extras: L,
                    } = l,
                    b = new Zt(d, this.urlSerializer.serialize(h), C, N);
                  this.events.next(b);
                  let U = sl(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = a =
                      J(M({}, l), {
                        targetSnapshot: U,
                        urlAfterRedirects: h,
                        extras: J(M({}, L), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    S(a)
                  );
                } else {
                  let d = '';
                  return (
                    this.events.next(
                      new be(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        d,
                        Dr.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    l.resolve(null),
                    W2
                  );
                }
              }),
              g2((l) => {
                let f = new k0(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot
                );
                this.events.next(f);
              }),
              k(
                (l) => (
                  (this.currentTransition = a =
                    J(M({}, l), {
                      guards: QC(
                        l.targetSnapshot,
                        l.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  a
                )
              ),
              cM(this.environmentInjector, (l) => this.events.next(l)),
              g2((l) => {
                if (((a.guardsResult = l.guardsResult), Qt(l.guardsResult)))
                  throw ul(this.urlSerializer, l.guardsResult);
                let f = new _0(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult
                );
                this.events.next(f);
              }),
              B2((l) =>
                l.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(l, '', e1.GuardRejected),
                    !1)
              ),
              S0((l) => {
                if (l.guards.canActivateChecks.length)
                  return S(l).pipe(
                    g2((f) => {
                      let u = new R0(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(u);
                    }),
                    j2((f) => {
                      let u = !1;
                      return S(f).pipe(
                        IM(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        g2({
                          next: () => (u = !0),
                          complete: () => {
                            u ||
                              this.cancelNavigationTransition(
                                f,
                                '',
                                e1.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    g2((f) => {
                      let u = new P0(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(u);
                    })
                  );
              }),
              S0((l) => {
                let f = (u) => {
                  let d = [];
                  u.routeConfig?.loadComponent &&
                    !u.routeConfig._loadedComponent &&
                    d.push(
                      this.configLoader.loadComponent(u.routeConfig).pipe(
                        g2((h) => {
                          u.component = h;
                        }),
                        k(() => {})
                      )
                    );
                  for (let h of u.children) d.push(...f(h));
                  return d;
                };
                return u3(f(l.targetSnapshot.root)).pipe(se(null), P1(1));
              }),
              S0(() => this.afterPreactivation()),
              j2(() => {
                let { currentSnapshot: l, targetSnapshot: f } = a,
                  u = this.createViewTransition?.(
                    this.environmentInjector,
                    l.root,
                    f.root
                  );
                return u ? i2(u).pipe(k(() => a)) : S(a);
              }),
              k((l) => {
                let f = BC(
                  n.routeReuseStrategy,
                  l.targetSnapshot,
                  l.currentRouterState
                );
                return (
                  (this.currentTransition = a =
                    J(M({}, l), { targetRouterState: f })),
                  (this.currentNavigation.targetRouterState = f),
                  a
                );
              }),
              g2(() => {
                this.events.next(new X3());
              }),
              YC(
                this.rootContexts,
                n.routeReuseStrategy,
                (l) => this.events.next(l),
                this.inputBindingEnabled
              ),
              P1(1),
              g2({
                next: (l) => {
                  (s = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new X1(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      l.targetRouterState.snapshot
                    ),
                    l.resolve(!0);
                },
                complete: () => {
                  s = !0;
                },
              }),
              R6(
                this.transitionAbortSubject.pipe(
                  g2((l) => {
                    throw l;
                  })
                )
              ),
              oe(() => {
                !s &&
                  !o &&
                  this.cancelNavigationTransition(
                    a,
                    '',
                    e1.SupersededByNewNavigation
                  ),
                  this.currentTransition?.id === a.id &&
                    ((this.currentNavigation = null),
                    (this.currentTransition = null));
              }),
              n1((l) => {
                if (((o = !0), hl(l)))
                  this.events.next(
                    new ze(
                      a.id,
                      this.urlSerializer.serialize(a.extractedUrl),
                      l.message,
                      l.cancellationCode
                    )
                  ),
                    $C(l) ? this.events.next(new K3(l.url)) : a.resolve(!1);
                else {
                  this.events.next(
                    new Z3(
                      a.id,
                      this.urlSerializer.serialize(a.extractedUrl),
                      l,
                      a.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    a.resolve(n.errorHandler(l));
                  } catch (f) {
                    this.options.resolveNavigationPromiseOnError
                      ? a.resolve(!1)
                      : a.reject(f);
                  }
                }
                return W2;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, c) {
      let a = new ze(n.id, this.urlSerializer.serialize(n.extractedUrl), i, c);
      this.events.next(a), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function jM(t) {
  return t !== q3;
}
var UM = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => g($M), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  ta = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  $M = (() => {
    let e = class e extends ta {};
    (e.ɵfac = (() => {
      let n;
      return function (c) {
        return (n || (n = ve(e)))(c || e);
      };
    })()),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Hl = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: () => g(GM), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  GM = (() => {
    let e = class e extends Hl {
      constructor() {
        super(...arguments),
          (this.location = g(jt)),
          (this.urlSerializer = g(r4)),
          (this.options = g(s4, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = g(oa)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new He()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = sl(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === 'popstate' && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof Zt) this.stateMemento = this.createStateMemento();
        else if (n instanceof be) this.rawUrlTree = i.initialUrl;
        else if (n instanceof xr) {
          if (
            this.urlUpdateStrategy === 'eager' &&
            !i.extras.skipLocationChange
          ) {
            let c = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(c, i);
          }
        } else
          n instanceof X3
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof ze &&
              (n.code === e1.GuardRejected || n.code === e1.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof Z3
            ? this.restoreHistory(i, !0)
            : n instanceof X1 &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let c = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(c) || i.extras.replaceUrl) {
          let a = this.browserPageId,
            s = M(M({}, i.extras.state), this.generateNgRouterState(i.id, a));
          this.location.replaceState(c, '', s);
        } else {
          let a = M(
            M({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(c, '', a);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let c = this.browserPageId,
            a = this.currentPageId - c;
          a !== 0
            ? this.location.historyGo(a)
            : this.currentUrlTree === n.finalUrl &&
              a === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === 'replace' &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === 'computed'
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (c) {
        return (n || (n = ve(e)))(c || e);
      };
    })()),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  $3 = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = 'COMPLETE'),
      (t[(t.FAILED = 1)] = 'FAILED'),
      (t[(t.REDIRECTING = 2)] = 'REDIRECTING'),
      t
    );
  })($3 || {});
function zl(t, e) {
  t.events
    .pipe(
      B2(
        (r) =>
          r instanceof X1 ||
          r instanceof ze ||
          r instanceof Z3 ||
          r instanceof be
      ),
      k((r) =>
        r instanceof X1 || r instanceof be
          ? $3.COMPLETE
          : (
              r instanceof ze
                ? r.code === e1.Redirect ||
                  r.code === e1.SupersededByNewNavigation
                : !1
            )
          ? $3.REDIRECTING
          : $3.FAILED
      ),
      B2((r) => r !== $3.REDIRECTING),
      P1(1)
    )
    .subscribe(() => {
      e();
    });
}
function qM(t) {
  throw t;
}
var WM = {
    paths: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'exact',
  },
  YM = {
    paths: 'subset',
    fragment: 'ignored',
    matrixParams: 'ignored',
    queryParams: 'subset',
  },
  F2 = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = g(qn)),
          (this.stateManager = g(Hl)),
          (this.options = g(s4, { optional: !0 }) || {}),
          (this.pendingTasks = g(tt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = g(la)),
          (this.urlSerializer = g(r4)),
          (this.location = g(jt)),
          (this.urlHandlingStrategy = g(oa)),
          (this._events = new T2()),
          (this.errorHandler = this.options.errorHandler || qM),
          (this.navigated = !1),
          (this.routeReuseStrategy = g(UM)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || 'ignore'),
          (this.config = g(Tr, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!g(_r, { optional: !0 })),
          (this.eventsSubscription = new y2()),
          (this.isNgZoneEnabled = g(e2) instanceof e2 && e2.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let c = this.navigationTransitions.currentTransition,
              a = this.navigationTransitions.currentNavigation;
            if (c !== null && a !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, a),
                i instanceof ze &&
                  i.code !== e1.Redirect &&
                  i.code !== e1.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof X1) this.navigated = !0;
              else if (i instanceof K3) {
                let s = this.urlHandlingStrategy.merge(i.url, c.currentRawUrl),
                  o = {
                    info: c.extras.info,
                    skipLocationChange: c.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === 'eager' || jM(c.source),
                  };
                this.scheduleNavigation(s, q3, null, o, {
                  resolve: c.resolve,
                  reject: c.reject,
                  promise: c.promise,
                });
              }
            }
            ZM(i) && this._events.next(i);
          } catch (c) {
            this.navigationTransitions.transitionAbortSubject.next(c);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              q3,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, 'popstate', i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, c) {
        let a = { replaceUrl: !0 },
          s = c?.navigationId ? c : null;
        if (c) {
          let l = M({}, c);
          delete l.navigationId,
            delete l.ɵrouterPageId,
            Object.keys(l).length !== 0 && (a.state = l);
        }
        let o = this.parseUrl(n);
        this.scheduleNavigation(o, i, s, a);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(ca)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: c,
            queryParams: a,
            fragment: s,
            queryParamsHandling: o,
            preserveFragment: l,
          } = i,
          f = l ? this.currentUrlTree.fragment : s,
          u = null;
        switch (o) {
          case 'merge':
            u = M(M({}, this.currentUrlTree.queryParams), a);
            break;
          case 'preserve':
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = a || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let h = c ? c.snapshot : this.routerState.snapshot.root;
          d = rl(h);
        } catch {
          (typeof n[0] != 'string' || !n[0].startsWith('/')) && (n = []),
            (d = this.currentUrlTree.root);
        }
        return il(d, n, u, f ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let c = Qt(n) ? n : this.parseUrl(n),
          a = this.urlHandlingStrategy.merge(c, this.rawUrlTree);
        return this.scheduleNavigation(a, q3, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return QM(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(n, i) {
        let c;
        if (
          (i === !0 ? (c = M({}, WM)) : i === !1 ? (c = M({}, YM)) : (c = i),
          Qt(n))
        )
          return F7(this.currentUrlTree, n, c);
        let a = this.parseUrl(n);
        return F7(this.currentUrlTree, a, c);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [c, a]) => (a != null && (i[c] = a), i),
          {}
        );
      }
      scheduleNavigation(n, i, c, a, s) {
        if (this.disposed) return Promise.resolve(!1);
        let o, l, f;
        s
          ? ((o = s.resolve), (l = s.reject), (f = s.promise))
          : (f = new Promise((d, h) => {
              (o = d), (l = h);
            }));
        let u = this.pendingTasks.add();
        return (
          zl(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: c,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: a,
            resolve: o,
            reject: l,
            promise: f,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          f.catch((d) => Promise.reject(d))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function QM(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new V(4008, !1);
}
function ZM(t) {
  return !(t instanceof X3) && !(t instanceof K3);
}
var kr = class {};
var XM = (() => {
    let e = class e {
      constructor(n, i, c, a, s) {
        (this.router = n),
          (this.injector = c),
          (this.preloadingStrategy = a),
          (this.loader = s);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            B2((n) => n instanceof X1),
            R1(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let c = [];
        for (let a of i) {
          a.providers &&
            !a._injector &&
            (a._injector = Gn(a.providers, n, `Route: ${a.path}`));
          let s = a._injector ?? n,
            o = a._loadedInjector ?? s;
          ((a.loadChildren && !a._loadedRoutes && a.canLoad === void 0) ||
            (a.loadComponent && !a._loadedComponent)) &&
            c.push(this.preloadConfig(s, a)),
            (a.children || a._loadedRoutes) &&
              c.push(this.processRoutes(o, a.children ?? a._loadedRoutes));
        }
        return i2(c).pipe(Mt());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let c;
          i.loadChildren && i.canLoad === void 0
            ? (c = this.loader.loadChildren(n, i))
            : (c = S(null));
          let a = c.pipe(
            m2((s) =>
              s === null
                ? S(void 0)
                : ((i._loadedRoutes = s.routes),
                  (i._loadedInjector = s.injector),
                  this.processRoutes(s.injector ?? n, s.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let s = this.loader.loadComponent(i);
            return i2([a, s]).pipe(Mt());
          } else return a;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(F2), D(Xn), D(R2), D(kr), D(sa));
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  bl = new w(''),
  KM = (() => {
    let e = class e {
      constructor(n, i, c, a, s = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = c),
          (this.zone = a),
          (this.options = s),
          (this.lastId = 0),
          (this.lastSource = 'imperative'),
          (this.restoredId = 0),
          (this.store = {}),
          (s.scrollPositionRestoration ||= 'disabled'),
          (s.anchorScrolling ||= 'disabled');
      }
      init() {
        this.options.scrollPositionRestoration !== 'disabled' &&
          this.viewportScroller.setHistoryScrollRestoration('manual'),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Zt
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof X1
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof be &&
              n.code === Dr.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Lr &&
            (n.position
              ? this.options.scrollPositionRestoration === 'top'
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === 'enabled' &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === 'enabled'
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== 'disabled' &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new Lr(
                  n,
                  this.lastSource === 'popstate'
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      r5();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function JM(t) {
  return t.routerState.root;
}
function o4(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function ey() {
  let t = g(v1);
  return (e) => {
    let r = t.get(nt);
    if (e !== r.components[0]) return;
    let n = t.get(F2),
      i = t.get(wl);
    t.get(fa) === 1 && n.initialNavigation(),
      t.get(Dl, null, P.Optional)?.setUpPreloading(),
      t.get(bl, null, P.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var wl = new w('', { factory: () => new T2() }),
  fa = new w('', { providedIn: 'root', factory: () => 1 });
function ty() {
  return o4(2, [
    { provide: fa, useValue: 0 },
    {
      provide: Qn,
      multi: !0,
      deps: [v1],
      useFactory: (e) => {
        let r = e.get(a7, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(F2),
                  c = e.get(wl);
                zl(i, () => {
                  n(!0);
                }),
                  (e.get(la).afterPreactivation = () => (
                    n(!0), c.closed ? S(void 0) : c
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function ny() {
  return o4(3, [
    {
      provide: Qn,
      multi: !0,
      useFactory: () => {
        let e = g(F2);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: fa, useValue: 2 },
  ]);
}
var Dl = new w('');
function ry(t) {
  return o4(0, [
    { provide: Dl, useExisting: XM },
    { provide: kr, useExisting: t },
  ]);
}
function iy() {
  return o4(8, [U7, { provide: _r, useExisting: U7 }]);
}
function cy(t) {
  let e = [
    { provide: yl, useValue: OM },
    {
      provide: Vl,
      useValue: M({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return o4(9, e);
}
var G7 = new w('ROUTER_FORROOT_GUARD'),
  ay = [
    jt,
    { provide: r4, useClass: Y3 },
    F2,
    i4,
    { provide: Xt, useFactory: JM, deps: [F2] },
    sa,
    [],
  ],
  ua = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            ay,
            [],
            { provide: Tr, multi: !0, useValue: n },
            { provide: G7, useFactory: fy, deps: [[F2, new In(), new nc()]] },
            { provide: s4, useValue: i || {} },
            i?.useHash ? oy() : ly(),
            sy(),
            i?.preloadingStrategy ? ry(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? uy(i) : [],
            i?.bindToComponentInputs ? iy().ɵproviders : [],
            i?.enableViewTransitions ? cy().ɵproviders : [],
            dy(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: Tr, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(G7, 8));
    }),
      (e.ɵmod = w2({ type: e })),
      (e.ɵinj = b2({}));
    let t = e;
    return t;
  })();
function sy() {
  return {
    provide: bl,
    useFactory: () => {
      let t = g(v7),
        e = g(e2),
        r = g(s4),
        n = g(la),
        i = g(r4);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new KM(i, n, t, e, r)
      );
    },
  };
}
function oy() {
  return { provide: it, useClass: o7 };
}
function ly() {
  return { provide: it, useClass: s0 };
}
function fy(t) {
  return 'guarded';
}
function uy(t) {
  return [
    t.initialNavigation === 'disabled' ? ny().ɵproviders : [],
    t.initialNavigation === 'enabledBlocking' ? ty().ɵproviders : [],
  ];
}
var q7 = new w('');
function dy() {
  return [
    { provide: q7, useFactory: ey },
    { provide: Zn, multi: !0, useExisting: q7 },
  ];
}
var _l = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (c) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty('disabled', n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(S1), z($2));
    }),
      (e.ɵdir = v2({ type: e }));
    let t = e;
    return t;
  })(),
  ma = (() => {
    let e = class e extends _l {};
    (e.ɵfac = (() => {
      let n;
      return function (c) {
        return (n || (n = ve(e)))(c || e);
      };
    })()),
      (e.ɵdir = v2({ type: e, features: [C1] }));
    let t = e;
    return t;
  })(),
  Wr = new w('');
var hy = { provide: Wr, useExisting: me(() => T1), multi: !0 };
function py() {
  let t = N1() ? N1().getUserAgent() : '';
  return /android (\d+)/.test(t.toLowerCase());
}
var my = new w(''),
  T1 = (() => {
    let e = class e extends _l {
      constructor(n, i, c) {
        super(n, i),
          (this._compositionMode = c),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !py());
      }
      writeValue(n) {
        let i = n ?? '';
        this.setProperty('value', i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(S1), z($2), z(my, 8));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [
          ['input', 'formControlName', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControlName', ''],
          ['input', 'formControl', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControl', ''],
          ['input', 'ngModel', '', 3, 'type', 'checkbox'],
          ['textarea', 'ngModel', ''],
          ['', 'ngDefaultControl', ''],
        ],
        hostBindings: function (i, c) {
          i & 1 &&
            h2('input', function (s) {
              return c._handleInput(s.target.value);
            })('blur', function () {
              return c.onTouched();
            })('compositionstart', function () {
              return c._compositionStart();
            })('compositionend', function (s) {
              return c._compositionEnd(s.target.value);
            });
        },
        features: [Ot([hy]), C1],
      }));
    let t = e;
    return t;
  })();
function De(t) {
  return (
    t == null || ((typeof t == 'string' || Array.isArray(t)) && t.length === 0)
  );
}
function Rl(t) {
  return t != null && typeof t.length == 'number';
}
var Pl = new w(''),
  Fl = new w(''),
  gy =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  M2 = class {
    static min(e) {
      return vy(e);
    }
    static max(e) {
      return Cy(e);
    }
    static required(e) {
      return My(e);
    }
    static requiredTrue(e) {
      return yy(e);
    }
    static email(e) {
      return Vy(e);
    }
    static minLength(e) {
      return Hy(e);
    }
    static maxLength(e) {
      return zy(e);
    }
    static pattern(e) {
      return by(e);
    }
    static nullValidator(e) {
      return Ol(e);
    }
    static compose(e) {
      return ql(e);
    }
    static composeAsync(e) {
      return Yl(e);
    }
  };
function vy(t) {
  return (e) => {
    if (De(e.value) || De(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r < t ? { min: { min: t, actual: e.value } } : null;
  };
}
function Cy(t) {
  return (e) => {
    if (De(e.value) || De(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r > t ? { max: { max: t, actual: e.value } } : null;
  };
}
function My(t) {
  return De(t.value) ? { required: !0 } : null;
}
function yy(t) {
  return t.value === !0 ? null : { required: !0 };
}
function Vy(t) {
  return De(t.value) || gy.test(t.value) ? null : { email: !0 };
}
function Hy(t) {
  return (e) =>
    De(e.value) || !Rl(e.value)
      ? null
      : e.value.length < t
      ? { minlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function zy(t) {
  return (e) =>
    Rl(e.value) && e.value.length > t
      ? { maxlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function by(t) {
  if (!t) return Ol;
  let e, r;
  return (
    typeof t == 'string'
      ? ((r = ''),
        t.charAt(0) !== '^' && (r += '^'),
        (r += t),
        t.charAt(t.length - 1) !== '$' && (r += '$'),
        (e = new RegExp(r)))
      : ((r = t.toString()), (e = t)),
    (n) => {
      if (De(n.value)) return null;
      let i = n.value;
      return e.test(i)
        ? null
        : { pattern: { requiredPattern: r, actualValue: i } };
    }
  );
}
function Ol(t) {
  return null;
}
function Bl(t) {
  return t != null;
}
function jl(t) {
  return Me(t) ? i2(t) : t;
}
function Ul(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? M(M({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function $l(t, e) {
  return e.map((r) => r(t));
}
function wy(t) {
  return !t.validate;
}
function Gl(t) {
  return t.map((e) => (wy(e) ? e : (r) => e.validate(r)));
}
function ql(t) {
  if (!t) return null;
  let e = t.filter(Bl);
  return e.length == 0
    ? null
    : function (r) {
        return Ul($l(r, e));
      };
}
function Wl(t) {
  return t != null ? ql(Gl(t)) : null;
}
function Yl(t) {
  if (!t) return null;
  let e = t.filter(Bl);
  return e.length == 0
    ? null
    : function (r) {
        let n = $l(r, e).map(jl);
        return I6(n).pipe(k(Ul));
      };
}
function Ql(t) {
  return t != null ? Yl(Gl(t)) : null;
}
function xl(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function Zl(t) {
  return t._rawValidators;
}
function Xl(t) {
  return t._rawAsyncValidators;
}
function da(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Br(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function Ll(t, e) {
  let r = da(e);
  return (
    da(t).forEach((i) => {
      Br(r, i) || r.push(i);
    }),
    r
  );
}
function Sl(t, e) {
  return da(e).filter((r) => !Br(t, r));
}
var jr = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = Wl(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = Ql(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  t3 = class extends jr {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  u4 = class extends jr {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  Ur = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  Dy = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  jN = J(M({}, Dy), { '[class.ng-submitted]': 'isSubmitted' }),
  xe = (() => {
    let e = class e extends Ur {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(u4, 2));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [
          ['', 'formControlName', ''],
          ['', 'ngModel', ''],
          ['', 'formControl', ''],
        ],
        hostVars: 14,
        hostBindings: function (i, c) {
          i & 2 &&
            I3('ng-untouched', c.isUntouched)('ng-touched', c.isTouched)(
              'ng-pristine',
              c.isPristine
            )('ng-dirty', c.isDirty)('ng-valid', c.isValid)(
              'ng-invalid',
              c.isInvalid
            )('ng-pending', c.isPending);
        },
        features: [C1],
      }));
    let t = e;
    return t;
  })(),
  Le = (() => {
    let e = class e extends Ur {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(t3, 10));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [
          ['', 'formGroupName', ''],
          ['', 'formArrayName', ''],
          ['', 'ngModelGroup', ''],
          ['', 'formGroup', ''],
          ['form', 3, 'ngNoForm', ''],
          ['', 'ngForm', ''],
        ],
        hostVars: 16,
        hostBindings: function (i, c) {
          i & 2 &&
            I3('ng-untouched', c.isUntouched)('ng-touched', c.isTouched)(
              'ng-pristine',
              c.isPristine
            )('ng-dirty', c.isDirty)('ng-valid', c.isValid)(
              'ng-invalid',
              c.isInvalid
            )('ng-pending', c.isPending)('ng-submitted', c.isSubmitted);
        },
        features: [C1],
      }));
    let t = e;
    return t;
  })();
var l4 = 'VALID',
  Fr = 'INVALID',
  e3 = 'PENDING',
  f4 = 'DISABLED';
function ga(t) {
  return (Yr(t) ? t.validators : t) || null;
}
function xy(t) {
  return Array.isArray(t) ? Wl(t) : t || null;
}
function va(t, e) {
  return (Yr(e) ? e.asyncValidators : t) || null;
}
function Ly(t) {
  return Array.isArray(t) ? Ql(t) : t || null;
}
function Yr(t) {
  return t != null && !Array.isArray(t) && typeof t == 'object';
}
function Kl(t, e, r) {
  let n = t.controls;
  if (!(e ? Object.keys(n) : n).length) throw new V(1e3, '');
  if (!n[r]) throw new V(1001, '');
}
function Jl(t, e, r) {
  t._forEachChild((n, i) => {
    if (r[i] === void 0) throw new V(1002, '');
  });
}
var n3 = class {
    constructor(e, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === l4;
    }
    get invalid() {
      return this.status === Fr;
    }
    get pending() {
      return this.status == e3;
    }
    get disabled() {
      return this.status === f4;
    }
    get enabled() {
      return this.status !== f4;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : 'change';
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(Ll(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(Ll(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(Sl(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(Sl(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return Br(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return Br(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      (this.touched = !0),
        this._parent && !e.onlySelf && this._parent.markAsTouched(e);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild((e) => e.markAllAsTouched());
    }
    markAsUntouched(e = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((r) => {
          r.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    markAsDirty(e = {}) {
      (this.pristine = !1),
        this._parent && !e.onlySelf && this._parent.markAsDirty(e);
    }
    markAsPristine(e = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((r) => {
          r.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    markAsPending(e = {}) {
      (this.status = e3),
        e.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !e.onlySelf && this._parent.markAsPending(e);
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = f4),
        (this.errors = null),
        this._forEachChild((n) => {
          n.disable(J(M({}, e), { onlySelf: !0 }));
        }),
        this._updateValue(),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors(J(M({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!0));
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = l4),
        this._forEachChild((n) => {
          n.enable(J(M({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(J(M({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(e) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched());
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === l4 || this.status === e3) &&
            this._runAsyncValidator(e.emitEvent)),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? f4 : l4;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e) {
      if (this.asyncValidator) {
        (this.status = e3), (this._hasOwnPendingAsyncValidator = !0);
        let r = jl(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((n) => {
          (this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(n, { emitEvent: e });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(e, r = {}) {
      (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
    }
    get(e) {
      let r = e;
      return r == null ||
        (Array.isArray(r) || (r = r.split('.')), r.length === 0)
        ? null
        : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(e, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[e] : null;
    }
    hasError(e, r) {
      return !!this.getError(e, r);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(e);
    }
    _initObservables() {
      (this.valueChanges = new o2()), (this.statusChanges = new o2());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? f4
        : this.errors
        ? Fr
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(e3)
        ? e3
        : this._anyControlsHaveStatus(Fr)
        ? Fr
        : l4;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((r) => r.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e = {}) {
      (this.pristine = !this._anyControlsDirty()),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    _updateTouched(e = {}) {
      (this.touched = this._anyControlsTouched()),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      Yr(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty;
      return !e && !!r && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = xy(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = Ly(this._rawAsyncValidators));
    }
  },
  $r = class extends n3 {
    constructor(e, r, n) {
      super(ga(r), va(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r);
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(e, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, r, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, r = {}) {
      Jl(this, !0, e),
        Object.keys(e).forEach((n) => {
          Kl(this, !0, n),
            this.controls[n].setValue(e[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, r, n) => ((e[n] = r.getRawValue()), e)
      );
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && e(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && e(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(
        e,
        (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r)
      );
    }
    _reduceChildren(e, r) {
      let n = e;
      return (
        this._forEachChild((i, c) => {
          n = r(n, i, c);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var ha = class extends $r {};
var e9 = new w('CallSetDisabledState', {
    providedIn: 'root',
    factory: () => Ca,
  }),
  Ca = 'always';
function Sy(t, e) {
  return [...e.path, t];
}
function Nl(t, e, r = Ca) {
  Ma(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === 'always') &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    Ey(t, e),
    Ay(t, e),
    Iy(t, e),
    Ny(t, e);
}
function El(t, e, r = !0) {
  let n = () => {};
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    qr(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function Gr(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function Ny(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function Ma(t, e) {
  let r = Zl(t);
  e.validator !== null
    ? t.setValidators(xl(r, e.validator))
    : typeof r == 'function' && t.setValidators([r]);
  let n = Xl(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(xl(n, e.asyncValidator))
    : typeof n == 'function' && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  Gr(e._rawValidators, i), Gr(e._rawAsyncValidators, i);
}
function qr(t, e) {
  let r = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = Zl(t);
      if (Array.isArray(i) && i.length > 0) {
        let c = i.filter((a) => a !== e.validator);
        c.length !== i.length && ((r = !0), t.setValidators(c));
      }
    }
    if (e.asyncValidator !== null) {
      let i = Xl(t);
      if (Array.isArray(i) && i.length > 0) {
        let c = i.filter((a) => a !== e.asyncValidator);
        c.length !== i.length && ((r = !0), t.setAsyncValidators(c));
      }
    }
  }
  let n = () => {};
  return Gr(e._rawValidators, n), Gr(e._rawAsyncValidators, n), r;
}
function Ey(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === 'change' && t9(t, e);
  });
}
function Iy(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === 'blur' && t._pendingChange && t9(t, e),
      t.updateOn !== 'submit' && t.markAsTouched();
  });
}
function t9(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function Ay(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function Ty(t, e) {
  t == null, Ma(t, e);
}
function ky(t, e) {
  return qr(t, e);
}
function _y(t, e) {
  if (!t.hasOwnProperty('model')) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function Ry(t) {
  return Object.getPrototypeOf(t.constructor) === ma;
}
function Py(t, e) {
  t._syncPendingControls(),
    e.forEach((r) => {
      let n = r.control;
      n.updateOn === 'submit' &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function Fy(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((c) => {
      c.constructor === T1 ? (r = c) : Ry(c) ? (n = c) : (i = c);
    }),
    i || n || r || null
  );
}
function Oy(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Il(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Al(t) {
  return (
    typeof t == 'object' &&
    t !== null &&
    Object.keys(t).length === 2 &&
    'value' in t &&
    'disabled' in t
  );
}
var Or = class extends n3 {
  constructor(e = null, r, n) {
    super(ga(r), va(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      Yr(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (Al(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    Il(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    Il(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    Al(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var By = (t) => t instanceof Or;
var Se = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵdir = v2({
      type: e,
      selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']],
      hostAttrs: ['novalidate', ''],
    }));
  let t = e;
  return t;
})();
var n9 = new w('');
var jy = { provide: t3, useExisting: me(() => K1) },
  K1 = (() => {
    let e = class e extends t3 {
      constructor(n, i, c) {
        super(),
          (this.callSetDisabledState = c),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new o2()),
          this._setValidators(n),
          this._setAsyncValidators(i);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty('form') &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (qr(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let i = this.form.get(n.path);
        return (
          Nl(i, n, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          i
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        El(n.control || null, n, !1), Oy(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        this.form.get(n.path).setValue(i);
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          Py(this.form, this.directives),
          this.ngSubmit.emit(n),
          n?.target?.method === 'dialog'
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1);
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let i = n.control,
            c = this.form.get(n.path);
          i !== c &&
            (El(i || null, n),
            By(c) && (Nl(c, n, this.callSetDisabledState), (n.control = c)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let i = this.form.get(n.path);
        Ty(i, n), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let i = this.form.get(n.path);
          i && ky(i, n) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        Ma(this.form, this), this._oldForm && qr(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(Pl, 10), z(Fl, 10), z(e9, 8));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['', 'formGroup', '']],
        hostBindings: function (i, c) {
          i & 1 &&
            h2('submit', function (s) {
              return c.onSubmit(s);
            })('reset', function () {
              return c.onReset();
            });
        },
        inputs: { form: [Q2.None, 'formGroup', 'form'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        features: [Ot([jy]), C1, X2],
      }));
    let t = e;
    return t;
  })();
var Uy = { provide: u4, useExisting: me(() => J1) },
  J1 = (() => {
    let e = class e extends u4 {
      set isDisabled(n) {}
      constructor(n, i, c, a, s) {
        super(),
          (this._ngModelWarningConfig = s),
          (this._added = !1),
          (this.name = null),
          (this.update = new o2()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(c),
          (this.valueAccessor = Fy(this, a));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          _y(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return Sy(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(
          z(t3, 13),
          z(Pl, 10),
          z(Fl, 10),
          z(Wr, 10),
          z(n9, 8)
        );
      }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['', 'formControlName', '']],
        inputs: {
          name: [Q2.None, 'formControlName', 'name'],
          isDisabled: [Q2.None, 'disabled', 'isDisabled'],
          model: [Q2.None, 'ngModel', 'model'],
        },
        outputs: { update: 'ngModelChange' },
        features: [Ot([Uy]), C1, X2],
      }));
    let t = e;
    return t;
  })(),
  $y = { provide: Wr, useExisting: me(() => r3), multi: !0 };
function r9(t, e) {
  return t == null
    ? `${e}`
    : (e && typeof e == 'object' && (e = 'Object'), `${t}: ${e}`.slice(0, 50));
}
function Gy(t) {
  return t.split(':')[0];
}
var r3 = (() => {
    let e = class e extends ma {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i = this._getOptionId(n),
          c = r9(i, n);
        this.setProperty('value', c);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          (this.value = this._getOptionValue(i)), n(this.value);
        };
      }
      _registerOption() {
        return (this._idCounter++).toString();
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i), n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = Gy(n);
        return this._optionMap.has(i) ? this._optionMap.get(i) : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (c) {
        return (n || (n = ve(e)))(c || e);
      };
    })()),
      (e.ɵdir = v2({
        type: e,
        selectors: [
          ['select', 'formControlName', '', 3, 'multiple', ''],
          ['select', 'formControl', '', 3, 'multiple', ''],
          ['select', 'ngModel', '', 3, 'multiple', ''],
        ],
        hostBindings: function (i, c) {
          i & 1 &&
            h2('change', function (s) {
              return c.onChange(s.target.value);
            })('blur', function () {
              return c.onTouched();
            });
        },
        inputs: { compareWith: 'compareWith' },
        features: [Ot([$y]), C1],
      }));
    let t = e;
    return t;
  })(),
  Qr = (() => {
    let e = class e {
      constructor(n, i, c) {
        (this._element = n),
          (this._renderer = i),
          (this._select = c),
          this._select && (this.id = this._select._registerOption());
      }
      set ngValue(n) {
        this._select != null &&
          (this._select._optionMap.set(this.id, n),
          this._setElementValue(r9(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._setElementValue(n),
          this._select && this._select.writeValue(this._select.value);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, 'value', n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z($2), z(S1), z(r3, 9));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['option']],
        inputs: { ngValue: 'ngValue', value: 'value' },
      }));
    let t = e;
    return t;
  })(),
  qy = { provide: Wr, useExisting: me(() => i9), multi: !0 };
function Tl(t, e) {
  return t == null
    ? `${e}`
    : (typeof e == 'string' && (e = `'${e}'`),
      e && typeof e == 'object' && (e = 'Object'),
      `${t}: ${e}`.slice(0, 50));
}
function Wy(t) {
  return t.split(':')[0];
}
var i9 = (() => {
    let e = class e extends ma {
      constructor() {
        super(...arguments),
          (this._optionMap = new Map()),
          (this._idCounter = 0),
          (this._compareWith = Object.is);
      }
      set compareWith(n) {
        this._compareWith = n;
      }
      writeValue(n) {
        this.value = n;
        let i;
        if (Array.isArray(n)) {
          let c = n.map((a) => this._getOptionId(a));
          i = (a, s) => {
            a._setSelected(c.indexOf(s.toString()) > -1);
          };
        } else
          i = (c, a) => {
            c._setSelected(!1);
          };
        this._optionMap.forEach(i);
      }
      registerOnChange(n) {
        this.onChange = (i) => {
          let c = [],
            a = i.selectedOptions;
          if (a !== void 0) {
            let s = a;
            for (let o = 0; o < s.length; o++) {
              let l = s[o],
                f = this._getOptionValue(l.value);
              c.push(f);
            }
          } else {
            let s = i.options;
            for (let o = 0; o < s.length; o++) {
              let l = s[o];
              if (l.selected) {
                let f = this._getOptionValue(l.value);
                c.push(f);
              }
            }
          }
          (this.value = c), n(c);
        };
      }
      _registerOption(n) {
        let i = (this._idCounter++).toString();
        return this._optionMap.set(i, n), i;
      }
      _getOptionId(n) {
        for (let i of this._optionMap.keys())
          if (this._compareWith(this._optionMap.get(i)._value, n)) return i;
        return null;
      }
      _getOptionValue(n) {
        let i = Wy(n);
        return this._optionMap.has(i) ? this._optionMap.get(i)._value : n;
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (c) {
        return (n || (n = ve(e)))(c || e);
      };
    })()),
      (e.ɵdir = v2({
        type: e,
        selectors: [
          ['select', 'multiple', '', 'formControlName', ''],
          ['select', 'multiple', '', 'formControl', ''],
          ['select', 'multiple', '', 'ngModel', ''],
        ],
        hostBindings: function (i, c) {
          i & 1 &&
            h2('change', function (s) {
              return c.onChange(s.target);
            })('blur', function () {
              return c.onTouched();
            });
        },
        inputs: { compareWith: 'compareWith' },
        features: [Ot([qy]), C1],
      }));
    let t = e;
    return t;
  })(),
  Zr = (() => {
    let e = class e {
      constructor(n, i, c) {
        (this._element = n),
          (this._renderer = i),
          (this._select = c),
          this._select && (this.id = this._select._registerOption(this));
      }
      set ngValue(n) {
        this._select != null &&
          ((this._value = n),
          this._setElementValue(Tl(this.id, n)),
          this._select.writeValue(this._select.value));
      }
      set value(n) {
        this._select
          ? ((this._value = n),
            this._setElementValue(Tl(this.id, n)),
            this._select.writeValue(this._select.value))
          : this._setElementValue(n);
      }
      _setElementValue(n) {
        this._renderer.setProperty(this._element.nativeElement, 'value', n);
      }
      _setSelected(n) {
        this._renderer.setProperty(this._element.nativeElement, 'selected', n);
      }
      ngOnDestroy() {
        this._select &&
          (this._select._optionMap.delete(this.id),
          this._select.writeValue(this._select.value));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z($2), z(S1), z(i9, 9));
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [['option']],
        inputs: { ngValue: 'ngValue', value: 'value' },
      }));
    let t = e;
    return t;
  })();
var Yy = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = w2({ type: e })),
      (e.ɵinj = b2({}));
    let t = e;
    return t;
  })(),
  pa = class extends n3 {
    constructor(e, r, n) {
      super(ga(r), va(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    at(e) {
      return this.controls[this._adjustIndex(e)];
    }
    push(e, r = {}) {
      this.controls.push(e),
        this._registerControl(e),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    insert(e, r, n = {}) {
      this.controls.splice(e, 0, r),
        this._registerControl(r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent });
    }
    removeAt(e, r = {}) {
      let n = this._adjustIndex(e);
      n < 0 && (n = 0),
        this.controls[n] &&
          this.controls[n]._registerOnCollectionChange(() => {}),
        this.controls.splice(n, 1),
        this.updateValueAndValidity({ emitEvent: r.emitEvent });
    }
    setControl(e, r, n = {}) {
      let i = this._adjustIndex(e);
      i < 0 && (i = 0),
        this.controls[i] &&
          this.controls[i]._registerOnCollectionChange(() => {}),
        this.controls.splice(i, 1),
        r && (this.controls.splice(i, 0, r), this._registerControl(r)),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(e, r = {}) {
      Jl(this, !1, e),
        e.forEach((n, i) => {
          Kl(this, !1, i),
            this.at(i).setValue(n, { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (e.forEach((n, i) => {
          this.at(i) &&
            this.at(i).patchValue(n, { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = [], r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e[i], { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this.controls.map((e) => e.getRawValue());
    }
    clear(e = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((r) => r._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: e.emitEvent }));
    }
    _adjustIndex(e) {
      return e < 0 ? e + this.length : e;
    }
    _syncPendingControls() {
      let e = this.controls.reduce(
        (r, n) => (n._syncPendingControls() ? !0 : r),
        !1
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      this.controls.forEach((r, n) => {
        e(r, n);
      });
    }
    _updateValue() {
      this.value = this.controls
        .filter((e) => e.enabled || this.disabled)
        .map((e) => e.value);
    }
    _anyControls(e) {
      return this.controls.some((r) => r.enabled && e(r));
    }
    _setUpControls() {
      this._forEachChild((e) => this._registerControl(e));
    }
    _allControlsDisabled() {
      for (let e of this.controls) if (e.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(e) {
      e.setParent(this),
        e._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(e) {
      return this.at(e) ?? null;
    }
  };
function kl(t) {
  return (
    !!t &&
    (t.asyncValidators !== void 0 ||
      t.validators !== void 0 ||
      t.updateOn !== void 0)
  );
}
var Ne = (() => {
  let e = class e {
    constructor() {
      this.useNonNullable = !1;
    }
    get nonNullable() {
      let n = new e();
      return (n.useNonNullable = !0), n;
    }
    group(n, i = null) {
      let c = this._reduceControls(n),
        a = {};
      return (
        kl(i)
          ? (a = i)
          : i !== null &&
            ((a.validators = i.validator),
            (a.asyncValidators = i.asyncValidator)),
        new $r(c, a)
      );
    }
    record(n, i = null) {
      let c = this._reduceControls(n);
      return new ha(c, i);
    }
    control(n, i, c) {
      let a = {};
      return this.useNonNullable
        ? (kl(i) ? (a = i) : ((a.validators = i), (a.asyncValidators = c)),
          new Or(n, J(M({}, a), { nonNullable: !0 })))
        : new Or(n, i, c);
    }
    array(n, i, c) {
      let a = n.map((s) => this._createControl(s));
      return new pa(a, i, c);
    }
    _reduceControls(n) {
      let i = {};
      return (
        Object.keys(n).forEach((c) => {
          i[c] = this._createControl(n[c]);
        }),
        i
      );
    }
    _createControl(n) {
      if (n instanceof Or) return n;
      if (n instanceof n3) return n;
      if (Array.isArray(n)) {
        let i = n[0],
          c = n.length > 1 ? n[1] : null,
          a = n.length > 2 ? n[2] : null;
        return this.control(i, c, a);
      } else return this.control(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var c9 = (() => {
  let e = class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [
          { provide: n9, useValue: n.warnOnNgModelWithFormControl ?? 'always' },
          { provide: e9, useValue: n.callSetDisabledState ?? Ca },
        ],
      };
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = w2({ type: e })),
    (e.ɵinj = b2({ imports: [Yy] }));
  let t = e;
  return t;
})();
var Ee = (() => {
  let e = class e {
    constructor(n) {
      (this.http = n),
        (this.uri = 'http://localhost:8000/api'),
        (this.httpOptions = {
          headers: new Z1({ 'Content-Type': 'application/json' }),
        }),
        (this.tasks$ = this.getTasks());
    }
    handleError(n) {
      return (
        n instanceof ErrorEvent
          ? console.error(`client error,${n}`)
          : console.error('server side error'),
        ae(() => 'there is a error with service')
      );
    }
    getTasks() {
      return this.http.get(`${this.uri}/task`).pipe(
        g2((n) => this.tasks$ != S(n)),
        n1(this.handleError)
      );
    }
    addTask(n) {
      return this.http.post(`${this.uri}/task`, n);
    }
    getTask(n) {
      return this.tasks$.pipe(k((i) => i.find((c) => c._id === n)));
    }
    editTask(n) {
      return this.http
        .put(`${this.uri}/task/${n._id}`, n, this.httpOptions)
        .pipe(n1(this.handleError));
    }
    deleteTask(n) {
      return this.http
        .delete(`${this.uri}/task/${n._id}`, this.httpOptions)
        .pipe(n1(this.handleError));
    }
    signup(n) {
      return this.http.post(`${this.uri}/user/signup`, n);
    }
    login(n) {
      return this.http.post(`${this.uri}/user/login`, n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(p0));
  }),
    (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function Qy(t, e) {
  t & 1 && (m(0, 'div', 16)(1, 'span', 17), v(2, 'Loading...'), p()());
}
var a9 = (() => {
  let e = class e {
    constructor(n, i, c) {
      (this.ts = n),
        (this.builder = i),
        (this.router = c),
        (this.msg = ''),
        (this.loginForm = this.builder.group({
          email: ['', [M2.required]],
          password: ['', M2.required],
        }));
    }
    get email() {
      return this.loginForm.get('email');
    }
    get password() {
      return this.loginForm.get('password');
    }
    login() {
      (this.isPending = !0),
        this.ts
          .login({ email: this.email?.value, password: this.password?.value })
          .subscribe((n) => {
            n.statusCode === '200' &&
              ((this.isPending = !1),
              localStorage.setItem('userInfo', JSON.stringify(n)),
              this.router.navigate(['/taskList'])),
              n.statusCode === '202' &&
                ((this.isPending = !1), (this.msg = 'Invalid password')),
              n.statusCode === '201' &&
                ((this.isPending = !1), (this.msg = 'Invalid Email'));
          });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(z(Ee), z(Ne), z(F2));
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-login']],
      decls: 27,
      vars: 3,
      consts: [
        [
          'class',
          'spinner-border spinner-border-sm d-block mx-auto my-2',
          'role',
          'status',
          4,
          'ngIf',
        ],
        [1, 'text-center', 'text-danger'],
        [1, 'text-center', 'my-2'],
        [
          1,
          'col-10',
          'col-xs-12',
          'col-sm-8',
          'col-md-6',
          'col-lg-5',
          'mx-auto',
          'd-block',
          'text-bg-light',
          'mt-3',
        ],
        [
          1,
          'containter',
          'small-container',
          'bg-light',
          'border',
          'border-1',
          'my-3',
          'shadow',
          3,
          'formGroup',
        ],
        [1, 'row', 'my-2', 'px-2'],
        [1, 'col'],
        ['for', 'email', 1, 'form-label', 'mx-2'],
        [
          'type',
          'email',
          'name',
          'email',
          'placeholder',
          'name@example.com',
          'formControlName',
          'email',
          1,
          'form-control',
        ],
        ['for', 'pwd', 1, 'form-label', 'mx-2'],
        [
          'type',
          'password',
          'name',
          'pwd',
          'formControlName',
          'password',
          1,
          'form-control',
        ],
        [1, 'my-2', 'px-2', 'd-block', 'mx-auto'],
        ['type', 'button', 1, 'btn', 'btn-outline-info', 3, 'click'],
        [1, 'd-block', 'mx-auto', 'px-3', 'text-center'],
        [1, 'px-3'],
        ['href', 'signup'],
        [
          'role',
          'status',
          1,
          'spinner-border',
          'spinner-border-sm',
          'd-block',
          'mx-auto',
          'my-2',
        ],
        [1, 'visually-hidden'],
      ],
      template: function (i, c) {
        i & 1 &&
          (K(0, Qy, 3, 0, 'div', 0),
          m(1, 'p', 1),
          v(2),
          p(),
          m(3, 'h4', 2),
          v(4, 'Login'),
          p(),
          m(5, 'div', 3)(6, 'form', 4)(7, 'div', 5)(8, 'div', 6)(9, 'label', 7),
          v(10, 'Email'),
          p(),
          Z(11, 'input', 8),
          p()(),
          m(12, 'div', 5)(13, 'div', 6)(14, 'label', 9),
          v(15, 'Password'),
          p(),
          Z(16, 'input', 10),
          p()(),
          m(17, 'div', 11)(18, 'button', 12),
          h2('click', function () {
            return c.login();
          }),
          v(19, 'Login'),
          p()(),
          Z(20, 'hr'),
          m(21, 'div', 13),
          v(22, "Don't Have an Account?"),
          m(23, 'span', 14)(24, 'a', 15),
          v(25, 'Signup'),
          p()()(),
          Z(26, 'hr'),
          p()()),
          i & 2 &&
            (A('ngIf', c.isPending),
            E(2),
            G2(c.msg),
            E(4),
            A('formGroup', c.loginForm));
      },
      dependencies: [E1, Se, T1, xe, Le, K1, J1],
    }));
  let t = e;
  return t;
})();
var s9 = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-page-not-found']],
      decls: 2,
      vars: 0,
      template: function (i, c) {
        i & 1 && (m(0, 'h3'), v(1, 'Page Not Found Invalid Url'), p());
      },
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function ee(t) {
  return (e) => (t.test(e.value) ? null : { isString: { value: e.value } });
}
function o9(t) {
  return (e) => (t.test(e.value) ? null : { isEmail: { value: e.value } });
}
function Zy(t, e) {
  t & 1 && (m(0, 'div', 21)(1, 'span', 22), v(2, 'Loading...'), p()());
}
function Xy(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' firstname is required. '), p());
}
function Ky(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Alphabets only allowed '), p());
}
function Jy(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 23), K(1, Xy, 2, 0, 'div', 24)(2, Ky, 2, 0, 'div', 24), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A(
        'ngIf',
        r.firstName.errors == null ? null : r.firstName.errors.required
      ),
      E(),
      A(
        'ngIf',
        r.firstName.errors == null ? null : r.firstName.errors.isString
      );
  }
}
function eV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' lastname is required. '), p());
}
function tV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Alphabets only allowed '), p());
}
function nV(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 23), K(1, eV, 2, 0, 'div', 24)(2, tV, 2, 0, 'div', 24), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A('ngIf', r.lastName.errors == null ? null : r.lastName.errors.required),
      E(),
      A('ngIf', r.lastName.errors == null ? null : r.lastName.errors.isString);
  }
}
function rV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' email is required. '), p());
}
function iV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Invalid Email Format '), p());
}
function cV(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 23), K(1, rV, 2, 0, 'div', 24)(2, iV, 2, 0, 'div', 24), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A('ngIf', r.email.errors == null ? null : r.email.errors.required),
      E(),
      A('ngIf', r.email.errors == null ? null : r.email.errors.isEmail);
  }
}
function aV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' password is required. '), p());
}
function sV(t, e) {
  if ((t & 1 && (m(0, 'div', 23), K(1, aV, 2, 0, 'div', 24), p()), t & 2)) {
    let r = D2();
    E(),
      A('ngIf', r.password.errors == null ? null : r.password.errors.required);
  }
}
var l9 = (() => {
  let e = class e {
    constructor(n, i, c) {
      (this.ts = n),
        (this.builder = i),
        (this.router = c),
        (this.msg = ''),
        (this.userForm = this.builder.group({
          firstName: ['', [M2.required, ee(/^[a-zA-Z\s]+$/)]],
          lastName: ['', [M2.required, ee(/^[a-zA-Z\s]+$/)]],
          email: ['', [M2.required, o9(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)]],
          password: ['', M2.required],
        }));
    }
    get firstName() {
      return this.userForm.get('firstName');
    }
    get lastName() {
      return this.userForm.get('lastName');
    }
    get email() {
      return this.userForm.get('email');
    }
    get password() {
      return this.userForm.get('password');
    }
    signup() {
      (this.isPending = !0),
        (this.msg = ''),
        (this.user = {
          firstName: this.firstName?.value,
          lastName: this.lastName?.value,
          email: this.email?.value,
          password: this.password?.value,
        }),
        this.ts.signup(this.user).subscribe((n) => {
          n.statusCode === '203' &&
            ((this.isPending = !1), (this.msg = 'Email already exist')),
            n.statusCode === '201' &&
              ((this.isPending = !1), this.router.navigate(['/login']));
        });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(z(Ee), z(Ne), z(F2));
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-signup']],
      decls: 41,
      vars: 7,
      consts: [
        [
          'class',
          'spinner-border spinner-border-sm d-block mx-auto my-2',
          'role',
          'status',
          4,
          'ngIf',
        ],
        [1, 'text-center', 'text-danger'],
        [1, 'text-center', 'my-2'],
        [
          1,
          'col-10',
          'col-xs-12',
          'col-sm-8',
          'col-md-6',
          'col-lg-5',
          'mx-auto',
          'd-block',
          'text-bg-light',
          'mt-3',
        ],
        [
          1,
          'containter',
          'small-container',
          'bg-light',
          'border',
          'border-1',
          'my-3',
          'shadow',
          3,
          'formGroup',
        ],
        [1, 'row', 'my-2', 'px-2'],
        [1, 'col'],
        ['for', 'firstName', 1, 'form-label', 'mx-2'],
        [
          'type',
          'text',
          'name',
          'firstName',
          'placeholder',
          'Enter your firstName',
          'formControlName',
          'firstName',
          1,
          'form-control',
        ],
        ['class', 'alert alert-danger text-danger', 4, 'ngIf'],
        ['for', 'lastName', 1, 'form-label', 'mx-2'],
        [
          'type',
          'text',
          'name',
          'lastName',
          'placeholder',
          'Enter your lastName',
          'formControlName',
          'lastName',
          1,
          'form-control',
        ],
        ['for', 'email', 1, 'form-label', 'mx-2'],
        [
          'type',
          'email',
          'name',
          'email',
          'placeholder',
          'name@example.com',
          'formControlName',
          'email',
          1,
          'form-control',
        ],
        ['for', 'pwd', 1, 'form-label', 'mx-2'],
        [
          'type',
          'password',
          'name',
          'pwd',
          'formControlName',
          'password',
          1,
          'form-control',
        ],
        [1, 'd-block', 'mx-auto', 'px-2'],
        ['type', 'button', 1, 'btn', 'btn-outline-info', 3, 'click'],
        [1, 'd-block', 'mx-auto', 'px-3', 'text-center'],
        [1, 'px-2'],
        ['href', 'login'],
        [
          'role',
          'status',
          1,
          'spinner-border',
          'spinner-border-sm',
          'd-block',
          'mx-auto',
          'my-2',
        ],
        [1, 'visually-hidden'],
        [1, 'alert', 'alert-danger', 'text-danger'],
        [4, 'ngIf'],
      ],
      template: function (i, c) {
        i & 1 &&
          (K(0, Zy, 3, 0, 'div', 0),
          m(1, 'p', 1),
          v(2),
          p(),
          m(3, 'h4', 2),
          v(4, 'Sign Up'),
          p(),
          m(5, 'div', 3)(6, 'form', 4)(7, 'div', 5)(8, 'div', 6)(9, 'label', 7),
          v(10, 'First Name'),
          p(),
          Z(11, 'input', 8),
          p()(),
          K(12, Jy, 3, 2, 'div', 9),
          m(13, 'div', 5)(14, 'div', 6)(15, 'label', 10),
          v(16, 'Last Name'),
          p(),
          Z(17, 'input', 11),
          p()(),
          K(18, nV, 3, 2, 'div', 9),
          m(19, 'div', 5)(20, 'div', 6)(21, 'label', 12),
          v(22, 'Email'),
          p(),
          Z(23, 'input', 13),
          p()(),
          K(24, cV, 3, 2, 'div', 9),
          m(25, 'div', 5)(26, 'div', 6)(27, 'label', 14),
          v(28, 'Password'),
          p(),
          Z(29, 'input', 15),
          p()(),
          K(30, sV, 2, 1, 'div', 9),
          m(31, 'div', 16)(32, 'button', 17),
          h2('click', function () {
            return c.signup();
          }),
          v(33, 'Sign up'),
          p()(),
          Z(34, 'hr'),
          m(35, 'div', 18),
          v(36, 'Already Have an Account?'),
          m(37, 'span', 19)(38, 'a', 20),
          v(39, 'Login'),
          p()()(),
          Z(40, 'hr'),
          p()()),
          i & 2 &&
            (A('ngIf', c.isPending),
            E(2),
            G2(c.msg),
            E(4),
            A('formGroup', c.userForm),
            E(6),
            A(
              'ngIf',
              c.firstName.invalid && (c.firstName.dirty || c.firstName.touched)
            ),
            E(6),
            A(
              'ngIf',
              c.lastName.invalid && (c.lastName.dirty || c.lastName.touched)
            ),
            E(6),
            A('ngIf', c.email.invalid && (c.email.dirty || c.email.touched)),
            E(6),
            A(
              'ngIf',
              c.password.invalid && (c.password.dirty || c.password.touched)
            ));
      },
      dependencies: [E1, Se, T1, xe, Le, K1, J1],
    }));
  let t = e;
  return t;
})();
function oV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Task Title is required. '), p());
}
function lV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Alphabets only allowed '), p());
}
function fV(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 19), K(1, oV, 2, 0, 'div', 20)(2, lV, 2, 0, 'div', 20), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A(
        'ngIf',
        r.taskTitle.errors == null ? null : r.taskTitle.errors.required
      ),
      E(),
      A(
        'ngIf',
        r.taskTitle.errors == null ? null : r.taskTitle.errors.isString
      );
  }
}
function uV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Task Description is required. '), p());
}
function dV(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Alphabets only allowed '), p());
}
function hV(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 19), K(1, uV, 2, 0, 'div', 20)(2, dV, 2, 0, 'div', 20), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A(
        'ngIf',
        r.taskDescription.errors == null
          ? null
          : r.taskDescription.errors.required
      ),
      E(),
      A(
        'ngIf',
        r.taskDescription.errors == null
          ? null
          : r.taskDescription.errors.isString
      );
  }
}
var f9 = (() => {
  let e = class e {
    constructor(n, i, c) {
      (this.ts = n),
        (this.builder = i),
        (this.router = c),
        (this.taskForm = this.builder.group({
          taskTitle: ['', [M2.required, ee(/^[a-zA-Z\s]+$/)]],
          taskDescription: ['', [M2.required, ee(/^[a-zA-Z\s]+$/)]],
          taskDueDate: ['', M2.required],
          taskStatus: ['', M2.required],
        }));
    }
    get taskTitle() {
      return this.taskForm.get('taskTitle');
    }
    get taskDescription() {
      return this.taskForm.get('taskDescription');
    }
    get taskDueDate() {
      return this.taskForm.get('taskDueDate');
    }
    get taskStatus() {
      return this.taskForm.get('taskStatus');
    }
    addTask() {
      (this.task = {
        title: this.taskTitle.value,
        description: this.taskDescription.value,
        dueDate: this.taskDueDate.value,
        status: this.taskStatus.value,
      }),
        this.ts.addTask(this.task).subscribe(() => {
          this.router.navigate(['../taskList']);
        });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(z(Ee), z(Ne), z(F2));
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-add-task']],
      decls: 35,
      vars: 4,
      consts: [
        [1, 'text-center', 'my-2'],
        [
          1,
          'col-10',
          'col-xs-12',
          'col-sm-8',
          'col-md-6',
          'col-lg-5',
          'mx-auto',
          'd-block',
          'text-bg-light',
          'mt-3',
        ],
        [
          1,
          'containter',
          'small-container',
          'bg-light',
          'border',
          'border-1',
          'my-3',
          'shadow',
          3,
          'formGroup',
        ],
        [1, 'row', 'my-2', 'px-2'],
        [1, 'col'],
        ['for', 'title', 1, 'form-label', 'mx-2'],
        [
          'type',
          'text',
          'name',
          'title',
          'placeholder',
          'Enter title',
          'formControlName',
          'taskTitle',
          1,
          'form-control',
        ],
        ['class', 'alert alert-danger text-danger', 4, 'ngIf'],
        ['for', 'desc', 1, 'form-label', 'mx-2'],
        [
          'type',
          'text',
          'name',
          'desc',
          'placeholder',
          'Enter Description',
          'formControlName',
          'taskDescription',
          1,
          'form-control',
        ],
        ['for', 'dueDate', 1, 'form-label', 'mx-2'],
        [
          'type',
          'date',
          'name',
          'dueDate',
          'placeholder',
          'Enter Due Date',
          'formControlName',
          'taskDueDate',
          1,
          'form-control',
        ],
        [
          'aria-label',
          'Default select example',
          'formControlName',
          'taskStatus',
          1,
          'form-select',
        ],
        ['selected', '', 'value', ''],
        ['value', 'Pending'],
        ['value', 'In Progress'],
        ['value', 'completed'],
        [1, 'd-block', 'mx-auto', 'text-center', 'my-2'],
        ['type', 'submit', 1, 'btn', 'btn-info', 3, 'click', 'disabled'],
        [1, 'alert', 'alert-danger', 'text-danger'],
        [4, 'ngIf'],
      ],
      template: function (i, c) {
        i & 1 &&
          (m(0, 'h4', 0),
          v(1, 'New Task'),
          p(),
          m(2, 'div', 1)(3, 'form', 2)(4, 'div', 3)(5, 'div', 4)(6, 'label', 5),
          v(7, 'Title'),
          p(),
          Z(8, 'input', 6),
          p()(),
          K(9, fV, 3, 2, 'div', 7),
          m(10, 'div', 3)(11, 'div', 4)(12, 'label', 8),
          v(13, 'Description'),
          p(),
          Z(14, 'input', 9),
          p()(),
          K(15, hV, 3, 2, 'div', 7),
          m(16, 'div', 3)(17, 'div', 4)(18, 'label', 10),
          v(19, 'Due Date'),
          p(),
          Z(20, 'input', 11),
          p()(),
          m(21, 'div', 3)(22, 'div', 4)(23, 'select', 12)(24, 'option', 13),
          v(25, 'select Status'),
          p(),
          m(26, 'option', 14),
          v(27, 'Pending'),
          p(),
          m(28, 'option', 15),
          v(29, 'In Progress'),
          p(),
          m(30, 'option', 16),
          v(31, 'completed'),
          p()()()(),
          m(32, 'div', 17)(33, 'button', 18),
          h2('click', function () {
            return c.addTask();
          }),
          v(34, 'Save'),
          p()()()()),
          i & 2 &&
            (E(3),
            A('formGroup', c.taskForm),
            E(6),
            A(
              'ngIf',
              c.taskTitle.invalid && (c.taskTitle.dirty || c.taskTitle.touched)
            ),
            E(6),
            A(
              'ngIf',
              c.taskDescription.invalid &&
                (c.taskDescription.dirty || c.taskDescription.touched)
            ),
            E(18),
            A('disabled', c.taskForm.invalid));
      },
      dependencies: [E1, Se, Qr, Zr, T1, r3, xe, Le, K1, J1],
    }));
  let t = e;
  return t;
})();
var pV = {
    prefix: 'fas',
    iconName: 'pen-to-square',
    icon: [
      512,
      512,
      ['edit'],
      'f044',
      'M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z',
    ],
  },
  u9 = pV;
var d9 = {
  prefix: 'fas',
  iconName: 'trash',
  icon: [
    448,
    512,
    [],
    'f1f8',
    'M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z',
  ],
};
function h9(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(t, i).enumerable;
      })),
      r.push.apply(r, n);
  }
  return r;
}
function y(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? h9(Object(r), !0).forEach(function (n) {
          z2(t, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r))
      : h9(Object(r)).forEach(function (n) {
          Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
        });
  }
  return t;
}
function f6(t) {
  '@babel/helpers - typeof';
  return (
    (f6 =
      typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              typeof Symbol == 'function' &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e;
          }),
    f6(t)
  );
}
function mV(t, e) {
  if (!(t instanceof e))
    throw new TypeError('Cannot call a class as a function');
}
function p9(t, e) {
  for (var r = 0; r < e.length; r++) {
    var n = e[r];
    (n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      'value' in n && (n.writable = !0),
      Object.defineProperty(t, n.key, n);
  }
}
function gV(t, e, r) {
  return (
    e && p9(t.prototype, e),
    r && p9(t, r),
    Object.defineProperty(t, 'prototype', { writable: !1 }),
    t
  );
}
function z2(t, e, r) {
  return (
    e in t
      ? Object.defineProperty(t, e, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = r),
    t
  );
}
function ka(t, e) {
  return CV(t) || yV(t, e) || F9(t, e) || HV();
}
function y4(t) {
  return vV(t) || MV(t) || F9(t) || VV();
}
function vV(t) {
  if (Array.isArray(t)) return ba(t);
}
function CV(t) {
  if (Array.isArray(t)) return t;
}
function MV(t) {
  if (
    (typeof Symbol < 'u' && t[Symbol.iterator] != null) ||
    t['@@iterator'] != null
  )
    return Array.from(t);
}
function yV(t, e) {
  var r =
    t == null
      ? null
      : (typeof Symbol < 'u' && t[Symbol.iterator]) || t['@@iterator'];
  if (r != null) {
    var n = [],
      i = !0,
      c = !1,
      a,
      s;
    try {
      for (
        r = r.call(t);
        !(i = (a = r.next()).done) && (n.push(a.value), !(e && n.length === e));
        i = !0
      );
    } catch (o) {
      (c = !0), (s = o);
    } finally {
      try {
        !i && r.return != null && r.return();
      } finally {
        if (c) throw s;
      }
    }
    return n;
  }
}
function F9(t, e) {
  if (t) {
    if (typeof t == 'string') return ba(t, e);
    var r = Object.prototype.toString.call(t).slice(8, -1);
    if (
      (r === 'Object' && t.constructor && (r = t.constructor.name),
      r === 'Map' || r === 'Set')
    )
      return Array.from(t);
    if (r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return ba(t, e);
  }
}
function ba(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
  return n;
}
function VV() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function HV() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var m9 = function () {},
  _a = {},
  O9 = {},
  B9 = null,
  j9 = { mark: m9, measure: m9 };
try {
  typeof window < 'u' && (_a = window),
    typeof document < 'u' && (O9 = document),
    typeof MutationObserver < 'u' && (B9 = MutationObserver),
    typeof performance < 'u' && (j9 = performance);
} catch {}
var zV = _a.navigator || {},
  g9 = zV.userAgent,
  v9 = g9 === void 0 ? '' : g9,
  Ae = _a,
  a2 = O9,
  C9 = B9,
  Jr = j9,
  cE = !!Ae.document,
  ie =
    !!a2.documentElement &&
    !!a2.head &&
    typeof a2.addEventListener == 'function' &&
    typeof a2.createElement == 'function',
  U9 = ~v9.indexOf('MSIE') || ~v9.indexOf('Trident/'),
  e6,
  t6,
  n6,
  r6,
  i6,
  te = '___FONT_AWESOME___',
  wa = 16,
  $9 = 'fa',
  G9 = 'svg-inline--fa',
  ft = 'data-fa-i2svg',
  Da = 'data-fa-pseudo-element',
  bV = 'data-fa-pseudo-element-pending',
  Ra = 'data-prefix',
  Pa = 'data-icon',
  M9 = 'fontawesome-i2svg',
  wV = 'async',
  DV = ['HTML', 'HEAD', 'STYLE', 'SCRIPT'],
  q9 = (function () {
    try {
      return !0;
    } catch {
      return !1;
    }
  })(),
  c2 = 'classic',
  l2 = 'sharp',
  Fa = [c2, l2];
function V4(t) {
  return new Proxy(t, {
    get: function (r, n) {
      return n in r ? r[n] : r[c2];
    },
  });
}
var m4 = V4(
    ((e6 = {}),
    z2(e6, c2, {
      fa: 'solid',
      fas: 'solid',
      'fa-solid': 'solid',
      far: 'regular',
      'fa-regular': 'regular',
      fal: 'light',
      'fa-light': 'light',
      fat: 'thin',
      'fa-thin': 'thin',
      fad: 'duotone',
      'fa-duotone': 'duotone',
      fab: 'brands',
      'fa-brands': 'brands',
      fak: 'kit',
      fakd: 'kit',
      'fa-kit': 'kit',
      'fa-kit-duotone': 'kit',
    }),
    z2(e6, l2, {
      fa: 'solid',
      fass: 'solid',
      'fa-solid': 'solid',
      fasr: 'regular',
      'fa-regular': 'regular',
      fasl: 'light',
      'fa-light': 'light',
      fast: 'thin',
      'fa-thin': 'thin',
    }),
    e6)
  ),
  g4 = V4(
    ((t6 = {}),
    z2(t6, c2, {
      solid: 'fas',
      regular: 'far',
      light: 'fal',
      thin: 'fat',
      duotone: 'fad',
      brands: 'fab',
      kit: 'fak',
    }),
    z2(t6, l2, { solid: 'fass', regular: 'fasr', light: 'fasl', thin: 'fast' }),
    t6)
  ),
  v4 = V4(
    ((n6 = {}),
    z2(n6, c2, {
      fab: 'fa-brands',
      fad: 'fa-duotone',
      fak: 'fa-kit',
      fal: 'fa-light',
      far: 'fa-regular',
      fas: 'fa-solid',
      fat: 'fa-thin',
    }),
    z2(n6, l2, {
      fass: 'fa-solid',
      fasr: 'fa-regular',
      fasl: 'fa-light',
      fast: 'fa-thin',
    }),
    n6)
  ),
  xV = V4(
    ((r6 = {}),
    z2(r6, c2, {
      'fa-brands': 'fab',
      'fa-duotone': 'fad',
      'fa-kit': 'fak',
      'fa-light': 'fal',
      'fa-regular': 'far',
      'fa-solid': 'fas',
      'fa-thin': 'fat',
    }),
    z2(r6, l2, {
      'fa-solid': 'fass',
      'fa-regular': 'fasr',
      'fa-light': 'fasl',
      'fa-thin': 'fast',
    }),
    r6)
  ),
  LV = /fa(s|r|l|t|d|b|k|ss|sr|sl|st)?[\-\ ]/,
  W9 = 'fa-layers-text',
  SV =
    /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp|Kit)?.*/i,
  NV = V4(
    ((i6 = {}),
    z2(i6, c2, {
      900: 'fas',
      400: 'far',
      normal: 'far',
      300: 'fal',
      100: 'fat',
    }),
    z2(i6, l2, { 900: 'fass', 400: 'fasr', 300: 'fasl', 100: 'fast' }),
    i6)
  ),
  Y9 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  EV = Y9.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]),
  IV = [
    'class',
    'data-prefix',
    'data-icon',
    'data-fa-transform',
    'data-fa-mask',
  ],
  ot = {
    GROUP: 'duotone-group',
    SWAP_OPACITY: 'swap-opacity',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
  },
  C4 = new Set();
Object.keys(g4[c2]).map(C4.add.bind(C4));
Object.keys(g4[l2]).map(C4.add.bind(C4));
var AV = []
    .concat(Fa, y4(C4), [
      '2xs',
      'xs',
      'sm',
      'lg',
      'xl',
      '2xl',
      'beat',
      'border',
      'fade',
      'beat-fade',
      'bounce',
      'flip-both',
      'flip-horizontal',
      'flip-vertical',
      'flip',
      'fw',
      'inverse',
      'layers-counter',
      'layers-text',
      'layers',
      'li',
      'pull-left',
      'pull-right',
      'pulse',
      'rotate-180',
      'rotate-270',
      'rotate-90',
      'rotate-by',
      'shake',
      'spin-pulse',
      'spin-reverse',
      'spin',
      'stack-1x',
      'stack-2x',
      'stack',
      'ul',
      ot.GROUP,
      ot.SWAP_OPACITY,
      ot.PRIMARY,
      ot.SECONDARY,
    ])
    .concat(
      Y9.map(function (t) {
        return ''.concat(t, 'x');
      })
    )
    .concat(
      EV.map(function (t) {
        return 'w-'.concat(t);
      })
    ),
  h4 = Ae.FontAwesomeConfig || {};
function TV(t) {
  var e = a2.querySelector('script[' + t + ']');
  if (e) return e.getAttribute(t);
}
function kV(t) {
  return t === '' ? !0 : t === 'false' ? !1 : t === 'true' ? !0 : t;
}
a2 &&
  typeof a2.querySelector == 'function' &&
  ((y9 = [
    ['data-family-prefix', 'familyPrefix'],
    ['data-css-prefix', 'cssPrefix'],
    ['data-family-default', 'familyDefault'],
    ['data-style-default', 'styleDefault'],
    ['data-replacement-class', 'replacementClass'],
    ['data-auto-replace-svg', 'autoReplaceSvg'],
    ['data-auto-add-css', 'autoAddCss'],
    ['data-auto-a11y', 'autoA11y'],
    ['data-search-pseudo-elements', 'searchPseudoElements'],
    ['data-observe-mutations', 'observeMutations'],
    ['data-mutate-approach', 'mutateApproach'],
    ['data-keep-original-source', 'keepOriginalSource'],
    ['data-measure-performance', 'measurePerformance'],
    ['data-show-missing-icons', 'showMissingIcons'],
  ]),
  y9.forEach(function (t) {
    var e = ka(t, 2),
      r = e[0],
      n = e[1],
      i = kV(TV(r));
    i != null && (h4[n] = i);
  }));
var y9,
  Q9 = {
    styleDefault: 'solid',
    familyDefault: 'classic',
    cssPrefix: $9,
    replacementClass: G9,
    autoReplaceSvg: !0,
    autoAddCss: !0,
    autoA11y: !0,
    searchPseudoElements: !1,
    observeMutations: !0,
    mutateApproach: 'async',
    keepOriginalSource: !0,
    measurePerformance: !1,
    showMissingIcons: !0,
  };
h4.familyPrefix && (h4.cssPrefix = h4.familyPrefix);
var s3 = y(y({}, Q9), h4);
s3.autoReplaceSvg || (s3.observeMutations = !1);
var x = {};
Object.keys(Q9).forEach(function (t) {
  Object.defineProperty(x, t, {
    enumerable: !0,
    set: function (r) {
      (s3[t] = r),
        p4.forEach(function (n) {
          return n(x);
        });
    },
    get: function () {
      return s3[t];
    },
  });
});
Object.defineProperty(x, 'familyPrefix', {
  enumerable: !0,
  set: function (e) {
    (s3.cssPrefix = e),
      p4.forEach(function (r) {
        return r(x);
      });
  },
  get: function () {
    return s3.cssPrefix;
  },
});
Ae.FontAwesomeConfig = x;
var p4 = [];
function _V(t) {
  return (
    p4.push(t),
    function () {
      p4.splice(p4.indexOf(t), 1);
    }
  );
}
var Ie = wa,
  k1 = { size: 16, x: 0, y: 0, rotate: 0, flipX: !1, flipY: !1 };
function RV(t) {
  if (!(!t || !ie)) {
    var e = a2.createElement('style');
    e.setAttribute('type', 'text/css'), (e.innerHTML = t);
    for (var r = a2.head.childNodes, n = null, i = r.length - 1; i > -1; i--) {
      var c = r[i],
        a = (c.tagName || '').toUpperCase();
      ['STYLE', 'LINK'].indexOf(a) > -1 && (n = c);
    }
    return a2.head.insertBefore(e, n), t;
  }
}
var PV = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function M4() {
  for (var t = 12, e = ''; t-- > 0; ) e += PV[(Math.random() * 62) | 0];
  return e;
}
function o3(t) {
  for (var e = [], r = (t || []).length >>> 0; r--; ) e[r] = t[r];
  return e;
}
function Oa(t) {
  return t.classList
    ? o3(t.classList)
    : (t.getAttribute('class') || '').split(' ').filter(function (e) {
        return e;
      });
}
function Z9(t) {
  return ''
    .concat(t)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function FV(t) {
  return Object.keys(t || {})
    .reduce(function (e, r) {
      return e + ''.concat(r, '="').concat(Z9(t[r]), '" ');
    }, '')
    .trim();
}
function h6(t) {
  return Object.keys(t || {}).reduce(function (e, r) {
    return e + ''.concat(r, ': ').concat(t[r].trim(), ';');
  }, '');
}
function Ba(t) {
  return (
    t.size !== k1.size ||
    t.x !== k1.x ||
    t.y !== k1.y ||
    t.rotate !== k1.rotate ||
    t.flipX ||
    t.flipY
  );
}
function OV(t) {
  var e = t.transform,
    r = t.containerWidth,
    n = t.iconWidth,
    i = { transform: 'translate('.concat(r / 2, ' 256)') },
    c = 'translate('.concat(e.x * 32, ', ').concat(e.y * 32, ') '),
    a = 'scale('
      .concat((e.size / 16) * (e.flipX ? -1 : 1), ', ')
      .concat((e.size / 16) * (e.flipY ? -1 : 1), ') '),
    s = 'rotate('.concat(e.rotate, ' 0 0)'),
    o = { transform: ''.concat(c, ' ').concat(a, ' ').concat(s) },
    l = { transform: 'translate('.concat((n / 2) * -1, ' -256)') };
  return { outer: i, inner: o, path: l };
}
function BV(t) {
  var e = t.transform,
    r = t.width,
    n = r === void 0 ? wa : r,
    i = t.height,
    c = i === void 0 ? wa : i,
    a = t.startCentered,
    s = a === void 0 ? !1 : a,
    o = '';
  return (
    s && U9
      ? (o += 'translate('
          .concat(e.x / Ie - n / 2, 'em, ')
          .concat(e.y / Ie - c / 2, 'em) '))
      : s
      ? (o += 'translate(calc(-50% + '
          .concat(e.x / Ie, 'em), calc(-50% + ')
          .concat(e.y / Ie, 'em)) '))
      : (o += 'translate('.concat(e.x / Ie, 'em, ').concat(e.y / Ie, 'em) ')),
    (o += 'scale('
      .concat((e.size / Ie) * (e.flipX ? -1 : 1), ', ')
      .concat((e.size / Ie) * (e.flipY ? -1 : 1), ') ')),
    (o += 'rotate('.concat(e.rotate, 'deg) ')),
    o
  );
}
var jV = `:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-counter-scale, 0.25));
          transform: scale(var(--fa-counter-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  -webkit-transform: scale(var(--fa-layers-scale, 0.25));
          transform: scale(var(--fa-layers-scale, 0.25));
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(var(--fa-li-width, 2em) * -1);
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  -webkit-animation-name: fa-beat;
          animation-name: fa-beat;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  -webkit-animation-name: fa-bounce;
          animation-name: fa-bounce;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  -webkit-animation-name: fa-fade;
          animation-name: fa-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  -webkit-animation-name: fa-beat-fade;
          animation-name: fa-beat-fade;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  -webkit-animation-name: fa-flip;
          animation-name: fa-flip;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);
          animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  -webkit-animation-name: fa-shake;
          animation-name: fa-shake;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-delay: var(--fa-animation-delay, 0s);
          animation-delay: var(--fa-animation-delay, 0s);
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 2s);
          animation-duration: var(--fa-animation-duration, 2s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, linear);
          animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  -webkit-animation-name: fa-spin;
          animation-name: fa-spin;
  -webkit-animation-direction: var(--fa-animation-direction, normal);
          animation-direction: var(--fa-animation-direction, normal);
  -webkit-animation-duration: var(--fa-animation-duration, 1s);
          animation-duration: var(--fa-animation-duration, 1s);
  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);
          animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));
          animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    -webkit-animation-delay: -1ms;
            animation-delay: -1ms;
    -webkit-animation-duration: 1ms;
            animation-duration: 1ms;
    -webkit-animation-iteration-count: 1;
            animation-iteration-count: 1;
    -webkit-transition-delay: 0s;
            transition-delay: 0s;
    -webkit-transition-duration: 0s;
            transition-duration: 0s;
  }
}
@-webkit-keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-beat {
  0%, 90% {
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  45% {
    -webkit-transform: scale(var(--fa-beat-scale, 1.25));
            transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@-webkit-keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-bounce {
  0% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  10% {
    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
  100% {
    -webkit-transform: scale(1, 1) translateY(0);
            transform: scale(1, 1) translateY(0);
  }
}
@-webkit-keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@-webkit-keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    -webkit-transform: scale(1);
            transform: scale(1);
  }
  50% {
    opacity: 1;
    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));
            transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@-webkit-keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-flip {
  50% {
    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@-webkit-keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@keyframes fa-shake {
  0% {
    -webkit-transform: rotate(-15deg);
            transform: rotate(-15deg);
  }
  4% {
    -webkit-transform: rotate(15deg);
            transform: rotate(15deg);
  }
  8%, 24% {
    -webkit-transform: rotate(-18deg);
            transform: rotate(-18deg);
  }
  12%, 28% {
    -webkit-transform: rotate(18deg);
            transform: rotate(18deg);
  }
  16% {
    -webkit-transform: rotate(-22deg);
            transform: rotate(-22deg);
  }
  20% {
    -webkit-transform: rotate(22deg);
            transform: rotate(22deg);
  }
  32% {
    -webkit-transform: rotate(-12deg);
            transform: rotate(-12deg);
  }
  36% {
    -webkit-transform: rotate(12deg);
            transform: rotate(12deg);
  }
  40%, 100% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
}
@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
}

.fa-rotate-180 {
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.fa-rotate-270 {
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
}

.fa-flip-horizontal {
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}

.fa-flip-vertical {
  -webkit-transform: scale(1, -1);
          transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  -webkit-transform: scale(-1, -1);
          transform: scale(-1, -1);
}

.fa-rotate-by {
  -webkit-transform: rotate(var(--fa-rotate-angle, none));
          transform: rotate(var(--fa-rotate-angle, none));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;
function X9() {
  var t = $9,
    e = G9,
    r = x.cssPrefix,
    n = x.replacementClass,
    i = jV;
  if (r !== t || n !== e) {
    var c = new RegExp('\\.'.concat(t, '\\-'), 'g'),
      a = new RegExp('\\--'.concat(t, '\\-'), 'g'),
      s = new RegExp('\\.'.concat(e), 'g');
    i = i
      .replace(c, '.'.concat(r, '-'))
      .replace(a, '--'.concat(r, '-'))
      .replace(s, '.'.concat(n));
  }
  return i;
}
var V9 = !1;
function ya() {
  x.autoAddCss && !V9 && (RV(X9()), (V9 = !0));
}
var UV = {
    mixout: function () {
      return { dom: { css: X9, insertCss: ya } };
    },
    hooks: function () {
      return {
        beforeDOMElementCreation: function () {
          ya();
        },
        beforeI2svg: function () {
          ya();
        },
      };
    },
  },
  ne = Ae || {};
ne[te] || (ne[te] = {});
ne[te].styles || (ne[te].styles = {});
ne[te].hooks || (ne[te].hooks = {});
ne[te].shims || (ne[te].shims = []);
var y1 = ne[te],
  K9 = [],
  $V = function t() {
    a2.removeEventListener('DOMContentLoaded', t),
      (u6 = 1),
      K9.map(function (e) {
        return e();
      });
  },
  u6 = !1;
ie &&
  ((u6 = (a2.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(
    a2.readyState
  )),
  u6 || a2.addEventListener('DOMContentLoaded', $V));
function GV(t) {
  ie && (u6 ? setTimeout(t, 0) : K9.push(t));
}
function H4(t) {
  var e = t.tag,
    r = t.attributes,
    n = r === void 0 ? {} : r,
    i = t.children,
    c = i === void 0 ? [] : i;
  return typeof t == 'string'
    ? Z9(t)
    : '<'
        .concat(e, ' ')
        .concat(FV(n), '>')
        .concat(c.map(H4).join(''), '</')
        .concat(e, '>');
}
function H9(t, e, r) {
  if (t && t[e] && t[e][r]) return { prefix: e, iconName: r, icon: t[e][r] };
}
var qV = function (e, r) {
    return function (n, i, c, a) {
      return e.call(r, n, i, c, a);
    };
  },
  Va = function (e, r, n, i) {
    var c = Object.keys(e),
      a = c.length,
      s = i !== void 0 ? qV(r, i) : r,
      o,
      l,
      f;
    for (
      n === void 0 ? ((o = 1), (f = e[c[0]])) : ((o = 0), (f = n));
      o < a;
      o++
    )
      (l = c[o]), (f = s(f, e[l], l, e));
    return f;
  };
function WV(t) {
  for (var e = [], r = 0, n = t.length; r < n; ) {
    var i = t.charCodeAt(r++);
    if (i >= 55296 && i <= 56319 && r < n) {
      var c = t.charCodeAt(r++);
      (c & 64512) == 56320
        ? e.push(((i & 1023) << 10) + (c & 1023) + 65536)
        : (e.push(i), r--);
    } else e.push(i);
  }
  return e;
}
function xa(t) {
  var e = WV(t);
  return e.length === 1 ? e[0].toString(16) : null;
}
function YV(t, e) {
  var r = t.length,
    n = t.charCodeAt(e),
    i;
  return n >= 55296 &&
    n <= 56319 &&
    r > e + 1 &&
    ((i = t.charCodeAt(e + 1)), i >= 56320 && i <= 57343)
    ? (n - 55296) * 1024 + i - 56320 + 65536
    : n;
}
function z9(t) {
  return Object.keys(t).reduce(function (e, r) {
    var n = t[r],
      i = !!n.icon;
    return i ? (e[n.iconName] = n.icon) : (e[r] = n), e;
  }, {});
}
function La(t, e) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
    n = r.skipHooks,
    i = n === void 0 ? !1 : n,
    c = z9(e);
  typeof y1.hooks.addPack == 'function' && !i
    ? y1.hooks.addPack(t, z9(e))
    : (y1.styles[t] = y(y({}, y1.styles[t] || {}), c)),
    t === 'fas' && La('fa', e);
}
var c6,
  a6,
  s6,
  i3 = y1.styles,
  QV = y1.shims,
  ZV =
    ((c6 = {}),
    z2(c6, c2, Object.values(v4[c2])),
    z2(c6, l2, Object.values(v4[l2])),
    c6),
  ja = null,
  J9 = {},
  ef = {},
  tf = {},
  nf = {},
  rf = {},
  XV =
    ((a6 = {}),
    z2(a6, c2, Object.keys(m4[c2])),
    z2(a6, l2, Object.keys(m4[l2])),
    a6);
function KV(t) {
  return ~AV.indexOf(t);
}
function JV(t, e) {
  var r = e.split('-'),
    n = r[0],
    i = r.slice(1).join('-');
  return n === t && i !== '' && !KV(i) ? i : null;
}
var cf = function () {
  var e = function (c) {
    return Va(
      i3,
      function (a, s, o) {
        return (a[o] = Va(s, c, {})), a;
      },
      {}
    );
  };
  (J9 = e(function (i, c, a) {
    if ((c[3] && (i[c[3]] = a), c[2])) {
      var s = c[2].filter(function (o) {
        return typeof o == 'number';
      });
      s.forEach(function (o) {
        i[o.toString(16)] = a;
      });
    }
    return i;
  })),
    (ef = e(function (i, c, a) {
      if (((i[a] = a), c[2])) {
        var s = c[2].filter(function (o) {
          return typeof o == 'string';
        });
        s.forEach(function (o) {
          i[o] = a;
        });
      }
      return i;
    })),
    (rf = e(function (i, c, a) {
      var s = c[2];
      return (
        (i[a] = a),
        s.forEach(function (o) {
          i[o] = a;
        }),
        i
      );
    }));
  var r = 'far' in i3 || x.autoFetchSvg,
    n = Va(
      QV,
      function (i, c) {
        var a = c[0],
          s = c[1],
          o = c[2];
        return (
          s === 'far' && !r && (s = 'fas'),
          typeof a == 'string' && (i.names[a] = { prefix: s, iconName: o }),
          typeof a == 'number' &&
            (i.unicodes[a.toString(16)] = { prefix: s, iconName: o }),
          i
        );
      },
      { names: {}, unicodes: {} }
    );
  (tf = n.names),
    (nf = n.unicodes),
    (ja = p6(x.styleDefault, { family: x.familyDefault }));
};
_V(function (t) {
  ja = p6(t.styleDefault, { family: x.familyDefault });
});
cf();
function Ua(t, e) {
  return (J9[t] || {})[e];
}
function eH(t, e) {
  return (ef[t] || {})[e];
}
function lt(t, e) {
  return (rf[t] || {})[e];
}
function af(t) {
  return tf[t] || { prefix: null, iconName: null };
}
function tH(t) {
  var e = nf[t],
    r = Ua('fas', t);
  return (
    e ||
    (r ? { prefix: 'fas', iconName: r } : null) || {
      prefix: null,
      iconName: null,
    }
  );
}
function Te() {
  return ja;
}
var $a = function () {
  return { prefix: null, iconName: null, rest: [] };
};
function p6(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    r = e.family,
    n = r === void 0 ? c2 : r,
    i = m4[n][t],
    c = g4[n][t] || g4[n][i],
    a = t in y1.styles ? t : null;
  return c || a || null;
}
var b9 =
  ((s6 = {}),
  z2(s6, c2, Object.keys(v4[c2])),
  z2(s6, l2, Object.keys(v4[l2])),
  s6);
function m6(t) {
  var e,
    r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    n = r.skipLookups,
    i = n === void 0 ? !1 : n,
    c =
      ((e = {}),
      z2(e, c2, ''.concat(x.cssPrefix, '-').concat(c2)),
      z2(e, l2, ''.concat(x.cssPrefix, '-').concat(l2)),
      e),
    a = null,
    s = c2;
  (t.includes(c[c2]) ||
    t.some(function (l) {
      return b9[c2].includes(l);
    })) &&
    (s = c2),
    (t.includes(c[l2]) ||
      t.some(function (l) {
        return b9[l2].includes(l);
      })) &&
      (s = l2);
  var o = t.reduce(function (l, f) {
    var u = JV(x.cssPrefix, f);
    if (
      (i3[f]
        ? ((f = ZV[s].includes(f) ? xV[s][f] : f), (a = f), (l.prefix = f))
        : XV[s].indexOf(f) > -1
        ? ((a = f), (l.prefix = p6(f, { family: s })))
        : u
        ? (l.iconName = u)
        : f !== x.replacementClass &&
          f !== c[c2] &&
          f !== c[l2] &&
          l.rest.push(f),
      !i && l.prefix && l.iconName)
    ) {
      var d = a === 'fa' ? af(l.iconName) : {},
        h = lt(l.prefix, l.iconName);
      d.prefix && (a = null),
        (l.iconName = d.iconName || h || l.iconName),
        (l.prefix = d.prefix || l.prefix),
        l.prefix === 'far' &&
          !i3.far &&
          i3.fas &&
          !x.autoFetchSvg &&
          (l.prefix = 'fas');
    }
    return l;
  }, $a());
  return (
    (t.includes('fa-brands') || t.includes('fab')) && (o.prefix = 'fab'),
    (t.includes('fa-duotone') || t.includes('fad')) && (o.prefix = 'fad'),
    !o.prefix &&
      s === l2 &&
      (i3.fass || x.autoFetchSvg) &&
      ((o.prefix = 'fass'),
      (o.iconName = lt(o.prefix, o.iconName) || o.iconName)),
    (o.prefix === 'fa' || a === 'fa') && (o.prefix = Te() || 'fas'),
    o
  );
}
var nH = (function () {
    function t() {
      mV(this, t), (this.definitions = {});
    }
    return (
      gV(t, [
        {
          key: 'add',
          value: function () {
            for (
              var r = this, n = arguments.length, i = new Array(n), c = 0;
              c < n;
              c++
            )
              i[c] = arguments[c];
            var a = i.reduce(this._pullDefinitions, {});
            Object.keys(a).forEach(function (s) {
              (r.definitions[s] = y(y({}, r.definitions[s] || {}), a[s])),
                La(s, a[s]);
              var o = v4[c2][s];
              o && La(o, a[s]), cf();
            });
          },
        },
        {
          key: 'reset',
          value: function () {
            this.definitions = {};
          },
        },
        {
          key: '_pullDefinitions',
          value: function (r, n) {
            var i = n.prefix && n.iconName && n.icon ? { 0: n } : n;
            return (
              Object.keys(i).map(function (c) {
                var a = i[c],
                  s = a.prefix,
                  o = a.iconName,
                  l = a.icon,
                  f = l[2];
                r[s] || (r[s] = {}),
                  f.length > 0 &&
                    f.forEach(function (u) {
                      typeof u == 'string' && (r[s][u] = l);
                    }),
                  (r[s][o] = l);
              }),
              r
            );
          },
        },
      ]),
      t
    );
  })(),
  w9 = [],
  c3 = {},
  a3 = {},
  rH = Object.keys(a3);
function iH(t, e) {
  var r = e.mixoutsTo;
  return (
    (w9 = t),
    (c3 = {}),
    Object.keys(a3).forEach(function (n) {
      rH.indexOf(n) === -1 && delete a3[n];
    }),
    w9.forEach(function (n) {
      var i = n.mixout ? n.mixout() : {};
      if (
        (Object.keys(i).forEach(function (a) {
          typeof i[a] == 'function' && (r[a] = i[a]),
            f6(i[a]) === 'object' &&
              Object.keys(i[a]).forEach(function (s) {
                r[a] || (r[a] = {}), (r[a][s] = i[a][s]);
              });
        }),
        n.hooks)
      ) {
        var c = n.hooks();
        Object.keys(c).forEach(function (a) {
          c3[a] || (c3[a] = []), c3[a].push(c[a]);
        });
      }
      n.provides && n.provides(a3);
    }),
    r
  );
}
function Sa(t, e) {
  for (
    var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), i = 2;
    i < r;
    i++
  )
    n[i - 2] = arguments[i];
  var c = c3[t] || [];
  return (
    c.forEach(function (a) {
      e = a.apply(null, [e].concat(n));
    }),
    e
  );
}
function ut(t) {
  for (
    var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), n = 1;
    n < e;
    n++
  )
    r[n - 1] = arguments[n];
  var i = c3[t] || [];
  i.forEach(function (c) {
    c.apply(null, r);
  });
}
function re() {
  var t = arguments[0],
    e = Array.prototype.slice.call(arguments, 1);
  return a3[t] ? a3[t].apply(null, e) : void 0;
}
function Na(t) {
  t.prefix === 'fa' && (t.prefix = 'fas');
  var e = t.iconName,
    r = t.prefix || Te();
  if (e)
    return (e = lt(r, e) || e), H9(sf.definitions, r, e) || H9(y1.styles, r, e);
}
var sf = new nH(),
  cH = function () {
    (x.autoReplaceSvg = !1), (x.observeMutations = !1), ut('noAuto');
  },
  aH = {
    i2svg: function () {
      var e =
        arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      return ie
        ? (ut('beforeI2svg', e), re('pseudoElements2svg', e), re('i2svg', e))
        : Promise.reject('Operation requires a DOM of some kind.');
    },
    watch: function () {
      var e =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
        r = e.autoReplaceSvgRoot;
      x.autoReplaceSvg === !1 && (x.autoReplaceSvg = !0),
        (x.observeMutations = !0),
        GV(function () {
          oH({ autoReplaceSvgRoot: r }), ut('watch', e);
        });
    },
  },
  sH = {
    icon: function (e) {
      if (e === null) return null;
      if (f6(e) === 'object' && e.prefix && e.iconName)
        return {
          prefix: e.prefix,
          iconName: lt(e.prefix, e.iconName) || e.iconName,
        };
      if (Array.isArray(e) && e.length === 2) {
        var r = e[1].indexOf('fa-') === 0 ? e[1].slice(3) : e[1],
          n = p6(e[0]);
        return { prefix: n, iconName: lt(n, r) || r };
      }
      if (
        typeof e == 'string' &&
        (e.indexOf(''.concat(x.cssPrefix, '-')) > -1 || e.match(LV))
      ) {
        var i = m6(e.split(' '), { skipLookups: !0 });
        return {
          prefix: i.prefix || Te(),
          iconName: lt(i.prefix, i.iconName) || i.iconName,
        };
      }
      if (typeof e == 'string') {
        var c = Te();
        return { prefix: c, iconName: lt(c, e) || e };
      }
    },
  },
  t1 = {
    noAuto: cH,
    config: x,
    dom: aH,
    parse: sH,
    library: sf,
    findIconDefinition: Na,
    toHtml: H4,
  },
  oH = function () {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      r = e.autoReplaceSvgRoot,
      n = r === void 0 ? a2 : r;
    (Object.keys(y1.styles).length > 0 || x.autoFetchSvg) &&
      ie &&
      x.autoReplaceSvg &&
      t1.dom.i2svg({ node: n });
  };
function g6(t, e) {
  return (
    Object.defineProperty(t, 'abstract', { get: e }),
    Object.defineProperty(t, 'html', {
      get: function () {
        return t.abstract.map(function (n) {
          return H4(n);
        });
      },
    }),
    Object.defineProperty(t, 'node', {
      get: function () {
        if (ie) {
          var n = a2.createElement('div');
          return (n.innerHTML = t.html), n.children;
        }
      },
    }),
    t
  );
}
function lH(t) {
  var e = t.children,
    r = t.main,
    n = t.mask,
    i = t.attributes,
    c = t.styles,
    a = t.transform;
  if (Ba(a) && r.found && !n.found) {
    var s = r.width,
      o = r.height,
      l = { x: s / o / 2, y: 0.5 };
    i.style = h6(
      y(
        y({}, c),
        {},
        {
          'transform-origin': ''
            .concat(l.x + a.x / 16, 'em ')
            .concat(l.y + a.y / 16, 'em'),
        }
      )
    );
  }
  return [{ tag: 'svg', attributes: i, children: e }];
}
function fH(t) {
  var e = t.prefix,
    r = t.iconName,
    n = t.children,
    i = t.attributes,
    c = t.symbol,
    a = c === !0 ? ''.concat(e, '-').concat(x.cssPrefix, '-').concat(r) : c;
  return [
    {
      tag: 'svg',
      attributes: { style: 'display: none;' },
      children: [
        { tag: 'symbol', attributes: y(y({}, i), {}, { id: a }), children: n },
      ],
    },
  ];
}
function Ga(t) {
  var e = t.icons,
    r = e.main,
    n = e.mask,
    i = t.prefix,
    c = t.iconName,
    a = t.transform,
    s = t.symbol,
    o = t.title,
    l = t.maskId,
    f = t.titleId,
    u = t.extra,
    d = t.watchable,
    h = d === void 0 ? !1 : d,
    C = n.found ? n : r,
    N = C.width,
    L = C.height,
    b = i === 'fak',
    U = [x.replacementClass, c ? ''.concat(x.cssPrefix, '-').concat(c) : '']
      .filter(function (V1) {
        return u.classes.indexOf(V1) === -1;
      })
      .filter(function (V1) {
        return V1 !== '' || !!V1;
      })
      .concat(u.classes)
      .join(' '),
    $ = {
      children: [],
      attributes: y(
        y({}, u.attributes),
        {},
        {
          'data-prefix': i,
          'data-icon': c,
          class: U,
          role: u.attributes.role || 'img',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 '.concat(N, ' ').concat(L),
        }
      ),
    },
    B =
      b && !~u.classes.indexOf('fa-fw')
        ? { width: ''.concat((N / L) * 16 * 0.0625, 'em') }
        : {};
  h && ($.attributes[ft] = ''),
    o &&
      ($.children.push({
        tag: 'title',
        attributes: {
          id: $.attributes['aria-labelledby'] || 'title-'.concat(f || M4()),
        },
        children: [o],
      }),
      delete $.attributes.title);
  var s2 = y(
      y({}, $),
      {},
      {
        prefix: i,
        iconName: c,
        main: r,
        mask: n,
        maskId: l,
        transform: a,
        symbol: s,
        styles: y(y({}, B), u.styles),
      }
    ),
    f2 =
      n.found && r.found
        ? re('generateAbstractMask', s2) || { children: [], attributes: {} }
        : re('generateAbstractIcon', s2) || { children: [], attributes: {} },
    E2 = f2.children,
    _e = f2.attributes;
  return (s2.children = E2), (s2.attributes = _e), s ? fH(s2) : lH(s2);
}
function D9(t) {
  var e = t.content,
    r = t.width,
    n = t.height,
    i = t.transform,
    c = t.title,
    a = t.extra,
    s = t.watchable,
    o = s === void 0 ? !1 : s,
    l = y(
      y(y({}, a.attributes), c ? { title: c } : {}),
      {},
      { class: a.classes.join(' ') }
    );
  o && (l[ft] = '');
  var f = y({}, a.styles);
  Ba(i) &&
    ((f.transform = BV({
      transform: i,
      startCentered: !0,
      width: r,
      height: n,
    })),
    (f['-webkit-transform'] = f.transform));
  var u = h6(f);
  u.length > 0 && (l.style = u);
  var d = [];
  return (
    d.push({ tag: 'span', attributes: l, children: [e] }),
    c &&
      d.push({ tag: 'span', attributes: { class: 'sr-only' }, children: [c] }),
    d
  );
}
function uH(t) {
  var e = t.content,
    r = t.title,
    n = t.extra,
    i = y(
      y(y({}, n.attributes), r ? { title: r } : {}),
      {},
      { class: n.classes.join(' ') }
    ),
    c = h6(n.styles);
  c.length > 0 && (i.style = c);
  var a = [];
  return (
    a.push({ tag: 'span', attributes: i, children: [e] }),
    r &&
      a.push({ tag: 'span', attributes: { class: 'sr-only' }, children: [r] }),
    a
  );
}
var Ha = y1.styles;
function Ea(t) {
  var e = t[0],
    r = t[1],
    n = t.slice(4),
    i = ka(n, 1),
    c = i[0],
    a = null;
  return (
    Array.isArray(c)
      ? (a = {
          tag: 'g',
          attributes: { class: ''.concat(x.cssPrefix, '-').concat(ot.GROUP) },
          children: [
            {
              tag: 'path',
              attributes: {
                class: ''.concat(x.cssPrefix, '-').concat(ot.SECONDARY),
                fill: 'currentColor',
                d: c[0],
              },
            },
            {
              tag: 'path',
              attributes: {
                class: ''.concat(x.cssPrefix, '-').concat(ot.PRIMARY),
                fill: 'currentColor',
                d: c[1],
              },
            },
          ],
        })
      : (a = { tag: 'path', attributes: { fill: 'currentColor', d: c } }),
    { found: !0, width: e, height: r, icon: a }
  );
}
var dH = { found: !1, width: 512, height: 512 };
function hH(t, e) {
  !q9 &&
    !x.showMissingIcons &&
    t &&
    console.error(
      'Icon with name "'.concat(t, '" and prefix "').concat(e, '" is missing.')
    );
}
function Ia(t, e) {
  var r = e;
  return (
    e === 'fa' && x.styleDefault !== null && (e = Te()),
    new Promise(function (n, i) {
      var c = {
        found: !1,
        width: 512,
        height: 512,
        icon: re('missingIconAbstract') || {},
      };
      if (r === 'fa') {
        var a = af(t) || {};
        (t = a.iconName || t), (e = a.prefix || e);
      }
      if (t && e && Ha[e] && Ha[e][t]) {
        var s = Ha[e][t];
        return n(Ea(s));
      }
      hH(t, e),
        n(
          y(
            y({}, dH),
            {},
            {
              icon:
                x.showMissingIcons && t ? re('missingIconAbstract') || {} : {},
            }
          )
        );
    })
  );
}
var x9 = function () {},
  Aa =
    x.measurePerformance && Jr && Jr.mark && Jr.measure
      ? Jr
      : { mark: x9, measure: x9 },
  d4 = 'FA "6.5.1"',
  pH = function (e) {
    return (
      Aa.mark(''.concat(d4, ' ').concat(e, ' begins')),
      function () {
        return of(e);
      }
    );
  },
  of = function (e) {
    Aa.mark(''.concat(d4, ' ').concat(e, ' ends')),
      Aa.measure(
        ''.concat(d4, ' ').concat(e),
        ''.concat(d4, ' ').concat(e, ' begins'),
        ''.concat(d4, ' ').concat(e, ' ends')
      );
  },
  qa = { begin: pH, end: of },
  o6 = function () {};
function L9(t) {
  var e = t.getAttribute ? t.getAttribute(ft) : null;
  return typeof e == 'string';
}
function mH(t) {
  var e = t.getAttribute ? t.getAttribute(Ra) : null,
    r = t.getAttribute ? t.getAttribute(Pa) : null;
  return e && r;
}
function gH(t) {
  return (
    t &&
    t.classList &&
    t.classList.contains &&
    t.classList.contains(x.replacementClass)
  );
}
function vH() {
  if (x.autoReplaceSvg === !0) return l6.replace;
  var t = l6[x.autoReplaceSvg];
  return t || l6.replace;
}
function CH(t) {
  return a2.createElementNS('http://www.w3.org/2000/svg', t);
}
function MH(t) {
  return a2.createElement(t);
}
function lf(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
    r = e.ceFn,
    n = r === void 0 ? (t.tag === 'svg' ? CH : MH) : r;
  if (typeof t == 'string') return a2.createTextNode(t);
  var i = n(t.tag);
  Object.keys(t.attributes || []).forEach(function (a) {
    i.setAttribute(a, t.attributes[a]);
  });
  var c = t.children || [];
  return (
    c.forEach(function (a) {
      i.appendChild(lf(a, { ceFn: n }));
    }),
    i
  );
}
function yH(t) {
  var e = ' '.concat(t.outerHTML, ' ');
  return (e = ''.concat(e, 'Font Awesome fontawesome.com ')), e;
}
var l6 = {
  replace: function (e) {
    var r = e[0];
    if (r.parentNode)
      if (
        (e[1].forEach(function (i) {
          r.parentNode.insertBefore(lf(i), r);
        }),
        r.getAttribute(ft) === null && x.keepOriginalSource)
      ) {
        var n = a2.createComment(yH(r));
        r.parentNode.replaceChild(n, r);
      } else r.remove();
  },
  nest: function (e) {
    var r = e[0],
      n = e[1];
    if (~Oa(r).indexOf(x.replacementClass)) return l6.replace(e);
    var i = new RegExp(''.concat(x.cssPrefix, '-.*'));
    if ((delete n[0].attributes.id, n[0].attributes.class)) {
      var c = n[0].attributes.class.split(' ').reduce(
        function (s, o) {
          return (
            o === x.replacementClass || o.match(i)
              ? s.toSvg.push(o)
              : s.toNode.push(o),
            s
          );
        },
        { toNode: [], toSvg: [] }
      );
      (n[0].attributes.class = c.toSvg.join(' ')),
        c.toNode.length === 0
          ? r.removeAttribute('class')
          : r.setAttribute('class', c.toNode.join(' '));
    }
    var a = n.map(function (s) {
      return H4(s);
    }).join(`
`);
    r.setAttribute(ft, ''), (r.innerHTML = a);
  },
};
function S9(t) {
  t();
}
function ff(t, e) {
  var r = typeof e == 'function' ? e : o6;
  if (t.length === 0) r();
  else {
    var n = S9;
    x.mutateApproach === wV && (n = Ae.requestAnimationFrame || S9),
      n(function () {
        var i = vH(),
          c = qa.begin('mutate');
        t.map(i), c(), r();
      });
  }
}
var Wa = !1;
function uf() {
  Wa = !0;
}
function Ta() {
  Wa = !1;
}
var d6 = null;
function N9(t) {
  if (C9 && x.observeMutations) {
    var e = t.treeCallback,
      r = e === void 0 ? o6 : e,
      n = t.nodeCallback,
      i = n === void 0 ? o6 : n,
      c = t.pseudoElementsCallback,
      a = c === void 0 ? o6 : c,
      s = t.observeMutationsRoot,
      o = s === void 0 ? a2 : s;
    (d6 = new C9(function (l) {
      if (!Wa) {
        var f = Te();
        o3(l).forEach(function (u) {
          if (
            (u.type === 'childList' &&
              u.addedNodes.length > 0 &&
              !L9(u.addedNodes[0]) &&
              (x.searchPseudoElements && a(u.target), r(u.target)),
            u.type === 'attributes' &&
              u.target.parentNode &&
              x.searchPseudoElements &&
              a(u.target.parentNode),
            u.type === 'attributes' &&
              L9(u.target) &&
              ~IV.indexOf(u.attributeName))
          )
            if (u.attributeName === 'class' && mH(u.target)) {
              var d = m6(Oa(u.target)),
                h = d.prefix,
                C = d.iconName;
              u.target.setAttribute(Ra, h || f),
                C && u.target.setAttribute(Pa, C);
            } else gH(u.target) && i(u.target);
        });
      }
    })),
      ie &&
        d6.observe(o, {
          childList: !0,
          attributes: !0,
          characterData: !0,
          subtree: !0,
        });
  }
}
function VH() {
  d6 && d6.disconnect();
}
function HH(t) {
  var e = t.getAttribute('style'),
    r = [];
  return (
    e &&
      (r = e.split(';').reduce(function (n, i) {
        var c = i.split(':'),
          a = c[0],
          s = c.slice(1);
        return a && s.length > 0 && (n[a] = s.join(':').trim()), n;
      }, {})),
    r
  );
}
function zH(t) {
  var e = t.getAttribute('data-prefix'),
    r = t.getAttribute('data-icon'),
    n = t.innerText !== void 0 ? t.innerText.trim() : '',
    i = m6(Oa(t));
  return (
    i.prefix || (i.prefix = Te()),
    e && r && ((i.prefix = e), (i.iconName = r)),
    (i.iconName && i.prefix) ||
      (i.prefix &&
        n.length > 0 &&
        (i.iconName =
          eH(i.prefix, t.innerText) || Ua(i.prefix, xa(t.innerText))),
      !i.iconName &&
        x.autoFetchSvg &&
        t.firstChild &&
        t.firstChild.nodeType === Node.TEXT_NODE &&
        (i.iconName = t.firstChild.data)),
    i
  );
}
function bH(t) {
  var e = o3(t.attributes).reduce(function (i, c) {
      return (
        i.name !== 'class' && i.name !== 'style' && (i[c.name] = c.value), i
      );
    }, {}),
    r = t.getAttribute('title'),
    n = t.getAttribute('data-fa-title-id');
  return (
    x.autoA11y &&
      (r
        ? (e['aria-labelledby'] = ''
            .concat(x.replacementClass, '-title-')
            .concat(n || M4()))
        : ((e['aria-hidden'] = 'true'), (e.focusable = 'false'))),
    e
  );
}
function wH() {
  return {
    iconName: null,
    title: null,
    titleId: null,
    prefix: null,
    transform: k1,
    symbol: !1,
    mask: { iconName: null, prefix: null, rest: [] },
    maskId: null,
    extra: { classes: [], styles: {}, attributes: {} },
  };
}
function E9(t) {
  var e =
      arguments.length > 1 && arguments[1] !== void 0
        ? arguments[1]
        : { styleParser: !0 },
    r = zH(t),
    n = r.iconName,
    i = r.prefix,
    c = r.rest,
    a = bH(t),
    s = Sa('parseNodeAttributes', {}, t),
    o = e.styleParser ? HH(t) : [];
  return y(
    {
      iconName: n,
      title: t.getAttribute('title'),
      titleId: t.getAttribute('data-fa-title-id'),
      prefix: i,
      transform: k1,
      mask: { iconName: null, prefix: null, rest: [] },
      maskId: null,
      symbol: !1,
      extra: { classes: c, styles: o, attributes: a },
    },
    s
  );
}
var DH = y1.styles;
function df(t) {
  var e = x.autoReplaceSvg === 'nest' ? E9(t, { styleParser: !1 }) : E9(t);
  return ~e.extra.classes.indexOf(W9)
    ? re('generateLayersText', t, e)
    : re('generateSvgReplacementMutation', t, e);
}
var ke = new Set();
Fa.map(function (t) {
  ke.add('fa-'.concat(t));
});
Object.keys(m4[c2]).map(ke.add.bind(ke));
Object.keys(m4[l2]).map(ke.add.bind(ke));
ke = y4(ke);
function I9(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  if (!ie) return Promise.resolve();
  var r = a2.documentElement.classList,
    n = function (u) {
      return r.add(''.concat(M9, '-').concat(u));
    },
    i = function (u) {
      return r.remove(''.concat(M9, '-').concat(u));
    },
    c = x.autoFetchSvg
      ? ke
      : Fa.map(function (f) {
          return 'fa-'.concat(f);
        }).concat(Object.keys(DH));
  c.includes('fa') || c.push('fa');
  var a = ['.'.concat(W9, ':not([').concat(ft, '])')]
    .concat(
      c.map(function (f) {
        return '.'.concat(f, ':not([').concat(ft, '])');
      })
    )
    .join(', ');
  if (a.length === 0) return Promise.resolve();
  var s = [];
  try {
    s = o3(t.querySelectorAll(a));
  } catch {}
  if (s.length > 0) n('pending'), i('complete');
  else return Promise.resolve();
  var o = qa.begin('onTree'),
    l = s.reduce(function (f, u) {
      try {
        var d = df(u);
        d && f.push(d);
      } catch (h) {
        q9 || (h.name === 'MissingIcon' && console.error(h));
      }
      return f;
    }, []);
  return new Promise(function (f, u) {
    Promise.all(l)
      .then(function (d) {
        ff(d, function () {
          n('active'),
            n('complete'),
            i('pending'),
            typeof e == 'function' && e(),
            o(),
            f();
        });
      })
      .catch(function (d) {
        o(), u(d);
      });
  });
}
function xH(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  df(t).then(function (r) {
    r && ff([r], e);
  });
}
function LH(t) {
  return function (e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = (e || {}).icon ? e : Na(e || {}),
      i = r.mask;
    return (
      i && (i = (i || {}).icon ? i : Na(i || {})),
      t(n, y(y({}, r), {}, { mask: i }))
    );
  };
}
var SH = function (e) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      n = r.transform,
      i = n === void 0 ? k1 : n,
      c = r.symbol,
      a = c === void 0 ? !1 : c,
      s = r.mask,
      o = s === void 0 ? null : s,
      l = r.maskId,
      f = l === void 0 ? null : l,
      u = r.title,
      d = u === void 0 ? null : u,
      h = r.titleId,
      C = h === void 0 ? null : h,
      N = r.classes,
      L = N === void 0 ? [] : N,
      b = r.attributes,
      U = b === void 0 ? {} : b,
      $ = r.styles,
      B = $ === void 0 ? {} : $;
    if (e) {
      var s2 = e.prefix,
        f2 = e.iconName,
        E2 = e.icon;
      return g6(y({ type: 'icon' }, e), function () {
        return (
          ut('beforeDOMElementCreation', { iconDefinition: e, params: r }),
          x.autoA11y &&
            (d
              ? (U['aria-labelledby'] = ''
                  .concat(x.replacementClass, '-title-')
                  .concat(C || M4()))
              : ((U['aria-hidden'] = 'true'), (U.focusable = 'false'))),
          Ga({
            icons: {
              main: Ea(E2),
              mask: o
                ? Ea(o.icon)
                : { found: !1, width: null, height: null, icon: {} },
            },
            prefix: s2,
            iconName: f2,
            transform: y(y({}, k1), i),
            symbol: a,
            title: d,
            maskId: f,
            titleId: C,
            extra: { attributes: U, styles: B, classes: L },
          })
        );
      });
    }
  },
  NH = {
    mixout: function () {
      return { icon: LH(SH) };
    },
    hooks: function () {
      return {
        mutationObserverCallbacks: function (r) {
          return (r.treeCallback = I9), (r.nodeCallback = xH), r;
        },
      };
    },
    provides: function (e) {
      (e.i2svg = function (r) {
        var n = r.node,
          i = n === void 0 ? a2 : n,
          c = r.callback,
          a = c === void 0 ? function () {} : c;
        return I9(i, a);
      }),
        (e.generateSvgReplacementMutation = function (r, n) {
          var i = n.iconName,
            c = n.title,
            a = n.titleId,
            s = n.prefix,
            o = n.transform,
            l = n.symbol,
            f = n.mask,
            u = n.maskId,
            d = n.extra;
          return new Promise(function (h, C) {
            Promise.all([
              Ia(i, s),
              f.iconName
                ? Ia(f.iconName, f.prefix)
                : Promise.resolve({
                    found: !1,
                    width: 512,
                    height: 512,
                    icon: {},
                  }),
            ])
              .then(function (N) {
                var L = ka(N, 2),
                  b = L[0],
                  U = L[1];
                h([
                  r,
                  Ga({
                    icons: { main: b, mask: U },
                    prefix: s,
                    iconName: i,
                    transform: o,
                    symbol: l,
                    maskId: u,
                    title: c,
                    titleId: a,
                    extra: d,
                    watchable: !0,
                  }),
                ]);
              })
              .catch(C);
          });
        }),
        (e.generateAbstractIcon = function (r) {
          var n = r.children,
            i = r.attributes,
            c = r.main,
            a = r.transform,
            s = r.styles,
            o = h6(s);
          o.length > 0 && (i.style = o);
          var l;
          return (
            Ba(a) &&
              (l = re('generateAbstractTransformGrouping', {
                main: c,
                transform: a,
                containerWidth: c.width,
                iconWidth: c.width,
              })),
            n.push(l || c.icon),
            { children: n, attributes: i }
          );
        });
    },
  },
  EH = {
    mixout: function () {
      return {
        layer: function (r) {
          var n =
              arguments.length > 1 && arguments[1] !== void 0
                ? arguments[1]
                : {},
            i = n.classes,
            c = i === void 0 ? [] : i;
          return g6({ type: 'layer' }, function () {
            ut('beforeDOMElementCreation', { assembler: r, params: n });
            var a = [];
            return (
              r(function (s) {
                Array.isArray(s)
                  ? s.map(function (o) {
                      a = a.concat(o.abstract);
                    })
                  : (a = a.concat(s.abstract));
              }),
              [
                {
                  tag: 'span',
                  attributes: {
                    class: [''.concat(x.cssPrefix, '-layers')]
                      .concat(y4(c))
                      .join(' '),
                  },
                  children: a,
                },
              ]
            );
          });
        },
      };
    },
  },
  IH = {
    mixout: function () {
      return {
        counter: function (r) {
          var n =
              arguments.length > 1 && arguments[1] !== void 0
                ? arguments[1]
                : {},
            i = n.title,
            c = i === void 0 ? null : i,
            a = n.classes,
            s = a === void 0 ? [] : a,
            o = n.attributes,
            l = o === void 0 ? {} : o,
            f = n.styles,
            u = f === void 0 ? {} : f;
          return g6({ type: 'counter', content: r }, function () {
            return (
              ut('beforeDOMElementCreation', { content: r, params: n }),
              uH({
                content: r.toString(),
                title: c,
                extra: {
                  attributes: l,
                  styles: u,
                  classes: [''.concat(x.cssPrefix, '-layers-counter')].concat(
                    y4(s)
                  ),
                },
              })
            );
          });
        },
      };
    },
  },
  AH = {
    mixout: function () {
      return {
        text: function (r) {
          var n =
              arguments.length > 1 && arguments[1] !== void 0
                ? arguments[1]
                : {},
            i = n.transform,
            c = i === void 0 ? k1 : i,
            a = n.title,
            s = a === void 0 ? null : a,
            o = n.classes,
            l = o === void 0 ? [] : o,
            f = n.attributes,
            u = f === void 0 ? {} : f,
            d = n.styles,
            h = d === void 0 ? {} : d;
          return g6({ type: 'text', content: r }, function () {
            return (
              ut('beforeDOMElementCreation', { content: r, params: n }),
              D9({
                content: r,
                transform: y(y({}, k1), c),
                title: s,
                extra: {
                  attributes: u,
                  styles: h,
                  classes: [''.concat(x.cssPrefix, '-layers-text')].concat(
                    y4(l)
                  ),
                },
              })
            );
          });
        },
      };
    },
    provides: function (e) {
      e.generateLayersText = function (r, n) {
        var i = n.title,
          c = n.transform,
          a = n.extra,
          s = null,
          o = null;
        if (U9) {
          var l = parseInt(getComputedStyle(r).fontSize, 10),
            f = r.getBoundingClientRect();
          (s = f.width / l), (o = f.height / l);
        }
        return (
          x.autoA11y && !i && (a.attributes['aria-hidden'] = 'true'),
          Promise.resolve([
            r,
            D9({
              content: r.innerHTML,
              width: s,
              height: o,
              transform: c,
              title: i,
              extra: a,
              watchable: !0,
            }),
          ])
        );
      };
    },
  },
  TH = new RegExp('"', 'ug'),
  A9 = [1105920, 1112319];
function kH(t) {
  var e = t.replace(TH, ''),
    r = YV(e, 0),
    n = r >= A9[0] && r <= A9[1],
    i = e.length === 2 ? e[0] === e[1] : !1;
  return { value: xa(i ? e[0] : e), isSecondary: n || i };
}
function T9(t, e) {
  var r = ''.concat(bV).concat(e.replace(':', '-'));
  return new Promise(function (n, i) {
    if (t.getAttribute(r) !== null) return n();
    var c = o3(t.children),
      a = c.filter(function (E2) {
        return E2.getAttribute(Da) === e;
      })[0],
      s = Ae.getComputedStyle(t, e),
      o = s.getPropertyValue('font-family').match(SV),
      l = s.getPropertyValue('font-weight'),
      f = s.getPropertyValue('content');
    if (a && !o) return t.removeChild(a), n();
    if (o && f !== 'none' && f !== '') {
      var u = s.getPropertyValue('content'),
        d = ~['Sharp'].indexOf(o[2]) ? l2 : c2,
        h = ~[
          'Solid',
          'Regular',
          'Light',
          'Thin',
          'Duotone',
          'Brands',
          'Kit',
        ].indexOf(o[2])
          ? g4[d][o[2].toLowerCase()]
          : NV[d][l],
        C = kH(u),
        N = C.value,
        L = C.isSecondary,
        b = o[0].startsWith('FontAwesome'),
        U = Ua(h, N),
        $ = U;
      if (b) {
        var B = tH(N);
        B.iconName && B.prefix && ((U = B.iconName), (h = B.prefix));
      }
      if (
        U &&
        !L &&
        (!a || a.getAttribute(Ra) !== h || a.getAttribute(Pa) !== $)
      ) {
        t.setAttribute(r, $), a && t.removeChild(a);
        var s2 = wH(),
          f2 = s2.extra;
        (f2.attributes[Da] = e),
          Ia(U, h)
            .then(function (E2) {
              var _e = Ga(
                  y(
                    y({}, s2),
                    {},
                    {
                      icons: { main: E2, mask: $a() },
                      prefix: h,
                      iconName: $,
                      extra: f2,
                      watchable: !0,
                    }
                  )
                ),
                V1 = a2.createElementNS('http://www.w3.org/2000/svg', 'svg');
              e === '::before'
                ? t.insertBefore(V1, t.firstChild)
                : t.appendChild(V1),
                (V1.outerHTML = _e.map(function (v6) {
                  return H4(v6);
                }).join(`
`)),
                t.removeAttribute(r),
                n();
            })
            .catch(i);
      } else n();
    } else n();
  });
}
function _H(t) {
  return Promise.all([T9(t, '::before'), T9(t, '::after')]);
}
function RH(t) {
  return (
    t.parentNode !== document.head &&
    !~DV.indexOf(t.tagName.toUpperCase()) &&
    !t.getAttribute(Da) &&
    (!t.parentNode || t.parentNode.tagName !== 'svg')
  );
}
function k9(t) {
  if (ie)
    return new Promise(function (e, r) {
      var n = o3(t.querySelectorAll('*')).filter(RH).map(_H),
        i = qa.begin('searchPseudoElements');
      uf(),
        Promise.all(n)
          .then(function () {
            i(), Ta(), e();
          })
          .catch(function () {
            i(), Ta(), r();
          });
    });
}
var PH = {
    hooks: function () {
      return {
        mutationObserverCallbacks: function (r) {
          return (r.pseudoElementsCallback = k9), r;
        },
      };
    },
    provides: function (e) {
      e.pseudoElements2svg = function (r) {
        var n = r.node,
          i = n === void 0 ? a2 : n;
        x.searchPseudoElements && k9(i);
      };
    },
  },
  _9 = !1,
  FH = {
    mixout: function () {
      return {
        dom: {
          unwatch: function () {
            uf(), (_9 = !0);
          },
        },
      };
    },
    hooks: function () {
      return {
        bootstrap: function () {
          N9(Sa('mutationObserverCallbacks', {}));
        },
        noAuto: function () {
          VH();
        },
        watch: function (r) {
          var n = r.observeMutationsRoot;
          _9
            ? Ta()
            : N9(Sa('mutationObserverCallbacks', { observeMutationsRoot: n }));
        },
      };
    },
  },
  R9 = function (e) {
    var r = { size: 16, x: 0, y: 0, flipX: !1, flipY: !1, rotate: 0 };
    return e
      .toLowerCase()
      .split(' ')
      .reduce(function (n, i) {
        var c = i.toLowerCase().split('-'),
          a = c[0],
          s = c.slice(1).join('-');
        if (a && s === 'h') return (n.flipX = !0), n;
        if (a && s === 'v') return (n.flipY = !0), n;
        if (((s = parseFloat(s)), isNaN(s))) return n;
        switch (a) {
          case 'grow':
            n.size = n.size + s;
            break;
          case 'shrink':
            n.size = n.size - s;
            break;
          case 'left':
            n.x = n.x - s;
            break;
          case 'right':
            n.x = n.x + s;
            break;
          case 'up':
            n.y = n.y - s;
            break;
          case 'down':
            n.y = n.y + s;
            break;
          case 'rotate':
            n.rotate = n.rotate + s;
            break;
        }
        return n;
      }, r);
  },
  OH = {
    mixout: function () {
      return {
        parse: {
          transform: function (r) {
            return R9(r);
          },
        },
      };
    },
    hooks: function () {
      return {
        parseNodeAttributes: function (r, n) {
          var i = n.getAttribute('data-fa-transform');
          return i && (r.transform = R9(i)), r;
        },
      };
    },
    provides: function (e) {
      e.generateAbstractTransformGrouping = function (r) {
        var n = r.main,
          i = r.transform,
          c = r.containerWidth,
          a = r.iconWidth,
          s = { transform: 'translate('.concat(c / 2, ' 256)') },
          o = 'translate('.concat(i.x * 32, ', ').concat(i.y * 32, ') '),
          l = 'scale('
            .concat((i.size / 16) * (i.flipX ? -1 : 1), ', ')
            .concat((i.size / 16) * (i.flipY ? -1 : 1), ') '),
          f = 'rotate('.concat(i.rotate, ' 0 0)'),
          u = { transform: ''.concat(o, ' ').concat(l, ' ').concat(f) },
          d = { transform: 'translate('.concat((a / 2) * -1, ' -256)') },
          h = { outer: s, inner: u, path: d };
        return {
          tag: 'g',
          attributes: y({}, h.outer),
          children: [
            {
              tag: 'g',
              attributes: y({}, h.inner),
              children: [
                {
                  tag: n.icon.tag,
                  children: n.icon.children,
                  attributes: y(y({}, n.icon.attributes), h.path),
                },
              ],
            },
          ],
        };
      };
    },
  },
  za = { x: 0, y: 0, width: '100%', height: '100%' };
function P9(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  return (
    t.attributes && (t.attributes.fill || e) && (t.attributes.fill = 'black'), t
  );
}
function BH(t) {
  return t.tag === 'g' ? t.children : [t];
}
var jH = {
    hooks: function () {
      return {
        parseNodeAttributes: function (r, n) {
          var i = n.getAttribute('data-fa-mask'),
            c = i
              ? m6(
                  i.split(' ').map(function (a) {
                    return a.trim();
                  })
                )
              : $a();
          return (
            c.prefix || (c.prefix = Te()),
            (r.mask = c),
            (r.maskId = n.getAttribute('data-fa-mask-id')),
            r
          );
        },
      };
    },
    provides: function (e) {
      e.generateAbstractMask = function (r) {
        var n = r.children,
          i = r.attributes,
          c = r.main,
          a = r.mask,
          s = r.maskId,
          o = r.transform,
          l = c.width,
          f = c.icon,
          u = a.width,
          d = a.icon,
          h = OV({ transform: o, containerWidth: u, iconWidth: l }),
          C = { tag: 'rect', attributes: y(y({}, za), {}, { fill: 'white' }) },
          N = f.children ? { children: f.children.map(P9) } : {},
          L = {
            tag: 'g',
            attributes: y({}, h.inner),
            children: [
              P9(
                y({ tag: f.tag, attributes: y(y({}, f.attributes), h.path) }, N)
              ),
            ],
          },
          b = { tag: 'g', attributes: y({}, h.outer), children: [L] },
          U = 'mask-'.concat(s || M4()),
          $ = 'clip-'.concat(s || M4()),
          B = {
            tag: 'mask',
            attributes: y(
              y({}, za),
              {},
              {
                id: U,
                maskUnits: 'userSpaceOnUse',
                maskContentUnits: 'userSpaceOnUse',
              }
            ),
            children: [C, b],
          },
          s2 = {
            tag: 'defs',
            children: [
              { tag: 'clipPath', attributes: { id: $ }, children: BH(d) },
              B,
            ],
          };
        return (
          n.push(s2, {
            tag: 'rect',
            attributes: y(
              {
                fill: 'currentColor',
                'clip-path': 'url(#'.concat($, ')'),
                mask: 'url(#'.concat(U, ')'),
              },
              za
            ),
          }),
          { children: n, attributes: i }
        );
      };
    },
  },
  UH = {
    provides: function (e) {
      var r = !1;
      Ae.matchMedia &&
        (r = Ae.matchMedia('(prefers-reduced-motion: reduce)').matches),
        (e.missingIconAbstract = function () {
          var n = [],
            i = { fill: 'currentColor' },
            c = { attributeType: 'XML', repeatCount: 'indefinite', dur: '2s' };
          n.push({
            tag: 'path',
            attributes: y(
              y({}, i),
              {},
              {
                d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z',
              }
            ),
          });
          var a = y(y({}, c), {}, { attributeName: 'opacity' }),
            s = {
              tag: 'circle',
              attributes: y(y({}, i), {}, { cx: '256', cy: '364', r: '28' }),
              children: [],
            };
          return (
            r ||
              s.children.push(
                {
                  tag: 'animate',
                  attributes: y(
                    y({}, c),
                    {},
                    { attributeName: 'r', values: '28;14;28;28;14;28;' }
                  ),
                },
                {
                  tag: 'animate',
                  attributes: y(y({}, a), {}, { values: '1;0;1;1;0;1;' }),
                }
              ),
            n.push(s),
            n.push({
              tag: 'path',
              attributes: y(
                y({}, i),
                {},
                {
                  opacity: '1',
                  d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z',
                }
              ),
              children: r
                ? []
                : [
                    {
                      tag: 'animate',
                      attributes: y(y({}, a), {}, { values: '1;0;0;0;0;1;' }),
                    },
                  ],
            }),
            r ||
              n.push({
                tag: 'path',
                attributes: y(
                  y({}, i),
                  {},
                  {
                    opacity: '0',
                    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z',
                  }
                ),
                children: [
                  {
                    tag: 'animate',
                    attributes: y(y({}, a), {}, { values: '0;0;1;1;0;0;' }),
                  },
                ],
              }),
            { tag: 'g', attributes: { class: 'missing' }, children: n }
          );
        });
    },
  },
  $H = {
    hooks: function () {
      return {
        parseNodeAttributes: function (r, n) {
          var i = n.getAttribute('data-fa-symbol'),
            c = i === null ? !1 : i === '' ? !0 : i;
          return (r.symbol = c), r;
        },
      };
    },
  },
  GH = [UV, NH, EH, IH, AH, PH, FH, OH, jH, UH, $H];
iH(GH, { mixoutsTo: t1 });
var aE = t1.noAuto,
  sE = t1.config,
  oE = t1.library,
  lE = t1.dom,
  hf = t1.parse,
  fE = t1.findIconDefinition,
  uE = t1.toHtml,
  pf = t1.icon,
  dE = t1.layer,
  qH = t1.text,
  WH = t1.counter;
var YH = ['*'],
  QH = (t) => {
    throw new Error(
      `Could not find icon with iconName=${t.iconName} and prefix=${t.prefix} in the icon library.`
    );
  },
  ZH = () => {
    throw new Error(
      'Property `icon` is required for `fa-icon`/`fa-duotone-icon` components.'
    );
  },
  XH = (t) => {
    let e = {
      [`fa-${t.animation}`]:
        t.animation != null && !t.animation.startsWith('spin'),
      'fa-spin': t.animation === 'spin' || t.animation === 'spin-reverse',
      'fa-spin-pulse':
        t.animation === 'spin-pulse' || t.animation === 'spin-pulse-reverse',
      'fa-spin-reverse':
        t.animation === 'spin-reverse' || t.animation === 'spin-pulse-reverse',
      'fa-pulse':
        t.animation === 'spin-pulse' || t.animation === 'spin-pulse-reverse',
      'fa-fw': t.fixedWidth,
      'fa-border': t.border,
      'fa-inverse': t.inverse,
      'fa-layers-counter': t.counter,
      'fa-flip-horizontal': t.flip === 'horizontal' || t.flip === 'both',
      'fa-flip-vertical': t.flip === 'vertical' || t.flip === 'both',
      [`fa-${t.size}`]: t.size !== null,
      [`fa-rotate-${t.rotate}`]: t.rotate !== null,
      [`fa-pull-${t.pull}`]: t.pull !== null,
      [`fa-stack-${t.stackItemSize}`]: t.stackItemSize != null,
    };
    return Object.keys(e)
      .map((r) => (e[r] ? r : null))
      .filter((r) => r);
  },
  KH = (t) => t.prefix !== void 0 && t.iconName !== void 0,
  JH = (t, e) =>
    KH(t)
      ? t
      : typeof t == 'string'
      ? { prefix: e, iconName: t }
      : { prefix: t[0], iconName: t[1] },
  ez = (() => {
    let e = class e {
      constructor() {
        (this.defaultPrefix = 'fas'), (this.fallbackIcon = null);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  tz = (() => {
    let e = class e {
      constructor() {
        this.definitions = {};
      }
      addIcons(...n) {
        for (let i of n) {
          i.prefix in this.definitions || (this.definitions[i.prefix] = {}),
            (this.definitions[i.prefix][i.iconName] = i);
          for (let c of i.icon[2])
            typeof c == 'string' && (this.definitions[i.prefix][c] = i);
        }
      }
      addIconPacks(...n) {
        for (let i of n) {
          let c = Object.keys(i).map((a) => i[a]);
          this.addIcons(...c);
        }
      }
      getIconDefinition(n, i) {
        return n in this.definitions && i in this.definitions[n]
          ? this.definitions[n][i]
          : null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = H({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  nz = (() => {
    let e = class e {
      constructor() {
        this.stackItemSize = '1x';
      }
      ngOnChanges(n) {
        if ('size' in n)
          throw new Error(
            'fa-icon is not allowed to customize size when used inside fa-stack. Set size on the enclosing fa-stack instead: <fa-stack size="4x">...</fa-stack>.'
          );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = v2({
        type: e,
        selectors: [
          ['fa-icon', 'stackItemSize', ''],
          ['fa-duotone-icon', 'stackItemSize', ''],
        ],
        inputs: { stackItemSize: 'stackItemSize', size: 'size' },
        standalone: !0,
        features: [X2],
      }));
    let t = e;
    return t;
  })(),
  rz = (() => {
    let e = class e {
      constructor(n, i) {
        (this.renderer = n), (this.elementRef = i);
      }
      ngOnInit() {
        this.renderer.addClass(this.elementRef.nativeElement, 'fa-stack');
      }
      ngOnChanges(n) {
        'size' in n &&
          (n.size.currentValue != null &&
            this.renderer.addClass(
              this.elementRef.nativeElement,
              `fa-${n.size.currentValue}`
            ),
          n.size.previousValue != null &&
            this.renderer.removeClass(
              this.elementRef.nativeElement,
              `fa-${n.size.previousValue}`
            ));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(S1), z($2));
    }),
      (e.ɵcmp = H2({
        type: e,
        selectors: [['fa-stack']],
        inputs: { size: 'size' },
        standalone: !0,
        features: [X2, T3],
        ngContentSelectors: YH,
        decls: 1,
        vars: 0,
        template: function (i, c) {
          i & 1 && (T5(), k5(0));
        },
        encapsulation: 2,
      }));
    let t = e;
    return t;
  })(),
  mf = (() => {
    let e = class e {
      set spin(n) {
        this.animation = n ? 'spin' : void 0;
      }
      set pulse(n) {
        this.animation = n ? 'spin-pulse' : void 0;
      }
      constructor(n, i, c, a, s) {
        (this.sanitizer = n),
          (this.config = i),
          (this.iconLibrary = c),
          (this.stackItem = a),
          (this.classes = []),
          s != null &&
            a == null &&
            console.error(
              'FontAwesome: fa-icon and fa-duotone-icon elements must specify stackItemSize attribute when wrapped into fa-stack. Example: <fa-icon stackItemSize="2x"></fa-icon>.'
            );
      }
      ngOnChanges(n) {
        if (this.icon == null && this.config.fallbackIcon == null) {
          ZH();
          return;
        }
        if (n) {
          let i = this.icon != null ? this.icon : this.config.fallbackIcon,
            c = this.findIconDefinition(i);
          if (c != null) {
            let a = this.buildParams();
            this.renderIcon(c, a);
          }
        }
      }
      render() {
        this.ngOnChanges({});
      }
      findIconDefinition(n) {
        let i = JH(n, this.config.defaultPrefix);
        if ('icon' in i) return i;
        let c = this.iconLibrary.getIconDefinition(i.prefix, i.iconName);
        return c ?? (QH(i), null);
      }
      buildParams() {
        let n = {
            flip: this.flip,
            animation: this.animation,
            border: this.border,
            inverse: this.inverse,
            size: this.size || null,
            pull: this.pull || null,
            rotate: this.rotate || null,
            fixedWidth:
              typeof this.fixedWidth == 'boolean'
                ? this.fixedWidth
                : this.config.fixedWidth,
            stackItemSize:
              this.stackItem != null ? this.stackItem.stackItemSize : null,
          },
          i =
            typeof this.transform == 'string'
              ? hf.transform(this.transform)
              : this.transform;
        return {
          title: this.title,
          transform: i,
          classes: [...XH(n), ...this.classes],
          mask: this.mask != null ? this.findIconDefinition(this.mask) : null,
          styles: this.styles != null ? this.styles : {},
          symbol: this.symbol,
          attributes: { role: this.a11yRole },
        };
      }
      renderIcon(n, i) {
        let c = pf(n, i);
        this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(
          c.html.join(`
`)
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(z(b0), z(ez), z(tz), z(nz, 8), z(rz, 8));
    }),
      (e.ɵcmp = H2({
        type: e,
        selectors: [['fa-icon']],
        hostAttrs: [1, 'ng-fa-icon'],
        hostVars: 2,
        hostBindings: function (i, c) {
          i & 2 &&
            (Fc('innerHTML', c.renderedIconHTML, j8), E3('title', c.title));
        },
        inputs: {
          icon: 'icon',
          title: 'title',
          animation: 'animation',
          spin: 'spin',
          pulse: 'pulse',
          mask: 'mask',
          styles: 'styles',
          flip: 'flip',
          size: 'size',
          pull: 'pull',
          border: 'border',
          inverse: 'inverse',
          symbol: 'symbol',
          rotate: 'rotate',
          fixedWidth: 'fixedWidth',
          classes: 'classes',
          transform: 'transform',
          a11yRole: 'a11yRole',
        },
        standalone: !0,
        features: [X2, T3],
        decls: 0,
        vars: 0,
        template: function (i, c) {},
        encapsulation: 2,
      }));
    let t = e;
    return t;
  })();
var gf = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = w2({ type: e })),
    (e.ɵinj = b2({}));
  let t = e;
  return t;
})();
function cz(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Task Title is required. '), p());
}
function az(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Alphabets only allowed '), p());
}
function sz(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 18), K(1, cz, 2, 0, 'div', 19)(2, az, 2, 0, 'div', 19), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A(
        'ngIf',
        r.taskTitle.errors == null ? null : r.taskTitle.errors.required
      ),
      E(),
      A(
        'ngIf',
        r.taskTitle.errors == null ? null : r.taskTitle.errors.isString
      );
  }
}
function oz(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Task Description is required. '), p());
}
function lz(t, e) {
  t & 1 && (m(0, 'div'), v(1, ' Alphabets only allowed '), p());
}
function fz(t, e) {
  if (
    (t & 1 &&
      (m(0, 'div', 18), K(1, oz, 2, 0, 'div', 19)(2, lz, 2, 0, 'div', 19), p()),
    t & 2)
  ) {
    let r = D2();
    E(),
      A(
        'ngIf',
        r.taskDescription.errors == null
          ? null
          : r.taskDescription.errors.required
      ),
      E(),
      A(
        'ngIf',
        r.taskDescription.errors == null
          ? null
          : r.taskDescription.errors.isString
      );
  }
}
var vf = (() => {
  let e = class e {
    constructor(n) {
      (this.builder = n),
        (this.edited = new o2()),
        (this.editForm = this.builder.group({
          taskTitle: ['', [M2.required, ee(/^[a-zA-Z\s]+$/)]],
          taskDescription: ['', [M2.required, ee(/^[a-zA-Z\s]+$/)]],
          taskDueDate: [null, M2.required],
          taskStatus: [null, M2.required],
        }));
    }
    ngOnChanges() {
      this.editForm.setValue({
        taskTitle: this.editTask$.title,
        taskDescription: this.editTask$.description,
        taskDueDate: this.editTask$.dueDate,
        taskStatus: this.editTask$.status,
      });
    }
    get taskTitle() {
      return this.editForm.get('taskTitle');
    }
    get taskDescription() {
      return this.editForm.get('taskDescription');
    }
    get taskDueDate() {
      return this.editForm.get('taskDueDate');
    }
    get taskStatus() {
      return this.editForm.get('taskStatus');
    }
    editTask() {
      (this.task = {
        _id: this.editTask$._id,
        title: this.taskTitle.value,
        description: this.taskDescription.value,
        dueDate: this.taskDueDate.value,
        status: this.taskStatus.value,
      }),
        this.edited.emit(this.task);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(z(Ne));
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-edit-task']],
      inputs: { editTask$: 'editTask$' },
      outputs: { edited: 'edited' },
      features: [X2],
      decls: 33,
      vars: 4,
      consts: [
        [1, 'container'],
        [
          1,
          'containter',
          'small-container',
          'bg-light',
          'border',
          'border-1',
          'my-3',
          'shadow',
          3,
          'formGroup',
        ],
        [1, 'row', 'my-2', 'px-2'],
        [1, 'col'],
        ['for', 'title', 1, 'form-label', 'mx-2'],
        [
          'type',
          'text',
          'name',
          'title',
          'placeholder',
          'Enter title',
          'formControlName',
          'taskTitle',
          1,
          'form-control',
        ],
        ['class', 'alert alert-danger text-danger', 4, 'ngIf'],
        ['for', 'desc', 1, 'form-label', 'mx-2'],
        [
          'type',
          'text',
          'name',
          'desc',
          'placeholder',
          'Enter Description',
          'formControlName',
          'taskDescription',
          1,
          'form-control',
        ],
        ['for', 'dueDate', 1, 'form-label', 'mx-2'],
        [
          'type',
          'date',
          'name',
          'dueDate',
          'placeholder',
          'Enter Due Date',
          'formControlName',
          'taskDueDate',
          1,
          'form-control',
        ],
        [
          'aria-label',
          'Default select example',
          'formControlName',
          'taskStatus',
          1,
          'form-select',
        ],
        ['selected', '', 'value', ''],
        ['value', 'Pending'],
        ['value', 'In Progress'],
        ['value', 'completed'],
        [1, 'd-block', 'mx-auto', 'text-center', 'my-2'],
        ['type', 'submit', 1, 'btn', 'btn-info', 3, 'click', 'disabled'],
        [1, 'alert', 'alert-danger', 'text-danger'],
        [4, 'ngIf'],
      ],
      template: function (i, c) {
        i & 1 &&
          (m(0, 'div', 0)(1, 'form', 1)(2, 'div', 2)(3, 'div', 3)(
            4,
            'label',
            4
          ),
          v(5, 'Title'),
          p(),
          Z(6, 'input', 5),
          p()(),
          K(7, sz, 3, 2, 'div', 6),
          m(8, 'div', 2)(9, 'div', 3)(10, 'label', 7),
          v(11, 'Description'),
          p(),
          Z(12, 'input', 8),
          p()(),
          K(13, fz, 3, 2, 'div', 6),
          m(14, 'div', 2)(15, 'div', 3)(16, 'label', 9),
          v(17, 'Due Date'),
          p(),
          Z(18, 'input', 10),
          p()(),
          m(19, 'div', 2)(20, 'div', 3)(21, 'select', 11)(22, 'option', 12),
          v(23, 'select Status'),
          p(),
          m(24, 'option', 13),
          v(25, 'Pending'),
          p(),
          m(26, 'option', 14),
          v(27, 'In Progress'),
          p(),
          m(28, 'option', 15),
          v(29, 'completed'),
          p()()()(),
          m(30, 'div', 16)(31, 'button', 17),
          h2('click', function () {
            return c.editTask();
          }),
          v(32, 'Save Changes'),
          p()()()()),
          i & 2 &&
            (E(),
            A('formGroup', c.editForm),
            E(6),
            A(
              'ngIf',
              c.taskTitle.invalid && (c.taskTitle.dirty || c.taskTitle.touched)
            ),
            E(6),
            A(
              'ngIf',
              c.taskDescription.invalid &&
                (c.taskDescription.dirty || c.taskDescription.touched)
            ),
            E(18),
            A('disabled', c.editForm.invalid));
      },
      dependencies: [E1, Se, Qr, Zr, T1, r3, xe, Le, K1, J1],
    }));
  let t = e;
  return t;
})();
var dz = ['closebtn'];
function hz(t, e) {
  if (t & 1) {
    let r = A3();
    m(0, 'tr')(1, 'td')(2, 'span'),
      v(3),
      p()(),
      m(4, 'td'),
      v(5),
      p(),
      m(6, 'td'),
      v(7),
      p(),
      m(8, 'td'),
      v(9),
      jc(10, 'date'),
      p(),
      m(11, 'td'),
      v(12),
      p(),
      m(13, 'td')(14, 'span', 20),
      h2('click', function () {
        let i = _t(r).$implicit,
          c = D2();
        return Rt(c.onEdit(i));
      }),
      Z(15, 'fa-icon', 21),
      p()(),
      m(16, 'td')(17, 'span', 22),
      h2('click', function () {
        let i = _t(r).$implicit,
          c = D2();
        return Rt(c.onDelete(i));
      }),
      Z(18, 'fa-icon', 21),
      p()()();
  }
  if (t & 2) {
    let r = e.$implicit,
      n = e.index,
      i = D2();
    E(3),
      G2(n + 1),
      E(2),
      G2(r.title),
      E(2),
      G2(r.description),
      E(2),
      G2(B5(10, 7, r.dueDate, 'shortDate')),
      E(3),
      G2(r.status),
      E(3),
      A('icon', i.faEdit),
      E(3),
      A('icon', i.faTrash);
  }
}
function pz(t, e) {
  if ((t & 1 && (m(0, 'li', 18)(1, 'a', 16), v(2), p()()), t & 2)) {
    let r = e.$implicit;
    E(2), G2(r);
  }
}
var Ya = (() => {
  let e = class e {
    constructor(n) {
      (this.ts = n),
        (this.faEdit = u9),
        (this.faTrash = d9),
        (this.page = 1),
        (this.perPage = 2),
        (this.pagestring = '');
    }
    ngOnInit() {
      this.subscription = this.ts.getTasks().subscribe(
        (n) => {
          let i = Math.round(n.length / this.perPage);
          (this.noOfPages = Array.from({ length: i }, (c, a) => a + 1)),
            (this.tasks$ = S(n)),
            (this.ts.tasks$ = S(n));
        },
        (n) => {
          console.error('Request failed with ' + n);
        }
      );
    }
    onDelete(n) {
      (this.subscription = this.ts.deleteTask(n).subscribe()),
        window.location.reload();
    }
    onEdit(n) {
      this.editTask$ = n;
    }
    onEdited(n) {
      this.ts.editTask(n).subscribe(() => {
        window.location.reload();
      }),
        this.closebtn.nativeElement.click();
    }
    changePage() {}
    ngOnDestory() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(z(Ee));
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-task-list']],
      viewQuery: function (i, c) {
        if ((i & 1 && _5(dz, 5), i & 2)) {
          let a;
          Oc((a = Bc())) && (c.closebtn = a.first);
        }
      },
      decls: 43,
      vars: 5,
      consts: [
        ['closebtn', ''],
        [1, 'container'],
        [1, 'text-center'],
        [1, 'table', 'table-info', 'table-hover'],
        [4, 'ngFor', 'ngForOf'],
        [
          'id',
          'exampleModal',
          'tabindex',
          '-1',
          'aria-labelledby',
          'exampleModalLabel',
          'aria-hidden',
          'true',
          1,
          'modal',
          'fade',
        ],
        [1, 'modal-dialog'],
        [1, 'modal-content'],
        [1, 'modal-header'],
        ['id', 'exampleModalLabel', 1, 'modal-title', 'fs-5'],
        [
          'type',
          'button',
          'data-bs-dismiss',
          'modal',
          'aria-label',
          'Close',
          1,
          'btn-close',
        ],
        [1, 'modal-body'],
        [3, 'edited', 'editTask$'],
        ['aria-label', 'Page navigation example'],
        [1, 'pagination', 'justify-content-center'],
        [1, 'page-item', 'disabled'],
        [1, 'page-link'],
        ['class', 'page-item', 4, 'ngFor', 'ngForOf'],
        [1, 'page-item'],
        ['href', '#', 1, 'page-link'],
        [
          'data-bs-toggle',
          'modal',
          'data-bs-target',
          '#exampleModal',
          2,
          'cursor',
          'pointer',
          3,
          'click',
        ],
        [3, 'icon'],
        [2, 'cursor', 'pointer', 3, 'click'],
      ],
      template: function (i, c) {
        if (i & 1) {
          let a = A3();
          m(0, 'div', 1)(1, 'h3', 2),
            v(2, 'Task List'),
            p(),
            m(3, 'table', 3)(4, 'thead')(5, 'tr')(6, 'th'),
            v(7, '#'),
            p(),
            m(8, 'th'),
            v(9, 'Title'),
            p(),
            m(10, 'th'),
            v(11, 'Description'),
            p(),
            m(12, 'th'),
            v(13, 'Due Date'),
            p(),
            m(14, 'th'),
            v(15, 'Status'),
            p(),
            m(16, 'th'),
            v(17, 'Edit'),
            p(),
            m(18, 'th'),
            v(19, 'Delete'),
            p()()(),
            m(20, 'tbody'),
            K(21, hz, 19, 10, 'tr', 4),
            jc(22, 'async'),
            p()(),
            m(23, 'div', 5)(24, 'div', 6)(25, 'div', 7)(26, 'div', 8)(
              27,
              'h1',
              9
            ),
            v(28, 'Edit Task'),
            p(),
            Z(29, 'button', 10, 0),
            p(),
            m(31, 'div', 11)(32, 'app-edit-task', 12),
            h2('edited', function (o) {
              return _t(a), Rt(c.onEdited(o));
            }),
            p()()()()(),
            Z(33, 'hr'),
            m(34, 'nav', 13)(35, 'ul', 14)(36, 'li', 15)(37, 'a', 16),
            v(38, 'Previous'),
            p()(),
            K(39, pz, 3, 1, 'li', 17),
            m(40, 'li', 18)(41, 'a', 19),
            v(42, 'Next'),
            p()()()()();
        }
        i & 2 &&
          (E(21),
          A('ngForOf', O5(22, 3, c.tasks$)),
          E(11),
          A('editTask$', c.editTask$),
          E(7),
          A('ngForOf', c.noOfPages));
      },
      dependencies: [d7, mf, vf, p7, m7],
    }));
  let t = e;
  return t;
})();
var mz = [
    { path: 'taskList', component: Ya },
    { path: 'login', component: a9 },
    { path: 'signup', component: l9 },
    { path: 'newTask', component: f9 },
    { path: 'taskList', component: Ya },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', component: s9 },
  ],
  Cf = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = w2({ type: e })),
      (e.ɵinj = b2({ imports: [ua.forRoot(mz), ua] }));
    let t = e;
    return t;
  })();
function gz(t, e) {
  if (t & 1) {
    let r = A3();
    m(0, 'div', 9)(1, 'div', 5)(2, 'button', 10)(3, 'a'),
      v(4),
      p()()(),
      m(5, 'div', 5)(6, 'button', 11),
      h2('click', function () {
        _t(r);
        let i = D2();
        return Rt(i.logout());
      }),
      v(7, 'Logout'),
      p()()();
  }
  if (t & 2) {
    let r = D2();
    E(4), G2(r.userInfo$.userInfo.userName);
  }
}
var Mf = (() => {
  let e = class e {
    constructor(n) {
      this.router = n;
    }
    ngOnInit() {
      (this.userInfo$ = JSON.parse(localStorage.getItem('userInfo'))),
        console.log(this.userInfo$.userInfo);
    }
    logout() {
      localStorage.removeItem('userInfo'), this.router.navigate(['/login']);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(z(F2));
  }),
    (e.ɵcmp = H2({
      type: e,
      selectors: [['app-root']],
      decls: 13,
      vars: 1,
      consts: [
        [1, 'container'],
        ['id', 'header'],
        [1, 'd-flex', 'justify-content-between', 'mx-2'],
        [1, 'nav-band'],
        [1, 'd-flex', 'justify-content-between'],
        [1, 'mx-2'],
        ['type', 'button', 1, 'btn', 'btn-light'],
        ['href', 'newTask'],
        ['class', 'd-flex', 4, 'ngIf'],
        [1, 'd-flex'],
        ['type', 'button', 1, 'btn', 'btn-light', 2, 'cursor', 'none'],
        ['type', 'button', 1, 'btn', 'btn-light', 3, 'click'],
      ],
      template: function (i, c) {
        i & 1 &&
          (m(0, 'div', 0)(1, 'header', 1)(2, 'nav')(3, 'div', 2)(4, 'div', 3),
          v(5, ' Task Master '),
          p(),
          m(6, 'div', 4)(7, 'div', 5)(8, 'button', 6)(9, 'a', 7),
          v(10, 'New Task'),
          p()()(),
          K(11, gz, 8, 1, 'div', 8),
          p()()()()(),
          Z(12, 'router-outlet')),
          i & 2 && (E(11), A('ngIf', c.userInfo$));
      },
      dependencies: [E1, ia],
    }));
  let t = e;
  return t;
})();
var yf = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = w2({ type: e, bootstrap: [Mf] })),
    (e.ɵinj = b2({ imports: [R7, c9, L7, gf, Cf] }));
  let t = e;
  return t;
})();
var Vf = { production: !1 };
Vf.production && void 0;
_7()
  .bootstrapModule(yf)
  .catch((t) => console.error(t));
