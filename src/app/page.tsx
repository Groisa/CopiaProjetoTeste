'use client'

import Image from "next/image";
import styles from "./page.module.css";
import ImageLogo from './assets/images/Logo-Dafo-dobro-tamanho.png'
export default function Home() {

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <button onClick={() => {
          window.location.assign('/cadastrar-equipamento')
        }}>ir para cadastro</button>
      </main>
    </div>
  );
}
