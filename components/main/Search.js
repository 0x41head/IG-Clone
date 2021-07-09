import React,{ useState } from 'react'
import { View,Text, TextInput , FlatList, TouchableOpacity} from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

export default function Search(props) {
    const [Users, setUsers] = useState([])

    const fetchUsers=(search)=>{
        firebase.firestore()
        .collection('users')
        .where('name', '>=', search)
        .get()
        .then((snapshot)=>{
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            //console.log(snapshot)
            setUsers(users)
        })
    }
    return (
        <View>
            <TextInput 
            placeholder="Type Here"
            onChangeText={(search)=>fetchUsers(search)}/>

            <FlatList
                numColumns={1}
                horizontal={false}
                data={Users}
                renderItem={({item})=>(
                    <TouchableOpacity
                        onPress={()=>props.navigation.navigate("Profile",{uid:item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
                />
        </View>
    )
}
