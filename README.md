# TFG-ELASTEST-SUT-BACK
Backend de la aplicación MEAN.

## Objetivos
En este repositorio se encuentra el backend de la aplicación híbrida 
hecha con el stack MEAN.

Se trata de un backend hecho con NodeJS y el framework Express. Es el encargado
de gestionar la lógica de la aplicación y también como intermediario entre el front
hecho con Angular y la base de datos Mongo.

## Componentes
Una vez lleguado una petición al servidor NodeJS, el mensaje se procesa y 
pasa por una serie de componentes para manejar la lógica de la aplicación.

### Servidor Node con Express
Es el que inicializa toda la aplicación de servidor. Se compone por ficheros de configuración 
e inicializan el servidor. Toda la lógica de este componente se encuentran en los ficheros
app.js y server.js.

### Routers
Este componente se encarga del manejo específico de los verbos HTTP (GET, POST, DELETE, etc) y 
gestiona de forma separada las peticiones por medio de diferentes direccionamientos URL. 

### Middleware
Contiene el middleware necesario para el funcionamiento de la aplicación. 
Un middleware es una pieza de software que conecta diferentes aplicaciones o componentes de software.

En este caso, contiene middleware para añadir seguridad al backend y ayuda a 
a procesar y transformar las peticiones entrantes al servidor, principalemente 
ayudando a cargar imagenes.

### Modelos de la base de datos
Contiene las estructura de datos a almacenar en la base de datos MongoDB.

### Controladores (Controllers)
Son los encargados de realizar la lógica de la aplicación. Serán las funciones
que se llamarán después de que entre una petición al servidor y ser cribadas y 
seleccionadas por el router.

Su principal cometido es obtener la infrmación del contenido del mensaje HTTP
recibido por el servidor, y procesar el contenido, modificando la base de datos
si es necesario y devolviendo una respuesta al cliente.


## Despliegue
Se ha optado por la tecnología docker para poder desplegar el backend de la aplicación.

### Despliegue del servidor NodeJS con Express
Se despliega únicamente el servidor, sin base de datos MongoDB.

`cd tfg-elastest-sut-back`

`docker build -t node-bakend .`

`docker run -p 3000:3000 node-backend`

### Despliegue del servidor NodeJS
Se despliega tanto el servidor como la base de datos MognoDB.

`cd tfg-elastest-sut-back`

`docker-compose up --build`