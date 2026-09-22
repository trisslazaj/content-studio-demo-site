// Lists the posts Content Studio has published into this repo. The list is
// posts/index.json, written by api/publish-github.js: an array of
// { slug, title, excerpt, date, path, hero }, newest first.
//
// Everything is built with DOM APIs and textContent, never innerHTML: the
// titles and excerpts are generated text, and a post list must not be a way
// to put markup on the page. Links and images only use relative paths
// inside this site.

(function () {
  var list = document.getElementById("posts");
  var status = document.getElementById("status");
  var SAFE_PATH = /^(?!\/)(?!.*\.\.)[A-Za-z0-9_./-]+$/;

  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00Z");
    if (isNaN(d.getTime())) return iso || "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function card(post) {
    var li = el("li", "post-card");
    var link = el("a", "post-link");
    link.href = post.path;
    if (post.hero && SAFE_PATH.test(post.hero)) {
      var img = el("img", "post-thumb");
      img.src = post.hero;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      link.appendChild(img);
    } else {
      link.appendChild(el("div", "post-thumb post-thumb-empty"));
    }
    var text = el("div", "post-text");
    var time = el("time", "post-meta", formatDate(post.date));
    time.dateTime = post.date || "";
    text.appendChild(time);
    text.appendChild(el("h2", "post-title", post.title || post.slug));
    if (post.excerpt) text.appendChild(el("p", "post-excerpt", post.excerpt));
    text.appendChild(el("span", "post-more", "Read post →"));
    link.appendChild(text);
    li.appendChild(link);
    return li;
  }

  fetch("posts/index.json", { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (posts) {
      var shown = (Array.isArray(posts) ? posts : []).filter(function (p) {
        return p && typeof p === "object" && typeof p.path === "string" && SAFE_PATH.test(p.path);
      });
      if (!shown.length) {
        status.textContent = "No posts yet. Publish one from Content Studio and it will appear here after the next deploy.";
        return;
      }
      shown.forEach(function (p) { list.appendChild(card(p)); });
      list.hidden = false;
      status.hidden = true;
    })
    .catch(function (err) {
      status.textContent = "Could not load posts (" + err.message + ").";
      status.classList.add("status-error");
    });
})();
