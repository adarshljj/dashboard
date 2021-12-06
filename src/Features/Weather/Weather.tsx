import React, { FC } from 'react';
import { ApolloClient, ApolloProvider, useQuery, gql, InMemoryCache } from '@apollo/client';
import { LinearProgress, Typography } from '@material-ui/core';
import { useGeolocation } from 'react-use';
import Chip from '../../components/Chip';
import * as Queries from '../../components/GQLSubscriber';

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

const client = new ApolloClient({
  uri: 'https://react.eogresources.com/graphql',
  cache: new InMemoryCache(),
});

const toF = (c: number) => (c * 9) / 5 + 32;

const query = gql`
  query ($latLong: WeatherQuery!) {
    getWeatherForLocation(latLong: $latLong) {
      description
      locationName
      temperatureinCelsius
    }
  }
`;
type DataResponse = {
  data: any;
  loading: any;
  error: any;
};

type WeatherData = {
  temperatureinCelsius: number;
  description: string;
  locationName: string;
};
type WeatherDataResponse = {
  getWeatherForLocation: WeatherData;
};

const Weather: FC = () => {
  GetPrevData(Queries.GET_ALL_DATA_QUERY);
  const getLocation = useGeolocation();
  // Default to houston
  const latLong = {
    latitude: getLocation.latitude || 41.881832,
    longitude: getLocation.longitude || -87.623177,
  };
  const { loading, error, data } = useQuery<WeatherDataResponse>(query, {
    variables: {
      latLong,
    },
  });

  if (loading) return <LinearProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Chip label="Weather not found" />;
  const { locationName, description, temperatureinCelsius } = data.getWeatherForLocation;

  return <Chip label={`Weather in ${locationName}: ${description} and ${Math.round(toF(temperatureinCelsius))}°`} />;
};

export default () => (
  <ApolloProvider client={client}>
    <Weather />
  </ApolloProvider>
);
