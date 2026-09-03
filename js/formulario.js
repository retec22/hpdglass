document.addEventListener("DOMContentLoaded",()=>{
 const form=document.querySelector("#project-form");
 if(!form) return;
 const productParam=new URLSearchParams(location.search).get("producto");
 const productName=productParam ? productParam.replace(/-/g," ").replace(/\b\w/g,letter=>letter.toUpperCase()) : "";
 const productField=form.querySelector("#product");
 const productContext=form.querySelector("#quote-context");
 const productLabel=form.querySelector("#quote-product-name");
 if(productName && productField && productContext && productLabel){
   productField.value=productParam;
   productLabel.textContent=productName;
   productContext.hidden=false;
   const needByProduct={
    "muro-cortina-mcf034":"Muro cortina","muro-cortina-mcf045":"Muro cortina","muro-cortina-mcs034":"Muro cortina","muro-cortina-mcs035":"Muro cortina","sistemas-unitizados":"Muro cortina",
    "ventanas-batientes":"Ventanas","ventanas-corredizas":"Ventanas","ventanas-fijas":"Ventanas","ventanas-proyectantes":"Ventanas","sistemas-especiales-ventanas":"Ventanas",
    "vidrio-templado":"Vidrio","vidrio-laminado":"Vidrio","vidrio-insulado":"Vidrio","vidrio-low-e":"Vidrio","vidrio-control-solar":"Vidrio","vidrio-especiales":"Vidrio"
   };
   const needField=form.querySelector("#need");
   if(needField && needByProduct[productParam]) needField.value=needByProduct[productParam];
 }
 const success=document.querySelector(".success");
 form.addEventListener("submit", async e=>{
   e.preventDefault();
   const data=new FormData(form);
   const payload=Object.fromEntries(data.entries());
   payload.source="website";
   payload.page=location.href;
   payload.createdAt=new Date().toISOString();

   const endpoint=window.HPD_CONFIG?.crm?.endpoint || "/api/leads";
   try{
     const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
     if(!response.ok) throw new Error(`lead_request_${response.status}`);
     success.style.display="block";
     success.textContent=productName ? `Solicitud para ${productName} recibida. Nuestro equipo revisará tu proyecto.` : "Solicitud recibida. Nuestro equipo revisará tu proyecto.";
   }catch(error){
     console.error("HPD lead request failed:",error);
     success.style.display="block";
     success.textContent="No pudimos registrar la solicitud ahora. Escríbenos por WhatsApp o inténtalo nuevamente.";
     return;
   }
   form.reset();
   window.dispatchEvent(new CustomEvent("hpd:track",{detail:{event:"lead_submit"}}));
 });
});
