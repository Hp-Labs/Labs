import os

path = "src/app/certifications/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("""
  const INTERNAL_CERTS = [
    {
      id: "HPL-WebPT",
      name: "HPL-WebPT",
      fullName: "HpLabs Web Penetration Testing",
      description:
        "Comprehensive web application security certification covering OWASP Top 10, injection attacks, authentication bypass, XSS, SSRF, and business logic flaws.",
      domains: ["Information Recon", "Low Severity", "Medium Severity", "High Severity", "Critical Exploits"],
      progress: {
        completed: 18,
        total: 45,
        percent: 40,
      },
    },
    {
      id: "HPL-NetPT",
      name: "HPL-NetPT",
      fullName: "HpLabs Network Penetration Testing",
      description:
        "Advanced network security certification focused on pivoting, active directory exploitation, lateral movement, and infrastructure compromise.",
      domains: ["Network Recon", "Vulnerability Scanning", "Exploitation", "Post-Exploitation", "Active Directory"],
      progress: {
        completed: 5,
        total: 30,
        percent: 16,
      },
    },
    {
      id: "HPL-CloudPT",
      name: "HPL-CloudPT",
      fullName: "HpLabs Cloud Security Professional",
      description:
        "Specialized cloud security certification testing misconfigurations, IAM privilege escalation, and container escapes in AWS/Azure/GCP environments.",
      domains: ["IAM Exploitation", "Storage Misconfig", "Serverless Flaws", "Container Escapes", "Cloud Native Vulns"],
      progress: {
        completed: 0,
        total: 25,
        percent: 0,
      },
    },
  ];
""", """
  const completedCount = user?.completedLabs?.length || 0;
  
  const INTERNAL_CERTS = [
    {
      id: "HPL-WebPT",
      name: "HPL-WebPT",
      fullName: "HpLabs Web Penetration Testing",
      description:
        "Comprehensive web application security certification covering OWASP Top 10, injection attacks, authentication bypass, XSS, SSRF, and business logic flaws.",
      domains: ["Information Recon", "Low Severity", "Medium Severity", "High Severity", "Critical Exploits"],
      progress: {
        completed: Math.min(completedCount, 45),
        total: 45,
        percent: Math.round((Math.min(completedCount, 45) / 45) * 100),
      },
    },
    {
      id: "HPL-NetPT",
      name: "HPL-NetPT",
      fullName: "HpLabs Network Penetration Testing",
      description:
        "Advanced network security certification focused on pivoting, active directory exploitation, lateral movement, and infrastructure compromise.",
      domains: ["Network Recon", "Vulnerability Scanning", "Exploitation", "Post-Exploitation", "Active Directory"],
      progress: {
        completed: Math.max(0, Math.min(completedCount - 45, 30)),
        total: 30,
        percent: Math.round((Math.max(0, Math.min(completedCount - 45, 30)) / 30) * 100) || 0,
      },
    },
    {
      id: "HPL-CloudPT",
      name: "HPL-CloudPT",
      fullName: "HpLabs Cloud Security Professional",
      description:
        "Specialized cloud security certification testing misconfigurations, IAM privilege escalation, and container escapes in AWS/Azure/GCP environments.",
      domains: ["IAM Exploitation", "Storage Misconfig", "Serverless Flaws", "Container Escapes", "Cloud Native Vulns"],
      progress: {
        completed: Math.max(0, Math.min(completedCount - 75, 25)),
        total: 25,
        percent: Math.round((Math.max(0, Math.min(completedCount - 75, 25)) / 25) * 100) || 0,
      },
    },
  ];
""")

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Updated certs page")
