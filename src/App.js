import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navbar from "./components/layout/Navbar";
import home from "./pages/home";
import login from "./pages/login";
import register from "./pages/register";
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles'
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";
import jwtDecode from 'jwt-decode';
import AuthRoute from "./util/AuthRoute";
import {Provider} from 'react-redux';
import {SET_AUTHENTICATED} from "./redux/reducers/types";
import store from "./redux/reducers/store";
import {logoutUser, getUserData} from "./redux/actions/userActions";
import axios from 'axios';
import user from "./pages/user";

const theme = createMuiTheme(themeFile);

axios.defaults.baseURL = 'https://us-central1-chatty-e4d82.cloudfunctions.net/api';

const token = localStorage.token;
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        store.dispatch(logoutUser());
        window.location.href = '/login';
    } else {
        store.dispatch({type: SET_AUTHENTICATED});
        axios.defaults.headers.common['Authorization'] = token;
        store.dispatch(getUserData());
    }
}

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Provider store={store}>
                    <Router>
                        <Navbar/>
                        <div className="container">
                            <Switch>
                                <Route exact path='/' component={home}/>
                                <AuthRoute exact path='/login' component={login}/>
                                <AuthRoute exact path='/register' component={register}/>
                                <Route exact path='/users/:handle' component={user}/>
                                <Route exact path='/users/:handle/scream/:screamId' component={user}/>
                            </Switch>
                        </div>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        )
    }
}

export default App;
