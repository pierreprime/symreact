import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersApi from "../services/CustomersApi";
import { Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try{
            const data = await CustomersApi.findAll();
            setCustomers(data);
            setLoading(false);
        }catch (e) {
            toast.error("Impossible de charger les clients");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async id => {
        // backup existing customers in an array
        const originalCustomers = [...customers];
        // optimistic
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await CustomersApi.delete(id);
            toast.success("Le client a bien été supprimé");
        }
        catch (e) {
            setCustomers(originalCustomers);
            toast.success("La suppression du client n'a pas pu fonctionner");
        }
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return(
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>


            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>

                {!loading && <tbody>
                    {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>
                        <Link to={"/customers/" + customer.id}>
                            {customer.firstName} {customer.lastName}
                        </Link>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.company}</td>
                      <td className="text-center">
                        <span className="badge badge-primary">{customer.invoices.length}</span>
                      </td>
                      <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/customers/" + customer.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                        </td>
                      <td>

                        <button
                            onClick={() => handleDelete(customer.id)}
                            disabled={customer.invoices.length > 0}
                            className="btn btn-sm btn-danger">Supprimer</button>
                      </td>
                    </tr>)}
                </tbody>}
            </table>

            {loading && <TableLoader/>}

            {itemsPerPage < filteredCustomers.length &&
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChanged={handleChangePage}
                />
            }
        </>
    );
};

export default CustomersPage;
