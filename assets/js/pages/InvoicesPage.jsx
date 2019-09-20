import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import moment from "moment";
import InvoicesApi from "../services/InvoicesApi";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

const InvoicesPage = props => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try{
            const data = await InvoicesApi.findAll();
            console.log(data);
            setInvoices(data);
        }
        catch (e) {
            console.log(e.response);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try{
            await InvoicesApi.delete(id);
        }catch (e) {
            console.log(e.response);
            setInvoices(originalInvoices);
        }
    };

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // filter
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">
                                    {invoice.customer.firstName} {invoice.customer.lastName}
                                </a>
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            <td>
                                <button className="btn btn-sm btn-primary mr-1">Editer</button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(invoice.id)}
                                >Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {itemsPerPage < filteredInvoices.length && <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                onPageChanged={handleChangePage}
            />}
        </>
    );
};

export default InvoicesPage;