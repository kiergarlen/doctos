/*global angular*/
(function() {
  'use strict';

  angular
    .module('docsApp')
    .controller('DocumentController', DocumentController);

  DocumentController.$inject = [
    '$scope',
    '$location',
    '$routeParams',
    'FileUploader',
    'TokenService',
    'DateUtilsService',
    'DocumentService'
  ];

  function DocumentController(
      $scope,
      $location,
      $routeParams,
      FileUploader,
      TokenService,
      DateUtilsService,
      DocumentService
    ) {
    var vm = this;
    var myDate = new Date();
    vm.uploader = new FileUploader();
    vm.currentUser = getCurrentUser();
    vm.doc = {};
    vm.file = null;
    vm.item = {};
    vm.minDate = new Date(myDate.getFullYear() - 1, 12, 1);
    vm.maxDate = new Date(myDate.getFullYear() + 1, 0, 1);
    vm.receiverKinds = getReceiverKinds();
    vm.respondents = getRespondents();
    vm.statusTypes = getStatusTypes();
    vm.submit = submit;
    vm.fileSelected = fileSelected;
    vm.insertReturnPath = '';

    vm.uploader.onAfterAddingFile = function (item) {
      vm.item = item;
    }

    vm.uploader.onBeforeUploadItem = function (item) {
      console.log('Before upload...');
      console.log(item);
    }

    vm.uploader.onSuccessItem = function (item, response, status, headers) {
      console.log('Upload success!');
      console.log('item');
      console.log(item);
      console.log('response:');
      console.log(response);
    }

    vm.uploader.onCompleteAll = function () {
      console.log('All done');
    }

    // $scope.$watch('file', function() {
    //   if (vm.file != null) {
    //     vm.files = [vm.file];
    //   }
    // });

    // $scope.upload = function(files) {
    //   if (files && files.length) {
    //     for (var i = 0; i < files.length; i++) {
    //       var file = files[i];
    //       if (!file.$error) {
    //         Upload.upload({
    //           url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
    //           data: {
    //                   username: $scope.username,
    //                   file: file
    //                 }
    //         }).then(function(resp) {
    //           $timeout(function() {
    //             $scope.log = 'file: ' +
    //             resp.config.data.file.name +
    //             ', Response: ' + JSON.stringify(resp.data) +
    //             '\n' + $scope.log;
    //           });
    //         }, null, function(evt) {
    //           var progressPercentage = parseInt(100.0 *
    //                   evt.loaded / evt.total);
    //           $scope.log = 'progress: ' + progressPercentage +
    //               '% ' + evt.config.data.file.name + '\n' +
    //             $scope.log;
    //         });
    //       }
    //     }
    //   }
    // };

    function getCurrentUser() {
      var userToken = TokenService.getUserFromToken();
      return {
        name: userToken._doc.name,
        email: userToken._doc.email
      }
    }

    function fileSelected($files) {
      if (files && files.length) {
        vm.file = files[0];
      }
    }

    if ($routeParams.documentId) {
      DocumentService
        .query({documentId: $routeParams.documentId})
        .$promise
        .then(function success(response) {
          vm.doc = response;
          vm.doc.draftDate = new Date(vm.doc.draftDate);
          vm.doc.signDate = new Date(vm.doc.signDate);
          vm.doc.reception.receptionDate = new Date(vm.doc.reception.receptionDate);
          vm.doc.created_at = new Date(vm.doc.created_at);
          vm.doc.updated_at = new Date(vm.doc.updated_at);
        });
    } else {
      vm.doc = getBaseDoc();
    }

    function getBaseDoc() {
      var data = {
        number: '',
        status: '',
        receiver: {
          kind: '',
          organization: '',
          name: ''
        },
        url: '',
        draftDate: new Date(),
        signDate: new Date(),
        entryUser: {
          name: '',
          email: ''
        },
        reception: {
          controlNumber:'',
          receptionDate: new Date(),
          office: '',
          receptionist: '',
          subject: ''
        },
        subject: '',
        content: '',
        created_at: new Date(),
        updated_at: new Date()
      };
      data.entryUser.name = vm.currentUser.name;
      data.entryUser.email = vm.currentUser.email;
      return data;
    };

    function getReceiverKinds() {
      var receiversArray = [
        {
          '_id':'57a1040dfb3b62ab3198fa0d',
          'kind':'Dependencia'
        },
        {
          '_id':'57a1040dfb3b62ab3198fa0e',
          'kind':'Empresa'
        },
        {
          '_id':'57a1040dfb3b62ab3198fa0f',
          'kind':'Persona física'
        }
      ];
      return receiversArray;
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
        }
      ];
      return respondentsArray;
    }

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
        },
        {
          '_id':'57c6f6ab1b98e0451f4f909f',
          'status': 'Sin acuse'
        }
      ];
    }

    function flashMessage(message) {
      alert(message);
    }

    function isValidDoc() {
      if (!vm.doc) {
        flashMessage('invalid doc');
        return false
      }
      if (!vm.doc.receiver.organization) {
        flashMessage('invalid receiver organization');
        return false;
      }
      if (!vm.doc.receiver.name) {
        flashMessage('invalid receiver name');
        return false;
      }
      if (!DateUtilsService.isValidDate(vm.doc.draftDate)) {
        flashMessage('invalid draft date');
        return false;
      }
      if (!vm.doc.reception.controlNumber) {
        flashMessage('invalid original control number');
        return false;
      }
      if (!DateUtilsService.isValidDate(vm.doc.reception.receptionDate)) {
        flashMessage('invalid reception date');
        return false;
      }
      return true;
    }

    function isNewDoc() {
      return !vm.doc._id;
    }

    function submit() {
      var returnPath = '/document/view/';
      if (isValidDoc()) {
        if (isNewDoc()) {
          DocumentService
            .save(JSON.stringify(vm.doc))
            .$promise
            .then(function success(response) {
                var url = 'api/document/';
                var id = '';
                if (response.success) {
                  id = response.message;
                  vm.insertReturnPath = returnPath + '' + id;
                  vm.uploader.url(url + id + '/upload');
                  vm.item.upload();
                  // $location.path(returnPath + id);
                }
                return response;
              }, function error(response) {
                if (response.status === 404) {
                  return 'Recurso no encontrado';
                } else {
                  return 'Error no especificado';
                }
              }
            );
        } else {
          DocumentService
            .update(JSON.stringify(vm.doc))
            .$promise
            .then(function success(response) {
                var url = ' api/document/';
                var id = '';
                if (response.success) {
                  id = response.message;
                  vm.insertReturnPath = returnPath + '' + id;
                  vm.uploader.url(url + id + '/upload');
                  vm.item.upload();
                  // $location.path(returnPath + id);
                }
                return response;
              }, function error(response) {
                if (response.status === 404) {
                  return 'Recurso no encontrado';
                } else {
                  return 'Error no especificado';
                }
              }
            );
        }
      } else {
        flashMessage('doc has errors. do nothing');
      }
    }
  }
})();
