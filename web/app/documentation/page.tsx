import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  API_FILES,
  ARCH_STEPS,
  COLUMNS,
  ENDPOINTS,
  FUTURE,
  GLOSSARY,
  JOURNEY,
  KEY_NUMBERS,
  LIMITS,
  MODELS,
  PAGES,
  QA,
  RISK_RULES,
  STACK,
  TABLES,
  TOC,
} from "@/lib/docs-content";

export const metadata: Metadata = {
  title: "Documentation | UPI Fraud Detection",
  description:
    "How the UPI fraud detection project works, explained step by step.",
};

export default function DocumentationPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          Everything about this project in plain language: what we built, why,
          how it works and how to talk about it. Use it to prepare the
          presentation and the viva. Press Ctrl+F to search for any term.
        </p>
      </header>

      <div className="gap-10 lg:grid lg:grid-cols-[14rem_1fr]">
        <nav
          aria-label="On this page"
          className="mb-8 lg:sticky lg:top-8 lg:mb-0 lg:self-start"
        >
          <p className="mb-2 text-sm font-medium">On this page</p>
          <ul className="space-y-1 text-sm">
            {TOC.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="block rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-14">
          {/* 1 */}
          <Section id="overview" title="1. The problem">
            <P>
              UPI lets anyone send money instantly. That speed is also what
              scammers like: once a payment goes through, it is very hard to get
              back. Typical tricks are fake &quot;collect requests&quot; that
              pretend to be refunds, payments to brand-new unknown receivers,
              and someone taking over an account from a new device in the middle
              of the night.
            </P>
            <P>
              Our project is a <b>fraud detection system</b>. For every payment
              it estimates the chance of fraud, labels it <b>Safe</b>,{" "}
              <b>Suspicious</b> or <b>Fraud</b>, explains why, and stores the
              result so a human analyst can review it.
            </P>
            <Card>
              <CardHeader>
                <CardTitle>In one sentence</CardTitle>
                <CardDescription>
                  A Random Forest classifier, served by a Python API, saved in
                  PostgreSQL and shown in a Next.js dashboard.
                </CardDescription>
              </CardHeader>
            </Card>
            <div>
              <h3 className="mb-2 font-medium">Objectives</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>
                  Build a classification model that separates fraud from genuine
                  payments.
                </li>
                <li>
                  Show the verdict with plain-English reasons, not just a
                  number.
                </li>
                <li>
                  Keep a record of every decision and let an analyst confirm or
                  reject flags.
                </li>
                <li>
                  Compare the chosen model with simpler ones and report honest
                  metrics.
                </li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Key numbers to remember</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {KEY_NUMBERS.map((k) => (
                    <div key={k.label}>
                      <dt className="text-xs text-muted-foreground">
                        {k.label}
                      </dt>
                      <dd className="text-sm font-medium">{k.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </Section>

          {/* 2 */}
          <Section id="architecture" title="2. How the system fits together">
            <P>
              The project has four parts that pass the work along. The person
              only sees the first one. Each part has one job, so you can change
              one without breaking the others.
            </P>
            <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-stretch">
              {ARCH_STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="flex flex-1 flex-col items-center gap-2 md:flex-row"
                >
                  <div className="h-full w-full rounded-lg border bg-card p-4">
                    <p className="font-medium">{s.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.text}
                    </p>
                  </div>
                  {i < ARCH_STEPS.length - 1 && (
                    <>
                      <ArrowRight
                        className="hidden size-5 shrink-0 text-muted-foreground md:block"
                        aria-hidden
                      />
                      <ArrowDown
                        className="size-5 shrink-0 text-muted-foreground md:hidden"
                        aria-hidden
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-dashed p-4 text-sm">
              <b>PostgreSQL</b> sits beside the API. FastAPI saves every result
              into two tables, and the Dashboard, Transactions and Insights
              pages read it back through the same API.
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Why we chose it</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STACK.map((s) => (
                  <TableRow key={s.part}>
                    <TableCell className="font-medium">{s.part}</TableCell>
                    <TableCell>{s.tech}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {s.why}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <h3 className="mb-2 font-medium">Project folders</h3>
              <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed">{`upi-fraud/
  ml/    train.py, data/, model/ (saved model + metrics.json)
  api/   FastAPI service (main, schemas, model_loader, explain, db, crud)
  db/    schema.sql
  web/   Next.js + shadcn/ui app`}</pre>
            </div>
          </Section>

          {/* 3 */}
          <Section id="dataset" title="3. The dataset">
            <P>
              Real UPI transactions are private, so we generated{" "}
              <b>50,000 synthetic transactions</b> with a Python script
              (train.py). About 4% (2,000) are fraud. Every column mirrors
              something a real fraud system could know about a payment.
            </P>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>What it means</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COLUMNS.map((c) => (
                  <TableRow key={c.name}>
                    <TableCell className="font-mono text-xs">
                      {c.name}
                    </TableCell>
                    <TableCell>{c.meaning}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {c.example}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div>
              <h3 className="mb-2 font-medium">
                How we decided which rows are fraud
              </h3>
              <P>
                Each row gets a hidden <b>risk score</b>: a weighted sum of the
                warning signs below, plus random noise. The riskiest 4% are
                labelled fraud. Because of the noise, some safe payments look
                risky and some frauds look ordinary, so the model has to learn
                patterns instead of copying one rule.
              </P>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {RISK_RULES.map((r) => (
                  <li key={r.factor} className="rounded-lg border p-3 text-sm">
                    <p className="font-medium">{r.factor}</p>
                    <p className="text-muted-foreground">{r.why}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Callout title="TODO with real data">
              The labels come from our own rules. So the model&apos;s high
              scores show that the pipeline works, not that it would catch real
              UPI fraud. With real data we would keep the pipeline and retrain.
            </Callout>
          </Section>

          {/* 4 */}
          <Section id="model" title="4. The model">
            <P>
              Fraud detection is a <b>classification</b> problem: for each
              payment the model picks one of two classes (fraud or not). We
              trained three models on the same data so we could compare them.
            </P>
            <div className="grid gap-3 md:grid-cols-3">
              {MODELS.map((m) => (
                <Card key={m.name}>
                  <CardHeader>
                    <CardTitle className="text-base">{m.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>{m.idea}</p>
                    <p className="text-xs text-muted-foreground">{m.setup}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <h3 className="mb-2 font-medium">
                Random Forest in simple words
              </h3>
              <P>
                Imagine asking 200 different fraud officers to look at the same
                payment. Each one has seen a slightly different set of past
                cases and looks at a different mix of clues. One officer may be
                wrong, but the average of 200 is usually right. That is a Random
                Forest, where each &quot;officer&quot; is a decision tree. The
                share of trees that think it is fraud becomes the fraud
                probability.
              </P>
            </div>
            <div>
              <h3 className="mb-2 font-medium">
                Turning a probability into a verdict
              </h3>
              <div className="grid gap-2 sm:grid-cols-3">
                <Band
                  tone="safe"
                  range="Below 30%"
                  name="Safe"
                  text="Let it through."
                />
                <Band
                  tone="sus"
                  range="30% to 70%"
                  name="Suspicious"
                  text="Hold for a human to check."
                />
                <Band
                  tone="fraud"
                  range="70% and above"
                  name="Fraud"
                  text="Block and alert the user."
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-medium">How the reasons are made</h3>
              <P>
                The reasons list (for example &quot;Amount is 8.0x higher than
                the user&apos;s usual amount&quot;) is made by simple rules in
                explain.py. They follow the model&apos;s most important features
                but are not produced by the model itself.
              </P>
            </div>
          </Section>

          {/* 5 */}
          <Section id="evaluation" title="5. How good is it?">
            <P>
              We tested on 10,000 transactions the model never saw. We avoid{" "}
              <b>accuracy</b>: 96% of rows are safe, so a model that always says
              &quot;safe&quot; would score 96% while catching no fraud. We use
              these instead:
            </P>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>
                <b>Precision:</b> when we flag fraud, how often are we right?
              </li>
              <li>
                <b>Recall:</b> of all real fraud, how much do we catch?
              </li>
              <li>
                <b>F1:</b> one number that is only high when both are decent.
              </li>
              <li>
                <b>ROC-AUC:</b> how well fraud is ranked above safe, regardless
                of cut-off.
              </li>
            </ul>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Precision</TableHead>
                  <TableHead className="text-right">Recall</TableHead>
                  <TableHead className="text-right">F1</TableHead>
                  <TableHead className="text-right">ROC-AUC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Row
                  m="Logistic Regression"
                  p="0.307"
                  r="0.908"
                  f="0.458"
                  a="0.974"
                />
                <Row
                  m="Decision Tree"
                  p="0.318"
                  r="0.885"
                  f="0.467"
                  a="0.933"
                />
                <Row
                  m="Random Forest"
                  p="0.860"
                  r="0.445"
                  f="0.587"
                  a="0.986"
                  best
                />
              </TableBody>
            </Table>
            <P>
              The Random Forest has the best F1 and ROC-AUC. Its recall looks
              low at the strict 0.5 cut-off, but the cut-off is adjustable:
            </P>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag as risky at or above</TableHead>
                  <TableHead className="text-right">Precision</TableHead>
                  <TableHead className="text-right">Recall</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>30% (Suspicious or Fraud)</TableCell>
                  <TableCell className="text-right">65.6%</TableCell>
                  <TableCell className="text-right">71.5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>50%</TableCell>
                  <TableCell className="text-right">86.0%</TableCell>
                  <TableCell className="text-right">44.5%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>70% (Fraud)</TableCell>
                  <TableCell className="text-right">97.6%</TableCell>
                  <TableCell className="text-right">20.5%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <P>
              This is the trade-off behind the three verdicts: a high cut-off is
              right almost every time but misses more fraud; a low cut-off
              catches more fraud but raises more false alarms. The Suspicious
              band gives a human the middle cases.
            </P>
            <Callout title="Fair comparison note">
              Logistic Regression and the Decision Tree used balanced class
              weights, which makes them flag more payments (high recall, low
              precision). The Random Forest did not. Mention this if asked, and
              point to ROC-AUC, which doesn&apos;t depend on the cut-off.
            </Callout>
          </Section>

          {/* 6 */}
          <Section id="journey" title="6. One transaction, step by step">
            <P>
              This is what happens from the moment you press &quot;Check
              transaction&quot;. It is a good story to tell during the demo.
            </P>
            <ol className="space-y-3">
              {JOURNEY.map((j, i) => (
                <li key={j.title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{j.title}</p>
                    <p className="text-sm text-muted-foreground">{j.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* 7 */}
          <Section id="api" title="7. The API">
            <P>
              The API is a Python service (FastAPI) that the web app calls. Run
              it with <Code>uvicorn main:app --reload --port 8000</Code> and
              open <Code>http://localhost:8000/docs</Code> for an interactive
              page where you can try every endpoint.
            </P>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>What it does</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ENDPOINTS.map((e) => (
                  <TableRow key={e.path}>
                    <TableCell className="font-mono text-xs">
                      {e.method}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {e.path}
                    </TableCell>
                    <TableCell>{e.purpose}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <h3 className="font-medium">What each file does</h3>
            <Table>
              <TableBody>
                {API_FILES.map((f) => (
                  <TableRow key={f.file}>
                    <TableCell className="font-mono text-xs">
                      {f.file}
                    </TableCell>
                    <TableCell>{f.job}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          {/* 8 */}
          <Section id="database" title="8. The database">
            <P>
              We use PostgreSQL with two tables. Each prediction points to
              exactly one transaction. If a transaction is deleted, its
              prediction goes with it. Both rows are saved together, so you
              never get one without the other.
            </P>
            <div className="grid gap-3 md:grid-cols-2">
              {TABLES.map((t) => (
                <Card key={t.name}>
                  <CardHeader>
                    <CardTitle className="font-mono text-base">
                      {t.name}
                    </CardTitle>
                    <CardDescription>{t.purpose}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {t.columns.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <P>
              The <Code>review_status</Code> column is the human feedback loop.
              Flagged payments start as <i>pending</i>, and an analyst marks
              them as <i>confirmed fraud</i> or <i>false alarm</i>. To move to
              Neon later, only the <Code>DATABASE_URL</Code> in the API&apos;s
              .env file changes.
            </P>
          </Section>

          {/* 9 */}
          <Section id="frontend" title="9. The web app">
            <P>
              Built with Next.js (App Router), Tailwind CSS, shadcn/ui
              components and Recharts for the charts. Data pages are fetched on
              the server from the API, and the Check page is interactive in the
              browser.
            </P>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAGES.map((p) => (
                <Card key={p.path}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Link
                        href={p.path}
                        className="underline-offset-4 hover:underline"
                      >
                        {p.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {p.path}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">{p.text}</CardContent>
                </Card>
              ))}
            </div>
          </Section>

          {/* 10 */}
          <Section id="limits" title="10. Limits and future work">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">
                  Limitations (say these before they ask)
                </h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {LIMITS.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium">Future work</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {FUTURE.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* 12 */}
          <Section id="qa" title="12. Viva questions and answers">
            <P>
              Click a question to see a short answer in plain words. Say it in
              your own words, using the answer as a guide.
            </P>
            {QA.map((group) => (
              <div key={group.category} className="space-y-2">
                <h3 className="pt-2 font-medium">{group.category}</h3>
                {group.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-lg border bg-card px-4 py-3"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <ChevronDown
                        className="size-4 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            ))}
          </Section>

          {/* 13 */}
          <Section id="glossary" title="13. Glossary">
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {GLOSSARY.map((g) => (
                <div key={g.term} className="border-b pb-3">
                  <dt className="text-sm font-medium">{g.term}</dt>
                  <dd className="text-sm text-muted-foreground">{g.meaning}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-sm leading-relaxed">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
      {children}
    </code>
  );
}

function Callout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-amber-600/30 bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
      <p className="font-medium">{title}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

function Band({
  tone,
  range,
  name,
  text,
}: {
  tone: "safe" | "sus" | "fraud";
  range: string;
  name: string;
  text: string;
}) {
  const styles = {
    safe: "border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40",
    sus: "border-amber-600/30 bg-amber-50 dark:bg-amber-950/40",
    fraud: "border-red-600/30 bg-red-50 dark:bg-red-950/40",
  }[tone];
  return (
    <div className={`rounded-lg border p-3 ${styles}`}>
      <p className="text-xs text-muted-foreground">{range}</p>
      <p className="font-medium">{name}</p>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function Row({
  m,
  p,
  r,
  f,
  a,
  best,
}: {
  m: string;
  p: string;
  r: string;
  f: string;
  a: string;
  best?: boolean;
}) {
  return (
    <TableRow
      className={
        best ? "bg-emerald-50 font-medium dark:bg-emerald-950/40" : undefined
      }
    >
      <TableCell>{m}</TableCell>
      <TableCell className="text-right tabular-nums">{p}</TableCell>
      <TableCell className="text-right tabular-nums">{r}</TableCell>
      <TableCell className="text-right tabular-nums">{f}</TableCell>
      <TableCell className="text-right tabular-nums">{a}</TableCell>
    </TableRow>
  );
}
