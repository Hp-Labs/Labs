import { redirect } from "next/navigation";

// /red-team redirects to the first active module: pentesting
export default function RedTeamRootRedirect({
  params,
}: {
  params: { module: string };
}) {
  // Only redirect if module is not known
  const known = ["pentesting", "red-team-ops", "exploit-dev", "reverse-engineering", "social-engineering"];
  if (!known.includes(params.module)) {
    redirect("/red-team");
  }
  return null;
}
