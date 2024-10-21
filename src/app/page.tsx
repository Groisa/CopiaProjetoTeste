'use client'

import Image from "next/image";
import styles from "./page.module.css";
import ImageLogo from './assets/images/Logo-Dafo-dobro-tamanho.png'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AmpolasInput, PropsValues, ResponseData } from "./cadastrar-equipamento/page";
import { toast } from "react-toastify";
import { db } from "../../firebase";

interface ValuesForm {
  name: string;
  dateActual: string;
  actualValue: string;
}

export default function Home() {

  const [responseData, setResponseData] = useState<ResponseData[]>()
  const [currentEquipament, setCurrentEquipament] = useState<ResponseData>()
  const [currentValueAmpola, setCurrentValueAmpola] = useState<AmpolasInput>()
  const [valuesForm, setValuesForm] = useState<ValuesForm>({
    actualValue: '',
    dateActual: '',
    name: ''
  })
  const handleDefault = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (currentEquipament === undefined) {
      toast.error('Selecione um equipamento')
      return
    }
    if (currentValueAmpola === undefined) {
      toast.error('Selecione uma ampola')
      return
    }
    if (valuesForm.name.length === 0) {
      toast.error("Preencha o campo de nome de cadastrador")
      return
    }
    if (valuesForm.dateActual.length === 0) {
      toast.error("Preencha o campo de data de cadastro")
      return
    }
    if (valuesForm.actualValue.length === 0) {
      toast.error("Preencha o campo de valor atual")
      return
    }
    const direnceActualAndBeforeValue = Number(currentValueAmpola.value) - Number(valuesForm.actualValue)
    if (direnceActualAndBeforeValue > 16) {
      toast.error("O valor atual é menor em 16 gramas que o valor anterior, não é possível cadastrar esse valor")
      return
    }
    if (direnceActualAndBeforeValue < -8) {
      toast.error("O valor atual é maior em 8 gramas que o valor anterior, não é possível cadastrar esse valor")
      return
    }
  }
  const getAllEquipament = async () => {
    setResponseData([])
    const ref = collection(db, "equipaments")
    const querySnapshot = await getDocs(ref);
    const array = [] as ResponseData[]
    const response = querySnapshot.forEach(doc => {
      array.push({
        data: doc.data() as PropsValues,
        id: doc.id
      })
    })
    if (array.length === 0) {
      toast.error("Falha ao encontrar equipamentos")
    }
    array.map((item, index) => {
      item.data.value.map((itemAmpola, indexAmpola) => {

        if (itemAmpola.type !== "extern" && itemAmpola.type !== "inter") {
          const data = item.data.value.filter(value => value.type === "inter" || value.type === 'extern')
          itemAmpola.type = `${(indexAmpola + 1) - data.length}`
        }
      })
      return item
    })

    setResponseData(array)
  }


  useEffect(() => {
    getAllEquipament()
  }, [])
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Cadastrar Equipamento</h2>
        <form onSubmit={handleDefault} className={styles.containerForm}>
          <select
            className={styles.select}
            onChange={(e) => {
              setCurrentEquipament(responseData?.find((value) => value.id === e.target.value))
            }}
          >
            <option value="">Selecione o tipo de equipamento</option>
            {
              responseData?.map((item, index) => (
                <option key={index} value={item.id}>{item.data.name}</option>
              ))
            }
          </select>
          <select
            className={styles.select}
            onChange={(e) => {
              setCurrentValueAmpola(currentEquipament?.data.value.find(item => `${item.indexId}` === e.target.value))
            }}
          >
            <option value="">Selecione a Ampola</option>
            {
              currentEquipament?.data.value?.map((item, index) => (
                <option key={index} value={item.indexId}>Ampola {item.type === 'extern' && "Externa"} {item.type === 'inter' && 'Interna'} {item.type !== 'inter' && item.type !== "extern" && item.type} - {item.value}</option>
              ))
            }
          </select>
          <div className={styles.input}>
            <label>Nome do Cadastrador</label>
            <input
              onChange={(e) => {

                setValuesForm({
                  ...valuesForm,
                  name: e.target.value
                })
              }}
              type="text" name="name" className={styles.input} />
          </div>
          <div className={styles.input}>
            <label>Data do cadastro</label>
            <input
              onChange={(e) => {
                setValuesForm({
                  ...valuesForm,
                  dateActual: e.target.value
                })
              }}
              type="date" name="dateActual" className={styles.input} />
          </div>
          <div className={styles.input}>
            <label>Peso atual da ampola em (g)</label>
            <input
              onChange={(e) => {
                setValuesForm({
                  ...valuesForm,
                  actualValue: e.target.value
                })
              }}
              placeholder="Peso atual da Ampola em (g)"
              type="number" name="actualValue" className={styles.input} />
          </div>
          <button type="submit" style={{ color: '#fff', backgroundColor: 'red' }} className={styles.redirect}>Registrar</button>
          <button type="button" className={styles.redirect} onClick={() => {
            window.location.assign('/cadastrar-equipamento')
          }}>ir para cadastro</button>
        </form>
      </main>
    </div>
  );
}
