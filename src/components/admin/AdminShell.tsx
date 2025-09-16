"use client";
import Sidebar from './Sidebar';
interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}
export function AdminShell({ children, title, subtitle }: AdminShellProps) {
  return (
    <div className="klv-admin-grid">
      <aside className="klv-admin-left">
        <Sidebar />
      </aside>
      <section className="klv-admin-content">
        {title && (
          <div className="klv-admin-header">
            <h1 className="klv-admin-title">{title}</h1>
            {subtitle && <p className="klv-admin-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </section>
    </div>
  );
}
export default AdminShell;