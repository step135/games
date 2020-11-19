xtext = {
    format_date: function (d) {
        var s = d.split("-");
        return s[2] + "/" + s[1];
    },
    highlight: function (s) {
        s = s.replace(/\*+([^*\s][^*]*?)\*+/g, "<b>$1</b>");
        s = s.replace(/(\s+|^)"(.+?)"/g, "<b>$1</b>");
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
        return si
            .replace(/<=>/g, "⇔")
            .replace(/=>/g, "⇒")
            .replace(/<=/g, "⇒")
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
            .replace(/_therefore/g, "∴");
    },
    format_text: function (s) {
        if (!s) return s;
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
            si[i] = si[i].replace(
                /(?<!(http|www|@|\/\/)\S+)_([0-9a-zA-Z]+)_?/g,
                "<sub>$2</sub>"
            );
            si[i] = si[i].replace(
                /(?<!(http|www|@|\/\/)\S+)\^([^\s^]+)\^?/g,
                "<sup>$2</sup>"
            );
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
                    si[i] = si[i].replace(/[- ]{3,}/, "<hr>");
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
        return si;
    },
    o: function (t) {
        return this.format_text(t);
    },
};
