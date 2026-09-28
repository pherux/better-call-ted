import "./style.css";
import { questions, verdicts, evaluateQuiz } from "./brand-check.js";
import { CONTACT_EMAIL, createInquiry } from "./contact.js";

const $ = (selector) => document.querySelector(selector);
let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  $(".toast").textContent = message;
  $(".toast").hidden = false;
  toastTimer = setTimeout(() => {
    $(".toast").hidden = true;
  }, 4500);
}

$(".ticker-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const paused = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(paused));
  button.setAttribute(
    "aria-label",
    paused ? "Resume scrolling text" : "Pause scrolling text",
  );
  button.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
  $(".ticker").classList.toggle("is-paused", paused);
});

const menuButton = $(".menu-toggle");
const mobileNav = $("#mobile-nav");
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute("aria-expanded", String(opening));
  menuButton.setAttribute(
    "aria-label",
    opening ? "Close navigation" : "Open navigation",
  );
});
mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
matchMedia("(min-width: 641px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

document.addEventListener("click", (event) => {
  const serviceLink = event.target.closest("[data-service]");
  if (serviceLink) $("#service").value = serviceLink.dataset.service;
});

const root = $("#quiz-root");
let step = 0;
const answers = [null, null, null];
function focusQuiz() {
  const heading = root.querySelector("h3");
  heading?.focus({ preventScroll: true });
}
function renderQuestion(moveFocus = false) {
  const question = questions[step];
  root.innerHTML = `
    <p class="quiz-step">QUESTION ${String(step + 1).padStart(2, "0")} / 03</p>
    <h3 class="quiz-question" id="quiz-question" tabindex="-1">${question.title}</h3>
    <fieldset class="quiz-options" aria-labelledby="quiz-question">
      ${question.options.map((option, index) => `<label class="quiz-option"><input type="radio" name="answer" value="${index}" ${answers[step] === index ? "checked" : ""} /><span>${option}</span></label>`).join("")}
    </fieldset>
    <div class="quiz-actions">${step > 0 ? '<button class="quiz-back" type="button">← Go back</button>' : '<span class="quiz-count">Be honest. Ted can take it.</span>'}
    <button class="button button-dark quiz-next" type="button" ${answers[step] === null ? "disabled" : ""}>${step === 2 ? "GIVE ME THE VERDICT" : "NEXT QUESTION"} <span aria-hidden="true">→</span></button></div>`;
  root.querySelectorAll("input").forEach((input) =>
    input.addEventListener("change", () => {
      answers[step] = Number(input.value);
      root.querySelector(".quiz-next").disabled = false;
    }),
  );
  root.querySelector(".quiz-next").addEventListener("click", () => {
    if (answers[step] === null) return;
    if (step < 2) {
      step += 1;
      renderQuestion(true);
    } else renderResult(evaluateQuiz(answers), true);
  });
  root.querySelector(".quiz-back")?.addEventListener("click", () => {
    step -= 1;
    renderQuestion(true);
  });
  if (moveFocus) focusQuiz();
}

function renderResult(key, moveFocus = false) {
  const result = verdicts[key];
  root.innerHTML = `<p class="quiz-step">THE VERDICT IS IN</p>
    <h3 class="quiz-result-title" tabindex="-1">${result.title}</h3>
    <p class="quiz-result-body">${result.description}</p>
    <p class="quiz-recommendation"><strong>TED'S SUGGESTED NEXT MOVE:</strong>${result.recommendation}</p>
    <div class="quiz-result-actions"><a class="button button-red" href="#contact" data-service="${result.service}">HELP ME OUT, TED <span aria-hidden="true">↗</span></a><button class="share-result" type="button">Share my verdict ↗</button></div>
    <p class="quiz-disclaimer">A playful starting point based on three answers, not a full brand audit.</p>
    <div class="result-bottom"><button class="quiz-restart" type="button">Take the check again</button><span class="quiz-count">No brands were harmed.</span></div>
    <input class="share-fallback" type="text" readonly aria-label="Shareable result link" hidden />`;
  root.querySelector(".quiz-restart").addEventListener("click", () => {
    step = 0;
    answers.fill(null);
    const url = new URL(location.href);
    url.searchParams.delete("verdict");
    history.replaceState(null, "", url);
    renderQuestion(true);
  });
  root.querySelector(".share-result").addEventListener("click", async () => {
    const url = new URL(location.href);
    url.search = "";
    url.searchParams.set("verdict", key);
    url.hash = "brand-check";
    const data = {
      title: "The Better Call Ted Brand Check",
      text: `My brand's verdict: ${result.title} What's yours?`,
      url: url.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url.href);
      toast("Verdict link copied. Send it to your favorite invisible expert.");
    } catch {
      const input = root.querySelector(".share-fallback");
      input.value = url.href;
      input.hidden = false;
      input.focus();
      input.select();
      toast("Copy the selected link to share your verdict.");
    }
  });
  if (moveFocus) focusQuiz();
}
const sharedVerdict = new URLSearchParams(location.search).get("verdict");
if (Object.hasOwn(verdicts, sharedVerdict)) renderResult(sharedVerdict);
else renderQuestion();

$(".copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    toast("Email copied. Your next chapter starts with a hello.");
  } catch {
    toast(`Email Ted at ${CONTACT_EMAIL}`);
  }
});

$("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form));
  if (!values.name.trim() || !values.message.trim()) {
    const field = !values.name.trim()
      ? form.elements.name
      : form.elements.message;
    field.setCustomValidity("Please add a little more than spaces.");
    field.reportValidity();
    field.addEventListener("input", () => field.setCustomValidity(""), {
      once: true,
    });
    return;
  }
  const inquiry = createInquiry(values);
  const status = $("#form-status");
  status.hidden = false;
  status.textContent =
    "Your draft is ready. Send it from your email app to reach Ted. If no app opened, copy or download your inquiry and email it to " +
    CONTACT_EMAIL +
    ".";
  const fallback = document.createElement("span");
  fallback.className = "draft-fallback";
  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "Copy inquiry";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(inquiry.text);
      toast("Inquiry copied. Paste it into your email to Ted.");
    } catch {
      downloadInquiry(inquiry.text);
    }
  });
  const download = document.createElement("button");
  download.type = "button";
  download.textContent = "Download inquiry";
  download.addEventListener("click", () => downloadInquiry(inquiry.text));
  fallback.append(copy, download);
  status.append(fallback);
  window.location.href = inquiry.mailto;
});

function downloadInquiry(text) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "better-call-ted-inquiry.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Inquiry downloaded. Attach it to an email to Ted.");
}

$("#year").textContent = new Date().getFullYear();
const privacy = $("#privacy-dialog");
$(".privacy-link").addEventListener("click", () => privacy.showModal());
$(".dialog-close").addEventListener("click", () => privacy.close());
privacy.addEventListener("click", (event) => {
  if (event.target !== privacy) return;
  const box = privacy.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    privacy.close();
});
