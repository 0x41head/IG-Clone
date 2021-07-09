import { StatusBar } from 'expo-status-bar';
import React,{ Component } from 'react';

import { View, Text } from 'react-native';
import firebase from 'firebase'
import {APIKEY,AUTHDOMAIN,PROJECTID,STORAGEBUCKET,MESSAGINGSENDERID,APPID,MEASUREMENTID} from "@env"

import { Provider } from 'react-redux';
import {createStore,applyMiddleware} from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'


const store = createStore(rootReducer, applyMiddleware(thunk))  //Enables thunk - which is a middleware for async operations in redux store
const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID
}; //firebase variables remove these before importing to Github

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}// Code to initialize app if it doesn't exist

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator} from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'

import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'

const Stack = createStackNavigator();
 

export class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      loaded:false,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) =>{ //firebase function to check if user is logged in 
      if(!user){
        this.setState({
          loggedIn:false,
          loaded: true,
        })
      }
      else{
        this.setState({
          loggedIn:true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const {loggedIn,loaded} =this.state;
    
    if(!loaded){ // In the middle of loading/ Not loaded yet
      return(
        <View style ={{flex:1,justifyContent:'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if(!loggedIn){ //Check if person is already logged in or not 
    return (//NavigationContainer-https://reactnavigation.org/docs/navigation-container/ 
      //StackNavigator - https://reactnavigation.org/docs/stack-navigator/
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing"> 
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
        );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} />
              <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App