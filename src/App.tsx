import React from 'react';
import { ToastContainer } from 'react-toastify';
import { createTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useSubscription } from '@apollo/client';
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

type DataResponse = {
  data: any;
  loading: any;
  error: any;
};

function GetPrevData(SecondQUERY: any) {
  const halfBefore = () => new Date().getTime() - 10 * 60 * 1000;
  const time = halfBefore();

  const metricNames = ['oilTemp', 'waterTemp', 'injValveOpen', 'flareTemp', 'tubingPressure', 'casingPressure'];
  // console.log('Fetching Previous Data');
  const { data, error, loading } = useQuery<DataResponse>(SecondQUERY, {
    variables: {
      input: metricNames.map((input) => ({
        metricName: input,
        after: time,
      })),
    },
  });
  if (error) {
    console.log(error.message);
    return null;
  }
  if (loading) {
    console.log('loading');
    return null;
  }
  if (data) {
    // Store.store.dispatch(Action.setData(data.newMeasurement));
    console.log(data);
  }
  return null;
}

function App() {
  GetPrevData(Queries.GET_ALL_DATA_QUERY);
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
