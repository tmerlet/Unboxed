(function() {  
  var app = angular.module('favouritLanguage', []); 

   app.controller('LanguageController' , ["$scope", "$http", function($scope, $http) {


    $scope.find = function(){
      
// Clear previous answer
      $scope.answer = ""

// Return all the favourit languages in a User's repos, and save them in an array
      var languagesInRepos = []
      $http.get("https://api.github.com/users/" + $scope.username + "/repos").success(function(repos){
  
          for (i = 0; i < repos.length; i++) { 
              languagesInRepos.push(repos[i].language);
          }

// Create a hash containing the name of a language as the key, and how many times it was the favourit language as the value.  
          var languageHash = { };
          for (var i = 0, j = languagesInRepos.length; i < j; i++) {
             if (languageHash[languagesInRepos[i]]) {
                languageHash[languagesInRepos[i]]++;
             }
             else {
                languageHash[languagesInRepos[i]] = 1;
             } 
          }

//  I want to ignore the key "null", so I delete that pair if it exists 
          if (languageHash['null'] > 0) {
            delete languageHash['null']
          }

// Iterate through the associative array, and find out what was the maximum times any language was used 
          var max = 0;
          for (var index in languageHash) {
              if (!languageHash.hasOwnProperty(index)) {
                  continue;
              }
              if (languageHash[index] > max)
                max = languageHash[index]           
          }

// Iterate through the associative array and find out which language was favourite most times.  (There may be more than one)
          var favouritLanguages = []
          for (var index in languageHash) {
              if (!languageHash.hasOwnProperty(index)) {
                  continue;
              }
              if (languageHash[index] == max) {
                favouritLanguages.push(index) 
              }        
          }

//  Display a user's favourite language.  In some cases, a user might not have a favourite language at all so I accounted for that.    
          if (favouritLanguages.length == 0) {
            $scope.answer = "This user does not have a favourit language"
          }

          if (favouritLanguages.length == 1) {
            $scope.answer = "This user's favourit language is: " + favouritLanguages.toString()      
          }else{
            $scope.answer = "This user's has more than one favourit languages!  And they are: " + favouritLanguages.toString()
          }

//  If the http call return's an error, I'm assuming that the user does not exist.  There obviously might be other reasons.  
      }).error(function() {
        $scope.answer = "I cannot find this user in the Github database"
      });  
    };

   }])
})();

