'use client'


import React, { FormEventHandler, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
// import { Container } from './styles';
import styles from './page.module.css'
import { db } from '../../../firebase';
import { toast } from 'react-toastify';




export interface PropsValues {
    name: string;
    value: AmpolasInput[];
    id?: string;
}
export interface AmpolasInput {
    value: string
    indexId: number,
    type?: 'inter' | 'extern' | string
    notType?: string
}
export interface ResponseData {
    id: string;
    data: PropsValues
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
    const [isHandleEdit, setIsHandleEdit] = useState<boolean>(false)
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
        const ref = collection(db, "equipaments")
        const querySnapshot = await getDocs(ref);
        const array = [] as ResponseData[]
        const response = querySnapshot.forEach(doc => {
            array.push({
                data: doc.data() as PropsValues,
                id: doc.id
            })
        })
        const includes = array.filter(item => item.data.name.toLocaleLowerCase() === object.name.toLocaleLowerCase())
        if(includes.length > 0 && !isHandleEdit){
           toast.error(`Já existe uma equipamento com este nome cadastrado`)
            return
        }
        if (observable === false) {
            if (isHandleEdit && valuesInputs.id) {
                const equipamentRef = doc(db, 'equipaments', valuesInputs.id);
                await setDoc(equipamentRef, object).then(() => {
                    toast.success(`Sucesso ao editar Equipamento ${object.name}`)
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
                    setVisible(false)
                    setIsHandleEdit(false)
                }).catch(() => {
                    toast.error(`Error ao editar Equipamento ${object.name}`)
                });
            } else {
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
                    setVisible(false)
                }).catch(() => {
                    toast.error(`Error ao criar Equipamento ${object.name}`)
                });
            }

        }

    }
    const [responseData, setResponseData] = useState<ResponseData[]>()
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

    const handleDelete = async (data: ResponseData) => {

        await deleteDoc(doc(db, "equipaments", data.id)).then(() => {
            toast.success(`Sucesso ao criar Equipamento ${data.data.name}`)
            getAllEquipament()
        }).catch(() => {
            toast.error(`Error ao criar Equipamento ${data.data.name}}`)
        });
    }
    const handleEdit = async (data: ResponseData) => {
        setIsHandleEdit(true)
        setValueInputs({
            name: data.data.name,
            value: data.data.value,
            id: data.id
        })
        setValuesAmpolas(data.data.value)
    }
    const [counter, setCounter] = useState<number>(0)
    useEffect(() => {
        setTimeout(() => {
            setInit(true)
        }, 10)
    }, [])
    const [visible, setVisible] = useState<boolean>(false)


    useEffect(() => {
        if (visible) {
            getAllEquipament()
        }
    }, [visible])
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
                                    <label>Peso da Ampola (g)</label>
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
                                            type='number' name='equipament' placeholder='Peso da Ampola (g)' />
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
                        <button type='submit' style={{ background: "#e5b800", color: "#fff" }}>{isHandleEdit ? "Editar" : "Cadastrar"} Equipamentos</button>
                        <button type="button"
                            onClick={() => {
                                window.location.assign('/')
                            }}
                            style={{ backgroundColor: 'red', color: '#fff' }}>Cancelar</button>
                    </div>
                </form>
            }
            <div className={`${styles.containerInputs} ${styles.containerButton}`}>
                <button onClick={() => {
                    setVisible(e => !e)
                }} >{visible ? 'Fechar' : "Mostrar"} todos equipamentos</button>
            </div>
            {
                visible && responseData && responseData?.length > 0 && (
                    <div className={styles.containertags}>
                        {
                            responseData.map((item, index) => (
                                <div className={styles.containerNameAndTag} key={index}>
                                    <p className={styles.textNameEquipament} >Tag - <strong>{item.data.name}</strong></p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                        {
                                            item.data.value.map((value, indexValue) => (
                                                <p className={styles.dataTag} key={indexValue}>{value.type === 'extern' && 'Ampola Externa: '} {value.type === 'inter' && "Ampola Interna: "} {value.type !== 'inter' && value.type !== 'extern' && `${'Ampola'} ${value.type}: `}<strong>{value.value}</strong></p>
                                            ))
                                        }
                                        <div className={styles.containerButtonsTags}>
                                            <button className={styles.closeButton}
                                                onClick={() => {
                                                    handleDelete(item)
                                                }}
                                            >Deletar</button>
                                            <button
                                                onClick={() => {
                                                    handleEdit(item)
                                                }}
                                                className={styles.closeButton} style={{ color: "#000", background: 'yellow' }}>Editar</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </main>
    );
}

export default AddEquipament;