/*global angular*/
(function(window, document) {
  'use strict';

  angular
    .module('docsApp')
    .controller('DocumentController', DocumentController);

  DocumentController.$inject = [
    '$mdDialog', '$timeout', '$q', '$log', 'DocumentService'
  ];

  function DocumentController($mdDialog, $timeout, $q, $log, DocumentService) {
    var vm = this;
    vm.submit = submit;
    vm.doc = getBaseDoc();
    vm.statusTypes = getStatusTypes();
    vm.myDate = new Date();
    vm.minDate = {};
    vm.maxDate = {};
    vm.respondents = getRespondents();
    vm.receiverKinds = getReceiverKinds();

    vm.minDate = new Date(
      vm.myDate.getFullYear(),
      vm.myDate.getMonth() - 2,
      vm.myDate.getDate()
    );
    vm.maxDate = new Date(
      vm.myDate.getFullYear(),
      vm.myDate.getMonth() + 2,
      vm.myDate.getDate()
    );

    function getBaseDoc() {
      var subject = [
        'El asunto del documento de respuesta, ',
        'necesario para agilizar la búsqueda de contenidos'
      ].join('');
      var content = [
        'El contenido en texto plano del documento de respuesta, copiado del ',
        'formato original del mismo a texto plano para su inclusión en la ',
        'base de datos, fuente también de los datos mínimos necesarios para ',
        'la búsqueda de documentos generados.',
        'Una mañana, tras un sueño intranquilo, Gregorio Samsa se ',
        'despertó convertido en un monstruoso insecto. Estaba echado de ',
        'espaldas sobre un duro caparazón y, al alzar la cabeza, vio su ',
        'vientre convexo y oscuro, surcado por curvadas callosidades, ',
        'sobre el que casi no se aguantaba la colcha, que estaba a punto ',
        'de escurrirse hasta el suelo. Numerosas patas, penosamente ',
        'delgadas en comparación con el grosor normal de sus piernas, se ',
        'agitaban sin concierto. - ¿Qué me ha ocurrido? No estaba ',
        'soñando. Su habitación, una habitación normal, aunque muy ',
        'pequeña, tenía el aspecto habitual. Sobre la mesa había ',
        'desparramado un muestrario de paños - Samsa era viajante de ',
        'comercio-, y de la pared colgaba una estampa recientemente ',
        'recortada de una revista ilustrada y puesta en un marco dorado. ',
        'La estampa mostraba a una mujer tocada con un gorro de pieles, ',
        'envuelta en una estola también de pieles, y que, muy erguida, ',
        'esgrimía un amplio manguito, asimismo de piel, que ocultaba todo ',
        'su antebrazo. Gregorio miró hacia la ventana; estaba nublado, y ',
        'sobre el cinc del alféizar repiqueteaban las gotas de lluvia, lo ',
        'que le hizo sentir una gran melancolía. Bueno -pensó-; ¿y si ',
        'siguiese durmiendo un rato y me olvidase de todas estas locuras? ',
        'Pero no era posible, pues Gregorio tenía la costumbre de dormir ',
        'sobre el lado derecho, y su actual estado no le permitía adoptar ',
        'tal postura. Por más que se esforzara volvía a quedar de ',
        'espaldas. Intentó en vano esta operación numerosas veces; cerró ',
        'los ojos para no tener que ver aquella confusa agitación de ',
        'patas, que no cesó hasta que notó en el costado un dolor leve y ',
        'punzante, un dolor jamás sentido hasta entonces. - ¡Qué cansada ',
        'es la profesión que he elegido! -se dijo-. Siempre de viaje. Las ',
        'preocupaciones son mucho mayores cuando se trabaja fuera, por no ',
        'hablar de las molestias propias de los viajes: estar pendiente ',
        'de los enlaces de los trenes; la comida mala, irregular; ',
        'relaciones que cambian constantemente, que nunca llegan a ser ',
        'verdaderamente cordiales, y en las que no tienen cabida los ',
        'sentimientos. ¡Al diablo con todo! Sintió en el vientre una ',
        'ligera picazón. Lentamente, se estiró sobre la espalda en ',
        'dirección a la cabecera de la cama, para poder alzar mejor la ',
        'cabeza. Vio que el sitio que le picaba estaba cubierto de ',
        'extraños untitos blancos. Intentó rascarse con una pata; pero ',
        'tuvo que retirarla inmediatamente, pues el roce le producía ',
        'escalofríos. Una mañana, tras un sueño intranquilo, Gregorio ',
        'Samsa se despertó convertido en un monstruoso insecto. Estaba ',
        'echado de espaldas sobre un duro caparazón y, al alzar la ',
        'cabeza, vio su vientre convexo y oscuro, surcado por curvadas ',
        'callosidades, sobre el que casi no se aguantaba la colcha, que ',
        'estaba a punto de escurrirse hasta el suelo. Numerosas patas, ',
        'penosamente delgadas en comparación con el grosor normal de sus ',
        'piernas, se agitaban sin concierto. - ¿Qué me ha ocurrido? No ',
        'estaba soñando. Su habitación, una habitación normal, aunque muy ',
        'pequeña, tenía el aspecto habitual. Sobre la mesa había ',
        'desparramado un muestrario de paños - Samsa era viajante de ',
        'comercio-, y de la pared colgaba una estampa recientemente ',
        'recortada de una revista ilustrada y puesta en un marco dorado. ',
        'La estampa mostraba a una mujer tocada con un gorro de pieles, ',
        'envuelta en una estola también de pieles, y que, muy erguida, ',
        'esgrimía un amplio manguito, asimismo de piel, que ocultaba todo ',
        'su antebrazo. Gregorio miró hacia la ventana; estaba nublado, y ',
        'sobre el cinc del alféizar repiqueteaban las gotas de lluvia, lo ',
        'que le hizo sentir una gran melancolía. Bueno -pensó-; ¿y si ',
        'siguiese durmiendo un rato y me olvidase de todas estas locuras? ',
        'Pero no era posible, pues Gregorio tenía la costumbre de dormir ',
        'sobre el lado derecho, y su actual estado no le permitía adoptar ',
        'tal postura. Por más que se esforzara volvía a quedar de ',
        'espaldas. Intentó en vano esta operación numerosas veces; cerró ',
        'los ojos para no tener que ver aquella confusa agitación de ',
        'patas, que no cesó hasta que notó en el costado un dolor leve y ',
        'punzante, un dolor jamás sentido hasta entonces. - ¡Qué cansada ',
        'es la profesión que he elegido! -se dijo-. Siempre de viaje. Las ',
        'preocupaciones son mucho mayores cuando se trabaja fuera, por no ',
        'hablar de las molestias propias de los viajes: estar pendiente ',
        'de los enlaces de los trenes; la comida mala, irregular; ',
        'relaciones que cambian constantemente, que nunca llegan a ser ',
        'verdaderamente cordiales, y en las que no tienen cabida los ',
        'sentimientos. ¡Al diablo con todo! Sintió en el vientre una ',
        'ligera picazón. Lentamente, se estiró sobre la espalda en ',
        'dirección a la cabecera de la cama, para poder alzar mejor la ',
        'cabeza. Vio que el sitio que le picaba estaba cubierto de ',
        'extraños untitos blancos. Intentó rascarse con una pata; pero ',
        'tuvo que retirarla inmediatamente, pues el roce le producía ',
        'escalofríos.Una mañana, tras un sueño intranquilo, Gregorio ',
        'Samsa se despertó convertido en un monstruoso insecto. Estaba ',
        'echado de espaldas sobre un duro caparazón y, al alzar la ',
        'cabeza, vio su vientre convexo y oscuro, surcado por curvadas ',
        'callosidades, sobre el que casi no se aguantaba la colcha, que ',
        'estaba a punto de escurrirse hasta el suelo. Numerosas patas, ',
        'penosamente delgadas en comparación con el grosor normal de sus ',
        'piernas, se agitaban sin concierto. - ¿Qué me ha ocurrido? No ',
        'estaba soñando. Su habitación, una habitación normal, aunque muy ',
        'pequeña, tenía el aspecto habitual. Sobre la mesa había ',
        'desparramado un muestrario de paños - Samsa era viajante de ',
        'comercio-, y de la pared colgaba una estampa recientemente ',
        'recortada de una revista ilustrada y puesta en un marco dorado. ',
        'La estampa mostraba a una mujer tocada con un gorro de pieles, ',
        'envuelta en una estola también de pieles, y que, muy erguida, ',
        'esgrimía un amplio manguito, asimismo de piel, que ocultaba todo ',
        'su antebrazo. Gregorio miró hacia la ventana; estaba nublado, y ',
        'sobre el cinc del alféizar repiqueteaban las gotas de lluvia, lo ',
        'que le hizo sentir una gran melancolía. Bueno -pensó-; ¿y si ',
        'siguiese durmiendo? '
      ].join('');
      return {
        number: 'DG-000/2016',
        status: 'Original',
        receiver: {
          kind: 'Dependencia',
          organization: 'Nombre de la Dependencia/Organización',
          name: 'Encargado de la dependencia/Nombre de la persona física'
        },
        url: 'files://mi/unidad/documentos/escaneados/2016/07/10/1804.pdf',
        draftDate: new Date(),
        signDate: new Date(),
        entryUser: {
          '_id': 12346,
          'name': 'Oscar Gonzalez'
        },
        reception: {
          controlNumber:'26919',
          receptionDate: new Date(),
          office: 'Dirección de Cuencas y Sustentabilidad',
          receptionist: 'Martha Patricia Gutiérrez Osorio',
          subject: 'Asunto del documento original'
        },
        subject: subject,
        content: content,
        created_at: new Date(),
        updated_at: new Date()
      };
    };

    function getStatusTypes() {
      return [
        {
          '_id':'574725d24c2ec4f3ad6ce136',
          'status': 'Original'
        },
        {
          '_id':'574725d24c2ec4f3ad6ce137',
          'status': 'Copia'
        },
        {
          '_id':'574725d24c2ec4f3ad6ce138',
          'status': 'Vía correo'
        },
        {
          '_id':'574725d24c2ec4f3ad6ce13a',
          'status': 'Cancelado'
        }
      ];
    }

    function getRespondents() {
      var respondentsArray = [
        {
          'officeId':1,
          'areaId':34,
          'categoryId':1,
          'direction':'Dirección General',
          'office':'Dirección General',
          'manager': {
            'employeeId':1417,
            'firstName':'Felipe',
            'middleName':'Tito',
            'lastName':'Lugo',
            'secondLastName':'Arias',
            'position':'Director General'
          }
        },
        {
          'officeId':1,
          'areaId':34,
          'categoryId':2,
          'direction':'Dirección General',
          'office':'Secretaría Técnica',
          'manager': {
            'employeeId':1440,
            'firstName':'Uriel',
            'middleName':'Alejandro',
            'lastName':'Parga',
            'secondLastName':'Ramírez',
            'position':'Secretario Técnico'
          }
        },
        {
          'officeId':1,
          'areaId':34,
          'categoryId':3,
          'direction':'Dirección General',
          'office':'Gerencia de Estudios Técnicos',
          'manager': {
            'employeeId':200,
            'firstName':'Aldo',
            'lastName':'García',
            'secondLastName':'Rodríguez',
            'position':'Gerente de Estudios Técnicos'
          }
        },
        {
          'officeId':1,
          'areaId':34,
          'categoryId':3,
          'direction':'Dirección General',
          'office':'Secretaría Particular',
          'manager': {
            'employeeId':69,
            'firstName':'Martha',
            'middleName':'Erika',
            'lastName':'Miranda',
            'secondLastName':'Torres',
            'position':'Secretaria Particular'
          }
        },
        {
          'officeId':2,
          'areaId':35,
          'categoryId':2,
          'direction':'Contraloría Interna',
          'office':'Contraloría Interna',
          'manager': {
            'employeeId':1407,
            'firstName':'Miriam',
            'middleName':'Astrid',
            'lastName':'Beltrán',
            'secondLastName':'Fernández',
            'position':'Contralor Interno'
          }
        },
        {
          'officeId':3,
          'areaId':40,
          'categoryId':2,
          'direction':'Dirección de Administración',
          'office':'Dirección de Administración',
          'manager': {
            'employeeId':1470,
            'firstName':'Hector',
            'middleName':'Manuel',
            'lastName':'Salas',
            'secondLastName':'Barba',
            'position':'Director de Administración'
          }
        },
        {
          'officeId':3,
          'areaId':24,
          'categoryId':3,
          'direction':'Dirección de Administración',
          'office':'Gerencia de Personal',
          'manager': {
            'employeeId':299,
            'firstName':'Leticia',
            'middleName':'Fabiola',
            'lastName':'Cuán',
            'secondLastName':'Ramírez',
            'position':'Gerente de Personal'
          }
        },
        {
          'officeId':3,
          'areaId':25,
          'categoryId':3,
          'direction':'Dirección de Administración',
          'office':'Gerencia Jurídica',
          'manager': {
            'employeeId':179,
            'firstName':'Carlos',
            'middleName':'Roberto',
            'lastName':'Rojas',
            'secondLastName':'Dávila',
            'position':'Gerente Jurídico'
          }
        },
        {
          'officeId':4,
          'areaId':5,
          'categoryId':2,
          'direction':'Dirección de Comunicación Institucional',
          'office':'Dirección de Comunicación Institucional',
          'manager': {
            'employeeId':1737,
            'firstName':'Azahar',
            'middleName':'Margarita',
            'lastName':'Alcázar',
            'secondLastName':'Pérez',
            'position':'Director de Comunicación Institucional'
          }
        },
        {
          'officeId':5,
          'areaId':42,
          'categoryId':2,
          'direction':'Dirección de la UEAS',
          'office':'Dirección de la UEAS',
          'manager': {
            'employeeId':1602,
            'firstName':'Salvador',
            'lastName':'Delgado',
            'secondLastName':'Sánchez',
            'position':'Director de la UEAS'
          }
        },
        {
          'officeId':6,
          'areaId':41,
          'categoryId':2,
          'direction':'Dirección de Operación de PTAR’s',
          'office':'Dirección de Operación de PTAR’s',
          'manager': {
            'employeeId':220,
            'firstName':'Luis',
            'lastName':'Aceves',
            'secondLastName':'Martínez',
            'position':'Director de Operación de PTAR’s'
          }
        },
        {
          'officeId':7,
          'areaId':37,
          'categoryId':2,
          'direction':'Dirección de Planeación Estratégica',
          'office':'Dirección de Planeación Estratégica',
          'manager': {
            'employeeId':618,
            'firstName':'Linda',
            'lastName':'Michel',
            'secondLastName':'Ramírez',
            'position':'Director de Planeación Estratégica'
          }
        },
        {
          'officeId':8,
          'areaId':38,
          'categoryId':2,
          'direction':'Dirección de Cuencas y Sustentabilidad',
          'office':'Dirección de Cuencas y Sustentabilidad',
          'manager': {
            'employeeId':51,
            'firstName':'Armando',
            'middleName':'Brígido',
            'lastName':'Muñoz',
            'secondLastName':'Juárez',
            'position':'Director de Cuencas y Sustentabilidad'
          }
        },
        {
          'officeId':9,
          'areaId':39,
          'categoryId':2,
          'direction':'Dirección de Apoyo a Municipios',
          'office':'Dirección de Apoyo a Municipios',
          'manager': {
            'employeeId':1408,
            'firstName':'Ernesto',
            'lastName':'Marroquín',
            'secondLastName':'Álvarez',
            'position':'Director de Apoyo a Municipios'
          }
        },
        {
          'direction':'SIAPA',
          'office':'Sistema Intermunicipal de Agua Potable',
          'manager': {
            'firstName':'Sin Nombre',
            'lastName':'Sin apellido',
            'position':'Recepcionista'
          }
        }
      ];
      return respondentsArray;
    }

    function getReceiverKinds() {
      var receiversArray = [
        {
          'kind': 'Empresa'
        },
        {
          'kind': 'Dependencia'
        },
        {
          'kind': 'Persona física'
        }
      ];
      return receiversArray;
    }

    function submit() {
      if (vm.term.length < 2) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('Atención')
            .textContent('Debe ingresar un término de búsqueda válido')
            .ariaLabel('Ventana de diálogo')
            .ok('Aceptar')
        );
        vm.term = '';
        vm.results = [].slice();
      } else {
        DocumentService
          .query({term: vm.term})
          .$promise
          .then(function success(response) {
            vm.results = response;
          });
      }
    }
  }
})();
