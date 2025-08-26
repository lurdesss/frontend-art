import { User } from "@/types";

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  const u = localStorage.getItem("user");
  return u ? (JSON.parse(u) as User) : null;
}

export function clearUser() {
  localStorage.removeItem("user");
}
