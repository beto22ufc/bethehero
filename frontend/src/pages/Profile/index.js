import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import logoImg from '../../assets/logo.svg';

import './styles.css';

import api from  '../../services/api';

export default function Profile () {
    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');
    const history = useHistory();

    const [incidents, setIncidents] = useState([]); 
    const msgToast = localStorage.getItem('success');
    useEffect (() => {
        api.get('profile',{
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
            
            if (msgToast !== '') {
                handleToastSuccess(msgToast);
            }
        }                                                                                                                                                                          )
    },[ongId]);

    async function handleDeleteIncident (id) {
        try {
            api.delete(`incidents/${id}`,{
                headers: {
                    Authorization: ongId,
                }
            });
            
            setIncidents(incidents.filter(incident => incident.id !== id));
            let msg = 'Caso deletado com sucesso!';
            handleToastSuccess(msg);
        } catch (err) {
            alert('Erro ao deletar caso, tente novamente.');
        }
    }

    function handleLogout () {
        localStorage.clear();
        history.push('');
    }

    function handleToastSuccess(msg) {
        localStorage.setItem('success','');
        toast.success(`${msg}`, {
            position: toast.POSITION.TOP_CENTER,

        });
    }

    return (
       <div className="profile-container">
           <header>
               <img src={logoImg} alt="Be The Hero" />
               <span>Bem vinda, { ongName }</span>

               <button type='button' onClick={ handleLogout } title="Logout">
                    <FiPower size={18} color="#E02041"/>
               </button>
           </header>
            
           <Link className="button-create" to="/incident">Cadastrar caso</Link>

           <ToastContainer autoClose={1000}/>

           <h1>Casos cadastrados</h1>

           <ul>

               {incidents.map(incident => (
                <li key={ incident.id }>
                   <strong>Caso:</strong>
                   <p>{ incident.title }</p>

                   <strong>Descrição:</strong>
                   <p>{ incident.description }</p>

                   <strong>Valor:</strong>
                   <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'} ).format(incident.value) }</p>

                   <button type="button" onClick={ () => handleDeleteIncident(incident.id) }  title="Excluir">
                       <FiTrash2 size={20} color="#a8a8b3" />
                   </button>
               </li>
               ))}

           </ul>
       </div>
    );
}