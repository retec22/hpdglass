# HPD Web 3.3.1 — Fix de rutas

Se corrigió el acceso a `/soluciones/`: faltaba `soluciones/index.html`, por lo que servidores de desarrollo como VS Code Live Preview mostraban el listado del directorio.

Ahora `/soluciones/` carga una landing completa y enlaza a las cinco soluciones.

Para desarrollo local con VS Code Live Preview, abrir `index.html` desde la raíz del proyecto.
