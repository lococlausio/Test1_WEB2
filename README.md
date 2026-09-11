# Sistema de gestion de solicitudes de soporte ti

## 1. Requisitos 

* node.js v24.19.0
* npm 11.17.0
* MySQL corriendo en xampp en el puerto 3306
* nestJS CLI `@nestjs/cli` instalado globalmente 

## 2. Variables de Entorno

archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=soporte_ti_bd
PORT=3000