import React, {useState, useEffect} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersApi from "../services/CustomersApi";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";
import TableLoader from "../components/loaders/TableLoader";

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersApi.find(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        }catch (e) {
            toast.error("Le client n'a pas pu être chargé");
            history.replace('/customers');
        }
    };

    useEffect(() => {
        if(id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    const handleChange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        // http request
        try{
            // reset errors state
            setErrors({});
            if(editing){
                await CustomersApi.update(id, customer);
                toast.success('Le client a bien été modifié');
            }
            else {
                await CustomersApi.create(customer);
                toast.success('Le client a bien été créé !');
                history.replace("/customers");
            }
        }catch ({response}) {

            const { violations } = response.data;
            if(violations){
                const apiErrors = [];
                violations.forEach(
                    ({propertyPath, message}) => {
                        apiErrors[propertyPath] = message;
                    }
                );
                setErrors(apiErrors);
                toast.error("Des erreurs dans le formulaire");
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || (
            <h1>Modification du client</h1>)}

            {loading && <FormContentLoader/>}
            {!loading && <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Email du client"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>}

            {loading && <TableLoader/>}
        </>
    );
};

export default CustomerPage;