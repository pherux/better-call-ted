import test from "node:test";
import assert from "node:assert/strict";
import { evaluateQuiz, verdicts } from "../src/brand-check.js";
import { CONTACT_EMAIL, createInquiry } from "../src/contact.js";

test("all 27 completed brand-check combinations produce a usable verdict", () => {
  for (let a = 0; a <= 2; a++)
    for (let b = 0; b <= 2; b++)
      for (let c = 0; c <= 2; c++) {
        const verdict = verdicts[evaluateQuiz([a, b, c])];
        assert.ok(verdict.title && verdict.service && verdict.recommendation);
      }
});

test("verdict boundaries distinguish the three levels", () => {
  assert.equal(evaluateQuiz([0, 0, 0]), "invisible");
  assert.equal(evaluateQuiz([1, 0, 0]), "invisible");
  assert.equal(evaluateQuiz([2, 0, 0]), "mixed");
  assert.equal(evaluateQuiz([2, 2, 0]), "mixed");
  assert.equal(evaluateQuiz([2, 2, 1]), "almost");
  assert.equal(evaluateQuiz([2, 2, 2]), "almost");
});

test("incomplete or invalid answers cannot produce a diagnosis", () => {
  for (const answers of [
    [],
    [0, 1],
    [null, 1, 2],
    [3, 0, 1],
    [-1, 0, 1],
    ["1", 0, 2],
    [0, 0, 0, 0],
  ]) {
    assert.throws(() => evaluateQuiz(answers));
  }
});

test("email drafts preserve Unicode, newlines, and punctuation without changing the recipient", () => {
  const inquiry = createInquiry({
    name: " José & Co. ",
    email: "test+brand@example.com",
    brand: "A&B = Growth?",
    service: "Brand strategy",
    message: "Hello Ted!\nCan we grow 20%? & why #now",
  });
  const url = new URL(inquiry.mailto);
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.size, 2);
  assert.equal(url.searchParams.get("subject"), inquiry.subject);
  assert.equal(url.searchParams.get("body"), inquiry.body);
  assert.match(inquiry.body, /José & Co\./);
  assert.match(inquiry.body, /20%\? & why #now/);
  assert.match(inquiry.text, /^To: valkyrie241@gmail.com/);
});
