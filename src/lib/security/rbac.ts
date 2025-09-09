export function checkRole(user: any, required: string) {
  if (!user || !user.role) return false;
  return user.role === required || (Array.isArray(user.roles) && user.roles.includes(required));
}
