pipeline {
  agent any
  stages {
    stage('Compile') {
      parallel {
        stage('Compile') {
          steps {
            echo 'Some message'
          }
        }
        stage('') {
          steps {
            writeFile(file: 'TEST', text: 'TEST 1')
          }
        }
      }
    }
  }
}