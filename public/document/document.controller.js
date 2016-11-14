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
    vm.minDate = new Date(myDate.getFullYear() - 1, 12, 1);
    vm.maxDate = new Date(myDate.getFullYear() + 1, 0, 1);
    vm.receiverTypes = ReceiverTypeService.get();
    vm.receptionists = ReceptionistService.get();
    vm.respondents = RespondentService.get();
    vm.statusTypes = StatusService.get();
    vm.submit = submit;
    vm.returnPath = '/document/view/';
    vm.uploadPath = '/api/document/upload/';
    vm.timeString = '00:00:00';

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

    if ($routeParams.documentId) {
      DocumentService
        .query({documentId: $routeParams.documentId})
        .$promise
        .then(function success(response) {
          vm.doc = response;
          vm.doc.draftDate = new Date(vm.doc.draftDate);
          vm.doc.signDate = new Date(vm.doc.signDate);
          vm.doc.reception.receptionDate = new Date(vm.doc.reception.receptionDate);
          vm.doc.createdAt = new Date(vm.doc.createdAt);
          vm.doc.updatedAt = new Date();
        });
    } else {
      vm.doc = getBaseDoc();
    }

    function getBaseDoc() {
      var data = {
        number: 'Sin número',
        status: '',
        receiver: {
          type: '',
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
        createdAt: new Date(),
        updatedAt: new Date()
      };
      data.entryUser.name = vm.currentUser.name;
      data.entryUser.email = vm.currentUser.email;
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
