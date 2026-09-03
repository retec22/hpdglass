document.addEventListener("DOMContentLoaded",()=>{
  const buttons=[...document.querySelectorAll("[data-filter]")];
  const cards=[...document.querySelectorAll("[data-category]")];
  cards.forEach(card=>{
    const detailUrl=card.getAttribute("href");
    const body=card.querySelector(".body");
    if(!detailUrl || !body || body.querySelector(".product-quote")) return;
    const productSlug=detailUrl.replace(/^\/productos\//," ").replace(/\/$/,"").trim();
    const quote=document.createElement("span");
    quote.className="product-quote";
    quote.setAttribute("role","link");
    quote.setAttribute("tabindex","0");
    quote.textContent="Cotizar este producto";
    const goToQuote=event=>{
      event.preventDefault();
      event.stopPropagation();
      location.href=`/contacto/?producto=${encodeURIComponent(productSlug)}`;
    };
    quote.addEventListener("click",goToQuote);
    quote.addEventListener("keydown",event=>{
      if(event.key==="Enter" || event.key===" ") goToQuote(event);
    });
    body.appendChild(quote);
  });
  buttons.forEach(btn=>btn.addEventListener("click",()=>{
    buttons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const f=btn.dataset.filter;
    cards.forEach(card=>card.hidden = !(f==="all" || card.dataset.category===f));
  }));
  const search=document.querySelector("[data-product-search]");
  if(search){
    search.addEventListener("input",()=>{
      const q=search.value.toLowerCase().trim();
      cards.forEach(card=>card.hidden = !((card.textContent+" "+card.dataset.category).toLowerCase().includes(q)));
    });
  }
});
