document.addEventListener("DOMContentLoaded", () => {
  const config=window.HPD_CONFIG;
  document.querySelectorAll(".logo img").forEach(image=>{
    image.src="https://www.hpdglass.com/wp-content/uploads/2025/06/Logo-tamano-2.svg";
    image.onerror=()=>{ image.onerror=null; image.src=image.src.includes("Logo-tamano-2") ? "/assets/images/brand/hpd-logo-transparent.png" : image.src; };
  });
  const legacyImages=[
    {match:/templad/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/04/Product-card.jpg"},
    {match:/laminad/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg"},
    {match:/insulad|aislant/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg"},
    {match:/low-?e/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/05/vpr042-2.jpg"},
    {match:/control solar/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/05/VPR036_F12-scaled.jpg"},
    {match:/muro cortina|mcf|mcs/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp"},
    {match:/ventana|vpr|vco/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/05/vco043_F-scaled.jpg"},
    {match:/pac|aluminio/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/05/pac-1-scaled.jpg"},
    {match:/especial|baranda|espejo|revestimiento/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/04/Product-card.jpg"},
    {match:/fachada contemporánea|proyecto arquitectónico/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp"},
    {match:/pardo|time|more|cl[ií]nica|pucp|proyecto/i,src:"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp"}
  ];
  const pageImages={
    "/productos/vidrio-templado/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Product-card.jpg",
    "/productos/vidrio-laminado/":"https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg",
    "/productos/vidrio-insulado/":"https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg",
    "/productos/vidrio-low-e/":"https://www.hpdglass.com/wp-content/uploads/2025/05/vpr042-2.jpg",
    "/productos/vidrio-control-solar/":"https://www.hpdglass.com/wp-content/uploads/2025/05/VPR036_F12-scaled.jpg",
    "/productos/pac/":"https://www.hpdglass.com/wp-content/uploads/2025/05/pac-1-scaled.jpg",
    "/productos/perfiles-aluminio/":"https://www.hpdglass.com/wp-content/uploads/2025/05/pac-1-scaled.jpg",
    "/productos/ventanas-corredizas/":"https://www.hpdglass.com/wp-content/uploads/2025/05/vco043_F-scaled.jpg",
    "/productos/ventanas-batientes/":"https://www.hpdglass.com/wp-content/uploads/2025/05/vpr042-2.jpg",
    "/productos/ventanas-fijas/":"https://www.hpdglass.com/wp-content/uploads/2025/05/VPR036_F12-scaled.jpg",
    "/productos/ventanas-proyectantes/":"https://www.hpdglass.com/wp-content/uploads/2025/05/vpr042-2.jpg",
    "/productos/muro-cortina-mcs034/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp",
    "/productos/muro-cortina-mcs035/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp",
    "/productos/muro-cortina-mcf034/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp",
    "/productos/muro-cortina-mcf045/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp",
    "/proyectos/pardo-200/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp",
    "/proyectos/time/":"https://www.hpdglass.com/wp-content/uploads/2025/05/intercontinental1.jpg",
    "/proyectos/centro-empresarial-more/":"https://www.hpdglass.com/wp-content/uploads/2025/05/pac-1-scaled.jpg",
    "/proyectos/clinica-internacional/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-1_11zon.webp",
    "/proyectos/centro-convenciones-pucp/":"https://www.hpdglass.com/wp-content/uploads/2025/05/IMG_0290-min_11zon-scaled.webp",
    "/nosotros/":"https://www.hpdglass.com/wp-content/uploads/2025/05/IMG_0290-min_11zon-scaled.webp",
    "/ingenieria/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Banner-principal-min_11zon.webp",
    "/centro-tecnico/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Frame-427324514.jpg",
    "/soluciones/":"https://www.hpdglass.com/wp-content/uploads/2025/04/Product-card.jpg"
  };
  const pagePath=location.pathname.replace(/.*\/(productos|proyectos)\//,"/$1/").replace(/index\.html$/,"/");
  const sectionPath=location.pathname.replace(/.*\/(nosotros|ingenieria|centro-tecnico|soluciones)\//,"/$1/").replace(/index\.html$/,"/");
  const sectionImage=location.pathname.includes("/nosotros")?pageImages["/nosotros/"]:location.pathname.includes("/ingenieria")?pageImages["/ingenieria/"]:location.pathname.includes("/centro-tecnico")?pageImages["/centro-tecnico/"]:location.pathname.includes("/soluciones")?pageImages["/soluciones/"]:null;
  document.querySelectorAll("img").forEach(image=>{
    const selectedImage=pageImages[pagePath]||pageImages[sectionPath]||sectionImage;
    if(selectedImage && !image.closest(".logo,.footer")){ image.src=selectedImage; image.removeAttribute("srcset"); return; }
    if(image.src.includes("hpdglass.com")) return;
    const text=`${image.alt||""} ${image.closest("a,article,figure")?.textContent||""}`;
    const match=legacyImages.find(item=>item.match.test(text));
    if(match){
      image.src=match.src;
      image.removeAttribute("srcset");
    }
  });
  const menuBtn = document.querySelector("[data-menu]");
  const nav = document.querySelector(".nav-links");
  const siteSearch=document.querySelector(".site-search");
  const siteSearchToggle=siteSearch?.querySelector(".site-search-toggle");
  const siteSearchInput=siteSearch?.querySelector("input");
  siteSearchToggle?.addEventListener("click",()=>{siteSearch.classList.toggle("is-open");if(siteSearch.classList.contains("is-open")) siteSearchInput?.focus();});
  siteSearchInput?.addEventListener("keydown",event=>{if(event.key==="Escape"){siteSearch.classList.remove("is-open");siteSearchInput.blur();}});
  if(nav){
    const productLink=nav.querySelector('a[href="/productos/"]');
    if(productLink&&!productLink.parentElement.classList.contains("nav-products")){
      const productMenu=document.createElement("div");
      productMenu.className="nav-products";
      productLink.replaceWith(productMenu);
      productMenu.innerHTML='<a href="/productos/" class="nav-products-link">Productos</a><div class="products-mega"><div><span class="mega-kicker">CATÁLOGO HPD</span><strong>Elige por sistema y desempeño.</strong><p>Soluciones para especificar fachadas, cerramientos y arquitectura interior.</p><a class="mega-all" href="/productos/">Ver catálogo completo <span>↗</span></a></div><div class="mega-columns"><div><span>Vidrios</span><a href="/productos/vidrio-templado/">Templado y laminado</a><a href="/productos/vidrio-low-e/">Low-E y control solar</a><a href="/productos/vidrio-insulado/">Insulado</a></div><div><span>Sistemas</span><a href="/productos/muro-cortina-mcs035/">Muro cortina</a><a href="/productos/ventanas-corredizas/">Ventanas y mamparas</a><a href="/productos/perfiles-aluminio/">Aluminio y PAC</a></div></div></div>';
    }
  }
  let menuOverlay;
  const closeMenu = () => {
    if(!nav || !menuBtn) return;
    nav.classList.remove("open");
    if(window.matchMedia("(max-width: 900px)").matches){
      nav.style.setProperty("transition", "none", "important");
      nav.style.setProperty("transform", "translateX(-105%)", "important");
    }else{
      nav.style.removeProperty("transition");
      nav.style.removeProperty("transform");
    }
    document.body.classList.remove("menu-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
    if(menuOverlay) menuOverlay.hidden=true;
    setMenuIcon(false);
  };
  const setMenuIcon = open => {
    if(!menuBtn) return;
    menuBtn.innerHTML=open ? '<svg class="icon icon-lg" aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' : '<svg class="icon icon-lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  };
  const heroHeader = document.querySelector(".site-header-hero");
  if(heroHeader){
    const syncHeaderState = () => heroHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, {passive:true});
  }
  if(menuBtn && nav){
    setMenuIcon(false);
    menuOverlay=document.createElement("button");
    menuOverlay.className="menu-overlay";
    menuOverlay.type="button";
    menuOverlay.setAttribute("aria-label", "Cerrar menú");
    menuOverlay.hidden=true;
    document.body.appendChild(menuOverlay);
    menuOverlay.addEventListener("click", closeMenu);
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      nav.style.setProperty("transition", "none", "important");
      nav.style.setProperty("transform", open ? "translateX(0)" : "translateX(-105%)", "important");
      document.body.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      menuOverlay.hidden=!open;
      setMenuIcon(open);
    });
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
      if(window.innerWidth<=900){
        nav.classList.remove("open");
        nav.style.setProperty("transition","none","important");
        nav.style.setProperty("transform","translateX(-105%)","important");
        document.body.classList.remove("menu-open");
        if(menuOverlay) menuOverlay.hidden=true;
        setMenuIcon(false);
      }
    }));
    document.addEventListener("keydown", event=>{ if(event.key==="Escape") closeMenu(); });
    window.addEventListener("resize",()=>{
      if(window.innerWidth>900){
        closeMenu();
        nav.style.removeProperty("transition");
        nav.style.removeProperty("transform");
      }
    },{passive:true});
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:"smooth", block:"start"}); }
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  const year = document.querySelector("[data-year]");
  if(year) year.textContent = new Date().getFullYear();

  const contact=config?.contact;
  document.querySelectorAll(".footer").forEach(footer=>{
    if(!contact || footer.querySelector("[data-contact-official]")) return;
    const block=document.createElement("div");
    block.dataset.contactOfficial="true";
    block.className="footer-official-contact";
    block.innerHTML=`<strong>Contacto oficial</strong><a href="tel:${contact.phone.replace(/[^+\d]/g,"")}">${contact.phone}</a><a href="mailto:${contact.salesEmail}">${contact.salesEmail}</a><a href="mailto:${contact.projectsEmail}">${contact.projectsEmail}</a><small>${contact.legalName} · RUC ${contact.taxId}</small>`;
    const bottom=footer.querySelector(".footer-bottom");
    if(bottom) footer.querySelector(".container")?.insertBefore(block,bottom); else footer.querySelector(".container")?.appendChild(block);
  });

  document.querySelectorAll("[data-track]").forEach(el => {
    el.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("hpd:track", {detail:{event:el.dataset.track}}));
      console.info("HPD event:", el.dataset.track);
    });
  });
});
