import { createClient } from "@/lib/supabase/server";
import SiteHeader from "./SiteHeader";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SiteHeader email={user?.email ?? null} />;
}
