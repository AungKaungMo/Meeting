pipeline {
    agent any

    environment {
        DOTENV = readFile('.env').split('\n').collectEntries { line ->
            line.split('=').with { [(it[0]): it.size() > 1 ? it[1] : '' ] }
        }

        DOCKERHUB_USERNAME = DOTENV['DOCKERHUB_USERNAME']
        DOCKERHUB_PASSWORD = DOTENV['DOCKERHUB_PASSWORD']
        DOCKERHUB_REPO = DOTENV['DOCKERHUB_REPO']
        DOCKERHUB_CREDENTIALS = DOTENV['DOCKERHUB_CREDENTIALS']

        GITHUB_REPO_LINK = DOTENV['GITHUB_REPO_LINK']
        GITHUB_BRANCH = DOTENV['GITHUB_BRANCH']

        JENKINS_SSH_CREDENTIAL_ID= DOTENV['JENKINS_SSH_CREDENTIAL_ID']
        PUBLIC_IP_ADDRESS= DOTENV['PUBLIC_IP_ADDRESS']
        SSH_USERNAME= DOTENV['SSH_USERNAME']
        PROJECT_FOLDER_PATH= DOTENV['PROJECT_FOLDER_PATH']
    }

    stages {
        stage('Clone Respository') {
            steps {
                git url: "${GITHUB_REPO_LINK}", branch: "${GITHUB_BRANCH}"
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'docker-compose run app php artisan test'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}"
                sh "docker tag meeting ${DOCKERHUB_REPO}:latest"
                sh "docker push ${DOCKERHUB_REPO}:latest"
            }
        }
        stage('Deploy to Server') {
            steps {
                sshagent(["${JENKINS_SSH_CREDENTIAL_ID}"]) {
                    sh """
                    ssh ${SSH_USERNAME}@${PUBLIC_IP_ADDRESS} << EOF
                        cd ${PROJECT_FOLDER_PATH} &&
                        docker-compose pull &&
                        docker-compose up -d
                    EOF
                    """ 
                }
            }
        }
    }
}