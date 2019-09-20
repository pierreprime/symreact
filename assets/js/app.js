/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

import React, {useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import CustomersPagePaginated from "./pages/CustomersPagePaginated";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthApi from "./services/AuthApi";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

AuthApi.setup();

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthApi.isAuthenticated()
    );

    const NavbarWithRouter = withRouter(Navbar);

    return <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }}>
        <HashRouter>
        <NavbarWithRouter/>

        <main className="container pt-5">
            <Switch>
                <Route
                    path="/login"
                    render={props => (
                        <LoginPage onLogin={setIsAuthenticated} {...props} />
                    )}
                />
                <PrivateRoute
                    path="/invoices"
                    component={InvoicesPage}
                />
                <PrivateRoute
                    path="/customers"
                    component={CustomersPage}
                />
                <Route path="/" component={Homepage} />
            </Switch>
        </main>
    </HashRouter>
    </AuthContext.Provider>;
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);