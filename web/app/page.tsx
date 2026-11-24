import type { Metadata } from "next";
import Link from "next/link";
import "@/components/landing/landing.css";
import { LandingNav } from "@/components/landing/landing-nav";
import { Reveal } from "@/components/landing/reveal";
import { RulerGauge } from "@/components/landing/ruler-gauge";
import { SlipStack } from "@/components/landing/slip-stack";
import { GUIDE, PROJECT, TEAM, type Member } from "@/lib/team";

export const metadata: Metadata = {
  title: "UPI Fraud Detection",
  description:
    "A Random Forest model that rates UPI payments as Safe, Suspicious or Fraud, with plain-English reasons.",
};

const STEPS = [
  {
    title: "A payment comes in",
    text: "Amount, receiver, time of day, device, and a few signals about how the sender normally behaves.",
  },
  {
    title: "The forest votes",
    text: "200 decision trees each give an estimate, and the average becomes the fraud probability.",
  },
  {
    title: "A verdict, with reasons",
    text: "Safe, Suspicious or Fraud, plus the red flags in plain English, so nobody has to trust a bare number.",
  },
  {
    title: "A person has the last word",
    text: "Everything is saved in PostgreSQL. An analyst confirms the fraud or marks it a false alarm.",
  },
];

const FLAGS = [
  {
    t: "Paying someone new",
    d: "Scammers are almost always people you have never paid before.",
    f: "is_new_payee",
  },
  {
    t: "An amount far above usual",
    d: "A jump from ₹500 to ₹25,000 stands out straight away.",
    f: "amount_ratio",
  },
  {
    t: "Odd hours",
    d: "Between midnight and 4 AM people are less alert.",
    f: "hour",
  },
  {
    t: "A new device or place",
    d: "A phone the account has never used may belong to someone else.",
    f: "device_changed",
  },
  {
    t: "Many payments in an hour",
    d: "A common way to empty an account quickly.",
    f: "txns_last_hour",
  },
  {
    t: "A reported receiver",
    d: "The same UPI IDs get reused, so past complaints matter.",
    f: "receiver_reports",
  },
  {
    t: "Collect requests",
    d: "Fake refunds that only work if you approve them with your PIN.",
    f: "txn_type = COLLECT",
  },
  {
    t: "A very new account",
    d: "Throwaway accounts are young.",
    f: "account_age_days",
  },
];

const OUTCOMES = [
  {
    cls: "lp-stamp-safe",
    label: "Safe",
    rot: "-6deg",
    range: "Below 30%",
    text: "Let it through.",
  },
  {
    cls: "lp-stamp-sus",
    label: "Suspicious",
    rot: "-3deg",
    range: "30% to 70%",
    text: "Hold it for a person to check.",
  },
  {
    cls: "lp-stamp-fraud",
    label: "Fraud",
    rot: "-8deg",
    range: "70% and above",
    text: "Block it and alert the user.",
  },
];

const RESULTS = [
  { m: "Logistic Regression", p: "0.307", r: "0.908", f: "0.458", a: "0.974" },
  { m: "Decision Tree", p: "0.318", r: "0.885", f: "0.467", a: "0.933" },
  {
    m: "Random Forest",
    p: "0.860",
    r: "0.445",
    f: "0.587",
    a: "0.986",
    best: true,
  },
];

