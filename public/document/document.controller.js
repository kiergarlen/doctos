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
    '$q',
    '$mdDialog',
    'FileUploader',
    'TokenService',
    'DateUtilsService',
    'TextUtilsService',
    'ReceiverTypeService',
    'ReceptionistService',
    'RespondentService',
    'StatusService',
    'DocumentService'
  ];

  function DocumentController(
      $scope,
      $location,
      $routeParams,
      $q,
      $mdDialog,
      FileUploader,
      TokenService,
      DateUtilsService,
      TextUtilsService,
      ReceiverTypeService,
      ReceptionistService,
      RespondentService,
      StatusService,
      DocumentService
    ) {
    var vm = this;
    var myDate = new Date();
    vm.uploader = new FileUploader();
    vm.id = '';
    vm.doc = {};
    vm.file = null;
    vm.item = {};
    vm.minDate = new Date(myDate.getFullYear() - 3, 12, 1);
    vm.maxDate = new Date(myDate.getFullYear() + 3, 0, 1);
    vm.receiverTypes = ReceiverTypeService.get();
    vm.receptionists = ReceptionistService.get();
    vm.respondents = RespondentService.get();
    vm.statusTypes = StatusService.get();
    vm.submit = submit;
    vm.returnPath = '/document/view/';
    vm.listPath = '/list';
    vm.uploadPath = '/api/document/upload/';
    vm.sealDateTimeHours = 0;
    vm.sealDateTimeMinutes = 0;
    vm.deadlineTimeHours = 0;
    vm.deadlineTimeMinutes = 0;
    vm.currentUser = vm.getCurrentUser();
    // vm.getDeadline = function() {
    //   var deadline = new Date();
    //   var m;
    //   if(moment(vm.doc.sealDate).isValid()) {
    //     //console.log(vm.doc.deadline);
    //     m = moment(vm.doc.sealDate)
    //       .add(vm.doc.hoursUntilDeadline, 'hours');
    //     return moment(vm.doc.deadline).format('LLLL');
    //   }
    //   return '';
    // }
    vm.setSealDateMinutes = function() {
      var minutes = 0;
      if (!!vm.sealDateMinutes) {
        minutes = parseInt(vm.sealDateTimeMinutes, 10);
        if (vm.sealDateTimeMinutes > 59) {
          minutes = 59;
        }
        if (vm.sealDateTimeMinutes < 0) {
          minutes = 0;
        }
      }
      return true;
    }

    vm.uploader.onAfterAddingFile = function(item) {
      var name = item._file.name;
      name = TextUtilsService.trim(name);
      name = TextUtilsService.removeDiacritics(name);
      item.file.name = name;
      vm.item = item;
      vm.doc.url = name;
    }

    vm.uploader.onBeforeUploadItem = function(item) {
      item.url = vm.uploadPath + vm.id;
    }

    vm.uploader.onCompleteAll = function() {
      if (vm.id.length > 0) {
        $location.path(vm.returnPath + vm.id);
      }
    }

    vm.getCurrentUser = function() {
      var userToken = TokenService.getUserFromToken();
      return {
        name: userToken._doc.name,
        email: userToken._doc.email
      }
    }

// console.log(moment.duration(24, "hours").humanize());
// duration.get('hours');
// duration.get('minutes');
//       DocumentService
//         .query({documentId: $routeParams.documentId})
//         .$promise
//         .then(function success(response) {
//           vm.doc = response;
//           vm.doc.draftDate = new Date(vm.doc.draftDate);
//           vm.doc.signDate = new Date(vm.doc.signDate);
//           vm.doc.reception.receptionDate = new Date(
//             vm.doc.reception.receptionDate
//           );
//           console.log('hours: ' + moment(
//               new Date(vm.doc.reception.receptionDate, 'H')
//             )
//           );
//           console.log('minutes: ' + moment(
//               new Date(vm.doc.reception.receptionDate, 'm')
//             )
//           );

//           vm.doc.createdAt = new Date(vm.doc.createdAt);
//           vm.doc.updatedAt = new Date();
//         });

    if ($routeParams.documentId) {
      DocumentService
        .query({documentId: $routeParams.documentId})
        .$promise
        .then(function success(response) {
          var data = response;
          data.draftDate = new Date(data.draftDate);
          data.signDate = new Date(data.signDate);
          data.reception.receptionDate = new Date(
            data.reception.receptionDate
          );
          data.createdAt = new Date(data.createdAt);
          data.updatedAt = new Date();
          vm.doc = processDocumentDeadline(data);
        });
    } else {
      vm.doc = processDocumentDeadline(getBaseDoc());
    }

    function getBaseDoc() {
      var data = {
        number: '32768',
        status: 'Original',
        receiver: {
          type: 'Gerencia',
          organization: 'Gerencia de Formulación de Proyectos',
          name: 'Mario Ríos Plascencia'
        },
        url: '32768.pdf',
        draftDate: new Date(),
        signDate: new Date('2016-12-10T14:08Z'),
        sealDate: new Date('2016-12-09T21:54Z'),
        hasDeadline: true,
        hoursUntilDeadline: 72,
        deadline: new Date('2016-12-12T21:54Z'),
        entryUser: {
          name: '',
          email: ''
        },
        reception: {
          controlNumber:'32745',
          receptionDate: new Date('2016-12-12T19:18Z'),
          office: 'Gerencia de Formulación de Proyectos',
          receptionist: 'Silvia Beatriz Antón Márquez',
          subject: 'Asunto del documento original'
        },
        subject: 'Asunto del documento de respuesta',
        content: 'Contenido del documento de respuesta',
        createdAt: new Date('2016-12-10T03:12Z'),
        updatedAt: new Date('2016-12-10T03:12Z')
      };
      data.entryUser = {
        name: vm.currentUser.name,
        email: vm.currentUser.email
      };
      return data;
    }

    function processDocumentDeadline(data) {
      var moment1;
      var moment2;
      moment1 = moment(data.sealDate);
      vm.sealDateTimeHours = parseInt(moment1.format('H'), 10);
      vm.sealDateTimeMinutes = parseInt(moment1.format('m'), 10);
      if (data.hasDeadline) {
        moment2 = moment(data.deadline);
        vm.deadlineTimeHours = parseInt(moment2.format('H'), 10);
        vm.deadlineTimeMinutes = parseInt(moment2.format('m'), 10);
      }
      return data;
    }

    function flashMessage(message) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Atención')
          .textContent(message)
          .ariaLabel('Ventana de diálogo')
          .ok('Entendido')
      );
    }

    function isValidDoc() {
      if (!vm.doc) {
        flashMessage('Documento incompleto');
        return false
      }
      if (!vm.doc.receiver.organization) {
        flashMessage('Debe agregar una Dependencia');
        return false;
      }
      if (!vm.doc.receiver.name) {
        flashMessage('Debe agregar un encargado');
        return false;
      }
      if (!DateUtilsService.isValidDate(vm.doc.draftDate)) {
        flashMessage('Fecha de elaboración inválida');
        return false;
      }
      return true;
    }

    function submit() {
      if (isValidDoc()) {
        if (!vm.doc._id) {
          DocumentService
            .save(JSON.stringify(vm.doc))
            .$promise
            .then(function success(response) {
                if (response.success) {
                  vm.id = response.message;
                  if (vm.item && vm.file) {
                    vm.item.upload();
                  }
                  $location.path(vm.returnPath + vm.id);
                } else {
                  //flash message, Error
                  alert('Error' + response.message);
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
                if (response.success) {
                  vm.id = response.message;
                  if (vm.item._file.name !== vm.doc.url) {
                    vm.item.upload();
                  } else {
                    $location.path(vm.returnPath + vm.id);
                  }
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
        // flashMessage('Error al guardar el documento');
      }
    }
  }
})();
