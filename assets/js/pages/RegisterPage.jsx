import React, {useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import UsersApi from "../services/UsersApi";
import {toast} from "react-toastify";

const RegisterPage = ({history}) => {

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
        setUser({...user, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const apiErrors = {};

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme";
            setErrors(apiErrors);
            toast.error('Des erreurs dans le formulaire');
            return;
        }

        try{
            await UsersApi.register(user);
            setErrors({});
            // flash success
            toast.success('Vous êtes désormais inscrit');
            history.replace('/login');
        }catch (e) {
            console.log(e.response);
            const { violations } = error.response.data;

            if(violations){
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error('Des erreurs dans le formulaire');
        }
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
                name="lastName"
                label="Nom de famille"
                placeholder="Votre nom de famille"
                error={errors.lastName}
                value={user.lastName}
                onChange={handleChange}
            />
            <Field
                name="email"
                label="E-mail"
                placeholder="Votre email"
                error={errors.email}
                value={user.email}
                onChange={handleChange}
            />
            <Field
                name="password"
                label="Password"
                type="password"
                placeholder="Votre mot de passe"
                error={errors.password}
                value={user.password}
                onChange={handleChange}
            />
            <Field
                name="passwordConfirm"
                label="Confirmation mot de passe"
                type="password"
                placeholder="Votre confirmation MDP"
                error={errors.passwordConfirm}
                value={user.passwordConfirm}
                onChange={handleChange}
            />
            <div className="form-group">
                <button type="submit" className="btn btn-success">
                    Confirmation
                </button>
                <Link to="/login" className="btn btn-link">
                    J'ai déjà un compte
                </Link>
            </div>
        </form>
    </>);
};

export default RegisterPage;