import Link from "next/link";

async function fetchCount(path: string) {
  try {
    const res = await fetch(path);
    if (!res.ok) return { count: 0, ok: false };
    const json = await res.json();
    // Frappe resource endpoints return { data: [...] }
    const data = json?.data ?? [];
    return { count: Array.isArray(data) ? data.length : 0, ok: true };
  } catch (err) {
    console.error("fetchCount error", err);
    return { count: 0, ok: false };
  }
}

export default async function Home() {
  const [items, groups, uoms, customers, suppliers] = await Promise.all([
    fetchCount("/api/stockItem"),
    fetchCount("/api/stockItemGroup"),
    fetchCount("/api/uom"),
    fetchCount("/api/customers"),
    fetchCount("/api/suppliers"),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            ERP System — Admin Preview
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            This page shows dynamic counts fetched from the local API proxy.
          </p>

          <nav className="mt-4 flex flex-wrap gap-2">
            <a href="#dashboard" className="px-3 py-1 rounded border">
              Dashboard
            </a>
            <a href="#stock" className="px-3 py-1 rounded border">
              Stock
            </a>
            <a href="#stock-item" className="px-3 py-1 rounded border">
              Stock Items
            </a>
            <a href="#stock-item-group" className="px-3 py-1 rounded border">
              Item Groups
            </a>
            <a href="#uom" className="px-3 py-1 rounded border">
              UOM
            </a>
            <Link
              href="/app/customize-field"
              className="px-3 py-1 rounded bg-foreground text-background"
            >
              Customize Field
            </Link>
          </nav>
        </header>

        <section id="dashboard" className="mb-8 bg-white p-6 rounded shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded border">
              Customers: <strong>{customers.count}</strong>
            </div>
            <div className="p-4 rounded border">
              Suppliers: <strong>{suppliers.count}</strong>
            </div>
            <div className="p-4 rounded border">
              Stock Items: <strong>{items.count}</strong>
            </div>
          </div>
        </section>

        <section id="stock" className="mb-8 bg-white p-6 rounded shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Stock Overview</h2>
          <p className="text-zinc-600 mb-4">
            Quick summaries for stock operations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded border">
              Stock Items: <strong>{items.count}</strong>
            </div>
            <div className="p-4 rounded border">
              Item Groups: <strong>{groups.count}</strong>
            </div>
            <div className="p-4 rounded border">
              UOMs: <strong>{uoms.count}</strong>
            </div>
          </div>
        </section>

        <section
          id="stock-item"
          className="mb-8 bg-white p-6 rounded shadow-sm"
        >
          <h2 className="text-2xl font-medium mb-4">Stock Items</h2>
          <p className="text-zinc-600 mb-4">
            Manage stock items. (Inline placeholder list)
          </p>

          <ul className="space-y-2">
            <li className="p-3 rounded border">
              Total items: <strong>{items.count}</strong>
            </li>
          </ul>
        </section>

        <section
          id="stock-item-group"
          className="mb-8 bg-white p-6 rounded shadow-sm"
        >
          <h2 className="text-2xl font-medium mb-4">Stock Item Groups</h2>
          <p className="text-zinc-600 mb-4">Item groups and categories.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded border">
              Total groups: <strong>{groups.count}</strong>
            </div>
          </div>
        </section>

        <section id="uom" className="mb-12 bg-white p-6 rounded shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Units of Measure (UOM)</h2>
          <p className="text-zinc-600 mb-4">Common units used across items.</p>

          <div className="flex gap-3 flex-wrap">
            <div className="p-3 rounded border">
              Total UOMs: <strong>{uoms.count}</strong>
            </div>
          </div>
        </section>

        <footer className="text-sm text-zinc-500">
          Preview content — replaces placeholders with dynamic counts from the
          API.
        </footer>
      </main>
    </div>
  );
}
