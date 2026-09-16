import json
import re

blueprint = """# HPVuln Target Mapping Blueprint

| Vulnerability | HPLabs Labs | Target Family | Application | Suggested Subdomain | Natural Functionality | Target Type |
|---|---|---|---|---|---|---|
"""

with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\coverage_audit.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

in_table = False
for line in lines:
    if line.startswith("| Vulnerability Concept |"):
        in_table = True
        continue
    if line.startswith("|---|"):
        continue
    if in_table and line.startswith("|"):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 3: continue
        vuln = parts[1]
        labs = parts[2].replace("<br>", ", ")
        
        # Determine target family and app
        family = "Web Application"
        app = "Default Web Target"
        subdomain = "app.hpvuln.in"
        functionality = "Generic functionality"
        target_type = "REQUIRES REVIEW"
        
        v = vuln.lower()
        if "ad " in v or "active directory" in v or "kerberos" in v or "ntlm" in v or "as-rep" in v or "bloodhound" in v or "domain admin" in v or "lsass" in v or "dcsync" in v or "zerologon" in v or "petitpotam" in v or "smb" in v:
            family = "Active Directory"
            app = "Corporate AD Environment"
            subdomain = "corp.hpvuln.in"
            functionality = "Authentication / Directory Services"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "cloud" in v or "aws " in v or "azure " in v or "s3 " in v or "iam " in v or "ec2" in v:
            family = "Cloud"
            app = "Simulated Cloud Environment"
            subdomain = "cloud.hpvuln.in"
            functionality = "Cloud Infrastructure / Object Storage"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "kubernetes" in v or "k8s" in v:
            family = "Kubernetes"
            app = "Kubernetes Cluster"
            subdomain = "k8s.hpvuln.in"
            functionality = "Container Orchestration"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "mobile" in v or "apk" in v or "tapjacking" in v or "ios" in v or "android" in v:
            family = "Mobile"
            app = "Vulnerable Mobile App"
            subdomain = "api.mobile.hpvuln.in"
            functionality = "Mobile API / Client endpoints"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "graphql" in v:
            family = "GraphQL"
            app = "GraphQL API"
            subdomain = "graphql.hpvuln.in"
            functionality = "GraphQL API endpoints"
            target_type = "MAPPED"
        elif "api" in v or "jwt" in v or "rest" in v or "oauth" in v or "cors" in v or "ssrf" in v or "idor" in v or "bola" in v:
            family = "REST API"
            app = "Microservices API"
            subdomain = "api.hpvuln.in"
            functionality = "RESTful resources / Account endpoints"
            target_type = "MAPPED"
        elif "network" in v or "port" in v or "nmap" in v or "ftp" in v or "telnet" in v or "ssh" in v:
            family = "Network/Infrastructure"
            app = "Internal Network Segment"
            subdomain = "net.hpvuln.in"
            functionality = "Internal Network Services"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "sql" in v or "ecommerce" in v or "cart" in v or "payment" in v:
            family = "E-Commerce"
            app = "E-Commerce Platform"
            subdomain = "shop.hpvuln.in"
            functionality = "Search / Product / Cart functionality"
            target_type = "MAPPED"
        elif "cms" in v or "wordpress" in v or "upload" in v or "media" in v:
            family = "CMS/Media"
            app = "Content Management System"
            subdomain = "cms.hpvuln.in"
            functionality = "File Upload / Content creation"
            target_type = "MAPPED"
        elif "xss" in v or "csrf" in v or "clickjacking" in v or "cookie" in v:
            family = "SaaS"
            app = "SaaS Dashboard"
            subdomain = "dashboard.hpvuln.in"
            functionality = "User preferences / Profiles / Settings"
            target_type = "MAPPED"
        elif "19" in v or "20" in v or "cve-" in v or "struts" in v or "log4j" in v or "heartbleed" in v:
            family = "Research/CVE-specific environment"
            app = "Isolated Vulnerable Container"
            subdomain = "cve.hpvuln.in"
            functionality = "Exploitable Legacy Service"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        else:
            family = "Enterprise Portal"
            app = "Internal Enterprise Portal"
            subdomain = "portal.hpvuln.in"
            functionality = "Generic Business Logic"
            target_type = "MAPPED"
            
        blueprint += f"| {vuln} | {labs} | {family} | {app} | {subdomain} | {functionality} | {target_type} |\n"

with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\target_blueprint.md", "w", encoding="utf-8") as f:
    f.write(blueprint)

print("Blueprint written.")
