const form = document.getElementById('date-form');
const answer = document.getElementById('answer');
const answerTitle = document.getElementById('answer-title');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const selections = new FormData(form);
  const time = selections.get('time');
  const place = selections.get('place');
  if (!time || !place) return;

  answerTitle.textContent = `${place} at ${time}`;
  answer.hidden = false;
  answer.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
