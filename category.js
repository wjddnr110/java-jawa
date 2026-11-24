/**
 * category.js  —  Java & Jawa
 * Shared script for all 7 category pages:
 * dining / bar-game / entertainment / occasional / accents / home-office / bedroom
 *
 * Responsibilities:
 *  1. Navbar scroll shadow
 *  2. Mobile menu toggle
 *  3. Scroll-triggered fade-up
 *  4. Product card click → product.html?sku=XXX
 *  5. Subtype filter chips
 *  6. Sort select
 *  7. "Load more" (pagination stub)
 */

/* ── 1. NAVBAR ─────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    mobileNav.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
});

/* ── 2. FADE-UP ────────────────────────────────────────── */
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.08 });

function observeFades() {
    document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

/* ── 3. PRODUCT CARD CLICK ─────────────────────────────── */
/*
 * Cards are <a> elements with href="product.html?sku=XXX"
 * This handler is a safety net in case a card was built without href.
 * Priority: card.href → data-sku attr → h3 text content
 */
document.addEventListener('click', e => {
    const card = e.target.closest('.product-card, .pc, .sku-card');
    if (!card) return;

    // If the card already has a valid href, let the browser navigate normally
    if (card.tagName === 'A' && card.href &&
        !card.href.endsWith('#') &&
        card.href.includes('product.html')) return;

    e.preventDefault();

    let sku = card.dataset.sku
           || card.querySelector('[data-sku]')?.dataset.sku
           || card.querySelector('.sku-num')?.textContent?.trim()
           || card.querySelector('.piece-sku')?.textContent?.trim()
           || card.querySelector('h3')?.textContent?.replace(/[\[\]]/g, '').trim();

    if (sku && !sku.startsWith('[') && sku !== 'Product Item') {
        window.location.href = `product.html?sku=${encodeURIComponent(sku)}`;
    } else {
        window.location.href = 'products.html';
    }
});

/* ── 4. SUBTYPE FILTER ─────────────────────────────────── */
function initSubtypeFilter() {
    const btns  = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.product-card[data-subtype]');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const v = btn.dataset.filter;
            cards.forEach(c => {
                c.style.display = (v === 'all' || c.dataset.subtype === v) ? '' : 'none';
            });
        });
    });
}

/* ── 5. SORT ───────────────────────────────────────────── */
function initSort() {
    const sel  = document.getElementById('catSort');
    const grid = document.querySelector('.cat-product-grid, .sku-grid, .pd-pieces-grid');
    if (!sel || !grid) return;

    sel.addEventListener('change', () => {
        const cards = [...grid.querySelectorAll('.product-card')];
        cards.sort((a, b) => {
            const sa = a.dataset.sku || a.querySelector('h3')?.textContent || '';
            const sb = b.dataset.sku || b.querySelector('h3')?.textContent || '';
            return sel.value === 'asc' ? sa.localeCompare(sb)
                 : sel.value === 'desc' ? sb.localeCompare(sa) : 0;
        });
        cards.forEach(c => grid.appendChild(c));
    });
}

/* ── INIT ──────────────────────────────────────────────── */
observeFades();
initSubtypeFilter();
initSort();
