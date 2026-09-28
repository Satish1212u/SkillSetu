var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// backend/data/taxonomy.ts
function normalizeSkillText(rawSkill) {
  if (!rawSkill || typeof rawSkill !== "string") return null;
  const clean = rawSkill.trim().toLowerCase();
  const direct = CANONICAL_SKILLS.find(
    (s) => s.canonicalName.toLowerCase() === clean
  );
  if (direct) return direct;
  const aliasMatch = SKILL_ALIASES.find(
    (a) => a.alias.toLowerCase() === clean
  );
  if (aliasMatch) {
    return CANONICAL_SKILLS.find((s) => s.id === aliasMatch.skillId) || null;
  }
  const sanitized = clean.replace(/[^a-z0-9]/g, "");
  const fuzzyAlias = SKILL_ALIASES.find((a) => {
    const aliasSanitized = a.alias.replace(/[^a-z0-9]/g, "");
    return aliasSanitized === sanitized;
  });
  if (fuzzyAlias) {
    return CANONICAL_SKILLS.find((s) => s.id === fuzzyAlias.skillId) || null;
  }
  return null;
}
var CANONICAL_SKILLS, SKILL_ALIASES;
var init_taxonomy = __esm({
  "backend/data/taxonomy.ts"() {
    CANONICAL_SKILLS = [
      // Cloud & DevOps
      { id: "sk-aws", canonicalName: "AWS", category: "Cloud & DevOps", description: "Amazon Web Services cloud architecture and services (EC2, S3, Lambda, IAM)", marketDemandLevel: "HIGH", averageSalaryBumpPct: 24 },
      { id: "sk-docker", canonicalName: "Docker", category: "Cloud & DevOps", description: "Containerization, Dockerfile authoring, multi-stage builds and compose", marketDemandLevel: "HIGH", averageSalaryBumpPct: 20 },
      { id: "sk-k8s", canonicalName: "Kubernetes", category: "Cloud & DevOps", description: "Container orchestration, Pods, Deployments, Services, Helm charts and ingress", marketDemandLevel: "HIGH", averageSalaryBumpPct: 28 },
      { id: "sk-linux", canonicalName: "Linux", category: "Cloud & DevOps", description: "Unix/Linux system administration, shell scripting (Bash), permissions and networking", marketDemandLevel: "HIGH", averageSalaryBumpPct: 15 },
      { id: "sk-git", canonicalName: "Git", category: "Cloud & DevOps", description: "Distributed version control, branching, PR workflows, merge resolution and CI hooks", marketDemandLevel: "HIGH", averageSalaryBumpPct: 12 },
      { id: "sk-terraform", canonicalName: "Terraform", category: "Cloud & DevOps", description: "Infrastructure as Code (IaC), state management, HCL syntax and cloud provisioning", marketDemandLevel: "HIGH", averageSalaryBumpPct: 25 },
      { id: "sk-ci-cd", canonicalName: "CI/CD Pipelines", category: "Cloud & DevOps", description: "Continuous integration and deployment with GitHub Actions, GitLab CI, or Jenkins", marketDemandLevel: "HIGH", averageSalaryBumpPct: 22 },
      // AI & Data Science
      { id: "sk-python", canonicalName: "Python", category: "AI & Data Science", description: "Python programming, data structures, libraries and automation", marketDemandLevel: "HIGH", averageSalaryBumpPct: 18 },
      { id: "sk-genai", canonicalName: "Generative AI", category: "AI & Data Science", description: "LLMs, prompt engineering, RAG architectures, Gemini / OpenAI SDKs and agents", marketDemandLevel: "HIGH", averageSalaryBumpPct: 35 },
      { id: "sk-ml", canonicalName: "Machine Learning", category: "AI & Data Science", description: "Supervised/unsupervised algorithms, scikit-learn, model evaluation and metrics", marketDemandLevel: "HIGH", averageSalaryBumpPct: 26 },
      { id: "sk-nlp", canonicalName: "Natural Language Processing", category: "AI & Data Science", description: "Tokenization, embeddings, transformer models, semantic search and vector stores", marketDemandLevel: "HIGH", averageSalaryBumpPct: 27 },
      { id: "sk-pytorch", canonicalName: "PyTorch", category: "AI & Data Science", description: "Deep learning neural networks, tensor computation, autograd and model fine-tuning", marketDemandLevel: "HIGH", averageSalaryBumpPct: 29 },
      { id: "sk-sql", canonicalName: "SQL", category: "AI & Data Science", description: "Relational query design, indexing, window functions, CTEs and performance tuning", marketDemandLevel: "HIGH", averageSalaryBumpPct: 16 },
      { id: "sk-data-eng", canonicalName: "Data Engineering", category: "AI & Data Science", description: "ETL/ELT pipelines, Apache Spark, Kafka streaming and data lakehouses", marketDemandLevel: "HIGH", averageSalaryBumpPct: 27 },
      // Frontend
      { id: "sk-react", canonicalName: "React", category: "Frontend", description: "React component lifecycle, hooks, state management, SPA architecture and Next.js", marketDemandLevel: "HIGH", averageSalaryBumpPct: 20 },
      { id: "sk-typescript", canonicalName: "TypeScript", category: "Frontend", description: "Static typing, generics, interfaces, strict compiler rules and modern ES features", marketDemandLevel: "HIGH", averageSalaryBumpPct: 22 },
      { id: "sk-tailwind", canonicalName: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS framework, responsive design, dark mode and custom config", marketDemandLevel: "MEDIUM", averageSalaryBumpPct: 12 },
      { id: "sk-javascript", canonicalName: "JavaScript", category: "Frontend", description: "Modern JavaScript (ES6+), event loop, closures, async/await and DOM manipulation", marketDemandLevel: "HIGH", averageSalaryBumpPct: 15 },
      { id: "sk-html-css", canonicalName: "HTML5 & CSS3", category: "Frontend", description: "Semantic HTML markup, CSS flexbox, grid, animations and web accessibility (a11y)", marketDemandLevel: "MEDIUM", averageSalaryBumpPct: 10 },
      // Backend
      { id: "sk-nodejs", canonicalName: "Node.js", category: "Backend", description: "Server-side JavaScript runtime, event-driven I/O, Express and microservices", marketDemandLevel: "HIGH", averageSalaryBumpPct: 19 },
      { id: "sk-fastapi", canonicalName: "FastAPI", category: "Backend", description: "Asynchronous Python web framework, Pydantic data validation and OpenAPI docs", marketDemandLevel: "HIGH", averageSalaryBumpPct: 21 },
      { id: "sk-java", canonicalName: "Java", category: "Backend", description: "Object-oriented programming, Spring Boot enterprise frameworks and JVM tuning", marketDemandLevel: "HIGH", averageSalaryBumpPct: 18 },
      { id: "sk-postgresql", canonicalName: "PostgreSQL", category: "Backend", description: "Advanced relational database, ACID transactions, JSONB and pgvector indexing", marketDemandLevel: "HIGH", averageSalaryBumpPct: 20 },
      { id: "sk-rest-api", canonicalName: "RESTful API Design", category: "Backend", description: "HTTP verbs, idempotency, status codes, JWT authentication and rate limiting", marketDemandLevel: "HIGH", averageSalaryBumpPct: 15 },
      { id: "sk-redis", canonicalName: "Redis", category: "Backend", description: "In-memory key-value caching, Pub/Sub messaging and session management", marketDemandLevel: "MEDIUM", averageSalaryBumpPct: 17 },
      // Cybersecurity
      { id: "sk-cybersec", canonicalName: "Cybersecurity", category: "Cybersecurity", description: "Threat modeling, network security, zero-trust architecture and vulnerability analysis", marketDemandLevel: "HIGH", averageSalaryBumpPct: 30 },
      { id: "sk-owasp", canonicalName: "OWASP Top 10", category: "Cybersecurity", description: "Web application vulnerability remediation (SQLi, XSS, CSRF, auth bypass)", marketDemandLevel: "HIGH", averageSalaryBumpPct: 23 },
      // Soft Skills & Leadership
      { id: "sk-testing", canonicalName: "Testing", category: "Frontend", description: "Unit testing, integration testing, React Testing Library, Jest, and Cypress", marketDemandLevel: "HIGH", averageSalaryBumpPct: 18 },
      { id: "sk-problem-solving", canonicalName: "Problem Solving & DSA", category: "Soft Skills & Leadership", description: "Data structures, algorithms, asymptotic analysis and competitive programming", marketDemandLevel: "HIGH", averageSalaryBumpPct: 22 },
      { id: "sk-agile", canonicalName: "Agile & Scrum", category: "Soft Skills & Leadership", description: "Sprint planning, backlog grooming, standups, retrospectives and Jira", marketDemandLevel: "MEDIUM", averageSalaryBumpPct: 12 },
      { id: "sk-comm", canonicalName: "Technical Communication", category: "Soft Skills & Leadership", description: "Cross-functional engineering communication, design docs and stakeholder presentations", marketDemandLevel: "HIGH", averageSalaryBumpPct: 16 }
    ];
    SKILL_ALIASES = [
      // React
      { skillId: "sk-react", alias: "react" },
      { skillId: "sk-react", alias: "reactjs" },
      { skillId: "sk-react", alias: "react.js" },
      { skillId: "sk-react", alias: "react js" },
      { skillId: "sk-react", alias: "react native" },
      // AWS
      { skillId: "sk-aws", alias: "aws" },
      { skillId: "sk-aws", alias: "aws cloud" },
      { skillId: "sk-aws", alias: "amazon web services" },
      { skillId: "sk-aws", alias: "ec2" },
      { skillId: "sk-aws", alias: "s3" },
      { skillId: "sk-aws", alias: "aws lambda" },
      // Kubernetes
      { skillId: "sk-k8s", alias: "kubernetes" },
      { skillId: "sk-k8s", alias: "k8s" },
      { skillId: "sk-k8s", alias: "kube" },
      // Docker
      { skillId: "sk-docker", alias: "docker" },
      { skillId: "sk-docker", alias: "docker compose" },
      { skillId: "sk-docker", alias: "containerization" },
      // Linux
      { skillId: "sk-linux", alias: "linux" },
      { skillId: "sk-linux", alias: "bash" },
      { skillId: "sk-linux", alias: "shell scripting" },
      { skillId: "sk-linux", alias: "ubuntu" },
      { skillId: "sk-linux", alias: "unix" },
      // Git
      { skillId: "sk-git", alias: "git" },
      { skillId: "sk-git", alias: "github" },
      { skillId: "sk-git", alias: "version control" },
      { skillId: "sk-git", alias: "gitlab" },
      // Python
      { skillId: "sk-python", alias: "python" },
      { skillId: "sk-python", alias: "python3" },
      { skillId: "sk-python", alias: "py" },
      // GenAI
      { skillId: "sk-genai", alias: "generative ai" },
      { skillId: "sk-genai", alias: "genai" },
      { skillId: "sk-genai", alias: "gen ai" },
      { skillId: "sk-genai", alias: "llms" },
      { skillId: "sk-genai", alias: "llm" },
      { skillId: "sk-genai", alias: "large language models" },
      { skillId: "sk-genai", alias: "rag" },
      { skillId: "sk-genai", alias: "prompt engineering" },
      { skillId: "sk-genai", alias: "gemini" },
      // Machine Learning
      { skillId: "sk-ml", alias: "machine learning" },
      { skillId: "sk-ml", alias: "ml" },
      { skillId: "sk-ml", alias: "scikit-learn" },
      { skillId: "sk-ml", alias: "sklearn" },
      // PyTorch
      { skillId: "sk-pytorch", alias: "pytorch" },
      { skillId: "sk-pytorch", alias: "torch" },
      { skillId: "sk-pytorch", alias: "deep learning" },
      { skillId: "sk-pytorch", alias: "tensorflow" },
      // PostgreSQL
      { skillId: "sk-postgresql", alias: "postgresql" },
      { skillId: "sk-postgresql", alias: "postgres" },
      { skillId: "sk-postgresql", alias: "psql" },
      { skillId: "sk-postgresql", alias: "pg" },
      // TypeScript
      { skillId: "sk-typescript", alias: "typescript" },
      { skillId: "sk-typescript", alias: "ts" },
      // JavaScript
      { skillId: "sk-javascript", alias: "javascript" },
      { skillId: "sk-javascript", alias: "js" },
      { skillId: "sk-javascript", alias: "es6" },
      // Node.js
      { skillId: "sk-nodejs", alias: "nodejs" },
      { skillId: "sk-nodejs", alias: "node.js" },
      { skillId: "sk-nodejs", alias: "node" },
      { skillId: "sk-nodejs", alias: "express" },
      { skillId: "sk-nodejs", alias: "express.js" },
      // FastAPI
      { skillId: "sk-fastapi", alias: "fastapi" },
      { skillId: "sk-fastapi", alias: "fast api" },
      // Terraform
      { skillId: "sk-terraform", alias: "terraform" },
      { skillId: "sk-terraform", alias: "iac" },
      { skillId: "sk-terraform", alias: "infrastructure as code" },
      // CI/CD
      { skillId: "sk-ci-cd", alias: "ci/cd" },
      { skillId: "sk-ci-cd", alias: "cicd" },
      { skillId: "sk-ci-cd", alias: "continuous integration" },
      { skillId: "sk-ci-cd", alias: "github actions" },
      { skillId: "sk-ci-cd", alias: "jenkins" },
      // Tailwind
      { skillId: "sk-tailwind", alias: "tailwind" },
      { skillId: "sk-tailwind", alias: "tailwindcss" },
      { skillId: "sk-tailwind", alias: "tailwind css" },
      // SQL
      { skillId: "sk-sql", alias: "sql" },
      { skillId: "sk-sql", alias: "mysql" },
      { skillId: "sk-sql", alias: "rdbms" },
      // Data Engineering
      { skillId: "sk-data-eng", alias: "data engineering" },
      { skillId: "sk-data-eng", alias: "spark" },
      { skillId: "sk-data-eng", alias: "apache spark" },
      { skillId: "sk-data-eng", alias: "kafka" },
      { skillId: "sk-data-eng", alias: "etl" },
      // Cybersecurity
      { skillId: "sk-cybersec", alias: "cybersecurity" },
      { skillId: "sk-cybersec", alias: "cyber security" },
      { skillId: "sk-cybersec", alias: "infosec" },
      { skillId: "sk-cybersec", alias: "ethical hacking" },
      // HTML & CSS
      { skillId: "sk-html-css", alias: "html" },
      { skillId: "sk-html-css", alias: "html5" },
      { skillId: "sk-html-css", alias: "css" },
      { skillId: "sk-html-css", alias: "css3" },
      { skillId: "sk-html-css", alias: "html/css" },
      { skillId: "sk-html-css", alias: "html and css" },
      // Testing
      { skillId: "sk-testing", alias: "testing" },
      { skillId: "sk-testing", alias: "unit testing" },
      { skillId: "sk-testing", alias: "software testing" },
      { skillId: "sk-testing", alias: "react testing library" },
      { skillId: "sk-testing", alias: "jest" },
      { skillId: "sk-testing", alias: "cypress" },
      { skillId: "sk-testing", alias: "qa" },
      // CI/CD additional aliases
      { skillId: "sk-ci-cd", alias: "ci/cd fundamentals" },
      { skillId: "sk-ci-cd", alias: "continuous deployment" }
    ];
  }
});

// backend/data/seedData.ts
var SEED_USERS, SEED_STUDENT_PROFILE, SEED_JOBS, SEED_COURSES, SEED_CURRICULA, SEED_STATE_DEMANDS, SEED_ASSESSMENTS, SEED_EMPLOYER_SURVEYS, SEED_RECOMMENDATIONS;
var init_seedData = __esm({
  "backend/data/seedData.ts"() {
    SEED_USERS = [
      {
        id: "usr-student-1",
        email: "arjun.sharma@sih.gov.in",
        passwordHash: "argon_dummy_hash_student",
        role: "STUDENT",
        name: "Arjun Sharma",
        organizationName: "PICT Pune (Computer Engg 2026)",
        createdAt: "2026-01-15T09:00:00Z"
      },
      {
        id: "usr-institute-1",
        email: "dean.academic@pict.ac.in",
        passwordHash: "argon_dummy_hash_institute",
        role: "INSTITUTE",
        name: "Prof. Ramesh Kulkarni",
        organizationName: "Pune Institute of Computer Technology (PICT)",
        createdAt: "2025-11-01T10:30:00Z"
      },
      {
        id: "usr-employer-1",
        email: "talent@razorpay.com",
        passwordHash: "argon_dummy_hash_employer",
        role: "EMPLOYER",
        name: "Priya Sundaram",
        organizationName: "Razorpay Software Pvt Ltd",
        createdAt: "2025-12-10T14:20:00Z"
      },
      {
        id: "usr-admin-1",
        email: "director.skill@msde.gov.in",
        passwordHash: "argon_dummy_hash_admin",
        role: "ADMIN",
        name: "Dr. Sunita Deshmukh",
        organizationName: "Ministry of Skill Development & Entrepreneurship (MSDE)",
        createdAt: "2025-08-01T08:00:00Z"
      }
    ];
    SEED_STUDENT_PROFILE = {
      id: "stu-profile-1",
      userId: "usr-student-1",
      targetRole: "DevOps / Cloud Engineer",
      preferredLocation: "Bengaluru, Karnataka / Pune, Maharashtra",
      experienceLevel: "Fresher (0-1 yrs)",
      education: "B.Tech in Computer Engineering (2022-2026), GPA 8.7/10",
      bio: "Final year undergraduate passionate about cloud infrastructure, Linux systems administration, and automated CI/CD release engineering.",
      profileCompletionPct: 85,
      skills: [
        { skillId: "sk-linux", proficiency: "INTERMEDIATE", verified: true, source: "RESUME" },
        { skillId: "sk-git", proficiency: "ADVANCED", verified: true, source: "ASSESSMENT" },
        { skillId: "sk-python", proficiency: "INTERMEDIATE", verified: true, source: "RESUME" },
        { skillId: "sk-sql", proficiency: "INTERMEDIATE", verified: false, source: "SELF" },
        { skillId: "sk-problem-solving", proficiency: "INTERMEDIATE", verified: true, source: "ASSESSMENT" }
        // Note: Missing AWS, Docker, Kubernetes, Terraform for Target DevOps Role!
      ],
      resumeFileName: "Arjun_Sharma_DevOps_Resume_2026.pdf",
      possibleRoles: ["DevOps / Cloud Engineer", "Site Reliability Engineer (SRE)", "Linux Systems Administrator"],
      resumeData: {
        candidate: {
          name: "Arjun Sharma",
          email: "arjun.sharma@sih.gov.in",
          phone: "+91 98230 45678",
          location: "Pune, Maharashtra"
        },
        summary: "Final year undergraduate passionate about cloud infrastructure, Linux systems administration, and automated CI/CD release engineering.",
        education: [
          {
            degree: "B.Tech in Computer Engineering",
            institution: "PICT Pune",
            year: "2022-2026"
          }
        ],
        skills: [
          { name: "Linux", category: "technical", evidence: "Ubuntu/Debian, shell scripting" },
          { name: "Git", category: "tool", evidence: "GitHub workflows, branching" },
          { name: "Python", category: "technical", evidence: "Automation scripting & backend shortener" },
          { name: "SQL", category: "technical", evidence: "PostgreSQL schema indexing" },
          { name: "Problem Solving & DSA", category: "soft", evidence: "Core data structures and algorithms" }
        ],
        experience: [
          {
            company: "CloudOps Innovation Labs",
            role: "DevOps Intern",
            duration: "June 2025 - August 2025",
            responsibilities: [
              "Configured automated deployment pipelines for staging microservices.",
              "Assisted senior engineers in monitoring production Linux nodes with Prometheus alerts."
            ]
          }
        ],
        projects: [
          {
            name: "Automated Server Health Monitor",
            description: "Built a background daemon monitoring memory, disk I/O and CPU thresholds; alerts via Slack Webhooks.",
            technologies: ["Python", "Bash", "Linux", "Slack API"]
          },
          {
            name: "High-Throughput URL Shortener",
            description: "Designed indexed database schemas and microsecond caching layer with Redis.",
            technologies: ["Python", "PostgreSQL", "Redis", "Docker"]
          }
        ],
        certifications: [
          "Linux Foundation Certified System Administrator (LFCS) Prep",
          "Coursera Python for Everybody Specialization"
        ],
        possibleRoles: [
          "DevOps / Cloud Engineer",
          "Site Reliability Engineer (SRE)",
          "Linux Systems Administrator"
        ]
      },
      resumeText: `Arjun Sharma
Email: arjun.sharma@sih.gov.in | Phone: +91 98230 45678 | GitHub: github.com/arjun-devops
PICT Pune - B.Tech Computer Engineering (2022-2026) | CGPA: 8.7

TECHNICAL SKILLS:
- Languages: Python, Bash Shell Scripting, C++, SQL
- Systems & Tools: Linux (Ubuntu/Debian), Git, GitHub, Vim, Nginx
- Core: Data Structures, Computer Networks, Operating Systems

PROJECTS:
1. Automated Server Health Monitor (Python & Bash)
Built a daemon monitoring memory, disk I/O and CPU thresholds; alerts via Slack Webhooks.
2. High-Throughput URL Shortener (Python, PostgreSQL, Redis)
Designed indexed database schemas and microsecond caching layer.`,
      savedRoadmapProgress: {
        "mod-docker-basics": true,
        "mod-docker-compose": false,
        "mod-aws-core": false,
        "mod-k8s-pods": false
      }
    };
    SEED_JOBS = [
      {
        id: "job-1",
        employerId: "usr-employer-1",
        employerName: "Razorpay",
        title: "Associate DevOps Engineer (Platform Team)",
        roleCategory: "DevOps / Cloud Engineer",
        locationCity: "Bengaluru",
        locationState: "Karnataka",
        experienceMinYears: 0,
        salaryMinLPA: 12,
        salaryMaxLPA: 18,
        description: "Join our cloud infrastructure team managing high-scale payment gateways processing millions of transactions. You will build resilient Docker images, maintain AWS EKS clusters, and automate Terraform modules.",
        postedAt: "2026-03-01T10:00:00Z",
        dataSource: "REAL VERIFIED",
        skills: [
          { skillId: "sk-linux", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-git", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-docker", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-aws", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-k8s", isRequired: false, minProficiency: "BEGINNER" },
          { skillId: "sk-terraform", isRequired: false, minProficiency: "BEGINNER" }
        ]
      },
      {
        id: "job-2",
        employerId: "emp-persistent",
        employerName: "Persistent Systems",
        title: "Cloud Systems Engineer (AWS/GCP)",
        roleCategory: "DevOps / Cloud Engineer",
        locationCity: "Pune",
        locationState: "Maharashtra",
        experienceMinYears: 1,
        salaryMinLPA: 8.5,
        salaryMaxLPA: 14,
        description: "Responsible for client cloud migrations, multi-tenant container orchestration, and continuous integration pipelines.",
        postedAt: "2026-03-12T11:30:00Z",
        dataSource: "SAMPLE BENCHMARK",
        skills: [
          { skillId: "sk-aws", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-docker", isRequired: true, minProficiency: "BEGINNER" },
          { skillId: "sk-linux", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-ci-cd", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-python", isRequired: false, minProficiency: "INTERMEDIATE" }
        ]
      },
      {
        id: "job-3",
        employerId: "emp-swiggy",
        employerName: "Swiggy Tech",
        title: "Backend Platform Engineer (Python / Go)",
        roleCategory: "Backend Developer",
        locationCity: "Hyderabad",
        locationState: "Telangana",
        experienceMinYears: 1,
        salaryMinLPA: 14,
        salaryMaxLPA: 22,
        description: "Scale our order dispatch microservices handling 100k requests/sec. Experience with asynchronous Python, PostgreSQL clustering, and distributed caching.",
        postedAt: "2026-03-18T16:00:00Z",
        dataSource: "SAMPLE BENCHMARK",
        skills: [
          { skillId: "sk-python", isRequired: true, minProficiency: "ADVANCED" },
          { skillId: "sk-postgresql", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-redis", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-rest-api", isRequired: true, minProficiency: "ADVANCED" },
          { skillId: "sk-docker", isRequired: false, minProficiency: "BEGINNER" }
        ]
      },
      {
        id: "job-4",
        employerId: "emp-tata",
        employerName: "Tata Elxsi",
        title: "GenAI & Applied ML Specialist",
        roleCategory: "AI / ML Engineer",
        locationCity: "Bengaluru",
        locationState: "Karnataka",
        experienceMinYears: 0,
        salaryMinLPA: 11,
        salaryMaxLPA: 19,
        description: "Build enterprise retrieval-augmented generation (RAG) agents, LLM tool-calling pipelines, and vector database indices.",
        postedAt: "2026-03-20T08:45:00Z",
        dataSource: "SAMPLE BENCHMARK",
        skills: [
          { skillId: "sk-python", isRequired: true, minProficiency: "ADVANCED" },
          { skillId: "sk-genai", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-nlp", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-pytorch", isRequired: false, minProficiency: "BEGINNER" },
          { skillId: "sk-sql", isRequired: true, minProficiency: "INTERMEDIATE" }
        ]
      },
      {
        id: "job-5",
        employerId: "emp-cred",
        employerName: "CRED",
        title: "Frontend Product Engineer (React/TS)",
        roleCategory: "Frontend Developer",
        locationCity: "Bengaluru",
        locationState: "Karnataka",
        experienceMinYears: 1,
        salaryMinLPA: 16,
        salaryMaxLPA: 26,
        description: "Craft high-polish, 60fps web user interfaces for consumer fintech products with rigorous accessibility and fluid interaction.",
        postedAt: "2026-03-22T14:10:00Z",
        dataSource: "REAL VERIFIED",
        skills: [
          { skillId: "sk-react", isRequired: true, minProficiency: "ADVANCED" },
          { skillId: "sk-typescript", isRequired: true, minProficiency: "ADVANCED" },
          { skillId: "sk-tailwind", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-rest-api", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-git", isRequired: true, minProficiency: "INTERMEDIATE" }
        ]
      },
      {
        id: "job-6",
        employerId: "emp-infosys",
        employerName: "Infosys Cloud Operations",
        title: "Cloud Support Engineer (Linux & Cloud Infrastructure)",
        roleCategory: "DevOps / Cloud Engineer",
        locationCity: "Pune",
        locationState: "Maharashtra",
        experienceMinYears: 0,
        salaryMinLPA: 6.5,
        salaryMaxLPA: 10,
        description: "Provide level-2 cloud infrastructure support, monitor Linux server metrics, write bash/Python automation scripts, and troubleshoot customer deployment issues.",
        postedAt: "2026-03-24T09:15:00Z",
        dataSource: "SAMPLE BENCHMARK",
        skills: [
          { skillId: "sk-linux", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-git", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-sql", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-aws", isRequired: true, minProficiency: "BEGINNER" },
          { skillId: "sk-docker", isRequired: false, minProficiency: "BEGINNER" },
          { skillId: "sk-comm", isRequired: false, minProficiency: "INTERMEDIATE" }
        ]
      },
      {
        id: "job-7",
        employerId: "emp-wipro",
        employerName: "Wipro Digital Platforms",
        title: "Junior Cloud Engineer",
        roleCategory: "DevOps / Cloud Engineer",
        locationCity: "Bengaluru",
        locationState: "Karnataka",
        experienceMinYears: 0,
        salaryMinLPA: 7.2,
        salaryMaxLPA: 11.5,
        description: "Assist in configuring AWS workloads, containerizing legacy apps, managing source repositories and validating staging environments.",
        postedAt: "2026-03-25T11:45:00Z",
        dataSource: "SAMPLE BENCHMARK",
        skills: [
          { skillId: "sk-linux", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-python", isRequired: true, minProficiency: "INTERMEDIATE" },
          { skillId: "sk-docker", isRequired: true, minProficiency: "BEGINNER" },
          { skillId: "sk-aws", isRequired: true, minProficiency: "BEGINNER" },
          { skillId: "sk-ci-cd", isRequired: false, minProficiency: "BEGINNER" }
        ]
      }
    ];
    SEED_COURSES = [
      {
        id: "crs-pict-cs",
        instituteId: "usr-institute-1",
        title: "B.Tech in Computer Engineering (Autonomous 2024 Scheme)",
        department: "Computer Engineering",
        degreeLevel: "Undergraduate",
        durationSemesters: 8,
        enrolledStudents: 320,
        targetIndustryRoles: ["Software Engineer", "DevOps / Cloud Engineer", "Data Analyst"]
      },
      {
        id: "crs-pict-it",
        instituteId: "usr-institute-1",
        title: "B.Tech in Information Technology",
        department: "Information Technology",
        degreeLevel: "Undergraduate",
        durationSemesters: 8,
        enrolledStudents: 180,
        targetIndustryRoles: ["Full-Stack Developer", "Cybersecurity Analyst"]
      }
    ];
    SEED_CURRICULA = [
      {
        id: "cur-pict-cs-2026",
        courseId: "crs-pict-cs",
        academicYear: "2025-2026",
        syllabusRaw: `PUNE INSTITUTE OF COMPUTER TECHNOLOGY
DEPARTMENT OF COMPUTER ENGINEERING
COURSE OUTLINE: B.TECH COMPUTER ENGINEERING (SEMESTER 5-8)

Module 1: Operating Systems & Shell Programming
- Processes, threads, CPU scheduling, IPC, memory management
- Linux kernel architecture, Bash commands, pipes, permissions

Module 2: Object-Oriented Programming & Data Structures
- C++, Python OOP, trees, graphs, sorting, searching algorithms

Module 3: Database Management Systems
- Relational algebra, SQL DDL/DML, normalization (1NF-BCNF), ACID properties

Module 4: Computer Networks
- TCP/IP model, routing protocols, HTTP/HTTPS, socket programming

Module 5: Elective - Cloud & Virtualization (Theoretical)
- Hypervisors, private clouds, introductory OpenStack concepts`,
        skills: [
          { skillId: "sk-linux", coverageDepth: "PRACTICAL", semesterTaught: 5, hoursDedicated: 48 },
          { skillId: "sk-python", coverageDepth: "PRACTICAL", semesterTaught: 4, hoursDedicated: 40 },
          { skillId: "sk-sql", coverageDepth: "PRACTICAL", semesterTaught: 5, hoursDedicated: 45 },
          { skillId: "sk-problem-solving", coverageDepth: "PRACTICAL", semesterTaught: 3, hoursDedicated: 60 },
          { skillId: "sk-git", coverageDepth: "CONCEPTUAL", semesterTaught: 5, hoursDedicated: 12 }
          // NOTE: Docker, Kubernetes, AWS, Terraform, CI/CD are completely absent from core university curriculum!
        ],
        alignmentScore: 48.2,
        // Explainable: 5 out of 11 industry required skills covered
        lastAudited: "2026-02-10T12:00:00Z"
      }
    ];
    SEED_STATE_DEMANDS = [
      // Karnataka (Bengaluru)
      { state: "Karnataka", skillId: "sk-aws", openingsCount: 14200, growthRatePct: 34, demandIndex: 96, supplyIndex: 42, gapRatio: 2.28, dataSource: "REAL VERIFIED" },
      { state: "Karnataka", skillId: "sk-docker", openingsCount: 12800, growthRatePct: 38, demandIndex: 94, supplyIndex: 38, gapRatio: 2.47, dataSource: "REAL VERIFIED" },
      { state: "Karnataka", skillId: "sk-k8s", openingsCount: 9600, growthRatePct: 45, demandIndex: 91, supplyIndex: 26, gapRatio: 3.5, dataSource: "REAL VERIFIED" },
      { state: "Karnataka", skillId: "sk-genai", openingsCount: 11400, growthRatePct: 82, demandIndex: 98, supplyIndex: 22, gapRatio: 4.45, dataSource: "REAL VERIFIED" },
      { state: "Karnataka", skillId: "sk-react", openingsCount: 16500, growthRatePct: 18, demandIndex: 92, supplyIndex: 88, gapRatio: 1.05, dataSource: "REAL VERIFIED" },
      // Maharashtra (Pune & Mumbai)
      { state: "Maharashtra", skillId: "sk-aws", openingsCount: 10400, growthRatePct: 31, demandIndex: 88, supplyIndex: 40, gapRatio: 2.2, dataSource: "REAL VERIFIED" },
      { state: "Maharashtra", skillId: "sk-docker", openingsCount: 8900, growthRatePct: 35, demandIndex: 85, supplyIndex: 35, gapRatio: 2.42, dataSource: "REAL VERIFIED" },
      { state: "Maharashtra", skillId: "sk-k8s", openingsCount: 6700, growthRatePct: 41, demandIndex: 81, supplyIndex: 24, gapRatio: 3.37, dataSource: "REAL VERIFIED" },
      { state: "Maharashtra", skillId: "sk-genai", openingsCount: 7800, growthRatePct: 75, demandIndex: 89, supplyIndex: 19, gapRatio: 4.68, dataSource: "SAMPLE BENCHMARK" },
      { state: "Maharashtra", skillId: "sk-python", openingsCount: 13200, growthRatePct: 24, demandIndex: 89, supplyIndex: 78, gapRatio: 1.14, dataSource: "SAMPLE BENCHMARK" },
      // Telangana (Hyderabad)
      { state: "Telangana", skillId: "sk-aws", openingsCount: 9200, growthRatePct: 33, demandIndex: 86, supplyIndex: 39, gapRatio: 2.2, dataSource: "REAL VERIFIED" },
      { state: "Telangana", skillId: "sk-docker", openingsCount: 7800, growthRatePct: 36, demandIndex: 82, supplyIndex: 34, gapRatio: 2.41, dataSource: "REAL VERIFIED" },
      { state: "Telangana", skillId: "sk-genai", openingsCount: 7100, growthRatePct: 79, demandIndex: 87, supplyIndex: 20, gapRatio: 4.35, dataSource: "SAMPLE BENCHMARK" },
      { state: "Telangana", skillId: "sk-sql", openingsCount: 11200, growthRatePct: 15, demandIndex: 84, supplyIndex: 82, gapRatio: 1.02, dataSource: "SAMPLE BENCHMARK" },
      // Tamil Nadu (Chennai & Coimbatore)
      { state: "Tamil Nadu", skillId: "sk-aws", openingsCount: 7600, growthRatePct: 28, demandIndex: 80, supplyIndex: 36, gapRatio: 2.22, dataSource: "SAMPLE BENCHMARK" },
      { state: "Tamil Nadu", skillId: "sk-docker", openingsCount: 6500, growthRatePct: 32, demandIndex: 77, supplyIndex: 31, gapRatio: 2.48, dataSource: "SAMPLE BENCHMARK" },
      { state: "Tamil Nadu", skillId: "sk-java", openingsCount: 12400, growthRatePct: 14, demandIndex: 88, supplyIndex: 94, gapRatio: 0.93, dataSource: "SAMPLE BENCHMARK" },
      // Slight oversupply of legacy Java
      // Delhi NCR (Delhi, Noida, Gurugram)
      { state: "Delhi NCR", skillId: "sk-aws", openingsCount: 9800, growthRatePct: 32, demandIndex: 87, supplyIndex: 44, gapRatio: 1.98, dataSource: "REAL VERIFIED" },
      { state: "Delhi NCR", skillId: "sk-genai", openingsCount: 8400, growthRatePct: 80, demandIndex: 90, supplyIndex: 25, gapRatio: 3.6, dataSource: "SAMPLE BENCHMARK" },
      { state: "Delhi NCR", skillId: "sk-react", openingsCount: 13900, growthRatePct: 19, demandIndex: 89, supplyIndex: 86, gapRatio: 1.03, dataSource: "SAMPLE BENCHMARK" },
      // Gujarat (Ahmedabad, Gandhinagar)
      { state: "Gujarat", skillId: "sk-docker", openingsCount: 3800, growthRatePct: 29, demandIndex: 65, supplyIndex: 22, gapRatio: 2.95, dataSource: "SAMPLE BENCHMARK" },
      { state: "Gujarat", skillId: "sk-cybersec", openingsCount: 3400, growthRatePct: 42, demandIndex: 68, supplyIndex: 18, gapRatio: 3.77, dataSource: "SAMPLE BENCHMARK" },
      // West Bengal (Kolkata)
      { state: "West Bengal", skillId: "sk-aws", openingsCount: 4200, growthRatePct: 26, demandIndex: 68, supplyIndex: 28, gapRatio: 2.42, dataSource: "SAMPLE BENCHMARK" },
      { state: "West Bengal", skillId: "sk-python", openingsCount: 6900, growthRatePct: 21, demandIndex: 74, supplyIndex: 72, gapRatio: 1.03, dataSource: "SAMPLE BENCHMARK" },
      // Kerala (Kochi, Thiruvananthapuram)
      { state: "Kerala", skillId: "sk-react", openingsCount: 4800, growthRatePct: 22, demandIndex: 72, supplyIndex: 68, gapRatio: 1.06, dataSource: "SAMPLE BENCHMARK" },
      { state: "Kerala", skillId: "sk-cybersec", openingsCount: 2900, growthRatePct: 38, demandIndex: 64, supplyIndex: 19, gapRatio: 3.36, dataSource: "SAMPLE BENCHMARK" }
    ];
    SEED_ASSESSMENTS = [
      {
        id: "asmt-docker",
        skillId: "sk-docker",
        skillName: "Docker",
        title: "Docker Containerization & Multi-Stage Builds",
        durationMinutes: 10,
        questions: [
          {
            id: "q1",
            question: "Which Dockerfile instruction creates an intermediate layer used for executing build commands?",
            options: ["RUN", "CMD", "ENTRYPOINT", "COPY"],
            correctOptionIndex: 0,
            explanation: "RUN executes commands during the build phase and commits the results to a new image layer."
          },
          {
            id: "q2",
            question: "What is the primary architectural advantage of a multi-stage Docker build?",
            options: [
              "Decreases CPU usage during runtime",
              "Minimizes final production image size by discarding build tools and intermediate artifacts",
              "Enables automatic Kubernetes horizontal autoscaling",
              "Encrypts secrets directly in image layer digests"
            ],
            correctOptionIndex: 1,
            explanation: "Multi-stage builds allow compiling in a fat builder container and copying only compiled artifacts into a lightweight scratch/alpine runtime image."
          },
          {
            id: "q3",
            question: "In Docker Compose, what mechanism ensures service B waits for service A to pass health checks before starting?",
            options: ["links", "depends_on with condition: service_healthy", "restart: always", "expose: ports"],
            correctOptionIndex: 1,
            explanation: "depends_on with condition: service_healthy prevents race conditions during database initialization."
          }
        ]
      },
      {
        id: "asmt-aws",
        skillId: "sk-aws",
        skillName: "AWS",
        title: "AWS Cloud Fundamentals & IAM Security",
        durationMinutes: 10,
        questions: [
          {
            id: "q1",
            question: "Which AWS service is best suited for managing temporary security credentials for EC2 applications without hardcoding API keys?",
            options: ["AWS IAM Roles with Instance Profiles", "Root User Access Keys", "AWS Secrets Manager in plaintext", "AWS Cognito User Pools"],
            correctOptionIndex: 0,
            explanation: "IAM Roles attached via Instance Profiles supply short-lived STS credentials automatically rotated by the instance metadata service."
          },
          {
            id: "q2",
            question: "Which AWS VPC component routes outbound traffic from private subnets to the public internet while blocking incoming connections?",
            options: ["Internet Gateway (IGW)", "NAT Gateway", "Transit Gateway", "VPC Peering Connection"],
            correctOptionIndex: 1,
            explanation: "A NAT Gateway enables outbound internet access for private subnets while preventing unsolicited inbound traffic."
          }
        ]
      },
      {
        id: "asmt-git",
        skillId: "sk-git",
        skillName: "Git",
        title: "Git Version Control & Branching Workflows",
        durationMinutes: 8,
        questions: [
          {
            id: "q1",
            question: "What is the difference between git fetch and git pull?",
            options: [
              "git pull only downloads tags, git fetch downloads commits",
              "git fetch downloads remote metadata without modifying your working branch; git pull fetches and merges",
              "git fetch pushes local commits; git pull downloads remote commits",
              "They are identical aliases"
            ],
            correctOptionIndex: 1,
            explanation: "git fetch updates remote tracking branches without altering the working tree; git pull runs fetch followed by merge."
          }
        ]
      }
    ];
    SEED_EMPLOYER_SURVEYS = [
      {
        id: "es-1",
        employerId: "usr-employer-1",
        employerName: "Razorpay",
        industry: "Fintech / Payments",
        hardToHireSkills: ["Kubernetes", "Terraform", "Observability (Prometheus/Grafana)", "Go"],
        emergingSkills: ["Generative AI Agents", "eBPF Kernel Monitoring", "Multi-Cloud FinOps"],
        fresherGaps: ["Engineering graduates understand theoretical OS concepts but cannot write a multi-stage Dockerfile or configure a reverse proxy."],
        recommendedCertifications: ["AWS Solutions Architect Associate (SAA-C03)", "Certified Kubernetes Administrator (CKA)"],
        additionalRemarks: "We strongly urge institutes to make lab projects deployable on live cloud accounts rather than local XAMPP servers.",
        submittedAt: "2026-03-15T11:20:00Z"
      },
      {
        id: "es-2",
        employerId: "emp-tata",
        employerName: "Tata Elxsi",
        industry: "Automotive & Enterprise Software",
        hardToHireSkills: ["PyTorch", "Vector Databases", "Embedded Linux"],
        emergingSkills: ["Local LLM Inference Optimization", "Model Quantization (GGML/GGUF)"],
        fresherGaps: ["Students rely heavily on generic high-level tutorials without understanding memory profiling or vector arithmetic."],
        recommendedCertifications: ["NVIDIA Deep Learning Institute Certificate", "TensorFlow Developer"],
        additionalRemarks: "Industry-academia co-curricula design is vital for 2026.",
        submittedAt: "2026-03-21T09:45:00Z"
      }
    ];
    SEED_RECOMMENDATIONS = [
      {
        id: "rec-govt-1",
        targetRoleType: "GOVT",
        title: "Urgent Cloud & DevOps Capacity Expansion in Maharashtra & Karnataka",
        actionSummary: "State technical universities currently produce only 35% of the annual industry demand for containerization (Docker/K8s) and AWS engineers. Mandate cloud credits and container labs in AICTE Model Curriculum 2026.",
        evidenceData: {
          gapRatio: 2.47,
          totalUnmetOpenings: 32600,
          annualGraduatesLackingSkill: 84e3,
          impactedStates: ["Maharashtra", "Karnataka", "Telangana"]
        },
        priority: "CRITICAL",
        confidenceScore: 0.94,
        dataSourceLabel: "OBSERVED MARKET DATA"
      },
      {
        id: "rec-inst-1",
        targetRoleType: "INSTITUTE",
        title: "Incorporate Docker & AWS Lab Practicals in 6th Semester Curriculum",
        actionSummary: "Your current Computer Engineering curriculum alignment score is 48.2%. Adding containerization hands-on modules in Operating Systems Lab will elevate institutional placement readiness by 36%.",
        evidenceData: {
          currentAlignment: 48.2,
          potentialAlignment: 84.5,
          missingDemandedSkills: ["Docker", "AWS", "Kubernetes", "CI/CD Pipelines"]
        },
        priority: "HIGH",
        confidenceScore: 0.91,
        dataSourceLabel: "OBSERVED MARKET DATA"
      },
      {
        id: "rec-stu-1",
        targetRoleType: "STUDENT",
        title: "Targeted Gap Closure: Docker & AWS Foundations for Razorpay Placement",
        actionSummary: "You have a 50% deterministic match for the Razorpay Associate DevOps Engineer role. Completing containerization projects and the AWS fundamental assessment will boost your candidate percentile to Top 8%.",
        evidenceData: {
          currentMatchScore: 50,
          matchedSkills: ["Linux", "Git"],
          missingRequiredSkills: ["Docker", "AWS"],
          averageSalaryAdvantage: "+ \u20B94.5 LPA"
        },
        priority: "CRITICAL",
        confidenceScore: 0.96,
        dataSourceLabel: "OBSERVED MARKET DATA"
      }
    ];
  }
});

// backend/database/store.ts
var store_exports = {};
__export(store_exports, {
  db: () => db
});
var DatabaseStore, db;
var init_store = __esm({
  "backend/database/store.ts"() {
    init_taxonomy();
    init_seedData();
    DatabaseStore = class {
      constructor() {
        this.users = /* @__PURE__ */ new Map();
        this.studentProfiles = /* @__PURE__ */ new Map();
        this.skills = /* @__PURE__ */ new Map();
        this.jobs = /* @__PURE__ */ new Map();
        this.courses = /* @__PURE__ */ new Map();
        this.curricula = /* @__PURE__ */ new Map();
        this.stateDemands = [];
        this.assessments = /* @__PURE__ */ new Map();
        this.assessmentResults = [];
        this.employerSurveys = [];
        this.recommendations = [];
        this.resetToSeed();
      }
      resetToSeed() {
        this.users.clear();
        this.studentProfiles.clear();
        this.skills.clear();
        this.jobs.clear();
        this.courses.clear();
        this.curricula.clear();
        this.assessments.clear();
        this.assessmentResults = [];
        this.employerSurveys = [];
        this.recommendations = [];
        for (const skill of CANONICAL_SKILLS) {
          this.skills.set(skill.id, skill);
        }
        for (const user of SEED_USERS) {
          this.users.set(user.id, { ...user });
        }
        this.studentProfiles.set(SEED_STUDENT_PROFILE.userId, JSON.parse(JSON.stringify(SEED_STUDENT_PROFILE)));
        for (const job of SEED_JOBS) {
          this.jobs.set(job.id, JSON.parse(JSON.stringify(job)));
        }
        for (const course of SEED_COURSES) {
          this.courses.set(course.id, JSON.parse(JSON.stringify(course)));
        }
        for (const curriculum of SEED_CURRICULA) {
          this.curricula.set(curriculum.id, JSON.parse(JSON.stringify(curriculum)));
        }
        this.stateDemands = JSON.parse(JSON.stringify(SEED_STATE_DEMANDS));
        for (const asmt of SEED_ASSESSMENTS) {
          this.assessments.set(asmt.id, JSON.parse(JSON.stringify(asmt)));
        }
        this.employerSurveys = JSON.parse(JSON.stringify(SEED_EMPLOYER_SURVEYS));
        this.recommendations = JSON.parse(JSON.stringify(SEED_RECOMMENDATIONS));
      }
      // User queries
      getUserByEmail(email) {
        for (const u of this.users.values()) {
          if (u.email.toLowerCase() === email.toLowerCase()) return u;
        }
        return void 0;
      }
      getUserById(id) {
        return this.users.get(id);
      }
      createUser(user) {
        this.users.set(user.id, user);
        return user;
      }
      // Student queries
      getStudentProfileByUserId(userId) {
        return this.studentProfiles.get(userId);
      }
      saveStudentProfile(profile) {
        this.studentProfiles.set(profile.userId, profile);
        return profile;
      }
      // Job queries
      getAllJobs() {
        return Array.from(this.jobs.values()).sort(
          (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
      }
      getJobById(id) {
        return this.jobs.get(id);
      }
      createJob(job) {
        this.jobs.set(job.id, job);
        return job;
      }
      // Skills queries
      getAllSkills() {
        return Array.from(this.skills.values());
      }
      getSkillById(id) {
        return this.skills.get(id);
      }
      // Course & Curricula queries
      getAllCourses() {
        return Array.from(this.courses.values());
      }
      getCurriculaForCourse(courseId) {
        for (const cur of this.curricula.values()) {
          if (cur.courseId === courseId) return cur;
        }
        return void 0;
      }
      saveCurriculum(curriculum) {
        this.curricula.set(curriculum.id, curriculum);
        return curriculum;
      }
      // Assessments
      getAllAssessments() {
        return Array.from(this.assessments.values());
      }
      getAssessmentById(id) {
        return this.assessments.get(id);
      }
      addAssessmentResult(result) {
        this.assessmentResults.push(result);
      }
      getAssessmentResultsForStudent(studentId) {
        return this.assessmentResults.filter((r) => r.studentId === studentId);
      }
      // Surveys
      getAllSurveys() {
        return this.employerSurveys;
      }
      addSurvey(survey) {
        this.employerSurveys.unshift(survey);
      }
      // Recommendations
      getRecommendations(targetRoleType) {
        if (!targetRoleType) return this.recommendations;
        return this.recommendations.filter((r) => r.targetRoleType === targetRoleType);
      }
      addRecommendation(rec) {
        this.recommendations.unshift(rec);
      }
    };
    db = new DatabaseStore();
  }
});

// backend/serverless.ts
import dotenv2 from "dotenv";

// backend/app.ts
import express from "express";
import dotenv from "dotenv";

// backend/api/auth.ts
init_store();
import { Router } from "express";
import jwt from "jsonwebtoken";
var authRouter = Router();
var JWT_SECRET = process.env.JWT_SECRET || "kaushal-setu-sih-2026-super-secret-key";
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      organizationName: user.organizationName
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
authRouter.post("/register", (req, res) => {
  try {
    const { email, password, role, name, organizationName } = req.body;
    if (!email || !password || !role || !name) {
      res.status(400).json({ error: "Missing required registration fields." });
      return;
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: "User with this email already exists." });
      return;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      passwordHash: "dummy_hash",
      // For prototype
      role,
      name: name.trim(),
      organizationName: organizationName?.trim() || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.createUser(newUser);
    if (newUser.role === "STUDENT") {
      db.saveStudentProfile({
        id: `stu-${Date.now()}`,
        userId: newUser.id,
        targetRole: "DevOps / Cloud Engineer",
        preferredLocation: "Bengaluru, Karnataka",
        experienceLevel: "Fresher (0-1 yrs)",
        education: "B.Tech / MCA in Computer Science",
        bio: "Aspiring engineering professional looking to align skills with industry demands.",
        profileCompletionPct: 50,
        skills: [],
        savedRoadmapProgress: {}
      });
    }
    const token = generateToken(newUser);
    res.status(201).json({
      message: "Account successfully registered.",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        organizationName: newUser.organizationName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Registration failed." });
  }
});
authRouter.post("/login", (req, res) => {
  try {
    const { email, role } = req.body;
    let user = email ? db.getUserByEmail(email) : void 0;
    if (!user && role) {
      for (const u of db.users.values()) {
        if (u.role === role) {
          user = u;
          break;
        }
      }
    }
    if (!user) {
      user = db.users.get("usr-student-1");
    }
    if (!user) {
      res.status(401).json({ error: "Invalid credentials or user not found." });
      return;
    }
    const token = generateToken(user);
    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        organizationName: user.organizationName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login failed." });
  }
});
authRouter.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const defaultUser = db.users.get("usr-student-1");
    const token = generateToken(defaultUser);
    res.json({
      token,
      user: {
        id: defaultUser.id,
        email: defaultUser.email,
        role: defaultUser.role,
        name: defaultUser.name,
        organizationName: defaultUser.organizationName
      }
    });
    return;
  }
  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.userId) || decoded;
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

// backend/api/student.ts
init_store();
import { Router as Router2 } from "express";

// backend/services/skillExtractor.ts
init_taxonomy();

// backend/services/aiRouter.ts
import { GoogleGenAI } from "@google/genai";
var aiInstance = null;
function getNativeAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiInstance;
}
var fetchWithTimeout = async (url, options, timeout) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};
function isNonRetryableError(err) {
  const msg = (err?.message || String(err)).toLowerCase();
  return msg.includes("missing") || msg.includes("invalid api key") || msg.includes("api_key_invalid") || msg.includes("401") || msg.includes("unauthorized") || msg.includes("403") || msg.includes("forbidden");
}
async function tryGemini(options) {
  const ai = getNativeAIClient();
  if (!ai) throw new Error("GEMINI_API_KEY missing or unconfigured");
  const model = process.env.GEMINI_MODEL || options.modelChoice || "gemini-2.5-flash";
  let contentsPayload;
  if (options.geminiContentsPayload) {
    contentsPayload = options.geminiContentsPayload;
  } else if (options.messages && options.messages.length > 0) {
    contentsPayload = options.messages.map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
  } else {
    contentsPayload = options.systemPrompt ? `${options.systemPrompt}

USER PROMPT: "${options.userPrompt || ""}"` : options.userPrompt || "";
  }
  const config = {};
  if (options.responseFormat === "json") {
    config.responseMimeType = "application/json";
    if (options.geminiSchema) {
      config.responseSchema = options.geminiSchema;
    }
  }
  if (options.systemPrompt && !options.geminiContentsPayload && (!options.userPrompt || options.messages)) {
    config.systemInstruction = options.systemPrompt;
  }
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS) || 1e4;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("TIMEOUT: Gemini exceeded response time")), timeoutMs);
  });
  const responsePromise = ai.models.generateContent({
    model,
    contents: contentsPayload,
    config
  });
  const response = await Promise.race([responsePromise, timeoutPromise]);
  if (!response?.text) throw new Error("Empty response from Gemini");
  return response.text;
}
async function tryOpenAICompatible(providerName, url, apiKey, model, options, timeout) {
  if (!apiKey || apiKey.startsWith("MY_") || apiKey.trim().length < 5) {
    throw new Error(`${providerName}_API_KEY missing or invalid`);
  }
  const messages = [];
  if (options.systemPrompt) {
    messages.push({ role: "system", content: options.systemPrompt });
  }
  if (options.messages && options.messages.length > 0) {
    messages.push(
      ...options.messages.map((m) => ({
        role: m.role === "model" ? "assistant" : m.role,
        content: m.content
      }))
    );
  } else if (options.userPrompt) {
    messages.push({ role: "user", content: options.userPrompt });
  } else if (options.geminiContentsPayload && typeof options.geminiContentsPayload === "string") {
    messages.push({ role: "user", content: options.geminiContentsPayload });
  } else if (options.geminiContentsPayload) {
    messages.push({ role: "user", content: JSON.stringify(options.geminiContentsPayload) });
  }
  const body = {
    model,
    messages
  };
  if (options.responseFormat === "json") {
    body.response_format = { type: "json_object" };
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };
  if (providerName === "OPENROUTER") {
    const appUrl = process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL" ? process.env.APP_URL : "https://skillsetu.gov.in";
    headers["HTTP-Referer"] = appUrl;
    headers["X-Title"] = "SkillSetu";
  }
  const res = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    },
    timeout
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 120)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Empty response from ${providerName}`);
  return content;
}
async function tryGroq(options) {
  return tryOpenAICompatible(
    "GROQ",
    "https://api.groq.com/openai/v1/chat/completions",
    process.env.GROQ_API_KEY || "",
    process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    options,
    Number(process.env.GROQ_TIMEOUT_MS) || 1e4
  );
}
async function tryOpenRouter(options) {
  return tryOpenAICompatible(
    "OPENROUTER",
    "https://openrouter.ai/api/v1/chat/completions",
    process.env.OPENROUTER_API_KEY || "",
    process.env.OPENROUTER_MODEL || "openrouter/free",
    options,
    Number(process.env.OPENROUTER_TIMEOUT_MS) || 15e3
  );
}
function sanitizeError(err) {
  let msg = err?.message || String(err);
  msg = msg.replace(/AIza[0-9A-Za-z-_]{20,}/g, "[REDACTED_API_KEY]");
  msg = msg.replace(/gsk_[0-9A-Za-z-_]{20,}/g, "[REDACTED_GROQ_KEY]");
  msg = msg.replace(/sk-or-[0-9A-Za-z-_]{20,}/g, "[REDACTED_OPENROUTER_KEY]");
  msg = msg.replace(/AQ\.[0-9A-Za-z-_]{20,}/g, "[REDACTED_TOKEN]");
  msg = msg.replace(/Bearer\s+[^\s"']+/gi, "Bearer [REDACTED]");
  return msg;
}
async function generateAIResponse(options) {
  let fallbackReason = "";
  let fallbackUsed = false;
  const validateJson = (text) => {
    if (options.responseFormat !== "json") return text;
    try {
      JSON.parse(text);
      return text;
    } catch {
      throw new Error("Malformed JSON received from AI provider");
    }
  };
  async function runWithOneRetry(providerName, fn) {
    try {
      return await fn();
    } catch (firstErr) {
      if (isNonRetryableError(firstErr)) {
        throw firstErr;
      }
      console.warn(`[AI] ${providerName} attempt 1 failed (${sanitizeError(firstErr)}). Retrying once...`);
      return await fn();
    }
  }
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  console.log(`[AI] Gemini attempt | Task: ${options.task} | Model: ${geminiModel}`);
  try {
    const text = await runWithOneRetry("Gemini", () => tryGemini(options));
    const validated = validateJson(text);
    console.log(`[AI] Gemini status: SUCCESS | Task: ${options.task} | Model: ${geminiModel}`);
    return {
      success: true,
      provider: "gemini",
      model: geminiModel,
      response: validated,
      fallbackUsed: false
    };
  } catch (geminiErr) {
    fallbackUsed = true;
    const cleanErr = sanitizeError(geminiErr);
    fallbackReason = `gemini_failed: ${cleanErr}`;
    console.warn(`[AI] Gemini status: FAILURE | Task: ${options.task} | Error: ${cleanErr} -> Falling back to Groq`);
  }
  const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  console.log(`[AI] Groq attempt | Task: ${options.task} | Model: ${groqModel}`);
  try {
    const text = await runWithOneRetry("Groq", () => tryGroq(options));
    const validated = validateJson(text);
    console.log(`[AI] Groq status: SUCCESS | Task: ${options.task} | Model: ${groqModel}`);
    return {
      success: true,
      provider: "groq",
      model: groqModel,
      response: validated,
      fallbackUsed: true,
      fallbackReason
    };
  } catch (groqErr) {
    const cleanErr = sanitizeError(groqErr);
    fallbackReason = `groq_failed: ${cleanErr}`;
    console.warn(`[AI] Groq status: FAILURE | Task: ${options.task} | Error: ${cleanErr} -> Falling back to OpenRouter`);
  }
  const openRouterModel = process.env.OPENROUTER_MODEL || "openrouter/free";
  console.log(`[AI] OpenRouter attempt | Task: ${options.task} | Model: ${openRouterModel}`);
  try {
    const text = await runWithOneRetry("OpenRouter", () => tryOpenRouter(options));
    const validated = validateJson(text);
    console.log(`[AI] OpenRouter status: SUCCESS | Task: ${options.task} | Model: ${openRouterModel}`);
    return {
      success: true,
      provider: "openrouter",
      model: openRouterModel,
      response: validated,
      fallbackUsed: true,
      fallbackReason
    };
  } catch (openRouterErr) {
    const cleanErr = sanitizeError(openRouterErr);
    fallbackReason = `openrouter_failed: ${cleanErr}`;
    console.warn(`[AI] OpenRouter status: FAILURE | Task: ${options.task} | Error: ${cleanErr} -> Falling back to Deterministic Engine`);
  }
  console.log(`[AI] Deterministic fallback engaged | Task: ${options.task}`);
  return {
    success: false,
    provider: "none",
    model: "none",
    response: "",
    fallbackUsed: true,
    fallbackReason: "all_providers_failed"
  };
}

// backend/services/resumeParser.ts
function parseResumeDeterministically(text) {
  if (!text || typeof text !== "string") {
    return {
      candidate: { name: "", email: "", phone: "", location: "" },
      summary: "",
      education: [],
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      possibleRoles: []
    };
  }
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/);
  let candidateName = "";
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 2 && line.length < 50 && !line.includes("@") && !line.toLowerCase().includes("resume") && !line.toLowerCase().includes("curriculum") && !line.toLowerCase().includes("phone") && !line.toLowerCase().includes("http") && !line.toLowerCase().includes("git")) {
      candidateName = line.replace(/^[#*\s-]+/, "").trim();
      break;
    }
  }
  const cityRegex = /\b(Bengaluru|Bangalore|Pune|Mumbai|Delhi|Hyderabad|Chennai|Kolkata|Noida|Gurgaon|Gurugram|Ahmedabad|Jaipur|Chandigarh|Kochi)\b/i;
  const locMatch = text.match(cityRegex);
  const location = locMatch ? locMatch[0] : "";
  let summary = "";
  const summaryHeaderIdx = lines.findIndex(
    (l) => /^(summary|professional summary|profile|about me|objective)[:\s]*$/i.test(l)
  );
  if (summaryHeaderIdx !== -1 && lines[summaryHeaderIdx + 1]) {
    summary = lines[summaryHeaderIdx + 1];
  } else {
    const candidateSummary = lines.find(
      (l) => l.length > 60 && !l.includes(":") && !l.startsWith("-") && !l.startsWith("\u2022")
    );
    summary = candidateSummary || "";
  }
  const education = [];
  const degreeRegex = /(B\.?Tech|B\.?E\.?|M\.?Tech|M\.?E\.?|B\.?Sc|M\.?Sc|BCA|MCA|Bachelor|Master|Diploma)[\w\s,.-]*/i;
  const yearRegex = /\b(20\d{2}(?:\s*[-–]\s*20?\d{2})?)\b/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const degMatch = line.match(degreeRegex);
    if (degMatch) {
      const yrMatch = line.match(yearRegex);
      const degree = degMatch[0].trim();
      let institution = line.replace(degMatch[0], "").replace(yearRegex, "").replace(/[,|–-]/g, " ").trim();
      if (!institution && i > 0) {
        institution = lines[i - 1];
      }
      education.push({
        degree,
        institution: institution || "Engineering Institute / University",
        year: yrMatch ? yrMatch[0] : ""
      });
      if (education.length >= 3) break;
    }
  }
  const rawExtracted = skillExtractor.extractFromText(text);
  const skills = rawExtracted.map((res) => ({
    name: res.skill.canonicalName,
    category: res.skill.category.toLowerCase().includes("soft") ? "soft" : "technical",
    evidence: `Extracted from text: "${res.extractedFromText}"`
  }));
  const projects = [];
  let inProjects = false;
  let currentProject = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(projects|academic projects|key projects)[:\s]*$/i.test(line)) {
      inProjects = true;
      continue;
    }
    if (inProjects && /^(experience|work experience|education|certifications|skills|technical skills|achievements)[:\s]*$/i.test(
      line
    )) {
      inProjects = false;
      if (currentProject) projects.push(currentProject);
      currentProject = null;
      continue;
    }
    if (inProjects) {
      if (/^(\d+\.|\*|-|•)\s+[A-Z]/.test(line) || /^[A-Z][A-Za-z0-9\s-]{3,40}(?:\s*\([^)]+\))?:?$/.test(line)) {
        if (currentProject) projects.push(currentProject);
        const nameClean = line.replace(/^(\d+\.|\*|-|•)\s*/, "").replace(/:$/, "").trim();
        currentProject = {
          name: nameClean,
          description: "",
          technologies: []
        };
      } else if (currentProject) {
        if (!currentProject.description) {
          currentProject.description = line;
        } else {
          currentProject.description += " " + line;
        }
      }
    }
  }
  if (currentProject) projects.push(currentProject);
  const experience = [];
  let inExp = false;
  let currentExp = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(experience|work experience|internships|professional experience)[:\s]*$/i.test(
      line
    )) {
      inExp = true;
      continue;
    }
    if (inExp && /^(projects|education|certifications|skills|achievements)[:\s]*$/i.test(line)) {
      inExp = false;
      if (currentExp) experience.push(currentExp);
      currentExp = null;
      continue;
    }
    if (inExp) {
      if (/^(\d+\.|\*|-|•)\s+[A-Z]/.test(line) || /^[A-Z][A-Za-z0-9\s,-]{3,50}\s*[-|–]/.test(line)) {
        if (currentExp) experience.push(currentExp);
        const parts = line.split(/[-|–]/).map((p) => p.trim());
        currentExp = {
          company: parts[0] || "Organization",
          role: parts[1] || "Intern / Engineer",
          duration: parts[2] || "",
          responsibilities: []
        };
      } else if (currentExp && (line.startsWith("-") || line.startsWith("\u2022"))) {
        currentExp.responsibilities.push(line.replace(/^[-•*]\s*/, "").trim());
      }
    }
  }
  if (currentExp) experience.push(currentExp);
  const certifications = [];
  const certLines = lines.filter(
    (l) => /(certified|certification|certificate|aws certified|cka|coursera|udemy|nptel)/i.test(l)
  );
  for (const cl of certLines.slice(0, 5)) {
    certifications.push(cl.replace(/^[-•*]\s*/, "").trim());
  }
  const skillNamesLower = new Set(skills.map((s) => s.name.toLowerCase()));
  const possibleRoles = [];
  if (skillNamesLower.has("docker") || skillNamesLower.has("kubernetes") || skillNamesLower.has("linux") || skillNamesLower.has("aws")) {
    possibleRoles.push("DevOps / Cloud Engineer");
  }
  if (skillNamesLower.has("react") || skillNamesLower.has("javascript") || skillNamesLower.has("typescript") || skillNamesLower.has("html5 & css3")) {
    possibleRoles.push("Frontend Developer");
  }
  if (skillNamesLower.has("node.js") || skillNamesLower.has("fastapi") || skillNamesLower.has("postgresql") || skillNamesLower.has("sql")) {
    possibleRoles.push("Backend Developer");
  }
  if (skillNamesLower.has("python") && (skillNamesLower.has("machine learning") || skillNamesLower.has("generative ai") || skillNamesLower.has("pytorch"))) {
    possibleRoles.push("AI & Data Science Engineer");
  }
  if (possibleRoles.length === 0) {
    possibleRoles.push("Software Engineer");
  }
  return {
    candidate: {
      name: candidateName,
      email: emailMatch ? emailMatch[0] : "",
      phone: phoneMatch ? phoneMatch[0] : "",
      location
    },
    summary,
    education,
    skills,
    experience,
    projects,
    certifications,
    possibleRoles
  };
}
async function parseResumeWithCentralizedAI(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    const empty = parseResumeDeterministically("");
    return {
      parsedResume: empty,
      provider: "deterministic",
      modelUsed: "SkillSetu Deterministic Engine",
      fallbackUsed: true
    };
  }
  const systemPrompt = `You are a high-precision Resume Intelligence parser for the SkillSetu platform.
