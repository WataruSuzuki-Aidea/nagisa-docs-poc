const base = 'http://localhost:4399/pagefind/';
const src = await (await fetch(base + 'pagefind.js')).text();
const url = 'data:text/javascript;base64,' + Buffer.from(src).toString('base64');
const pf = await import(url);
await pf.options({ basePath: base });
await pf.init();
for (const q of process.argv.slice(2)) {
  const r = await pf.search(q);
  const data = await Promise.all(r.results.slice(0, 5).map((x) => x.data()));
  console.log(`「${q}」: ${r.results.length} 件`, data.map((d) => d.url).join(' '));
}
process.exit(0);
