pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        lock resource: 'cilantro'
    }

    stages {
        stage('Prepare') {
            steps {
                    echo 'Preparing..'
                    sh 'make init'
                    sh 'docker-compose pull && docker-compose up -d'
            }
        }
        stage('Test backend') {
            steps {
                    echo 'Testing backend..'
                    sleep 10
                    sh 'make test-backend'
            }
        }
        stage('Test frontend (e2e)') {
            steps {
                echo 'Testing frontend (e2e)..'
                sh 'xvfb-run make test-e2e'
            }
        }
        stage('Build code documentation') {
                when{
                    branch 'master'
                }
            steps {
                echo 'Building docu..'
                sh 'make build-doc'
            }
        }
    }
    post {
        always {
            sh 'make down'
            sh 'docker-compose logs > docker.log -t'
            sh 'git clean -f'
            sh 'rm -rf doc/_build/doctrees/'
            archiveArtifacts artifacts: 'docker.log', fingerprint: true
        }
        unsuccessful {
            sh 'docker-compose logs'
        }
    }
}
