

# Deploy UberClone on Cloud using Jenkins - DevSecOps Project!

### **Phase 1: Initial Setup and Deployment**

---

# Step 1: Launch EC2 Instance (Ubuntu 22.04 - t2.large)

This guide walks you through launching an EC2 instance running Ubuntu 22.04 with a `t2.large` instance type on AWS. It also includes steps for creating and attaching an IAM role for administrative purposes.

---

## 1. Sign In to AWS Console

* Log in to your [AWS Management Console](https://console.aws.amazon.com/).

---

## 2. Navigate to EC2 Dashboard

* Go to the **Services** menu and select **EC2** under the **Compute** section.

---

## 3. Launch Instance

* Click the **Launch Instance** button to begin creating your EC2 instance.

---

## 4. Choose Amazon Machine Image (AMI)

* Select a suitable AMI (e.g., **Ubuntu Server 22.04 LTS**).

---

## 5. Choose Instance Type

* Choose **t2.large**.
* Click **Next: Configure Instance Details**.

---

## 6. Configure Instance Details

* **Number of Instances**: Set to `1`.
* Configure optional settings (network, subnet, IAM role, etc.).
* **Storage**:

  * Add a new volume or edit the existing one.
  * Recommended: Set size to **30GB**.
* Click **Next: Add Tags**.

---

## 7. Add Tags (Optional)

* Add tags such as:

  * `Name: MyUbuntuServer`
  * `Environment: Dev`
* Click **Next: Configure Security Group**.

---

## 8. Configure Security Group

* **Choose existing** or **create a new** security group.
* Ensure inbound rules allow required access:

  * SSH (port 22)
  * HTTP (port 80), HTTPS (port 443) if applicable
* Click **Review and Launch**.

---

## 9. Select Key Pair

* Choose an existing key pair or create a new one.
* **Important**: Confirm that you have access to the associated private key file (`.pem`).
* Acknowledge the prompt and click **Launch Instances**.

---

## 10. Access Your EC2 Instance

* Once the instance is running, connect using SSH:

  ```bash
  ssh -i /path/to/your-key.pem ubuntu@<public-ip>
  ```

---

## 11. Create IAM Role and Attach to Instance

### Step 1: Create IAM Role

1. Go to the AWS search bar, type **IAM**, and select **Roles**.
2. Click **Create Role**.
3. **Trusted Entity**: Select **AWS service**.
4. **Use Case**: Choose **EC2**.
5. Click **Next**.
6. **Permissions**:

   * Select **AdministratorAccess** (for learning/testing purposes).
   * Click **Next**.
7. **Role Name**: Provide a name (e.g., `EC2AdminRole`) and click **Create Role**.

### Step 2: Attach IAM Role to EC2 Instance

1. Go to the **EC2 Dashboard**.
2. Select your instance.
3. Click **Actions → Security → Modify IAM Role**.
4. Choose the role you created.
5. Click **Update IAM Role**.

---

## ✅ Notes and Best Practices

* Make sure your security group does **not expose** ports unnecessarily.
* Keep your private key file secure.
* Use **least privilege** principle in production instead of full `AdministratorAccess`.

---


**Step 2: Clone the Code:**

- Update all the packages and then clone the code.
- Clone your application's code repository onto the EC2 instance:
    
    ```bash
    git clone https://github.com/Ratan456-star/DevSecOps-UberClone.git
    ```
    

**Step 3: Install Docker and Run the App Using a Container:**

- Set up Docker on the EC2 instance:
    
    ```bash
    
    sudo apt-get update
    sudo apt-get install docker.io -y
    sudo usermod -aG docker $USER  # Replace with your system's username, e.g., 'ubuntu'
    newgrp docker
    sudo chmod 777 /var/run/docker.sock
    ```
    
- Build and run your application using Docker containers:
    
    ```bash
    docker build -t uberclone .
    docker run -d --name uberclone -p 8081:3000 uberclone:latest
    
    #to delete
    docker stop <containerid>
    docker rmi -f uberclone
    ```

It will show an error cause you need API key

**Phase 2: Security**

1. **Install SonarQube and Trivy:**
    - Install SonarQube and Trivy on the EC2 instance to scan for vulnerabilities.
        
        sonarqube
        ```
        docker run -d --name sonar -p 9000:9000 sonarqube:lts-community
        ```
        
        
        To access: 
        
        publicIP:9000 (by default username & password is admin)
        
        To install Trivy:
        ```
        sudo apt-get install wget apt-transport-https gnupg lsb-release
        wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
        echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
        sudo apt-get update
        sudo apt-get install trivy        
        ```
        
        to scan image using trivy
        ```
        trivy image <imageid>
        ```
        
        
2. **Integrate SonarQube and Configure:**
    - Integrate SonarQube with your CI/CD pipeline.
    - Configure SonarQube to analyze code for quality and security issues.

**Phase 3: CI/CD Setup**

1. **Install Jenkins for Automation:**
    - Install Jenkins on the EC2 instance to automate deployment:
    Install Java
    
    ```bash
    sudo apt update
    sudo apt install fontconfig openjdk-17-jre
    java -version
    openjdk version "17.0.8" 2023-07-18
    OpenJDK Runtime Environment (build 17.0.8+7-Debian-1deb12u1)
    OpenJDK 64-Bit Server VM (build 17.0.8+7-Debian-1deb12u1, mixed mode, sharing)
    
    #jenkins
    sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
    https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null
    sudo apt-get update
    sudo apt-get install jenkins
    sudo systemctl start jenkins
    sudo systemctl enable jenkins
    ```
    
    - Access Jenkins in a web browser using the public IP of your EC2 instance.
        
        publicIp:8080
        
2. **Install Necessary Plugins in Jenkins:**

Goto Manage Jenkins →Plugins → Available Plugins →

Install below plugins

1 Eclipse Temurin Installer (Install without restart)

2 SonarQube Scanner (Install without restart)

3 NodeJs Plugin (Install Without restart)

4 Email Extension Plugin

Here's your updated `README.md`-style document with the **new pipeline script** that uses your GitHub repo and the `terraform` directory. The pipeline section has been replaced as requested.

---

# EKS Provisioning via Jenkins Pipeline with Terraform

This guide walks you through installing the Terraform plugin in Jenkins, configuring Terraform as a tool, modifying the backend setup, and provisioning an AWS EKS cluster using a parameterized Jenkins pipeline.

---

## 1. Install Terraform Plugin in Jenkins

### 1.1 Open Jenkins Dashboard

* Navigate to your Jenkins instance in a browser.

### 1.2 Go to Plugin Manager

* From the sidebar:
  **Manage Jenkins → Plugins**

### 1.3 Install Terraform Plugin

* In the **Available** tab, search for **Terraform**.
* Select it and click **Install without restart** (or restart if required).

---

## 2. Configure Terraform Tool in Jenkins

### 2.1 Locate Terraform Path on Jenkins Host

SSH into the machine where Jenkins is installed and run:

```bash
which terraform
```

This returns the path to the Terraform binary (e.g., `/usr/local/bin/terraform`).

### 2.2 Add Terraform to Jenkins Tools

* Go to:
  **Manage Jenkins → Global Tool Configuration**
* Scroll to the **Terraform** section.
* Click **Add Terraform**:

  * **Name**: `terraform`
  * **Path to Terraform**: Paste the path (e.g., `/usr/local/bin/terraform`)
* Click **Apply** and **Save**.

---

## 3. Modify the `backend.tf` File

* Locate the `backend.tf` file in the Terraform project directory (e.g., `terraform/backend.tf`).
* Modify the bucket name:

```hcl
bucket = "your-unique-s3-bucket-name"
```

---

## 4. Create Jenkins Pipeline Job for EKS Provisioning

### 4.1 Create a New Pipeline Job

* Go to Jenkins dashboard → **New Item**
* Enter a name (e.g., `eks-provision-pipeline`)
* Select **Pipeline**, click **OK**

### 4.2 Add Build Parameters

* Enable **This project is parameterized**
* Add a **String Parameter**:

  * **Name**: `action`
  * **Default Value**: `apply`
  * **Description**: Accepts `apply` or `destroy`

---

## 5. Add Jenkins Pipeline Script

Paste the following into the **Pipeline Script** section:

```groovy
pipeline {
    agent any
    stages {
        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/Ratan456-star/DevSecOps-UberClone.git'
            }
        }
        stage('Terraform version') {
            steps {
                sh 'terraform --version'
            }
        }
        stage('Terraform init') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                }
            }
        }
        stage('Terraform validate') {
            steps {
                dir('terraform') {
                    sh 'terraform validate'
                }
            }
        }
        stage('Terraform plan') {
            steps {
                dir('terraform') {
                    sh 'terraform plan'
                }
            }
        }
        stage('Terraform apply/destroy') {
            steps {
                dir('terraform') {
                    sh 'terraform ${action} --auto-approve'
                }
            }
        }
    }
}
```

---

## 6. Build and Provision the EKS Cluster

### 6.1 Run the Job

* Click **Build with Parameters**
* Enter `apply` (or `destroy`) as the `action`
* Click **Build**

### 6.2 Monitor the Pipeline

* Use **Stage View** or **Console Output** to track progress.
* Provisioning may take **\~10 minutes**.

---

## 7. Verify in AWS Console

* Go to the AWS Console → **EKS**
* Confirm:

  * EKS Cluster is created
  * EC2 node group exists and is running

---

### **Configure Java and Nodejs in Global Tool Configuration**

Goto Manage Jenkins → Tools → Install JDK(17) and NodeJs(16)→ Click on Apply and Save


### SonarQube

Create the token

Goto Jenkins Dashboard → Manage Jenkins → Credentials → Add Secret Text. It should look like this

After adding sonar token

Click on Apply and Save

**The Configure System option** is used in Jenkins to configure different server

**Global Tool Configuration** is used to configure different tools that we install using Plugins

We will install a sonar scanner in the tools.

Create a Jenkins webhook

1. **Configure CI/CD Pipeline in Jenkins:**
- Create a CI/CD pipeline in Jenkins to automate your application deployment.

```groovy
pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'Node16'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/Ratan456-star/DevSecOps-UberClone.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('Sonar-Server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=uberclone \
                        -Dsonar.projectKey=uberclone'''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'SonarQube_Token'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

```

Certainly, here are the instructions without step numbers:

**Install Dependency-Check and Docker Tools in Jenkins**

**Install Dependency-Check Plugin:**

- Go to "Dashboard" in your Jenkins web interface.
- Navigate to "Manage Jenkins" → "Manage Plugins."
- Click on the "Available" tab and search for "OWASP Dependency-Check."
- Check the checkbox for "OWASP Dependency-Check" and click on the "Install without restart" button.

**Configure Dependency-Check Tool:**

- After installing the Dependency-Check plugin, you need to configure the tool.
- Go to "Dashboard" → "Manage Jenkins" → "Global Tool Configuration."
- Find the section for "OWASP Dependency-Check."
- Add the tool's name, e.g., "DP-Check."
- Save your settings.

**Install Docker Tools and Docker Plugins:**

- Go to "Dashboard" in your Jenkins web interface.
- Navigate to "Manage Jenkins" → "Manage Plugins."
- Click on the "Available" tab and search for "Docker."
- Check the following Docker-related plugins:
  - Docker
  - Docker Commons
  - Docker Pipeline
  - Docker API
  - docker-build-step
- Click on the "Install without restart" button to install these plugins.

**Add DockerHub Credentials:**

- To securely handle DockerHub credentials in your Jenkins pipeline, follow these steps:
  - Go to "Dashboard" → "Manage Jenkins" → "Manage Credentials."
  - Click on "System" and then "Global credentials (unrestricted)."
  - Click on "Add Credentials" on the left side.
  - Choose "Secret text" as the kind of credentials.
  - Enter your DockerHub credentials (Username and Password) and give the credentials an ID (e.g., "docker").
  - Click "OK" to save your DockerHub credentials.

Now, you have installed the Dependency-Check plugin, configured the tool, and added Docker-related plugins along with your DockerHub credentials in Jenkins. You can now proceed with configuring your Jenkins pipeline to include these tools and credentials in your CI/CD process.

```groovy
pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'Node16'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git branch: 'main', url: 'https://github.com/Ratan456-star/DevSecOps-UberClone.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('Sonar-Server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=uberclone \
                        -Dsonar.projectKey=uberclone'''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'SonarQube_Token'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('OWASP FS Scan') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('TRIVY File System Scan') {
            steps {
                sh 'trivy fs . > trivyfs.txt'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh 'docker build -t uberclone .'
                    sh 'docker tag uberclone ratanpandey07/uberclone:latest'
                    sh 'docker push ratanpandey07/uberclone:latest'
                }
            }
        }

        stage('TRIVY Image Scan') {
            steps {
                sh 'trivy image ratanpandey07/uberclone:latest > trivyimage.txt'
            }
        }

        stage('Deploy to Container') {
            steps {
                sh 'docker run -d -p 8081:3000 ratanpandey07/uberclone:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    dir('Kubernetes') {
                        withKubeConfig(
                            caCertificate: '', 
                            clusterName: '', 
                            contextName: '', 
                            credentialsId: 'kubernetes', 
                            namespace: '', 
                            restrictKubeConfigAccess: false, 
                            serverUrl: ''
                        ) {
                            sh 'kubectl apply -f deployment.yml'
                            sh 'kubectl apply -f service.yml'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            emailext(
                attachLog: true,
                subject: "${currentBuild.result}",
                body: """\
                    Project: ${env.JOB_NAME}<br/>
                    Build Number: ${env.BUILD_NUMBER}<br/>
                    URL: ${env.BUILD_URL}<br/>
                """,
                to: 'ratan.pandey0309@gmail.com',
                attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
            )
        }
    }
}

```

**Phase 4: Monitoring**

1. **Install Prometheus and Grafana:**

   Set up Prometheus and Grafana to monitor your application.

   **Installing Prometheus:**

   First, create a dedicated Linux user for Prometheus and download Prometheus:

   ```bash
   sudo useradd --system --no-create-home --shell /bin/false prometheus
   wget https://github.com/prometheus/prometheus/releases/download/v2.47.1/prometheus-2.47.1.linux-amd64.tar.gz
   ```

   Extract Prometheus files, move them, and create directories:

   ```bash
   tar -xvf prometheus-2.47.1.linux-amd64.tar.gz
   cd prometheus-2.47.1.linux-amd64/
   sudo mkdir -p /data /etc/prometheus
   sudo mv prometheus promtool /usr/local/bin/
   sudo mv consoles/ console_libraries/ /etc/prometheus/
   sudo mv prometheus.yml /etc/prometheus/prometheus.yml
   ```

   Set ownership for directories:

   ```bash
   sudo chown -R prometheus:prometheus /etc/prometheus/ /data/
   ```

   Create a systemd unit configuration file for Prometheus:

   ```bash
   sudo nano /etc/systemd/system/prometheus.service
   ```

   Add the following content to the `prometheus.service` file:

   ```plaintext
   [Unit]
   Description=Prometheus
   Wants=network-online.target
   After=network-online.target

   StartLimitIntervalSec=500
   StartLimitBurst=5

   [Service]
   User=prometheus
   Group=prometheus
   Type=simple
   Restart=on-failure
   RestartSec=5s
   ExecStart=/usr/local/bin/prometheus \
     --config.file=/etc/prometheus/prometheus.yml \
     --storage.tsdb.path=/data \
     --web.console.templates=/etc/prometheus/consoles \
     --web.console.libraries=/etc/prometheus/console_libraries \
     --web.listen-address=0.0.0.0:9090 \
     --web.enable-lifecycle

   [Install]
   WantedBy=multi-user.target
   ```

   Here's a brief explanation of the key parts in this `prometheus.service` file:

   - `User` and `Group` specify the Linux user and group under which Prometheus will run.

   - `ExecStart` is where you specify the Prometheus binary path, the location of the configuration file (`prometheus.yml`), the storage directory, and other settings.

   - `web.listen-address` configures Prometheus to listen on all network interfaces on port 9090.

   - `web.enable-lifecycle` allows for management of Prometheus through API calls.

   Enable and start Prometheus:

   ```bash
   sudo systemctl enable prometheus
   sudo systemctl start prometheus
   ```

   Verify Prometheus's status:

   ```bash
   sudo systemctl status prometheus
   ```

   You can access Prometheus in a web browser using your server's IP and port 9090:

   `http://<your-server-ip>:9090`

   **Installing Node Exporter:**

   Create a system user for Node Exporter and download Node Exporter:

   ```bash
   sudo useradd --system --no-create-home --shell /bin/false node_exporter
   wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
   ```

   Extract Node Exporter files, move the binary, and clean up:

   ```bash
   tar -xvf node_exporter-1.6.1.linux-amd64.tar.gz
   sudo mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
   rm -rf node_exporter*
   ```

   Create a systemd unit configuration file for Node Exporter:

   ```bash
   sudo nano /etc/systemd/system/node_exporter.service
   ```

   Add the following content to the `node_exporter.service` file:

   ```plaintext
   [Unit]
   Description=Node Exporter
   Wants=network-online.target
   After=network-online.target

   StartLimitIntervalSec=500
   StartLimitBurst=5

   [Service]
   User=node_exporter
   Group=node_exporter
   Type=simple
   Restart=on-failure
   RestartSec=5s
   ExecStart=/usr/local/bin/node_exporter --collector.logind

   [Install]
   WantedBy=multi-user.target
   ```

   Replace `--collector.logind` with any additional flags as needed.

   Enable and start Node Exporter:

   ```bash
   sudo systemctl enable node_exporter
   sudo systemctl start node_exporter
   ```

   Verify the Node Exporter's status:

   ```bash
   sudo systemctl status node_exporter
   ```

   You can access Node Exporter metrics in Prometheus.

2. **Configure Prometheus Plugin Integration:**

   Integrate Jenkins with Prometheus to monitor the CI/CD pipeline.

   **Prometheus Configuration:**

   To configure Prometheus to scrape metrics from Node Exporter and Jenkins, you need to modify the `prometheus.yml` file. Here is an example `prometheus.yml` configuration for your setup:

   ```yaml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'node_exporter'
       static_configs:
         - targets: ['localhost:9100']

     - job_name: 'jenkins'
       metrics_path: '/prometheus'
       static_configs:
         - targets: ['<your-jenkins-ip>:<your-jenkins-port>']
   ```

   Make sure to replace `<your-jenkins-ip>` and `<your-jenkins-port>` with the appropriate values for your Jenkins setup.

   Check the validity of the configuration file:

   ```bash
   promtool check config /etc/prometheus/prometheus.yml
   ```

   Reload the Prometheus configuration without restarting:

   ```bash
   curl -X POST http://localhost:9090/-/reload
   ```

   You can access Prometheus targets at:

   `http://<your-prometheus-ip>:9090/targets`


####Grafana

**Install Grafana on Ubuntu 22.04 and Set it up to Work with Prometheus**

**Step 1: Install Dependencies:**

First, ensure that all necessary dependencies are installed:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https software-properties-common
```

**Step 2: Add the GPG Key:**

Add the GPG key for Grafana:

```bash
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
```

**Step 3: Add Grafana Repository:**

Add the repository for Grafana stable releases:

```bash
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

**Step 4: Update and Install Grafana:**

Update the package list and install Grafana:

```bash
sudo apt-get update
sudo apt-get -y install grafana
```

**Step 5: Enable and Start Grafana Service:**

To automatically start Grafana after a reboot, enable the service:

```bash
sudo systemctl enable grafana-server
```

Then, start Grafana:

```bash
sudo systemctl start grafana-server
```

**Step 6: Check Grafana Status:**

Verify the status of the Grafana service to ensure it's running correctly:

```bash
sudo systemctl status grafana-server
```

**Step 7: Access Grafana Web Interface:**

Open a web browser and navigate to Grafana using your server's IP address. The default port for Grafana is 3000. For example:

`http://<your-server-ip>:3000`

You'll be prompted to log in to Grafana. The default username is "admin," and the default password is also "admin."

**Step 8: Change the Default Password:**

When you log in for the first time, Grafana will prompt you to change the default password for security reasons. Follow the prompts to set a new password.

**Step 9: Add Prometheus Data Source:**

To visualize metrics, you need to add a data source. Follow these steps:

- Click on the gear icon (⚙️) in the left sidebar to open the "Configuration" menu.

- Select "Data Sources."

- Click on the "Add data source" button.

- Choose "Prometheus" as the data source type.

- In the "HTTP" section:
  - Set the "URL" to `http://localhost:9090` (assuming Prometheus is running on the same server).
  - Click the "Save & Test" button to ensure the data source is working.

**Step 10: Import a Dashboard:**

To make it easier to view metrics, you can import a pre-configured dashboard. Follow these steps:

- Click on the "+" (plus) icon in the left sidebar to open the "Create" menu.

- Select "Dashboard."

- Click on the "Import" dashboard option.

- Enter the dashboard code you want to import (e.g., code 1860).

- Click the "Load" button.

- Select the data source you added (Prometheus) from the dropdown.

- Click on the "Import" button.

You should now have a Grafana dashboard set up to visualize metrics from Prometheus.

Grafana is a powerful tool for creating visualizations and dashboards, and you can further customize it to suit your specific monitoring needs.

That's it! You've successfully installed and set up Grafana to work with Prometheus for monitoring and visualization.

2. **Configure Prometheus Plugin Integration:**
    - Integrate Jenkins with Prometheus to monitor the CI/CD pipeline.


**Phase 5: Notification**

1. **Implement Notification Services:**
    - Set up email notifications in Jenkins or other notification mechanisms.

**Phase 6: Kubernetes Deployment:**

Here's your **Phase 6: Kubernetes Deployment** section rewritten to **exactly match the formatting style** used in the earlier steps (like Phase 5 and the Grafana setup). It uses consistent bold titles, bullet points, and code blocks suitable for direct use in your `README.md`:

---

### **Phase 6: Kubernetes Deployment**

1. **Connect to Jenkins EC2 Instance:**
   Open **Putty** and connect to your Jenkins EC2 instance using SSH.

2. **Update Kubeconfig:**
   Run the following commands:

   ```bash
   aws eks update-kubeconfig --name <CLUSTER NAME> --region <CLUSTER REGION>
   aws eks update-kubeconfig --name EKS_UBERCLONE --region ap-south-1
   ```

3. **Verify Cluster Nodes:**
   Check your Kubernetes nodes:

   ```bash
   kubectl get nodes
   ```

4. **Transfer Configuration File:**
   Move the kubeconfig file to the Jenkins master or your local file system and keep it safe.

5. **Create Secret File:**
   Save the kubeconfig content inside a file named `secret-file.txt`. You’ll use this in the Kubernetes credentials section of Jenkins.

6. **Install Kubernetes Plugin in Jenkins:**
   Install the plugin via **Manage Jenkins → Plugins**.

7. **Add Kubernetes Credentials in Jenkins:**
   Navigate to:

   ```
   Manage Jenkins → Manage Credentials → (Jenkins Global) → Add Credentials
   ```

   Use the contents of `secret-file.txt` to create the new credentials.

8. **Deploy to Kubernetes:**
   Add the following stage to your Jenkins pipeline for Kubernetes deployment:

   ```groovy
   stage('Deploy to Kubernetes') {
       steps {
           script {
               dir('Kubernetes') {
                   withKubeConfig(
                       caCertificate: '', 
                       clusterName: '', 
                       contextName: '', 
                       credentialsId: 'kubernetes', 
                       namespace: '', 
                       restrictKubeConfigAccess: false, 
                       serverUrl: ''
                   ) {
                       sh 'kubectl apply -f deployment.yml'
                       sh 'kubectl apply -f service.yml'
                   }
               }
           }
       }
   }
   ```

9. **Access Your Application:**
   Open your browser and go to:

   ```
   http://adb3b9e438e8d4dd786eba830b3afe81-384755061.ap-south-1.elb.amazonaws.com/login
   ```

---

