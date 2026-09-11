# Sistema de gestion de solicitudes de soporte ti

## etapa 1 arquitectura inicial

* Creación del proyecto NestJS, módulo, controller, service y estructura base.
* node.js v24.19.0
* npm 11.17.0
* MySQL corriendo en xampp en el puerto 3306
* nestJS CLI `@nestjs/cli` instalado globalmente 

Registro y justificacón:
Etapa inicial donde se construyo la estructura base del backend con la arquitectura de NestJS.
Se configuro el proyecto bajo el sistema de modulos CommonJS(CJS) garantizando compatibilidad con los paquetes de persistencia relacional y herramientas de compilacion de Node.js
Generacón de recurso solicitudes:
 solicitudes.module.ts: Actua como el encapsulador del contexto del recurso. Declara que controladores exponen rutas y que servicios proveen la logica, facilitando la inyección de dependencias.
 solicitudes.contoller.ts: Se encarga exclusivamente de la capa de transporte HTTP (enrutamiento de peticiones entrantes, recepción de párametros y entrega de codigos de estado)
 solicitudes.service.ts: Se encarga de aislar la logica del negocio y las operaciones sobre los datos, evitando acoplar reglas operativas al protoolo HTTP


## etapa 2 Persistencia y validación
* Entity, TypeORM + MySQL, variables de entorno, DTO y validaciones. 

En esta etapa se implemento la persistencia en la base de datos relacional y la capa de sanitización y validación estricta de las entradas:
Persistencia con TypeORM y MySQL:
 app.module.ts: Se integró TypeOrmModule.forRoot() parametrizado mediante process.env. Se estableció synchronize : true exclusivamente para el desarrollo, permitiendo que TypeORM genere o altere la tabla solicitudes de la base de datos MySQL automaticamente al detetar cambios en el modelo.
 solicitud.entity.ts: Representa el esquema de la tabla en MySQL
  @PrimaryGeneratedColumn(): Genera una clave primaria numerica auto-incremental (id)
  @Column({lenth:}): Restringe la longitud de cadenas de texto a nivel de base de datos para optimizar almacenamiento e integridad referencial.
  @Column({default: 'Pendiente'}): Cumplimos la regla RN05.
  @Column({type: 'text'}): Asigna el tipo TEXT a descripción para permitir explicaciones detalladas sin riesgo de quedarse sin caracteres.
  @Column({type: 'date'}): Mapea fechaSolicitud en formato estandar de SQL para almacenar la fecha actual en la tabla.
DTOs y reglas de negocio:
 create-solicitud.dto.ts:
  RN01(titulo): se uso @IsString() para asegurarse que el titulo sea texto y @MinLength(5) para asegurarse que el titulo tenga como minimo 5 caracteres.
  RN02(cliente): se uso @IsString() y @IsNotEmpty() quienes impiden que el campo llegue nulo o con una cadena vacia.
  RN03(categoria): se definio una tupla estricta CATEGORIAS (hardware, software, redes, seguridad, soporte_usuario) y se valido con @IsIn() para rechazar cualquier categoria no autorizada.
  RN04(prioridad): se definio una tupla PRIORIDADES (baja, media, alta, critica) validada con @IsIn()
  RN06(descripción): @IsString() y @MinLength(15) esto nos exige una explicación minima de 15 caracteres.
  RN07(fecha de solicitud): se implemento un constraint personalizado IsNotFutureDateConstraint con @Validate() en combinacion con @IsISO8601() esta logica analiza la fecha y la compara con la fecha del sistema asegurando que no se registren solicitudes con fechas futuras a la actual.
 update-solicitud.dto.ts:
  Utilizamos PartialType(CreateSolicitudDto) de @nestjs/swagger para que todos los campos del formulario sean opcionales al momento de actualizar parcialmente un registro, heredando automaticamente sus mismas reglas de validación.
  Incorporamos el campo estado restringido a los valores permitidos (pendiente, en proceso, finalizada) con @IsIn().
  Se incorporaron decoradores @ApiProperty() y @ApiPropertyOpcional() para documentar el contrato de los DTOs hacia Swagger UI sin exponer ejemplos fijos ni estructuras ficticias.



