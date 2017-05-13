var fs = require('fs');
var svgpath = require('svgpath');
var htmlToHs = require('html-to-hyperscript').htmlToHs;
var parseString = require('xml2js').parseString;
var beautify = require('js-beautify').js_beautify;
var camelCase = require('camelcase');
var R = require('ramda');
var path = {
    svgFont: './node_modules/font-awesome/fonts/fontawesome-webfont.svg',
    less: './node_modules/font-awesome/less/variables.less'
};

var names = (function() {
    var matches = fs.readFileSync(path.less).toString('utf8').match(/@fa\-var\-[\w\-]+\s*?:\s*?"\\[\da-f]*?"/g);
    var result = {};
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var name = match.split(':')[0].substr('@fa-var-'.length);
        var code = parseInt(match.match(/"\\([\da-f]+)"/)[1], 16);
        result[code] = name;
    }
    return result;
})();

parseString(fs.readFileSync(path.svgFont).toString('utf8'), function(err, xml) {
    var icons = collectIcon(xml.svg.defs[0].font[0].glyph);
    if (!icons.length) return;
    var script = buildScript(icons);
    fs.writeFileSync('./src/index.ts', script);
});

function collectIcon(glyphs) {
    var svgs = [];
    for (var i = 0; i < glyphs.length; i++) {
        var glyph = glyphs[i].$;
        if (!glyph.unicode || !glyph.d) continue;
        var d = glyph.d;
        var width = +glyph['horiz-adv-x'] || 1792;
        var code = drawSvg(d, width);
        var name = names[glyph.unicode.charCodeAt(0)];
        if (!name) continue;
        svgs.push({ code: code, name: name });
    }
    return svgs;
}

function buildScript(svgs) {
    var source = "import {h} from 'snabbdom';";
    source += "import {VNode} from 'snabbdom/vnode';";
    source += 'export const fa = {';
    source += svgs.map(function(svg) {
        var h = htmlToHs({
            syntax: 'h',
            attributesSelector: function(item) {
                return R.assocPath(['attrs', item.name], item.value);
            }
        })(svg.code);
        return '"' + camelCase(svg.name) + '": (): VNode => ' + h;
    }).join(',');
    source += '};';
    source = beautify(source, { indent_size: 4 });
    return source;
}

function drawSvg(path, width) {
    var d = svgpath(path).scale(1, -1).translate(0, 1536).toString();

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' 1792">'+
    '<path d="' + d + '"></path>'+
    '</svg>';
}

