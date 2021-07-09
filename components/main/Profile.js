import React,{useState,useEffect} from 'react'
import {StyleSheet,View, Text,Image,FlatList,Button} from 'react-native'
import firebase from 'firebase'
import {connect} from 'react-redux'

require('firebase/firestore')

function Profile(props) {
    const [userPosts, setuserPosts] = useState([])
    const [User, setUser] = useState(null)
    const [Following, setFollowing] = useState(false)

    useEffect (()=>{
        const {currentUser,posts} = props;
        //console.log(props)
        if(props.route.params.uid === firebase.auth().currentUser.uid)
        {
            setUser(currentUser)
            setuserPosts(posts)
        }
        else{
            firebase.firestore()
            .collection('users')
            .doc(props.route.params.uid)
            .get()
            .then((snapshot)=>{
                if(snapshot.exists){
                    //console.log(snapshot.data())
                    setUser(snapshot.data())
                }
                else{
                    //console.log(firebase.auth().currentUser.uid)
                    console.log('Does not exist')
                }
            })
            firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .get()
            .then((snapshot)=>{
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                //console.log(posts)
                setuserPosts(posts)
            })
        }
        if(props.following.indexOf(props.route.params.uid)>-1){
            setFollowing(true)
        }else{
            setFollowing(false)
        }
    },[props.route.params.uid,props.following])

    const onFollow =() =>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }
    const onUnfollow =() =>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogOut=()=>{
        firebase.auth().signOut()
    }

   if(User == null)
   {
       return <View/>
   }
    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{User.name}</Text>
                <Text>{User.email}</Text>
                {props.route.params.uid !== firebase.auth().currentUser.uid ?(
                    <View>
                        {
                        Following?(
                            <Button
                            title="Following"
                            onPress={()=>{onUnfollow()}}
                            />
                        ):
                        (
                            <Button
                            title="Follow"
                            onPress={()=>{onFollow()}}
                            />
                        )
                    }
                    </View>
                ):
                <Button
                    title="Logout"
                    onPress={()=>{onLogOut()}}
                />}
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item})=>{ 
                        return(
                        <View style={styles.containerImage}>
                            <Image
                            style={styles.image}
                            source={{uri:item.downloadURL}}
                            />
                        </View>)
                    }}
                />
            </View>
        </View >
    )
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        marginTop:40
    },
    containerInfo:{
        marginTop:20
    },
    containerGallery:{
        flex:1
    },
    image:{
        flex:1,
        aspectRatio:1/1,
        height:100

    },
    containerImage:{
        flex:1/3
    }
})
const mapStateToProps = (store) =>({
    currentUser:store.userState.currentUser,
    posts:store.userState.posts,
    following:store.userState.following
})

export default connect(mapStateToProps,null)(Profile)