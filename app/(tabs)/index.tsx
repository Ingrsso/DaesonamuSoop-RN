import { Image, StyleSheet, Platform, Text, View, TouchableOpacity} from 'react-native';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

import {  differenceInDays, nextFriday } from 'date-fns';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Update from "expo-updates";

import axios from 'axios';



export default function Main() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [fridayCounter, setFridayCount] = useState(0)

    const [fridayDate, setFridayMonth] = useState("")


    useEffect(()=> {
      const today: Date = new Date();
      const nextFridayDate: Date = nextFriday(today);

      const daysUntilNextFriday: number = differenceInDays(nextFridayDate, today);

          
      const nextFridy = new Date(nextFridayDate).toLocaleDateString();
      
      setFridayMonth(`${nextFridy.split("/")[0]}월 ${nextFridy.split("/")[1]}일`)
      setFridayCount(daysUntilNextFriday)
    },[])

    const [isTimeTableLoading, setLoadingStatus] = useState(false);

    const [timeTable, setTimetable] = useState([]);

    useEffect(()=> {
      fetch('https://comci.koreacentral.cloudapp.azure.com/api/getTimetable?code=20999&grade=1&classNum=1')
      .then(response => response.json())
      .then(data => {
        
        setTimetable(data.data.timetable)
        setLoadingStatus(true)

      })
    },[timeTable])
    

    return (
      <ThemedView>
        <ThemedView style={styles.view}>
          <ThemedText style={{
            marginBottom:15,
            marginLeft:10,
            fontWeight:"bold",
            fontSize:20
          }}>
            대나무 숲
          </ThemedText>
          <View style={styles.dateList}>
            <View style={styles.GoHome}>
              <Text style={{margin:20, marginBottom:5, fontSize:24, fontWeight:"bold", color:"white"}}>
                금요일까지 남은 시간
              </Text>
              <Text style={{marginLeft:20, fontSize:18, color:"white"}}>
                {fridayCounter != 7 ? <>{fridayDate} (금요일)</> : <>오늘은 금요일 입니다!</>}
              </Text>
              <Text style={{margin:20, fontSize:36, fontWeight:"bold", color:"white"}}>
                {fridayCounter != 7 ? <>D - {fridayCounter}</> : <>D - Day</>}
              </Text>
            </View>
            <ThemedView style={{flexDirection:"row", gap:30, justifyContent:'center'}}>
              { isTimeTableLoading ? 
              <>
              <ThemedView>
                    { timeTable != undefined ?
                        Object.values(timeTable[0]).map((value:any, i) => 
                          
                          (
                            <ThemedView key={i} style={{padding:10}}>
                              <ThemedText>
                                {value.subject}
                              </ThemedText>
                            </ThemedView>
                            
                          )
                        
                        )
                        : <></>
                    }  
                </ThemedView>
                <ThemedView>
                    { timeTable != undefined ?

                        Object.values(timeTable[1]).map((value:any, i) => 
                          
                          (
                            <ThemedView key={i} style={{padding:10}}>
                              <ThemedText>
                                {value.subject}
                              </ThemedText>
                            </ThemedView>
                            
                          )
                        
                        )
                        : <></>
                    }  
                </ThemedView>
                <ThemedView>
                    { timeTable != undefined ?

                        Object.values(timeTable[2]).map((value:any, i) => 
                          
                          (
                            <ThemedView key={i} style={{padding:10}}>
                              <ThemedText>
                                {value.subject}
                              </ThemedText>
                            </ThemedView>
                            
                          )
                        
                        )
                        : <></>
                    }  
                </ThemedView>
                <ThemedView>
                    { timeTable != undefined ?

                        Object.values(timeTable[3]).map((value:any, i) => 
                          
                          (
                            <ThemedView key={i} style={{padding:10}}>
                              <ThemedText>
                                {value.subject}
                              </ThemedText>
                            </ThemedView>
                            
                          )
                        
                        )
                        : <></>
                    }  
                </ThemedView>
                <ThemedView >
                    { timeTable != undefined ?

                        Object.values(timeTable[4]).map((value:any, i) => 
                          
                          (
                            <ThemedView key={i} style={{padding:10}}>
                              <ThemedText>
                                {value.subject}
                              </ThemedText>
                            </ThemedView>
                            
                          )
                        
                        )
                        : <></>
                    }  
                </ThemedView>
              </>
               : <></>}
                
                
            </ThemedView>
              
         
            
            
            <TouchableOpacity onPress={()=>
              navigation.navigate("board")
            }>
              <ThemedView style={[{marginTop:10},styles.boardList]} darkColor='black' lightColor='#F9F9F9'>
                <ThemedText style={{fontWeight:"bold"}}>
                  자유 게시판
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
            <TouchableOpacity onPress={async()=> {
                await AsyncStorage.setItem('studentId', "");
                await AsyncStorage.setItem('studentPw', "");
                Update.reloadAsync()
              }}>
              <ThemedView style={[{marginTop:10},styles.boardList]} darkColor='black' lightColor='#F9F9F9'>
                <Text style={{fontWeight:"bold", color:"red"}}>
                  로그아웃
                </Text>
              </ThemedView>
            </TouchableOpacity>

          </View>
          
         
        </ThemedView>
      </ThemedView>

  );
}

const styles = StyleSheet.create({
  header: {
    width:"100%",
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
    padding:55,
    paddingLeft:15,
    fontWeight: 'bold'
  },
  view: {
    marginTop:75,
    height:"100%"
  },
  boardLists: {
    margin:10
  },
  dateList:{
    margin:10,
    height:"20%"
  },
  GoHome: {
    width:'100%',
    backgroundColor:"#262626",
    fontFamily:"Pretendard",
    marginBottom:20,
    borderRadius:10,
  },
  boardList: {
    width:'100%',
    padding: 13,
    fontFamily:"Pretendard",
    
    borderRadius:10,
    
  }
});
