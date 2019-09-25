import React, {useState} from "react";
import AuthApi from "../services/AuthApi";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({onLogin, history}) => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = ({currentTarget}) => {
        // destructure
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try{
            await AuthApi.authenticate(credentials);
            setError('');
            onLogin(true);
            toast.success('Vous êtes connecté !');
            history.replace('/customers');
        }catch (e) {
            setError("Aucun compte ne possède ce mail ou les infos sont incohérentes");
            toast.error("Une erreur est survenue !");
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>

                <Field
                    label="Adresse email"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    error={error}
                />

                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    error=""
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Connexion
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;