import Image from "next/image";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-40 -right-32 size-[520px] rounded-full bg-apple/35 blur-[120px]" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-white">
            <Image src="/logo.png" alt="" width={30} height={31} />
          </span>
          <span className="text-lg font-semibold">Big Apple Admin</span>
        </div>
        <div className="relative">
          <p className="max-w-md text-5xl leading-[1.02] font-medium tracking-[-0.04em]">
            Your shop, your numbers, one place.
          </p>
          <p className="mt-5 max-w-sm text-white/65">
            Add products, update prices and stock, and see who’s visiting and buying.
          </p>
        </div>
        <p className="relative text-xs text-white/40">Only approved staff can sign in.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-11 place-items-center rounded-full bg-white ring-1 ring-line">
              <Image src="/logo.png" alt="" width={28} height={29} />
            </span>
            <span className="font-semibold">Big Apple Admin</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
