import { SetupUser } from "@/actions/billing/SetupUser";

export default async function SetupPage() {
  return await SetupUser()
}
