import { createContext, useState, useContext } from 'react';

const Context = createContext();

export const Provider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [picture, setPicture] = useState(null);
  const [token, setToken] = useState('');
  const [userBooks, setUserBooks] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);

  return (
    <Context.Provider
      value={{
        username,
        setUsername,
        picture,
        setPicture,
        token,
        setToken,
        password,
        setPassword,
        userBooks, 
        setUserBooks,
        usersInfo, 
        setUsersInfo
      }}>
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);

export default Context;