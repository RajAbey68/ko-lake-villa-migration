export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ padding: "1rem" }}>
      {children}
    </section>
  );
}
