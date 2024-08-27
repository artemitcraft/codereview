      function getPlans() {
        $activityIndicator.startAnimating();
        $http
          .get(appConfig.apiUrl + 'plan' + '?user_login_type=' + 'local' + '&access_token=' + $rootScope.auth_token)
          .success(function (response) {
            $activityIndicator.stopAnimating();
            $scope.planCount = response.data.plans.length;
            $scope.planDetails = response.data.plans;
            $scope.plan_discount = response.data.yearlyPlanDiscount;

            /*LOOP TO GET THE CURRENT PLAN PRICE*/
            for (i = 0; i < $scope.planCount; i++) {
              if ($scope.planDetails[i].myPlan == true) {
                if ($scope.planDetails[i].billingFrequency == 1) {
                  $scope.compareValue = $scope.planDetails[i].price;
                } else if ($scope.planDetails[i].billingFrequency == 12) {
                  $scope.compareValue = $scope.planDetails[i].price;
                  $scope.compareValue = $scope.compareValue * 12;
                }
              }
            }
          })
          .error(function (error) {
            $activityIndicator.stopAnimating();
          });
      }
