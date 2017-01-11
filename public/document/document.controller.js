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
    vm.currentUser = getCurrentUser();
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
    vm.uploadPath = '/api/document/upload/';
    vm.sealDateTimeHours = 0;
    vm.sealDateTimeMinutes = 0;
    vm.deadlineTimeHours = 0;
    vm.deadlineTimeMinutes = 0;
    vm.getDeadline = function() {
      var deadline = new Date();
      var m;
      if(moment(vm.doc.sealDate).isValid()) {
        console.log(vm.doc.deadline);
        m = moment(vm.doc.sealDate)
          .add(vm.doc.hoursUntilDeadline, 'hours');
        return moment(vm.doc.deadline).format('LLLL');
      }
      return '';
    }
    vm.setSealDateMinutes = function() {
      var minutes = 0;
      if (!!vm.setSealDateMinutes) {
        minutes = parseInt(vm.sealDateTimeMinutes, 10);
        if (vm.sealDateTimeMinutes > 59) {
          minutes = 59;
        }
        if (vm.sealDateTimeMinutes < 0) {
          minutes = 0;
        }
      }
      //vm.sealDateTimeMinutes = minutes;
      console.log(minutes);
      console.log(vm.sealDateTimeMinutes);
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

    function getCurrentUser() {
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
          vm.doc = response;
          vm.doc.draftDate = new Date(vm.doc.draftDate);
          vm.doc.signDate = new Date(vm.doc.signDate);
          vm.doc.reception.receptionDate = new Date(
            vm.doc.reception.receptionDate
          );
          console.log('hours: ' + moment(
              new Date(vm.doc.reception.receptionDate, 'H')
            )
          );
          console.log('minutes: ' + moment(
              new Date(vm.doc.reception.receptionDate, 'm')
            )
          );

          vm.doc.createdAt = new Date(vm.doc.createdAt);
          vm.doc.updatedAt = new Date();
        });
    } else {
      vm.doc = getBaseDoc();
      console.log(vm.doc.deadline.toString());
    }

    function getBaseDoc() {
      var data = {
        number: 'Sin número',
        status: 'Original',
        receiver: {
          type: '',
          organization: '',
          name: ''
        },
        url: '',
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
          controlNumber:'',
          receptionDate: new Date('2016-12-12T19:18Z'),
          office: '',
          receptionist: '',
          subject: ''
        },
        subject: '',
        content: '',
        createdAt: new Date('2016-12-10T03:12Z'),
        updatedAt: new Date('2016-12-10T03:12Z'),
        entryUser: {
          name: vm.currentUser.name,
          email: vm.currentUser.email
        }
      };
      console.log(moment(data.deadline).isValid());
      var moment1 = moment(data.sealDate);
      //var moment2 = moment(moment1.add(moment.duration(data.hoursUntilDeadline, 'hours')).toDate());
      console.log(moment1.toDate());
      //console.log(moment2.toDate());


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
                  vm.item.upload();
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
