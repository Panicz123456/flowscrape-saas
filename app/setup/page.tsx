import { setupUser } from "@/actions/billing/SetupUser";

export default async function SetupPage() {
  return await setupUser()
}
