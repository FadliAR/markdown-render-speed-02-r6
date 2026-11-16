// parse.js — from-scratch CommonMark + GFM renderer.
// Written in this session. Output targets byte-identity with marked 18.1.3.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function escape(html, encode) {
  if (encode) return html.replace(/[&<>"']/g, (c) => ESC[c]);
  return html.replace(/[&<>]/g, (c) => ESC[c]);
}

const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', iexcl: '¡', cent: '¢',
  pound: '£', curren: '¤', yen: '¥', brvbar: '¦', sect: '§', uml: '¨', copy: '©',
  ordf: 'ª', laquo: '«', not: '¬', shy: '­', reg: '®', macr: '¯', deg: '°',
  plusmn: '±', sup2: '²', sup3: '³', acute: '´', micro: 'µ', para: '¶', middot: '·',
  cedil: '¸', sup1: '¹', ordm: 'º', raquo: '»', frac14: '¼', frac12: '½', frac34: '¾',
  iquest: '¿', Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Auml: 'Ä', Aring: 'Å',
  AElig: 'Æ', Ccedil: 'Ç', Egrave: 'È', Eacute: 'É', Ecirc: 'Ê', Euml: 'Ë', Igrave: 'Ì',
  Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï', ETH: 'Ð', Ntilde: 'Ñ', Ograve: 'Ò', Oacute: 'Ó',
  Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö', times: '×', Oslash: 'Ø', Ugrave: 'Ù', Uacute: 'Ú',
  Ucirc: 'Û', Uuml: 'Ü', Yacute: 'Ý', THORN: 'Þ', szlig: 'ß', agrave: 'à', aacute: 'á',
  acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å', aelig: 'æ', ccedil: 'ç', egrave: 'è',
  eacute: 'é', ecirc: 'ê', euml: 'ë', igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  eth: 'ð', ntilde: 'ñ', ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö',
  divide: '÷', oslash: 'ø', ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü', yacute: 'ý',
  thorn: 'þ', yuml: 'ÿ', OElig: 'Œ', oelig: 'œ', Scaron: 'Š', scaron: 'š', Yuml: 'Ÿ',
  fnof: 'ƒ', circ: 'ˆ', tilde: '˜', Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ',
  Epsilon: 'Ε', Zeta: 'Ζ', Eta: 'Η', Theta: 'Θ', Iota: 'Ι', Kappa: 'Κ', Lambda: 'Λ',
  Mu: 'Μ', Nu: 'Ν', Xi: 'Ξ', Omicron: 'Ο', Pi: 'Π', Rho: 'Ρ', Sigma: 'Σ', Tau: 'Τ',
  Upsilon: 'Υ', Phi: 'Φ', Chi: 'Χ', Psi: 'Ψ', Omega: 'Ω', alpha: 'α', beta: 'β',
  gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι',
  kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', rho: 'ρ',
  sigmaf: 'ς', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', chi: 'χ', psi: 'ψ',
  omega: 'ω', thetasym: 'ϑ', upsih: 'ϒ', piv: 'ϖ', ensp: ' ', emsp: ' ',
  thinsp: ' ', zwnj: '‌', zwj: '‍', lrm: '‎', rlm: '‏', ndash: '–', mdash: '—',
  lsquo: '‘', rsquo: '’', sbquo: '‚', ldquo: '“', rdquo: '”', bdquo: '„',
  dagger: '†', Dagger: '‡', bull: '•', hellip: '…', permil: '‰', prime: '′',
  Prime: '″', oline: '‾', frasl: '⁄', euro: '€', image: 'ℑ', weierp: '℘',
  real: 'ℜ', trade: '™', alefsym: 'ℵ', larr: '←', uarr: '↑', rarr: '→', darr: '↓',
  harr: '↔', crarr: '↵', lArr: '⇐', uArr: '⇑', rArr: '⇒', dArr: '⇓', hArr: '⇔',
  forall: '∀', part: '∂', exist: '∃', empty: '∅', nabla: '∇', isin: '∈', notin: '∉',
  ni: '∋', prod: '∏', sum: '∑', minus: '−', lowast: '∗', radic: '√', prop: '∝',
  infin: '∞', ang: '∠', and: '∧', or: '∨', cap: '∩', cup: '∪', int: '∫', there4: '∴',
  sim: '∼', cong: '≅', asymp: '≈', ne: '≠', equiv: '≡', le: '≤', ge: '≥', sub: '⊂',
  sup: '⊃', nsub: '⊄', sube: '⊆', supe: '⊇', oplus: '⊕', otimes: '⊗', perp: '⊥',
  sdot: '⋅', lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋', lang: '〈', rang: '〉',
  loz: '◊', spades: '♠', clubs: '♣', hearts: '♥', diams: '♦', Tab: '\t', NewLine: '\n',
  colon: ':', sol: '/', bsol: '\\', semi: ';', equals: '=', comma: ',', period: '.',
  quest: '?', excl: '!', num: '#', dollar: '$', percnt: '%', ast: '*', plus: '+',
  hyphen: '-', dash: '‐',
};

// Decode one entity starting at s[i] === '&'. Returns [decoded, lengthConsumed] or null.
function decodeEntityAt(s, i) {
  if (s[i] !== '&') return null;
  const m = /^&#(?:[xX]([0-9a-fA-F]+)|([0-9]+));/.exec(s.slice(i));
  if (m) {
    let cp = m[1] ? parseInt(m[1], 16) : parseInt(m[2], 10);
    if (!cp || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) cp = 0xfffd;
    return [String.fromCodePoint(cp), m[0].length];
  }
  const m2 = /^&([A-Za-z][A-Za-z0-9]*);/.exec(s.slice(i));
  if (m2 && Object.prototype.hasOwnProperty.call(ENT, m2[1])) {
    return [ENT[m2[1]], m2[0].length];
  }
  return null;
}

export function decodeEntities(s) {
  if (!s.includes('&')) return s;
  let out = '';
  for (let i = 0; i < s.length;) {
    if (s[i] === '&') {
      const d = decodeEntityAt(s, i);
      if (d) { out += d[0]; i += d[1]; continue; }
    }
    out += s[i++];
  }
  return out;
}

