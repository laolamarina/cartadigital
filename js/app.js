'use strict';
/* BLINK MENÚ — Lógica de carta, animaciones, carrito y envío de pedidos */
(() => {
  const config = window.RESTAURANTE;
  const products = window.PRODUCTOS;
  const categories = window.CATEGORIAS;
  const slides = window.BANNERS;
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => [...ctx.querySelectorAll(s)];
  const money = n => `${config.moneda} ${Number(n).toFixed(2)}`;
  const esc = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getProduct = id => products.find(p => p.id === id);
  let slideIndex=0, slideTimer, toastTimer, modalProduct=null, modalQty=1;
  let cart=[];
  try { const saved=JSON.parse(localStorage.getItem('blink-laolamarina-cart-v1')||'[]'); if(Array.isArray(saved)) cart=saved.filter(x=>getProduct(x.id)&&Number.isInteger(x.qty)&&x.qty>0).slice(0,80); } catch(e) { cart=[]; }
  const count = () => cart.reduce((a,x)=>a+x.qty,0);
  const subtotal = () => cart.reduce((a,x)=>a+getProduct(x.id).precio*x.qty,0);
  const save = () => {try{localStorage.setItem('blink-laolamarina-cart-v1',JSON.stringify(cart))}catch(e){} updateCounts();renderCart();};
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
  function updateCounts(){ $('#cartCount').textContent=count();$('#mobileCount').textContent=count();$('#mobileTotal').textContent=money(subtotal());$('#finalTotal').textContent=money(subtotal()); }
  function placeholderFor(p){return `img/plato-${p.id}.svg`;}
  function imageTag(p,clazz='',loading='lazy'){
    return `<img class="${clazz}" src="${esc(p.imagen||placeholderFor(p))}" alt="Foto ilustrativa de ${esc(p.nombre)}" loading="${loading}" onerror="this.onerror=null;this.src='${placeholderFor(p)}'" />`;
  }
  function renderMenu(){
    $('#categoryNav').innerHTML=categories.map((cat,i)=>`<a href="#${cat.id}" class="category-pill ${i===0?'active':''}" data-nav="${cat.id}"><span class="category-pill-icon" aria-hidden="true">${cat.icon}</span><span><strong>${esc(cat.nombre)}</strong><small>${esc(cat.subtitulo)}</small></span></a>`).join('');
    $('#menuRoot').innerHTML=categories.map(cat=>{
      const items=products.filter(p=>p.categoria===cat.id);
      return `<section id="${cat.id}" class="menu-section" data-section="${cat.id}" aria-labelledby="title-${cat.id}"><div class="section-head"><div class="section-head-left"><span class="section-icon" aria-hidden="true">${cat.icon}</span><div><h3 id="title-${cat.id}">${esc(cat.nombre)}</h3><p>${esc(cat.descripcion)}</p></div></div><span class="section-count">${items.length} ${items.length===1?'OPCIÓN':'OPCIONES'}</span></div><div class="products-grid">${items.map((p,i)=>`<article class="product-card reveal ${p.popular?'featured-product':''}" data-product="${p.id}" data-category="${p.categoria}" style="--reveal-delay:${(i%3)*70}ms" tabindex="0" role="button" aria-label="Ver ${esc(p.nombre)}"><div class="product-photo ${!p.imagen?'is-illustrated':''}">${imageTag(p)}${p.tag?`<span class="product-tag">✳ ${esc(p.tag)}</span>`:''}</div><div class="product-info"><h4>${esc(p.nombre)}</h4><p>${esc(p.descripcion)}</p><div class="product-bottom"><strong class="menu-price">${money(p.precio)}</strong><button class="add-product" type="button" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span>+</span> Agregar</button></div></div></article>`).join('')}</div></section>`;
    }).join('');
    // Reveal suave al entrar a pantalla; respeta preferencias de movimiento.
    if('IntersectionObserver' in window&&!reduced){
      const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}})}, {threshold:.07,rootMargin:'0px 0px -30px 0px'});
      $$('.reveal').forEach(el=>observer.observe(el));
    } else $$('.reveal').forEach(el=>el.classList.add('in-view'));
  }
  // Banner con 3 diapositivas; autoplay, flechas y puntos.
  function setSlide(i){
    slideIndex=(i+slides.length)%slides.length;
    const slide=slides[slideIndex];
    $('.hero').dataset.theme=slide.color;
    $('#heroKicker').textContent=slide.kicker;$('#heroFirst').textContent=slide.first;$('#heroAccent').textContent=slide.accent;$('#heroLast').textContent=slide.last;$('#heroText').textContent=slide.text;$('#heroCta').innerHTML=`${esc(slide.cta)} <span aria-hidden="true">↗</span>`;$('#heroCta').href='#'+(slide.anchor||'carta');$('#heroTag').textContent=slide.tag;$('#heroIndex').textContent=`0${slideIndex+1} / 0${slides.length}`;
    const img=$('#heroPhoto');img.src=slide.image;img.alt=slide.imageAlt;img.onerror=()=>{img.onerror=null;img.src=slide.fallback||'img/plato-c1.svg';};
    $('#heroPagination').innerHTML=slides.map((_,n)=>`<button aria-label="Ver banner ${n+1}" class="${n===slideIndex?'active':''}" data-slide="${n}" ${n===slideIndex?'aria-current="true"':''}></button>`).join('');
    $('#heroCopy').classList.remove('switching');$('#heroVisual').classList.remove('switching');void $('#heroCopy').offsetWidth;
    if(!reduced){$('#heroCopy').classList.add('switching');$('#heroVisual').classList.add('switching');setTimeout(()=>{$('#heroCopy').classList.remove('switching');$('#heroVisual').classList.remove('switching');},680);}
  }
  function resetSlideTimer(){clearInterval(slideTimer);if(!reduced)slideTimer=setInterval(()=>setSlide(slideIndex+1),6300)}
  function modalOpen(id){
    const p=getProduct(id);if(!p)return;modalProduct=p;modalQty=1;
    $('#modalProductName').textContent=p.nombre;$('#modalDesc').textContent=p.descripcion;
    $('#modalImg').innerHTML=imageTag(p,'','eager');$('#modalNote').value='';
    $$('input[name="spicy"]').forEach((r,i)=>r.checked=i===0);
    $('#spicyGroup').hidden=p.categoria!=='ceviches';
    $('#modalQty').textContent=modalQty;$('#modalPrice').textContent=money(p.precio);
    $('#productOverlay').hidden=false;$('#productModal').classList.add('open');$('#productModal').setAttribute('aria-hidden','false');document.body.classList.add('lock-scroll');$('#closeProduct').focus();
  }
  function modalClose(){ $('#productModal').classList.remove('open');$('#productModal').setAttribute('aria-hidden','true');$('#productOverlay').hidden=true;document.body.classList.remove('lock-scroll');}
  function changeModalQty(delta){modalQty=Math.max(1,Math.min(30,modalQty+delta));$('#modalQty').textContent=modalQty;$('#modalPrice').textContent=money(modalProduct.precio*modalQty)}
  function addProduct(){
    if(!modalProduct)return;
    const spicy=modalProduct.categoria==='ceviches'?$('input[name="spicy"]:checked').value:'';
    const note=$('#modalNote').value.trim().slice(0,120);
    const key=`${modalProduct.id}|${spicy}|${note}`;
    const existing=cart.find(x=>x.key===key);
    if(existing)existing.qty=Math.min(99,existing.qty+modalQty);else cart.push({key,id:modalProduct.id,qty:modalQty,spicy,note});
    save();modalClose();toast(`✓ ${modalProduct.nombre} agregado al pedido`);
  }
  function renderCart(){
    const isEmpty=!cart.length;
    $('#checkoutForm').hidden=isEmpty;$('#cartSummary').hidden=isEmpty;
    $('#sendOrder').disabled=isEmpty;
    if(isEmpty){$('#cartItems').innerHTML=`<div class="cart-empty"><div class="cart-empty-icon">🛍️</div><h3>Tu carrito está esperando</h3><p>Elige unos platos ricos y arma tu pedido aquí.</p><button class="empty-cta" id="goMenu" type="button">Explorar la carta →</button></div>`;}
    else $('#cartItems').innerHTML=cart.map(item=>{const p=getProduct(item.id);return `<div class="cart-item" data-cartkey="${esc(item.key)}">${imageTag(p,'cart-item-image')}<div class="cart-item-main"><h4>${esc(p.nombre)}</h4><p>${[item.spicy,item.note].filter(Boolean).map(esc).join(' · ')||'Sin indicaciones'}</p><div class="cart-qty"><button data-qty="minus" data-key="${esc(item.key)}" aria-label="Quitar una unidad">−</button><span>${item.qty}</span><button data-qty="plus" data-key="${esc(item.key)}" aria-label="Sumar una unidad">+</button></div></div><div style="text-align:right"><strong class="cart-item-price">${money(p.precio*item.qty)}</strong><br><button class="remove-item" data-remove="${esc(item.key)}">Quitar</button></div></div>`}).join('');
    $('#cartSummary').innerHTML=`<div class="cart-summary-row"><span>${count()} producto${count()===1?'':'s'}</span><span>${money(subtotal())}</span></div><div class="cart-summary-row"><span>Envío</span><span>A coordinar</span></div><div class="cart-summary-row"><span>Subtotal</span><span>${money(subtotal())}</span></div>`;
    updateCountsOnly();
  }
  function updateCountsOnly(){ $('#cartCount').textContent=count();$('#mobileCount').textContent=count();$('#mobileTotal').textContent=money(subtotal());$('#finalTotal').textContent=money(subtotal()); }
  function changeCart(key,delta){const item=cart.find(x=>x.key===key);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.key!==key);item.qty=Math.min(item.qty,99);save()}
  function openCart(){
    modalClose();$('#drawerOverlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.classList.add('lock-scroll');$('#closeCart').focus();
  }
  function closeCart(){
    $('#drawerOverlay').hidden=true;$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');document.body.classList.remove('lock-scroll');
  }
  function updateFulfillment(){
    const type=$('input[name="fulfillment"]:checked').value;
    $('#deliveryFields').hidden=type!=='delivery';$('#pickupFields').hidden=type==='delivery';
    $('#deliveryAddress').required=type==='delivery';$('#pickupBranch').required=type!=='delivery';$('#pickupTime').required=type!=='delivery';
  }
  function buildOrder(){
    const name=$('#customerName').value.trim(),phone=$('#customerPhone').value.trim(),type=$('input[name="fulfillment"]:checked').value,payment=$('input[name="payment"]:checked').value;
    if(!cart.length){toast('Agrega al menos un plato para continuar.');return null}
    if(!name){$('#customerName').focus();toast('Ingresa tu nombre.');return null;}
    if(!/^[+\d\s()\-]{7,20}$/.test(phone)||phone.replace(/\D/g,'').length<7){$('#customerPhone').focus();toast('Ingresa un celular válido.');return null;}
    let reception='';
    if(type==='delivery'){
      const addr=$('#deliveryAddress').value.trim();if(!addr){$('#deliveryAddress').focus();toast('Ingresa tu dirección de entrega.');return null;}
      reception=`🛵 Delivery\n📍 Dirección: ${addr}\nCosto de envío: por confirmar`;
    } else {
      const branch=$('#pickupBranch').value, time=$('#pickupTime').value;
      if(!branch||!time){$('#pickupTime').focus();toast('Selecciona sede y hora de recojo.');return null;}
      reception=`${type==='recojo'?'🏬 Recojo en tienda':'🕒 Preparar para recojo'}\n📍 Sede: ${branch}\n🕒 Hora solicitada: ${time}`;
    }
    const lines=cart.map(item=>{const p=getProduct(item.id);const extra=[item.spicy,item.note].filter(Boolean).join(', ');return `• ${item.qty} x ${p.nombre} — ${money(p.precio*item.qty)}${extra?`\n   ↳ ${extra}`:''}`}).join('\n');
    const note=$('#checkoutNote').value.trim();
    return `🌊 *PEDIDO — ${config.nombre.toUpperCase()}*\n\n👤 *Cliente:* ${name}\n📱 *Celular:* ${phone}\n\n*PRODUCTOS*\n${lines}\n\n💰 *Subtotal:* ${money(subtotal())}\n\n*ENTREGA / RECOJO*\n${reception}\n\n💳 *Pago:* ${payment}${note?`\n📝 *Nota:* ${note}`:''}\n\n¡Hola! Deseo confirmar mi pedido. 😊`;
  }
  function submitOrder(){
    const text=buildOrder();if(!text)return;
    const digits=String(config.whatsapp||'').replace(/\D/g,'');
    const url=digits?`https://wa.me/${digits}?text=${encodeURIComponent(text)}`:`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    const newTab=window.open(url,'_blank','noopener,noreferrer');
    if(!newTab){window.location.href=url;}
    if(!digits){toast('Demo: falta configurar el número del local; selecciona un contacto en WhatsApp.');}
    else toast('Tu pedido se abrió en WhatsApp.');
  }
  function init(){
    document.title=`${config.nombre} · Carta interactiva`;
    // Identidad fija: el logo real de La Ola Marina se usa en cabecera y pie.
    $('#topHours').textContent=config.horario;$('#footerHours').textContent=config.horario;$('#footerAddress').textContent=config.direccion;
    $('#pickupBranch').innerHTML=config.sedes.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');
    renderMenu();setSlide(0);resetSlideTimer();renderCart();
    $('#prevSlide').addEventListener('click',()=>{setSlide(slideIndex-1);resetSlideTimer()});$('#nextSlide').addEventListener('click',()=>{setSlide(slideIndex+1);resetSlideTimer()});
    $('#heroPagination').addEventListener('click',e=>{const btn=e.target.closest('[data-slide]');if(btn){setSlide(Number(btn.dataset.slide));resetSlideTimer();}});
    $('#heroVisual').addEventListener('mouseenter',()=>clearInterval(slideTimer));$('#heroVisual').addEventListener('mouseleave',resetSlideTimer);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(slideTimer);else resetSlideTimer()});
    $('#categoryNav').addEventListener('click',e=>{const a=e.target.closest('[data-nav]');if(!a)return;$$('.category-pill').forEach(x=>x.classList.toggle('active',x===a));});
    $('#menuRoot').addEventListener('click',e=>{const btn=e.target.closest('[data-add]');if(btn){e.stopPropagation();modalOpen(btn.dataset.add);return;}const card=e.target.closest('[data-product]');if(card)modalOpen(card.dataset.product);});
    $('#menuRoot').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.product-card')){e.preventDefault();modalOpen(e.target.dataset.product)}});
    ['cartTrigger','mobileCart','bottomCart'].forEach(id=>$('#'+id).addEventListener('click',openCart));
    $('#closeCart').addEventListener('click',closeCart);$('#drawerOverlay').addEventListener('click',closeCart);
    $('#closeProduct').addEventListener('click',modalClose);$('#productOverlay').addEventListener('click',modalClose);
    $('#modalMinus').addEventListener('click',()=>changeModalQty(-1));$('#modalPlus').addEventListener('click',()=>changeModalQty(1));$('#confirmAdd').addEventListener('click',addProduct);
    $('#cartItems').addEventListener('click',e=>{const q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');if(q)changeCart(q.dataset.key,q.dataset.qty==='plus'?1:-1);if(r){cart=cart.filter(x=>x.key!==r.dataset.remove);save();}if(e.target.closest('#goMenu')){closeCart();$('#carta').scrollIntoView({behavior:reduced?'instant':'smooth'})}});
    $$('input[name="fulfillment"]').forEach(e=>e.addEventListener('change',updateFulfillment));updateFulfillment();
    $('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();submitOrder()});$('#sendOrder').addEventListener('click',submitOrder);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#productModal').classList.contains('open'))modalClose();else if($('#cartDrawer').classList.contains('open'))closeCart();}});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
