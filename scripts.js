// UI helpers for header, forms, small niceties
document.addEventListener('DOMContentLoaded', function(){
  // year
  document.querySelectorAll('#yr,#yr2,#yr3,#yr4,#yr5').forEach(n => {
    if(n) n.textContent = new Date().getFullYear();
  });

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  if(navToggle){
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if(navMobile) navMobile.hidden = expanded;
    });
  }

  // Formspree forms: show simple toast feedback
  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 2200);
  }

  // AJAX submit for forms handled through Formspree endpoints
  document.querySelectorAll('form[action^="https://formspree.io"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formEl = e.target;
      // simple validation
      const email = formEl.querySelector('input[type="email"]');
      if(email && (!email.value || !email.value.includes('@'))){
        showToast('Please enter a valid email.');
        email.focus();
        return;
      }
      try {
        const resp = await fetch(formEl.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(formEl)
        });
        if(resp.ok){
          showToast('Thanks — we received your request.');
          formEl.reset();
        } else {
          const data = await resp.json().catch(()=>null);
          let msg = 'Submission failed. Try again.';
          if(data && data.errors && data.errors.length) msg = data.errors.map(x => x.message).join(' ');
          showToast(msg);
        }
      } catch(err){
        showToast('Network error. Try again later.');
      }
    });
  });

});
