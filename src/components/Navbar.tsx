"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link href="/">livEvent</Link>
      </div>
      <div className={styles.links}>
        <Link
          href="/"
          className={pathname === "/" ? styles.active : ""}
        >
          Eventos
        </Link>
        <Link
          href="/artists"
          className={pathname.startsWith("/artists") ? styles.active : ""}
        >
          Artistas
        </Link>
        <Link
          href="/artist/login"
          className={pathname.startsWith("/artist") ? styles.active : ""}
        >
          Área Artista
        </Link>
      </div>
    </nav>
  );
}
