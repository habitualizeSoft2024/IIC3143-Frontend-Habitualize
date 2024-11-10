import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
// import jwtDecode from 'jwt-decode';
// import AsyncStorage from '@react-native-async-storage/async-storage';  // instalar en consola
import { useFocusEffect, useRouter } from 'expo-router';

// aqui hay muchas lineas comentadas porque tengo que instalar unas dependencias

const LandingPage = () => {
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  // useEffect(() => {
  //     const fetchUserData = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     if (token) {
  //         const decodedToken = jwtDecode(token);
  //         setUserId(decodedToken.userId);
  //     } else {
  //         router.push('/login');
  //     }
  //     };
  //     fetchUserData();
  // }, []);

  const handleLogout = async () => {
    // await AsyncStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <View>
      {userId ? (
        <>
          <Text>Welcome back, User {userId}!</Text>

          {/*                   IDEAS 
                    
                    - Crear una componente HabitCard para desplegar todas las tarjetas
                    - Considerar ruteo dinamico de expo con cards/[id].tsx
                    - Crear una componente HabitForm para agregar habitos --> quizas en la navbar?
                    - Quizás aparte del userFetchData, hacer un fetch de las estadísticas por separado
                    
                    */}

          {/* <Text>Your token is: {token}</Text> */}
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Redirecting to login...</Text>
      )}
    </View>
  );
};

export default LandingPage;
