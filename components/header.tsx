import Link from "next/link"

const Header: React.FC = () => {
  return (
    <header className="Sticky top-0">
        <div className="flex items-center h-24 w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-16 text-primary-100">
          <Link href="/"><p title="brand name" className="text-3xl italic font-semibold">
            SyncUp
          </p></Link>
        </div>
    </header>
  );
};

export default Header;
