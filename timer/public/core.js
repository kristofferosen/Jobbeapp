/**
 * Created by KristofferGard on 14.06.2016.
 */
var jobbeapp = angular.module('jobbeapp', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.kristofferTotal = 0;
    $scope.christerTotal = 0;
    $scope.danielTotal = 0;
    $scope.timertotalt = 0;

    // when landing on the page, get all todos and show them
    $http.get('/api/jobbs')
        .success(function(data) {
            $scope.jobbs = data;
            console.log(data);
            data.forEach(function(jobb){

                $scope.timertotalt = $scope.timertotalt + jobb.Timer;

                if(jobb.Jobbemann == "Kristoffer")
                    $scope.kristofferTotal = $scope.kristofferTotal + jobb.Timer;
                else if(jobb.Jobbemann == "Christer")
                    $scope.christerTotal = $scope.christerTotal + jobb.Timer;
                else if(jobb.Jobbemann == "Daniel")
                    $scope.danielTotal = $scope.danielTotal + jobb.Timer;
            });
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createJobb = function() {
        console.log("ja");
        $http.post('/api/jobbs', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.jobbs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteJobb = function(id) {
        $http.delete('/api/jobbs/' + id)
            .success(function(data) {
                $scope.jobbs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}