const ASCII_PUNCT = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const UNI_PUNCT_RE = /[!-\/:-@\[-`{-~ ¡-¿×÷·‐‑‒–—―‘’‚“”„†‡•…‰′″‹›€™‑‗‘’‚‛“”„‟†‡•…‰‹›‼‾⁄⁅⁆⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞ ]/;
export function isPunct(ch) {
  if (!ch) return false;
  if (ch.length === 1 && ch.charCodeAt(0) < 128) return ASCII_PUNCT.includes(ch);
  return UNI_PUNCT_RE.test(ch);
}
const UNI_WS_RE = /[\s\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/;
export function isSpace(ch) { return !!ch && UNI_WS_RE.test(ch); }

// Column-aware indentation: tab advances to next multiple of 4.
export function indentOf(line) {
  let col = 0;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === ' ') col++;
    else if (c === '\t') col += 4 - (col % 4);
    else break;
  }
  return col;
}
// Strip n columns of indentation from line (a straddling tab becomes spaces).
export function stripIndent(line, n) {
  let col = 0, i = 0;
  while (i < line.length && col < n) {
    const c = line[i];
    if (c === ' ') { col++; i++; }
    else if (c === '\t') {
      const w = 4 - (col % 4);
      if (col + w <= n) { col += w; i++; }
      else { return ' '.repeat(col + w - n) + line.slice(i + 1); }
    } else break;
  }
  return line.slice(i);
}
// Remove exactly n columns from the start of a line (any chars count;
// a straddling tab becomes spaces). Used for list-item content, where the
// prefix includes the non-whitespace marker.
export function stripColumns(line, n) {
  let col = 0, i = 0;
  while (i < line.length && col < n) {
    const c = line[i];
    if (c === '\t') {
      const w = 4 - (col % 4);
      if (col + w <= n) { col += w; i++; }
      else { return ' '.repeat(col + w - n) + line.slice(i + 1); }
    } else { col++; i++; }
  }
  return line.slice(i);
}
// Content column of a list item, tab-aware. `lm` is the LIST_RE match.
function listContentCol(line, lm) {
  const lind = indentOf(line);
  const b = lm[1];
  const endCol = lind + b.length;
  if (!lm[3]) return endCol + 1;
  let c = endCol;
  for (const ch of lm[3]) {
    if (ch === '\t') c += 4 - (c % 4);
    else c++;
  }
  const sp = c - endCol;
  return endCol + (sp >= 5 ? 1 : sp);
}
export function ltrimWS(s) { return s.replace(/^[ \t]+/, ''); }
export function rtrimWS(s) { return s.replace(/[ \t]+$/, ''); }
export function isBlankLine(s) { return /^[ \t]*$/.test(s); }

const FOLD_EXTRA = { 'ß': 'ss', 'ẞ': 'ss', 'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st', 'µ': 'μ', 'ſ': 's', 'K': 'k' };
export function foldLabel(label) {
  let s = label.replace(/\s+/g, ' ').trim().toLowerCase();
  s = s.replace(/[ßẞﬀﬁﬂﬃﬄﬅﬆµſK]/g, (c) => FOLD_EXTRA[c]);
  return s;
}

// ---------- link reference definitions ----------
// Try to parse a link reference definition starting at lines[i].
// Returns {consumed} (lines consumed) or null. Stores into refs (first wins).
function tryDef(lines, i, end, refs) {
  const first = lines[i];
  if (indentOf(first) > 3 || !first.startsWith('   '.slice(0, 0))) { /* fallthrough */ }
  const m = /^ {0,3}\[/.exec(first);
  if (!m) return null;
  const s = lines.slice(i, Math.min(i + 3, end)).join('\n');
  let p = m[0].length; // position just after '[' (counting the up-to-3 spaces)
  // find label end: unescaped ']'
  let label = '';
  let ok = false;
  for (; p < s.length; p++) {
    const c = s[p];
    if (c === '\\' && p + 1 < s.length) { label += s[p + 1]; p++; continue; }
    if (c === '[') return null;
    if (c === ']') { ok = true; break; }
    if (c === '\n') return null;
    label += c;
  }
  if (!ok || label.length === 0 || label.length > 999) return null;
  p++; // past ']'
  if (s[p] !== ':') return null;
  p++;
  // skip spaces/tabs and at most one newline
  const skipWS = () => {
    while (p < s.length && (s[p] === ' ' || s[p] === '\t')) p++;
    if (s[p] === '\n') { p++; while (p < s.length && (s[p] === ' ' || s[p] === '\t')) p++; }
  };
  skipWS();
  // destination
  let dest = '';
  let destEnd = -1;
  if (s[p] === '<') {
    let q = p + 1;
    let good = false;
    for (; q < s.length; q++) {
      const c = s[q];
      if (c === '\n') break;
      if (c === '\\' && q + 1 < s.length) { dest += s[q + 1]; q++; continue; }
      if (c === '>') { good = true; break; }
      if (c === '<') break;
      dest += c;
    }
    if (!good) return null;
    destEnd = q + 1;
  } else {
    let q = p, depth = 0, good = false;
    for (; q < s.length; q++) {
      const c = s[q];
      if (c === ' ' || c === '\t' || c === '\n' || c.charCodeAt(0) < 32) break;
      if (c === '\\' && q + 1 < s.length) { dest += s[q + 1]; q++; continue; }
      if (c === '(') depth++;
      else if (c === ')') { if (depth === 0) break; depth--; }
      dest += c;
    }
    if (dest.length === 0) return null;
    good = true;
    destEnd = q;
  }
  dest = decodeEntities(dest);
  p = destEnd;
  skipWS();
  // optional title
  let title = null;
  let titleEnd = p;
  if (s[p] === '"' || s[p] === "'" || s[p] === '(') {
    const open = s[p];
    const close = open === '(' ? ')' : open;
    let q = p + 1, t = '', good = false;
    for (; q < s.length; q++) {
      const c = s[q];
      if (c === '\\' && q + 1 < s.length) { t += s[q + 1]; q++; continue; }
      if (c === close) { good = true; break; }
      if (open === '(' && c === '(') break;
      t += c;
    }
    if (good) {
      title = decodeEntities(t);
      titleEnd = q + 1;
      p = titleEnd;
      // after title: only spaces/tabs then EOL
      while (p < s.length && (s[p] === ' ' || s[p] === '\t')) p++;
      if (p < s.length && s[p] !== '\n') return null;
    } else {
      // fallback: dest-only; consume through the dest's line
      p = destEnd;
    }
  } else {
    // no title: after dest only spaces/tabs then EOL
    while (p < s.length && (s[p] === ' ' || s[p] === '\t')) p++;
    if (p < s.length && s[p] !== '\n') return null;
  }
  // consumed lines = lines crossed up to p (p points at '\n' or end)
  let consumed = 1;
  for (let k = 0; k < p && k < s.length; k++) if (s[k] === '\n') consumed++;
  if (p >= s.length) consumed = s.split('\n').length;
  const key = foldLabel(label);
  if (!refs.has(key)) refs.set(key, { href: dest, title });
  return { consumed };
}

// ---------- tables (GFM) ----------
// Split a table row line into cells, code-span aware; `\|` is a literal pipe.
function splitCells(line) {
  const cells = [];
  let cur = '';
  let i = 0;
  const n = line.length;
  // strip one leading / trailing pipe (with surrounding spaces handled by trim)
  let s = line;
  const lead = /^[ \t]*\|/.exec(s);
  if (lead) s = s.slice(lead[0].length);
  const trail = /\|[ \t]*$/.exec(s);
  if (trail) s = s.slice(0, s.length - trail[0].length);
  while (i < s.length) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && s[i + 1] === '|') { cur += '|'; i += 2; continue; }
    if (c === '`') {
      // consume a backtick run and its content (pipes inside don't split)
      let j = i;
      while (j < s.length && s[j] === '`') j++;
      const run = j - i;
      let k = j, closed = -1;
      while (k < s.length) {
        if (s[k] === '`') {
          let e = k;
          while (e < s.length && s[e] === '`') e++;
          if (e - k === run) { closed = k; break; }
          k = e;
        } else k++;
      }
      if (closed >= 0) { cur += s.slice(i, closed + run); i = closed + run; continue; }
      cur += s.slice(i, j); i = j; continue;
    }
    if (c === '|') { cells.push(cur.trim()); cur = ''; i++; continue; }
    cur += c; i++;
  }
  cells.push(cur.trim());
  return cells;
}
function parseDelimRow(line) {
  const cells = splitCells(line);
  if (cells.length === 0) return null;
  const aligns = [];
  for (const cell of cells) {
    const c = cell.trim();
    if (!/^:?-{1,}:?$/.test(c)) return null;
    const left = c.startsWith(':');
    const right = c.endsWith(':');
    aligns.push(left && right ? 'center' : left ? 'left' : right ? 'right' : null);
  }
  return aligns;
}