Extract all candidate information from the provided resume text into a structured JSON object.

CRITICAL EXTRACTION RULES:
1. Never invent or hallucinate information that is not present in the resume text.
2. If information is missing, return empty string "", empty array [], or null as appropriate.
3. Classify each extracted skill category as "technical", "soft", "tool", or "language", and provide the concise evidence phrase from the resume where it appeared.
4. Detect realistic possible industry roles matching this candidate's profile.
5. Return ONLY a single valid JSON object strictly adhering to this schema:
{
  "candidate": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "summary": "string",
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "technical|soft|tool|language",
      "evidence": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "responsibilities": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "certifications": ["string"],
  "possibleRoles": ["string"]
}`;
  try {
    const aiRes = await generateAIResponse({
      task: "RESUME_ANALYSIS",
      systemPrompt,
      userPrompt: `RESUME TEXT:
"""
${resumeText.slice(0, 15e3)}
"""`,
      responseFormat: "json",
      modelChoice: "gemini-2.5-flash"
    });
    if (aiRes.success && aiRes.response && aiRes.provider !== "none") {
      let cleaned = aiRes.response.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      }
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed === "object") {
        const validated = {
          candidate: {
            name: parsed.candidate?.name || "",
            email: parsed.candidate?.email || "",
            phone: parsed.candidate?.phone || "",
            location: parsed.candidate?.location || ""
          },
          summary: parsed.summary || "",
          education: Array.isArray(parsed.education) ? parsed.education : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
          possibleRoles: Array.isArray(parsed.possibleRoles) ? parsed.possibleRoles : []
        };
        return {
          parsedResume: validated,
          provider: aiRes.provider,
          modelUsed: aiRes.model,
          fallbackUsed: aiRes.fallbackUsed
        };
      }
    }
  } catch (err) {
    console.warn(
      "[AI] Centralized AI Router resume parsing error, falling back to deterministic engine:",
      err?.message || err
    );
  }
  const deterministicParsed = parseResumeDeterministically(resumeText);
  return {
    parsedResume: deterministicParsed,
    provider: "deterministic",
    modelUsed: "SkillSetu Deterministic Engine",
    fallbackUsed: true
  };
}

// backend/services/pdfExtractor.ts
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var pdfParse = require2("pdf-parse");
async function extractTextFromPdf(base64OrBuffer) {
  try {
    let buffer;
    if (Buffer.isBuffer(base64OrBuffer)) {
      buffer = base64OrBuffer;
    } else if (typeof base64OrBuffer === "string") {
      const cleaned = base64OrBuffer.replace(/^data:[^;]+;base64,/, "").trim();
      buffer = Buffer.from(cleaned, "base64");
    } else {
      throw new Error("Unsupported input type for PDF extraction.");
    }
    if (!buffer || buffer.length === 0) {
      return { text: "", pageCount: 0 };
    }
    const data = await pdfParse(buffer);
    const rawText = data?.text || "";
    const cleanedText = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\t/g, " ").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    return {
      text: cleanedText,
      pageCount: data?.numpages || 1,
      info: data?.info
    };
  } catch (err) {
    console.warn("[PDF Extractor] Error extracting text from PDF:", err?.message || err);
    return {
      text: "",
      pageCount: 0
    };
  }
}

// backend/services/skillExtractor.ts
var SkillExtractorService = class {
  /**
   * Deterministically extract normalized skills from freeform text using
   * boundary-aware regex matching against canonical names and aliases.
   */
  extractFromText(text) {
    if (!text || typeof text !== "string") return [];
    const foundSkillsMap = /* @__PURE__ */ new Map();
    const lowerText = ` ${text.toLowerCase()} `;
    for (const skill of CANONICAL_SKILLS) {
      const escaped = skill.canonicalName.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?:[^a-z0-9]|^)${escaped}(?:[^a-z0-9]|$)`, "i");
      if (regex.test(lowerText)) {
        foundSkillsMap.set(skill.id, {
          skill,
          extractedFromText: skill.canonicalName,
          source: "DICTIONARY",
          confidence: 0.98
        });
      }
    }
    for (const aliasEntry of SKILL_ALIASES) {
      if (foundSkillsMap.has(aliasEntry.skillId)) continue;
      const escaped = aliasEntry.alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?:[^a-z0-9]|^)${escaped}(?:[^a-z0-9]|$)`, "i");
      if (regex.test(lowerText)) {
        const canonical = CANONICAL_SKILLS.find((s) => s.id === aliasEntry.skillId);
        if (canonical) {
          foundSkillsMap.set(canonical.id, {
            skill: canonical,
            extractedFromText: aliasEntry.alias,
            source: "DICTIONARY",
            confidence: 0.95
          });
        }
      }
    }
    return Array.from(foundSkillsMap.values());
  }
  /**
   * Normalizes an array of raw skill string inputs (e.g. ['ReactJS', 'k8s', 'AWS Cloud'])
   * into canonical skills.
   */
  normalizeSkills(rawSkills) {
    const unique = /* @__PURE__ */ new Map();
    for (const raw of rawSkills) {
      if (!raw || typeof raw !== "string") continue;
      const normalized = normalizeSkillText(raw);
      if (normalized && !unique.has(normalized.id)) {
        unique.set(normalized.id, normalized);
      }
    }
    return Array.from(unique.values());
  }
  /**
   * Complete End-to-End Resume Intelligence Pipeline:
   * PDF/Text -> Text Extraction -> Centralized AI Parsing -> Skill Normalization -> Structured Result.
   */
  async analyzeResume(options) {
    let extractedText = options.resumeText || "";
    if (options.base64Pdf) {
      const pdfResult = await extractTextFromPdf(options.base64Pdf);
      if (pdfResult.text && pdfResult.text.trim().length > 0) {
        extractedText = pdfResult.text.trim();
      }
    }
    const aiResult = await parseResumeWithCentralizedAI(extractedText);
    const skillsToNormalize = [];
    const directResults = this.extractFromText(extractedText);
    for (const res of directResults) {
      skillsToNormalize.push(res.skill.canonicalName);
    }
    if (aiResult.parsedResume && Array.isArray(aiResult.parsedResume.skills)) {
      for (const s of aiResult.parsedResume.skills) {
        if (s.name) skillsToNormalize.push(s.name);
      }
    }
    const normalizedSkills = this.normalizeSkills(skillsToNormalize);
    return {
      parsedResume: aiResult.parsedResume,
      normalizedSkills,
      extractedText,
      provider: aiResult.provider,
      modelUsed: aiResult.modelUsed,
      fallbackUsed: aiResult.fallbackUsed
    };
  }
  /**
   * Backward-compatible helper method
   */
  async extractFromResumeHybrid(rawText, isBase64Pdf = false) {
    const result = await this.analyzeResume({
      resumeText: isBase64Pdf ? void 0 : rawText,
      base64Pdf: isBase64Pdf ? rawText : void 0
    });
    return {
      parsedAI: result.parsedResume,
      normalizedSkills: result.normalizedSkills
    };
  }
};
var skillExtractor = new SkillExtractorService();

// backend/services/matchingEngine.ts
init_store();
var MatchingEngineService = class {
  /**
   * Deterministically calculates match score between a student's skills and a job's requirements.
   * Explainable formula:
   * RequiredWeight = 0.70, PreferredWeight = 0.30
   * Match% = (MatchedRequired / TotalRequired * 0.70 + MatchedPreferred / TotalPreferred * 0.30) * 100
   */
  matchStudentToJob(student, job) {
    const studentSkillMap = new Map(
      student.skills.map((s) => [s.skillId, s])
    );
    const requiredJobSkills = job.skills.filter((s) => s.isRequired);
    const preferredJobSkills = job.skills.filter((s) => !s.isRequired);
    let matchedRequiredCount = 0;
    let matchedPreferredCount = 0;
    const strongSkills = [];
    const missingSkills = [];
    const weakSkills = [];
    for (const jobSkill of job.skills) {
      const skillObj = db.getSkillById(jobSkill.skillId) || {
        id: jobSkill.skillId,
        canonicalName: jobSkill.skillId,
        category: "Backend",
        description: "",
        marketDemandLevel: "HIGH",
        averageSalaryBumpPct: 20
      };
      const studentHas = studentSkillMap.get(jobSkill.skillId);
      if (!studentHas) {
        const priority = jobSkill.isRequired ? skillObj.marketDemandLevel === "HIGH" ? "CRITICAL" : "HIGH" : "MEDIUM";
        missingSkills.push({
          skill: skillObj,
          status: "MISSING",
          isRequired: jobSkill.isRequired,
          requiredProficiency: jobSkill.minProficiency,
          marketDemand: skillObj.marketDemandLevel,
          gapPriority: priority,
          explanation: jobSkill.isRequired ? `Mandatory requirement for this role (${jobSkill.minProficiency} level needed). Industry demand is ${skillObj.marketDemandLevel}.` : `Preferred skill. Would boost candidate rating.`
        });
      } else {
        const isProficient = this.isProficiencySufficient(
          studentHas.proficiency,
          jobSkill.minProficiency
        );
        if (isProficient) {
          if (jobSkill.isRequired) matchedRequiredCount++;
          else matchedPreferredCount++;
          const isStrong = studentHas.verified && (studentHas.proficiency === "ADVANCED" || studentHas.proficiency === "INTERMEDIATE");
          const detail = {
            skill: skillObj,
            status: isStrong ? "STRONG" : "MATCHED",
            isRequired: jobSkill.isRequired,
            studentProficiency: studentHas.proficiency,
            requiredProficiency: jobSkill.minProficiency,
            marketDemand: skillObj.marketDemandLevel,
            gapPriority: "LOW",
            explanation: `Candidate verified at ${studentHas.proficiency} level (meets ${jobSkill.minProficiency} threshold).`
          };
          if (isStrong) strongSkills.push(detail);
        } else {
          weakSkills.push({
            skill: skillObj,
            status: "WEAK",
            isRequired: jobSkill.isRequired,
            studentProficiency: studentHas.proficiency,
            requiredProficiency: jobSkill.minProficiency,
            marketDemand: skillObj.marketDemandLevel,
            gapPriority: "HIGH",
            explanation: `Candidate has ${studentHas.proficiency} proficiency, but job explicitly requires ${jobSkill.minProficiency}.`
          });
        }
      }
    }
    const totalRequired = Math.max(1, requiredJobSkills.length);
    const requiredMatchFraction = matchedRequiredCount / totalRequired;
    let overallMatchPct = 0;
    let preferredMatchFraction = 1;
    if (preferredJobSkills.length > 0) {
      preferredMatchFraction = matchedPreferredCount / preferredJobSkills.length;
      overallMatchPct = Math.round((requiredMatchFraction * 0.7 + preferredMatchFraction * 0.3) * 100);
    } else {
      overallMatchPct = Math.round(requiredMatchFraction * 100);
    }
    const requiredMatchPct = Math.round(requiredMatchFraction * 100);
    const preferredMatchPct = Math.round(preferredMatchFraction * 100);
    const matchBreakdownExplanation = `Score computed mathematically: ${matchedRequiredCount}/${totalRequired} mandatory skills met (${requiredMatchPct}% required weight) + ${matchedPreferredCount}/${Math.max(1, preferredJobSkills.length)} preferred skills met (${preferredMatchPct}% preferred weight). Identified ${missingSkills.length} missing skill gaps.`;
    return {
      job,
      overallMatchPct,
      requiredMatchPct,
      preferredMatchPct,
      matchedSkillsCount: matchedRequiredCount + matchedPreferredCount,
      totalRequiredCount: totalRequired,
      strongSkills,
      missingSkills,
      weakSkills,
      matchBreakdownExplanation
    };
  }
  isProficiencySufficient(has, needed) {
    const rank = {
      BEGINNER: 1,
      INTERMEDIATE: 2,
      ADVANCED: 3
    };
    return (rank[has] || 1) >= (rank[needed] || 1);
  }
  /**
   * Evaluates skill gaps between a student and their chosen Target Role across the whole market
   */
  evaluateRoleSkillGaps(student, targetRole) {
    const matchingJobs = db.getAllJobs().filter(
      (j) => j.roleCategory.toLowerCase().includes(targetRole.toLowerCase()) || targetRole.toLowerCase().includes(j.roleCategory.toLowerCase())
    );
    const jobsToUse = matchingJobs.length > 0 ? matchingJobs : db.getAllJobs().slice(0, 3);
    const marketSkillFrequency = /* @__PURE__ */ new Map();
    for (const job of jobsToUse) {
      for (const js of job.skills) {
        marketSkillFrequency.set(js.skillId, (marketSkillFrequency.get(js.skillId) || 0) + (js.isRequired ? 2 : 1));
      }
    }
    const studentSkillIds = new Set(student.skills.map((s) => s.skillId));
    const marketSkillsNeeded = [];
    let strongCount = 0;
    let missingCount = 0;
    for (const [skillId] of marketSkillFrequency.entries()) {
      const skill = db.getSkillById(skillId);
      if (!skill) continue;
      const has = studentSkillIds.has(skillId);
      const isMissing = !has;
      if (isMissing) {
        missingCount++;
      } else {
        strongCount++;
      }
      marketSkillsNeeded.push({
        skill,
        marketDemand: skill.marketDemandLevel,
        isMissing,
        isWeak: false
      });
    }
    const total = marketSkillsNeeded.length || 1;
    const overallPreparednessPct = Math.round(strongCount / total * 100);
    return {
      targetRole,
      marketSkillsNeeded,
      strongCount,
      missingCount,
      overallPreparednessPct
    };
  }
};
var matchingEngine = new MatchingEngineService();

// backend/services/geminiService.ts
import { Type } from "@google/genai";
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const orKey = process.env.OPENROUTER_API_KEY;
  if ((!apiKey || apiKey === "MY_GEMINI_API_KEY") && !groqKey && !orKey) {
    return null;
  }
  return {
    models: {
      generateContent: async (args) => {
        const { model, contents, config } = args;
        let systemPrompt = typeof config?.systemInstruction === "string" ? config.systemInstruction : void 0;
        let responseFormat = config?.responseMimeType === "application/json" ? "json" : "text";
        let geminiSchema = config?.responseSchema;
        let userPrompt = "";
        let messages = void 0;
        let geminiContentsPayload = contents;
        let task = "GENERAL_CHAT";
        if (typeof contents === "string") {
          userPrompt = contents;
          geminiContentsPayload = void 0;
          if (contents.includes("Resume Intelligence")) task = "RESUME_ANALYSIS";
          else if (contents.includes("expert technical recruiter")) task = "JOB_MATCH_EXPLANATION";
          else if (contents.includes("Curriculum Auditor")) task = "CURRICULUM_ANALYSIS";
          else if (contents.includes("Career Copilot")) task = "CAREER_COPILOT";
          else if (contents.includes("Career Simulation Engine")) task = "CAREER_SIMULATION";
          else if (contents.includes("Chief Industry Demand Evaluator")) task = "SIMULATION_EVALUATION";
        } else if (Array.isArray(contents)) {
          if (contents.length > 0 && contents[0].role) {
            messages = contents.map((c) => ({
              role: c.role === "model" ? "assistant" : "user",
              content: c.parts[0].text
            }));
            geminiContentsPayload = void 0;
            task = "MULTI_TURN_CHAT";
          } else if (contents.length > 0 && contents[0].parts) {
            task = "RESUME_ANALYSIS";
          }
        }
        const res = await generateAIResponse({
          task,
          systemPrompt,
          userPrompt,
          responseFormat,
          geminiContentsPayload,
          geminiSchema,
          messages,
          modelChoice: model
        });
        if (!res.success) throw new Error(res.fallbackReason || "All providers failed");
        return { text: res.response };
      }
    }
  };
}
async function generateJobRequirementsWithGemini(promptInput) {
  const ai = getAIClient();
  if (!ai) return null;
  try {
    const systemPrompt = `You are an expert technical recruiter and industry job market specialist.
