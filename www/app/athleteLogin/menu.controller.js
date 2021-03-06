(function () {
    'use strict';

    angular
        .module('app.loginMenuCtrl', [])

    .controller('LoginMenuCtrl', function (IonicAlertSvc, $state, LoadingSpinner, $scope, $timeout, $ionicModal, AuthSvc) {
        var vm = this;

        vm.password = { value:"fu3lst4tion!" };
  		vm.loginData = { username:"fsdemo-manager", password:"FuelStation17!" };
        vm.authSvc = AuthSvc;

        vm.closeModal = _closeModal;
        vm.closeFSModal = _closeFSModal;
        vm.onSubmitPassword = _onSubmitPassword;
        vm.onSubmitFS = _onSubmitFS;
        vm.openModal = _openModal;
		vm.openFSLogin = _openFSLogin;
		vm.changePassword = _changePassword;

        vm.newUser = { username:'fsdemo-student', password:'TempPass17!' };
        vm.authNewUser = function(loginData) {
            return AuthSvc.authNewUser(loginData);
        };

        loadModal();
		loadFSModal();

		function _changePassword() {
			AuthSvc.changePassword('GoBruins2017', 'FuelStation17!')
				.then(function(result) {
				console.log(result);
			});;
		}
		
        function _closeModal() {
            $scope.modal.hide();
        }

        function _closeFSModal() {
            $scope.fsModal.hide();
        }

        // Manager login
        function _onSubmitPassword() {
            var err = {
                title: "The password you entered was not correct. Please try again.",
                stack: (new Error()).stack,
                cause: "Wrong manager login password"
            };

            if (vm.password.value === "fu3lst4tion!") {
                $state.go('tab.orderList', null, {
                    reload: true
                });
            } else {
                IonicAlertSvc.error(err);
            }
        }
        // FS login
        function _onSubmitFS() {
            var err = {
                title: "The password you entered was not correct. Please try again.",
                stack: (new Error()).stack,
                cause: "Wrong manager login password"
            };

			AuthSvc.login(vm.loginData).then(function(token) {
				console.info("idToken", token);
                $state.go('tab.orderList', null, {
                    reload: true
                });
			}).catch(function(err) {
				IonicAlertSvc.error(err);
			});
        }

        function _openModal() {
            $scope.modal.show();
        }

        function loadModal() {
            $ionicModal.fromTemplateUrl('app/manager/manager-login.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });
        }
		
		function _openFSLogin() {
            if (AuthSvc.isAuthenticated()) {
                AuthSvc.logout();
            } else {
                $scope.fsModal.show();
            }
		};

        function loadFSModal() {
            $ionicModal.fromTemplateUrl('app/fsLogin/fs-login.modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                $scope.fsModal = modal;
            });

            $scope.$on('$destroy', function () {
                $scope.fsModal.remove();
            });
        }
    });
})();
