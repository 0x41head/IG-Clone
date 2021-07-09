import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'

import firebase from 'firebase'

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password : '',
            Pressed : false

        }
        this.onSignIn = this.onSignIn.bind(this)
    }

    onSignIn(){
        const email = this.state.email
        const password=this.state.password
        this.setState({Pressed:true})
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((result)=>{
            console.log(result)
        })
        .catch((error)=>{
            console.log(error)
        }) 
    }
    
    render() {
        return (
            <View>
                <TextInput
                    placeholder = "email"
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput
                    placeholder = "password"
                    secureTextEntry = {true}
                    onChangeText={(password) => this.setState({password})}
                />
                {this.state.Pressed
                ?<Button disabled title="Sign In"/>
                :<Button onPress={() => this.onSignIn()} title = "Sign In"/>}
                
            </View>
        )
    }
}

export default Login