Given a prompt like "I need a junior DevOps engineer" or an unstructured hiring requirement,
extract and structure the required skills, preferred skills, typical Indian tech market salary range (in LPA),
and professional job description. Return JSON matching the schema.`;
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `${systemPrompt}

USER PROMPT: "${promptInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            roleCategory: { type: Type.STRING },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            preferredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            experienceMinYears: { type: Type.NUMBER },
            salaryMinLPA: { type: Type.NUMBER },
            salaryMaxLPA: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["title", "requiredSkills", "description"]
        }
      }
    });
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Job Generation error:", err);
    return null;
  }
}
async function analyzeCurriculumWithGemini(syllabusText) {
  const ai = getAIClient();
  if (!ai) return null;
  try {
    const prompt = `You are a Higher Education Academic Curriculum Auditor evaluating a college engineering syllabus against 2026 industry demand.
Analyze the syllabus, extract subjects and technical competencies, identify outdated topics vs missing modern industry skills (e.g. Docker, Kubernetes, AWS, Modern CI/CD, GenAI), and provide recommendations. Return JSON.`;
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `${prompt}

SYLLABUS CONTENT:
"""
${syllabusText}
"""`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            outdatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingIndustrySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedAdditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            executiveSummary: { type: Type.STRING }
          },
          required: ["subjects", "extractedSkills", "missingIndustrySkills", "executiveSummary"]
        }
      }
    });
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Curriculum Audit error:", err);
    return null;
  }
}
function getDeterministicCopilotAnswer(userQuery, studentContext) {
  const qLower = userQuery.toLowerCase();
  if (qLower.includes("learn next") || qLower.includes("what should i learn")) {
    return `Based on your target role (${studentContext.targetRole}):
1. **Immediate Priority**: Start with **Docker**. 78% of benchmark DevOps/Cloud job postings require container creation and multi-stage Dockerfiles.
2. **Secondary Priority**: Follow up with **AWS fundamentals** (EC2, VPC, IAM, S3).
3. **Foundation Check**: Your existing skills in ${studentContext.currentSkills.slice(0, 3).join(", ")} already provide a strong base for OS and scripting.`;
  }
  if (qLower.includes("why is docker") || qLower.includes("why do i need docker")) {
    return `**Why Docker Matters for ${studentContext.targetRole}**:
- **Market Prevalence**: Docker is mandated in 78% of active cloud & DevOps postings in our dataset.
- **Role Integration**: Production services are packaged as microcontainers; CI/CD runners depend on container images for testing and deployment.
- **Current Profile**: Your profile has not detected Docker yet. Acquiring intermediate proficiency addresses one of your two highest-priority market-alignment gaps.`;
  }
  if (qLower.includes("biggest skill gaps") || qLower.includes("biggest gaps")) {
    return `**Your Critical Skill Gaps for ${studentContext.targetRole}**:
1. **Docker** (High Priority - 78% market prevalence)
2. **AWS** (High Priority - 82% market prevalence)
3. **Kubernetes** (Medium Priority - Container orchestration)
4. **CI/CD Pipelines** (Medium Priority - Automated testing & deployment)
5. **Terraform** (Low/Emerging Priority - Infrastructure as Code)`;
  }
  if (qLower.includes("which job roles") || qLower.includes("job match") || qLower.includes("roles match")) {
    return `**Top Roles Matching Your Profile**:
1. **Cloud Support Engineer** (~56% match) - Strong fit with your Linux, Git, and SQL foundation.
2. **Junior Cloud Engineer** (~51% match) - Aligns with Linux and Python skills.
3. **Associate DevOps Engineer** (~48% match) - Strong OS and Git baseline; bridging Docker and AWS will significantly improve alignment.`;
  }
  if (qLower.includes("most demanded") || qLower.includes("skills are most demanded")) {
    return `**Most Demanded Skills for ${studentContext.targetRole}**:
- **AWS** (Index: 88/100 demand)
- **Linux** (Index: 85/100 demand - \u2713 Already covered in your profile)
- **Docker** (Index: 82/100 demand - \u26A0 Current Gap)
- **Git** (Index: 80/100 demand - \u2713 Already verified in your profile)
- **Kubernetes** (Index: 66/100 demand - \u26A0 Current Gap)`;
  }
  return `Based on your profile targeting "${studentContext.targetRole}":
- You currently possess verified foundations in: ${studentContext.currentSkills.join(", ")}.
- Your primary detected industry skill gaps are: ${studentContext.missingSkills.join(", ")}.
- Benchmark market dataset shows active vacancies including: ${studentContext.targetJobs.slice(0, 2).join(", ")}.
Recommended immediate focus: Containerization (Docker) and AWS cloud infrastructure.`;
}
async function askCareerCopilotWithGemini(userQuery, studentContext) {
  const systemInstruction = `You are SkillSetu Career Copilot for the Smart India Hackathon platform.
You assist Indian engineering students to bridge skill gaps between academia and industry.
Always ground your answers in the user's ACTUAL PROFILE and REAL Industry Demand METRICS:
- Student Name: ${studentContext.name}
- Target Role: ${studentContext.targetRole}
- Verified Skills: ${studentContext.currentSkills.join(", ")}
- Missing Industry Skills: ${studentContext.missingSkills.join(", ")}
- Target Matching Openings: ${studentContext.targetJobs.join(", ")}
- Regional Openings Index: ${studentContext.topRegionalOpenings}

Rules:
1. Provide actionable, evidence-based career guidance.
2. Directly answer questions like "Why do I need Docker?" or "What should I learn next?" by citing the target role requirements.
3. Be professional, encouraging, concise, and structured.
4. Separate verified data from recommendations.`;
  try {
    const aiRes = await generateAIResponse({
      task: "CAREER_COPILOT",
      systemPrompt: systemInstruction,
      userPrompt: userQuery
    });
    if (aiRes.success && aiRes.response && aiRes.provider !== "none") {
      return {
        answer: aiRes.response,
        provider: aiRes.provider,
        modelUsed: aiRes.model
      };
    }
  } catch (err) {
    console.warn("[AI ROUTER] Copilot centralized router error, falling back to deterministic:", err?.message);
  }
  return {
    answer: getDeterministicCopilotAnswer(userQuery, studentContext),
    provider: "deterministic",
    modelUsed: "SkillSetu Deterministic Engine"
  };
}
function getDeterministicHelpAnswer(userQuery, userRole = "STUDENT", userName, organization) {
  const queryLower = (userQuery || "").toLowerCase();
  const name = userName || "User";
  if (queryLower.includes("how can skillsetu help") || queryLower.includes("improve my skills") || queryLower.includes("how does it work")) {
    return `Hello ${name}! Here is how **SkillSetu** directly empowers you to bridge industry skill gaps:

1. **Skill Gap Diagnostics**: We analyze your current verified competencies against live 2026 hiring telemetry from top employers across Indian tech hubs (Bengaluru, Pune, Hyderabad, Delhi NCR).
2. **Dynamic Industry Alignment**: Rather than static syllabus lists, SkillSetu computes real-time demand-to-supply deficits (e.g. 2.47x shortage in containerization & cloud infrastructure).
3. **Step-by-Step Action Roadmap**: SkillSetu converts detected gaps into clear, milestone-driven learning sprints with curated open-source projects and lab exercises.
4. **Verifiable Competencies**: Practice hands-on scenarios in the Career Simulator and take assessments to prove your capabilities to hiring employers.

Explore your **Skill Gap Analysis** tab or ask me about any specific role to get started!`;
  }
  if (queryLower.includes("skill gap") || queryLower.includes("gap") || queryLower.includes("explain my skill")) {
    return `Hello ${name}! Here is an explanation of your **SkillSetu Skill Gaps**:

- **What is a Skill Gap?**: A skill gap is the measurable distance between your academic preparation and what live job descriptions currently require.
- **Top In-Demand Competencies**: In our 2026 dataset, the most critical missing competencies for engineering graduates are:
  - **Containerization (Docker)**: Critical for microservices deployment and local test reproducibility.
  - **Cloud Infrastructure (AWS / GCP)**: Essential for modern backend, DevOps, and cloud engineering roles.
  - **CI/CD Automation (GitHub Actions / GitLab)**: Industry standard for continuous delivery pipelines.
- **Recommended Action**: Start with the highest-priority gap (**Docker**) to unlock immediate eligibility for over 45% of available entry-level cloud and platform roles.`;
  }
  if (queryLower.includes("react") || queryLower.includes("frontend") || queryLower.includes("web developer")) {
    return `Hello ${name}! Here are the essential requirements for a modern **React / Frontend Developer in 2026**:

1. **Core Language Fundamentals**:
   - **TypeScript (Strict Mode)**: Mandatory across 90%+ of production enterprise codebases.
   - **Modern JavaScript (ES2024+)**: Async/await, closures, event loop, and modular design.
2. **React Ecosystem**:
   - **React 19 & Component Architecture**: Hooks (\`use\`, \`useActionState\`, \`useEffect\`), Server Components, and client state isolation.
   - **State Management & Data Fetching**: React Query / TanStack Query, Zustand, or Redux Toolkit.
3. **Styling & Design Systems**:
   - Modern Tailwind CSS, responsive accessible HTML5 (WCAG 2.1 compliance).
4. **Production Engineering**:
   - Automated testing (Vitest, React Testing Library, Playwright).
   - Bundlers & tooling (Vite, Next.js App Router, CI/CD deployment pipelines).`;
  }
  if (queryLower.includes("what should i learn next") || queryLower.includes("learn next") || queryLower.includes("roadmap")) {
    return `Hello ${name}! Based on high-impact Industry Demand intelligence:

1. **Immediate Focus (Weeks 1\u20132)**: Master **Docker & Container Fundamentals**. Containerize a multi-tier application (Node/Express backend + React frontend + PostgreSQL/MongoDB).
2. **Secondary Milestone (Weeks 3\u20134)**: Deploy your containerized stack to **AWS** (ECS/EKS or App Runner) and write a **GitHub Actions CI/CD** pipeline that automatically runs linting and build checks on push.
3. **Portfolio Evidence**: Document your architectural decisions in a GitHub README with diagrams and live deployment URLs.`;
  }
  return `Hello ${name}! I am SkillSetu Help, your evidence-based intelligence assistant for ${userRole} (${organization || "SkillSetu Platform"}).

Regarding your question: "${userQuery}"

Here are evidence-backed insights from the SkillSetu Platform:
1. **Industry Demand Alignment**: The 2026 labour market prioritizes demonstrable, project-verified competencies over theoretical coursework alone.
2. **Core Deficit Hotspots**: Over 62% of hiring manager feedback cites lack of containerization (Docker), cloud infrastructure (AWS), and production CI/CD skills in fresh graduates.
3. **Next Steps**: Use the **Skill Gap Analysis** and **Learning Roadmap** tabs to systematically build and verify the missing skills required for your target industry roles.`;
}
async function sendMultiTurnChatMessage(payload) {
  const userRole = payload.userRole || "GENERAL";
  const defaultSystemInstruction = `You are SkillSetu Help, the AI intelligence engine behind the Smart India Hackathon platform for Industry Demand alignment.
Your user role is: ${userRole} (${payload.userName || "User"} from ${payload.organization || "SkillSetu Platform"}).
Your primary purpose is to provide rigorous, evidence-based, actionable guidance on skill development, market demands, curriculum alignment, and technical career progression.
- Always provide structured, clear, and insightful responses with bullet points and concrete steps.
- When advising on technical topics (like Docker, Kubernetes, AWS, GenAI, Python, Linux), give accurate industry-standard engineering advice.
- When advising institutions or governments, cite measurable curricular alignment methodologies and demand-supply ratios.
- Ground advice in Indian tech ecosystem realities (Bengaluru, Pune, Hyderabad, Delhi NCR, etc.).`;
  const systemInstruction = payload.systemInstruction || defaultSystemInstruction;
  try {
    const aiRes = await generateAIResponse({
      task: "SKILLSETU_HELP",
      systemPrompt: systemInstruction,
      messages: payload.messages,
      modelChoice: payload.modelChoice
    });
    if (aiRes.success && aiRes.response && aiRes.provider !== "none") {
      return {
        reply: aiRes.response,
        answer: aiRes.response,
        provider: aiRes.provider,
        modelUsed: aiRes.model,
        fallbackUsed: aiRes.fallbackUsed
      };
    }
  } catch (err) {
    console.warn("[AI] SkillSetu Help AI Router failed, switching to deterministic fallback:", err?.message);
  }
  const lastUserMessage = [...payload.messages].reverse().find((m) => m.role === "user")?.content || "";
  const fallbackAnswer = getDeterministicHelpAnswer(
    lastUserMessage,
    payload.userRole,
    payload.userName,
    payload.organization
  );
  return {
    reply: fallbackAnswer,
    answer: fallbackAnswer,
    provider: "deterministic",
    modelUsed: "SkillSetu Deterministic Engine",
    fallbackUsed: true
  };
}
async function generateSimulatorScenarioWithGemini(options) {
  const { targetRole, skillGaps, promptRequest, category = "incident" } = options;
  const primaryGap = skillGaps[0] || "Docker";
  const secondaryGap = skillGaps[1] || "AWS";
  const ai = getAIClient();
  const fallbackScenarios = {
    incident: {
      id: `sim-${Date.now()}`,
      category: "incident",
      categoryLabel: "\u{1F6A8} Technical Incident",
      title: "Production Deployment Failure",
      subtitle: `Critical pod crash-loop after latest container release in ${targetRole}`,
      description: `Your production deployment has failed after a new container image was released. Your manager asks you to identify the likely cause, assess container logs, and explain your recovery and rollback plan.`,
      targetRole,
      evaluatedSkill: primaryGap,
      skillsTested: [primaryGap, "Incident Response", "Debugging", "Production Communication"],
      difficulty: "Intermediate",
      personaName: "Rajesh Sen",
      personaRole: "VP of Platform Engineering",
      initialMessage: `Satish, our primary checkout service deployment just failed in production. The alerts triggered 2 minutes ago and pods are failing health probes. What is the immediate first telemetry command or log check you execute to diagnose this?`,
      objectives: [
        "Inspect Docker container logs and identify exit status codes",
        "Verify resource limits and environment variable configurations",
        "Execute immediate rollback to previous stable container tag",
        "Communicate blast radius and mitigation plan to leadership"
      ],
      keyRubrics: ["Technical container diagnostic accuracy", "Root-cause analysis", "Incident composure", "Clear recovery timeline"],
      expectedTurns: 4
    },
    interview: {
      id: `sim-${Date.now()}`,
      category: "interview",
      categoryLabel: "\u{1F3A4} Technical Interview",
      title: "DevOps & Cloud Systems Architecture Interview",
      subtitle: `System reliability and container orchestration technical round`,
      description: `A senior technical interviewer assesses your understanding of containerization, cloud networking, and continuous deployment workflows.`,
      targetRole,
      evaluatedSkill: primaryGap,
      skillsTested: [primaryGap, secondaryGap, "System Architecture", "CI/CD Pipelines"],
      difficulty: "Intermediate",
      personaName: "Priya Sundaram",
      personaRole: "Staff Infrastructure Architect",
      initialMessage: `Welcome Satish. In our infrastructure, we run hundreds of microservices. Could you explain how you would containerize a Python service with Docker, and what best practices you adopt to ensure minimal image size and security?`,
      objectives: [
        "Explain multi-stage Docker builds and slim base images",
        "Discuss non-root container users and secrets management",
        "Demonstrate understanding of container networking vs host port binding",
        "Address CI/CD pipeline automation and artifact registries"
      ],
      keyRubrics: ["Containerization depth", "Security conscious architecture", "Clarity of explanation"],
      expectedTurns: 4
    },
    workplace: {
      id: `sim-${Date.now()}`,
      category: "workplace",
      categoryLabel: "\u{1F4BC} Workplace Communication",
      title: "Explaining Container Migration to Engineering Leadership",
      subtitle: `Cross-functional technical proposal and deadline alignment`,
      description: `You need to convince your engineering manager why investing two sprints into migrating legacy VMs to Docker containers will reduce infrastructure costs and deployment failures.`,
      targetRole,
      evaluatedSkill: primaryGap,
      skillsTested: ["Technical Communication", "Stakeholder Management", primaryGap, "Cost Optimization"],
      difficulty: "Intermediate",
      personaName: "Anil Mehta",
      personaRole: "Engineering Manager",
      initialMessage: `Satish, you requested 2 weeks of sprint time to containerize our legacy services with Docker instead of shipping the new payment feature. Why should business stakeholders prioritize this technical refactor right now?`,
      objectives: [
        "Frame containerization in terms of business velocity and MTTR reduction",
        "Explain parity between local dev and cloud staging environments",
        "Offer a phased, low-risk migration strategy",
        "Propose quantitative metrics to evaluate ROI"
      ],
      keyRubrics: ["Business impact articulation", "Active listening", "Pragmatic compromise"],
      expectedTurns: 4
    },
    problem_solving: {
      id: `sim-${Date.now()}`,
      category: "problem_solving",
      categoryLabel: "\u{1F9E0} Problem Solving",
      title: "High-Latency Cloud Service Debugging",
      subtitle: `Performance bottleneck isolation across distributed microservices`,
      description: `User requests to the cloud platform are experiencing 4-second latency spikes. Walk through your systematic troubleshooting workflow to isolate whether the issue is network, database, container, or cloud resource starvation.`,
      targetRole,
      evaluatedSkill: secondaryGap,
      skillsTested: [secondaryGap, "Distributed Tracing", "Linux Performance Metrics", "Troubleshooting"],
      difficulty: "Advanced",
      personaName: "Vikram Joshi",
      personaRole: "Principal SRE",
      initialMessage: `Satish, our P99 latency suddenly spiked from 120ms to 4.2 seconds under heavy traffic. The database CPU looks normal at 35%. Walk me through how you isolate the bottleneck.`,
      objectives: [
        "Analyze distributed request tracing and API gateway logs",
        "Check container thread pool saturation and connection pooling",
        "Examine memory leak / OOM throttling signals",
        "Propose both immediate mitigation and long-term architectural safeguard"
      ],
      keyRubrics: ["Hypothesis generation", "Systematic metric inspection", "Architectural trade-off assessment"],
      expectedTurns: 4
    }
  };
  if (!ai || !promptRequest) {
    return fallbackScenarios[category] || fallbackScenarios.incident;
  }
  try {
    const prompt = `You are the SkillSetu Career Simulation Engine for Smart India Hackathon.
Generate a realistic workplace or interview simulation scenario tailored to:
- Student Target Role: "${targetRole}"
- Skill Gaps to Test: ${skillGaps.join(", ")}
- Student Custom Prompt / Intent: "${promptRequest || "Production incident"}"
- Category: "${category}"

Return ONLY a JSON object matching this schema:
{
  "id": "sim-${Date.now()}",
  "category": "${category}",
  "categoryLabel": "String with emoji",
  "title": "Short punchy scenario title",
  "subtitle": "Short descriptive subtitle",
  "description": "2 sentence realistic situation background",
  "targetRole": "${targetRole}",
  "evaluatedSkill": "${primaryGap}",
  "skillsTested": ["Skill 1", "Skill 2", "Skill 3"],
  "difficulty": "Intermediate",
  "personaName": "Indian professional persona name",
  "personaRole": "Realistic manager or interviewer title",
  "initialMessage": "First message from the persona initiating the problem or question",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "keyRubrics": ["Rubric 1", "Rubric 2", "Rubric 3"],
  "expectedTurns": 4
}`;
    const res = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    if (res.text) {
      const parsed = JSON.parse(res.text);
      return {
        ...parsed,
        id: parsed.id || `sim-${Date.now()}`,
        targetRole,
        evaluatedSkill: parsed.evaluatedSkill || primaryGap,
        skillsTested: parsed.skillsTested || [primaryGap, "Troubleshooting", "Communication"]
      };
    }
  } catch (err) {
    console.warn("Gemini scenario generation fallback:", err);
  }
  return fallbackScenarios[category] || fallbackScenarios.incident;
}
async function simulatorTurnWithGemini(scenario, history, userMessage) {
  const turnIndex = history.filter((h) => h.role === "user").length + 1;
  const ai = getAIClient();
  if (!ai) {
    const lower = userMessage.toLowerCase();
    let reply = "";
    let hint = "";
    if (turnIndex === 1) {
      if (lower.includes("log") || lower.includes("docker logs") || lower.includes("kubectl") || lower.includes("status")) {
        reply = `Good first step. You run \`docker logs\` and discover exit code 137 (OOMKilled) \u2014 the container exceeded its allocated memory limit during the heavy startup migration. How do you address this immediately to restore service, and what is your longer-term prevention?`;
        hint = `Consider immediate resource limit bump vs rolling back to the previous stable release.`;
      } else {
        reply = `Checking that is helpful, but while you do, customer requests continue to 502. The first command a senior engineer runs here is \`docker logs --tail 100\` or inspecting container exit codes. You notice exit code 137. What does exit code 137 mean in containerized deployments?`;
        hint = `Exit code 137 indicates the OS OOM (Out Of Memory) killer terminated the container process.`;
      }
    } else if (turnIndex === 2) {
      if (lower.includes("memory") || lower.includes("rollback") || lower.includes("limit") || lower.includes("heap") || lower.includes("oom")) {
        reply = `Spot on. Rolling back while tuning the memory ceiling restored 99.8% availability. Now, my director is asking: how did this slip through our pre-production pipeline? What automated check or test will you add to our CI/CD before the next release?`;
        hint = `Mention staging load testing, container memory profiling, or automated health check thresholds.`;
      } else {
        reply = `Understood. We executed a rapid rollback to tag \`v2.4.1\` which restored the service. To prevent recurrence, what testing or validation would you mandate in the CI/CD pipeline before images get pushed to production?`;
        hint = `Think about automated staging tests with realistic memory limits and synthetic load.`;
      }
    } else {
      reply = `Excellent breakdown, Satish. That gives leadership confidence in your incident management and architectural foresight. I've noted down your response for the post-mortem. You can now conclude the simulation to review your comprehensive evaluation.`;
    }
    return {
      reply,
      hint,
      stageProgress: Math.min(100, Math.round(turnIndex / scenario.expectedTurns * 100)),
      suggestedFollowUp: "Conclude and view performance rubric evaluation."
    };
  }
  try {
    const systemPrompt = `You are roleplaying as "${scenario.personaName}", who is "${scenario.personaRole}".
Context:
- Scenario: ${scenario.title} - ${scenario.description}
- Target Role: ${scenario.targetRole}
- Skill being evaluated: ${scenario.evaluatedSkill}
- Objectives: ${scenario.objectives.join("; ")}

Rules for your response:
1. Stay strictly in character as a professional, direct, but supportive engineering leader or interviewer.
2. DO NOT list numbered questionnaires or break character.
3. React directly to what the candidate just said. If their technical answer is sharp, acknowledge it and escalate to the next logical step. If they missed something crucial, probe them realistically with a realistic constraint (e.g. "We don't have SSH access to prod pods").
4. Keep your response under 70 words. Be conversational, crisp, and high-impact.
5. If the turn count is ${scenario.expectedTurns} or more, wrap up the conversation naturally.`;
    const contents = [
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.text }]
      })),
      { role: "user", parts: [{ text: userMessage }] }
    ];
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt
      }
    });
    const reply = response.text || "I see. Please elaborate on your proposed recovery plan.";
    return {
      reply,
      stageProgress: Math.min(100, Math.round(turnIndex / scenario.expectedTurns * 100))
    };
  } catch (err) {
    console.error("Gemini simulator turn error:", err);
    return {
      reply: `Understood. You took decisive action. Let's move to the mitigation post-mortem: what would you document for the engineering team?`,
      stageProgress: 75
    };
  }
}
async function evaluateSimulationWithGemini(scenario, transcript) {
  const ai = getAIClient();
  const fallbackEval = {
    overallScore: 84,
    verdict: "Proficient - Demonstrates Sound Incident & Architectural Acumen",
    rubricScores: {
      technicalAccuracy: 88,
      problemSolving: 82,
      communication: 85,
      composureUnderPressure: 80
    },
    strengths: [
      `Quickly identified container diagnostics and log extraction via ${scenario.evaluatedSkill}`,
      `Communicated structured recovery actions without panic`,
      `Proposed concrete CI/CD safeguards to prevent regression`
    ],
    areasForImprovement: [
      `Could explicitly specify Kubernetes/Docker container exit code definitions (e.g. 137 vs 143)`,
      `Include proactive stakeholder status broadcasting during downtime window`
    ],
    skillInsights: [
      `Demonstrated intermediate-to-advanced grasp of ${scenario.evaluatedSkill} runtime behavior`,
      `Strong foundational readiness for junior-to-mid ${scenario.targetRole} incident handling`,
      `Verified practical diagnostic mindset required by 78%+ of regional employer postings`
    ],
    recommendedAction: `Complete Stage 2 Hands-on Docker Module to solidify container healthcheck automation.`,
    roadmapSkillToUpdate: scenario.evaluatedSkill
  };
  if (!ai || transcript.length < 2) {
    return fallbackEval;
  }
  try {
    const formattedTranscript = transcript.map((t) => `${t.role.toUpperCase()}: ${t.text}`).join("\n\n");
    const prompt = `You are the Chief Industry Demand Evaluator for the Smart India Hackathon SkillSetu platform.
Evaluate this student's performance in a realistic workplace/interview simulation.

SCENARIO:
Title: ${scenario.title}
Target Role: ${scenario.targetRole}
Evaluated Skill: ${scenario.evaluatedSkill}
Objectives: ${scenario.objectives.join("; ")}

TRANSCRIPT:
${formattedTranscript}

Evaluate honestly on:
- technicalAccuracy (0-100)
- problemSolving (0-100)
- communication (0-100)
- composureUnderPressure (0-100)

Return ONLY a JSON object:
{
  "overallScore": 85,
  "verdict": "Clear 1-sentence verdict on workplace readiness",
  "rubricScores": {
    "technicalAccuracy": 85,
    "problemSolving": 80,
    "communication": 90,
    "composureUnderPressure": 85
  },
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForImprovement": ["Area 1", "Area 2"],
  "skillInsights": ["Insight 1", "Insight 2"],
  "recommendedAction": "Actionable next step recommendation",
  "roadmapSkillToUpdate": "${scenario.evaluatedSkill}"
}`;
    const res = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    if (res.text) {
      const parsed = JSON.parse(res.text);
      return {
        overallScore: parsed.overallScore || 82,
        verdict: parsed.verdict || fallbackEval.verdict,
        rubricScores: parsed.rubricScores || fallbackEval.rubricScores,
        strengths: parsed.strengths || fallbackEval.strengths,
        areasForImprovement: parsed.areasForImprovement || fallbackEval.areasForImprovement,
        skillInsights: parsed.skillInsights || fallbackEval.skillInsights,
        recommendedAction: parsed.recommendedAction || fallbackEval.recommendedAction,
        roadmapSkillToUpdate: parsed.roadmapSkillToUpdate || scenario.evaluatedSkill
      };
    }
  } catch (err) {
    console.warn("Evaluation fallback:", err);
  }
  return fallbackEval;
}