// ---------- block lexer ----------
const BLOCK_TAGS = new Set(('address article aside base basefont blockquote body caption center col colgroup dd details dialog dir div dl dt fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html iframe legend li link main menu menuitem nav noframes ol optgroup option p param search section summary table tbody td tfoot th thead title tr track ul').split(' '));

function stripX00(l) { return l.replace(/^\x00+/, ''); }

function htmlBlockStart(content) {
  if (!content.startsWith('<')) return null;
  let m = /^<(script|pre|style|textarea)([\s>\/]|$)/i.exec(content);
  if (m) return { type: 1, endRe: new RegExp('</' + m[1].toLowerCase() + '\\s*>', 'i') };
  if (/^<!--/.test(content)) return { type: 2, endRe: /-->/ };
  if (/^<\?/.test(content)) return { type: 3, endRe: /\?>/ };
  if (/^<![A-Za-z]/.test(content)) return { type: 4, endRe: />/ };
  if (/^<!\[CDATA\[/.test(content)) return { type: 5, endRe: /\]\]>/ };
  m = /^<\/?([A-Za-z][A-Za-z0-9-]*)([\s>\/]|$)/i.exec(content);
  if (m && BLOCK_TAGS.has(m[1].toLowerCase())) return { type: 6, endRe: null };
  if (/^<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^>]*)?\/?>[ \t]*$/.test(content)) return { type: 7, endRe: null };
  return null;
}

const HR_RE = /^(?:\*[ \t]*){3,}$|^(?:-[ \t]*){3,}$|^(?:_[ \t]*){3,}$/;
const SETEXT_RE = /^ {0,3}(=+|-+)[ \t]*$/;
const LIST_RE = /^ {0,3}((?:[-+*])|(?:\d{1,9})([.)]))(?:([ \t]+)|[ \t]*$)/;

function lexParagraph(textLines) {
  const text = textLines.join('\n');
  return { t: 'p', text };
}

