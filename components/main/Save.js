import React, {useState} from 'react'
import {View , Image, TextInput, Button} from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'

require('firebase/firestore')
require('firebase/firebase-storage')

export default function Save(props) {
    const [caption,setCaption]= useState("")
    const [ButtonPress, setButtonPress] = useState(false)
    const UploadImage= async () =>{
        setButtonPress(true)
        const uri = props.route.params.image
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        const response = await fetch(uri)
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred': ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot)=>{
                SavePostData(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        } 
        task.on('state_changed',taskProgress,taskError,taskCompleted)
    }

    const SavePostData = (downloadURL) =>{
        firebase.firestore()
        .collection(`posts`)
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
            downloadURL,
            caption,
            creation:firebase.firestore.FieldValue.serverTimestamp()
        }).then((function(){
            props.navigation.popToTop()
        }))
    }
    return (
        <View style ={{flex:1}}>
            <Image source={{uri:props.route.params.image}}/>
            <TextInput placeholder="Write a caption..."
            onChangeText={(caption) => setCaption(caption)}/>
           { (ButtonPress)
                ? <Button disabled title="Save"/>
                : <Button title="Save" onPress={()=>UploadImage()}/>
            }
        </View>
    )
}