// backend/api/student.ts
var studentRouter = Router2();
function getActiveProfile(req) {
  let profile = db.studentProfiles.get("usr-student-1");
  if (!profile) {
    profile = Array.from(db.studentProfiles.values())[0];
  }
  return profile;
}
function buildStudentDashboardData(profile) {
  const allJobs = db.getAllJobs();
  const studentSkillMap = new Map(profile.skills.map((s) => [s.skillId, s]));
  const hasResume = Boolean(profile.resumeText && profile.resumeText.length > 30);
  const hasEducation = Boolean(profile.education && profile.education.trim().length > 0);
  const hasSkills = Boolean(profile.skills && profile.skills.length >= 3);
  const hasTargetRole = Boolean(profile.targetRole && profile.targetRole.trim().length > 0);
  let calculatedCompleteness = 0;
  if (hasResume) calculatedCompleteness += 25;
  if (hasEducation) calculatedCompleteness += 20;
  if (hasSkills) calculatedCompleteness += 30;
  if (hasTargetRole) calculatedCompleteness += 10;
  if (profile.bio) calculatedCompleteness += 15;
  const completenessPct = Math.min(100, Math.max(calculatedCompleteness, profile.profileCompletionPct || 85));
  let verifiedCount = 0;
  let unverifiedCount = 0;
  let selfReportedCount = 0;
  let resumeExtractedCount = 0;
  for (const s of profile.skills) {
    if (s.verified) {
      verifiedCount++;
    } else {
      unverifiedCount++;
    }
    if (s.source === "SELF") selfReportedCount++;
    else if (s.source === "RESUME") resumeExtractedCount++;
  }
  const verificationStatus = verifiedCount >= 3 ? "SKILLS_VERIFIED" : verifiedCount > 0 || hasResume ? "PROFILE_ANALYSED" : "PENDING_VERIFICATION";
  const verificationBadgeText = verifiedCount >= 3 ? `Skills Verified (${verifiedCount}/${profile.skills.length})` : verifiedCount > 0 ? `Profile Analysed (${verifiedCount} Verified)` : "Profile Analysed";
  const targetRoleLower = (profile.targetRole || "DevOps / Cloud Engineer").toLowerCase();
  const relevantJobs = allJobs.filter(
    (j) => j.roleCategory.toLowerCase().includes(targetRoleLower) || targetRoleLower.includes(j.roleCategory.toLowerCase()) || j.title.toLowerCase().includes("cloud") || j.title.toLowerCase().includes("devops")
  );
  const benchmarkJobs = relevantJobs.length > 0 ? relevantJobs : allJobs.slice(0, 3);
  const marketReqFrequency = /* @__PURE__ */ new Map();
  for (const job of benchmarkJobs) {
    for (const js of job.skills) {
      const prev = marketReqFrequency.get(js.skillId) || { count: 0, requiredCount: 0, maxMinProficiency: "BEGINNER" };
      prev.count += 1;
      if (js.isRequired) prev.requiredCount += 1;
      if (js.minProficiency === "ADVANCED" || js.minProficiency === "INTERMEDIATE" && prev.maxMinProficiency === "BEGINNER") {
        prev.maxMinProficiency = js.minProficiency;
      }
      marketReqFrequency.set(js.skillId, prev);
    }
  }
  const primaryJob = benchmarkJobs[0] || allJobs[0];
  const primaryJobMatch = matchingEngine.matchStudentToJob(profile, primaryJob);
  const targetRequiredSkillIds = /* @__PURE__ */ new Set();
  for (const job of benchmarkJobs) {
    for (const js of job.skills) {
      if (js.isRequired) targetRequiredSkillIds.add(js.skillId);
    }
  }
  let matchedRequiredSkillsCount = 0;
  targetRequiredSkillIds.forEach((skillId) => {
    if (studentSkillMap.has(skillId)) matchedRequiredSkillsCount++;
  });
  const totalTargetRequiredSkills = Math.max(targetRequiredSkillIds.size, 10);
  const comparisonSkillIds = ["sk-linux", "sk-git", "sk-python", "sk-docker", "sk-aws", "sk-k8s", "sk-terraform", "sk-ci-cd"];
  const marketAlignmentList = comparisonSkillIds.map((skillId) => {
    const skillObj = db.getSkillById(skillId);
    const studentSkill = studentSkillMap.get(skillId);
    const benchmarkData = marketReqFrequency.get(skillId);
    const isCovered = Boolean(studentSkill);
    const yourLevel = studentSkill ? studentSkill.proficiency : "Not detected";
    const requiredLevel = benchmarkData ? benchmarkData.maxMinProficiency : "Intermediate";
    const marketDemand = skillObj?.marketDemandLevel || "HIGH";
    const isGap = !isCovered;
    let priority = "LOW";
    if (isGap) {
      if ((skillId === "sk-docker" || skillId === "sk-aws") && marketDemand === "HIGH") {
        priority = "HIGH";
      } else if (skillId === "sk-k8s" || skillId === "sk-ci-cd") {
        priority = "MEDIUM";
      } else {
        priority = "LOW";
      }
    }
    let dataTrustState = "NOT_DETECTED";
    if (studentSkill) {
      if (studentSkill.verified) dataTrustState = "VERIFIED";
      else if (studentSkill.source === "SELF") dataTrustState = "SELF-REPORTED";
      else dataTrustState = "ANALYSED";
    }
    return {
      skillId,
      skillName: skillObj?.canonicalName || skillId,
      category: skillObj?.category || "Cloud & DevOps",
      yourLevel: yourLevel === "Not detected" ? "Not detected" : yourLevel.charAt(0) + yourLevel.slice(1).toLowerCase(),
      requiredLevel: requiredLevel.charAt(0) + requiredLevel.slice(1).toLowerCase(),
      marketDemand: marketDemand === "HIGH" ? "High" : marketDemand === "MEDIUM" ? "Medium" : "Low",
      status: isCovered ? "Covered" : "Gap",
      isCovered,
      isGap,
      priority,
      dataTrustState,
      verified: Boolean(studentSkill?.verified),
      source: studentSkill?.source || "NONE",
      frequencyInTargetJobsPct: benchmarkData ? Math.round(benchmarkData.count / benchmarkJobs.length * 100) : 40,
      description: skillObj?.description || "",
      averageSalaryBumpPct: skillObj?.averageSalaryBumpPct || 20
    };
  });
  const criticalGapsList = marketAlignmentList.filter((s) => s.isGap);
  const highPriorityGaps = marketAlignmentList.filter((s) => s.isGap && s.priority === "HIGH");
  const whyThisGapMatters = {
    primarySkill: {
      skillId: "sk-docker",
      skillName: "Docker",
      marketDemand: "HIGH",
      yourProfile: "Not detected",
      reason: "Docker is frequently associated with the selected DevOps / Cloud Engineer role in the analysed job dataset.",
      evidence: {
        analysedRecordsCount: 184500,
        devopsRolesCount: 12400,
        skillFrequencyPct: 78,
        relevantJobRoles: [
          "Associate DevOps Engineer",
          "Cloud Systems Engineer",
          "Site Reliability Engineer",
          "Junior Cloud Engineer"
        ],
        dataSource: "Demo Dataset - SIH Sample",
        analysisPeriod: "Q1 2026",
        sampleNotes: "Calculated from 12,400 curated entry-to-mid cloud & infrastructure openings in the SIH benchmark corpus."
      }
    }
  };
  const priorityMatrix = {
    high: ["Docker", "AWS"],
    medium: ["Kubernetes", "CI/CD Pipelines"],
    low: ["Terraform"],
    logicExplanation: "Priority is calculated deterministically combining market demand weight (High=3, Med=2, Low=1), target-role relevance (Mandatory=3, Preferred=2), and candidate profile deficit (Missing=3, Weak=2, Satisfied=0)."
  };
  const recommendedSkillPath = {
    currentProfile: [
      { name: "Linux", status: "Covered", verified: true, level: "Intermediate", stage: "Stage 1: OS Foundations", source: "RESUME" },
      { name: "Git", status: "Covered", verified: true, level: "Advanced", stage: "Stage 1: Version Control", source: "ASSESSMENT" },
      { name: "Python", status: "Covered", verified: true, level: "Intermediate", stage: "Stage 1: Automation Scripting", source: "RESUME" }
    ],
    priorityGaps: [
      { name: "Docker", status: "Priority Gap", requiredLevel: "Intermediate", priority: "HIGH", stage: "Stage 2: Containerization", timeline: "Week 1-3" },
      { name: "AWS", status: "Priority Gap", requiredLevel: "Intermediate", priority: "HIGH", stage: "Stage 2: Cloud Infrastructure", timeline: "Week 4-6" },
      { name: "Kubernetes", status: "Secondary Gap", requiredLevel: "Beginner", priority: "MEDIUM", stage: "Stage 3: Orchestration", timeline: "Week 7-9" }
    ],
    targetRole: profile.targetRole || "DevOps / Cloud Engineer",
    disclaimer: "Curriculum path is based on aggregate job role specifications. Completion does not guarantee employment or placement."
  };
  const recommendedAction = {
    title: "Recommended Action",
    statement: `Your highest-priority gaps for ${profile.targetRole || "DevOps / Cloud Engineer"} are Docker and AWS. Building proficiency in these skills would address two of your current market-alignment gaps.`,
    primarySkill: "Docker",
    secondarySkill: "AWS",
    primaryActionLabel: "Start Docker Roadmap",
    secondaryActionLabel: "Explore AWS"
  };
  const skillDemandTrend = {
    label: "Illustrative Demo Data",
    isDemoData: true,
    description: "Quarterly demand index across Indian tech hubs (Index: 0-100). Illustrative sample data.",
    data: [
      { period: "2025 Q1", Docker: 64, AWS: 72, Kubernetes: 46, Python: 82, Linux: 75 },
      { period: "2025 Q2", Docker: 69, AWS: 76, Kubernetes: 51, Python: 84, Linux: 78 },
      { period: "2025 Q3", Docker: 74, AWS: 80, Kubernetes: 56, Python: 87, Linux: 80 },
      { period: "2025 Q4", Docker: 78, AWS: 84, Kubernetes: 61, Python: 89, Linux: 82 },
      { period: "2026 Q1", Docker: 82, AWS: 88, Kubernetes: 66, Python: 91, Linux: 85 }
    ]
  };
  const matchedJobs = allJobs.map((job) => matchingEngine.matchStudentToJob(profile, job));
  matchedJobs.sort((a, b) => b.overallMatchPct - a.overallMatchPct);
  const topMatchedRoles = matchedJobs.slice(0, 4).map((m) => ({
    jobId: m.job.id,
    title: m.job.title,
    employerName: m.job.employerName,
    matchPct: m.overallMatchPct,
    location: `${m.job.locationCity}, ${m.job.locationState}`,
    experienceMinYears: m.job.experienceMinYears,
    salaryMinLPA: m.job.salaryMinLPA,
    salaryMaxLPA: m.job.salaryMaxLPA,
    dataSource: m.job.dataSource,
    matchedSkills: m.strongSkills.map((s) => s.skill.canonicalName),
    missingSkills: m.missingSkills.map((s) => s.skill.canonicalName),
    matchedCount: m.matchedSkillsCount,
    totalRequired: m.totalRequiredCount
  }));
  return {
    profile: {
      id: profile.id,
      userId: profile.userId,
      targetRole: profile.targetRole,
      preferredLocation: profile.preferredLocation,
      education: profile.education,
      experienceLevel: profile.experienceLevel,
      bio: profile.bio,
      resumeFileName: profile.resumeFileName,
      resumeData: profile.resumeData,
      possibleRoles: profile.possibleRoles || [],
      profileCompleteness: {
        pct: completenessPct,
        breakdown: {
          resume: hasResume,
          education: hasEducation,
          skills: hasSkills,
          targetRole: hasTargetRole
        }
      },
      verificationStatus,
      verificationBadgeText,
      verifiedSkillsCount: verifiedCount,
      unverifiedSkillsCount: unverifiedCount,
      totalSkillsCount: profile.skills.length,
      skills: profile.skills.map((s) => {
        const sk = db.getSkillById(s.skillId);
        return {
          ...s,
          skillName: sk?.canonicalName || s.skillId,
          category: sk?.category || "General",
          marketDemand: sk?.marketDemandLevel || "HIGH"
        };
      })
    },
    targetRoleMatch: {
      role: profile.targetRole || "DevOps / Cloud Engineer",
      matchPct: primaryJobMatch.overallMatchPct || 48,
      matchedSkillsCount: matchedRequiredSkillsCount,
      totalRequiredSkills: totalTargetRequiredSkills,
      explanation: `${matchedRequiredSkillsCount} / ${totalTargetRequiredSkills} required skills matched`
    },
    criticalSkillGaps: {
      count: criticalGapsList.length,
      targetRole: profile.targetRole || "DevOps / Cloud Engineer",
      items: criticalGapsList
    },
    marketAlignment: {
      title: "MARKET ALIGNMENT",
      subtitle: "How your current skills compare with skills currently required for your target role.",
      items: marketAlignmentList,
      whyThisGapMatters,
      priorityMatrix
    },
    recommendedSkillPath,
    recommendedAction,
    skillDemandTrend,
    topMatchedRoles
  };
}
studentRouter.get("/dashboard", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const dashboardData = buildStudentDashboardData(profile);
  res.json(dashboardData);
});
studentRouter.get("/skills", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const skills = profile.skills.map((s) => {
    const skillDetail = db.getSkillById(s.skillId);
    return {
      skillId: s.skillId,
      skillName: skillDetail ? skillDetail.canonicalName : s.skillId,
      category: skillDetail?.category || "General",
      proficiency: s.proficiency,
      verified: s.verified,
      source: s.source,
      // 'RESUME' | 'ASSESSMENT' | 'SELF'
      dataTrustState: s.verified ? "VERIFIED" : s.source === "SELF" ? "SELF-REPORTED" : "ANALYSED",
      marketDemand: skillDetail?.marketDemandLevel || "HIGH",
      lastEvaluated: s.lastEvaluated,
      description: skillDetail?.description || ""
    };
  });
  res.json({
    skills,
    verifiedCount: skills.filter((s) => s.verified).length,
    totalCount: skills.length
  });
});
studentRouter.get("/market-alignment", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const dashboardData = buildStudentDashboardData(profile);
  res.json({
    targetRole: profile.targetRole,
    marketAlignment: dashboardData.marketAlignment,
    recommendedSkillPath: dashboardData.recommendedSkillPath
  });
});
studentRouter.get("/skill-trends", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const dashboardData = buildStudentDashboardData(profile);
  res.json(dashboardData.skillDemandTrend);
});
studentRouter.get("/skill-detail/:skillId", (req, res) => {
  const profile = getActiveProfile(req);
  const skillId = req.params.skillId;
  const skillObj = db.getSkillById(skillId);
  if (!skillObj) {
    res.status(404).json({ error: "Skill not found in taxonomy." });
    return;
  }
  const studentSkill = profile?.skills.find((s) => s.skillId === skillId);
  const allJobs = db.getAllJobs();
  const jobsRequiringSkill = allJobs.filter((j) => j.skills.some((js) => js.skillId === skillId));
  const detail = {
    skillId: skillObj.id,
    skillName: skillObj.canonicalName,
    category: skillObj.category,
    description: skillObj.description,
    marketDemand: skillObj.marketDemandLevel,
    averageSalaryBumpPct: skillObj.averageSalaryBumpPct,
    currentLevel: studentSkill ? studentSkill.proficiency : "Not detected",
    requiredLevel: "Intermediate",
    verified: Boolean(studentSkill?.verified),
    source: studentSkill?.source || "NONE",
    dataTrustState: studentSkill ? studentSkill.verified ? "VERIFIED" : studentSkill.source === "SELF" ? "SELF-REPORTED" : "ANALYSED" : "NOT_DETECTED",
    whyItMatters: `${skillObj.canonicalName} is required by ${jobsRequiringSkill.length} of our benchmark target postings with average salary upside of ~${skillObj.averageSalaryBumpPct}%.`,
    relatedRoles: jobsRequiringSkill.map((j) => j.title).slice(0, 4),
    recommendedLearning: [
      `Hands-on lab modules for ${skillObj.canonicalName}`,
      `Verified Skill Assessment for ${skillObj.canonicalName} Badge`,
      `Practical project deployment with GitHub documentation`
    ],
    evidence: {
      analysedRecordsCount: 184500,
      skillFrequencyPct: skillObj.marketDemandLevel === "HIGH" ? 78 : 45,
      dataSource: "Demo Dataset - SIH Sample",
      analysisPeriod: "Q1 2026"
    }
  };
  res.json(detail);
});
studentRouter.get("/profile", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const enrichedSkills = profile.skills.map((s) => {
    const skillDetail = db.getSkillById(s.skillId);
    return {
      ...s,
      skillName: skillDetail ? skillDetail.canonicalName : s.skillId,
      category: skillDetail?.category || "General",
      marketDemand: skillDetail?.marketDemandLevel || "HIGH"
    };
  });
  const gapAnalysis = matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole);
  res.json({
    profile: {
      ...profile,
      skills: enrichedSkills
    },
    gapAnalysis
  });
});
studentRouter.put("/profile", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const { targetRole, preferredLocation, experienceLevel, education, bio } = req.body;
  if (targetRole) profile.targetRole = targetRole;
  if (preferredLocation) profile.preferredLocation = preferredLocation;
  if (experienceLevel) profile.experienceLevel = experienceLevel;
  if (education) profile.education = education;
  if (bio) profile.bio = bio;
  let completion = 50;
  if (profile.education) completion += 15;
  if (profile.skills.length >= 3) completion += 20;
  if (profile.resumeText) completion += 15;
  profile.profileCompletionPct = Math.min(100, completion);
  db.saveStudentProfile(profile);
  res.json({
    message: "Profile updated successfully.",
    profile
  });
});
studentRouter.post("/resume/upload", async (req, res) => {
  try {
    const profile = getActiveProfile(req);
    if (!profile) {
      res.status(404).json({ error: "Profile not found." });
      return;
    }
    const { resumeText, base64Pdf, fileName } = req.body;
    if (!resumeText && !base64Pdf) {
      res.status(400).json({ error: "Please provide resumeText or base64Pdf data." });
      return;
    }
    const analysis = await skillExtractor.analyzeResume({
      resumeText: typeof resumeText === "string" ? resumeText : void 0,
      base64Pdf: typeof base64Pdf === "string" ? base64Pdf : void 0
    });
    const parsed = analysis.parsedResume;
    profile.resumeFileName = fileName || "Uploaded_Resume.pdf";
    profile.resumeData = parsed;
    profile.possibleRoles = parsed.possibleRoles || [];
    if (analysis.extractedText) {
      profile.resumeText = analysis.extractedText;
    } else if (resumeText) {
      profile.resumeText = resumeText;
    } else if (parsed.summary) {
      profile.resumeText = parsed.summary;
    }
    if (parsed.candidate?.name && parsed.candidate.name.trim().length > 1) {
      const user = db.getUserById(profile.userId);
      if (user && (!user.name || user.name === "Student Candidate" || user.name === "Default Student")) {
        user.name = parsed.candidate.name.trim();
        db.users.set(user.id, user);
      }
    }
    if (parsed.education && parsed.education.length > 0 && (!profile.education || profile.education.trim().length === 0)) {
      profile.education = parsed.education.map((e) => `${e.degree || "Degree"}${e.institution ? ` from ${e.institution}` : ""}${e.year ? ` (${e.year})` : ""}`).join("; ");
    }
    if (parsed.summary && (!profile.bio || profile.bio.trim().length === 0)) {
      profile.bio = parsed.summary;
    }
    const existingSkillMap = new Map(profile.skills.map((s) => [s.skillId, s]));
    const newlyAddedSkills = [];
    for (const skill of analysis.normalizedSkills) {
      if (!existingSkillMap.has(skill.id)) {
        const newStudentSkill = {
          skillId: skill.id,
          proficiency: "INTERMEDIATE",
          verified: false,
          source: "RESUME",
          lastEvaluated: (/* @__PURE__ */ new Date()).toISOString()
        };
        profile.skills.push(newStudentSkill);
        existingSkillMap.set(skill.id, newStudentSkill);
        newlyAddedSkills.push(newStudentSkill);
      }
    }
    let completeness = 0;
    if (profile.resumeText || profile.resumeData) completeness += 25;
    if (profile.education) completeness += 20;
    if (profile.skills.length >= 3) completeness += 30;
    if (profile.targetRole) completeness += 15;
    if (profile.preferredLocation) completeness += 10;
    profile.profileCompletionPct = Math.min(100, Math.max(completeness, profile.profileCompletionPct));
    db.saveStudentProfile(profile);
    const roleGaps = matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole);
    const allJobs = db.getAllJobs();
    const matchedJobs = allJobs.map((job) => matchingEngine.matchStudentToJob(profile, job));
    matchedJobs.sort((a, b) => b.overallMatchPct - a.overallMatchPct);
    res.json({
      message: "Resume analyzed successfully",
      parsedResume: parsed,
      normalizedSkills: analysis.normalizedSkills,
      newlyAddedCount: newlyAddedSkills.length,
      currentSkillsCount: profile.skills.length,
      provider: analysis.provider,
      modelUsed: analysis.modelUsed,
      fallbackUsed: analysis.fallbackUsed,
      roleGaps,
      jobMatches: matchedJobs.slice(0, 5)
    });
  } catch (err) {
    console.error("[Resume Upload API] Error:", err);
    res.status(500).json({ error: err.message || "Resume parsing failed." });
  }
});
studentRouter.get("/skill-gaps", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const roleGaps = matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole);
  res.json({
    roleGaps,
    targetRole: profile.targetRole,
    studentSkillsCount: profile.skills.length,
    dataSource: "SAMPLE BENCHMARK - Aggregated from Indian Tech Roles"
  });
});
studentRouter.get("/jobs/match", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const allJobs = db.getAllJobs();
  const matchedJobs = allJobs.map((job) => matchingEngine.matchStudentToJob(profile, job));
  matchedJobs.sort((a, b) => b.overallMatchPct - a.overallMatchPct);
  res.json({
    matches: matchedJobs,
    studentTargetRole: profile.targetRole
  });
});
studentRouter.get("/roadmap", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const roadmapStages = [
    {
      id: "stage-1",
      title: "Foundation: Operating Systems & Networking",
      level: "BEGINNER",
      modules: [
        { id: "mod-linux-sys", title: "Linux Administration, File Permissions & Shell Scripting", skill: "Linux", estimatedHours: 18, isCompleted: true },
        { id: "mod-git-branching", title: "Git Branching Strategies & Conventional Commits", skill: "Git", estimatedHours: 8, isCompleted: true },
        { id: "mod-networking", title: "TCP/IP, HTTP/HTTPS Protocols & DNS Resolution", skill: "Linux", estimatedHours: 12, isCompleted: true }
      ]
    },
    {
      id: "stage-2",
      title: "Intermediate: Containerization & Cloud Fundamentals",
      level: "INTERMEDIATE",
      modules: [
        {
          id: "mod-docker-basics",
          title: "Dockerfiles, Layer Caching & Multi-Stage Production Builds",
          skill: "Docker",
          estimatedHours: 20,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-docker-basics"])
        },
        {
          id: "mod-docker-compose",
          title: "Multi-Container Microservices with Docker Compose",
          skill: "Docker",
          estimatedHours: 14,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-docker-compose"])
        },
        {
          id: "mod-aws-core",
          title: "AWS VPCs, Subnets, EC2 Instance Profiles & IAM Roles",
          skill: "AWS",
          estimatedHours: 24,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-aws-core"])
        }
      ]
    },
    {
      id: "stage-3",
      title: "Advanced: Container Orchestration & Infrastructure as Code",
      level: "ADVANCED",
      modules: [
        {
          id: "mod-k8s-pods",
          title: "Kubernetes Pods, ReplicaSets, Deployments & Service Ingress",
          skill: "Kubernetes",
          estimatedHours: 28,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-k8s-pods"])
        },
        {
          id: "mod-terraform-iac",
          title: "Terraform State Management, Providers & Reusable Cloud Modules",
          skill: "Terraform",
          estimatedHours: 20,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-terraform-iac"])
        },
        {
          id: "mod-ci-cd-pipelines",
          title: "GitHub Actions Matrix Workflows & Automated ECR/EKS Deployments",
          skill: "CI/CD Pipelines",
          estimatedHours: 16,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-ci-cd-pipelines"])
        }
      ]
    },
    {
      id: "stage-4",
      title: "Production Capstone & Assessment",
      level: "CAPSTONE",
      modules: [
        {
          id: "mod-capstone-deploy",
          title: "Deploy Scalable Microservices with Observability (Prometheus/Grafana)",
          skill: "DevOps / Cloud Engineer",
          estimatedHours: 35,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-capstone-deploy"])
        },
        {
          id: "mod-assessment-verify",
          title: "Pass Verified Docker & AWS Skill Assessments to earn Badge",
          skill: "Docker",
          estimatedHours: 4,
          isCompleted: Boolean(profile.savedRoadmapProgress?.["mod-assessment-verify"])
        }
      ]
    }
  ];
  let totalModules = 0;
  let completedModules = 0;
  for (const st of roadmapStages) {
    for (const m of st.modules) {
      totalModules++;
      if (m.isCompleted) completedModules++;
    }
  }
  res.json({
    stages: roadmapStages,
    progressPct: Math.round(completedModules / totalModules * 100),
    totalModules,
    completedModules
  });
});
studentRouter.post("/roadmap/progress", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const { moduleId, isCompleted } = req.body;
  if (!moduleId) {
    res.status(400).json({ error: "Missing moduleId." });
    return;
  }
  if (!profile.savedRoadmapProgress) {
    profile.savedRoadmapProgress = {};
  }
  profile.savedRoadmapProgress[moduleId] = Boolean(isCompleted);
  db.saveStudentProfile(profile);
  res.json({
    message: "Roadmap progress updated.",
    savedProgress: profile.savedRoadmapProgress
  });
});
studentRouter.get("/assessments", (req, res) => {
  const profile = getActiveProfile(req);
  const assessments = db.getAllAssessments();
  const results = profile ? db.getAssessmentResultsForStudent(profile.id) : [];
  const enriched = assessments.map((a) => {
    const existingResult = results.find((r) => r.assessmentId === a.id);
    return {
      id: a.id,
      skillId: a.skillId,
      skillName: a.skillName,
      title: a.title,
      durationMinutes: a.durationMinutes,
      questionsCount: a.questions.length,
      hasAttempted: Boolean(existingResult),
      lastScore: existingResult?.score,
      passed: existingResult?.passed || false
    };
  });
  res.json({ assessments: enriched });
});
studentRouter.get("/assessments/:id", (req, res) => {
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found." });
    return;
  }
  const sanitizedQuestions = assessment.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
  res.json({
    id: assessment.id,
    skillId: assessment.skillId,
    skillName: assessment.skillName,
    title: assessment.title,
    durationMinutes: assessment.durationMinutes,
    questions: sanitizedQuestions
  });
});
studentRouter.post("/assessments/:id/submit", (req, res) => {
  const profile = getActiveProfile(req);
  if (!profile) {
    res.status(404).json({ error: "Profile not found." });
    return;
  }
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found." });
    return;
  }
  const { answers } = req.body;
  if (!answers || typeof answers !== "object") {
    res.status(400).json({ error: "Answers must be provided." });
    return;
  }
  let correctCount = 0;
  const questionFeedback = [];
  for (const q of assessment.questions) {
    const userSelected = answers[q.id];
    const isCorrect = userSelected === q.correctOptionIndex;
    if (isCorrect) correctCount++;
    questionFeedback.push({
      questionId: q.id,
      question: q.question,
      userSelected,
      correctOptionIndex: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation
    });
  }
  const scorePct = Math.round(correctCount / assessment.questions.length * 100);
  const passed = scorePct >= 66;
  const result = {
    id: `res-${Date.now()}`,
    studentId: profile.id,
    assessmentId: assessment.id,
    skillId: assessment.skillId,
    score: scorePct,
    total: 100,
    passed,
    evaluatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.addAssessmentResult(result);
  if (passed) {
    const existingSkill = profile.skills.find((s) => s.skillId === assessment.skillId);
    if (existingSkill) {
      existingSkill.verified = true;
      existingSkill.source = "ASSESSMENT";
      existingSkill.proficiency = "INTERMEDIATE";
      existingSkill.lastEvaluated = (/* @__PURE__ */ new Date()).toISOString();
    } else {
      profile.skills.push({
        skillId: assessment.skillId,
        proficiency: "INTERMEDIATE",
        verified: true,
        source: "ASSESSMENT",
        lastEvaluated: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    db.saveStudentProfile(profile);
  }
  res.json({
    result,
    passed,
    scorePct,
    correctCount,
    totalQuestions: assessment.questions.length,
    questionFeedback,
    verifiedSkillUpdated: passed
  });
});
studentRouter.post("/copilot", async (req, res) => {
  try {
    const profile = getActiveProfile(req);
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Query text is required." });
      return;
    }
    const currentSkillNames = (profile?.skills || []).map((s) => {
      const sk = db.getSkillById(s.skillId);
      return sk ? sk.canonicalName : s.skillId;
    });
    const gapEval = profile ? matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole) : null;
    const missingSkills = (gapEval?.marketSkillsNeeded || []).filter((m) => m.isMissing).map((m) => m.skill.canonicalName);
    const targetJobs = db.getAllJobs().slice(0, 3).map((j) => `${j.title} at ${j.employerName}`);
    const context = {
      name: profile?.userId || "Student Candidate",
      targetRole: profile?.targetRole || "Software / Cloud Engineer",
      currentSkills: currentSkillNames,
      missingSkills,
      targetJobs,
      topRegionalOpenings: 32e3
    };
    const copilotResult = await askCareerCopilotWithGemini(query, context);
    res.json({
      query,
      answer: copilotResult.answer,
      reply: copilotResult.answer,
      provider: copilotResult.provider,
      modelUsed: copilotResult.modelUsed,
      fallbackUsed: copilotResult.provider === "deterministic",
      groundedContext: {
        targetRole: context.targetRole,
        evaluatedMissingSkills: missingSkills,
        modelUsed: copilotResult.modelUsed,
        provider: copilotResult.provider
      }
    });
  } catch (err) {
    const profile = getActiveProfile(req);
    const fallbackAnswer = getDeterministicCopilotAnswer(req.body?.query || "", {
      name: profile?.userId || "Student Candidate",
      targetRole: profile?.targetRole || "Software / Cloud Engineer",
      currentSkills: (profile?.skills || []).map((s) => s.skillId),
      missingSkills: ["Docker", "AWS"],
      targetJobs: [],
      topRegionalOpenings: 32e3
    });
    res.json({
      query: req.body?.query || "",
      answer: fallbackAnswer,
      reply: fallbackAnswer,
      provider: "deterministic",
      modelUsed: "SkillSetu Deterministic Engine",
      fallbackUsed: true,
      groundedContext: {
        targetRole: profile?.targetRole || "Software / Cloud Engineer",
        evaluatedMissingSkills: ["Docker", "AWS"],
        modelUsed: "SkillSetu Deterministic Engine",
        provider: "deterministic"
      }
    });
  }
});
studentRouter.post("/simulator/scenario", async (req, res) => {
  try {
    const profile = getActiveProfile(req);
    const { promptRequest, category } = req.body;
    const gapEval = profile ? matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole) : null;
    const skillGaps = (gapEval?.marketSkillsNeeded || []).filter((m) => m.isMissing).map((m) => m.skill.canonicalName);
    const targetRole = profile?.targetRole || "DevOps / Cloud Engineer";
    const scenario = await generateSimulatorScenarioWithGemini({
      targetRole,
      skillGaps: skillGaps.length ? skillGaps : ["Docker", "AWS", "Kubernetes"],
      promptRequest,
      category
    });
    res.json({ scenario });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to generate simulation scenario" });
  }
});
studentRouter.post("/simulator/turn", async (req, res) => {
  try {
    const { scenario, history, userMessage } = req.body;
    if (!scenario || !userMessage) {
      res.status(400).json({ error: "scenario and userMessage are required." });
      return;
    }
    const turnResult = await simulatorTurnWithGemini(scenario, history || [], userMessage);
    res.json(turnResult);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process simulator turn" });
  }
});
studentRouter.post("/simulator/evaluate", async (req, res) => {
  try {
    const { scenario, transcript } = req.body;
    if (!scenario || !transcript) {
      res.status(400).json({ error: "scenario and transcript are required." });
      return;
    }
    const evaluation = await evaluateSimulationWithGemini(scenario, transcript);
    const profile = getActiveProfile(req);
    if (profile && evaluation.overallScore >= 70) {
      profile.profileCompletionPct = Math.min(100, (profile.profileCompletionPct || 85) + 3);
      db.saveStudentProfile(profile);
    }
    res.json({ evaluation });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to evaluate simulation" });
  }
});

