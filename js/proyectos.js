document.addEventListener("DOMContentLoaded",()=>{
 const buttons=[...document.querySelectorAll("[data-project-filter]")];
 const cards=[...document.querySelectorAll("[data-project-category]")];
 buttons.forEach(btn=>btn.addEventListener("click",()=>{
  buttons.forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  const f=btn.dataset.projectFilter;
  cards.forEach(c=>c.hidden=!(f==="all"||c.dataset.projectCategory===f));
 }));
});
