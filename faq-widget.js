/* =====================================================================
   Floating FAQ Chatbot Widget  —  static, button-driven (no LLM)
   Embed on any site:
     <script>window.NovaFAQ = { ...config... };</script>
     <script src="https://prixieroxanbooc.github.io/portfolio/faq-widget.js"></script>
   Self-contained: renders into a Shadow DOM so host-page CSS can't clash.
   ===================================================================== */
(function () {
  'use strict';

  const DEFAULT = {
    brand: 'NovaBank',
    tagline: 'Banking Built Around You',
    accent: '#0047AB',
    logo: null,
    greeting: 'Hi! 👋 I can help with common questions. Pick a topic to get started.',
    cta: { label: '✨ Want this on your site? Build your own →', url: 'https://prixieroxanbooc.github.io/portfolio/faq-builder.html' },
    categories: [
      { name: 'General', items: [
        { q: 'What is Novabank?', a: 'Novabank is a modern digital banking platform that helps individuals and businesses manage finances securely through digital accounts, payments, transfers, savings products, and API-powered banking solutions.' },
        { q: 'Is Novabank a traditional bank?', a: 'Novabank operates as a digital-first financial institution. You can access banking services online and via mobile without visiting a physical branch.' },
        { q: 'Who can open a Novabank account?', a: 'Individuals, freelancers, entrepreneurs, SMEs, corporations, and fintech partners may apply, depending on eligibility requirements.' },
        { q: 'Is my money secure with Novabank?', a: 'Yes. Novabank uses industry-standard encryption, multi-factor authentication, fraud monitoring, and secure infrastructure to protect accounts and transactions.' },
        { q: 'How do I contact support?', a: 'You can reach us via:\n• Live Chat\n• Email Support\n• Help Center\n• Mobile App Support\n• Dedicated Relationship Managers (business accounts)' },
      ]},
      { name: 'Account Services', items: [
        { q: 'How do I open an account?', a: '1. Download the Novabank App\n2. Complete the registration form\n3. Upload required ID documents\n4. Complete identity verification\n5. Wait for account approval' },
        { q: 'What documents are required?', a: '• Government-issued ID\n• Selfie verification\n• Proof of address\n• Business registration documents (for businesses)' },
        { q: 'How long does approval take?', a: 'Most personal accounts are approved within 24 hours. Business accounts may need additional verification and review.' },
        { q: 'Can I have multiple accounts?', a: 'Yes. Eligible customers may open multiple accounts for personal, business, savings, or operational purposes.' },
        { q: 'How do I update my account information?', a: 'Update your details in the Novabank app or by contacting customer support.' },
      ]},
      { name: 'Payments & Transfers', items: [
        { q: 'How do I transfer funds?', a: 'You can transfer via:\n• Bank-to-bank transfers\n• QR payments\n• Mobile wallet transfers\n• Internal Novabank transfers' },
        { q: 'Are transfers processed instantly?', a: 'Most transfers are processed in real time, though some partner institutions may experience delays.' },
        { q: 'Is there a daily transfer limit?', a: 'Yes. Transfer limits vary based on account type and verification level.' },
        { q: 'What should I do if a transfer fails?', a: 'Check your balance, recipient details, and network status. If the issue persists, contact support with the transaction reference number.' },
        { q: 'Can I schedule future payments?', a: 'Yes. You can schedule recurring or one-time future payments directly from your dashboard.' },
      ]},
      { name: 'Savings', items: [
        { q: 'Does Novabank offer savings accounts?', a: 'Yes. Novabank offers digital savings accounts designed to help you grow funds while keeping easy access.' },
        { q: 'Is there a minimum maintaining balance?', a: 'Some account types have no maintaining balance, while premium accounts may have minimum requirements.' },
        { q: 'Can I create savings goals?', a: 'Yes. Create personalized savings goals and track progress within the mobile app.' },
        { q: 'How is interest calculated?', a: 'Interest is calculated based on the account product and applicable terms and conditions.' },
        { q: 'When is interest credited?', a: 'Interest is typically credited monthly, subject to product terms.' },
      ]},
      { name: 'Business Banking', items: [
        { q: 'What business solutions does Novabank offer?', a: '• Business accounts\n• Collections\n• Disbursements\n• Payroll services\n• Merchant payments\n• API banking services' },
        { q: 'Can startups open an account?', a: 'Yes. Registered startups and growing businesses may apply for Novabank business banking services.' },
        { q: 'Does Novabank support bulk payments?', a: 'Yes. Businesses can upload payment batches for payroll, vendor payments, and mass disbursements.' },
        { q: 'Can I connect my accounting software?', a: 'Novabank offers integrations and APIs to connect accounting and ERP systems.' },
        { q: 'Is there a dedicated support team for businesses?', a: 'Yes. Business clients may receive support from dedicated account managers depending on their package.' },
      ]},
      { name: 'API & Fintech', items: [
        { q: 'Does Novabank provide APIs?', a: 'Yes. Novabank offers developer-friendly APIs for payments, account services, transfers, transaction history, and other banking capabilities.' },
        { q: 'Who can access the APIs?', a: 'Approved fintechs, platforms, enterprises, and business partners may request API access.' },
        { q: 'How do I obtain API credentials?', a: 'After approval and onboarding, API credentials are provided through the Novabank Developer Portal.' },
        { q: 'Is there a sandbox environment?', a: 'Yes. Developers can test integrations in a sandbox environment before going live.' },
        { q: 'How do I become a Novabank partner?', a: 'Submit a partnership inquiry through the Novabank Partnerships Team.' },
      ]},
      { name: 'Security & Compliance', items: [
        { q: 'How does Novabank protect customer accounts?', a: '• Multi-factor authentication\n• Secure encryption\n• Device verification\n• Fraud detection systems\n• Continuous security monitoring' },
        { q: 'What if I suspect unauthorized activity?', a: 'Immediately lock your account (if available), change your password, and contact Novabank Support.' },
        { q: 'Can I reset my password online?', a: 'Yes. Password resets can be completed through the mobile app or web portal.' },
        { q: 'How does Novabank verify identities?', a: 'Identity verification uses document validation, facial recognition, and fraud-prevention checks.' },
        { q: 'Does Novabank comply with regulations?', a: 'Yes. Novabank follows applicable banking, security, privacy, and anti-money-laundering regulations.' },
      ]},
      { name: 'Troubleshooting', items: [
        { q: "I can't log in. What should I do?", a: '• Verify your credentials\n• Reset your password\n• Check your internet connection\n• Update your app' },
        { q: 'Why is my account under review?', a: 'Accounts may be reviewed for security, compliance, or verification purposes.' },
        { q: 'Why was my transaction declined?', a: 'Possible reasons:\n• Insufficient balance\n• Incorrect account information\n• Security restrictions\n• Daily limit exceeded' },
        { q: 'Where can I see my transaction history?', a: 'Transaction history is available in the Novabank mobile app and online banking portal.' },
        { q: 'How can I provide feedback?', a: 'Submit feedback through the Help Center, support channels, or customer satisfaction surveys.' },
      ]},
    ],
  };

  // ---- helpers ----
  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  // safe multi-line text → fragment with <br>, auto-linking URLs & emails
  const LINK_RE = /(https?:\/\/[^\s]+|www\.[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  function appendLinked(parent, line) {
    let last = 0, m; LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(line))) {
      if (m.index > last) parent.appendChild(document.createTextNode(line.slice(last, m.index)));
      const tok = m[0];
      const isEmail = tok.indexOf('@') > -1 && !/^(https?:|www\.)/.test(tok);
      const a = document.createElement('a');
      a.href = isEmail ? 'mailto:' + tok : (/^https?:/.test(tok) ? tok : 'https://' + tok);
      a.textContent = tok; a.target = '_blank'; a.rel = 'noopener';
      a.style.color = 'inherit'; a.style.textDecoration = 'underline';
      parent.appendChild(a);
      last = m.index + tok.length;
    }
    if (last < line.length) parent.appendChild(document.createTextNode(line.slice(last)));
  }
  function textFrag(str) {
    const frag = document.createDocumentFragment();
    String(str).split('\n').forEach((line, i) => {
      if (i) frag.appendChild(document.createElement('br'));
      appendLinked(frag, line);
    });
    return frag;
  }
  function initials(name) { return (name || 'F').trim().charAt(0).toUpperCase(); }

  function styles(accent) {
    return `
      :host { all: initial; cursor: auto; }
      *, *::before, *::after { box-sizing: border-box; }
      .root { font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif; }
      /* keep a normal cursor inside the widget even if the host page hides it (e.g. custom cursor) */
      .root, .panel, .head, .body, .bubble, .label, .empty, .foot, .chips { cursor: auto; }
      .fab, .chip, .qbtn, .back, .x, .cta-btn { cursor: pointer; }
      .search { cursor: text; }
      .cta-btn { display:inline-block; margin:2px 0 14px; background:${accent}; color:#fff; font-weight:600; font-size:13.5px; padding:9px 14px; border-radius:10px; text-decoration:none; }
      .cta-btn:hover { filter: brightness(1.08); }
      .fab {
        position: fixed; bottom: 22px; right: 22px; width: 60px; height: 60px;
        border-radius: 50%; border: none; cursor: pointer; z-index: 2147483000;
        background: ${accent}; color: #fff; box-shadow: 0 10px 28px -8px rgba(0,0,0,.4);
        display: grid; place-items: center; transition: transform .15s, box-shadow .15s;
      }
      .fab:hover { transform: translateY(-2px) scale(1.04); }
      .fab svg { width: 28px; height: 28px; }
      .panel {
        position: fixed; bottom: 94px; right: 22px; width: 374px; max-width: calc(100vw - 32px);
        height: 560px; max-height: calc(100vh - 130px); z-index: 2147483000;
        background: #fff; border-radius: 18px; overflow: hidden; display: flex; flex-direction: column;
        box-shadow: 0 24px 60px -20px rgba(10,20,50,.45); border: 1px solid #e6eaf2;
        opacity: 0; transform: translateY(12px) scale(.98); pointer-events: none; transition: .18s ease;
      }
      .panel.open { opacity: 1; transform: none; pointer-events: auto; }
      .head { background: ${accent}; color: #fff; padding: 16px 16px 14px; display: flex; align-items: center; gap: 11px; }
      .logo { width: 36px; height: 36px; border-radius: 9px; background: rgba(255,255,255,.18); display: grid; place-items: center; font-weight: 700; font-size: 17px; overflow: hidden; flex: 0 0 auto; }
      .logo img { width: 100%; height: 100%; object-fit: contain; }
      .htext b { font-size: 15.5px; font-weight: 700; display: block; line-height: 1.1; }
      .htext span { font-size: 11.5px; opacity: .85; }
      .x { margin-left: auto; background: rgba(255,255,255,.15); border: none; color: #fff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 16px; line-height: 1; }
      .x:hover { background: rgba(255,255,255,.28); }
      .body { flex: 1; overflow-y: auto; padding: 16px; background: #f6f8fc; }
      .search { width: 100%; padding: 9px 12px; border: 1px solid #dce3ee; border-radius: 10px; font-size: 13.5px; margin-bottom: 12px; font-family: inherit; }
      .search:focus { outline: 2px solid ${accent}22; border-color: ${accent}; }
      .bubble { background: #fff; border: 1px solid #e6eaf2; border-radius: 12px; border-bottom-left-radius: 4px; padding: 11px 13px; font-size: 13.5px; line-height: 1.5; color: #1a2030; margin-bottom: 12px; max-width: 92%; }
      .bubble.user { background: ${accent}; color: #fff; border: none; border-radius: 12px; border-bottom-right-radius: 4px; margin-left: auto; max-width: 85%; }
      .label { font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #5b6577; margin: 4px 0 8px; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
      .chip { background: #fff; border: 1px solid #dce3ee; color: ${accent}; font-weight: 600; font-size: 12.5px; padding: 7px 13px; border-radius: 999px; cursor: pointer; font-family: inherit; }
      .chip:hover { border-color: ${accent}; background: ${accent}0d; }
      .qbtn { display: block; width: 100%; text-align: left; background: #fff; border: 1px solid #e6eaf2; border-radius: 10px; padding: 11px 13px; font-size: 13.5px; color: #1a2030; cursor: pointer; margin-bottom: 8px; font-family: inherit; line-height: 1.4; }
      .qbtn:hover { border-color: ${accent}; background: ${accent}0a; }
      .back { background: none; border: none; color: ${accent}; font-weight: 600; font-size: 12.5px; cursor: pointer; padding: 0 0 10px; font-family: inherit; }
      .foot { padding: 9px 14px; border-top: 1px solid #eef1f7; font-size: 11px; color: #8a93a3; text-align: center; background:#fff; }
      .empty { color: #8a93a3; font-size: 13px; padding: 6px 2px; }
    `;
  }

  const ICON_CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  const ICON_X = '✕';

  function init(userCfg) {
    const cfg = Object.assign({}, DEFAULT, userCfg || {});
    cfg.categories = (userCfg && userCfg.categories && userCfg.categories.length) ? userCfg.categories : DEFAULT.categories;

    // remove a prior instance (used by the live builder)
    const prior = document.getElementById('nova-faq-host');
    if (prior) prior.remove();

    const host = el('div', { id: 'nova-faq-host' });
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style'); style.textContent = styles(cfg.accent || '#0047AB');
    root.appendChild(style);

    const wrap = el('div', { class: 'root' });
    root.appendChild(wrap);

    // launcher
    const fab = el('button', { class: 'fab', 'aria-label': 'Open help' }, ICON_CHAT);
    wrap.appendChild(fab);

    // panel
    const panel = el('div', { class: 'panel' });
    const logoInner = cfg.logo ? `<img src="${cfg.logo}" alt="">` : initials(cfg.brand);
    panel.appendChild(el('div', { class: 'head' },
      `<div class="logo">${logoInner}</div>
       <div class="htext"><b>${escapeHtml(cfg.brand)}</b><span>${escapeHtml(cfg.tagline || '')}</span></div>
       <button class="x" aria-label="Close">${ICON_X}</button>`));
    const body = el('div', { class: 'body' });
    panel.appendChild(body);
    panel.appendChild(el('div', { class: 'foot' }, 'FAQ assistant · ' + escapeHtml(cfg.brand)));
    wrap.appendChild(panel);

    function escapeHtmlLocal() {}
    function open() { panel.classList.add('open'); }
    function close() { panel.classList.remove('open'); }
    fab.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelector('.x').addEventListener('click', close);

    // ---- views ----
    function home() {
      body.innerHTML = '';
      const greet = el('div', { class: 'bubble' }); greet.appendChild(textFrag(cfg.greeting)); body.appendChild(greet);
      if (cfg.cta && cfg.cta.url) {
        body.appendChild(el('a', { class: 'cta-btn', href: cfg.cta.url, target: '_blank', rel: 'noopener' }, escapeHtml(cfg.cta.label || 'Learn more')));
      }
      const search = el('input', { class: 'search', type: 'text', placeholder: 'Search questions…' });
      body.appendChild(search);
      search.addEventListener('input', () => {
        const term = search.value.trim().toLowerCase();
        if (!term) { renderCats(); return; }
        const hits = [];
        cfg.categories.forEach(c => c.items.forEach(it => {
          if (it.q.toLowerCase().includes(term) || it.a.toLowerCase().includes(term)) hits.push(it);
        }));
        renderResults(hits.slice(0, 12));
      });
      const catsHost = el('div'); body.appendChild(catsHost);
      function renderCats() {
        catsHost.innerHTML = '';
        catsHost.appendChild(el('div', { class: 'label' }, 'Browse topics'));
        const chips = el('div', { class: 'chips' });
        cfg.categories.forEach((c, i) => {
          const chip = el('button', { class: 'chip' }, escapeHtml(c.name));
          chip.addEventListener('click', () => category(i));
          chips.appendChild(chip);
        });
        catsHost.appendChild(chips);
      }
      function renderResults(hits) {
        catsHost.innerHTML = '';
        catsHost.appendChild(el('div', { class: 'label' }, hits.length ? 'Matches' : 'No matches'));
        if (!hits.length) { catsHost.appendChild(el('div', { class: 'empty' }, 'Try another keyword or browse topics.')); return; }
        hits.forEach(it => {
          const b = el('button', { class: 'qbtn' }, escapeHtml(it.q));
          b.addEventListener('click', () => answer(it));
          catsHost.appendChild(b);
        });
      }
      renderCats();
    }

    function category(i) {
      const c = cfg.categories[i];
      body.innerHTML = '';
      const back = el('button', { class: 'back' }, '← All topics'); back.addEventListener('click', home); body.appendChild(back);
      body.appendChild(el('div', { class: 'label' }, escapeHtml(c.name)));
      c.items.forEach(it => {
        const b = el('button', { class: 'qbtn' }, escapeHtml(it.q));
        b.addEventListener('click', () => answer(it, i));
        body.appendChild(b);
      });
    }

    function answer(it, catIndex) {
      body.innerHTML = '';
      const back = el('button', { class: 'back' }, '← Back');
      back.addEventListener('click', () => (catIndex != null ? category(catIndex) : home()));
      body.appendChild(back);
      const u = el('div', { class: 'bubble user' }); u.textContent = it.q; body.appendChild(u);
      const a = el('div', { class: 'bubble' }); a.appendChild(textFrag(it.a)); body.appendChild(a);
      const more = el('div', { class: 'chips' });
      const c1 = el('button', { class: 'chip' }, 'Ask another'); c1.addEventListener('click', home); more.appendChild(c1);
      body.appendChild(more);
      body.scrollTop = body.scrollHeight;
    }

    home();
    return { open, close, destroy: () => host.remove() };
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.NovaFAQWidget = { init: init, default: DEFAULT };

  if (!window.NOVA_FAQ_NO_AUTOINIT) {
    const boot = () => init(window.NovaFAQ || DEFAULT);
    if (document.readyState !== 'loading') boot();
    else document.addEventListener('DOMContentLoaded', boot);
  }
})();