// backend/api/institute.ts
init_store();
import { Router as Router3 } from "express";

// backend/services/curriculumEngine.ts
init_store();
var CurriculumEngineService = class {
  /**
   * Deterministically audit a curriculum syllabus against the benchmark of industrial skills.
   */
  auditCurriculum(curriculum, courseTitle) {
    const coveredSkillMap = new Map(
      curriculum.skills.map((s) => [s.skillId, s])
    );
    const benchmarkSkills = db.getAllSkills();
    const comparisonTable = [];
    let coveredWeightSum = 0;
    let totalBenchmarkWeightSum = 0;
    let coveredCount = 0;
    let missingHighDemandCount = 0;
    const highDemandLowSupply = [];
    const highDemandHighSupply = [];
    const lowDemandHighSupply = [];
    for (const skill of benchmarkSkills) {
      const demandWeight = skill.marketDemandLevel === "HIGH" ? 3 : skill.marketDemandLevel === "MEDIUM" ? 2 : 1;
      totalBenchmarkWeightSum += demandWeight;
      const coverage = coveredSkillMap.get(skill.id);
      const isCovered = Boolean(coverage);
      const openings = db.stateDemands.filter((sd) => sd.skillId === skill.id).reduce((acc, curr) => acc + curr.openingsCount, 0) || (skill.marketDemandLevel === "HIGH" ? 24e3 : 8e3);
      const matchingDemands = db.stateDemands.filter((sd) => sd.skillId === skill.id);
      const avgSupply = matchingDemands.length > 0 ? matchingDemands.reduce((a, b) => a + b.supplyIndex, 0) / matchingDemands.length : 40;
      if (skill.marketDemandLevel === "HIGH" && avgSupply < 45) {
        highDemandLowSupply.push(skill.canonicalName);
      } else if (skill.marketDemandLevel === "HIGH" && avgSupply >= 45) {
        highDemandHighSupply.push(skill.canonicalName);
      } else if (skill.marketDemandLevel !== "HIGH" && avgSupply >= 70) {
        lowDemandHighSupply.push(skill.canonicalName);
      }
      let status = "MISSING";
      let urgency = "LOW";
      if (isCovered && coverage) {
        status = coverage.coverageDepth === "CONCEPTUAL" ? "PARTIAL" : "COVERED";
        const multiplier = coverage.coverageDepth === "PRACTICAL" || coverage.coverageDepth === "CAPSTONE" ? 1 : 0.6;
        coveredWeightSum += demandWeight * multiplier;
        coveredCount++;
        urgency = "LOW";
      } else {
        status = "MISSING";
        if (skill.marketDemandLevel === "HIGH") {
          missingHighDemandCount++;
          urgency = "CRITICAL";
        } else if (skill.marketDemandLevel === "MEDIUM") {
          urgency = "MODERATE";
        }
      }
      comparisonTable.push({
        skill,
        marketDemand: skill.marketDemandLevel,
        openingsInIndia: openings,
        coverageStatus: status,
        coverageDepth: coverage?.coverageDepth,
        semesterTaught: coverage?.semesterTaught,
        hoursDedicated: coverage?.hoursDedicated,
        urgency
      });
    }
    comparisonTable.sort((a, b) => {
      const rank = { CRITICAL: 1, HIGH: 2, MODERATE: 3, LOW: 4 };
      return (rank[a.urgency] || 5) - (rank[b.urgency] || 5);
    });
    const alignmentScore = Math.round(coveredWeightSum / Math.max(1, totalBenchmarkWeightSum) * 1e3) / 10;
    const scoreCalculationMethod = `Explainable Weighted Alignment: Score = (\u2211 CoveredSkills \xD7 DepthWeight \xD7 DemandMultiplier) / (\u2211 TotalBenchmarkDemand) = (${Math.round(coveredWeightSum)} / ${totalBenchmarkWeightSum}) \xD7 100 = ${alignmentScore}%. Covered ${coveredCount}/${benchmarkSkills.length} industry competencies.`;
    const aiCurriculumRecommendations = [
      {
        category: "SKILLS_TO_ADD",
        title: "Introduce Containerization & Cloud Native Architecture (Docker & AWS)",
        details: "Integrate a dedicated 36-hour lab module covering multi-stage Docker builds, Kubernetes pods, and AWS IAM/EC2 hands-on labs.",
        marketEvidence: `Industry reports show 45,000+ open positions in Bengaluru & Pune alone; employer survey shows 92% of hiring managers cite containerization as a critical prerequisite.`
      },
      {
        category: "MODULES_TO_UPDATE",
        title: "Transition Theoretical Cloud Computing to Live Infrastructure as Code (Terraform)",
        details: "Update the existing Cloud Computing elective from legacy OpenStack slides to modern GitOps and Terraform HCL scripting.",
        marketEvidence: `Cloud Systems Engineer positions offer a 24% median salary premium (average \u20B914 LPA vs \u20B99.5 LPA for generic software freshers).`
      },
      {
        category: "TOPICS_TO_REDUCE",
        title: "Deprecate Legacy 8086 Assembly & Desktop XAMPP Local Servers",
        details: "Condense microprocessor 8086 architecture hours from 24h to 8h; reallocate credit hours to distributed microservices and container networking.",
        marketEvidence: `Less than 2% of annual corporate campus recruitment drives evaluate 8086 assembly for software roles; 88% evaluate REST APIs and Linux shell scripting.`
      },
      {
        category: "PRACTICAL_PROJECTS",
        title: "Automated CI/CD Pipeline Capstone with GitHub Actions",
        details: "Require every 6th-semester student team to configure an automated linting, test-runner, and cloud deploy pipeline for their semester project.",
        marketEvidence: `Employers from Razorpay and Swiggy report that 76% of graduates fail simple PR and automated pipeline assessments during probation.`
      },
      {
        category: "CERTIFICATIONS",
        title: "Institutional Subsidy for AWS Certified Cloud Practitioner / SAA-C03",
        details: "Partner with AICTE / AWS Academy to provide 50% subsidized certification vouchers for final-year students.",
        marketEvidence: `Verified industry certifications correlate with a 3.4x higher interview-to-offer conversion rate.`
      }
    ];
    return {
      curriculumId: curriculum.id,
      courseTitle,
      alignmentScore,
      scoreCalculationMethod,
      totalMarketSkillsEvaluated: benchmarkSkills.length,
      coveredMarketSkillsCount: coveredCount,
      missingHighDemandSkillsCount: missingHighDemandCount,
      comparisonTable,
      aiCurriculumRecommendations,
      trainingSupplyVsDemandSummary: {
        highDemandLowSupply,
        highDemandHighSupply,
        lowDemandHighSupply
      }
    };
  }
  /**
   * Parses new syllabus text, extracts skills using regex + Gemini, and saves curriculum.
   */
  async parseAndSaveCurriculum(courseId, syllabusRaw, academicYear) {
    const aiAudit = await analyzeCurriculumWithGemini(syllabusRaw);
    const extracted = skillExtractor.extractFromText(syllabusRaw);
    const skillList = [];
    const recognizedIds = /* @__PURE__ */ new Set();
    for (const item of extracted) {
      if (!recognizedIds.has(item.skill.id)) {
        recognizedIds.add(item.skill.id);
        skillList.push({
          skillId: item.skill.id,
          coverageDepth: "PRACTICAL",
          semesterTaught: 5,
          hoursDedicated: 36
        });
      }
    }
    if (aiAudit && Array.isArray(aiAudit.extractedSkills)) {
      const normalizedAI = skillExtractor.normalizeSkills(aiAudit.extractedSkills);
      for (const n of normalizedAI) {
        if (!recognizedIds.has(n.id)) {
          recognizedIds.add(n.id);
          skillList.push({
            skillId: n.id,
            coverageDepth: "CONCEPTUAL",
            semesterTaught: 6,
            hoursDedicated: 20
          });
        }
      }
    }
    const newCurriculum = {
      id: `cur-${Date.now()}`,
      courseId,
      academicYear,
      syllabusRaw,
      skills: skillList,
      alignmentScore: 0,
      lastAudited: (/* @__PURE__ */ new Date()).toISOString()
    };
    const course = db.courses.get(courseId);
    const report = this.auditCurriculum(newCurriculum, course ? course.title : "Degree Program");
    newCurriculum.alignmentScore = report.alignmentScore;
    db.saveCurriculum(newCurriculum);
    return {
      curriculum: newCurriculum,
      report,
      aiAudit
    };
  }
};
var curriculumEngine = new CurriculumEngineService();

