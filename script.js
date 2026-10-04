// Update the copy and photo filenames in index.html to make this surprise yours.
const scrollButtons = document.querySelectorAll('[data-scroll]');
scrollButtons.forEach((button) => button.addEventListener('click', () => {
  document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
}));

// Reveal sections as they enter view, with a no-IntersectionObserver fallback.
const revealItems = document.querySelectorAll('.reveal, .timeline-item');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 75}ms`;
    revealObserver.observe(item);
  });
} else revealItems.forEach((item) => item.classList.add('is-visible'));

// Missing photo files leave the hand-styled placeholder visible instead of a broken image icon.
document.querySelectorAll('.photo-frame img').forEach((image) => {
  const frame = image.closest('.photo-frame');
  image.addEventListener('load', () => frame.classList.add('has-image'));
  image.addEventListener('error', () => frame.classList.remove('has-image'));
  if (image.complete && image.naturalWidth) frame.classList.add('has-image');
});

// Short, non-clinical exam-recall quiz. Update options/explanations here if Judy's
// course uses a different local guideline or preferred wording.
const warmupQuestions = [
  { question: 'A 6-month-old has cough, wheeze and fast breathing in winter. What is the commonest cause?', options: ['Respiratory syncytial virus (RSV)', 'Influenza B', 'Streptococcus pneumoniae', 'Bordetella pertussis'], answer: 0, explanation: 'RSV is the commonest cause of bronchiolitis in infants.' },
  { question: 'Five days of fever, red eyes, strawberry tongue, swollen hands and a cervical node: what is the diagnosis and usual initial treatment?', options: ['Scarlet fever; oral penicillin', 'Kawasaki disease; IV immunoglobulin and aspirin', 'Measles; supportive care only', 'Rheumatic fever; benzathine penicillin'], answer: 1, explanation: 'This is Kawasaki disease. Initial treatment commonly includes IVIG and aspirin, with cardiac assessment and specialist care.' },
  { question: 'Tiny white spots on the buccal mucosa before a rash point to which disease?', options: ['Rubella', 'Roseola', 'Measles', 'Chickenpox'], answer: 2, explanation: 'Koplik spots are characteristic of measles and may appear before the rash.' },
  { question: 'What is the commonest cyanotic congenital heart disease presenting after infancy?', options: ['Transposition of the great arteries', 'Tetralogy of Fallot', 'Tricuspid atresia', 'Truncus arteriosus'], answer: 1, explanation: 'The classic exam answer is Tetralogy of Fallot.' },
  { question: 'At about what ages do children usually sit without support and walk alone?', options: ['3 months and 6 months', '6 months and 12 months', '9 months and 18 months', '12 months and 24 months'], answer: 1, explanation: 'A common milestone shorthand is sitting unsupported around 6 months and walking alone around 12 months; normal windows vary.' },
  { question: 'Which vaccine is given at birth to protect against severe TB such as miliary TB and TB meningitis?', options: ['OPV', 'Hepatitis B', 'BCG', 'DTP'], answer: 2, explanation: 'BCG is given in infancy (often at birth in high TB burden settings) and protects against severe childhood TB forms.' },
  { question: 'A child with watery diarrhoea has some dehydration. What is the usual WHO Plan B approach?', options: ['ORS about 75 mL/kg over 4 hours, then reassess', 'No fluids for 4 hours', 'Immediate antibiotics for every child', 'IV fluids for all cases of some dehydration'], answer: 0, explanation: 'Give oral rehydration solution in frequent small amounts (about 75 mL/kg over 4 hours), continue feeding/breastfeeding, and reassess.' },
  { question: 'A newborn becomes jaundiced in the first 24 hours. How should you interpret this?', options: ['Physiological jaundice; routine follow-up only', 'Pathological until assessed; check bilirubin and consider haemolysis', 'Breast-milk jaundice', 'Normal transition; no tests are needed'], answer: 1, explanation: 'Jaundice in the first 24 hours is a red flag. Measure bilirubin promptly and assess causes such as haemolysis (including blood group incompatibility) and infection.' },
  { question: 'A 4-year-old has puffy eyes, heavy proteinuria and low albumin. What is the commonest cause and usual first treatment?', options: ['Minimal change disease; oral prednisolone', 'IgA nephropathy; antibiotics', 'Alport syndrome; ACE inhibitor only', 'Post-streptococcal GN; oral prednisolone'], answer: 0, explanation: 'In typical childhood nephrotic syndrome, minimal change disease is the commonest pattern; initial therapy is usually corticosteroids under paediatric guidance.' },
  { question: 'A 2-year-old has a generalised seizure for 3 minutes with fever, only once in 24 hours, then recovers fully. What is the likely diagnosis?', options: ['Complex febrile seizure', 'Simple febrile seizure', 'Absence seizure', 'Status epilepticus'], answer: 1, explanation: 'This fits a simple febrile seizure: generalised, brief, and not repeated within 24 hours, assuming no CNS infection or other underlying cause.' }
];
const warmupButton = document.getElementById('warmup-button');
const warmupPanel = document.getElementById('warmup');
const warmupQuestion = document.getElementById('warmup-question');
const warmupProgressLabel = document.getElementById('warmup-progress-label');
const warmupProgressFill = document.getElementById('warmup-progress-fill');
let warmupIndex = 0;

warmupButton.addEventListener('click', () => {
  if (!warmupPanel.hidden) {
    warmupPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  warmupPanel.hidden = false;
  warmupButton.setAttribute('aria-expanded', 'true');
  renderWarmupQuestion();
  requestAnimationFrame(() => warmupPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
});

function renderWarmupQuestion() {
  const item = warmupQuestions[warmupIndex];
  warmupProgressLabel.textContent = `Question ${warmupIndex + 1} of ${warmupQuestions.length}`;
  warmupProgressFill.style.width = `${(warmupIndex / warmupQuestions.length) * 100}%`;
  warmupQuestion.innerHTML = `<article class="warmup-card"><h4>${item.question}</h4><div class="warmup-answers" role="group" aria-label="Answer choices">${item.options.map((option, index) => `<button type="button" class="warmup-answer" data-option="${index}">${option}</button>`).join('')}</div><div class="warmup-feedback" aria-live="polite"></div></article>`;
  warmupQuestion.querySelectorAll('.warmup-answer').forEach((button) => {
    button.addEventListener('click', () => revealWarmupAnswer(Number(button.dataset.option)));
  });
}

function revealWarmupAnswer(selected) {
  const item = warmupQuestions[warmupIndex];
  const buttons = warmupQuestion.querySelectorAll('.warmup-answer');
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) button.classList.add('is-correct');
    else if (index === selected) button.classList.add('is-incorrect');
  });
  const feedback = warmupQuestion.querySelector('.warmup-feedback');
  const isCorrect = selected === item.answer;
  feedback.innerHTML = `<p class="feedback-result">${isCorrect ? 'That’s right, Judy.' : 'The answer is: ' + item.options[item.answer]}</p><p>${item.explanation}</p><button type="button" class="button button-primary warmup-next">${warmupIndex === warmupQuestions.length - 1 ? 'Finish warm-up' : 'Next question'}</button>`;
  feedback.classList.add('is-shown');
  feedback.querySelector('.warmup-next').addEventListener('click', () => {
    warmupIndex += 1;
    if (warmupIndex < warmupQuestions.length) renderWarmupQuestion();
    else showWarmupComplete();
    requestAnimationFrame(() => warmupPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
  warmupProgressFill.style.width = `${((warmupIndex + 1) / warmupQuestions.length) * 100}%`;
}

function showWarmupComplete() {
  warmupProgressLabel.textContent = 'Warm-up complete';
  warmupQuestion.innerHTML = '<div class="warmup-complete"><p class="eyebrow">That’s your ten</p><h4>Whatever tomorrow brings, Judy, I’m proud of you.</h4><p>Take a breath. You’ve put in the work, and I’ll be cheering you on.</p></div>';
}

// Lightweight canvas confetti; disabled when reduced motion is requested.
const readyButton = document.getElementById('ready-button');
const celebration = document.getElementById('celebration');
const canvas = document.getElementById('confetti');
let animationFrame;
readyButton.addEventListener('click', () => {
  celebration.hidden = false;
  readyButton.disabled = true;
  launchConfetti();
  celebration.querySelector('h2').focus?.();
});
function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const context = canvas.getContext('2d');
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = bounds.width * ratio; canvas.height = bounds.height * ratio;
  context.scale(ratio, ratio);
  const colors = ['#c95c71', '#edb6bd', '#f2d48b', '#a9c9ae', '#eec4d8'];
  const bits = Array.from({ length: 95 }, () => ({ x: Math.random() * bounds.width, y: -Math.random() * bounds.height, size: 3 + Math.random() * 5, speed: 1.4 + Math.random() * 2.8, drift: (Math.random() - .5) * 1.4, color: colors[Math.floor(Math.random() * colors.length)], spin: Math.random() * 6 }));
  const start = performance.now();
  function draw(now) {
    context.clearRect(0, 0, bounds.width, bounds.height);
    bits.forEach((bit) => { bit.y += bit.speed; bit.x += bit.drift; bit.spin += .05; context.save(); context.translate(bit.x, bit.y); context.rotate(bit.spin); context.fillStyle = bit.color; context.fillRect(-bit.size / 2, -bit.size / 2, bit.size, bit.size * 1.5); context.restore(); });
    if (now - start < 4200) animationFrame = requestAnimationFrame(draw); else context.clearRect(0, 0, bounds.width, bounds.height);
  }
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(draw);
}
