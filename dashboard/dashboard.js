document.addEventListener("DOMContentLoaded",()=>{
 const sidebar=document.querySelector("[data-sidebar]");
 const menu=document.querySelector("[data-dashboard-menu]");
 const navLinks=[...document.querySelectorAll('[data-dashboard-view]')];
 const panels=[...document.querySelectorAll('[data-dashboard-panel]')];
 const projectKey="hpd.dashboard.projects";
 const demoProjects=[
  {id:"demo-1",name:"Centro Empresarial More",client:"More Inmobiliaria",location:"San Isidro, Lima",stage:"instalacion",progress:76,value_cents:1850000000,scope:"Fachada ventilada, vidrio estructural, puertas y control solar."},
  {id:"demo-2",name:"Clínica Internacional",client:"Grupo Clínicas",location:"Surco, Lima",stage:"fabricacion",progress:62,value_cents:1350000000,scope:"Muro cortina, fachadas de vidrio, accesos y acabados técnicos."},
  {id:"demo-3",name:"Pardo 200",client:"Pardo 200",location:"Miraflores, Lima",stage:"diseno",progress:48,value_cents:960000000,scope:"Diseño de fachada, metales y vidrio laminado para torre corporativa."},
  {id:"demo-4",name:"Time Plaza",client:"Time Realty",location:"San Miguel, Lima",stage:"preventa",progress:29,value_cents:720000000,scope:"Propuesta arquitectónica, vidrio low-e y envolvente de fachada."}
 ];
 let projects;
 try{projects=JSON.parse(localStorage.getItem(projectKey)||"null");}catch(error){projects=null;}
 if(!Array.isArray(projects)||!projects.length){projects=demoProjects;localStorage.setItem(projectKey,JSON.stringify(projects));}
 const escapeHtml=value=>String(value||"").replace(/[&<>'"]/g,character=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));
 const cloudinaryImage=url=>{if(!url)return "";return url.includes("res.cloudinary.com")?url.replace("/upload/","/upload/f_auto,q_auto,w_1200/"):url;};
 const showView=view=>{
  panels.forEach(panel=>panel.hidden=panel.dataset.dashboardPanel!==view);
  navLinks.forEach(link=>link.classList.toggle('is-active',link.dataset.dashboardView===view));
  if(sidebar) sidebar.classList.remove('open');
  history.replaceState(null,'',`#${view}`);
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const renderProjectCatalog=()=>{
  const panel=document.querySelector('.pipeline-panel');
  if(!panel)return;
  let catalog=panel.querySelector('.project-catalog');
  if(!catalog){catalog=document.createElement('div');catalog.className='project-catalog';panel.append(catalog);}
  catalog.innerHTML=projects.length?`<div class="catalog-heading"><span class="section-kicker">CARTERA ACTUAL</span><strong>${projects.length} proyectos registrados</strong></div><div class="catalog-grid">${projects.map(project=>`<article class="catalog-card"><div class="catalog-card-image"${project.image_url||project.image?` style="background-image:url('${escapeHtml(cloudinaryImage(project.image_url||project.image))}')"`:''}><span>${escapeHtml(project.stage||'preventa')}</span></div><div class="catalog-card-body"><h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.scope||project.description||'Sin descripción')}</p><small>${escapeHtml(project.client||project.location||'Proyecto HPD')} · ${Number(project.progress||0)}% avance</small></div></article>`).join('')}</div>`:'<div class="catalog-empty">Aún no hay proyectos registrados. Usa “Nuevo proyecto” para crear el primero.</div>';
 };
 const updateProjectCount=()=>{
  const active=projects.filter(project=>project.stage!=="cerrado").length;
  const execution=projects.filter(project=>["fabricacion","instalacion"].includes(project.stage)).length;
  const value=projects.reduce((total,project)=>total+Number(project.value_cents||0),0)/100;
  const progress=projects.length?Math.round(projects.reduce((total,project)=>total+Number(project.progress||0),0)/projects.length):0;
  const metrics={active:active||"Sin datos",execution:execution||"Sin datos",value:value?`S/ ${(value/1000000).toFixed(1)}M`:"Sin datos",progress:progress?`${progress}%`:"Sin datos"};
  Object.entries(metrics).forEach(([name,value])=>{const element=document.querySelector(`[data-metric="${name}"]`);if(element)element.textContent=value;});
  document.querySelectorAll('[data-metric-note]').forEach(note=>{note.textContent=projects.length?"Datos de proyectos conectados":"Conecta Neon para actualizar";});
  const total=document.querySelector('.panel-foot span:first-child');
  if(total) total.innerHTML=`<i class="legend-dot cyan"></i> ${projects.length||0} proyectos`;
  const bars=document.querySelectorAll('.pipeline-bars>div');
  const stages=["preventa","diseno","fabricacion","instalacion"];
  bars.forEach((bar,index)=>{const amount=projects.filter(project=>project.stage===stages[index]).length;bar.style.setProperty('--value',projects.length?`${Math.max(12,amount/projects.length*100)}%`:"0%");bar.querySelector('b').textContent=projects.length?`${amount} proyectos`:"Sin datos";});
    renderProjectCatalog();
 };
 const addProject=async(project,imageFile)=>{
    try{
   const request= imageFile ? new FormData() : JSON.stringify(project);
   if(imageFile){Object.entries(project).forEach(([key,value])=>request.append(key,value));request.append('image',imageFile);}
   const response=await fetch(imageFile?'/api/projects/upload':'/api/projects',{method:'POST',headers:imageFile?{}:{'Content-Type':'application/json'},body:request});
     if(response.ok){const payload=await response.json();project=payload.project||project;}
    }catch(error){}
  projects.unshift(project);
  localStorage.setItem(projectKey,JSON.stringify(projects));
  updateProjectCount();
  const activity=document.querySelector('.activity-list');
  if(activity){
   const item=document.createElement('div');
   item.className='activity-item';
   item.innerHTML=`<span class="channel-badge whatsapp">${project.name.slice(0,1).toUpperCase()}</span><div><strong>${project.name}</strong><p>${project.scope}</p><small>Nuevo proyecto · ahora</small></div><b class="priority">Registrado</b>`;
   activity.prepend(item);
  }
    renderProjectCatalog();
 };
 const openProjectDialog=()=>{
  const dialog=document.createElement('dialog');
  dialog.className='project-dialog';
    dialog.innerHTML='<form method="dialog"><button type="button" class="dialog-close" aria-label="Cerrar">×</button><span class="section-kicker">NUEVO REGISTRO</span><h2>Agregar proyecto</h2><div class="dialog-fields"><label>Nombre del proyecto<input name="name" required maxlength="180" placeholder="Ej. Torre Central"></label><label>Cliente<input name="client" maxlength="180" placeholder="Empresa o desarrolladora"></label><label>Ubicación<input name="location" maxlength="180" placeholder="Lima, Perú"></label><label>Etapa<select name="stage"><option value="preventa">Preventa</option><option value="diseno">Diseño</option><option value="fabricacion">Fabricación</option><option value="instalacion">Instalación</option><option value="cerrado">Cerrado</option></select></label><label>Avance (%)<input name="progress" type="number" min="0" max="100" value="0"></label><label>Presupuesto (S/)<input name="value" type="number" min="0" step="1000" placeholder="0"></label></div><label>Descripción y alcance<textarea name="scope" required maxlength="10000" placeholder="Vidrio, aluminio, muro cortina, entregables..."></textarea><label>Imagen del proyecto<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif"><small class="dialog-hint">La imagen se optimizará y alojará en Cloudinary.</small></label><label>O URL de imagen<input name="image_url" type="url" maxlength="2000" placeholder="https://res.cloudinary.com/..."></label><button class="report-button" value="save">Guardar proyecto <span>↗</span></button></form>';
  document.body.appendChild(dialog);
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>dialog.remove());
  dialog.addEventListener('submit',event=>{
   event.preventDefault();
    const data=new FormData(event.target);
    const imageFile=data.get('image');
    addProject({name:String(data.get('name')),client:String(data.get('client')),location:String(data.get('location')),scope:String(data.get('scope')),stage:String(data.get('stage')),progress:Number(data.get('progress')||0),value_cents:Number(data.get('value')||0)*100,image_url:String(data.get('image_url')||''),createdAt:new Date().toISOString()},imageFile?.size?imageFile:null);
   dialog.close();
   showView('bandeja');
  });
  dialog.showModal();
 };
 if(menu&&sidebar) menu.addEventListener("click",()=>sidebar.classList.toggle("open"));
 navLinks.forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showView(link.dataset.dashboardView);}));
 document.querySelector('.new-project-panel-button')?.addEventListener('click',openProjectDialog);
 const initialView=location.hash.slice(1);
 showView(navLinks.some(link=>link.dataset.dashboardView===initialView)?initialView:'resumen');
 updateProjectCount();
 renderProjectCatalog();
 fetch('/api/dashboard/summary',{cache:'no-store'}).then(response=>response.ok?response.json():null).then(payload=>{
  if(payload?.summary?.projects?.length){projects=payload.summary.projects;localStorage.setItem(projectKey,JSON.stringify(projects));updateProjectCount();}
  return fetch('/api/projects',{cache:'no-store'});
 }).then(response=>response&&response.ok?response.json():null).then(payload=>{if(payload?.projects?.length){projects=payload.projects;localStorage.setItem(projectKey,JSON.stringify(projects));updateProjectCount();}}).catch(()=>{});
 document.querySelectorAll('.connector button').forEach(button=>button.addEventListener('click',()=>{
  const status=button.parentElement.querySelector('.pending,.connected');
  if(status&&status.classList.contains('pending')){status.className='connected';status.innerHTML='<i></i>Conectado';}
 }));
});
