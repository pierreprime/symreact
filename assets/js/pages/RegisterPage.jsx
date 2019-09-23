import React, {useState} from "react";
import Field from "../components/forms/Field";

const RegisterPage = props => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    const handleSubmit = event => {
        event.preventDefault();
        console.log(user);
    };

    return (<>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
            <Field
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                error={errors.firstName}
                value={user.firstName}
                onChange={handleChange}
            />
            <Field
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                error={errors.firstName}
                value={user.firstName}
                onChange={handleChange}
            />
            <Field
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                error={errors.firstName}
                value={user.firstName}
                onChange={handleChange}
            />
            <Field
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                error={errors.firstName}
                value={user.firstName}
                onChange={handleChange}
            />
            <Field
                name="firstName"
                label="Prénom"
                placeholder="Votre prénom"
                error={errors.firstName}
                value={user.firstName}
                onChange={handleChange}
            />
        </form>
    </>);
};

export default RegisterPage;