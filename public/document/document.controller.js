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
        'la búsqueda de documentos generados. Thundercats pinterest you ',
        'probably haven\'t heard of them, photo booth williamsburg skateboard ',
        'DIY mlkshk pop-up +1 everyday carry. Salvia blue bottle pitchfork ',
        'pabst, cliche kinfolk cray polaroid authentic fanny pack hoodie echo ',
        'park neutra. Cred 8-bit plaid cronut kickstarter, cardigan kale ',
        'chips helvetica pitchfork hashtag polaroid knausgaard YOLO. Vice ',
        '8-bit selfies, truffaut asymmetrical ugh try-hard letterpress. ',
        'Meditation church-key aesthetic keffiyeh venmo, chicharrones squid ',
        'franzen. Man bun celiac irony godard try-hard. Paleo locavore ',
        'flexitarian, sustainable hashtag plaid synth asymmetrical etsy ',
        'narwhal swag sriracha PBR&B lumbersexual ramps. VHS butcher ',
        'chillwave cornhole. Actually yuccie pabst single-origin coffee yr, ',
        'kale chips keffiyeh man bun kickstarter squid irony brunch polaroid ',
        'tattooed. Kogi ethical church-key, paleo brooklyn shabby chic beard ',
        'gentrify kickstarter vegan everyday carry before they sold out four ',
        'dollar toast. 8-bit pitchfork listicle dreamcatcher synth fashion ',
        'axe, shabby chic brooklyn keffiyeh health goth. Lomo fingerstache ',
        'cold-pressed church-key, kale chips craft beer viral four dollar ',
        'toast distillery. Plaid thundercats YOLO venmo. Seitan flannel ',
        'meggings jean shorts. Letterpress fixie kinfolk farm-to-table before ',
        'they sold out quinoa cred hella, occupy chicharrones. Cray tofu lomo ',
        'hashtag plaid before they sold out kinfolk, portland distillery ',
        'wayfarers blog. Polaroid twee fanny pack godard, chillwave street ',
        'art humblebrag church-key seitan offal green juice. 90\'s semiotics ',
        'pabst four dollar toast. Whatever blog gochujang banh mi, craft beer ',
        'XOXO gastropub mlkshk cronut austin blue bottle wolf bushwick. ',
        'Slow-carb viral biodiesel, etsy church-key wolf authentic hashtag ',
        'bicycle rights offal four dollar toast kinfolk microdosing ',
        'pinterest. Shoreditch taxidermy disrupt typewriter. Pickled echo ',
        'park skateboard, tumblr scenester helvetica flannel +1 williamsburg ',
        'narwhal pour-over keytar truffaut. Banjo four dollar toast chillwave ',
        'meh, church-key squid fashion axe chambray typewriter neutra art ',
        'party knausgaard. Before they sold out XOXO cred ennui four loko ',
        'keytar cray stumptown kombucha, venmo forage banh mi yuccie. ',
        'Knausgaard distillery echo park seitan, before they sold out ethical ',
        'four loko thundercats pitchfork meditation cold-pressed small batch. ',
        'Pop-up cray whatever microdosing flexitarian, banh mi craft beer ',
        'listicle skateboard organic aesthetic tousled. Gentrify ',
        'intelligentsia skateboard four dollar toast. Pickled viral bitters ',
        'artisan, green juice whatever selvage plaid stumptown hammock pabst ',
        'roof party meditation. Four dollar toast tilde cred biodiesel kale ',
        'chips, intelligentsia portland. Synth cardigan DIY venmo, heirloom ',
        'bitters man braid. Mustache four dollar toast you probably haven\'t ',
        'heard of them photo booth. Try-hard hoodie occupy, yuccie hammock ',
        'lumbersexual twee cornhole tofu kogi 3 wolf moon. Biodiesel franzen ',
        'cardigan, pickled taxidermy fanny pack ennui. Disrupt chicharrones ',
        'photo booth shoreditch, fap kinfolk try-hard raw denim whatever ',
        'portland seitan DIY retro deep v bicycle rights. Chicharrones cray 3 ',
        'wolf moon, authentic flannel migas PBR&B seitan. Stumptown polaroid ',
        'taxidermy synth sartorial selfies, XOXO health goth asymmetrical ',
        'try-hard cornhole letterpress franzen pickled. Four dollar toast ',
        'iPhone waistcoat hoodie, man braid blog gastropub. Mumblecore ',
        'flexitarian PBR&B, jean shorts occupy master cleanse selfies ugh ',
        'ennui disrupt kale chips lomo direct trade. Kickstarter wayfarers ',
        'cred, YOLO hella DIY truffaut kinfolk green juice church-key ',
        'microdosing dreamcatcher roof party. Asymmetrical umami meh, mixtape ',
        'vice yr ugh waistcoat pinterest lomo 8-bit heirloom photo booth ',
        'chillwave leggings. Gochujang asymmetrical cardigan pork belly, ',
        'quinoa sartorial 3 wolf moon four dollar toast deep v fixie bitters ',
        'vinyl +1 selfies venmo. Yuccie quinoa occupy skateboard lo-fi ',
        'pour-over, knausgaard ugh squid YOLO roof party street art ',
        'semiotics. Freegan venmo truffaut, next level chambray twee sriracha ',
        'fixie iPhone try-hard offal roof party. Wolf artisan direct trade, ',
        'hoodie ramps sartorial dreamcatcher migas slow-carb literally ',
        'pitchfork bushwick tote bag. Echo park pour-over venmo helvetica. ',
        'Tattooed bitters photo booth, tote bag four loko PBR&B chillwave 3 ',
        'wolf moon. Viral gentrify wayfarers, squid 90\'s affogato put a bird ',
        'on it selfies scenester butcher 3 wolf moon. Viral hashtag ',
        'sustainable, selvage waistcoat cronut seitan pork belly gluten-free ',
        'single-origin coffee cold-pressed wayfarers butcher. Mumblecore ',
        'brunch twee, disrupt paleo 3 wolf moon +1 street art iPhone ',
        'distillery. Gochujang affogato plaid, polaroid mustache selvage art ',
        'party cardigan. Vegan everyday carry small batch austin, 3 wolf moon ',
        'tofu sriracha heirloom next level neutra cornhole authentic disrupt ',
        'biodiesel man bun. Ethical irony ennui small batch tote bag. ',
        'Letterpress deep v semiotics retro sustainable 3 wolf moon. Paleo 3 ',
        'wolf moon venmo, portland tousled chillwave cliche pabst irony ',
        'church-key meditation cray schlitz. Pickled tattooed keffiyeh ',
        'try-hard. Church-key man bun truffaut, sustainable four loko keytar ',
        'heirloom craft beer franzen polaroid banh mi marfa.'
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
        content: content
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
