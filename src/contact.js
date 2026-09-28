export const CONTACT_EMAIL = "valkyrie241@gmail.com";

export function createInquiry(values) {
  const clean = (name) => String(values[name] ?? "").trim();
  const service = clean("service");
  const subject = `Better Call Ted — ${service || "Brand inquiry"}`;
  const body = [
    "Hi Ted,",
    "",
    "Let's talk about my brand.",
    "",
    `Name: ${clean("name")}`,
    `Email: ${clean("email")}`,
    `Brand / business: ${clean("brand") || "Not specified"}`,
    `Interested in: ${service || "The whole game plan"}`,
    "",
    clean("message"),
    "",
    `Thanks,\n${clean("name")}`,
  ].join("\n");
  return {
    subject,
    body,
    mailto: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `To: ${CONTACT_EMAIL}\nSubject: ${subject}\n\n${body}`,
  };
}
