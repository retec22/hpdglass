import { Router } from "express";
import multer from "multer";
import { createProject, listProjects, uploadProjectImage } from "../db.js";
import { projectFormSchema, projectSchema } from "../validation.js";

export function createProjectRouter() {
  const router = Router();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, /^image\/(jpeg|png|webp|avif)$/.test(file.mimetype))
  });
  router.get("/", async (_request, response) => {
    response.json({ projects: await listProjects() });
  });
  router.post("/", async (request, response) => {
    const parsed = projectSchema.safeParse(request.body);
    if (!parsed.success) return response.status(422).json({ error: "invalid_project_payload", details: parsed.error.flatten().fieldErrors, requestId: request.requestId });
    response.status(201).json({ project: await createProject(parsed.data), requestId: request.requestId });
  });
  router.post("/upload", upload.single("image"), async (request, response, next) => {
    try {
      const parsed = projectFormSchema.safeParse({ ...request.body, progress: Number(request.body.progress || 0), value_cents: Number(request.body.value_cents || 0) });
      if (!parsed.success) return response.status(422).json({ error: "invalid_project_payload", details: parsed.error.flatten().fieldErrors, requestId: request.requestId });
      const imageUrl = await uploadProjectImage(request.file);
      response.status(201).json({ project: await createProject({ ...parsed.data, image_url: imageUrl }), requestId: request.requestId });
    } catch (error) {
      next(error);
    }
  });
  return router;
}
