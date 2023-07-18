import { useState, useRef } from "react";
import Login from "./Login";
import LoginWidget from "./LoginWidget";
import AppMap from "./AppMap";

import { Layout, Menu, theme } from 'antd';
import {
    ProfileOutlined,
    HomeOutlined,
    InfoCircleOutlined
  } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "react-query";
//import axios from 'axios';
import LoginWidget from "./LoginWidget";

function App() {
    const [jwt, setJwt] = useState(localStorage.getItem("jwt"));
    const [loginMutation, setLogin] = useState({
        isSuccess: false
    });
    const [sessionQuery, setSession] = useState({
        isSuccess: false
    });

    function doLogin(loginInfo) {
        setLogin({
            isSuccess: true
        });
        setSession({
            isSuccess: true,
            data: {
                data: {
                    login: loginInfo.user
                }
            }
        });
    }

    function doLogout() {
        setLogin({
            isSuccess: false
        });
        setSession({
            isSuccess: false
        });
    }

    if(loginMutation.isSuccess || jwt != "") {
        if(sessionQuery.isSuccess) {
            return (
            <>
                <LoginWidget login={ sessionQuery?.data?.data?.login } doLogout={ doLogout } />
                <AppMap />
            </>);
        }
    }

    if(loginMutation.isLoading)
        return <h3>Logging in...</h3>;
    else if(loginMutation.isError)
        return <h3>Unable to login! {JSON.stringify(loginMutation.error.response.data)}</h3>;
    else
        return <Login onSubmit={ doLogin } />;
}

export default function AppMain() {
    // styles
    const headerStyle = {
        color: "#fff",
    };
    // layout
    return (
        <Layout>
            <Header style={headerStyle}>
                GisTest
            </Header>
            <Content>
                <Layout>
                    <Content>
                        <App />
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
}
