import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details', {
          itemId: 86,
          otherParam: 'any param'
        })}
      />
      <Button
        title="Update the title"
        onPress={() => navigation.setOptions({ title: 'Updated!' })}
      />
    </View>
  );
}

function DetailsScreen({route, navigation}) {
  const {itemId} = route.params;
  const {otherParam} = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() => 
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100)
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  let [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({localUri: pickerResult.uri});
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Uh oh, sharing isn't available on your platform");
      return;
    }

    Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image 
          source={{uri: selectedImage.localUri}}
          style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{title: 'Overview'}} 
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          initialParams={{ otherParam: 'default value' }} 
          options={({ route }) => ({ title: route.params.itemId })}
        />
        {/* <View style={styles.container}>
          <Image source={logo} style={styles.logo}/>

          <Text style={styles.instructions}>
            To share a photo from your phone with a friend, just press the button below!
          </Text>

          <TouchableOpacity
            onPress={openImagePickerAsync}
            style={styles.button}>
            <Text style={styles.buttonText}>Pick a photo</Text>
          </TouchableOpacity>
        </View> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305, 
    height: 159,
    marginBottom: 10
  },
  instructions: {
    color: '#888', 
    fontSize: 18, 
    textAlign: 'center',
    marginHorizontal: 15,
    marginBottom: 10
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 20, 
    color: '#fff'
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  }
});