function gatherFence(lines, i, end) {
  const raw = stripX00(lines[i]);
  const ind = indentOf(raw);
  const m = /^(`{3,}|~{3,})(.*)$/.exec(stripIndent(raw, Math.min(ind, 3)));
  const ch = m[1][0], len = m[1].length;
  const lang = (m[2].trim().split(/[ \t]+/)[0] || '');
  const fenceInd = Math.min(ind, 3);
  const out = [];
  let j = i + 1;
  while (j < end) {
    const l = stripX00(lines[j]);
    const cm = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(l);
    if (cm && cm[1][0] === ch && cm[1].length >= len) { j++; break; }
    out.push(stripIndent(l, fenceInd));
    j++;
  }
  return { lang, text: out.length ? out.join('\n') + '\n' : '', next: j };
}

function gatherIndented(lines, i, end) {
  const out = [];
  let j = i;
  while (j < end) {
    const l = stripX00(lines[j]);
    if (isBlankLine(l)) {
      let k = j + 1;
      while (k < end && isBlankLine(stripX00(lines[k]))) k++;
      if (k < end && indentOf(stripX00(lines[k])) >= 4) { out.push(''); j++; continue; }
      break;
    }
    if (indentOf(l) >= 4) { out.push(stripIndent(l, 4)); j++; continue; }
    break;
  }
  return { text: out.length ? out.join('\n') + '\n' : '', next: j };
}

// Count items of a list starting at lines[i] (for the ordered-start!=1 interrupt rule).
function countItemsAhead(lines, i, end) {
  const first = lines[i];
  const m = LIST_RE.exec(first);
  if (!m) return 0;
  const baseInd = indentOf(first);
  const bullet = m[1];
  const isOrdered = !!m[2];
  const contentCol = listContentCol(first, m);
  let count = 0;
  let j = i;
  while (j < end) {
    const l = stripX00(lines[j]);
    if (isBlankLine(l)) { j++; continue; }
    const lm = LIST_RE.exec(l);
    if (lm && indentOf(l) === baseInd) {
      const b2 = lm[1];
      const sameType = isOrdered ? !!lm[2] && lm[2] === m[2] : !lm[2] && b2 === bullet;
      if (!sameType) break;
      count++;
      j++;
      continue;
    }
    if (indentOf(l) >= contentCol) { j++; continue; }
    break;
  }
  return count;
}

function lexBlocks(lines, start, end, refs, atDocEnd, srcEndsNL, depth) {
  if ((depth || 0) > 25) return { tokens: [], sawBlankBetween: false };
  const tokens = [];
  let sawBlankBetween = false;
  let blankPending = false;
  let i = start;
  let para = null;
  const flushPara = () => {
    if (!para) return;
    tokens.push(lexParagraph(para));
    noteToken();
    para = null;
  };
  const noteToken = () => {
    if (blankPending && tokens.length > 0) sawBlankBetween = true;
    blankPending = false;
  };
  while (i < end) {
    const rawLine = lines[i];
    const lazy = rawLine.startsWith('\x00');
    const raw = stripX00(rawLine);
    if (isBlankLine(raw)) {
      flushPara();
      blankPending = true;
      i++;
      continue;
    }
    const ind = indentOf(raw);
    const content = stripIndent(raw, Math.min(ind, 3));
    // setext underline (paragraph only, checked before hr/list)
    if (para) {
      const sm = SETEXT_RE.exec(raw);
      if (sm) {
        const text = para.join('\n');
        tokens.push({ t: 'h', level: sm[1][0] === '=' ? 1 : 2, text });
        noteToken();
        para = null;
        i++;
        continue;
      }
    }
    if (!lazy) {
      // ATX heading
      const atx = /^(#{1,6})(?:[ \t]+(.*?)|[ \t]*)$/.exec(content);
      if (atx) {
        flushPara();
        let text = (atx[2] ?? '').replace(/[ \t]+$/, '');
        if (/^#+$/.test(text)) text = '';
        else text = text.replace(/[ \t]+#+$/, '');
        tokens.push({ t: 'h', level: atx[1].length, text });
        noteToken();
        i++;
        continue;
      }
      // fenced code
      const fm = /^(`{3,}|~{3,})(.*)$/.exec(content);
      if (fm && (fm[1][0] === '~' || !fm[2].includes('`'))) {
        flushPara();
        const f = gatherFence(lines, i, end);
        tokens.push({ t: 'code', text: f.text, lang: f.lang });
        noteToken();
        i = f.next;
        continue;
      }
      // HTML block (types 1-6 can interrupt a paragraph; type 7 only when no paragraph)
      const hb = htmlBlockStart(content);
      if (hb && (hb.type !== 7 || !para)) {
        flushPara();
        let j = i;
        let text;
        if (hb.endRe) {
          while (j < end) {
            if (hb.endRe.test(stripX00(lines[j]))) { j++; break; }
            j++;
          }
          const body = [];
          for (let k = i; k < j; k++) body.push(stripX00(lines[k]));
          text = body.join('\n');
          const restBlank = lines.slice(j, end).every((l) => isBlankLine(stripX00(l)));
          if ((j < end && lines[j] !== '') || (atDocEnd && srcEndsNL && restBlank)) text += '\n';
        } else {
          while (j < end && !isBlankLine(stripX00(lines[j]))) j++;
          const body = [];
          for (let k = i; k < j; k++) body.push(stripX00(lines[k]));
          text = body.join('\n');
          const restBlank = lines.slice(j, end).every((l) => isBlankLine(stripX00(l)));
          if (atDocEnd && srcEndsNL && restBlank) text += '\n';
        }
        tokens.push({ t: 'html', text });
        noteToken();
        i = j;
        continue;
      }
      // thematic break
      if (HR_RE.test(content)) {
        flushPara();
        tokens.push({ t: 'hr' });
        noteToken();
        i++;
        continue;
      }
      // blockquote
      if (/^ {0,3}>/.test(raw)) {
        flushPara();
        const g = gatherQuote(lines, i, end, atDocEnd, srcEndsNL);
        const inner = lexBlocks(g.inner, 0, g.inner.length, refs, g.atDocEnd, srcEndsNL, (depth || 0) + 1);
        tokens.push({ t: 'quote', tokens: inner.tokens });
        noteToken();
        i = g.next;
        continue;
      }
      // list
      const lm = LIST_RE.exec(raw);
      if (lm) {
        const isOrdered = !!lm[2];
        const startNum = isOrdered ? parseInt(lm[1], 10) : null;
        let canInterrupt = true;
        if (para && isOrdered && startNum !== 1) {
          canInterrupt = countItemsAhead(lines, i, end) >= 2;
        }
        if (canInterrupt) {
          flushPara();
          const g = gatherList(lines, i, end, refs);
          const items = g.items.map((it) => {
            const inner = lexBlocks(it.lines, 0, it.lines.length, refs, false, srcEndsNL, (depth || 0) + 1);
            return { tokens: inner.tokens, loose: inner.sawBlankBetween };
          });
          const loose = g.blankBetweenItems || items.some((it) => it.loose);
          tokens.push({ t: 'list', ordered: isOrdered, start: startNum, tight: !loose, items });
          noteToken();
          i = g.next;
          continue;
        }
      }
      // indented code (never interrupts a paragraph)
      if (!para && ind >= 4) {
        const g = gatherIndented(lines, i, end);
        tokens.push({ t: 'code', text: g.text, lang: '' });
        noteToken();
        i = g.next;
        continue;
      }
      // link reference definitions (only at paragraph start)
      if (!para) {
        const d = tryDef(lines, i, end, refs);
        if (d) { i += d.consumed; continue; }
        // table?
        if (i + 1 < end && indentOf(lines[i + 1]) <= 3) {
          const aligns = parseDelimRow(lines[i + 1]);
          if (aligns) {
            const header = splitCells(lines[i]);
            if (header.length === aligns.length && (lines[i].includes('|') || lines[i + 1].includes('|'))) {
              const rows = [];
              let j = i + 2;
              while (j < end && !isBlankLine(stripX00(lines[j]))) {
                const rl = stripX00(lines[j]);
                const rc = stripIndent(rl, Math.min(indentOf(rl), 3));
                if (/^(#{1,6})(?:[ \t]+|[ \t]*$)/.test(rc) || /^(`{3,}|~{3,})/.test(rc) || HR_RE.test(rc) || /^ {0,3}>/.test(rl) || LIST_RE.test(rl) || htmlBlockStart(rc)) break;
                const cells = splitCells(rl);
                while (cells.length < header.length) cells.push('');
                rows.push(cells.slice(0, header.length));
                j++;
              }
              tokens.push({ t: 'table', header, aligns, rows });
              noteToken();
              i = j;
              continue;
            }
          }
        }
      }
    }
    // paragraph line
    if (!para) { para = []; blankPending = false; }
    para.push(ltrimWS(raw));
    i++;
  }
  flushPara();
  return { tokens, sawBlankBetween };
}

