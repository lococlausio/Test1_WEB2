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

Registro y justificacón:
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

## etapa 3

En esta etapa se implementó la capa de servicio solicitudes.service.ts, la capa controladora solicitudes.controller.ts y la configuración global de tuberías de transformación en main.ts. 

Se aseguró el aislamiento de responsabilidades, la inyección del repositorio TypeORM y el cumplimiento de las reglas de negocio solicitadas RN05-RN08-RN09-RN10 junto con la búsqueda combinada:

Inyección de dependencias:
 Se decoró la clase con @Injectable() y se inyectó el repositorio mediante @InjectRepository(Solicitud) private readonly solicitudRepo: Repository<Solicitud>. 
 Esto desacopla el acceso a MySQL y facilita pruebas unitarias o de integración mediante mocks sin depender directamente del driver de base de datos.

RN05 Estado Inicial: En el metodo create() se estructuro la entidad asegurando que el campo estado se asigne estrictamente como pendiente.

RN10 Recurso Inexistente: En el metodo auxiliar findOne(id: number) se consulta a la base de datos usando this.solicitudRepo.findOne({ where: { id } }) si el resultado es nullse dispara una excepcion NotFoundException con el codigo de estado HTTP 404 y un mensaje. Con este metodo centralizamos la comprobacion de existencia para findOne, update y remove.

RN09 Transición de estado:En el metodo update(id, dto) primero se recupera el estado de la base de datos mediante await this.findOne(id) si la solicitud ya se encuentra con estado === 'finalizada' y el cuerpo entrante ('dto.estado') intenta cambiarla a pendiente se aborta la transaccion lanzando un BadRequestException (HTPP 400)

RN08 Eliminacion: en el metodo remove(id) tras validar la existencia del ID, se analiza el estado actual del registro. Si el estado es en proceso, se bloquea la eliminacion arrojando una excepcion BadRequestException (HTPP 400) unicamente se permite eliminar registros que no se encuentren en ejecucion, deben encontrarse en estado finalizada.

Busqueda dinamica:
 Se utilizó this.solicitudRepo.createQueryBuilder('s') para armar una consulta SQL programática y flexible
 Se implementaron condicionales para aplicar cláusulas andWhere únicamente sobre los parámetros recibidos estado-prioridad-categoria
 Se aplicó la función LOWER(s.campo) = LOWER(:param) para garantizar búsquedas insensibles a mayúsculas y minúsculas, permitiendo combinaciones libres de uno, dos o los tres filtros a la vez

Jerarquia de rutas:
 La ruta de búsqueda @Get('buscar') se declaró obligatoriamente antes del endpoint dinámico @Get(':id'), de lo contrario, el enrutador interno de NestJS/Express interpretaría el segmento literal "buscar" como si fuese el parámetro id, derivándolo al handler incorrecto y provocando fallos de conversión.
 
 En los métodos findOne, update y remove, el decorador @Param('id', ParseIntPipe) intercepta el parámetro de ruta antes de llegar a la lógica del método, validando que sea una representación numérica entera, si el cliente envía una cadena alfanumérica, ParseIntPipe rechaza la petición con un HTTP 400 estandarizado sin sobrecargar el servicio ni consultar la base de datos

Decoradores Swagger
 Se etiquetó el recurso con @ApiTags('solicitudes') y se declararon los parámetros opcionales de búsqueda (`@ApiQuery({ required: false })`) para reflejar los contratos en la interfaz Swagger interactiva

Configuracion del servidor principal:
 whitelist: true Filtra y descarta propiedades no declaradas en los DTOs, mitigando ataques de asignación masiva.
 forbidNonWhitelisted: true Interrumpe la petición con un error HTTP 400 si el cliente envía campos desconocidos.
 transform: true Realiza la conversión automática de tipos primitivos entrantes hacia los tipos tipados en los DTOs.
 Se inicializó NestFactory.create(AppModule, { cors: true }) para admitir el consumo transversal desde interfaces frontend basadas en navegadores sin bloqueos de política de mismo origen.

