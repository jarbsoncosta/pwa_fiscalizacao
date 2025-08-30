import { FaBars, FaHome, FaList, FaTachometerAlt, FaTimes, FaUserCircle, FaUsers } from "react-icons/fa";
import { RiMapPinUserFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
  
    return (
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            {/* <img src="/logo.png" alt="Logo" style={{ height: "32px", width: "32px" }} /> */}
            <span>Sistema de Fiscalização</span>
          </div>
  
          {/* Menu Desktop */}
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>
              <FaHome /> Início
            </Link>
            <Link to="/view/alvos" className={styles.navLink}>
              <FaList /> Alvos
            </Link>
            <Link to="/view/meus_alvos" className={styles.navLink}>
              <RiMapPinUserFill size={20} /> Meus Alvos
            </Link>
            {/* <Link to="/view/equipes" className={styles.navLink}>
              <FaUsers /> Equipes
            </Link> */}
            <Link to="/view/dashboard" className={styles.navLink}>
              <FaTachometerAlt /> Dashboard
            </Link>
          </div>
  
          {/* Usuário (Desktop) */}
          <div className={styles.userMenu}>
            <FaUserCircle />
            {user?.name || "Usuário"} ▾
          </div>
  
          {/* Botão Mobile */}
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
  
        {/* Menu Mobile */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <Link to="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              <FaHome /> Início
            </Link>
            <Link to="/view/alvos" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              <FaList /> Alvos
            </Link>
            <Link to="/view/meus_alvos" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              <RiMapPinUserFill /> Meus Alvos
            </Link>
            {/* <Link to="/equipes" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              <FaUsers /> Equipes
            </Link> */}
            <Link to="/view/dashboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              <FaTachometerAlt /> Dashboard
            </Link>
            <div className={styles.userMenu}>
              <FaUserCircle /> {user?.name || "Usuário"} ▾
            </div>
          </div>
        )}
      </nav>
    );
  }