import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersApi from "../services/CustomersApi";

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');

    const fetchCustomers = async () => {
        try{
            const data = await CustomersApi.findAll();
            setCustomers(data);
        }catch (e) {
            console.log(e.response)
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
            await CustomersApi.delete(id)
        }
        catch (e) {
            setCustomers(originalCustomers);
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
            <h1>Liste des clients</h1>

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
                </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.company}</td>
                      <td className="text-center">
                        <span className="badge badge-primary">{customer.invoices.length}</span>
                      </td>
                      <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                      <td>
                        <button
                            onClick={() => handleDelete(customer.id)}
                            disabled={customer.invoices.length > 0}
                            className="btn btn-sm btn-danger">Supprimer</button>
                      </td>
                    </tr>)}
                </tbody>
            </table>

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
