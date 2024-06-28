import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableOpacity, RefreshControl, useWindowDimensions, useColorScheme } from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import Animated from 'react-native-reanimated';
import { useCallback, useEffect, useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import HTMLView from 'react-native-htmlview';


interface TList {
  id: number;
  author: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function TabTwoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [boardList, setBoardList] = useState<TList[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const [article, setArticle] = useState<boolean>(false);

  const [deatilId, setDetailId] = useState<Number>(0);
  const [deatiltitle, setDetailtitle] = useState<String>("");
  const [deatilcontent, setDetailcontent] = useState<String>("");
  const [deatilauthor, setDetailauthor] = useState<String>("");
  const [deatilcreatedAt, setDetailcreatedAt] = useState<String>("");

  const colorScheme = useColorScheme();


  const onDeatilArticle = ({id, title, content, author, createdAt}:TList) => {
    setArticle(true)
    
    setDetailId(id)
    setDetailtitle(title)
    setDetailcontent(content)
    setDetailauthor(author)
    setDetailcreatedAt(createdAt)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetch('https://daesonamu.kro.kr/api/board', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      setBoardList(data["data"])
      setRefreshing(false)
    })
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetch('https://daesonamu.kro.kr/api/board', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        setBoardList(data["data"])
      })
    });

    return unsubscribe;
  },[refreshing])

  const elapsedTime = (date: any): string => {
    const start = new Date(date);
    const end = new Date();
  
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return '방금 전';
  
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;
  
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;
  
    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;
  
    return `${start.toLocaleDateString()}`;
  };
  const { width } = useWindowDimensions();

  if (!article) {
    return (
      <ThemedView>

        
        <ThemedView style={styles.view}>
        <ThemedText style={{
            marginBottom:15,
            marginLeft:10,
            fontWeight:"bold",
            fontSize:20
          }}>
            글 목록
          </ThemedText>
          <Animated.ScrollView style={styles.boardLists} refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
            <ThemedText></ThemedText>
            { boardList.map((item)=> (
              <TouchableOpacity key={item.id} onPress={()=> 
                onDeatilArticle(item)
              }>
                <ThemedView style={styles.boardList} darkColor='black' lightColor='#F9F9F9'>
                  <ThemedText style={{fontWeight:"bold"}}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={{fontSize:15}}>
                  { colorScheme === "dark" ?
                      <HTMLView
                        stylesheet={{
                          span:{
                            marginTop:10,
                            color:"white",
                          },
                        }}
                        value={`<span>${item.content}</span>`}
                      /> : 
                      <HTMLView
                      stylesheet={{
                        span:{
                          marginTop:10,
                          color:"black",
                        },
                      }}
                      value={`<span>${item.content}</span>`}
                    /> 
                      }
           

                  </ThemedText>
                  <ThemedText style={{fontSize:13}}>
                    {item.author} - {elapsedTime(item.createdAt)}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))
            }
          </Animated.ScrollView>
        </ThemedView>
      </ThemedView>
    );
  }else{
    return (
      <ThemedView>
        <TouchableOpacity style={styles.header} onPress={()=> {
          setArticle(false)
        }}>
          <ThemedText style={styles.headerText}> <Ionicons size={30} name={'chevron-back-outline'} /></ThemedText>
          <ThemedView style={styles.back}><ThemedText>뒤로가기</ThemedText></ThemedView>
        </TouchableOpacity>
        
        <ThemedView style={styles.viewarticle}>
          <Animated.ScrollView style={styles.boardLists}>
            <ThemedText style={{
              fontSize:24,
              margin:10,
              fontWeight:"bold"
            }}>
              {deatiltitle}
            </ThemedText>
            <ThemedText style={{
              margin:10,
              marginTop: -10,
              fontSize:14
            }}>
              {deatilauthor} - {new Date(deatilcreatedAt.toString()).getFullYear()}년 {new Date(deatilcreatedAt.toString()).getMonth()}월 {new Date(deatilcreatedAt.toString()).getDay()}일 {new Date(deatilcreatedAt.toString()).getHours()}시 {new Date(deatilcreatedAt.toString()).getMinutes()}분 ({elapsedTime(deatilcreatedAt)})
            </ThemedText>
            <ThemedText style={{
              margin:10,
              marginTop: 0,
              fontWeight:"bold"
            }}>
               { colorScheme === "dark" ?
                      <HTMLView
                        stylesheet={{
                          span:{
                            marginTop:10,
                            color:"white",
                          },
                        }}
                        value={`<span>${deatilcontent}</span>`}
                      /> : 
                      <HTMLView
                      stylesheet={{
                        span:{
                          marginTop:10,
                          color:"black",
                        },
                      }}
                      value={`<span>${deatilcontent}</span>`}
                    /> 
                      }
            </ThemedText>
            
            
          </Animated.ScrollView>
        </ThemedView>
      </ThemedView>
    );
  }
    
}

const styles = StyleSheet.create({
  header: {
    width:"100%",
    height:95,
    position:"absolute",
    zIndex:9999
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
  headerTexts: {
    padding:55,
    paddingLeft:15,
    fontWeight: 'bold'
  },
  view: {
    marginTop:75,
    height:"100%"
  },

  viewarticle: {
    marginTop:95,
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
    marginBottom:10,
    
    borderRadius:10,
    
  }
});
