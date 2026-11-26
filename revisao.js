
const getDone = () => {
  try { return JSON.parse(localStorage.getItem('revisao-software') || '[]'); }
  catch { return []; }
};
const saveDone = items => localStorage.setItem('revisao-software', JSON.stringify(items));
const progress = document.querySelector('progress');
if (progress) {
  const done = getDone();
  progress.value = done.length;
  document.querySelector('#progress-text').textContent = done.length + ' de 10 matérias revisadas';
  document.querySelectorAll('.tile').forEach(tile => {
    if (done.includes(tile.dataset.id)) tile.querySelector('.done').hidden = false;
  });
  const filters = [...document.querySelectorAll('.filter')];
  const search = document.querySelector('#search');
  const normalize = str => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let selected = 'all';
  function update() {
    const query = normalize(search.value.trim());
    let matches = 0;
    document.querySelectorAll('.period').forEach(period => {
      const tiles = [...period.querySelectorAll('.tile')];
      tiles.forEach(tile => {
        tile.hidden = (selected !== 'all' && period.dataset.period !== selected)
          || !normalize(tile.dataset.search).includes(query);
        if (!tile.hidden) matches++;
      });
      period.hidden = tiles.every(tile => tile.hidden);
    });
    document.querySelector('#empty').hidden = matches > 0;
  }
  search.addEventListener('input', update);
  filters.forEach(filter => filter.addEventListener('click', () => {
    selected = filter.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', item === filter));
    update();
  }));
}
const review = document.querySelector('#review');
if (review) {
  const id = review.dataset.id;
  const paint = () => {
    const done = getDone().includes(id);
    review.textContent = done ? 'Revisada · desmarcar' : 'Marcar como revisada';
    review.setAttribute('aria-pressed', done);
  };
  paint();
  review.addEventListener('click', () => {
    const done = getDone();
    try {
      saveDone(done.includes(id) ? done.filter(item => item !== id) : [...done, id]);
      paint();
    } catch {
      document.querySelector('#review-status').textContent = 'O navegador bloqueou o armazenamento do progresso.';
    }
  });
}
const copy = document.querySelector('.copy');
if (copy) copy.addEventListener('click', async () => {
  const code = document.querySelector('.snippet pre');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(code.textContent);
    status.textContent = 'Exemplo copiado.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Exemplo selecionado. Use Ctrl+C ou o menu do navegador.';
  }
});

