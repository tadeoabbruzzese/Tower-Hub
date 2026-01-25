import AdminGuard from "@/components/AdminGuard"
import Link from "next/link"
import {
  Users,
  Database,
  Sparkles,
  Settings,
  ShieldCheck,
} from "lucide-react"

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="container py-20 space-y-12 animate-fade-in">
        {/* ===============================
            HEADER
        ================================ */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-error font-mono text-sm uppercase tracking-widest">
            <ShieldCheck size={18} />
            <span>Restricted Area</span>
          </div>

          <h1 className="text-5xl font-black uppercase tracking-tight">
            Admin <span className="text-primary">Hub</span>
          </h1>

          <p className="text-foreground/50 max-w-2xl">
            Central management system for Tower Hub.
            Create, edit and control core game data.
          </p>
        </div>

        {/* ===============================
            MODULES GRID
        ================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          
          {/* CHARACTERS */}
          <Link
            href="/admin/characters"
            className="card card-hover p-8 group animate-slide-up"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Characters</h2>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">
                  Core Data
                </p>
              </div>
            </div>

            <p className="text-foreground/70 leading-relaxed mb-6">
              Create, edit and manage playable characters.
              This is the main data source for all public views.
            </p>

            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-primary">
              <span>Manage</span>
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </Link>

          {/* BANNERS (PLACEHOLDER) */}
          <div className="card p-8 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Sparkles className="text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Banners</h2>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">
                  Coming Soon
                </p>
              </div>
            </div>

            <p className="text-foreground/40">
              Manage gacha banners and rotations.
            </p>
          </div>

          {/* GUIDES (PLACEHOLDER) */}
          <div className="card p-8 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-energy/20 border border-energy/40 flex items-center justify-center">
                <Database className="text-energy" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Guides</h2>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">
                  Future Module
                </p>
              </div>
            </div>

            <p className="text-foreground/40">
              Content creation and editorial tools.
            </p>
          </div>

          {/* SETTINGS (PLACEHOLDER) */}
          <div className="card p-8 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-error/20 border border-error/40 flex items-center justify-center">
                <Settings className="text-error" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">System</h2>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">
                  Restricted
                </p>
              </div>
            </div>

            <p className="text-foreground/40">
              Advanced configuration and security.
            </p>
          </div>

        </div>
      </div>
    </AdminGuard>
  )
}
