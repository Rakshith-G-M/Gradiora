import { redirect } from "next/navigation";

export default function SigninRoute() {
  redirect("/auth?mode=signin");
}
