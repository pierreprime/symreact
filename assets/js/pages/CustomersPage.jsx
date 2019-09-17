import React from 'react';
import axios from 'axios';

const CustomersPage = props => {

    useEffect(() => {

    }, [])

    return(
        <>
            <h1>Liste des clients</h1>;
            <table className="table table-hover">
                <thead>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </thead>
                <tbody>
                    <tr>
                      <td>18</td>
                      <td>
                        <a href="#">Me Myself</a>
                      </td>
                      <td>me@huawei.cn</td>
                      <td>Me Inc</td>
                      <td className="text-center">
                        <span className="badge badge-primary">5</span>
                      </td>
                      <td className="text-center">3 500.00 €</td>
                      <td>
                        <button className="btn btn-sm btn-danger">Supprimer</button>
                      </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default CustomersPage;
