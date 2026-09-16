import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { company } from "@/content/company";
import { services } from "@/content/services";
import { supabase } from "@/integrations/supabase/client";
import { Container, PageHeader, Section } from "@/components/site/sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Quorlex Soft — start a project or book a consultation" },
      {
        name: "description",
        content:
          "Tell us the business problem. Send a project brief or request a consultation and we will reply with an honest assessment of scope, approach and cost.",
      },
      { property: "og:title", content: "Contact Quorlex Soft" },
      {
        property: "og:description",
        content: "Send a project brief or request a free consultation call.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const budgets = [
  "Under €10,000",
  "€10,000 – €25,000",
  "€25,000 – €50,000",
  "€50,000 – €100,000",
  "Over €100,000",
  "Not sure yet",
];

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().min(20, "Please describe the project in a little more detail").max(4000),
});

function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      phone: parsed.data.phone || null,
      service: parsed.data.service || null,
      budget: parsed.data.budget || null,
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Your enquiry could not be sent. Please email us directly.");
      return;
    }

    form.reset();
    setDone(true);
    toast.success("Enquiry received. We will reply within two working days.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Tell us the business problem"
        intro="Send a project brief or request a consultation call. We will reply with an honest view of scope, approach and cost — including if we are not the right team."
      />

      <Section bordered={false}>
        <Container className="px-0">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              {done ? (
                <div className="rounded-xl border border-primary/40 bg-card p-8">
                  <h2 className="text-xl font-semibold">Thank you — your enquiry is with us</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    We read every enquiry personally and reply within two working days. If it is
                    urgent, call {company.phone}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setDone(false)}
                    className="mt-6 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" name="name" error={errors["name"]} required />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      error={errors["email"]}
                      required
                    />
                    <Field label="Company" name="company" error={errors["company"]} />
                    <Field label="Phone" name="phone" error={errors["phone"]} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium">What do you need?</span>
                      <select
                        name="service"
                        defaultValue=""
                        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                      >
                        <option value="">Select an area</option>
                        <option value="Consultation call">Consultation call first</option>
                        {services.map((service) => (
                          <option key={service.slug} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium">Indicative budget</span>
                      <select
                        name="budget"
                        defaultValue=""
                        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
                      >
                        <option value="">Select a range</option>
                        {budgets.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium">
                      Project brief <span className="text-primary">*</span>
                    </span>
                    <textarea
                      name="message"
                      rows={7}
                      placeholder="What is the problem, who will use the system, what must it connect to, and what are your timeline constraints?"
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                    {errors["message"] ? (
                      <span className="mt-1.5 block text-xs text-destructive">
                        {errors["message"]}
                      </span>
                    ) : null}
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send enquiry"}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    We use your details only to respond to this enquiry. See our privacy policy.
                  </p>
                </form>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold">Direct contact</h2>
                <ul className="mt-4 space-y-4 text-sm">
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <a className="hover:text-primary" href={`mailto:${company.email}`}>
                      {company.email}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <a className="hover:text-primary" href={`tel:${company.phoneHref}`}>
                      {company.phone}
                    </a>
                  </li>
                  <li className="flex gap-3 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{company.registeredIn}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <li>1. We read your brief and reply within two working days.</li>
                  <li>2. A discovery call to understand the problem and constraints.</li>
                  <li>3. A written scope, architecture outline and phased timeline.</li>
                </ol>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
      />
      {error ? <span className="mt-1.5 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
