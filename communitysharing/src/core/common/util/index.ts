// import type { AuthDetail } from "@/types/auth"
import { toRaw } from "vue"

export function loadUser(userinfo: AuthDetail) {
  return structuredClone(toRaw(userinfo))
}