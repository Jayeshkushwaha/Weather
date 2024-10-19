import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, PermissionsAndroid, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const image = { uri: 'https://cdn.pixabay.com/photo/2023/10/22/18/55/sky-8334619_1280.jpg' };
const API_KEY = '8cc108952fba4f358c672312242405J';

const App = () => {
  const [value, setValue] = useState('');
  const [data, setData] = useState(null);
  const [inCelsius, setInCelsius] = useState(true);

  const getWeatherFromApi = async (city) => {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}&key=${API_KEY}`);
      const json = await response.json();
      console.log("setCityData", json);
      setData(json);
    } catch (error) {
      console.error(error);
      Alert.alert("Error fetching city data");
    }
  };

  const getWeatherFromLocation = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${lat},${lon}&key=${API_KEY}`);
      const json = await response.json();
      console.log("setLocationData", json);
      setData(json);
    } catch (error) {
      console.error(error);
      Alert.alert("Error fetching location data");
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherFromLocation(latitude, longitude);
      },
      (error) => {
        console.error(error);
        Alert.alert("Error fetching current location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
        getCurrentLocation();
      } else {
        console.log("location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  useEffect(() => {
    requestPermission()
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View style={{ backgroundColor: 'white', padding: 20, marginHorizontal: 20, borderRadius: 10 }}>
          <Text style={{ marginBottom: 10, textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Weather</Text>

          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TextInput
              style={{ height: 40, flex: 1, borderWidth: 1, paddingStart: 10, borderRadius: 10 }}
              value={value}
              onChangeText={setValue}
              placeholder='Enter City'
            />

            <TouchableOpacity style={{ borderWidth: 1, padding: 10, borderRadius: 10 }} onPress={() => getWeatherFromApi(value)}>
              <Text>Search</Text>
            </TouchableOpacity>
          </View>

          {data?.location?.name && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <Text style={{ marginEnd: 10, fontSize: 16 }}>
                  {data?.location?.name} Temperature: {inCelsius ? data?.current?.temp_c : data?.current?.temp_f}°{inCelsius ? 'C' : 'F'}
                </Text>

                <TouchableOpacity
                  onPress={() => setInCelsius(!inCelsius)}
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 5,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{inCelsius ? 'C' : 'F'}</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 16 }}>
                {data.location.name} Weather Conditions: {data.current.condition.text}
              </Text>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default App;
