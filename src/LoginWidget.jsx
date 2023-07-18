import React from 'react';

// widget to display user status in main app ui
export default function LoginWidget({ login, doLogout }) {
    if(login)
        return <div>Logged as: {login} <a href="#" onClick={ doLogout }>Logout</a></div>;
    else // unused?
        return <div>You're not logged in.</div>;
};