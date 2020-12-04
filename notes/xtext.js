xtext = {
    format_date: function (d) {
        var s = d.split("-");
        return s[2] + "/" + s[1];
    },
    html_encode(s) {
        return s.replace(/[<]+/g, "&lt;");
    },
    cut_out_between(s, delimiter) {
        var sp = s.split(delimiter);
        var removed = [];
        s = "";
        for (var i = 0; i < sp.length; i++) {
            if (i % 2 === 0) s += sp[i];
            else {
                s += i ? "$cut-" + (i + 1) / 2 : "";
                removed.push(sp[i]);
            }
        }
        return [s, removed];
    },
    add_cuts(s, cuts, delim) {
        if (typeof delim === "undefined") delim = "";
        for (var i = 0; i < cuts.length; i++)
            s = s.replace("$cut-" + (i + 1), delim + cuts[i] + delim);
        return s;
    },
    load_code_highlighter() {
        if (typeof hljs != "undefined") {
            setTimeout(hljs.initHighlighting, 100);
            return;
        }
        var s = document.createElement("script");
        s.src =
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.4.1/build/highlight.min.js";
        document.body.appendChild(s);
        s.setAttribute(
            "onload",
            "hljs.initHighlighting();" + "setTimeout(hljs.initHighlighting,400)"
        );
        s = document.createElement("link");
        s.rel = "stylesheet";
        s.href =
            "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.4.1/build/styles/default.min.css";
        document.head.appendChild(s);
    },
    highlight_code(s) {
        return typeof hljs !== "undefined" ? hljs.highlightAuto(s).value : s;
    },
    highlight: function (s) {
        s = s.replace(/\*+([^*\s][^*]*?)\*+/g, "<b>$1</b>");
        // https://css-tricks.com/quoting-in-html-quotations-citations-and-blockquotes/
        // https://stackoverflow.com/questions/35948102/how-to-create-a-border-bottom-in-css-using-a-text-character-such-as-a-dash-lett
        // https://stackoverflow.com/questions/28152175/a-wavy-underline-in-css
        s = s.replace(/(\s+|^)"(.+?)"/g, "$1<q>$2</q>");
        return s;
    },
    center: function (s) {
        if (s.indexOf("_center") === -1) return s;
        return s.replace(/_center\s+(.*)/, "<center>$1</center>");
    },
    frame: function (s) {
        if (s.indexOf("_frame") === -1) return s;
        return s.replace(
            /_frame\s*([\s\S]+?)\s*_endframe/g,
            '<div class="frame simple">$1</div>'
        );
    },
    price: function (s) {
        return s
            .replace(/(zdarma)/gi, "<cena>$1</cena>")
            .replace(
                /(([0-9.,]+[0-9])\s*(Kč|EURo?|CZK))/g,
                "<cena>$2 $3</cena>"
            )
            .replace(/([0-9.,]+[0-9]),-\s*(Kč|CZK|)/g, "<cena>$1 Kč</cena>");
    },
    activate_links: function (s) {
        return s.replace(
            /(((https?:\/\/|www\.|ftps?:\/\/)[^\s]+\.[^\s]+[^.,?!\s]))|((www\.|fb\.com\/|bit\.ly\/)[^\s,?!/]+[^\s,?!]|[^\s,?!/]+@[^\s,?!/]+)/g,
            '<l onclick="clicked()">$1$4</l>'
        );
    },
    style_fixed: function (f) {
        return f.replace(/frame(@\/[0-9]+\/@)/, '<div class="frame">$1</div>');
    },
    style_fixed_original: function (f) {
        return f.replace(
            /frame(\$\$[^$]+?\$\$|\([^)]+\)|\[[^\]]+\])/g,
            '<div class="frame">$1</div>'
        );
    },
    replace_fixed: function (s) {
        s = s.replace(/\\\\/g, "/@n-line/");
        var f1 =
            s.match(/\$\$((?:(?!(\\\[|\$\$|\\\())(.|[\r\n]))+?)\$\$/gm) || [];
        var f2 =
            s.match(/\\\[((?:(?!(\\\[|\$\$|\\\())(.|[\r\n]))+?)\\\]/gm) || [];
        var f3 =
            s.match(/\\\(((?:(?!(\\\[|\$\$|\\\())(.|[\r\n]))+?)\\\)/gm) || [];
        var f4 = s.match(/```\r?\n[^`]+\r?\n```/gm) || [];
        var f = f1.concat(f2, f3, f4);
        for (var i = 0; i < f.length; i++) {
            s = s.replace(f[i], "@/" + i + "/@");
            f[i] = f[i].replace(
                /[<]+/g,
                f[i].indexOf("```") > -1 ? "&lt;" : "\\lt "
            ); //proti HTML injekci
        }
        return [s, f];
    },
    put_fixed: function (s, f) {
        for (var i = 0; i < f.length; i++) {
            s = s
                .replace("@/" + i + "/@", f[i].split("$").join("£"))
                .split("£")
                .join("$")
                .replace(/[\n\r]+/, ""); //s \n se nekompiluje!
        }
        return s.replace(/\/@n-line\//g, "\\\\");
    },
    into_symbols: function (si) {
        // https://graphemica.com/
        return si
            .replace(/<==>/g, "⟺")
            .replace(/==>/g, "⟹")
            .replace(/<==/g, "⟸")
            .replace(/<-->/g, "⟷")
            .replace(/-->/g, "⟶")
            .replace(/<--/g, "⟵")
            .replace(/c->/g, "⟳")
            .replace(/d->/g, "⟲")
            .replace(/\+->/g, "⟴")
            .replace(/<=>/g, "⇔")
            .replace(/=>/g, "⇒")
            .replace(/<=/g, "⇐")
            .replace(/_exist/g, "∃")
            .replace(/_all/g, "∀")
            .replace(/(_mapsto|\|->|I->)/g, "↦")
            .replace(/<->/g, "↔")
            .replace(/->/g, "→")
            .replace(/<-/g, "←")
            .replace(/_up/g, "↑")
            .replace(/_down/g, "↓")
            .replace(/_union/g, "∪")
            .replace(/_intersection/g, "∩")
            .replace(/_subset/g, "⊆")
            .replace(/_propersubset/g, "⊂")
            .replace(/_notsubset/g, "⊄")
            .replace(/_superset/g, "⊇")
            .replace(/_propersuperset/g, "⊃")
            .replace(/_notsuperset/g, "⊅")
            .replace(/_in/g, "∈")
            .replace(/_notin/g, "∉")
            .replace(/_empty/g, "∅")
            .replace(/_therefore/g, "∴")
            .replace(/_sum/g, "Σ")
            .replace(/_sum2/g, "∑")
            .replace(/_int/g, "∫")
            .replace(/_partial/g, "∂") //&part;
            .replace(/_del/g, "∂")
            .replace(/_nabla/g, "∇")
            .replace(/_laplace/g, "Δ")
            .replace(/_delta/g, "Δ")
            .replace(/_triangle/g, "△")
            .replace(/_fourier/g, "ℱ")
            .replace(/_laplace/g, "ℒ")
            .replace(/\+-/g, "±")
            .replace(/_pi/g, "π")
            .replace(/_h-bar/g, "ħ")
            .replace(/_h-bar2/g, "ℏ")
            .replace(/_delta/g, "δ")
            .replace(/_ne/g, "≠")
            .replace(/_</g, "〈")
            .replace(/_>/g, "〉")
            .replace(/_wedge/g, "∧")
            .replace(/_\*/g, "◦")
            .replace(/_isomorphic/g, "≅")
            .replace(/_homeomorphic/g, "≃");
    },
    format_text: function (s) {
        if (!s) return s;
        var del = this.cut_out_between(s, "```");
        s = del[0];
        var cut_array = del[1].map(
            (x) =>
                "<pre><code class=hljs>" +
                this.highlight_code(this.html_encode(x.replace(/^\s+/, ""))) +
                "</code></pre>"
        );
        if (cut_array.length) this.load_code_highlighter();
        console.log("cut_array", cut_array);
        s = s
            .replace(/\r/g, "")
            .replace(/^\s+|\s+$/g, "")
            .replace(/\$\$\$\$/g, "");
        s = s.replace(/\r/g, "").replace(/^\s+|\s+$/g, "");
        var fixed = [];
        var rc = this.replace_fixed;
        var p = typeof rc == "function" ? rc(s) : [s, fixed];
        s = p[0];
        fixed = p[1];
        s = this.into_symbols(s);
        var si = this.frame(s.replace(/<[^\s][^>]*>/g, "")).split("\n");
        var ul = false;
        for (var i = 0; i < si.length; i++) {
            si[i] = this.center(si[i]);
            //polyfill for negative lookbehind
            if (si[i].indexOf("_") > -1 || si[i].indexOf("^") > -1) {
                si[i] = si[i].replace(/(http|www|@|\/\/)(\S+)/g, "$1$2####");
                si[i] = si[i].replace(
                    /_([0-9a-zA-Z]+)_?(?!(\S*####))/g,
                    "<sub>$1</sub>"
                );
                si[i] = si[i].replace(
                    /\^([^\s^]+)\^?(?!(\S*####))/g,
                    "<sup>$1</sup>"
                );
                si[i] = si[i].replace(/####/g, "");
            }
            /* negative lookbehind not supported in older browsers
            si[i] = si[i].replace(
                /(?<!(http|www|@|\/\/)\S+)_([0-9a-zA-Z]+)_?/g,
                "<sub>$2</sub>"
            );
            si[i] = si[i].replace(
                /(?<!(http|www|@|\/\/)\S+)\^([^\s^]+)\^?/g,
                "<sup>$2</sup>"
            );
            */
            si[i] = si[i].replace(/^\s+|\s+$/, "");
            si[i] = this.highlight(si[i]);
            si[i] = this.price(si[i]);
            si[i] = this.activate_links(si[i]);
            if (si[i][0] == "#") {
                if (si[i][1] == "#")
                    si[i] = "<h4>" + si[i].replace(/##\s*/, "") + "</h4>";
                else si[i] = "<h3>" + si[i].replace(/#\s*/, "") + "</h3>";
                if (ul) {
                    ul = false;
                    si[i] = "</ul>" + si[i];
                }
                var j = i - 1;
                var m = [];
                while (-1 < j && (m = si[j].match(/^(.*)<nl><br><\/nl>/))) {
                    si[j] = m[1];
                    j--;
                }
                while (si.length > i + 1 && !si[i + 1]) {
                    i++;
                }
            } else {
                if (
                    si[i].substr(0, 3) == "---" ||
                    si[i].substr(0, 5) == "- - -"
                )
                    si[i] = si[i].replace(/[- ]{3,}$/, "<hr>");
                if (
                    (si[i].length < 2 || !si[i][1].match(/[0-9.]/)) &&
                    (si[i][0] == "-" || si[i][0] == "*")
                ) {
                    si[i] =
                        "<li>" + si[i].slice(1).replace(/^\s*/, "") + "</li>";
                    if (!ul) {
                        ul = true;
                        si[i] = "<ul>" + si[i];
                    }
                    if (si.length == i + 1) {
                        si[i] = si[i] + "</ul>";
                        ul = false;
                    }
                } else if (si[i]) {
                    si[i] = "<div>" + si[i] + "</div>";
                    if (ul) {
                        ul = false;
                        si[i] = "</ul>" + si[i];
                    }
                } else {
                    if (ul) {
                        ul = false;
                        si[i] = "</ul>" + si[i];
                    } else {
                        si[i] = "<nl><br></nl>";
                    }
                }
            }
        }
        si = si.join("");
        if (fixed) {
            si = this.style_fixed(si);
            si = this.put_fixed(si, fixed);
        }
        //si=this.add_math_symbols(si);
        if (cut_array.length) {
            si = this.add_cuts(si, cut_array);
        }
        return si;
    },
    o: function (t) {
        return this.format_text(t);
    },
};
