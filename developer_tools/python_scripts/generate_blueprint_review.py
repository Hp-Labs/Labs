import json

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
        
        # Smart mapping based on lab IDs and vuln name
        v = vuln.lower()
        l = labs.lower()
        
        family = "Web Application"
        app = "Default Web Target"
        subdomain = "app.hpvuln.in"
        functionality = "Generic functionality"
        target_type = "REQUIRES REVIEW"

        if "ad-" in l or "active directory" in v or "kerberos" in v or "bloodhound" in v:
            family = "Active Directory"
            app = "Corporate AD Environment"
            subdomain = "corp.hpvuln.in"
            functionality = "Authentication / Directory Services"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "cloud-" in l or "aws" in v or "azure" in v or "s3" in v:
            family = "Cloud"
            app = "Simulated Cloud Infrastructure"
            subdomain = "cloud.hpvuln.in"
            functionality = "Cloud Resource Management"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "net-" in l or "network" in v or "smb" in v:
            family = "Network/Infrastructure"
            app = "Internal Network Segment"
            subdomain = "net.hpvuln.in"
            functionality = "Internal Network Services"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "api-" in l or "graphql" in v or "jwt" in v or "rest" in v:
            if "graphql" in v:
                family = "GraphQL"
                app = "GraphQL API"
                subdomain = "graphql.hpvuln.in"
                functionality = "GraphQL Endpoints"
            else:
                family = "REST API"
                app = "Microservices API"
                subdomain = "api.hpvuln.in"
                functionality = "RESTful Resources"
            target_type = "MAPPED"
        elif "mob-" in l or "mobile" in v:
            family = "Mobile"
            app = "Vulnerable Mobile Backend"
            subdomain = "api.mobile.hpvuln.in"
            functionality = "Mobile API / Client"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "sys-" in l or "19" in v or "20" in v or "cve-" in v:
            family = "Research/CVE-specific environment"
            app = "Isolated Vulnerable Container"
            subdomain = "cve.hpvuln.in"
            functionality = "Exploitable Legacy Service"
            target_type = "NEEDS SPECIALIZED ENVIRONMENT"
        elif "sql" in v or "ecommerce" in v or "cart" in v or "payment" in v or "ssrf" in v:
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
        elif "xss" in v or "csrf" in v or "clickjacking" in v or "cookie" in v or "cors" in v or "auth" in v or "bola" in v or "idor" in v or "lfi" in v or "rfi" in v or "cmd" in v:
            family = "SaaS"
            app = "SaaS Dashboard"
            subdomain = "dashboard.hpvuln.in"
            functionality = "User preferences / Profiles / Settings"
            target_type = "MAPPED"
        elif "business logic" in v or "workflow" in v or "privilege" in v:
            family = "Enterprise Portal"
            app = "Internal Enterprise Portal"
            subdomain = "portal.hpvuln.in"
            functionality = "Generic Business Logic"
            target_type = "MAPPED"
        else:
            # Catch-all is REQUIRES REVIEW
            family = "Web Application"
            app = "Undetermined Web Target"
            subdomain = "app.hpvuln.in"
            functionality = "TBD"
            target_type = "REQUIRES REVIEW"
            
        blueprint += f"| {vuln} | {labs} | {family} | {app} | {subdomain} | {functionality} | {target_type} |\n"

with open(r"C:\Users\VIJAY\.gemini\antigravity\brain\1c2b0c70-bd06-461b-b6cf-9cf481e0a2cc\target_blueprint.md", "w", encoding="utf-8") as f:
    f.write(blueprint)

print("Blueprint rewritten.")
