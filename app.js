const slides = document.querySelector('#slides');
const cards = [...slides.querySelectorAll('.slide')];
const pageButtons = [...document.querySelectorAll('[data-page]')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const status = document.querySelector('#page-status');
const requestAction = document.querySelector('#request-action');
const names = ['각인 안내', '원본이 필요한 이유', '가능한 파일 형식', '원본 요청 방법'];
let current = 0;
let scrollTimer;

function updatePage(index) {
  current = Math.max(0, Math.min(cards.length - 1, index));
  previous.disabled = current === 0;
  next.disabled = current === cards.length - 1;
  pageButtons.forEach((button, i) => {
    if (i === current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  status.textContent = `${current + 1} / ${cards.length} · ${names[current]}`;
  requestAction.hidden = current !== cards.length - 1;
}

function goTo(index) {
  const target = Math.max(0, Math.min(cards.length - 1, index));
  slides.scrollTo({ left: target * slides.clientWidth });
  updatePage(target);
}

previous.addEventListener('click', () => goTo(current - 1));
next.addEventListener('click', () => goTo(current + 1));
pageButtons.forEach(button => button.addEventListener('click', () => goTo(Number(button.dataset.page))));
slides.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => updatePage(Math.round(slides.scrollLeft / slides.clientWidth)), 120);
}, { passive: true });
slides.addEventListener('keydown', event => {
  const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
  if (event.key in targets) {
    event.preventDefault();
    goTo(targets[event.key]);
  }
});
window.addEventListener('resize', () => slides.scrollTo({ left: current * slides.clientWidth, behavior: 'instant' }));

document.querySelector('#copy-request').addEventListener('click', async () => {
  const text = document.querySelector('#request-text');
  const copyStatus = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(text.value);
    copyStatus.textContent = '요청 문구를 복사했어요.';
    document.querySelector('#copy-fallback').hidden = true;
  } catch {
    document.querySelector('#copy-fallback').hidden = false;
    copyStatus.textContent = '아래 문구를 직접 복사해주세요.';
    text.focus();
    text.select();
  }
});