// A lazy continuation line must be plain paragraph text: if it starts a block
// that can interrupt a paragraph (ATX, fence, HR, HTML 1-6, quote, list) it
// ends the quote instead. Setext underlines stay lazy (they belong to the
// open paragraph).
function isLazyBlockStart(lines, j, end) {
  const raw = stripX00(lines[j]);
  if (isBlankLine(raw)) return false;
  const ind = indentOf(raw);
  const content = stripIndent(raw, Math.min(ind, 3));
  if (/^(#{1,6})(?:[ \t]+|[ \t]*$)/.test(content)) return true;
  const fm = /^(`{3,}|~{3,})(.*)$/.exec(content);
  if (fm && (fm[1][0] === '~' || !fm[2].includes('`'))) return true;
  const hb = htmlBlockStart(content);
  if (hb && hb.type !== 7) return true;
  if (HR_RE.test(content) && !SETEXT_RE.test(raw)) return true;
  if (/^ {0,3}>/.test(raw)) return true;
  const lm = LIST_RE.exec(raw);
  if (lm) {
    if (!lm[2]) return true;
    const startNum = parseInt(lm[1], 10);
    if (startNum === 1) return true;
    return countItemsAhead(lines, j, end) >= 2;
  }
  return false;
}

function gatherQuote(lines, i, end, atDocEnd) {
  const inner = [];
  let j = i;
  while (j < end) {
    const line = lines[j];
    const m = /^ {0,3}>[ \t]?/.exec(line);
    if (m) { inner.push(line.slice(m[0].length)); j++; continue; }
    if (!isBlankLine(line) && inner.length && !isBlankLine(inner[inner.length - 1]) && !isLazyBlockStart(lines, j, end)) {
      inner.push('\x00' + line);
      j++;
      continue;
    }
    break;
  }
  return { inner, next: j, atDocEnd: atDocEnd && j >= end };
}

function gatherList(lines, i, end) {
  const first = lines[i];
  const m = LIST_RE.exec(first);
  const baseInd = indentOf(first);
  const bullet = m[1];
  const isOrdered = !!m[2];
  const delim = m[2] || null;
  const items = [];
  let blankBetweenItems = false;
  let j = i;
  let cur = null;
  let pendingBlanks = 0;
  const finishItem = () => {
    if (!cur) return;
    while (cur.lines.length && isBlankLine(cur.lines[cur.lines.length - 1])) cur.lines.pop();
    items.push(cur);
    cur = null;
  };
  const itemContentCol = (line, lm) => listContentCol(line, lm);
  while (j < end) {
    const rawL = lines[j];
    const l = stripX00(rawL);
    if (isBlankLine(l)) {
      if (cur) { cur.lines.push(''); pendingBlanks++; }
      j++;
      continue;
    }
    const lm = LIST_RE.exec(l);
    const lind = indentOf(l);
    if (lm && lind === baseInd) {
      const b2 = lm[1];
      const sameType = isOrdered ? (!!lm[2] && lm[2] === delim) : (!lm[2] && b2 === bullet);
      if (sameType) {
        if (cur) {
          if (pendingBlanks > 0) blankBetweenItems = true;
          finishItem();
        }
        pendingBlanks = 0;
        cur = { lines: [], contentCol: itemContentCol(l, lm) };
        const contentPart = stripColumns(l, cur.contentCol);
        if (contentPart !== '') cur.lines.push(contentPart);
        j++;
        continue;
      }
      break;
    }
    if (lm && lind < baseInd) {
      const b2 = lm[1];
      const sameType = isOrdered ? (lm[2] === delim) : (b2 === bullet);
      if (sameType) break;
    }
    if (cur) {
      if (lind >= cur.contentCol) {
        cur.lines.push(stripColumns(l, cur.contentCol));
        pendingBlanks = 0;
        j++;
        continue;
      }
      // marker below the content column = lazy paragraph text
      if (lm && cur.lines.length && !isBlankLine(cur.lines[cur.lines.length - 1])) {
        cur.lines.push('\x00' + l);
        pendingBlanks = 0;
        j++;
        continue;
      }
      break;
    }
    break;
  }
  if (cur) finishItem();
  return { items, blankBetweenItems, next: j };
}

// ---------- inline parsing ----------
function findLinkEnd(s, start) {
  let depth = 0;
  let i = start;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length) { i += 2; continue; }
    if (c === '`') {
      let j = i;
      while (j < s.length && s[j] === '`') j++;
      const run = j - i;
      let k = j, closed = -1;
      while (k < s.length) {
        if (s[k] === '`') {
          let e = k;
          while (e < s.length && s[e] === '`') e++;
          if (e - k === run) { closed = k; break; }
          k = e;
        } else k++;
      }
      if (closed < 0) return -1;
      i = closed + run;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return i; }
    i++;
  }
  return -1;
}

function parseLinkDest(s, i, allowEmpty) {
  if (s[i] === '<') {
    let dest = '';
    let j = i + 1;
    while (j < s.length) {
      const c = s[j];
      if (c === '\n') return null;
      if (c === '\\' && j + 1 < s.length) { dest += s[j + 1]; j += 2; continue; }
      if (c === '>') return { value: decodeEntities(dest), next: j + 1 };
      if (c === '<') return null;
      dest += c;
      j++;
    }
    return null;
  }
  if (allowEmpty && (i >= s.length || s[i] === ' ' || s[i] === '\t' || s[i] === '\n' || s[i] === ')')) {
    return { value: '', next: i };
  }
  let dest = '';
  let depth = 0;
  let j = i;
  while (j < s.length) {
    const c = s[j];
    if (c === ' ' || c === '\t' || c === '\n' || c.charCodeAt(0) < 32) break;
    if (c === '\\' && j + 1 < s.length) { dest += s[j + 1]; j += 2; continue; }
    if (c === '(') depth++;
    else if (c === ')') { if (depth === 0) break; depth--; }
    dest += c;
    j++;
  }
  if (dest.length === 0) return null;
  return { value: decodeEntities(dest), next: j };
}

function parseLinkTitle(s, i) {
  const open = s[i];
  if (open !== '"' && open !== "'" && open !== '(') return null;
  const close = open === '(' ? ')' : open;
  let t = '';
  let j = i + 1;
  while (j < s.length) {
    const c = s[j];
    if (c === '\\' && j + 1 < s.length) { t += s[j + 1]; j += 2; continue; }
    if (c === close) return { value: decodeEntities(t), next: j + 1 };
    if (open === '(' && c === '(') return null;
    t += c;
    j++;
  }
  return null;
}

function skipInlineWS(s, k) {
  while (k < s.length && (s[k] === ' ' || s[k] === '\t' || s[k] === '\n')) k++;
  return k;
}

function tryLink(s, i, refs) {
  const end = findLinkEnd(s, i);
  if (end < 0) return null;
  const label = s.slice(i + 1, end);
  let j = end + 1;
  if (s[j] === '(') {
    let k = skipInlineWS(s, j + 1);
    const dest = parseLinkDest(s, k, true);
    if (!dest) return null;
    k = skipInlineWS(s, dest.next);
    let title = null;
    if (s[k] === '"' || s[k] === "'" || s[k] === '(') {
      const t = parseLinkTitle(s, k);
      if (!t) return null;
      title = t.value;
      k = skipInlineWS(s, t.next);
    }
    if (s[k] !== ')') return null;
    return { href: dest.value, title, label, next: k + 1 };
  }
  if (s[j] === '[') {
    const end2 = findLinkEnd(s, j);
    if (end2 < 0) return null;
    const label2 = s.slice(j + 1, end2);
    if (label2 === '') {
      const ref = refs.get(foldLabel(label));
      if (!ref) return null;
      return { href: ref.href, title: ref.title, label, next: end2 + 1 };
    }
    const ref = refs.get(foldLabel(label2));
    if (!ref) return null;
    return { href: ref.href, title: ref.title, label, next: end2 + 1 };
  }
  const ref = refs.get(foldLabel(label));
  if (!ref) return null;
  return { href: ref.href, title: ref.title, label, next: end + 1 };
}

function matchHtmlInline(src, i) {
  const rest = src.slice(i);
  if (rest.startsWith('<!--')) {
    const e = rest.indexOf('-->');
    return e >= 0 ? rest.slice(0, e + 3) : null;
  }
  if (rest.startsWith('<?')) {
    const e = rest.indexOf('?>');
    return e >= 0 ? rest.slice(0, e + 2) : null;
  }
  if (rest.startsWith('<![CDATA[')) {
    const e = rest.indexOf(']]>');
    return e >= 0 ? rest.slice(0, e + 3) : null;
  }
  if (/^<![A-Za-z]/.test(rest)) {
    const e = rest.indexOf('>');
    return e >= 0 ? rest.slice(0, e + 1) : null;
  }
  let j = i + 1;
  let closing = false;
  if (src[j] === '/') { closing = true; j++; }
  if (!/[A-Za-z]/.test(src[j] || '')) return null;
  while (j < src.length && /[A-Za-z0-9-]/.test(src[j])) j++;
  if (closing) {
    while (j < src.length && (src[j] === ' ' || src[j] === '\t' || src[j] === '\n')) j++;
    if (src[j] === '>') return src.slice(i, j + 1);
    return null;
  }
  for (;;) {
    while (j < src.length && (src[j] === ' ' || src[j] === '\t' || src[j] === '\n')) j++;
    if (j >= src.length) return null;
    if (src[j] === '>') return src.slice(i, j + 1);
    if (src[j] === '/' && src[j + 1] === '>') return src.slice(i, j + 2);
    if (!/[A-Za-z_:]/.test(src[j])) return null;
    while (j < src.length && /[A-Za-z0-9_.:-]/.test(src[j])) j++;
    while (j < src.length && (src[j] === ' ' || src[j] === '\t' || src[j] === '\n')) j++;
    if (src[j] === '=') {
      j++;
      while (j < src.length && (src[j] === ' ' || src[j] === '\t' || src[j] === '\n')) j++;
      if (src[j] === '"' || src[j] === "'") {
        const q = src[j];
        j++;
        while (j < src.length && src[j] !== q) j++;
        if (j >= src.length) return null;
        j++;
      } else {
        if (j >= src.length) return null;
        const vs = j;
        while (j < src.length && !/[\s"'=<`>]/.test(src[j])) j++;
        if (j === vs) return null;
      }
    }
  }
}

function trimUrlTail(url) {
  let u = url;
  for (;;) {
    if (!u.length) break;
    const last = u[u.length - 1];
    if (last === ')') {
      let open = 0, close = 0;
      for (const ch of u) { if (ch === '(') open++; else if (ch === ')') close++; }
      if (close > open) { u = u.slice(0, -1); continue; }
      break;
    }
    if ('?!.,:;*_~\'"'.includes(last)) {
      if (last === ';') {
        const em = /&([A-Za-z][A-Za-z0-9]*|#[0-9]+|#[xX][0-9a-fA-F]+);$/.exec(u);
        if (em && (em[1].startsWith('#') || Object.prototype.hasOwnProperty.call(ENT, em[1]))) break;
      }
      u = u.slice(0, -1);
      continue;
    }
    break;
  }
  return u;
}

function tryExtendedAutolink(src, i, prev) {
  const boundary = prev === undefined || isSpace(prev) || '*_(<["\'!?;:,'.includes(prev);
  if (!boundary) return null;
  if (src.startsWith('www.', i)) {
    const m = /^www\.[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+(?:[/?#][^\s<\\]*)?/.exec(src.slice(i));
    if (m) {
      const url = trimUrlTail(m[0]);
      if (url.length > 4) return { href: 'http://' + url, text: url, next: i + url.length };
    }
    return null;
  }
  const em = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}/.exec(src.slice(i));
  if (em) {
    const after = src[i + em[0].length];
    if (after === '-' || after === '_') return null;
    return { href: 'mailto:' + em[0], text: em[0], next: i + em[0].length };
  }
  const sm = /^[A-Za-z][A-Za-z0-9+.-]{1,31}:\/\/[^\s<\\]+/.exec(src.slice(i));
  if (sm) {
    const url = trimUrlTail(sm[0]);
    return { href: url, text: url, next: i + url.length };
  }
  return null;
}

function stripTags(html) { return html.replace(/<[^>]*>/g, ''); }

function tokenizeInline(src, refs) {
  const nodes = [];
  let text = '';
  const pushText = () => { if (text) { nodes.push({ t: 'text', s: text }); text = ''; } };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      const n = src[i + 1];
      if (n === '\n') { pushText(); nodes.push({ t: 'br' }); i += 2; continue; }
      if (n && isPunct(n)) { text += n; i += 2; continue; }
      text += '\\'; i++; continue;
    }
    if (c === '`') {
      let j = i;
      while (j < src.length && src[j] === '`') j++;
      const run = j - i;
      let k = j, closed = -1;
      while (k < src.length) {
        if (src[k] === '`') {
          let e = k;
          while (e < src.length && src[e] === '`') e++;
          if (e - k === run) { closed = k; break; }
          k = e;
        } else k++;
      }
      if (closed < 0) { text += '`'.repeat(run); i = j; continue; }
      let content = src.slice(j, closed).replace(/\n/g, ' ');
      if (content.length >= 2 && content[0] === ' ' && content[content.length - 1] === ' ' && /[^ ]/.test(content)) {
        content = content.slice(1, -1);
      }
      pushText();
      nodes.push({ t: 'code', s: content });
      i = closed + run;
      continue;
    }
    if ((c === '!' && src[i + 1] === '[') || c === '[') {
      const isImg = c === '!';
      const r = tryLink(src, isImg ? i + 1 : i, refs);
      if (r) {
        pushText();
        const children = processEmphasis(tokenizeInline(r.label, refs));
        if (isImg) {
          const alt = stripTags(renderNodes(children)).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          nodes.push({ t: 'img', src: r.href, title: r.title, alt });
        } else {
          nodes.push({ t: 'link', href: r.href, title: r.title, children });
        }
        i = r.next;
        continue;
      }
      text += c;
      i++;
      continue;
    }
    if (c === '<') {
      const am = /^<([A-Za-z][A-Za-z0-9+.-]{1,31}:[^<>\s]*)>/.exec(src.slice(i));
      if (am) {
        pushText();
        nodes.push({ t: 'link', href: am[1], title: null, children: [{ t: 'text', s: am[1] }] });
        i += am[0].length;
        continue;
      }
      const em = /^<([A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*)>/.exec(src.slice(i));
      if (em) {
        pushText();
        nodes.push({ t: 'link', href: 'mailto:' + em[1], title: null, children: [{ t: 'text', s: em[1] }] });
        i += em[0].length;
        continue;
      }
      const hm = matchHtmlInline(src, i);
      if (hm) {
        pushText();
        nodes.push({ t: 'html', s: hm });
        i += hm.length;
        continue;
      }
      text += '<';
      i++;
      continue;
    }
    if (c === '&') {
      const d = decodeEntityAt(src, i);
      if (d) { text += d[0]; i += d[1]; continue; }
      text += '&';
      i++;
      continue;
    }
    if (c === '*' || c === '_' || c === '~') {
      let j = i;
      while (j < src.length && src[j] === c) j++;
      const len = j - i;
      const prev = i > 0 ? src[i - 1] : undefined;
      const next = j < src.length ? src[j] : undefined;
      const prevIsWS = prev === undefined || isSpace(prev);
      const nextIsWS = next === undefined || isSpace(next);
      const prevIsPunct = prev !== undefined && isPunct(prev);
      const nextIsPunct = next !== undefined && isPunct(next);
      const leftFlanking = !nextIsWS && (!nextIsPunct || prevIsWS || prevIsPunct);
      const rightFlanking = !prevIsWS && (!prevIsPunct || nextIsWS || nextIsPunct);
      const canOpen = leftFlanking && (!rightFlanking || prevIsPunct);
      const canClose = rightFlanking && (!leftFlanking || nextIsPunct);
      pushText();
      nodes.push({ t: 'delim', ch: c, len, canOpen, canClose });
      i = j;
      continue;
    }
    if (c === '\n') {
      let sp = 0;
      while (text.endsWith(' ')) { text = text.slice(0, -1); sp++; }
      if (sp >= 2) { pushText(); nodes.push({ t: 'br' }); }
      else text += '\n';
      i++;
      continue;
    }
    if (c === 'w' || /[A-Za-z]/.test(c)) {
      const prev = i > 0 ? src[i - 1] : undefined;
      const ea = tryExtendedAutolink(src, i, prev);
      if (ea) {
        pushText();
        nodes.push({ t: 'link', href: ea.href, title: null, children: [{ t: 'text', s: ea.text }] });
        i = ea.next;
        continue;
      }
    }
    text += c;
    i++;
  }
  pushText();
  return nodes;
}

function processEmphasis(nodes) {
  const delims = nodes.filter((n) => n.t === 'delim');
  let di = 0;
  while (di < delims.length) {
    const closer = delims[di];
    if (!closer.canClose || closer.len === 0) { di++; continue; }
    let matched = false;
    for (let oi = di - 1; oi >= 0; oi--) {
      const opener = delims[oi];
      if (opener.len === 0 || !opener.canOpen) continue;
      if (opener.ch !== closer.ch) continue;
      if (opener.ch !== '~' && opener.canClose && closer.canOpen && (opener.len + closer.len) % 3 === 0) continue;
      if (opener.ch === '~' && (opener.len < 2 || closer.len < 2)) continue;
      const use = opener.ch === '~' ? 2 : (opener.len >= 2 && closer.len >= 2 ? 2 : 1);
      const oiIdx = nodes.indexOf(opener);
      const ciIdx = nodes.indexOf(closer);
      const inner = nodes.slice(oiIdx + 1, ciIdx);
      const wrapped = { t: opener.ch === '~' ? 'del' : (use === 2 ? 'strong' : 'em'), children: inner };
      opener.len -= use;
      closer.len -= use;
      const rep = [];
      if (opener.len > 0) rep.push(opener);
      rep.push(wrapped);
      if (closer.len > 0) rep.push(closer);
      nodes.splice(oiIdx, ciIdx - oiIdx + 1, ...rep);
      if (opener.len === 0) delims.splice(oi, 1);
      if (closer.len === 0) delims.splice(delims.indexOf(closer), 1);
      matched = true;
      break;
    }
    if (matched) { di = 0; continue; }
    di++;
  }
  return nodes;
}

function renderNodes(nodes) {
  let out = '';
  for (const n of nodes) {
    switch (n.t) {
      case 'text': out += escape(n.s); break;
      case 'code': out += '<code>' + escape(n.s) + '</code>'; break;
      case 'html': out += n.s; break;
      case 'br': out += '<br>\n'; break;
      case 'delim': out += escape(n.ch.repeat(n.len)); break;
      case 'link': {
        out += '<a href="' + escape(n.href, true) + '"';
        if (n.title != null) out += ' title="' + escape(n.title, true) + '"';
        out += '>' + renderNodes(n.children) + '</a>';
        break;
      }
      case 'img': {
        out += '<img src="' + escape(n.src, true) + '" alt="' + n.alt + '"';
        if (n.title != null) out += ' title="' + escape(n.title, true) + '"';
        out += '>';
        break;
      }
      case 'em': out += '<em>' + renderNodes(n.children) + '</em>'; break;
      case 'strong': out += '<strong>' + renderNodes(n.children) + '</strong>'; break;
      case 'del': out += '<del>' + renderNodes(n.children) + '</del>'; break;
    }
  }
  return out;
}

export function parseInline(src, refs) {
  return renderNodes(processEmphasis(tokenizeInline(src, refs)));
}

// ---------- rendering ----------
function renderTokens(tokens, refs) {
  let out = '';
  for (const tok of tokens) {
    switch (tok.t) {
      case 'p':
        out += '<p>' + parseInline(tok.text, refs) + '</p>\n';
        break;
      case 'h':
        out += '<h' + tok.level + '>' + parseInline(tok.text, refs) + '</h' + tok.level + '>\n';
        break;
      case 'code': {
        const lang = tok.lang ? ' class="language-' + escape(tok.lang, true) + '"' : '';
        out += '<pre><code' + lang + '>' + escape(tok.text) + '</code></pre>\n';
        break;
      }
      case 'hr':
        out += '<hr>\n';
        break;
      case 'quote':
        out += '<blockquote>\n' + renderTokens(tok.tokens, refs) + '</blockquote>\n';
        break;
      case 'html':
        out += tok.text;
        break;
      case 'table': {
        out += '<table>\n<thead>\n<tr>\n';
        for (let i = 0; i < tok.header.length; i++) {
          const a = tok.aligns[i];
          out += '<th' + (a ? ' align="' + a + '"' : '') + '>' + parseInline(tok.header[i], refs) + '</th>\n';
        }
        out += '</tr>\n</thead>\n<tbody>\n';
        for (const row of tok.rows) {
          out += '<tr>\n';
          for (let i = 0; i < row.length; i++) {
            const a = tok.aligns[i];
            out += '<td' + (a ? ' align="' + a + '"' : '') + '>' + parseInline(row[i], refs) + '</td>\n';
          }
          out += '</tr>\n';
        }
        out += '</tbody>\n</table>\n';
        break;
      }
      case 'list': {
        const tag = tok.ordered ? 'ol' : 'ul';
        const startAttr = tok.ordered && tok.start !== 1 ? ' start="' + tok.start + '"' : '';
        out += '<' + tag + startAttr + '>\n';
        for (const item of tok.items) {
          let itemTokens = item.tokens;
          let taskHtml = '';
          if (itemTokens.length && itemTokens[0].t === 'p') {
            const first = itemTokens[0].text;
            const m = /^\[( |x|X)\] (.*)$/s.exec(first);
            const m2 = /^\[( |x|X)\]$/.exec(first);
            if (m || m2) {
              const checked = ((m ? m[1] : m2[1]) || ' ').toLowerCase() === 'x';
              taskHtml = '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox">';
              itemTokens = [{ t: 'p', text: m ? m[2] : '' }, ...itemTokens.slice(1)];
            }
          }
          if (tok.tight) {
            let inner = '';
            let firstTok = true;
            for (const it of itemTokens) {
              if (it.t === 'p') {
                inner += (firstTok && taskHtml ? taskHtml : '') + parseInline(it.text, refs) + '\n';
              } else {
                inner += renderTokens([it], refs);
              }
              firstTok = false;
            }
            if (inner.endsWith('\n')) inner = inner.slice(0, -1);
            out += '<li>' + inner + '</li>\n';
          } else {
            let inner = '';
            let firstTok = true;
            for (const it of itemTokens) {
              if (it.t === 'p') {
                inner += '<p>' + (firstTok && taskHtml ? taskHtml : '') + parseInline(it.text, refs) + '</p>\n';
              } else {
                inner += renderTokens([it], refs);
              }
              firstTok = false;
            }
            out += '<li>' + inner + '</li>\n';
          }
        }
        out += '</' + tag + '>\n';
        break;
      }
    }
  }
  return out;
}

export function parse(src) {
  src = src.replace(/\r\n?/g, '\n');
  const srcEndsNL = src.endsWith('\n');
  const lines = src.split('\n');
  const refs = new Map();
  const { tokens } = lexBlocks(lines, 0, lines.length, refs, true, srcEndsNL);
  return renderTokens(tokens, refs);
}
