import { redirect } from "next/navigation";

/** Legacy route — compliance locker removed; operational QA lives on home. */
export default function CompliancePage() {
  redirect("/#qa-log");
}
