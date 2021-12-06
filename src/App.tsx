import React from 'react';
import { ToastContainer } from 'react-toastify';
import { createTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import { useSubscription } from '@apollo/client';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import DropDownList from './components/DropDownMenu';
import Chart from './components/Chart';
import * as Store from './store';
import * as Action from './store/action';
import * as Queries from './components/GQLSubscriber';
import MetricCards from './components/MetricCards';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});
function GetData(QUERY: any) {
  const { data, error, loading } = useSubscription(QUERY);
  if (error) {
    return null;
  }
  if (loading) {
    return null;
  }
  if (data) {
    Store.store.dispatch(Action.setData(data.newMeasurement));
  }
  return null;
}

function App() {
  GetData(Queries.SUBSCRIBE_QUERY);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Wrapper>
        <Header />
        <DropDownList />
        <MetricCards />
        <Chart />
        <ToastContainer />
      </Wrapper>
    </MuiThemeProvider>
  );
}
export default App;
