"""محاكي مبسّط لقالب بلوجر: يقيّم b:if / b:loop / data: / expr: ويُخرج HTML ثابتاً للاختبار.
يغطي ما يستخدمه هذا القالب فقط. ليس بديلاً عن المعاينة الحية في بلوجر."""
import re, xml.etree.ElementTree as ET
from html import escape
NS = {'b': 'http://www.google.com/2005/gml/b', 'data': 'http://www.google.com/2005/gml/data', 'expr': 'http://www.google.com/2005/gml/expr'}
B, D, E = ('{%s}' % NS[k] for k in ('b', 'data', 'expr'))
VOID = {'meta', 'link', 'input', 'img', 'br', 'hr'}
RAW = {'script', 'style'}


def local(tag):
    return tag.split('}', 1)[1] if tag.startswith('{') else tag


class Sim:
    def __init__(self, xml_text):
        # DOCTYPE html يسبب خطأ في ET: نحذفه
        self.root = ET.fromstring(re.sub(r'<!DOCTYPE[^>]*>', '', xml_text, count=1).encode('utf-8'))

    def lookup(self, path, scope):
        parts = path.split('.')
        cur = scope.get(parts[0], '')
        for p in parts[1:]:
            cur = cur.get(p, '') if isinstance(cur, dict) else ''
        return cur

    def ev(self, expr, scope):
        py = re.sub(r'data:([A-Za-z0-9_.]+)', lambda m: 'L(%r)' % m.group(1), expr)
        py = py.replace('&quot;', '"')
        return eval(py, {'__builtins__': {}}, {'L': lambda p: self.lookup(p, scope)})

    def html(self, page_ctx):
        X='{http://www.w3.org/1999/xhtml}'
        head, body = self.root.find(X+'head'), self.root.find(X+'body')
        out = ['<!DOCTYPE html><html lang="%s" dir="%s"><head>' % (self.root.get('lang'), page_ctx['blog']['languageDirection'])]
        out.append(self.nodes(head, page_ctx)); out.append('</head><body>')
        out.append(self.nodes(body, page_ctx)); out.append('</body></html>')
        return ''.join(out)

    def nodes(self, el, scope):
        s = escape(el.text or '', quote=False) if local(el.tag) not in RAW else (el.text or '')
        for c in el:
            s += self.node(c, scope)
            s += (c.tail or '') if local(el.tag) in RAW else escape(c.tail or '', quote=False)
        return s

    def node(self, el, scope):
        t = el.tag
        if t.startswith(D):
            return escape(str(self.lookup(local(t), scope)), quote=False)
        if t == B + 'include':
            return ''
        if t == B + 'skin':
            return '<style>' + (el.text or '') + '</style>'
        if t == B + 'section':
            return ''.join(self.node(c, scope) for c in el)
        if t == B + 'widget':
            inc = [c for c in el if c.tag == B + 'includable' and c.get('id') == 'main']
            return self.nodes(inc[0], scope) if inc else ''
        if t == B + 'loop':
            var, vals = el.get('var'), self.ev(el.get('values'), scope)
            return ''.join(self.nodes(el, dict(scope, **{var: v})) for v in vals)
        if t == B + 'if':
            return self.branch(el, scope)
        if t in (B + 'else', B + 'elseif'):
            return ''
        # عنصر HTML عادي
        name = local(t)
        attrs = ''
        for k, v in el.attrib.items():
            if k.startswith(E):
                attrs += ' %s="%s"' % (local(k), escape(str(self.ev(v, scope)), quote=True))
            elif not k.startswith('{') and k not in ('b:version',):
                attrs += ' %s="%s"' % (k, escape(v, quote=True))
        if name in VOID:
            return '<%s%s>' % (name, attrs)
        return '<%s%s>%s</%s>' % (name, attrs, self.nodes(el, scope), name)

    def branch(self, el, scope):
        # كل ما بعد b:if حتى النهاية ينقسم عند b:elseif/b:else (بنية بلوجر المسطّحة داخل العنصر)
        groups, cur = [(el.get('cond'), '')], 0
        s = escape(el.text or '', quote=False)
        parts = [[el.get('cond'), s]]
        for c in el:
            if c.tag == B + 'elseif':
                parts.append([c.get('cond'), ''])
            elif c.tag == B + 'else':
                parts.append([None, ''])
            else:
                parts[-1][1] += self.node(c, scope)
            tail = escape(c.tail or '', quote=False)
            parts[-1][1] += tail
        for cond, content in parts:
            if cond is None or self.ev(cond, scope):
                return content
        return ''