// backend/services/analyticsEngine.ts
init_store();
var AnalyticsEngineService = class {
  /**
   * Identifies all skill shortages and oversupplies mathematically across India.
   */
  getSkillShortagesAndOversupply() {
    const skills = db.getAllSkills();
    const insights = [];
    for (const skill of skills) {
      const records = db.stateDemands.filter((d) => d.skillId === skill.id);
      if (records.length === 0) continue;
      const totalOpenings = records.reduce((acc, r) => acc + r.openingsCount, 0);
      const avgDemand = Math.round(records.reduce((acc, r) => acc + r.demandIndex, 0) / records.length);
      const avgSupply = Math.round(records.reduce((acc, r) => acc + r.supplyIndex, 0) / records.length);
      const avgGapRatio = Math.round(avgDemand / Math.max(1, avgSupply) * 100) / 100;
      let status = "BALANCED";
      if (avgGapRatio >= 2 && avgDemand >= 75) {
        status = "CRITICAL SHORTAGE";
      } else if (avgGapRatio >= 1.4) {
        status = "MODERATE SHORTAGE";
      } else if (avgGapRatio <= 0.95 && avgSupply >= 80) {
        status = "OVERSUPPLY";
      }
      const affectedRoles = [];
      if (skill.category === "Cloud & DevOps") {
        affectedRoles.push("DevOps / Cloud Engineer", "Site Reliability Engineer (SRE)", "Platform Engineer");
      } else if (skill.category === "AI & Data Science") {
        affectedRoles.push("AI/ML Engineer", "Data Scientist", "GenAI Specialist");
      } else if (skill.category === "Backend") {
        affectedRoles.push("Backend Platform Engineer", "Distributed Systems Architect");
      } else if (skill.category === "Cybersecurity") {
        affectedRoles.push("Security Analyst", "DevSecOps Specialist");
      } else {
        affectedRoles.push("Full-Stack Engineer", "Software Engineer");
      }
      const affectedStates = Array.from(new Set(records.map((r) => r.state)));
      insights.push({
        skillId: skill.id,
        skillName: skill.canonicalName,
        category: skill.category,
        demandIndex: avgDemand,
        supplyIndex: avgSupply,
        gapRatio: avgGapRatio,
        totalOpeningsIndia: totalOpenings,
        status,
        affectedRoles,
        affectedStates,
        evidenceSummary: `Recorded ${totalOpenings.toLocaleString()} national postings vs estimated ${avgSupply}% academic lab readiness. Demand-to-supply ratio is ${avgGapRatio}x.`
      });
    }
    return insights.sort((a, b) => b.gapRatio - a.gapRatio);
  }
  /**
   * Aggregates state-level geographic Industry Demand intelligence.
   */
  getStateGeographicAggregates() {
    const statesMap = /* @__PURE__ */ new Map();
    for (const item of db.stateDemands) {
      if (!statesMap.has(item.state)) {
        statesMap.set(item.state, []);
      }
      statesMap.get(item.state).push(item);
    }
    const results = [];
    for (const [state, records] of statesMap.entries()) {
      const totalOpenings = records.reduce((acc, r) => acc + r.openingsCount, 0);
      const avgGap = Math.round(records.reduce((acc, r) => acc + r.gapRatio, 0) / records.length * 100) / 100;
      const sortedRecords = [...records].sort((a, b) => b.openingsCount - a.openingsCount);
      const topDemandedSkills = sortedRecords.slice(0, 3).map((r) => {
        const skill = db.getSkillById(r.skillId);
        return {
          skillName: skill ? skill.canonicalName : r.skillId,
          openings: r.openingsCount,
          growthPct: r.growthRatePct
        };
      });
      const topShortageRecord = [...records].sort((a, b) => b.gapRatio - a.gapRatio)[0];
      const topShortageSkill = topShortageRecord ? db.getSkillById(topShortageRecord.skillId)?.canonicalName || topShortageRecord.skillId : "Cloud/DevOps";
      const criticalShortagesCount = records.filter((r) => r.gapRatio >= 2).length;
      let severity = "STABLE";
      if (criticalShortagesCount >= 3 || avgGap >= 2.2) severity = "HIGH_URGENCY";
      else if (criticalShortagesCount >= 1 || avgGap >= 1.5) severity = "ELEVATED";
      const instituteCount = state === "Karnataka" ? 245 : state === "Maharashtra" ? 320 : state === "Telangana" ? 180 : 120;
      const studentEnrollmentCapacity = instituteCount * 180;
      results.push({
        state,
        totalOpenings,
        topDemandedSkills,
        avgGapRatio: avgGap,
        topShortageSkill,
        criticalShortagesCount,
        instituteCount,
        studentEnrollmentCapacity,
        severity
      });
    }
    return results.sort((a, b) => b.totalOpenings - a.totalOpenings);
  }
  /**
   * Identifies high-velocity emerging skills with separation of observed trends vs model forecasts.
   */
  getEmergingSkills() {
    const list = [
      {
        skillId: "sk-genai",
        skillName: "Generative AI & LLM Agents",
        growthRatePct: 82,
        currentOpenings: 34200,
        trajectory: "RAPIDLY EXPANDING",
        forecastedNextYearGrowth: "+65% CAGR (Model Forecast based on enterprise adoption)",
        dataSourceLabel: "OBSERVED MARKET TELEMETRY",
        primaryDrivingIndustries: ["Fintech", "Enterprise SaaS", "Healthcare Tech", "IT Services"]
      },
      {
        skillId: "sk-k8s",
        skillName: "Kubernetes & Multi-Cloud Orchestration",
        growthRatePct: 45,
        currentOpenings: 29800,
        trajectory: "RAPIDLY EXPANDING",
        forecastedNextYearGrowth: "+38% YoY (Observed 3-year baseline trajectory)",
        dataSourceLabel: "OBSERVED MARKET TELEMETRY",
        primaryDrivingIndustries: ["Payments", "E-Commerce", "Banking", "Logistics"]
      },
      {
        skillId: "sk-cybersec",
        skillName: "Cybersecurity & Zero Trust Architecture",
        growthRatePct: 42,
        currentOpenings: 21500,
        trajectory: "RAPIDLY EXPANDING",
        forecastedNextYearGrowth: "+35% YoY (Driven by CERT-In and RBI compliance mandates)",
        dataSourceLabel: "OBSERVED MARKET TELEMETRY",
        primaryDrivingIndustries: ["Banking & Financial Services", "Defense & Aerospace", "Telecom"]
      },
      {
        skillId: "sk-docker",
        skillName: "Docker & Containerization",
        growthRatePct: 38,
        currentOpenings: 46200,
        trajectory: "STEADY GROWTH",
        forecastedNextYearGrowth: "+25% YoY (Ubiquitous baseline across IT engineering)",
        dataSourceLabel: "OBSERVED MARKET TELEMETRY",
        primaryDrivingIndustries: ["All Engineering Sectors"]
      },
      {
        skillId: "sk-aws",
        skillName: "AWS Cloud Architecture",
        growthRatePct: 34,
        currentOpenings: 52400,
        trajectory: "STEADY GROWTH",
        forecastedNextYearGrowth: "+22% YoY (Core public cloud market dominance)",
        dataSourceLabel: "OBSERVED MARKET TELEMETRY",
        primaryDrivingIndustries: ["Enterprise IT", "Startups", "Public Sector Digital India"]
      }
    ];
    return list;
  }
  /**
   * Generates CSV export content for Government & Academic planning.
   */
  exportReportCSV(reportType) {
    if (reportType === "skill-gaps") {
      const shortages = this.getSkillShortagesAndOversupply();
      const headers2 = ["Skill_ID", "Skill_Name", "Category", "Demand_Index", "Supply_Index", "Gap_Ratio", "Total_Openings_India", "Status", "Evidence_Summary"];
      const rows2 = shortages.map((s) => [
        s.skillId,
        `"${s.skillName}"`,
        `"${s.category}"`,
        s.demandIndex,
        s.supplyIndex,
        s.gapRatio,
        s.totalOpeningsIndia,
        s.status,
        `"${s.evidenceSummary.replace(/"/g, '""')}"`
      ]);
      return [headers2.join(","), ...rows2.map((r) => r.join(","))].join("\n");
    }
    if (reportType === "regional") {
      const geos = this.getStateGeographicAggregates();
      const headers2 = ["State", "Total_Openings", "Top_Shortage_Skill", "Avg_Gap_Ratio", "Critical_Shortages_Count", "Institutes_Count", "Student_Capacity", "Urgency_Severity"];
      const rows2 = geos.map((g) => [
        `"${g.state}"`,
        g.totalOpenings,
        `"${g.topShortageSkill}"`,
        g.avgGapRatio,
        g.criticalShortagesCount,
        g.instituteCount,
        g.studentEnrollmentCapacity,
        g.severity
      ]);
      return [headers2.join(","), ...rows2.map((r) => r.join(","))].join("\n");
    }
    if (reportType === "employer-demand") {
      const surveys = db.getAllSurveys();
      const headers2 = ["Survey_ID", "Employer_Name", "Industry", "Hard_To_Hire_Skills", "Emerging_Skills", "Fresher_Gaps", "Recommended_Certifications", "Submitted_At"];
      const rows2 = surveys.map((s) => [
        s.id,
        `"${s.employerName}"`,
        `"${s.industry}"`,
        `"${s.hardToHireSkills.join("; ")}"`,
        `"${s.emergingSkills.join("; ")}"`,
        `"${s.fresherGaps.join("; ")}"`,
        `"${s.recommendedCertifications.join("; ")}"`,
        s.submittedAt
      ]);
      return [headers2.join(","), ...rows2.map((r) => r.join(","))].join("\n");
    }
    const curricula = Array.from(db.curricula.values());
    const headers = ["Curriculum_ID", "Course_ID", "Academic_Year", "Alignment_Score_Pct", "Mapped_Skills_Count", "Audit_Date"];
    const rows = curricula.map((c) => [
      c.id,
      c.courseId,
      c.academicYear,
      c.alignmentScore,
      c.skills.length,
      c.lastAudited
    ]);
    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
};
var analyticsEngine = new AnalyticsEngineService();

// backend/api/institute.ts
var instituteRouter = Router3();
instituteRouter.get("/overview", (req, res) => {
  const courses = db.getAllCourses();
  const totalStudents = courses.reduce((acc, c) => acc + c.enrolledStudents, 0);
  const defaultCurriculum = Array.from(db.curricula.values())[0];
  const auditReport = defaultCurriculum ? curriculumEngine.auditCurriculum(defaultCurriculum, courses[0]?.title || "Degree Program") : null;
  const shortages = analyticsEngine.getSkillShortagesAndOversupply().slice(0, 5);
  res.json({
    totalCourses: courses.length,
    totalEnrolledStudents: totalStudents,
    averageAlignmentScore: auditReport?.alignmentScore || 48.2,
    auditReport,
    topIndustryShortages: shortages,
    instituteName: "Pune Institute of Computer Technology (PICT)",
    accreditationStatus: "NAAC A+ / NBA Accredited Autonomous Institute"
  });
});
instituteRouter.get("/courses", (req, res) => {
  const courses = db.getAllCourses();
  res.json({ courses });
});
instituteRouter.get("/curriculum/:courseId", (req, res) => {
  const course = db.courses.get(req.params.courseId);
  if (!course) {
    res.status(404).json({ error: "Course not found." });
    return;
  }
  const curriculum = db.getCurriculaForCourse(course.id) || Array.from(db.curricula.values())[0];
  if (!curriculum) {
    res.status(404).json({ error: "Curriculum not found for this course." });
    return;
  }
  const report = curriculumEngine.auditCurriculum(curriculum, course.title);
  res.json({
    course,
    curriculum,
    report
  });
});
instituteRouter.post("/curriculum/upload", async (req, res) => {
  try {
    const { courseId, syllabusRaw, academicYear } = req.body;
    if (!syllabusRaw) {
      res.status(400).json({ error: "Syllabus content is required." });
      return;
    }
    const targetCourseId = courseId || "crs-pict-cs";
    const result = await curriculumEngine.parseAndSaveCurriculum(
      targetCourseId,
      syllabusRaw,
      academicYear || "2026-2027"
    );
    res.json({
      message: "Curriculum successfully uploaded, analyzed, and audited against industry benchmarks.",
      alignmentScore: result.report.alignmentScore,
      coveredSkillsCount: result.report.coveredMarketSkillsCount,
      missingHighDemandSkillsCount: result.report.missingHighDemandSkillsCount,
      report: result.report,
      aiAudit: result.aiAudit
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Curriculum analysis failed." });
  }
});
instituteRouter.get("/employer-feedback", (req, res) => {
  const surveys = db.getAllSurveys();
  res.json({ surveys });
});

// backend/api/employer.ts
init_store();
import { Router as Router4 } from "express";
var employerRouter = Router4();
employerRouter.get("/jobs", (req, res) => {
  const jobs = db.getAllJobs();
  res.json({ jobs });
});
employerRouter.post("/jobs/ai-generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: 'Hiring prompt is required (e.g. "I need a junior DevOps engineer").' });
      return;
    }
    const aiGenerated = await generateJobRequirementsWithGemini(prompt);
    const requiredNormalized = skillExtractor.normalizeSkills(aiGenerated?.requiredSkills || ["Linux", "Docker", "Git", "AWS"]);
    const preferredNormalized = skillExtractor.normalizeSkills(aiGenerated?.preferredSkills || ["Kubernetes", "Terraform"]);
    res.json({
      title: aiGenerated?.title || "DevOps Platform Engineer",
      roleCategory: aiGenerated?.roleCategory || "DevOps / Cloud Engineer",
      description: aiGenerated?.description || "Build and automate cloud infrastructure, container deployments, and CI/CD pipelines.",
      experienceMinYears: aiGenerated?.experienceMinYears ?? 1,
      salaryMinLPA: aiGenerated?.salaryMinLPA ?? 10,
      salaryMaxLPA: aiGenerated?.salaryMaxLPA ?? 16,
      requiredSkills: requiredNormalized.map((s) => ({
        skillId: s.id,
        skillName: s.canonicalName,
        category: s.category,
        isRequired: true,
        minProficiency: "INTERMEDIATE"
      })),
      preferredSkills: preferredNormalized.map((s) => ({
        skillId: s.id,
        skillName: s.canonicalName,
        category: s.category,
        isRequired: false,
        minProficiency: "BEGINNER"
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "AI Job generation failed." });
  }
});
employerRouter.post("/jobs", (req, res) => {
  try {
    const {
      title,
      roleCategory,
      locationCity,
      locationState,
      experienceMinYears,
      salaryMinLPA,
      salaryMaxLPA,
      description,
      skills
    } = req.body;
    if (!title || !description || !skills || !Array.isArray(skills)) {
      res.status(400).json({ error: "Title, description, and skills are required." });
      return;
    }
    const newJob = {
      id: `job-${Date.now()}`,
      employerId: "usr-employer-1",
      employerName: "Razorpay",
      title,
      roleCategory: roleCategory || "Software Engineering",
      locationCity: locationCity || "Bengaluru",
      locationState: locationState || "Karnataka",
      experienceMinYears: Number(experienceMinYears) || 0,
      salaryMinLPA: Number(salaryMinLPA) || 8,
      salaryMaxLPA: Number(salaryMaxLPA) || 16,
      description,
      postedAt: (/* @__PURE__ */ new Date()).toISOString(),
      dataSource: "REAL VERIFIED",
      skills: skills.map((s) => ({
        skillId: s.skillId,
        isRequired: Boolean(s.isRequired),
        minProficiency: s.minProficiency || "INTERMEDIATE"
      }))
    };
    db.createJob(newJob);
    res.status(201).json({
      message: "Job posting published successfully.",
      job: newJob
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create job." });
  }
});
employerRouter.get("/candidates/match/:jobId", (req, res) => {
  const job = db.getJobById(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "Job not found." });
    return;
  }
  const profiles = Array.from(db.studentProfiles.values());
  const candidateMatches = profiles.map((profile) => {
    const user = db.getUserById(profile.userId);
    const match = matchingEngine.matchStudentToJob(profile, job);
    return {
      candidateId: profile.id,
      candidateName: user?.name || "Anonymous Candidate",
      education: profile.education,
      targetRole: profile.targetRole,
      overallMatchPct: match.overallMatchPct,
      requiredMatchPct: match.requiredMatchPct,
      preferredMatchPct: match.preferredMatchPct,
      matchedSkillsCount: match.matchedSkillsCount,
      totalRequiredCount: match.totalRequiredCount,
      strongSkills: match.strongSkills,
      missingSkills: match.missingSkills,
      weakSkills: match.weakSkills,
      matchBreakdownExplanation: match.matchBreakdownExplanation
    };
  });
  candidateMatches.sort((a, b) => b.overallMatchPct - a.overallMatchPct);
  res.json({
    job,
    totalCandidatesEvaluated: candidateMatches.length,
    matches: candidateMatches
  });
});
employerRouter.post("/survey", (req, res) => {
  try {
    const {
      employerName,
      industry,
      hardToHireSkills,
      emergingSkills,
      fresherGaps,
      recommendedCertifications,
      additionalRemarks
    } = req.body;
    if (!employerName || !industry) {
      res.status(400).json({ error: "Employer name and industry are required." });
      return;
    }
    const surveySubmission = {
      id: `es-${Date.now()}`,
      employerId: "usr-employer-1",
      employerName,
      industry,
      hardToHireSkills: Array.isArray(hardToHireSkills) ? hardToHireSkills : [hardToHireSkills].filter(Boolean),
      emergingSkills: Array.isArray(emergingSkills) ? emergingSkills : [emergingSkills].filter(Boolean),
      fresherGaps: Array.isArray(fresherGaps) ? fresherGaps : [fresherGaps].filter(Boolean),
      recommendedCertifications: Array.isArray(recommendedCertifications) ? recommendedCertifications : [recommendedCertifications].filter(Boolean),
      additionalRemarks: additionalRemarks || "",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.addSurvey(surveySubmission);
    res.status(201).json({
      message: "Industry requirements survey submitted and incorporated into central intelligence engine.",
      survey: surveySubmission
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Survey submission failed." });
  }
});

// backend/api/admin.ts
init_store();
import { Router as Router5 } from "express";
var adminRouter = Router5();
adminRouter.get("/overview", (req, res) => {
  const shortages = analyticsEngine.getSkillShortagesAndOversupply();
  const criticalCount = shortages.filter((s) => s.status === "CRITICAL SHORTAGE").length;
  const oversupplyCount = shortages.filter((s) => s.status === "OVERSUPPLY").length;
  const totalOpeningsAnalyzed = shortages.reduce((acc, s) => acc + s.totalOpeningsIndia, 0);
  const geoAggregates = analyticsEngine.getStateGeographicAggregates();
  const emergingSkills = analyticsEngine.getEmergingSkills();
  res.json({
    jobsAnalysed: db.getAllJobs().length + 184500,
    // Aggregate portal postings
    skillsAnalysed: db.getAllSkills().length,
    criticalShortagesCount: criticalCount,
    oversupplyCount,
    totalOpeningsAnalyzed,
    averageCurriculumAlignment: 48.2,
    totalTechnicalInstitutesMonitored: geoAggregates.reduce((acc, g) => acc + g.instituteCount, 0),
    annualGraduatingCapacity: geoAggregates.reduce((acc, g) => acc + g.studentEnrollmentCapacity, 0),
    topDemandedSkills: db.getAllSkills().filter((s) => s.marketDemandLevel === "HIGH").slice(0, 5),
    emergingSkillsCount: emergingSkills.length,
    recommendations: db.getRecommendations("GOVT")
  });
});
adminRouter.get("/labour-market", (req, res) => {
  const shortages = analyticsEngine.getSkillShortagesAndOversupply();
  const emerging = analyticsEngine.getEmergingSkills();
  const roleDemands = [
    { role: "DevOps / Cloud Platform", openings: 54e3, growthPct: 36, averageSalaryLPA: 14.5 },
    { role: "AI / Machine Learning & GenAI", openings: 42e3, growthPct: 68, averageSalaryLPA: 16.2 },
    { role: "Backend Distributed Systems", openings: 48e3, growthPct: 22, averageSalaryLPA: 13 },
    { role: "Frontend & Full-Stack Web", openings: 51e3, growthPct: 18, averageSalaryLPA: 11.5 },
    { role: "Cybersecurity & SecOps", openings: 24e3, growthPct: 41, averageSalaryLPA: 15 }
  ];
  const industryDemands = [
    { industry: "Fintech & Payments", sharePct: 28, keySkills: ["Kubernetes", "AWS", "PostgreSQL", "Golang"] },
    { industry: "Enterprise SaaS & Cloud", sharePct: 32, keySkills: ["Docker", "Terraform", "React", "TypeScript"] },
    { industry: "Healthcare & DeepTech", sharePct: 16, keySkills: ["Python", "GenAI", "PyTorch", "Data Eng"] },
    { industry: "E-Commerce & Quick-Commerce", sharePct: 24, keySkills: ["Kafka", "Redis", "CI/CD", "Linux"] }
  ];
  res.json({
    roleDemands,
    industryDemands,
    shortages,
    emergingSkills: emerging
  });
});
adminRouter.get("/heatmap", (req, res) => {
  const { state, skillId } = req.query;
  let demands = db.stateDemands;
  if (state && typeof state === "string") {
    demands = demands.filter((d) => d.state.toLowerCase() === state.toLowerCase());
  }
  if (skillId && typeof skillId === "string") {
    demands = demands.filter((d) => d.skillId.toLowerCase() === skillId.toLowerCase());
  }
  const aggregates = analyticsEngine.getStateGeographicAggregates();
  res.json({
    statesData: aggregates,
    demands,
    filteredState: state || "All India"
  });
});
adminRouter.get("/shortages", (req, res) => {
  const all = analyticsEngine.getSkillShortagesAndOversupply();
  const shortages = all.filter((s) => s.status === "CRITICAL SHORTAGE" || s.status === "MODERATE SHORTAGE");
  const oversupply = all.filter((s) => s.status === "OVERSUPPLY");
  res.json({
    shortages,
    oversupply,
    totalEvaluated: all.length
  });
});
adminRouter.get("/emerging-skills", (req, res) => {
  const emerging = analyticsEngine.getEmergingSkills();
  res.json({ emerging });
});
adminRouter.get("/training-supply", (req, res) => {
  const geo = analyticsEngine.getStateGeographicAggregates();
  const courses = db.getAllCourses();
  res.json({
    stateCapacity: geo,
    courses,
    monitoredInstitutes: [
      { name: "PICT Pune", state: "Maharashtra", alignmentScore: 48.2, enrollment: 1200 },
      { name: "Anna University", state: "Tamil Nadu", alignmentScore: 52, enrollment: 2400 },
      { name: "DTU Delhi", state: "Delhi NCR", alignmentScore: 56.4, enrollment: 1800 },
      { name: "NIT Surathkal", state: "Karnataka", alignmentScore: 64, enrollment: 1100 }
    ]
  });
});
adminRouter.get("/reports/export", (req, res) => {
  const reportType = req.query.type || "skill-gaps";
  const csvContent = analyticsEngine.exportReportCSV(reportType);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=SkillSetu_${reportType}_${Date.now()}.csv`);
  res.status(200).send(csvContent);
});

// backend/api/market.ts
init_store();
init_taxonomy();
import { Router as Router6 } from "express";
var marketRouter = Router6();
marketRouter.get("/skills", (req, res) => {
  const skills = db.getAllSkills();
  res.json({ skills });
});
marketRouter.get("/taxonomy", (req, res) => {
  res.json({
    canonicalSkills: CANONICAL_SKILLS,
    aliasesCount: SKILL_ALIASES.length,
    sampleAliases: SKILL_ALIASES.slice(0, 20)
  });
});
marketRouter.post("/normalize-skill", (req, res) => {
  const { rawText } = req.body;
  if (!rawText) {
    res.status(400).json({ error: "rawText is required." });
    return;
  }
  const normalized = normalizeSkillText(rawText);
  res.json({
    rawInput: rawText,
    normalized: normalized ? {
      id: normalized.id,
      canonicalName: normalized.canonicalName,
      category: normalized.category,
      marketDemandLevel: normalized.marketDemandLevel
    } : null,
    isRecognized: Boolean(normalized)
  });
});

// backend/api/chat.ts
import { Router as Router7 } from "express";
var chatRouter = Router7();
chatRouter.post("/", async (req, res) => {
  try {
    const { messages, systemInstruction, modelChoice, userRole, userName, organization } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages array is required and cannot be empty." });
      return;
    }
    let enrichedInstruction = systemInstruction;
    if (userRole === "STUDENT") {
      const { db: db2 } = await Promise.resolve().then(() => (init_store(), store_exports));
      const studentProfile = db2.studentProfiles.get("usr-student-1") || Array.from(db2.studentProfiles.values())[0];
      if (studentProfile) {
        const studentSkills = studentProfile.skills.map((s) => {
          const sk = db2.getSkillById(s.skillId);
          return `${sk?.canonicalName || s.skillId} (${s.verified ? "Verified" : "Analysed"})`;
        }).join(", ");
        const candidateName = studentProfile.resumeData?.candidate?.name || userName || "Student Candidate";
        const contextSuffix = `

CURRENT STUDENT PROFILE CONTEXT:
- Student Name: ${candidateName}
- Target Role: ${studentProfile.targetRole}
- Verified & Analysed Skills: ${studentSkills || "In progress"}
- Education: ${studentProfile.education || "Undergraduate"}
- Resume Summary: ${studentProfile.resumeData?.summary || studentProfile.bio || "Recently analysed"}
Reference this student profile context when answering questions about their skills, career alignment, or curriculum.`;
        enrichedInstruction = (systemInstruction || "") + contextSuffix;
      }
    }
    const payload = {
      messages,
      systemInstruction: enrichedInstruction,
      modelChoice,
      userRole,
      userName,
      organization
    };
    const result = await sendMultiTurnChatMessage(payload);
    res.json({
      reply: result.reply,
      answer: result.answer,
      provider: result.provider,
      modelUsed: result.modelUsed,
      fallbackUsed: result.fallbackUsed,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ error: err.message || "Chat generation failed." });
  }
});

// backend/api/simulation.ts
init_store();
import { Router as Router8 } from "express";
var simulationRouter = Router8();
var activeSessions = /* @__PURE__ */ new Map();
function getActiveStudent(req) {
  let profile = db.studentProfiles.get("usr-student-1");
  if (!profile) {
    profile = Array.from(db.studentProfiles.values())[0];
  }
  return profile;
}
simulationRouter.post("/create", async (req, res) => {
  try {
    const profile = getActiveStudent(req);
    const {
      promptRequest,
      category = "incident",
      targetRole: requestedRole,
      skillGaps: requestedGaps,
      difficulty = "Intermediate"
    } = req.body;
    const gapEval = profile ? matchingEngine.evaluateRoleSkillGaps(profile, profile.targetRole) : null;
    const detectedGaps = (gapEval?.marketSkillsNeeded || []).filter((m) => m.isMissing).map((m) => m.skill.canonicalName);
    const targetRole = requestedRole || profile?.targetRole || "DevOps / Cloud Engineer";
    const skillGaps = requestedGaps && requestedGaps.length > 0 ? requestedGaps : detectedGaps.length > 0 ? detectedGaps : ["Docker", "AWS", "Kubernetes"];
    const scenario = await generateSimulatorScenarioWithGemini({
      targetRole,
      skillGaps,
      promptRequest,
      category
    });
    if (difficulty && scenario) {
      scenario.difficulty = difficulty;
    }
    const sessionId = `sim-sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const sessionRecord = {
      sessionId,
      scenario,
      transcript: [
        {
          role: "assistant",
          text: scenario.initialMessage,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      turnCount: 0,
      maxTurns: scenario.expectedTurns || 4,
      stageProgress: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      isCompleted: false
    };
    activeSessions.set(sessionId, sessionRecord);
    res.status(201).json({
      success: true,
      sessionId,
      scenario,
      initialMessage: scenario.initialMessage,
      state: "initialized",
      turnCount: 0,
      maxTurns: sessionRecord.maxTurns
    });
  } catch (err) {
    console.error("Error in /simulation/create:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to initialize simulation session"
    });
  }
});
simulationRouter.post("/respond", async (req, res) => {
  try {
    const { sessionId, scenario: passedScenario, history: passedHistory, userMessage } = req.body;
    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      res.status(400).json({ success: false, error: "userMessage text is required" });
      return;
    }
    const session = sessionId ? activeSessions.get(sessionId) : null;
    const scenario = passedScenario || session?.scenario;
    if (!scenario) {
      res.status(400).json({ success: false, error: "Simulation scenario context is required" });
      return;
    }
    const historyToUse = passedHistory || session?.transcript || [];
    const formattedHistory = historyToUse.map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      text: h.text || h.content || ""
    }));
    const turnResult = await simulatorTurnWithGemini(scenario, formattedHistory, userMessage.trim());
    const updatedTurnCount = (session ? session.turnCount : formattedHistory.filter((h) => h.role === "user").length) + 1;
    const isCompleted = updatedTurnCount >= (scenario.expectedTurns || 4);
    if (session) {
      session.transcript.push({
        role: "user",
        text: userMessage.trim(),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      session.transcript.push({
        role: "assistant",
        text: turnResult.reply,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      session.turnCount = updatedTurnCount;
      session.stageProgress = turnResult.stageProgress;
      session.isCompleted = isCompleted;
      session.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    res.json({
      success: true,
      sessionId: sessionId || null,
      reply: turnResult.reply,
      hint: turnResult.hint || null,
      stageProgress: turnResult.stageProgress,
      turnCount: updatedTurnCount,
      suggestedFollowUp: turnResult.suggestedFollowUp,
      isCompleted
    });
  } catch (err) {
    console.error("Error in /simulation/respond:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to process simulation turn"
    });
  }
});
simulationRouter.post("/evaluate", async (req, res) => {
  try {
    const { sessionId, scenario: passedScenario, transcript: passedTranscript } = req.body;
    const session = sessionId ? activeSessions.get(sessionId) : null;
    const scenario = passedScenario || session?.scenario;
    const transcript = passedTranscript || session?.transcript;
    if (!scenario || !transcript || !Array.isArray(transcript)) {
      res.status(400).json({
        success: false,
        error: "Both scenario and a valid transcript array are required for evaluation"
      });
      return;
    }
    const evaluation = await evaluateSimulationWithGemini(scenario, transcript);
    const profile = getActiveStudent(req);
    let verifiedCompetencyEarned = false;
    if (profile && evaluation.overallScore >= 70) {
      verifiedCompetencyEarned = true;
      profile.profileCompletionPct = Math.min(100, (profile.profileCompletionPct || 85) + 3);
      const targetSkillObj = Array.from(db.skills.values()).find(
        (s) => s.canonicalName.toLowerCase() === scenario.evaluatedSkill.toLowerCase()
      );
      if (targetSkillObj) {
        const existingSkill = profile.skills.find((s) => s.skillId === targetSkillObj.id);
        if (existingSkill) {
          existingSkill.verified = true;
          existingSkill.source = "ASSESSMENT";
          existingSkill.lastEvaluated = (/* @__PURE__ */ new Date()).toISOString();
        } else {
          profile.skills.push({
            skillId: targetSkillObj.id,
            proficiency: "INTERMEDIATE",
            verified: true,
            source: "ASSESSMENT",
            lastEvaluated: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      db.saveStudentProfile(profile);
    }
    if (session) {
      session.isCompleted = true;
      session.evaluation = evaluation;
    }
    res.json({
      success: true,
      sessionId: sessionId || null,
      evaluation,
      verifiedCompetencyEarned,
      message: verifiedCompetencyEarned ? `Simulation passed (${evaluation.overallScore}/100). Competency for ${scenario.evaluatedSkill} recorded.` : `Simulation evaluated (${evaluation.overallScore}/100). Review feedback to improve.`
    });
  } catch (err) {
    console.error("Error in /simulation/evaluate:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to evaluate simulation session"
    });
  }
});

// backend/app.ts
dotenv.config();
var app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.get(["/api/health", "/health"], (req, res) => {
  res.json({
    status: "healthy",
    app: "SkillSetu Skill Intelligence Platform",
    version: "1.0.0-sih26134",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get(["/api/ai/health", "/ai/health"], (req, res) => {
  res.json({
    gemini: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" ? "configured" : "missing",
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    groq: process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "MY_GROQ_API_KEY" ? "configured" : "missing",
    groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    openrouter: process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "MY_OPENROUTER_API_KEY" ? "configured" : "missing",
    openrouterModel: process.env.OPENROUTER_MODEL || "openrouter/free",
    fallbackEnabled: true,
    activeChain: [
      { priority: 1, provider: "Gemini", model: process.env.GEMINI_MODEL || "gemini-2.5-flash" },
      { priority: 2, provider: "Groq", model: process.env.GROQ_MODEL || "openai/gpt-oss-120b" },
      { priority: 3, provider: "OpenRouter", model: process.env.OPENROUTER_MODEL || "openrouter/free" },
      { priority: 4, provider: "Deterministic", model: "SkillSetu Engine" }
    ]
  });
});
app.use("/api/auth", authRouter);
app.use("/api/student", studentRouter);
app.use("/api/institute", instituteRouter);
app.use("/api/employer", employerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/market", marketRouter);
app.use("/api/chat", chatRouter);
app.use("/api/simulation", simulationRouter);
app.use("/auth", authRouter);
app.use("/student", studentRouter);
app.use("/institute", instituteRouter);
app.use("/employer", employerRouter);
app.use("/admin", adminRouter);
app.use("/market", marketRouter);
app.use("/chat", chatRouter);
app.use("/simulation", simulationRouter);
app.all(["/copilot", "/api/copilot"], (req, res, next) => {
  req.url = "/copilot";
  studentRouter(req, res, next);
});
app.all(["/dashboard", "/api/dashboard"], (req, res, next) => {
  req.url = "/dashboard";
  studentRouter(req, res, next);
});
app.all(["/login", "/api/login"], (req, res, next) => {
  req.url = "/login";
  authRouter(req, res, next);
});
app.all(["/match", "/api/match"], (req, res, next) => {
  req.url = "/jobs/match";
  studentRouter(req, res, next);
});
app.all(["/profile", "/api/profile"], (req, res, next) => {
  req.url = "/profile";
  studentRouter(req, res, next);
});
app.all(["/roadmap", "/api/roadmap"], (req, res, next) => {
  req.url = "/roadmap";
  studentRouter(req, res, next);
});
app.all(["/assessments", "/api/assessments"], (req, res, next) => {
  req.url = "/assessments";
  studentRouter(req, res, next);
});

// backend/serverless.ts
dotenv2.config();
function handler(req, res) {
  return app(req, res);
}
export {
  handler as default
};
