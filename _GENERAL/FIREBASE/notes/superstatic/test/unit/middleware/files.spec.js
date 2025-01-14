/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://github.com/firebase/superstatic/blob/master/LICENSE
 */

const fs = require("fs-extra");
const expect = require("chai").expect;
const request = require("supertest");
const connect = require("connect");

const helpers = require("../../helpers");
const files = helpers.decorator(require("../../../src/middleware/files"));
const fsProvider = require("../../../src/providers/fs");
const Responder = require("../../../src/responder");

describe("i18n", () => {
  const provider = fsProvider({
    public: ".tmp",
  });
  let app;

  beforeEach(() => {
    fs.outputFileSync(".tmp/foo.html", "foo.html content", "utf8");
    fs.outputFileSync(".tmp/foo/index.html", "foo/index.html content", "utf8");
    fs.outputFileSync(".tmp/foo/bar.html", "foo/bar.html content", "utf8");
    fs.outputFileSync(".tmp/intl/es/index.html", "hola", "utf8");
    fs.outputFileSync(".tmp/intl/fr/index.html", "French Index!", "utf8");
    fs.outputFileSync(".tmp/intl/jp_ALL/other.html", "Japanese!", "utf8");
    fs.outputFileSync(".tmp/intl/fr_ca/index.html", "French CA!", "utf8");
    fs.outputFileSync(".tmp/intl/ALL_ca/index.html", "Oh Canada", "utf8");
    fs.outputFileSync(".tmp/intl/ALL_ca/hockey.html", "Only Canada", "utf8");

    app = connect().use((req, res, next) => {
      res.superstatic = new Responder(req, res, {
        provider: provider,
      });
      next();
    });
  });

  afterEach(() => {
    fs.removeSync(".tmp/");
  });

  it("should resolve i18n content by accept-language", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/")
      .set("accept-language", "es")
      .expect(200, "hola")
      .end(done);
  });

  it("should resolve default files if nothing is provided", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/foo.html")
      .set("accept-language", "jp")
      .expect(200, "foo.html content")
      .end(done);
  });

  it("should resolve i18n content by x-country-code", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/")
      .set("x-country-code", "ca")
      .expect(200, "Oh Canada")
      .end(done);
  });

  it("should not show i18n content for other countries", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/hockey.html")
      .set("x-country-code", "jp")
      .expect(404)
      .end(done);
  });

  it("should allow i18n content specific to a country", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/hockey.html")
      .set("x-country-code", "ca")
      .expect(200, "Only Canada")
      .end(done);
  });

  it("should resolve i18n content by accept-language and x-country-code", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/")
      .set("accept-language", "fr")
      .set("x-country-code", "ca")
      .expect(200, "French CA!")
      .end(done);
  });

  it("should override the content using cookies for location", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/")
      .set("accept-language", "es")
      .set("cookie", "firebase-language-override=fr")
      .expect(200, "French Index!")
      .end(done);
  });

  it("should override the content using cookies for location and country", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/")
      .set("accept-language", "en")
      .set(
        "cookie",
        "firebase-language-override=fr; firebase-country-override=ca"
      )
      .expect(200, "French CA!")
      .end(done);
  });

  it("should allow i18n resolution by language with _ALL", (done) => {
    app.use(files({ i18n: { root: "/intl" } }, { provider }));

    request(app)
      .get("/other.html")
      .set("accept-language", "jp")
      .expect(200, "Japanese!")
      .end(done);
  });
});

