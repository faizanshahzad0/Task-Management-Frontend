import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </>
  );
}

