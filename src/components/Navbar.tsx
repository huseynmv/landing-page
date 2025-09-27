import Link from "next/link";

export default function Navbar() {
    return (
        <header className="fixed top-0 inset-x-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center gap-8">
                    <ul className="flex items-center gap-8 text-sm text-white/90">
                        <li><Link href="/" className="hover:text-white">Home</Link></li>
                        <li><Link href="/about" className="hover:text-white">About us</Link></li>
                        <li><Link href="/services" className="hover:text-white">Services</Link></li>
                        <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                        <li><Link href="/team" className="hover:text-white">Our Team</Link></li>
                        <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
                    </ul>
                    <div className="ml-auto flex items-center gap-4">
                        <Link
                            href="/appointment"
                            className="text-white/90 hover:text-white rounded-lg px-4 py-2 ring-1 ring-white/60 hover:ring-white transition text-sm"
                        >
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
