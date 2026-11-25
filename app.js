const tabList = document.querySelector('[role="tablist"]');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));

function selectTab(index, focus = false) {
  tabs.forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[i].hidden = !selected;
  });
  if (focus) tabs[index].focus();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

tabs.forEach((tab, index) => tab.addEventListener('click', () => selectTab(index)));
tabList.addEventListener('keydown', event => {
  const current = tabs.indexOf(event.target);
  if (current < 0) return;
  const targets = {
    ArrowLeft: (current + tabs.length - 1) % tabs.length,
    ArrowRight: (current + 1) % tabs.length,
    Home: 0,
    End: tabs.length - 1,
  };
  if (event.key in targets) {
    event.preventDefault();
    selectTab(targets[event.key], true);
  }
});

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
