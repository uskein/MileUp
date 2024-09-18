import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

const { height } = Dimensions.get('window');

export default function App() {
  const [isSecondary, setIsSecondary] = useState(false);
  const [loginResult, setLoginResult] = useState(null); // State to hold login result
  const animation = new Animated.Value(1);
  const transitionAnimation = new Animated.Value(0);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
    );

    pulseAnimation.start();

    const timer = setTimeout(() => {
      pulseAnimation.stop();
      setIsSecondary(true);
      Animated.timing(transitionAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 5000);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, []);

  const animatedStyle = {
    transform: [{ scale: animation }],
  };

  const transitionStyle = {
    transform: [
      {
        translateY: transitionAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height],
        }),
      },
    ],
  };

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await fetch('http://18.224.4.228:3000/autenticacion/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_usuario: 'diego.leiton',
          contrasena: '123456',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLoginResult(data); // Update state with login result
    } catch (error) {
      console.error('Error:', error);
      setLoginResult({ error: error.message }); // Handle error
    }
  };

  return (
      <View style={styles.container}>
        {!isSecondary ? (
            <Animated.View style={[styles.principal, animatedStyle]}>
              <Text style={styles.titulo}>MileUp</Text>
              <Text style={styles.parrafo}>MileUp</Text>
            </Animated.View>
        ) : (
            <Animated.View style={[styles.secundario, transitionStyle]}>
              <Text style={styles.tituloS}>Bienvenido,</Text>
              <Text style={styles.parrafoS}>Bienvenido,</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.boton} onPress={() => alert('Registrarse')}>
                  <Text style={styles.botonTexto}>Regístrate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton} onPress={() => handleLogin()}>
                  <Text style={styles.botonTexto}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>
              {loginResult && (
                  <Text style={styles.result}>{JSON.stringify(loginResult)}</Text> // Display login result
              )}
            </Animated.View>
        )}
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  principal: {
    flex: 1,
    backgroundColor: 'purple',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secundario: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
    textShadowColor: 'black',
    shadowColor: 'black',
  },
  parrafo: {
    fontSize: 18,
    color: 'white',
  },
  parrafoS:{
    fontSize: 18,
    color: 'black',
  },
  tituloS: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 30,
    textShadowColor: 'black',
    shadowColor: 'black',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  boton: {
    backgroundColor: 'purple',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

// Style for displaying login result
  result:{
    marginTop :20,
    color:'black'
  }
});