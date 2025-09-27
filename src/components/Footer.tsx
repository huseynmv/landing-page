export default function Footer() {
    return (
        <footer className="">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-sm opacity-75 flex flex-wrap items-center justify-between gap-4">
                <span>© {new Date().getFullYear()} Law Firm</span>
                <nav className="flex gap-4">
                    <a href="/privacy" className="hover:underline">Privacy</a>
                    <a href="/terms" className="hover:underline">Terms</a>
                </nav>
            </div>
        </footer>
    );
}
