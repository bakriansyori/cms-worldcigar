import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: UsersAdmin,
});

type Profile = { id: string; email: string | null; display_name: string | null };
type Role = { user_id: string; role: "admin" | "editor" };

function UsersAdmin() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,email,display_name");
      if (error) throw error;
      return data as Profile[];
    },
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id,role");
      if (error) throw error;
      return data as Role[];
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: "admin" | "editor" }) => {
      await supabase.from("user_roles").delete().eq("user_id", user_id);
      const { error } = await supabase.from("user_roles").insert({ user_id, role });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Role updated"); qc.invalidateQueries({ queryKey: ["admin-roles"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Gagal"),
  });

  if (!isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-3xl text-cigar-cream" style={{ fontFamily: "'Cirkus',serif" }}>Users</h1>
        <p className="text-cigar-cream/60 mt-4">Hanya admin yang dapat mengelola pengguna.</p>
      </div>
    );
  }

  const rolesByUser = new Map(roles.map((r) => [r.user_id, r.role]));

  return (
    <div className="p-8">
      <h1 className="text-3xl text-cigar-cream" style={{ fontFamily: "'Cirkus',serif" }}>Users</h1>
      <p className="text-cigar-cream/60 mt-1 mb-8">User baru bisa daftar di /login (mode signup) lalu Anda atur perannya di sini.</p>
      <div className="border border-cigar-gold/20 bg-cigar-dark/50">
        <table className="w-full text-sm">
          <thead className="bg-cigar-gold/10 text-cigar-cream/70 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Role</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const role = rolesByUser.get(p.id) ?? "—";
              return (
                <tr key={p.id} className="border-t border-cigar-gold/10 text-cigar-cream/80">
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.display_name}</td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-cigar-gold/15 text-cigar-gold">{role}</span></td>
                  <td className="p-3 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setRole.mutate({ user_id: p.id, role: "admin" })}>Make admin</Button>
                    <Button size="sm" variant="outline" onClick={() => setRole.mutate({ user_id: p.id, role: "editor" })}>Make editor</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
