var fe = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var w = (t, e, r) => (fe(t, e, "read from private field"), r ? r.call(t) : e.get(t)), C = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, x = (t, e, r, o) => (fe(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r);
import { UMB_AUTH_CONTEXT as Ge } from "@umbraco-cms/backoffice/auth";
import { tryExecuteAndNotify as O } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as _e } from "@umbraco-cms/backoffice/class-api";
import { UMB_BLOCK_GRID_ENTRY_CONTEXT as Ke, UMB_BLOCK_GRID_MANAGER_CONTEXT as He } from "@umbraco-cms/backoffice/block-grid";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as me } from "@umbraco-cms/backoffice/document";
import { LitElement as Fe, html as m, ifDefined as I, unsafeHTML as G, css as K, state as h, property as L, customElement as H } from "@umbraco-cms/backoffice/external/lit";
import { observeMultiple as y, UmbObjectState as Xe } from "@umbraco-cms/backoffice/observable-api";
import { UMB_PROPERTY_DATASET_CONTEXT as F, UMB_PROPERTY_CONTEXT as ke } from "@umbraco-cms/backoffice/property";
import { UmbContextToken as Je } from "@umbraco-cms/backoffice/context-api";
import { UmbElementMixin as ze } from "@umbraco-cms/backoffice/element-api";
import { UMB_BLOCK_LIST_ENTRY_CONTEXT as Ye } from "@umbraco-cms/backoffice/block-list";
import { UmbLitElement as ve } from "@umbraco-cms/backoffice/lit-element";
import { UMB_BLOCK_RTE_ENTRY_CONTEXT as Qe } from "@umbraco-cms/backoffice/block-rte";
class be extends Error {
  constructor(e, r, o) {
    super(o), this.name = "ApiError", this.url = r.url, this.status = r.status, this.statusText = r.statusText, this.body = r.body, this.request = e;
  }
}
class Ze extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class et {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((r, o) => {
      this._resolve = r, this._reject = o;
      const i = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(a));
      }, s = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isRejected = !0, this._reject && this._reject(a));
      }, n = (a) => {
        this._isResolved || this._isRejected || this._isCancelled || this.cancelHandlers.push(a);
      };
      return Object.defineProperty(n, "isResolved", {
        get: () => this._isResolved
      }), Object.defineProperty(n, "isRejected", {
        get: () => this._isRejected
      }), Object.defineProperty(n, "isCancelled", {
        get: () => this._isCancelled
      }), e(i, s, n);
    });
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(e, r) {
    return this.promise.then(e, r);
  }
  catch(e) {
    return this.promise.catch(e);
  }
  finally(e) {
    return this.promise.finally(e);
  }
  cancel() {
    if (!(this._isResolved || this._isRejected || this._isCancelled)) {
      if (this._isCancelled = !0, this.cancelHandlers.length)
        try {
          for (const e of this.cancelHandlers)
            e();
        } catch (e) {
          console.warn("Cancellation threw an error", e);
          return;
        }
      this.cancelHandlers.length = 0, this._reject && this._reject(new Ze("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class ye {
  constructor() {
    this._fns = [];
  }
  eject(e) {
    const r = this._fns.indexOf(e);
    r !== -1 && (this._fns = [...this._fns.slice(0, r), ...this._fns.slice(r + 1)]);
  }
  use(e) {
    this._fns = [...this._fns, e];
  }
}
const f = {
  BASE: "",
  CREDENTIALS: "include",
  ENCODE_PATH: void 0,
  HEADERS: void 0,
  PASSWORD: void 0,
  TOKEN: void 0,
  USERNAME: void 0,
  VERSION: "Latest",
  WITH_CREDENTIALS: !1,
  interceptors: {
    request: new ye(),
    response: new ye()
  }
}, P = (t) => typeof t == "string", N = (t) => P(t) && t !== "", X = (t) => t instanceof Blob, we = (t) => t instanceof FormData, tt = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, rt = (t) => {
  const e = [], r = (i, s) => {
    e.push(`${encodeURIComponent(i)}=${encodeURIComponent(String(s))}`);
  }, o = (i, s) => {
    s != null && (s instanceof Date ? r(i, s.toISOString()) : Array.isArray(s) ? s.forEach((n) => o(i, n)) : typeof s == "object" ? Object.entries(s).forEach(([n, a]) => o(`${i}[${n}]`, a)) : r(i, s));
  };
  return Object.entries(t).forEach(([i, s]) => o(i, s)), e.length ? `?${e.join("&")}` : "";
}, ot = (t, e) => {
  const r = t.ENCODE_PATH || encodeURI, o = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (s, n) => {
    var a;
    return (a = e.path) != null && a.hasOwnProperty(n) ? r(String(e.path[n])) : s;
  }), i = t.BASE + o;
  return e.query ? i + rt(e.query) : i;
}, it = (t) => {
  if (t.formData) {
    const e = new FormData(), r = (o, i) => {
      P(i) || X(i) ? e.append(o, i) : e.append(o, JSON.stringify(i));
    };
    return Object.entries(t.formData).filter(([, o]) => o != null).forEach(([o, i]) => {
      Array.isArray(i) ? i.forEach((s) => r(o, s)) : r(o, i);
    }), e;
  }
}, D = async (t, e) => typeof e == "function" ? e(t) : e, st = async (t, e) => {
  const [r, o, i, s] = await Promise.all([
    // @ts-ignore
    D(e, t.TOKEN),
    // @ts-ignore
    D(e, t.USERNAME),
    // @ts-ignore
    D(e, t.PASSWORD),
    // @ts-ignore
    D(e, t.HEADERS)
  ]), n = Object.entries({
    Accept: "application/json",
    ...s,
    ...e.headers
  }).filter(([, a]) => a != null).reduce((a, [c, l]) => ({
    ...a,
    [c]: String(l)
  }), {});
  if (N(r) && (n.Authorization = `Bearer ${r}`), N(o) && N(i)) {
    const a = tt(`${o}:${i}`);
    n.Authorization = `Basic ${a}`;
  }
  return e.body !== void 0 && (e.mediaType ? n["Content-Type"] = e.mediaType : X(e.body) ? n["Content-Type"] = e.body.type || "application/octet-stream" : P(e.body) ? n["Content-Type"] = "text/plain" : we(e.body) || (n["Content-Type"] = "application/json")), new Headers(n);
}, nt = (t) => {
  var e, r;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (r = t.mediaType) != null && r.includes("+json") ? JSON.stringify(t.body) : P(t.body) || X(t.body) || we(t.body) ? t.body : JSON.stringify(t.body);
}, at = async (t, e, r, o, i, s, n) => {
  const a = new AbortController();
  let c = {
    headers: s,
    body: o ?? i,
    method: e.method,
    signal: a.signal
  };
  t.WITH_CREDENTIALS && (c.credentials = t.CREDENTIALS);
  for (const l of t.interceptors.request._fns)
    c = await l(c);
  return n(() => a.abort()), await fetch(r, c);
}, ct = (t, e) => {
  if (e) {
    const r = t.headers.get(e);
    if (P(r))
      return r;
  }
}, lt = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e) {
        const r = ["application/octet-stream", "application/pdf", "application/zip", "audio/", "image/", "video/"];
        if (e.includes("application/json") || e.includes("+json"))
          return await t.json();
        if (r.some((o) => e.includes(o)))
          return await t.blob();
        if (e.includes("multipart/form-data"))
          return await t.formData();
        if (e.includes("text/"))
          return await t.text();
      }
    } catch (e) {
      console.error(e);
    }
}, ut = (t, e) => {
  const o = {
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "Im a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Content",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    ...t.errors
  }[e.status];
  if (o)
    throw new be(t, e, o);
  if (!e.ok) {
    const i = e.status ?? "unknown", s = e.statusText ?? "unknown", n = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new be(
      t,
      e,
      `Generic Error: status: ${i}; status text: ${s}; body: ${n}`
    );
  }
}, B = (t, e) => new et(async (r, o, i) => {
  try {
    const s = ot(t, e), n = it(e), a = nt(e), c = await st(t, e);
    if (!i.isCancelled) {
      let l = await at(t, e, s, a, n, c, i);
      for (const Ie of t.interceptors.response._fns)
        l = await Ie(l);
      const de = await lt(l), We = ct(l, e.responseHeader);
      let he = de;
      e.responseTransformer && l.ok && (he = await e.responseTransformer(de));
      const pe = {
        url: s,
        ok: l.ok,
        status: l.status,
        statusText: l.statusText,
        body: We ?? he
      };
      ut(e, pe), r(pe.body);
    }
  } catch (s) {
    o(s);
  }
});
class q {
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.contentUdi
   * @param data.settingsUdi
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewGridBlock(e = {}) {
    return B(f, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/grid",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique,
        contentUdi: e.contentUdi,
        settingsUdi: e.settingsUdi
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewListBlock(e = {}) {
    return B(f, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/list",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
  /**
   * @param data The data for the request.
   * @param data.nodeKey
   * @param data.blockEditorAlias
   * @param data.contentElementAlias
   * @param data.culture
   * @param data.documentTypeUnique
   * @param data.requestBody
   * @returns string OK
   * @throws ApiError
   */
  static previewRichTextMarkup(e = {}) {
    return B(f, {
      method: "POST",
      url: "/umbraco/management/api/v1/block-preview/preview/rte",
      query: {
        nodeKey: e.nodeKey,
        blockEditorAlias: e.blockEditorAlias,
        contentElementAlias: e.contentElementAlias,
        culture: e.culture,
        documentTypeUnique: e.documentTypeUnique
      },
      body: e.requestBody,
      mediaType: "application/json",
      errors: {
        401: "The resource is protected and requires an authentication token",
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
  /**
   * @returns unknown OK
   * @throws ApiError
   */
  static getSettings() {
    return B(f, {
      method: "GET",
      url: "/umbraco/management/api/v1/block-preview/settings",
      errors: {
        403: "The authenticated user do not have access to this resource"
      }
    });
  }
}
var A;
class dt {
  constructor(e) {
    C(this, A, void 0);
    x(this, A, e);
  }
  async getSettings() {
    return await O(w(this, A), q.getSettings());
  }
}
A = new WeakMap();
var S;
class ge extends _e {
  constructor(r) {
    super(r);
    C(this, S, void 0);
    x(this, S, new dt(r));
  }
  async getSettings() {
    const r = await w(this, S).getSettings();
    if (r && (r != null && r.data))
      return r.data;
  }
}
S = new WeakMap();
const Ee = new Je("BlockPreviewContext");
var ht = Object.defineProperty, pt = Object.getOwnPropertyDescriptor, E = (t, e, r, o) => {
  for (var i = o > 1 ? void 0 : o ? pt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (i = (o ? n(e, r, i) : n(i)) || i);
  return o && i && ht(e, r, i), i;
}, ft = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, p = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, b = (t, e, r) => (ft(t, e, "access private method"), r), M, Te, J, Ce, z, xe, Y, Ae, Q, Se, Z, Re, ee, Pe, te, De;
const bt = "block-grid-preview";
let u = class extends ze(Fe) {
  constructor() {
    super(), p(this, M), p(this, J), p(this, z), p(this, Y), p(this, Q), p(this, Z), p(this, ee), p(this, te), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      contentUdi: "",
      settingsUdi: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: "",
      contentElementTypeKey: ""
    }, this._blockGridValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, b(this, M, Te).call(this);
  }
  set blockGridValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockGridValue = e;
  }
  get blockGridValue() {
    return this._blockGridValue;
  }
  render() {
    return this._isLoading ? m`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? m`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? m`
                ${this._styleElement}
                <a 
                    href=${I(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${G(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
M = /* @__PURE__ */ new WeakSet();
Te = function() {
  b(this, J, Ce).call(this), b(this, z, xe).call(this), b(this, Y, Ae).call(this);
};
J = /* @__PURE__ */ new WeakSet();
Ce = function() {
  this.consumeContext(Ee, (t) => {
    this.observe(t.settings, (e) => {
      var r;
      (r = e == null ? void 0 : e.blockGrid) != null && r.stylesheet && (this._styleElement = document.createElement("link"), this._styleElement.rel = "stylesheet", this._styleElement.href = e.blockGrid.stylesheet);
    });
  });
};
z = /* @__PURE__ */ new WeakSet();
xe = function() {
  this.consumeContext(F, (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
Y = /* @__PURE__ */ new WeakSet();
Ae = function() {
  this.consumeContext(me, (t) => {
    this.observe(
      y([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", this._blockContext.documentTypeUnique = r ?? "", await b(this, Q, Se).call(this);
      }
    );
  });
};
Q = /* @__PURE__ */ new WeakSet();
Se = async function() {
  this.consumeContext(Ke, async (t) => {
    this.observe(
      y([
        t.contentKey,
        t.settingsKey,
        t.workspaceEditContentPath,
        t.contentElementTypeAlias,
        t.contentElementTypeKey
      ]),
      async ([
        e,
        r,
        o,
        i,
        s
      ]) => {
        this._blockContext.contentUdi = e ?? "", this._blockContext.settingsUdi = r ?? "", this._blockContext.workspaceEditContentPath = o ?? "", this._blockContext.contentElementTypeAlias = i ?? "", this._blockContext.contentElementTypeKey = s ?? "", await b(this, Z, Re).call(this);
      }
    );
  });
};
Z = /* @__PURE__ */ new WeakSet();
Re = async function() {
  this.consumeContext(He, (t) => {
    this.observe(
      y([
        t.contents,
        t.settings,
        t.layouts,
        t.exposes,
        t.propertyAlias
      ]),
      async ([e, r, o, i, s]) => {
        this._blockContext.blockEditorAlias = s ?? "", this.blockGridValue = {
          contentData: (e == null ? void 0 : e.filter((n) => n.key == this._blockContext.contentUdi)) ?? [],
          settingsData: (r == null ? void 0 : r.filter((n) => n.key == this._blockContext.settingsUdi)) ?? [],
          expose: (i == null ? void 0 : i.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? [],
          layout: {
            "Umbraco.BlockGrid": (o == null ? void 0 : o.filter((n) => n.contentKey == this._blockContext.contentUdi)) ?? []
          }
        }, await b(this, ee, Pe).call(this);
      }
    );
  });
};
ee = /* @__PURE__ */ new WeakSet();
Pe = async function() {
  console.log(this.content);
  const t = this._blockContext;
  if (!b(this, te, De).call(this, t)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const r = {
      blockEditorAlias: t.blockEditorAlias,
      nodeKey: t.unique,
      contentElementAlias: t.contentElementTypeAlias,
      documentTypeUnique: t.documentTypeUnique,
      contentUdi: t.contentUdi,
      settingsUdi: t.settingsUdi,
      culture: t.culture,
      requestBody: JSON.stringify(this.blockGridValue)
    }, { data: o } = await O(this, q.previewGridBlock(r));
    this._htmlMarkup = o ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
te = /* @__PURE__ */ new WeakSet();
De = function(t) {
  return t.unique != "" && t.documentTypeUnique != "" && t.blockEditorAlias != "" && t.contentUdi != "" && t.contentElementTypeAlias != "";
};
u.styles = [
  K`
            a {
              display: block;
              color: inherit;
              text-decoration: inherit;
              border: 1px solid transparent;
              border-radius: 2px;
            }

            a:hover {
                border-color: var(--uui-color-interactive-emphasis, #3544b1);
            }

            .preview-alert {
                background-color: var(--uui-color-danger, #f0ac00);
                border: 1px solid transparent;
                border-radius: 0;
                margin-bottom: 20px;
                padding: 8px 35px 8px 14px;
                position: relative;

                &, a, h4 {
                    color: #fff;
                }

                pre {
                    white-space: normal;
                }

                uui-loader {
                    margin-right: 16px;
                }
            }

            .preview-alert-warning {
                background-color: var(--uui-color-warning, #f0ac00);
                border-color: transparent;
                color: #000;
            }

            .preview-alert-info {
                background-color: var(--uui-color-default, #3544b1);
                border-color: transparent;
                color: #fff;
            }

            .preview-alert-danger, .preview-alert-error {
                background-color: var(--uui-color-danger, #f0ac00);
                border-color: transparent;
                color: #fff;
            }
        `
];
E([
  h()
], u.prototype, "_htmlMarkup", 2);
E([
  h()
], u.prototype, "_isLoading", 2);
E([
  h()
], u.prototype, "_error", 2);
E([
  L({ attribute: !1 })
], u.prototype, "content", 2);
E([
  L({ attribute: !1 })
], u.prototype, "blockGridValue", 1);
u = E([
  H(bt)
], u);
var yt = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, T = (t, e, r, o) => {
  for (var i = o > 1 ? void 0 : o ? _t(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (i = (o ? n(e, r, i) : n(i)) || i);
  return o && i && yt(e, r, i), i;
}, mt = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, _ = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, k = (t, e, r) => (mt(t, e, "access private method"), r), U, Be, re, Oe, oe, Le, ie, qe, se, $e, ne, Ne, ae, Ve;
const kt = "block-list-preview";
let d = class extends ve {
  constructor() {
    super(), _(this, U), _(this, re), _(this, oe), _(this, ie), _(this, se), _(this, ne), _(this, ae), this._htmlMarkup = "", this._isLoading = !1, this._error = null, this._blockContext = {
      unique: "",
      documentTypeUnique: "",
      blockEditorAlias: "",
      culture: "",
      workspaceEditContentPath: "",
      contentElementTypeAlias: ""
    }, this._blockListValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, k(this, U, Be).call(this);
  }
  set blockListValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockListValue = e;
  }
  get blockListValue() {
    return this._blockListValue;
  }
  render() {
    return this._isLoading ? m`<div class="preview-alert preview-alert-info"><uui-loader style="color: #fff"></uui-loader> Loading preview...</div>` : this._error ? m`
                <div class="preview-alert preview-alert-error" role="alert">
                    ${this._error}
                </div>
            ` : this._htmlMarkup ? m`
                <a 
                    href=${I(this._blockContext.workspaceEditContentPath)} 
                    aria-label="Edit block"
                    role="button"
                >
                    ${G(this._htmlMarkup)}
                </a>
            ` : null;
  }
};
U = /* @__PURE__ */ new WeakSet();
Be = function() {
  k(this, re, Oe).call(this), k(this, oe, Le).call(this);
};
re = /* @__PURE__ */ new WeakSet();
Oe = function() {
  this.consumeContext(F, async (t) => {
    this._blockContext.culture = t.getVariantId().culture ?? "";
  });
};
oe = /* @__PURE__ */ new WeakSet();
Le = function() {
  this.consumeContext(me, (t) => {
    this.observe(
      y([t.unique, t.contentTypeUnique]),
      async ([e, r]) => {
        this._blockContext.unique = (e == null ? void 0 : e.toString()) ?? "", this._blockContext.documentTypeUnique = r ?? "", k(this, ie, qe).call(this);
      }
    );
  });
};
ie = /* @__PURE__ */ new WeakSet();
qe = function() {
  this.consumeContext(ke, (t) => {
    this.observe(
      y([t.alias, t.value]),
      async ([e, r]) => {
        this._blockContext.blockEditorAlias = e ?? "", this.blockListValue = {
          ...this.blockListValue,
          contentData: r.contentData ?? [],
          settingsData: r.settingsData ?? [],
          expose: r.expose ?? [],
          layout: r.layout ?? {}
        }, k(this, se, $e).call(this);
      }
    );
  });
};
se = /* @__PURE__ */ new WeakSet();
$e = function() {
  this.consumeContext(Ye, (t) => {
    this.observe(
      y([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this._blockContext.contentElementTypeAlias = r ?? "", this._blockContext.workspaceEditContentPath = e ?? "", await k(this, ne, Ne).call(this);
      }
    );
  });
};
ne = /* @__PURE__ */ new WeakSet();
Ne = async function() {
  const t = this._blockContext;
  if (!k(this, ae, Ve).call(this, t)) {
    this._error = "Insufficient data for block preview", this._isLoading = !1;
    return;
  }
  this._isLoading = !0, this._error = null;
  try {
    const r = {
      blockEditorAlias: t.blockEditorAlias,
      nodeKey: t.unique,
      contentElementAlias: t.contentElementTypeAlias,
      documentTypeUnique: t.documentTypeUnique,
      culture: t.culture,
      requestBody: JSON.stringify(this._blockListValue)
    }, { data: o } = await O(this, q.previewListBlock(r));
    this._htmlMarkup = o ?? "", this._isLoading = !1;
  } catch (r) {
    this._error = "Failed to render block preview", this._isLoading = !1, console.error("Block preview error:", r);
  }
};
ae = /* @__PURE__ */ new WeakSet();
Ve = function(t) {
  return !!(t.unique && t.documentTypeUnique && t.blockEditorAlias && t.contentElementTypeAlias);
};
d.styles = [
  K`
        a {
          display: block;
          color: inherit;
          text-decoration: inherit;
          border: 1px solid transparent;
          border-radius: 2px;
        }

        a:hover {
            border-color: var(--uui-color-interactive-emphasis, #3544b1);
        }

        .preview-alert {
            background-color: var(--uui-color-danger, #f0ac00);
            border: 1px solid transparent;
            border-radius: 0;
            margin-bottom: 20px;
            padding: 8px 35px 8px 14px;
            position: relative;

            &, a, h4 {
                color: #fff;
            }

            pre {
                white-space: normal;
            }

            uui-loader {
                margin-right: 16px;
            }
        }

        .preview-alert-warning {
            background-color: var(--uui-color-warning, #f0ac00);
            border-color: transparent;
            color: #000;
        }

        .preview-alert-info {
            background-color: var(--uui-color-default, #3544b1);
            border-color: transparent;
            color: #fff;
        }

        .preview-alert-danger, .preview-alert-error {
            background-color: var(--uui-color-danger, #f0ac00);
            border-color: transparent;
            color: #fff;
        }
    `
];
T([
  h()
], d.prototype, "_htmlMarkup", 2);
T([
  h()
], d.prototype, "_isLoading", 2);
T([
  h()
], d.prototype, "_error", 2);
T([
  h()
], d.prototype, "_blockListValue", 2);
T([
  L({ attribute: !1 })
], d.prototype, "blockListValue", 1);
d = T([
  H(kt)
], d);
var vt = Object.defineProperty, wt = Object.getOwnPropertyDescriptor, $ = (t, e, r, o) => {
  for (var i = o > 1 ? void 0 : o ? wt(e, r) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (i = (o ? n(e, r, i) : n(i)) || i);
  return o && i && vt(e, r, i), i;
}, gt = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
}, V = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, ce = (t, e, r) => (gt(t, e, "access private method"), r), j, Me, le, Ue, ue, je;
const Et = "rich-text-preview";
let v = class extends ve {
  constructor() {
    var t;
    super(), V(this, j), V(this, le), V(this, ue), this.htmlMarkup = "", this.unique = "", this.documentTypeUnique = "", this.blockEditorAlias = "", this.culture = "", this._blockRteValue = {
      layout: {},
      expose: [],
      contentData: [],
      settingsData: []
    }, this.consumeContext(F, async (e) => {
      this.culture = e.getVariantId().culture ?? "";
    }), this.unique = (t = window.location.pathname.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)) == null ? void 0 : t[0], ce(this, j, Me).call(this);
  }
  set blockRteValue(t) {
    const e = t ? { ...t } : {};
    e.layout ?? (e.layout = {}), e.contentData ?? (e.contentData = []), e.settingsData ?? (e.settingsData = []), e.expose ?? (e.expose = []), this._blockRteValue = e;
  }
  get blockRteValue() {
    return this._blockRteValue;
  }
  render() {
    if (this.htmlMarkup !== "")
      return m`
                <a href=${I(this.workspaceEditContentPath)}>
                    ${G(this.htmlMarkup)}
                </a>`;
  }
};
j = /* @__PURE__ */ new WeakSet();
Me = function() {
  this.consumeContext(ke, (t) => {
    this.observe(
      y([t.alias, t.value]),
      async ([e, r]) => {
        this.blockEditorAlias = e, r != null && r.hasOwnProperty("blocks") && (r.blocks.length !== 0 && (this.blockRteValue = {
          ...this.blockRteValue,
          contentData: r.blocks.contentData,
          settingsData: r.blocks.settingsData,
          expose: r.blocks.expose,
          layout: r.blocks.layout
        }), ce(this, le, Ue).call(this));
      }
    );
  });
};
le = /* @__PURE__ */ new WeakSet();
Ue = function() {
  this.consumeContext(Qe, (t) => {
    this.observe(
      y([t.workspaceEditContentPath, t.contentElementTypeAlias]),
      async ([e, r]) => {
        this.contentElementTypeAlias = r, this.workspaceEditContentPath = e, await ce(this, ue, je).call(this);
      }
    );
  });
};
ue = /* @__PURE__ */ new WeakSet();
je = async function() {
  if (!this.unique || !this.blockEditorAlias || !this.contentElementTypeAlias || !this.blockRteValue.contentData || !this.blockRteValue.layout)
    return;
  const t = {
    blockEditorAlias: this.blockEditorAlias,
    nodeKey: this.unique,
    contentElementAlias: this.contentElementTypeAlias,
    culture: this.culture,
    requestBody: JSON.stringify(this.blockRteValue)
  }, { data: e } = await O(this, q.previewRichTextMarkup(t));
  e && (this.htmlMarkup = e);
};
v.styles = [
  K`
            a {
              display: block;
              color: inherit;
              text-decoration: inherit;
              border: 1px solid transparent;
              border-radius: 2px;
            }

            a:hover {
                border-color: var(--uui-color-interactive-emphasis, #3544b1);
            }

            .preview-alert {
                background-color: var(--uui-color-danger, #f0ac00);
                border: 1px solid transparent;
                border-radius: 0;
                margin-bottom: 20px;
                padding: 8px 35px 8px 14px;
                position: relative;

                &, a, h4 {
                    color: #fff;
                }

                pre {
                    white-space: normal;
                }
            }

            .preview-alert-warning {
                background-color: var(--uui-color-warning, #f0ac00);
                border-color: transparent;
                color: #000;
            }

            .preview-alert-info {
                background-color: var(--uui-color-default, #3544b1);
                border-color: transparent;
                color: #fff;
            }

            .preview-alert-danger, .preview-alert-error {
                background-color: var(--uui-color-danger, #f0ac00);
                border-color: transparent;
                color: #fff;
            }
        `
];
$([
  h()
], v.prototype, "htmlMarkup", 2);
$([
  h()
], v.prototype, "_blockRteValue", 2);
$([
  L({ attribute: !1 })
], v.prototype, "blockRteValue", 1);
v = $([
  H(Et)
], v);
const Tt = [
  {
    type: "globalContext",
    alias: "BlockPreview.Context",
    name: "BlockPreview Context",
    js: () => Promise.resolve().then(() => xt)
  }
], Ct = [...Tt];
var R, g;
class W extends _e {
  constructor(r) {
    super(r);
    C(this, R, void 0);
    C(this, g, void 0);
    x(this, g, new Xe(void 0)), this.settings = w(this, g).asObservable(), x(this, R, new ge(r)), this.getSettings();
  }
  async getSettings() {
    const r = await w(this, R).getSettings();
    w(this, g).setValue(r);
  }
}
R = new WeakMap(), g = new WeakMap();
const xt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlockPreviewContext: W,
  default: W
}, Symbol.toStringTag, { value: "Module" })), jt = async (t, e) => {
  var s, n, a;
  const o = await new ge(t).getSettings();
  let i = [];
  if (o) {
    if (o.blockGrid.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.GridCustomView",
        name: "BlockPreview Grid Custom View",
        element: u,
        forBlockEditor: "block-grid"
      };
      ((s = o.blockGrid.contentTypes) == null ? void 0 : s.length) !== 0 && (c.forContentTypeAlias = o.blockGrid.contentTypes), i.push(c);
    }
    if (o.blockList.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.ListCustomView",
        name: "BlockPreview List Custom View",
        element: d,
        forBlockEditor: "block-list"
      };
      ((n = o.blockList.contentTypes) == null ? void 0 : n.length) !== 0 && (c.forContentTypeAlias = o.blockList.contentTypes), i.push(c);
    }
    if (o.richText.enabled) {
      let c = {
        type: "blockEditorCustomView",
        alias: "BlockPreview.RichTextCustomView",
        name: "BlockPreview Rich Text Custom View",
        element: v,
        forBlockEditor: "block-rte"
      };
      ((a = o.richText.contentTypes) == null ? void 0 : a.length) !== 0 && (c.forContentTypeAlias = o.richText.contentTypes), i.push(c);
    }
  }
  e.registerMany([
    ...i,
    ...Ct
  ]), t.provideContext(Ee, new W(t)), t.consumeContext(Ge, async (c) => {
    if (!c)
      return;
    const l = c.getOpenApiConfiguration();
    f.BASE = l.base, f.TOKEN = l.token, f.WITH_CREDENTIALS = l.withCredentials, f.CREDENTIALS = l.credentials;
  });
};
export {
  u as BlockGridPreviewCustomView,
  d as BlockListPreviewCustomView,
  v as RichTextPreviewCustomView,
  dt as SettingsDataSource,
  ge as SettingsRepository,
  jt as onInit
};
//# sourceMappingURL=assets.js.map
