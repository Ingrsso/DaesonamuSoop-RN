import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
import { Image, StyleSheet, Platform, View, Text, TouchableOpacity, TextInput, Alert,  Pressable, Keyboard} from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import * as Crypto from 'expo-crypto';
import useUserStore from '../stores/userIdStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");


  const [isLogin, setIsLogin] = useState(false);

  const setUserId = useUserStore((state) => state.setUserId);


  const [loaded] = useFonts({
    Pretendard: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {
          isLogin ? <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
              <Stack.Screen name="+not-found" />
            </Stack> 
          : 
          <> 
          <Pressable onPress={()=> Keyboard.dismiss()}>

          <ThemedView darkColor='black' lightColor='#F9F9F9' style={{height:"100%", justifyContent:"center"}} >
                <View style={{
                  marginBottom:200,
                  justifyContent: "center",
                  alignItems: "center",
                
                }}>
                  <Image source={require('../assets/images/icon.png')} 
                    style={{
                      width:150,
                      height:150
                    }}          
                  />
                </View>
              
                <View style={{
                  position:"relative",
                  bottom:100
                  
                }}>
                <ThemedView style={styles.write} darkColor='rgb(22, 22, 22)' lightColor='#e3e3e3'>
                    {colorScheme == 'dark' ? <TextInput autoCapitalize="none" onChangeText={setId} value={id} style={{color:"white"}} placeholder='아이디'/> : <TextInput autoCapitalize="none" onChangeText={setId} value={id}  placeholder='아이디' />}
                  </ThemedView>
                  
                  <ThemedView style={styles.write} darkColor='rgb(22, 22, 22)' lightColor='#e3e3e3'>
                    {colorScheme == 'dark' ? <TextInput secureTextEntry={true} autoCapitalize="none" onChangeText={setPw} value={pw} style={{color:"white"}} placeholder='비밀번호'/> : <TextInput autoCapitalize="none" secureTextEntry={true} onChangeText={setPw} value={pw}  placeholder='비밀번호' />}
                  </ThemedView>
                  <TouchableOpacity onPress={async () => {
                    const password = await Crypto.digestStringAsync(
                      Crypto.CryptoDigestAlgorithm.SHA256,
                      pw
                    )
                    fetch('https://daesonamu.kro.kr/api/login', {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({"stId":id,"password": password})
                    })
                    .then(response => response.json())
                    .then(data => {
                      if (data.status == 200) {
                        
                        setUserId(data.data.id)
                        setIsLogin(true)
                      } else {
                        Alert.alert("로그인 실패", data.message)
                      }
                    })
                  }}>
                    <ThemedView style={styles.write} darkColor='rgb(22, 22, 22)' lightColor='#e3e3e3'>
                      <ThemedText style={{textAlign:"center", fontSize:14}}>로그인</ThemedText>
                    </ThemedView>
                </TouchableOpacity>
                </View>
                
              </ThemedView>
          </Pressable>
              
        </>
        }
    </ThemeProvider>
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
    opacity:1
  },
  headerText: {
    padding:55,
    paddingLeft:15,
    fontWeight: 'bold'
  },
  view: {
    marginTop:100,
    height:"100%"
  },
  boardLists: {
    margin:30,
    
  },
  boardList: {
    width:'100%',
    padding: 13,
    fontFamily:"Pretendard",
    marginBottom: 10,
    borderRadius:10,
  },
  write: {
    width: "90%",
    transform: [{translateX: 20}],
    
    
    borderWidth: 1,
    borderColor:"rgba(255,255,255,0.1)",
    
    padding: 13,
    fontFamily:"Pretendard",
    marginBottom: 15,
    borderRadius:5,
  }
});