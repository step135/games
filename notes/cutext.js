var cutext = {
    html_encode(s) {
        return s.replace(/[<]+/g, "&lt;");
    },
    cut_out_between(s, delimiter, mark) {
        if (typeof mark === "undefined") mark = "";
        var sp = s.split(delimiter);
        if (sp.length % 2 != 1) return [s, []];
        var removed = [];
        s = "";
        for (var i = 0; i < sp.length; i++) {
            if (i % 2 === 0) s += sp[i];
            else {
                s += i ? "$cut-" + mark + "-" + (i + 1) / 2 : "";
                removed.push(delimiter + sp[i] + delimiter);
            }
        }
        return [s, removed];
    },
    add_cuts(s, cuts, mark) {
        if (typeof mark === "undefined") mark = "";
        for (var i = 0; i < cuts.length; i++)
            s = s.replace("$cut-" + mark + "-" + (i + 1), cuts[i]);
        return s;
    },
    
}