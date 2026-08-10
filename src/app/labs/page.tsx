import { redirect } from "next/navigation";

// Redirect legacy /labs route to the new Red Team section
export default function LabsRedirect() {
  redirect("/red-team/pentesting");
}
