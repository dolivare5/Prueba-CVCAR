
# Prueba Tecnica CVCAR

En esta prueba utilizo Node, Postgress, Sequelize y Bcrypt.



## Deployment

Pasos para ejecutar el proyecto

Primero se instalan los paquetes que contiene el package.json.

```bash
  npm install
```
Antes de iniciar el servidor ingresa las credenciales de su servidor y la contraseña del mismo en el archivo .env. Se que esto es una mala practica pero no pude crear el ambiente de docker.

Luego se inicia el servidor. Si el puerto se encuentra ocupado puede modificarlo en el archivo .env

```bash
  npm run dev
```
Por ultimo, antes de agregar un usuario debe crear al menos un rol. Para ello puede importar los archivos.json de postman a dicho programa y ejecutar desde alli las peticiones hacia el servidor.
