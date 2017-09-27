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
    'DocumentTypeService',
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
      DocumentTypeService,
      ReceiverTypeService,
      ReceptionistService,
      RespondentService,
      StatusService,
      DocumentService
    ) {
    var vm = this;
    vm.now = new Date();
    vm.uploader = new FileUploader();
    vm.id = '';
    vm.doc = {};
    vm.file = null;
    vm.files = [];
    vm.item = {};
    vm.items = [];
    vm.minDate = new Date(vm.now.getFullYear() - 3, 12, 1);
    vm.maxDate = new Date(vm.now.getFullYear() + 3, 0, 1);
    vm.documentTypes = DocumentTypeService.get();
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
    vm.deadlineHours = 0;
    vm.deadlineMinutes = 0;
    vm.receptionDeadlineHours = 0;
    vm.receptionDeadlineMinutes = 0;
    vm.currentUser = getCurrentUser();
    vm.internalDepartments = [
      'Contraloría Interna',
      'Gerencia de Auditoría Interna',
      'Gerencia de Auditoría (Administrativa y Procesos)'
    ];

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
          data.updatedAt = vm.now;
          vm.doc = data;
          setDocumentDateParts(vm.doc);
        });
    } else {
      vm.doc = getBaseDoc();
      setDocumentDateParts(vm.doc);
    }

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
    };

    vm.uploader.onAfterAddingFile = function(item) {
      var name = item._file.name;
      name = TextUtilsService.trim(name);
      name = TextUtilsService.removeDiacritics(name);
      if (vm.doc.url.length > 0) {
        name = "rec_" + name;
      }
      item.file.name = name;
      item.file.name = name;
      vm.item = item;
      vm.file = vm.item.file;
      vm.items.push(item);
      vm.files.push(item);
      if (vm.doc.url.length < 1) {
        vm.doc.url = name;
      } else {
        vm.doc.urlReceived = name;
      }
    };

    vm.uploader.onBeforeUploadItem = function(item) {
      item.url = vm.uploadPath + vm.id;
    };

    vm.uploader.onCompleteAll = function() {
      if (vm.id.length > 0) {
        $location.path(vm.returnPath + vm.id);
      }
    };

    function getCurrentUser() {
      var userToken = TokenService.getUserFromToken();
      return {
        name: userToken._doc.name,
        email: userToken._doc.email
      };
    }

    function getBaseDoc() {
      return {
        number: '',
        numberExecutiveOffice: '',
        documentType: '',
        consecutive: 0,
        internalDepartment: '',
        status: '',
        receiver: {
          type: '',
          organization: '',
          name: ''
        },
        url: '',
        urlReceived: '',
        draftDate: new Date(),
        signDate: new Date(),
        sealDate: new Date(),
        hasDeadline: false,
        hoursUntilDeadline: 0,
        deadline: new Date(),
        entryUser: {
          name: vm.currentUser.name,
          email: vm.currentUser.email
        },
        reception: {
          controlNumber:'',
          receptionDate: new Date(),
          office: '',
          receptionist: '',
          subject: '',
          hasDeadline: false,
          hoursUntilDeadline: 0,
          deadline: new Date()
        },
        subject: '',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    function setDocumentDateParts(data) {
      var dateParts = DateUtilsService.getDateParts(data.sealDate);
      vm.sealDateTimeHours = dateParts.hours;
      vm.sealDateTimeMinutes = dateParts.minutes;
      if (data.hasDeadline) {
        dateParts = DateUtilsService.getDateParts(data.deadline);
        vm.deadlineHours = dateParts.hours;
        vm.deadlineMinutes = dateParts.minutes;
      }
      if (data.reception.deadline) {
        dateParts = DateUtilsService.getDateParts(data.reception.deadline);
        vm.receptionDeadlineHours = dateParts.hours;
        vm.receptionDeadlineMinutes = dateParts.minutes;
      }
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
        return false;
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
                  if (vm.files[0]) {
                    vm.uploader.uploadAll();
                  }
                  $location.path(vm.returnPath + vm.id);
                } else {
                  flashMessage(response.message);
                }
                return response;
              }, function error(response) {
                if (response.status === 404) {
                  flashMessage('Recurso no encontrado');
                } else {
                  flashMessage('Error no especificado');
                }
                return response;
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
                    vm.uploader.uploadAll();
                  } else {
                    $location.path(vm.returnPath + vm.id);
                  }
                }
                return response;
              }, function error(response) {
                if (response.status === 404) {
                  flashMessage('Recurso no encontrado');
                } else {
                  flashMessage('Error no especificado');
                }
              }
            );
        }
      } else {
        flashMessage('Error al guardar el documento');
      }
    }
  }
})();
