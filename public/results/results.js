// Community results: reads the public eval_scores table of the BOAR project (Supabase) and
// lets people sort and filter it. The publishable key is meant to be public: it can only read
// this table (row level security keeps the raw runs closed). See the app's docs/RESULTS_SCORE.md.
(function () {
  const SUPABASE_URL = "https://glyypeuyyqyfpmyvkzas.supabase.co";
  const PUBLISHABLE_KEY = "sb_publishable_9gpuRv-drQrjo9h51-hQ4Q_Ud1_uc2n";
  const COLUMNS = [
    "received_at", "device_brand", "device_model", "soc", "soc_manufacturer", "ram_bytes", "cpu_cores",
    "cpu_max_mhz", "has_i8mm", "has_dotprod", "app_version", "model_id", "model_label", "answers",
    "completed", "retrieval_questions", "retrieval_hits", "median_tok_per_sec", "median_ttft_ms",
    "median_total_ms", "peak_rss_bytes", "score",
  ].join(",");

  const $ = (id) => document.getElementById(id);
  const status = $("status");
  const table = $("table");
  const tbody = $("rows");
  const q = $("q");
  const sortSelect = $("sort");
  let rows = [];
  let sort = { key: "score", dir: "desc" };

  const GB = 1024 ** 3;
  const fmt = {
    gb: (b) => (b ? `${(b / GB).toFixed(1)} GB` : "—"),
    ramGb: (b) => (b ? `${Math.round(b / GB)} GB` : "—"),
    secs: (ms) => (ms == null ? "—" : `${(ms / 1000).toFixed(1)} s`),
    rate: (x) => (x == null ? "—" : x.toFixed(1)),
    date: (iso) => new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
  };

  // Sort keys: a number (or string) per row; missing values always sort last.
  const value = {
    model: (r) => (r.model_label || r.model_id || "").toLowerCase(),
    score: (r) => r.score,
    tok: (r) => r.median_tok_per_sec,
    ttft: (r) => r.median_ttft_ms,
    total: (r) => r.median_total_ms,
    peak: (r) => r.peak_rss_bytes,
    done: (r) => (r.answers ? r.completed / r.answers : null),
    sources: (r) => (r.retrieval_questions ? r.retrieval_hits / r.retrieval_questions : null),
    phone: (r) => phone(r).toLowerCase(),
    chip: (r) => chip(r).toLowerCase(),
    cpu: (r) => r.cpu_max_mhz,
    ram: (r) => r.ram_bytes,
    date: (r) => Date.parse(r.received_at),
  };

  const phone = (r) => [r.device_brand, r.device_model].filter(Boolean).join(" ") || "Unknown phone";
  const chip = (r) => [r.soc_manufacturer, r.soc].filter(Boolean).join(" ") || "—";
  function cpu(r) {
    const parts = [];
    if (r.cpu_cores) parts.push(`${r.cpu_cores} cores`);
    if (r.cpu_max_mhz) parts.push(`up to ${(r.cpu_max_mhz / 1000).toFixed(2)} GHz`);
    const flags = [r.has_i8mm && "i8mm", r.has_dotprod && "dotprod"].filter(Boolean);
    if (flags.length) parts.push(flags.join(" + "));
    return parts.join(" · ") || "—";
  }

  // Column names, for the labels each cell shows when the table becomes cards on narrow screens.
  const LABELS = Object.fromEntries([...table.tHead.rows[0].cells].map((th) => [th.dataset.key, th.textContent.trim()]));

  function cell(key, text, cls) {
    const td = document.createElement("td");
    td.textContent = text;
    td.dataset.label = LABELS[key];
    if (cls) td.className = cls;
    return td;
  }

  // The phone on one line with its RAM, its chipset and CPU below: what "phones like yours" is about.
  function phoneCell(r) {
    const td = cell("phone", "", "phone wide");
    const name = document.createElement("span");
    name.textContent = r.ram_bytes ? `${phone(r)} · ${fmt.ramGb(r.ram_bytes)}` : phone(r);
    const hw = document.createElement("span");
    hw.className = "hw";
    hw.textContent = [chip(r), cpu(r)].filter((x) => x !== "—").join(" · ") || "—";
    td.append(name, hw);
    return td;
  }

  function render() {
    const needle = q.value.trim().toLowerCase();
    const shown = rows
      .filter((r) => !needle || [phone(r), chip(r), r.model_label, r.model_id, r.app_version].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => {
        const va = value[sort.key](a);
        const vb = value[sort.key](b);
        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;
        const c = va < vb ? -1 : va > vb ? 1 : 0;
        return sort.dir === "asc" ? c : -c;
      });

    tbody.replaceChildren(
      ...shown.map((r) => {
        const tr = document.createElement("tr");
        const score = cell("score", String(r.score), "num score");
        score.style.setProperty("--pct", `${r.score}%`);
        tr.append(
          cell("model", r.model_label || r.model_id || "—", "model"),
          score,
          cell("tok", fmt.rate(r.median_tok_per_sec), "num"),
          cell("ttft", fmt.secs(r.median_ttft_ms), "num"),
          cell("total", fmt.secs(r.median_total_ms), "num"),
          cell("peak", fmt.gb(r.peak_rss_bytes), "num"),
          cell("done", `${r.completed}/${r.answers}`, "num"),
          cell("sources", r.retrieval_questions ? `${r.retrieval_hits}/${r.retrieval_questions}` : "—", "num"),
          phoneCell(r),
          cell("date", fmt.date(r.received_at))
        );
        return tr;
      })
    );

    for (const th of table.tHead.rows[0].cells) {
      th.setAttribute("aria-sort", th.dataset.key === sort.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none");
    }
    const phones = new Set(rows.map((r) => `${phone(r)}|${chip(r)}`)).size;
    status.textContent =
      shown.length === rows.length
        ? `${rows.length} result${rows.length === 1 ? "" : "s"} from ${phones} phone model${phones === 1 ? "" : "s"}.`
        : `${shown.length} of ${rows.length} results match “${q.value.trim()}”.`;
  }

  function setSort(key, dir) {
    sort = { key, dir };
    const option = `${key}:${dir}`;
    if ([...sortSelect.options].some((o) => o.value === option)) sortSelect.value = option;
    render();
  }

  // Column headers sort too; a second click flips the direction.
  for (const th of table.tHead.rows[0].cells) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = th.textContent;
    th.replaceChildren(button);
    button.addEventListener("click", () => {
      const key = th.dataset.key;
      const lowerIsBetter = ["ttft", "total", "peak"].includes(key);
      const textual = ["model", "phone"].includes(key);
      const first = lowerIsBetter || textual ? "asc" : "desc";
      setSort(key, sort.key === key ? (sort.dir === "asc" ? "desc" : "asc") : first);
    });
  }
  sortSelect.addEventListener("change", () => {
    const [key, dir] = sortSelect.value.split(":");
    setSort(key, dir);
  });
  q.addEventListener("input", render);

  fetch(`${SUPABASE_URL}/rest/v1/eval_scores?select=${COLUMNS}&order=received_at.desc&limit=1000`, {
    headers: { apikey: PUBLISHABLE_KEY },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      rows = data;
      if (rows.length === 0) {
        status.textContent = "No shared results yet. Run an evaluation in the BOAR app and press Share results.";
        return;
      }
      table.hidden = false;
      render();
    })
    .catch((e) => {
      status.textContent = `Couldn't load the results (${e.message}). Try again in a moment.`;
    });
})();
