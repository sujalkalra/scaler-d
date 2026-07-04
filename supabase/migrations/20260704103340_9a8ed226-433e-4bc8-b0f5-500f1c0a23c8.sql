
CREATE TABLE public.devops_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  icon TEXT,
  content TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.devops_tools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devops_tools TO authenticated;
GRANT ALL ON public.devops_tools TO service_role;

ALTER TABLE public.devops_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view devops tools"
  ON public.devops_tools FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert devops tools"
  ON public.devops_tools FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update devops tools"
  ON public.devops_tools FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete devops tools"
  ON public.devops_tools FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_devops_tools_updated_at
  BEFORE UPDATE ON public.devops_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.devops_tools (slug, name, tagline, icon, order_index, content) VALUES
  ('linux', 'Linux', 'The foundation of modern infrastructure', 'Terminal', 1, E'# Linux\n\nLinux is the backbone of DevOps. Nearly every server, container, and cloud VM runs on Linux.\n\n## Why It Matters\n- Powers 96%+ of the top 1M web servers\n- Foundation for Docker, Kubernetes, and cloud infra\n- Deep understanding of processes, permissions, and networking is essential\n\n## Core Concepts\n- File system hierarchy (`/etc`, `/var`, `/proc`)\n- Users, groups, and permissions (`chmod`, `chown`)\n- Process management (`ps`, `top`, `systemd`)\n- Networking (`ip`, `netstat`, `ss`, `iptables`)\n\n## Learning Path\n1. Master the shell (bash basics)\n2. Learn package management (apt, yum)\n3. Understand systemd services\n4. Practice with a live server (DigitalOcean droplet)'),
  ('git-github', 'Git + GitHub', 'Version control and collaboration', 'GitBranch', 2, E'# Git + GitHub\n\nGit is the distributed version control system that powers modern software collaboration. GitHub is the largest hosting platform for Git repositories.\n\n## Core Workflow\n- `git init`, `git clone`, `git add`, `git commit`, `git push`\n- Branching: `git branch`, `git checkout`, `git merge`\n- Rebasing vs merging\n- Pull requests and code review\n\n## Advanced\n- Interactive rebase\n- Cherry-picking\n- Git hooks\n- GitHub Actions for CI/CD'),
  ('bash', 'Bash', 'Automate everything with scripts', 'Code2', 3, E'# Bash\n\nBash scripting is the glue of DevOps automation.\n\n## Essentials\n- Variables, conditionals, loops\n- Functions and exit codes\n- Piping and redirection\n- `grep`, `awk`, `sed`, `xargs`\n\n## Best Practices\n- Always `set -euo pipefail`\n- Quote your variables\n- Use ShellCheck to lint scripts'),
  ('docker', 'Docker', 'Containerize applications', 'Container', 4, E'# Docker\n\nDocker revolutionized software delivery by making containers accessible.\n\n## Key Concepts\n- Images vs containers\n- Dockerfile best practices (multi-stage builds, small base images)\n- Docker Compose for multi-service apps\n- Registries (Docker Hub, ECR, GHCR)\n\n## Commands\n- `docker build`, `docker run`, `docker ps`, `docker exec`\n- `docker-compose up -d`'),
  ('jenkins', 'Jenkins', 'CI/CD automation server', 'Workflow', 5, E'# Jenkins\n\nJenkins is the most widely adopted open-source CI/CD server.\n\n## Concepts\n- Pipelines as code (Jenkinsfile)\n- Declarative vs scripted pipelines\n- Agents and executors\n- Plugins ecosystem\n\n## Example Pipeline\n```groovy\npipeline {\n  agent any\n  stages {\n    stage(''Build'') { steps { sh ''make build'' } }\n    stage(''Test'') { steps { sh ''make test'' } }\n  }\n}\n```'),
  ('aws', 'AWS', 'The dominant cloud platform', 'Cloud', 6, E'# AWS\n\nAmazon Web Services is the most widely used cloud provider.\n\n## Core Services\n- **Compute**: EC2, Lambda, ECS, EKS\n- **Storage**: S3, EBS, EFS\n- **Networking**: VPC, Route 53, CloudFront\n- **Database**: RDS, DynamoDB\n- **IAM**: identity and access management\n\n## Learn\n1. Set up an AWS account (free tier)\n2. Launch an EC2 instance\n3. Deploy a static site to S3 + CloudFront\n4. Understand IAM roles deeply'),
  ('terraform', 'Terraform', 'Infrastructure as Code', 'FileCode', 7, E'# Terraform\n\nTerraform lets you define infrastructure declaratively using HCL.\n\n## Key Concepts\n- Providers (AWS, GCP, Azure, Kubernetes)\n- Resources and data sources\n- State management (local vs remote)\n- Modules for reusability\n- `terraform plan` before `terraform apply`\n\n## Example\n```hcl\nresource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"\n}\n```'),
  ('ansible', 'Ansible', 'Agentless configuration management', 'Settings', 8, E'# Ansible\n\nAnsible automates provisioning, configuration, and app deployment over SSH.\n\n## Concepts\n- Playbooks (YAML)\n- Inventories\n- Roles and collections\n- Idempotency\n\n## Example Playbook\n```yaml\n- hosts: web\n  tasks:\n    - name: Install nginx\n      apt: name=nginx state=present\n```'),
  ('kubernetes', 'Kubernetes', 'Container orchestration at scale', 'Boxes', 9, E'# Kubernetes\n\nKubernetes (K8s) is the de facto standard for container orchestration.\n\n## Core Objects\n- Pod, Deployment, Service, Ingress\n- ConfigMap, Secret\n- Namespace, ServiceAccount\n- StatefulSet, DaemonSet, Job, CronJob\n\n## Learn\n1. Run `minikube` or `kind` locally\n2. Deploy a simple app with a Deployment + Service\n3. Understand kubectl deeply\n4. Learn Helm for templating'),
  ('helm', 'Helm', 'Kubernetes package manager', 'Package', 10, E'# Helm\n\nHelm is the package manager for Kubernetes.\n\n## Concepts\n- Charts (packaged apps)\n- Values.yaml for configuration\n- Releases (installed instances)\n- Repositories (Artifact Hub)\n\n## Commands\n- `helm install`, `helm upgrade`, `helm rollback`\n- `helm template` for debugging'),
  ('prometheus', 'Prometheus', 'Time-series monitoring', 'Activity', 11, E'# Prometheus\n\nPrometheus is the go-to time-series metrics system for cloud-native apps.\n\n## Concepts\n- Pull-based scraping\n- PromQL query language\n- Exporters (node_exporter, blackbox_exporter)\n- Alertmanager for alerting\n\n## Example Query\n```promql\nrate(http_requests_total{status="500"}[5m])\n```'),
  ('grafana', 'Grafana', 'Dashboards and visualization', 'BarChart3', 12, E'# Grafana\n\nGrafana turns metrics into beautiful, actionable dashboards.\n\n## Features\n- Multi-datasource (Prometheus, Loki, Elasticsearch, MySQL)\n- Alerting\n- Dashboard-as-code (JSON)\n- Community dashboards\n\n## Pair With\n- Prometheus for metrics\n- Loki for logs\n- Tempo for traces'),
  ('elk-stack', 'ELK Stack', 'Centralized logging', 'FileSearch', 13, E'# ELK Stack\n\nElasticsearch + Logstash + Kibana — the classic logging stack.\n\n## Components\n- **Elasticsearch**: search and storage\n- **Logstash**: log ingestion and parsing\n- **Kibana**: visualization\n- **Beats** (Filebeat, Metricbeat): lightweight shippers\n\n## Modern Alternative\nConsider Loki + Grafana for a lighter footprint.'),
  ('sonarqube', 'SonarQube', 'Static code analysis', 'ShieldCheck', 14, E'# SonarQube\n\nSonarQube continuously inspects code quality and security.\n\n## Checks\n- Bugs and code smells\n- Security vulnerabilities and hotspots\n- Test coverage\n- Duplications\n\n## Integration\n- Runs in CI pipelines\n- Fails builds on quality gate violations'),
  ('trivy', 'Trivy', 'Container security scanning', 'ScanLine', 15, E'# Trivy\n\nTrivy is a fast, open-source vulnerability scanner for containers, IaC, and dependencies.\n\n## Scans\n- Container images (OS packages, app dependencies)\n- Filesystems\n- Git repositories\n- Kubernetes clusters\n- Terraform and CloudFormation\n\n## Example\n```bash\ntrivy image nginx:latest\n```'),
  ('kafka', 'Kafka', 'Distributed event streaming', 'Radio', 16, E'# Apache Kafka\n\nKafka is the leading distributed event streaming platform.\n\n## Concepts\n- Topics, partitions, offsets\n- Producers and consumers\n- Consumer groups\n- Brokers and Zookeeper (or KRaft mode)\n\n## Use Cases\n- Event-driven microservices\n- Log aggregation\n- Stream processing (Kafka Streams, Flink)'),
  ('vault', 'Vault', 'Secrets management', 'KeyRound', 17, E'# HashiCorp Vault\n\nVault manages secrets, encryption, and identity across dynamic infrastructure.\n\n## Features\n- Key-value secrets\n- Dynamic secrets (DB credentials on demand)\n- PKI and certificate management\n- Transit encryption\n- Auth methods (K8s, AWS, OIDC)\n\n## Why It Matters\nNever hardcode credentials. Vault gives you rotation, auditing, and least privilege.'),
  ('istio', 'Istio', 'Service mesh for Kubernetes', 'Network', 18, E'# Istio\n\nIstio is a service mesh that adds observability, security, and traffic control to Kubernetes.\n\n## Features\n- mTLS between services\n- Traffic splitting (canary, blue/green)\n- Circuit breaking, retries, timeouts\n- Distributed tracing\n\n## Trade-offs\nPowerful but complex. Consider Linkerd for a simpler alternative.');