describe("static server with trailing slash customization", () => {
  const provider = fsProvider({
    public: ".tmp",
  });
  let app;

  beforeEach(() => {
    fs.outputFileSync(".tmp/foo.html", "foo.html content", "utf8");
    fs.outputFileSync(".tmp/foo/index.html", "foo/index.html content", "utf8");
    fs.outputFileSync(".tmp/foo/bar.html", "foo/bar.html content", "utf8");

    app = connect().use((req, res, next) => {
      res.superstatic = new Responder(req, res, {
        provider: provider,
      });
      next();
    });
  });

  afterEach(() => {
    fs.removeSync(".tmp");
  });

  it("serves html file", (done) => {
    app.use(files({}, { provider: provider }));

    request(app)
      .get("/foo.html")
      .expect(200)
      .expect("foo.html content")
      .expect("content-type", "text/html; charset=utf-8")
      .end(done);
  });

  it("serves html file with unicode name", (done) => {
    fs.outputFileSync(".tmp/äää.html", "test", "utf8");

    app.use(files({}, { provider: provider }));

    request(app)
      .get("/äää.html")
      .expect(200)
      .expect("test")
      .expect("content-type", "text/html; charset=utf-8")
      .end(done);
  });

  it("serves css file", (done) => {
    fs.outputFileSync(".tmp/style.css", "body {}", "utf8");

    app.use(files({}, { provider: provider }));

    request(app)
      .get("/style.css")
      .expect(200)
      .expect("body {}")
      .expect("content-type", "text/css; charset=utf-8")
      .end(done);
  });

  it("serves a directory index file", (done) => {
    fs.outputFileSync(".tmp/index.html", "test", "utf8");

    app.use(files({}, { provider: provider }));

    request(app)
      .get("/")
      .expect(200)
      .expect("test")
      .expect("content-type", "text/html; charset=utf-8")
      .end(done);
  });

  it("serves a file with query parameters", (done) => {
    fs.outputFileSync(".tmp/superstatic.html", "test", "utf8");

    app.use(files({}, { provider: provider }));

    request(app)
      .get("/superstatic.html?key=value")
      .expect(200)
      .expect("test")
      .end(done);
  });

  it("does not redirect the root url because of the trailing slash", (done) => {
    fs.outputFileSync(".tmp/index.html", "an actual index", "utf8");

    app.use(files({}, { provider: provider }));

    request(app).get("/").expect(200).expect("an actual index").end(done);
  });

  it("does not redirect for directory index files", (done) => {
    app.use(files({}, { provider: provider }));

    request(app)
      .get("/foo/")
      .expect(200)
      .expect((data) => {
        expect(data.req.path).to.equal("/foo/");
      })
      .end(done);
  });

  it("function() directory index to have a trailing slash", (done) => {
    app.use(files({}, { provider: provider }));

    request(app)
      .get("/foo")
      .expect((req) => {
        expect(req.headers.location).to.equal("/foo/");
      })
      .expect(301)
      .end(done);
  });

  it("preserves query parameters and slash on subdirectory directory index redirect", (done) => {
    app.use(files({}, { provider: provider }));

    request(app)
      .get("/foo?query=params")
      .expect((req) => {
        expect(req.headers.location).to.equal("/foo/?query=params");
      })
      .expect(301)
      .end(done);
  });

  describe("force trailing slash", () => {
    it("adds slash to url with no extension", (done) => {
      app.use(files({ trailingSlash: true }, { provider: provider }));

      request(app)
        .get("/foo")
        .expect(301)
        .expect("Location", "/foo/")
        .end(done);
    });
  });

  describe("force remove trailing slash", () => {
    it("removes trailing slash on urls with no file extension", (done) => {
      app.use(files({ trailingSlash: false }, { provider: provider }));

      request(app)
        .get("/foo/")
        .expect(301)
        .expect("Location", "/foo")
        .end(done);
    });

    it("returns a 404 if a trailing slash was added to a valid path", (done) => {
      app.use(files({ trailingSlash: false }, { provider: provider }));

      request(app).get("/foo.html/").expect(404).end(done);
    });

    it("removes trailing slash on directory index urls", (done) => {
      app.use(files({ trailingSlash: false }, { provider: provider }));

      request(app)
        .get("/foo/")
        .expect(301)
        .expect("Location", "/foo")
        .end(done);
    });

    it("normalizes multiple leading slashes on a redirect", (done) => {
      app.use(files({ trailingSlash: false }, { provider: provider }));

      request(app)
        .get("/foo////")
        .expect(301)
        .expect("Location", "/foo")
        .end(done);
    });
  });

  [
    {
      trailingSlashBehavior: undefined,
      cleanUrls: false,
      tests: [
        { path: "/foo", wantRedirect: "/foo/" },
        { path: "/foo.html", wantContent: "foo.html content" },
        { path: "/foo.html/", wantNotFound: true },
        { path: "/foo/", wantContent: "foo/index.html content" },
        { path: "/foo/bar", wantNotFound: true },
        { path: "/foo/bar.html", wantContent: "foo/bar.html content" },
        { path: "/foo/bar.html/", wantNotFound: true },
        { path: "/foo/bar/", wantNotFound: true },
        { path: "/foo/index", wantNotFound: true },
        { path: "/foo/index.html", wantContent: "foo/index.html content" },
        { path: "/foo/index.html/", wantNotFound: true },
      ],
    },
    {
      trailingSlashBehavior: false,
      cleanUrls: false,
      tests: [
        { path: "/foo", wantContent: "foo/index.html content" },
        { path: "/foo.html", wantContent: "foo.html content" },
        { path: "/foo.html/", wantNotFound: true },
        { path: "/foo/", wantRedirect: "/foo" },
        { path: "/foo/bar", wantNotFound: true },
        { path: "/foo/bar.html", wantContent: "foo/bar.html content" },
        { path: "/foo/bar.html/", wantNotFound: true },
        { path: "/foo/bar/", wantNotFound: true },
        { path: "/foo/index", wantNotFound: true },
        { path: "/foo/index.html", wantContent: "foo/index.html content" },
        { path: "/foo/index.html/", wantNotFound: true },
      ],
    },
    {
      trailingSlashBehavior: true,
      cleanUrls: false,
      tests: [
        { path: "/foo", wantRedirect: "/foo/" },
        { path: "/foo.html", wantContent: "foo.html content" },
        { path: "/foo.html/", wantNotFound: true },
        { path: "/foo/", wantContent: "foo/index.html content" },
        { path: "/foo/bar", wantNotFound: true },
        { path: "/foo/bar.html", wantContent: "foo/bar.html content" },
        { path: "/foo/bar.html/", wantNotFound: true },
        { path: "/foo/bar/", wantNotFound: true },
        { path: "/foo/index", wantNotFound: true },
        { path: "/foo/index.html", wantContent: "foo/index.html content" },
        { path: "/foo/index.html/", wantNotFound: true },
      ],
    },
    {
      trailingSlashBehavior: undefined,
      cleanUrls: true,
      tests: [
        { path: "/foo", wantContent: "foo/index.html content" },
        { path: "/foo.html", wantRedirect: "/foo" },
        { path: "/foo.html/", wantNotFound: true },
        { path: "/foo/", wantContent: "foo/index.html content" },
        { path: "/foo/bar", wantContent: "foo/bar.html content" },
        { path: "/foo/bar.html", wantRedirect: "/foo/bar" },
        { path: "/foo/bar.html/", wantNotFound: true },
        { path: "/foo/bar/", wantNotFound: true },
        { path: "/foo/index", wantRedirect: "/foo" },
        { path: "/foo/index.html", wantRedirect: "/foo" },
        { path: "/foo/index.html/", wantNotFound: true },
      ],
    },
    {
      trailingSlashBehavior: false,
      cleanUrls: true,
      tests: [
        { path: "/foo", wantContent: "foo/index.html content" },
        { path: "/foo.html", wantRedirect: "/foo" },
        { path: "/foo.html/", wantNotFound: true },
        { path: "/foo/", wantRedirect: "/foo" },
        { path: "/foo/bar", wantContent: "foo/bar.html content" },
        { path: "/foo/bar.html", wantRedirect: "/foo/bar" },
        { path: "/foo/bar.html/", wantNotFound: true },
        { path: "/foo/bar/", wantRedirect: "/foo/bar" },
        { path: "/foo/index", wantRedirect: "/foo" },
        { path: "/foo/index.html", wantRedirect: "/foo" },
        { path: "/foo/index.html/", wantNotFound: true },
      ],
    },
    {
      trailingSlashBehavior: true,
      cleanUrls: true,
      tests: [
        { path: "/foo", wantRedirect: "/foo/" },
        { path: "/foo.html", wantRedirect: "/foo/" },
        { path: "/foo.html/", wantNotFound: true },
        { path: "/foo/", wantContent: "foo/index.html content" },
        { path: "/foo/bar", wantRedirect: "/foo/bar/" },
        { path: "/foo/bar.html", wantRedirect: "/foo/bar/" },
        { path: "/foo/bar.html/", wantNotFound: true },
        { path: "/foo/bar/", wantContent: "foo/bar.html content" },
        { path: "/foo/index", wantRedirect: "/foo/" },
        { path: "/foo/index.html", wantRedirect: "/foo/" },
        { path: "/foo/index.html/", wantNotFound: true },
      ],
    },
  ].forEach((t) => {
    const desc =
      "trailing slash " +
      t.trailingSlashBehavior +
      " cleanUrls " +
      t.cleanUrls +
      " ";
    t.tests.forEach((tt) => {
      const ttDesc = desc + JSON.stringify(tt);
      it("should behave correctly: " + ttDesc, (done) => {
        app.use(
          files(
            { trailingSlash: t.trailingSlashBehavior, cleanUrls: t.cleanUrls },
            { provider: provider }
          )
        );

        const r = request(app).get(tt.path);
        if (tt.wantRedirect) {
          r.expect(301).expect("Location", tt.wantRedirect);
        } else if (tt.wantNotFound) {
          r.expect(404);
        } else if (tt.wantContent) {
          r.expect(200).expect(tt.wantContent);
        } else {
          return done(new Error("Test set up incorrectly"));
        }
        r.end(done);
      });
    });
  });
});