export default function LandingPage() {
  return (
    <div className="lp-root min-h-screen overflow-x-hidden">
      {/* SVG filter that roughens the edges of the rubber stamps */}
      <svg
        width="0"
        height="0"
        className="absolute"
        aria-hidden
        focusable="false"
      >
        <filter id="lp-rough">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            seed="4"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>
      </svg>

      <LandingNav />

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-14 lg:grid-cols-12 lg:pb-32 lg:pt-20">
        <div className="lg:col-span-7">
          <p
            className={`font-mono lp-fade text-xs uppercase tracking-[0.2em] lp-muted`}
            style={{ animationDelay: "0ms" }}
          >
            A fraud check for UPI payments
          </p>

          <h1
            className={`mt-6 text-[clamp(2.9rem,7.2vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.025em]`}
          >
            <span className="lp-line">
              <span style={{ ["--d" as string]: "120ms" }}>
                A{" "}
                <span className="relative inline-block">
                  second opinion
                  <svg
                    className="lp-pen-load pointer-events-none absolute left-0 w-full"
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    aria-hidden
                    style={{
                      ["--d" as string]: "1200ms",
                      bottom: "-0.1em",
                      height: "0.2em",
                    }}
                  >
                    <path
                      pathLength={1}
                      d="M3 8 C 40 2, 90 10, 150 6 S 250 3, 297 7"
                      fill="none"
                      stroke="var(--red)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </span>
            </span>
            <span className="lp-line">
              <span style={{ ["--d" as string]: "260ms" }}>
                on every UPI payment.
              </span>
            </span>
          </h1>

          <p
            className="lp-fade mt-8 max-w-xl text-lg leading-relaxed lp-muted"
            style={{ animationDelay: "800ms" }}
          >
            This project rates each payment as Safe, Suspicious or Fraud, shows
            its reasons in plain words, and keeps a record so a person can
            review the doubtful ones.
          </p>

          <div
            className="lp-fade mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ animationDelay: "1000ms" }}
          >
            <Link href="/check" className="lp-btn lp-btn-solid rounded-md">
              Check a transaction <span aria-hidden>→</span>
            </Link>
            <Link href="/documentation" className="lp-link text-[0.95rem]">
              Read the documentation
            </Link>
          </div>

          <p
            className={`font-mono lp-fade mt-10 text-xs lp-muted`}
            style={{ animationDelay: "1200ms" }}
          >
            Trained on 50,000 synthetic transactions. No real payment data.
          </p>
        </div>

        <div
          className="lp-fade lg:col-span-5"
          style={{ animationDelay: "500ms" }}
        >
          <SlipStack />
        </div>
      </section>

      {/* --------------------------- How it works -------------------------- */}
      <section
        id="how"
        className="scroll-mt-16 border-t border-foreground py-24"
      >
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHead
              n="01"
              label="How it works"
              title="Four steps from payment to decision."
            />
          </Reveal>
          <div className="mt-14">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="relative grid gap-3 py-8 md:grid-cols-[6rem_1fr_1.2fr] md:gap-10">
                  <span className="lp-rule absolute left-0 right-0 top-0" />
                  <span
                    className={`text-5xl font-light leading-none lp-faint md:text-6xl`}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    className={`text-2xl font-medium leading-tight md:text-[1.7rem]`}
                  >
                    {s.title}
                  </h3>
                  <p className="leading-relaxed lp-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal>
              <span className="lp-rule" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------ Red flags -------------------------- */}
      <section
        id="flags"
        className="scroll-mt-16 border-t border-foreground py-24"
      >
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHead
              n="02"
              label="Red flags"
              title="Eight things that raise the score."
            />
            <p className="mt-5 max-w-xl leading-relaxed lp-muted">
              Each one is a real column the model reads. The grey tag on the
              right is the column&apos;s name in the code.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-16 md:grid-cols-2">
            {FLAGS.map((f, i) => (
              <Reveal key={f.t} delay={(i % 4) * 80}>
                <div className="relative flex gap-4 py-5">
                  <span className="lp-rule absolute left-0 right-0 top-0 !bg-border" />
                  <svg
                    className="lp-tick mt-0.5 size-7 shrink-0"
                    viewBox="0 0 28 28"
                    aria-hidden
                    style={{ ["--d" as string]: `${300 + i * 90}ms` }}
                  >
                    <rect
                      x="2"
                      y="4"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="1.5"
                    />
                    <path
                      pathLength={1}
                      d="M6 14 L12 20 L26 4"
                      fill="none"
                      stroke="var(--red)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{f.t}</p>
                    <p className="mt-0.5 text-sm leading-relaxed lp-muted">
                      {f.d}
                    </p>
                  </div>
                  <span
                    className={`font-mono hidden shrink-0 self-start pt-1 text-[0.7rem] lp-muted sm:block`}
                  >
                    {f.f}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Verdicts --------------------------- */}
      <section
        id="verdicts"
        className="scroll-mt-16 border-t border-foreground py-24"
      >
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-end gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHead
                n="03"
                label="Verdicts"
                title="Three outcomes, not two."
              />
              <p className="mt-5 max-w-lg leading-relaxed lp-muted">
                The model gives a probability. Clear cases are decided
                automatically, and the uncertain middle goes to a person,
                because blocking a genuine payment has a cost too.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <RulerGauge />
            </Reveal>
          </div>

          <Reveal className="mt-20">
            <div className="grid gap-10 sm:grid-cols-3">
              {OUTCOMES.map((o, i) => (
                <div key={o.label}>
                  <div className={`font-mono h-16`}>
                    <span
                      className={`lp-stamp lp-stamp-pop ${o.cls} px-3 py-1 text-xl`}
                      style={{
                        ["--r" as string]: o.rot,
                        ["--d" as string]: `${300 + i * 220}ms`,
                      }}
                    >
                      {o.label}
                    </span>
                  </div>
                  <p className={`font-mono mt-3 text-sm`}>{o.range}</p>
                  <p className="mt-1 lp-muted">{o.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Results ---------------------------- */}
      <section
        id="results"
        className="scroll-mt-16 border-t border-foreground py-24"
      >
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHead
              n="04"
              label="Results"
              title="Tested on payments it had never seen."
            />
            <p className="mt-5 max-w-2xl leading-relaxed lp-muted">
              Three models, same data, 10,000 test transactions. Accuracy is
              left out on purpose: 96% of payments are safe, so a model that
              always says &quot;safe&quot; would already score 96% while
              catching no fraud.
            </p>
          </Reveal>

          <Reveal className="mt-10" delay={100}>
            <div className="overflow-x-auto">
              <table
                className={`font-mono w-full min-w-[34rem] max-w-3xl border-collapse text-sm`}
              >
                <thead>
                  <tr className="border-b border-foreground text-left text-xs uppercase tracking-[0.14em] lp-muted">
                    <th className="py-3 font-medium">Model</th>
                    <th className="py-3 text-right font-medium">Precision</th>
                    <th className="py-3 text-right font-medium">Recall</th>
                    <th className="py-3 text-right font-medium">F1</th>
                    <th className="py-3 pr-2 text-right font-medium">
                      ROC-AUC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((r) => (
                    <tr key={r.m} className="border-b lp-hair">
                      <td className={`py-4 ${r.best ? "font-semibold" : ""}`}>
                        {r.m}
                      </td>
                      <td className="py-4 text-right tabular-nums">{r.p}</td>
                      <td className="py-4 text-right tabular-nums">{r.r}</td>
                      <td className="py-4 text-right tabular-nums">
                        {r.best ? (
                          <span className="relative inline-block px-3 font-semibold">
                            {r.f}
                            <svg
                              className="lp-pen pointer-events-none absolute -inset-x-2 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+1rem)]"
                              viewBox="0 0 110 44"
                              preserveAspectRatio="none"
                              aria-hidden
                              style={{ ["--d" as string]: "700ms" }}
                            >
                              <path
                                pathLength={1}
                                d="M12 24 C 4 10, 38 3, 68 6 C 100 9, 106 28, 70 37 C 38 44, 6 36, 9 18 C 11 9, 26 5, 40 5"
                                fill="none"
                                stroke="var(--red)"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          </span>
                        ) : (
                          r.f
                        )}
                      </td>
                      <td
                        className={`py-4 pr-2 text-right tabular-nums ${r.best ? "font-semibold" : ""}`}
                      >
                        {r.a}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="mt-8" delay={150}>
            <p className="max-w-2xl leading-relaxed">
              Where the line is drawn matters. Rated <b>Fraud</b> (70% and
              above), the model is right 97.6% of the time. Flagging everything
              at 30% and above catches 71.5% of all fraud. That trade-off is why
              there is a middle verdict.
            </p>
            <p className={`font-mono mt-4 text-xs lp-muted`}>
              All of this is on synthetic data, so it shows the pipeline works,
              not how it would do on real UPI traffic.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Team ------------------------------ */}
      <section
        id="team"
        className="scroll-mt-16 border-t border-foreground py-24"
      >
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHead n="05" label="Team" title="Who built this." />
            <p className="mt-5 lp-muted">
              {PROJECT.course} PBL project, {PROJECT.institute}, {PROJECT.year}.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name + i} delay={i * 100}>
                <MemberCard member={m} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <div className="max-w-md">
              <p
                className={`font-mono text-xs uppercase tracking-[0.18em] lp-muted`}
              >
                Under the guidance of
              </p>
              <p className={`mt-6 border-b border-foreground pb-2 text-3xl`}>
                {GUIDE.name}
              </p>
              <p className="mt-2 text-sm lp-muted">{GUIDE.designation}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- Close ----------------------------- */}
      <section className="border-t border-foreground bg-foreground py-24 text-background">
        <Reveal className="mx-auto flex max-w-6xl flex-col gap-10 px-5 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className={`max-w-2xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl`}
          >
            Try the three example payments, then see what gets flagged.
          </h2>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/check"
              className="lp-btn rounded-md bg-background text-foreground hover:!bg-background/85"
            >
              Check a transaction <span aria-hidden>→</span>
            </Link>
            <Link href="/dashboard" className="lp-link">
              Open the dashboard
            </Link>
          </div>
        </Reveal>
      </section>

      <footer
        className={`font-mono border-t border-background/15 bg-foreground py-6 text-xs text-background/60`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            A learning project for {PROJECT.course} PBL. Not a production fraud
            system.
          </p>
          <p className="flex gap-5">
            <Link href="/documentation" className="hover:text-background">
              Documentation
            </Link>
            <a
              href={PROJECT.repo}
              target="_blank"
              rel="noreferrer"
              className="hover:text-background"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({
  n,
  label,
  title,
}: {
  n: string;
  label: string;
  title: string;
}) {
  return (
    <div>
      <div
        className={`font-mono flex items-center gap-4 text-xs uppercase tracking-[0.18em]`}
      >
        <span>{n}</span>
        <span className="lp-muted">{label}</span>
        <span className="lp-rule flex-1 !bg-border" />
      </div>
      <h2
        className={`mt-6 max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl`}
      >
        {title}
      </h2>
    </div>
  );
}

const TILES = ["#d1fae5", "#e0f2fe", "#fef3c7", "#ede9fe"];
const TILTS = ["-1.6deg", "1.2deg", "-0.8deg", "1.6deg"];

function MemberCard({ member: m, index }: { member: Member; index: number }) {
  const initials = m.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <div className="group">
      <div
        className="lp-polaroid bg-card p-3 pb-12"
        style={{ ["--tilt" as string]: TILTS[index % TILTS.length] }}
      >
        <div className="aspect-square w-full overflow-hidden">
          {m.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={m.photo}
              alt={m.name}
              className="size-full object-cover"
            />
          ) : (
            <div
              className={`flex size-full items-center justify-center text-6xl font-light`}
              style={{ background: TILES[index % TILES.length] }}
            >
              {initials}
            </div>
          )}
        </div>
        <p className={`font-mono mt-3 text-center text-xs lp-muted`}>
          {m.roll ?? ""}
        </p>
      </div>

      <h3 className={`mt-6 text-2xl font-medium leading-tight`}>{m.name}</h3>
      <p
        className={`font-mono mt-1 text-xs uppercase tracking-[0.14em] lp-red`}
      >
        {m.role}
      </p>
      {m.focus && (
        <p className="mt-3 text-sm leading-relaxed lp-muted">{m.focus}</p>
      )}
      {(m.github || m.linkedin) && (
        <p className="mt-3 flex gap-5 text-sm">
          {m.github && (
            <a
              href={m.github}
              target="_blank"
              rel="noreferrer"
              className="lp-link"
            >
              GitHub
            </a>
          )}
          {m.linkedin && (
            <a
              href={m.linkedin}
              target="_blank"
              rel="noreferrer"
              className="lp-link"
            >
              LinkedIn
            </a>
          )}
        </p>
      )}
    </div>
  );
}
