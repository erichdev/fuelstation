(function () {
    'use strict';

    angular
        .module('app.studentLogin', [])

    .controller('StudentLoginCtrl', function (AccountSvc, OrderSvc, AthleteSvc, IonicAlertSvc, CheckoutSvc, ChoiceSvc, $state, LoadingSpinner, $ionicModal, $scope, $timeout, $localstorage) {
        var vm = this;

        vm.accountSvc = AccountSvc;
        vm.password = {};

        vm.deleteButton = _deleteButton;
        vm.numButton = _numButton;

        init();

        function init() {
            // On page load, remove all previous athlete and order data
            AccountSvc.clear();
            OrderSvc.clear();

            var post = $localstorage.getObject('fsErrors');
            //console.log("LOCAL STORAGE ERRORS", post);
            
           // throw new Error("TESTERROR");
        }

        function _deleteButton() {
            AccountSvc.studentId = AccountSvc.studentId.slice(0, AccountSvc.studentId.length - 1)
        }

        function _numButton(num) {
            // Student ID must be 9 characters long. 
            if (AccountSvc.studentId.length < 9) {
                AccountSvc.studentId = AccountSvc.studentId + num;
                checkStudentId();
            }
        }

        function checkStudentId() {
            if (AccountSvc.studentId.length === 9) {
                LoadingSpinner.show();
                getAthleteData();
            }
        }

        /**
         * Gets athlete data, saves data in AccountSvc, gets athlete checkout history, computes logic to hide choice categories, and redirects to cart page
         */
        function getAthleteData() {
            //
            AthleteSvc.getAthlete(AccountSvc.studentId)
                .then(AccountSvc.saveAthleteData)
                .then(AccountSvc.getSnackLimits)
                .then(getCheckoutHistory)
                .then(AccountSvc.initializeHiddenCategories)
                .then(getAllChoices)
                .then(redirectToCart)
                .catch(IonicAlertSvc.error);
        }

        /**
         * Get all snack choices, then initialize hidden categories
         */
        function getAllChoices(success) {
            if (success) {
                ChoiceSvc.getAllChoices()
                    .then(ChoiceSvc.initializeChoiceCategories)
                    .catch(IonicAlertSvc.error);
            }
        }

        /** 
         * Gets athlete checkout history
         * @returns {object} Counts of: Today's snack checkouts, current month snack checkouts, and whether athlete has checked out pre, post, or hydration today
         */
        function getCheckoutHistory(id) {
            return CheckoutSvc.getCheckoutHistory(id)
                .then(function (response) {
                    return response;
                }, IonicAlertSvc.error);
        }

        function redirectToCart() {
            LoadingSpinner.hide();
            $state.go('cart', null, {
                reload: true
            });
        }
    });
})();
