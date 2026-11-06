const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('open', expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open');
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  document.querySelectorAll('.product').forEach(product => {
    product.hidden = button.dataset.filter !== 'all' && product.dataset.category !== button.dataset.filter;
  });
}));
const dialog = document.querySelector('#consult-dialog');
document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#interest').textContent = button.dataset.consult;
  document.querySelector('.copy-status').textContent = 'Copie seu interesse e envie para a equipe na conversa.';
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#copy-message').addEventListener('click', async () => {
  const message = `Olá, Cat Phone! Tenho interesse em ${document.querySelector('#interest').textContent}. Minha prioridade: ${document.querySelector('#priority').value}. Quais são as opções disponíveis?`;
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText(message); status.textContent = 'Interesse copiado! Agora abra o WhatsApp e cole na conversa.'; }
  catch { status.textContent = message; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
