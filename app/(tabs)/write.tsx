import { Image, StyleSheet, Platform, View, TouchableOpacity, TextInput, useColorScheme, Alert, Pressable, Keyboard} from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import useUserStore from '../../stores/userIdStore';


import axios from "axios";

export default function Main() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const colorScheme = useColorScheme();
    
    const [title, SetTitle] = useState('');
    const [contnet, SetContent] = useState('');
    const [author, SetAuthor] = useState('');
    
    const userId = useUserStore((state) => state.userId);


    return (
      <Pressable onPress={()=> Keyboard.dismiss()}>
        <ThemedView>
          {/* <TouchableOpacity style={styles.header} onPress={()=> {
            navigation.goBack()
          }}>
            <ThemedText style={styles.headerText}> <Ionicons size={30} name={'chevron-back-outline'} /></ThemedText>
            <ThemedView style={styles.back}><ThemedText>뒤로가기</ThemedText></ThemedView>
          </TouchableOpacity> */}
          
          <ThemedView style={styles.view}>
            <ThemedView style={styles.boardLists}>
              <ThemedText style={{
                  marginBottom:15,
                  marginTop:10,
                  fontWeight:"bold",
                  fontSize:20
              }}>
                게시물 작성  
              </ThemedText>
              <ThemedView style={styles.boardList} darkColor='black' lightColor='#F9F9F9'>
              {colorScheme == 'dark' ? <TextInput onChangeText={SetTitle} value={title} style={{color:"white"}} placeholder='제목'/> : <TextInput onChangeText={SetTitle} value={title} placeholder='제목' />}
              </ThemedView>

              <ThemedView style={styles.boardList} darkColor='black' lightColor='#F9F9F9'>
              {colorScheme == 'dark' ? <TextInput style={{color:"white"}} onChangeText={SetAuthor} value={author} placeholder='작성자'/> : <TextInput onChangeText={SetAuthor} value={author} placeholder='작성자' />}
              </ThemedView>
              
              <ThemedView style={styles.write} darkColor='black' lightColor='#F9F9F9'>
              {colorScheme == 'dark' ? <TextInput numberOfLines={6} onChangeText={SetContent} value={contnet} multiline={true} style={{ height:130, textAlignVertical: 'top', color:"white"}} placeholder='내용'/> : <TextInput onChangeText={SetContent} value={contnet} multiline={true} placeholder='내용' />}
              </ThemedView>

              <TouchableOpacity onPress={async ()=> {
                  await axios.post('https://daesonamu.kro.kr/api/board', {"title":title,"content":contnet,"author":author}, {
                      headers: {
                        userId: Number(userId),
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      }
                    })
                    .then((data) => {
                      console.log(data)
                      if (data.data.message != "게시가 성공적으로 완료되었습니다") return Alert.alert("오류", data.data.message);

                      SetTitle("");
                      SetContent("");
                      SetAuthor("");
                      
                      Alert.alert("성공", data.data.message);
                      navigation.navigate("board");
                      
                    }).catch(
                      err=>{
                        Alert.alert("게시물 작성 실패", err.response.data.message);
                      }
                    )
              }}>
                  <ThemedView style={styles.boardList} darkColor='black' lightColor='#F9F9F9'>
                      <ThemedText style={{fontWeight:"bold",textAlign:"center"}}>
                          작성
                      </ThemedText>
                  </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Pressable>
        

  );
}

const styles = StyleSheet.create({
  header: {
    height:95,
    position:"absolute",
  },
  headerDiver: {
    width:"100%",
    height:1,
    position:"absolute",
    bottom:0,
    opacity:0.1
  },
  headerText: {
    padding:70,
    paddingLeft:5,
    
    fontWeight: 'bold'
  },
  view: {
    marginTop:55,
    height:"100%"
  },
  boardLists: {
    margin:10,
  },
  back: {
    position:"absolute",
    top:64,
    left:40,
    fontWeight:"bold"
  },
  boardList: {
    width:'100%',
    padding: 13,
    fontFamily:"Pretendard",
    marginBottom: 10,
    borderRadius:10,
  },
  write: {
    width: "100%",
    height:"30%",
    padding: 13,
    fontFamily:"Pretendard",
    marginBottom: 10,
    borderRadius:10,
  }
});
