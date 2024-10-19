'use client'


import React, { FormEventHandler, useEffect, useState } from 'react';
import { collection, doc, setDoc } from "firebase/firestore";
// import { Container } from './styles';
import styles from './page.module.css'
import { db } from '../../../firebase';
import { toast } from 'react-toastify';




interface PropsValues {
    name: string;
    value: AmpolasInput[]
}
interface AmpolasInput {
    value: string
    indexId: number,
    type?: 'inter' | 'extern' | ''
}
const AddEquipament: React.FC = () => {
    const [valuesInputs, setValueInputs] = useState<PropsValues>({
        name: '',
        value: []
    })
    const [init, setInit] = useState<boolean>(false)
    const [valuesAmpolas, setValuesAmpolas] = useState<AmpolasInput[]>([
        {
            value: '',
            indexId: 1,
            type: ''
        }
    ])
    const handlePrevent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let observable = false
        const object = {
            name: valuesInputs.name,
            value: valuesAmpolas
        }
        if (object.name.length === 0) {
            toast.error(`Preencha o nome do equipamento`)
            return
        }
        object.value.map(item => {
            if (item.value.length === 0) {
                observable = true
                toast.error(`Todas as ampolas precisam esta preenchidas!`)
                return
            }

        })
        if (observable === false) {
            const newEquipament = doc(collection(db, "equipaments"));
            await setDoc(newEquipament, object).then(() => {
                toast.success(`Sucesso ao criar Equipamento ${object.name}`)
                setValueInputs({
                    name: '',
                    value: []
                })
                setValuesAmpolas([
                    {
                        indexId: 1,
                        value: '',
                        type: ''
                    }
                ])
            }).catch(() => {
                toast.error(`Error ao criar Equipamento ${object.name}`)
            });

        }

    }
    const [counter, setCounter] = useState<number>(0)
    useEffect(() => {
        setTimeout(() => {
            setInit(true)
        }, 10)
    }, [])
    useEffect(() => {
        console.log(valuesAmpolas)
    }, [valuesAmpolas])
    return (
        <main className={styles.mainContainer}>
            <h2>Cadastrar Equipamento</h2>
            {
                init && <form onSubmit={handlePrevent} className={styles.containerForm} key={counter}>
                    <div className={styles.containerInputs}>
                        <div className={styles.input}>
                            <label>Tag do Equipamento</label>
                            <input
                                value={valuesInputs.name}
                                onChange={(e) => {
                                    setValueInputs({
                                        ...valuesInputs,
                                        name: e.target.value
                                    })
                                }}
                                type='text' name='tag' placeholder='Tag do Equipamento' />
                        </div>
                        {
                            valuesAmpolas.map((item, index) => (
                                <div className={styles.input} key={index}>
                                    <label>Valores do Ampola</label>
                                    <div className={styles.containerAmpolaAdd}>
                                        <input
                                            value={item.value}
                                            onChange={(e) => {
                                                const data = valuesAmpolas.map((event, eventIndex) => {

                                                    if (item.indexId === event.indexId) {
                                                        return {
                                                            value: e.target.value,
                                                            type: event.type,
                                                            indexId: event.indexId,
                                                        }
                                                    } else {
                                                        return event
                                                    }
                                                }) as AmpolasInput[]
                                                setValuesAmpolas(data)

                                            }}
                                            type='text' name='equipament' placeholder='Valores de Ampola' />
                                        <p
                                            onClick={() => {
                                                setValuesAmpolas([
                                                    ...valuesAmpolas,
                                                    {
                                                        type: '',
                                                        indexId: item.indexId + 1,
                                                        value: ''
                                                    }
                                                ])
                                            }}
                                            className={styles.addContainer}
                                        >+</p>
                                        <p
                                            style={{ background: 'red' }}
                                            onClick={() => {
                                                let findIndex = valuesAmpolas.findIndex(value => value.value === item.value)

                                                let copy = valuesAmpolas
                                                setValuesAmpolas([])
                                                if (findIndex !== -1) {
                                                    copy = valuesAmpolas.filter((_, index) => index !== findIndex)
                                                    setValuesAmpolas(copy)
                                                    setCounter(e => e + 1)
                                                }
                                            }}
                                            className={styles.addContainer}
                                        >-</p>
                                    </div>
                                    <div className={styles.containerAmpolaAdd}>
                                        <div className={styles.containerAmpolaAdd}>
                                            <input
                                                checked={item?.type === 'extern'}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const data = valuesAmpolas.map((event, eventIndex) => {
                                                            if (item.indexId === event.indexId) {
                                                                return {
                                                                    value: event.value,
                                                                    type: 'extern',
                                                                    indexId: event.indexId,
                                                                }
                                                            } else {
                                                                return event
                                                            }
                                                        }) as AmpolasInput[]
                                                        setValuesAmpolas(data)
                                                    }
                                                }}
                                                type='checkbox' style={{ height: 20, width: 'auto', boxShadow: 'none' }} />
                                            <caption style={{ fontSize: '0.8rem' }}>Exterma?</caption>
                                        </div>
                                        <div className={styles.containerAmpolaAdd}>
                                            <input
                                                checked={item?.type === 'inter'}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        const data = valuesAmpolas.map((event, eventIndex) => {
                                                            if (item.indexId === event.indexId) {
                                                                return {
                                                                    value: event.value,
                                                                    type: 'inter',
                                                                    indexId: event.indexId,
                                                                }
                                                            } else {
                                                                return event
                                                            }
                                                        }) as AmpolasInput[]
                                                        setValuesAmpolas(data)
                                                    }
                                                }}
                                                type='checkbox' style={{ height: 20, width: 'auto', boxShadow: 'none' }} />
                                            <caption style={{ fontSize: '0.8rem' }}>Interna?</caption>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={`${styles.containerInputs} ${styles.containerButton}`}>
                        <button type='submit' style={{ background: "#e5b800", color: "#fff" }}>Cadastrar Equipamentos</button>
                        <button style={{ backgroundColor: 'red', color: '#fff' }}>Cancelar</button>
                    </div>
                </form>
            }
        </main>
    );
}

export default AddEquipament;