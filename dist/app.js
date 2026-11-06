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
const priority = document.querySelector('#priority');
const whatsappLink = dialog.querySelector('a[href^="https://wa.me/"]');
const messageStatus = dialog.querySelector('.copy-status');
const priorityMessages = {
  'Quero conhecer as opções': 'Gostaria de conhecer os modelos e as opções disponíveis.',
  'Melhor custo-benefício': 'Procuro uma opção com o melhor custo-benefício.',
  'Câmera e fotografia': 'Minha prioridade é câmera e qualidade das fotos.',
  'Desempenho no dia a dia': 'Minha prioridade é um bom desempenho no dia a dia.',
  'Presente para alguém': 'Estou procurando um presente para alguém e gostaria de ajuda para escolher.',
};
function consultMessage() {
  return `Olá, Catphone! Tenho interesse em ${document.querySelector('#interest').textContent}. ${priorityMessages[priority.value] || priorityMessages['Quero conhecer as opções']} Podem me ajudar com as opções e os valores?`;
}
function updateConsultMessage() {
  const message = consultMessage();
  whatsappLink.href = `https://wa.me/5586999197393?text=${encodeURIComponent(message)}`;
  messageStatus.textContent = message;
}
priority.addEventListener('change', updateConsultMessage);

document.querySelectorAll('[data-consult]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#interest').textContent = button.dataset.consult;
  updateConsultMessage();
  dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#copy-message').addEventListener('click', async () => {
  const message = consultMessage();
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText(message); status.textContent = 'Mensagem copiada! Ela também já está pronta no botão do WhatsApp.'; }
  catch { status.textContent = message; }
});
document.querySelector('#year').textContent = new Date().getFullYear();
