import { jwtVerify } from "jose";

export async function requireAuth(request, response, next) {
  const authorization=request.get("authorization");
  const token=authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if(!token || !process.env.JWT_SECRET) return response.status(401).json({ error: "authentication_required", requestId: request.requestId });
  try{
    const secret=new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload }=await jwtVerify(token,secret,{issuer:process.env.JWT_ISSUER,audience:process.env.JWT_AUDIENCE});
    request.user={id:payload.sub,role:payload.role};
    return next();
  }catch(error){
    return response.status(401).json({ error: "invalid_session", requestId: request.requestId });
  }
}
