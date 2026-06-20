interface MenuPageProps {
  title: string;
  pageNumber: number;
  children: React.ReactNode;
}

export default function MenuPage({
  title,
  pageNumber,
  children,
}: MenuPageProps) {
  return (
    <section className="min-h-screen bg-[#F3ECE2] p-8 md:p-12">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl flex-col rounded-[24px] border-2 border-[#C9B8A5] bg-[#F7F1E8] p-8 shadow-lg md:p-12">
        
        <header className="mb-10 text-center">
          <h1 className="font-serif text-5xl italic text-[#4B3621]">
            {title}
          </h1>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="mt-10 text-center text-sm text-[#8A7463]">
          Page {pageNumber}
        </footer>
      </div>
    </section>
  );
}