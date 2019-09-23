import React, {useState, useEffect} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersApi from "../services/CustomersApi";

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

    const [editing, setEditing] = useState(false);

    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await CustomersApi.find(id);
            console.log(firstName);
            setCustomer({firstName, lastName, email, company});
        }catch (e) {
            console.log(e.response);
            // notif error
            // history.replace('/customers');
        }
    };

    useEffect(() => {
        if(id !== "new") {
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

        console.log(customer);

        // http request
        try{
            if(editing){
                console.log(customer);
                await CustomersApi.update(id, customer);
                // notif success
            }
            else {
                await CustomersApi.create(customer);
                // history.replace("/customers");
            }

            // notification success

            console.log(response.data);

            // reset errors state
            setErrors({});
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

                // notif error
            }
        }
    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || (
            <h1>Modification du client</h1>)}

            <form onSubmit={handleSubmit}>
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
            </form>
        </>
    );
};

export default CustomerPage;