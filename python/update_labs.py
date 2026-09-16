import os
import re

base_dir = r"c:\Users\VIJAY\Downloads\HpLabs\hplabs-app\src\lib\data\redteam\pentesting\web"
files = ["information.ts", "low.ts", "medium.ts", "high.ts", "critical.ts"]

# Prevention and solution for each lab ID
lab_details = {
    "web-info-001": {
        "prevention": "To prevent unauthorized DNS zone transfers and extensive subdomain enumeration, ensure that DNS servers are configured to restrict zone transfers (AXFR) only to authorized secondary name servers. Utilize wildcard DNS records cautiously to avoid confirming the existence of subdomains unnecessarily.",
        "solution": "Implement DNSSEC to protect against DNS spoofing and ensure data integrity. Additionally, regularly audit publicly exposed subdomains and remove deprecated or unused staging environments that could serve as attack vectors."
    },
    "web-info-002": {
        "prevention": "Prevent the exposure of sensitive organizational details by utilizing domain privacy services (WHOIS Privacy) offered by registrars. Ensure that technical and administrative contact emails are generic distribution lists rather than personal employee addresses.",
        "solution": "Audit domain registration profiles annually to verify that no unnecessary personal data is exposed. Comply with GDPR or local privacy regulations that automatically redact personal information from public WHOIS databases."
    },
    "web-info-003": {
        "prevention": "Configure web servers and application frameworks to suppress version disclosure in HTTP headers. Remove or obfuscate headers such as 'Server', 'X-Powered-By', and 'X-AspNet-Version' to prevent automated fingerprinting of the technology stack.",
        "solution": "Implement a strict security header policy including Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), and X-Frame-Options. Use a Web Application Firewall (WAF) to normalize outgoing headers and strip sensitive version information."
    },
    "web-info-004": {
        "prevention": "Prevent banner grabbing by hardening the web server configuration to return generic or suppressed server signatures. Disable default installation pages and directory listings that often reveal the exact software version running.",
        "solution": "Regularly patch and update web server software to eliminate known vulnerabilities associated with specific versions. Use reverse proxies or CDNs to mask the origin server's true identity and banner information."
    },
    "web-info-005": {
        "prevention": "Prevent sensitive files from being indexed by search engines by carefully configuring the robots.txt file and using the 'noindex' meta tag on pages that should not appear in search results. Ensure that administrative interfaces are placed behind authentication.",
        "solution": "Periodically perform Google Dorking against your own domain to discover unintentionally exposed data. Use Google Search Console to request the removal of sensitive cached pages and audit web roots for backup or configuration files."
    },
    "web-info-006": {
        "prevention": "Disable directory listing globally in the web server configuration (e.g., 'Options -Indexes' in Apache). Ensure that sensitive directories are explicitly protected and do not rely solely on security through obscurity via robots.txt.",
        "solution": "Audit the robots.txt file to ensure it does not inadvertently map out sensitive administrative paths for attackers. Implement proper access controls on all directories, ensuring that unauthorized users receive a 403 Forbidden response."
    },
    "web-info-007": {
        "prevention": "Prevent the exposure of sensitive logic and API keys in client-side JavaScript by moving sensitive operations to the backend server. Use environment variables during the build process to avoid hardcoding secrets in the source code.",
        "solution": "Implement code minification and obfuscation to make reverse engineering harder, though not impossible. Continuously scan code repositories for leaked secrets before deploying JavaScript bundles to production."
    },
    "web-info-008": {
        "prevention": "Prevent downgrade attacks by disabling deprecated protocols like SSLv3, TLS 1.0, and TLS 1.1 on the server. Configure the server to only support strong cipher suites and enforce Perfect Forward Secrecy (PFS).",
        "solution": "Regularly renew and audit SSL/TLS certificates to ensure they do not expose internal network names via Subject Alternative Names (SANs). Implement Certificate Transparency monitoring to detect unauthorized certificate issuance."
    },
    "web-info-009": {
        "prevention": "Prevent sensitive data exposure in web archives by ensuring that administrative or internal endpoints are never accessible without strict authentication, even temporarily. Use the 'noarchive' meta tag to instruct search engines not to cache the page.",
        "solution": "Audit historical URLs using tools like Wayback Machine to identify deprecated APIs or endpoints that may still be functional. Ensure that old infrastructure is completely decommissioned and not just unlinked."
    },
    "web-info-010": {
        "prevention": "Prevent accurate technology stack fingerprinting by normalizing HTTP responses and removing default application behaviors, such as predictable cookie names or specific error messages generated by frameworks.",
        "solution": "Deploy a WAF to intercept and modify responses that reveal framework-specific details. Maintain an aggressive patch management schedule so that even if the stack is identified, known vulnerabilities cannot be exploited."
    },
    "web-info-011": {
        "prevention": "Prevent WAF bypass by ensuring the WAF is configured to inspect all traffic, including encrypted payloads (SSL termination). Avoid exposing the origin server's IP address, which allows attackers to bypass the CDN/WAF entirely.",
        "solution": "Regularly tune WAF rules to adapt to new bypass techniques and ensure comprehensive coverage of OWASP Top 10 vulnerabilities. Restrict origin server access so it only accepts traffic originating from the WAF's IP ranges."
    },
    "web-info-012": {
        "prevention": "Prevent email spoofing and infrastructure leakage by properly configuring SPF, DKIM, and DMARC records with strict failure policies (e.g., p=reject). Ensure SMTP banners do not disclose server software versions.",
        "solution": "Audit DNS records to remove stale or overly permissive SPF includes. Disable features like VRFY and EXPN on the mail server to prevent unauthorized email address enumeration by attackers."
    },
    "web-info-013": {
        "prevention": "Prevent information disclosure by integrating automated checks in the CI/CD pipeline to strip HTML comments and debugging information before deploying to production. Educate developers not to leave TODO notes or credentials in the frontend code.",
        "solution": "Regularly scan the application's source code for leaked internal IPs, API endpoints, or developer comments. Use templating engines that automatically remove comments during the compilation phase."
    },
    "web-info-014": {
        "prevention": "Prevent HTTP method exploitation by explicitly defining and enforcing allowed HTTP methods (e.g., GET, POST) at the web server and application levels. Disable dangerous methods like TRACE, TRACK, and arbitrary WebDAV methods if not required.",
        "solution": "Configure the web server to return a 405 Method Not Allowed for any unexpected HTTP methods. Regularly audit the server configuration to ensure that testing or debugging methods are not enabled in production."
    },
    "web-low-001": {
        "prevention": "Prevent clickjacking and cross-site scripting by enforcing robust HTTP security headers. Always configure the server to return modern headers like Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), and X-Frame-Options.",
        "solution": "Conduct automated header audits using tools like Nikto or online scanners to ensure continuous compliance. Define a strong CSP that restricts the domains allowed to execute scripts and embed frames."
    },
    "web-low-002": {
        "prevention": "Prevent Cross-Site Tracing (XST) by disabling the HTTP TRACE and TRACK methods in the web server configuration. These methods are intended for debugging and pose a risk of echoing sensitive headers back to the client.",
        "solution": "Update the server configuration (e.g., 'TraceEnable off' in Apache) to reject TRACE requests with a 405 Method Not Allowed. Additionally, rely on the HttpOnly flag for cookies to mitigate script-based access."
    },
    "web-low-003": {
        "prevention": "Prevent the leakage of sensitive stack traces by configuring the application framework to display generic error pages in production environments. Ensure that debug modes (e.g., Django's DEBUG=True or Laravel's APP_DEBUG=true) are strictly disabled.",
        "solution": "Implement global exception handling to catch unexpected errors and log the detailed stack trace internally rather than exposing it to the user. Monitor application logs to identify and patch the root causes of the exceptions."
    },
    "web-low-004": {
        "prevention": "Prevent session hijacking by always appending the 'HttpOnly' and 'Secure' attributes when issuing sensitive cookies. This ensures that the cookies cannot be accessed via client-side scripts and are only transmitted over encrypted connections.",
        "solution": "Audit the application's session management framework to enforce secure cookie configurations globally. Consider implementing the 'SameSite' attribute to further protect against Cross-Site Request Forgery (CSRF) attacks."
    },
    "web-low-005": {
        "prevention": "Prevent clickjacking attacks by implementing the X-Frame-Options header set to 'DENY' or 'SAMEORIGIN' to control how the site can be framed. Modern applications should also use the CSP 'frame-ancestors' directive for granular control.",
        "solution": "Regularly verify that framing protections are applied to all pages, especially those containing sensitive actions like account deletion or financial transfers. Legacy frame-busting JavaScript can be used as a defense-in-depth measure."
    },
    "web-low-006": {
        "prevention": "Prevent username enumeration by standardizing error messages across authentication endpoints. Whether a username exists or the password is incorrect, the application should return a generic message such as 'Invalid credentials'.",
        "solution": "Implement rate limiting and account lockout mechanisms to slow down brute-force enumeration attempts. Ensure that response times for valid and invalid users are uniform to prevent timing-based enumeration attacks."
    },
    "web-low-007": {
        "prevention": "Prevent insecure HTTP communication by enforcing TLS encryption globally. Configure the web server to automatically issue a 301 Permanent Redirect from port 80 (HTTP) to port 443 (HTTPS) for all incoming requests.",
        "solution": "Implement HTTP Strict Transport Security (HSTS) with a long max-age and the 'includeSubDomains' directive to ensure browsers only connect securely. Disable legacy plaintext protocols completely."
    },
    "web-low-008": {
        "prevention": "Prevent weak passwords by enforcing a strict password policy that aligns with modern guidelines (e.g., NIST SP 800-63B). Require a minimum length of at least 8-12 characters and check passwords against lists of breached credentials.",
        "solution": "Implement Multi-Factor Authentication (MFA) to provide an additional layer of security in case a password is compromised. Use strong, slow hashing algorithms like Argon2 or bcrypt to protect stored credentials."
    },
    "web-low-009": {
        "prevention": "Prevent the browser from caching sensitive information by explicitly setting the `autocomplete=\"off\"` attribute on sensitive input fields, such as credit card numbers, Social Security Numbers, or one-time passwords.",
        "solution": "Audit forms processing highly sensitive data to ensure compliance with standards like PCI-DSS, which mandate disabling autocomplete. Note that modern browsers may ignore this for standard login forms, so prioritize MFA for authentication."
    },
    "web-low-010": {
        "prevention": "Prevent the leakage of sensitive data in URLs by strictly using HTTP POST requests for transmitting passwords, API keys, and session tokens. Ensure that URL parameters are reserved only for non-sensitive identifiers or pagination.",
        "solution": "Review application routing and API design to eliminate sensitive GET parameters. Configure the application to use the 'Referrer-Policy' header to prevent the leakage of URLs to third-party domains via the Referer header."
    },
    "web-med-001": {
        "prevention": "Prevent reflected XSS by treating all user input as untrusted and applying strict input validation against an allowlist. Context-aware output encoding must be applied before rendering user input in HTML, JavaScript, or attributes.",
        "solution": "Adopt modern frontend frameworks like React or Angular that inherently escape variables by default. Implement a strong Content Security Policy (CSP) to restrict the execution of inline scripts and untrusted external sources."
    },
    "web-med-002": {
        "prevention": "Prevent stored XSS by sanitizing data both upon input and output. Ensure that data stored in databases (such as comments or profile bios) is strictly validated and stripped of malicious HTML tags using established libraries.",
        "solution": "Use HTML purifiers if the application requires rich text input. Deploy a robust CSP and regularly audit the application with dynamic application security testing (DAST) tools to catch persistent injection flaws."
    },
    "web-med-003": {
        "prevention": "Prevent DOM-based XSS by avoiding the use of dangerous JavaScript sinks like `eval()`, `innerHTML`, or `document.write()` when handling data from controllable sources such as `location.hash` or `document.referrer`.",
        "solution": "Refactor vulnerable JavaScript code to use safe alternatives like `textContent` or `innerText`. Employ static analysis tools in the CI/CD pipeline to detect unsafe data flows in client-side code before deployment."
    },
    "web-med-004": {
        "prevention": "Prevent CSRF by implementing anti-CSRF tokens for all state-changing requests. These tokens must be unique per session, unpredictable, and strictly validated on the server side before the action is executed.",
        "solution": "Leverage the 'SameSite' attribute on session cookies (setting it to 'Lax' or 'Strict') to prevent browsers from sending cookies along with cross-site requests. Ensure that sensitive actions require re-authentication."
    },
    "web-med-005": {
        "prevention": "Prevent open redirects by avoiding the direct use of user-supplied input to dictate redirection targets. If redirection parameters are necessary, validate the input against a strict allowlist of authorized domains or use indirect identifiers.",
        "solution": "Refactor the application to use server-side mapping for redirects. If an external redirect is unavoidable, implement an interstitial warning page that requires explicit user confirmation before navigating away from the trusted site."
    },
    "web-med-006": {
        "prevention": "Prevent HTML injection by enforcing strict input validation and consistently applying HTML entity encoding to all user-generated content. Treat all incoming data as untrusted, ensuring that structural characters like '<' and '>' are safely escaped.",
        "solution": "Use secure rendering functions provided by modern web frameworks. If the application explicitly requires HTML input, use a robust, actively maintained HTML sanitizer library to strip away dangerous tags and attributes."
    },
    "web-med-007": {
        "prevention": "Prevent Insecure Direct Object References (IDOR) by implementing robust access control checks at the data layer. Every request to access or modify a resource must verify that the authenticated user has the explicit authorization to do so.",
        "solution": "Replace predictable sequential identifiers (like integers) with cryptographically secure, unpredictable values like UUIDs. Ensure that unit and integration tests specifically validate access boundaries for different user roles."
    },
    "web-med-008": {
        "prevention": "Prevent path traversal by avoiding the direct mapping of user input to file system paths. If file inclusion or reading is necessary, validate the input against a strict allowlist of permitted filenames without directory traversal characters.",
        "solution": "Implement chroot jails or restrictive file system permissions so the web application process cannot access sensitive directories like `/etc`. Normalize all file paths and verify they reside within the intended base directory before processing."
    },
    "web-med-009": {
        "prevention": "Prevent HTTP Parameter Pollution (HPP) by standardizing how the application framework handles duplicate parameters. Ensure that input validation logic strictly dictates whether multiple values are allowed and rejects malformed requests.",
        "solution": "Configure a Web Application Firewall (WAF) to detect and block requests containing duplicate parameters that violate the expected schema. Audit backend APIs to ensure they process parameters securely and unambiguously."
    },
    "web-med-010": {
        "prevention": "Prevent CORS misconfigurations by explicitly defining a strict allowlist of trusted origins. Never dynamically echo the 'Origin' header from the request into the 'Access-Control-Allow-Origin' response header without rigorous validation.",
        "solution": "Ensure that 'Access-Control-Allow-Credentials' is only set to 'true' when absolutely necessary, and never pair it with the wildcard '*' origin. Regularly audit CORS policies on all API endpoints for overly permissive rules."
    },
    "web-high-001": {
        "prevention": "Prevent classic SQL injection by exclusively using parameterized queries (prepared statements) or Object-Relational Mapping (ORM) frameworks. Never concatenate user input directly into dynamic SQL query strings.",
        "solution": "Implement strict input validation and type checking for all application inputs. Configure the database with least privilege, ensuring the web application's database user cannot execute administrative commands or access system files."
    },
    "web-high-002": {
        "prevention": "Prevent blind SQL injection through the universal application of parameterized queries across all database interactions. Ensure that boolean flags or sleep functions cannot be evaluated by the database engine by treating all input as literal data.",
        "solution": "Deploy a robust Web Application Firewall (WAF) capable of detecting time-based and boolean inference patterns. Monitor database query logs for anomalous execution times and repetitive, slightly modified queries indicative of automated tools."
    },
    "web-high-003": {
        "prevention": "Prevent OS command injection by avoiding the execution of system commands from within the application code entirely. If calling native binaries is unavoidable, use secure APIs that do not invoke a shell (e.g., `execFile` in Node.js) and pass arguments strictly as an array.",
        "solution": "Enforce strict input validation using allowlists for any data passed to external commands. Run the web application process with the lowest possible privileges and utilize containerization or sandboxing to limit the impact of a potential compromise."
    },
    "web-high-004": {
        "prevention": "Prevent Server-Side Template Injection (SSTI) by treating all user input as data, not as executable code within the template engine. Avoid passing user input directly into functions that evaluate or render raw templates dynamically.",
        "solution": "Use sandboxed environments provided by modern templating engines (e.g., Jinja2's SandboxedEnvironment) to disable access to dangerous built-in functions. Regularly update the template engine and audit code for dynamic template generation."
    },
    "web-high-005": {
        "prevention": "Prevent file upload RCE by implementing strict file type validation using magic numbers, rather than relying on file extensions or MIME types. Ensure uploaded files are renamed and stored in a directory with execution permissions completely disabled.",
        "solution": "Store uploaded files on a separate, dedicated storage service (like AWS S3) rather than the local file system. Strip all metadata (like EXIF data) and re-encode images to neutralize embedded payloads before saving."
    },
    "web-high-006": {
        "prevention": "Prevent Server-Side Request Forgery (SSRF) by validating all user-supplied URLs against a strict allowlist of permitted domains. Never allow the server to fetch resources from internal IP ranges (e.g., 127.0.0.1, 169.254.169.254, 10.0.0.0/8).",
        "solution": "Implement network segmentation to ensure the web server cannot access internal administrative interfaces or cloud metadata endpoints. Use a dedicated proxy for outbound requests with strict filtering rules."
    },
    "web-high-007": {
        "prevention": "Prevent Local File Inclusion (LFI) by eliminating the dynamic inclusion of files based on user input. If dynamic file loading is required, map user input to a hardcoded list of safe file paths using a strict switch statement or dictionary.",
        "solution": "Configure the PHP environment securely by disabling settings like `allow_url_include` and enforcing `open_basedir` restrictions. Audit the server to ensure sensitive log files are not readable by the web server user."
    },
    "web-high-008": {
        "prevention": "Prevent XML External Entity (XXE) attacks by explicitly disabling external entity resolution (ENTITIES) and Document Type Definitions (DTDs) in the application's XML parser configuration. Modern parsers should be configured to reject external references securely.",
        "solution": "Migrate from XML to less complex data formats like JSON where possible. If XML is mandatory, patch the underlying XML parsing libraries to the latest versions and implement positive input validation on the payload structure."
    },
    "web-high-009": {
        "prevention": "Prevent insecure deserialization by avoiding the deserialization of untrusted data entirely. Use safe, language-agnostic data formats like JSON or Protocol Buffers instead of native object serialization (e.g., PHP's serialize or Java's ObjectInputStream).",
        "solution": "If native deserialization is unavoidable, implement strict object type validation (Look-Ahead Object Input Streams) to ensure only authorized classes are instantiated. Monitor the application for known gadget chains and keep all libraries strictly up to date."
    },
    "web-high-010": {
        "prevention": "Prevent NoSQL injection by ensuring that user input is strictly cast to the expected data type (e.g., ensuring a password is a string and not an object) before passing it to database queries. Avoid evaluating raw JSON objects directly as query parameters.",
        "solution": "Utilize Mongoose or similar Object Document Mappers (ODMs) that enforce strict schemas. Sanitize inputs to explicitly remove NoSQL operators (like `$ne`, `$gt`, `$regex`) if the framework does not handle this automatically."
    },
    "web-crit-001": {
        "prevention": "Prevent Log4Shell by ensuring that the Apache Log4j library is updated to version 2.17.1 or higher, which disables JNDI lookups by default. Implement robust software supply chain monitoring to detect outdated and vulnerable dependencies.",
        "solution": "If patching is immediately impossible, apply the JVM parameter `-Dlog4j2.formatMsgNoLookups=true` or remove the `JndiLookup` class from the classpath. Deploy a Web Application Firewall (WAF) to detect and block incoming JNDI payload strings."
    },
    "web-crit-002": {
        "prevention": "Prevent Apache Struts OGNL Injection by maintaining a rigorous patch management lifecycle for all third-party frameworks. Do not expose internal error handling mechanisms to user-controllable inputs, such as the `Content-Type` header.",
        "solution": "Upgrade Apache Struts to the latest secure version immediately. Deploy a WAF with specialized rules to detect OGNL expression payloads and enforce strict network egress filtering to prevent remote code execution from establishing reverse shells."
    },
    "web-crit-003": {
        "prevention": "Prevent ProxyLogon and similar SSRF chains by restricting access to administrative and backend interfaces (like the Exchange Control Panel) to trusted internal networks or via a VPN. Do not expose critical infrastructure directly to the public internet.",
        "solution": "Apply all out-of-band security updates provided by Microsoft for Exchange Server. Utilize security tools to proactively scan for indicators of compromise (IoCs), such as unexpected webshells in the Exchange directories."
    },
    "web-crit-004": {
        "prevention": "Prevent Spring4Shell by updating the Spring Framework to secure versions (5.3.18+ or 5.2.20+) and upgrading Apache Tomcat. Restrict data binding configurations to prevent arbitrary manipulation of the ClassLoader and internal properties.",
        "solution": "Implement an explicit allowlist (using `setAllowedFields`) for Spring data binding to tightly control which fields can be populated by user input. Monitor the web root for unauthorized file creations, specifically JSP webshells."
    },
    "web-crit-005": {
        "prevention": "Prevent critical SQLi vulnerabilities in enterprise file transfer software by employing parameterized queries exclusively. Conduct rigorous, independent penetration testing and source code reviews for any software handling sensitive organizational data.",
        "solution": "Apply vendor-supplied patches immediately upon release. Implement network-level access controls to restrict access to the file transfer interface, and deploy Database Activity Monitoring (DAM) to detect massive, anomalous data exfiltration attempts."
    },
    "web-crit-006": {
        "prevention": "Prevent supply chain backdoor attacks by utilizing reproducible builds and independently verifying the integrity of upstream open-source packages. Establish a strict vetting process for maintainers and code contributions in critical infrastructure components.",
        "solution": "Downgrade or replace the compromised library (e.g., reverting XZ Utils to version 5.4.6) immediately across all affected systems. Continuously monitor system performance and authentication logs for latency anomalies or unauthorized access attempts."
    },
    "web-crit-007": {
        "prevention": "Prevent Heartbleed by ensuring that the OpenSSL library is kept up to date. Disable the TLS Heartbeat extension entirely during compilation if it is not explicitly required by the server architecture.",
        "solution": "Upgrade OpenSSL to a patched version immediately. Because secret keys may have been exposed, administrators must revoke and reissue all SSL/TLS certificates, and force a password reset for all user accounts."
    },
    "web-crit-008": {
        "prevention": "Prevent Shellshock by updating the GNU Bash shell to the patched version that properly sanitizes function definitions passed via environment variables. Deprecate the use of legacy CGI scripts that unsafely map HTTP headers to environment variables.",
        "solution": "Apply the official patches for CVE-2014-6271 and subsequent related CVEs across all Linux/Unix systems. Migrate web applications away from CGI-based architectures to modern application servers (like FastCGI, WSGI, or Node.js)."
    },
    "web-crit-009": {
        "prevention": "Prevent ImageTragick by ensuring that ImageMagick is updated to a version that properly sanitizes delegate commands. Disable the processing of vulnerable image formats (like MVG, MSL, and EPS) completely in the `policy.xml` configuration file.",
        "solution": "Validate all uploaded files using strict magic number checks and process them in a heavily sandboxed or containerized environment. Avoid using shell-based tools for image processing when secure, native libraries are available."
    },
    "web-crit-010": {
        "prevention": "Prevent PHP Object Injection by completely avoiding the use of `unserialize()` on untrusted, user-supplied data. Utilize secure, text-based data formats like `json_decode()` for handling serialized data streams.",
        "solution": "If legacy code requires `unserialize()`, ensure that it is wrapped with HMAC signatures to verify data integrity before deserialization. Regularly audit the codebase and dependencies to eliminate classes with dangerous magic methods (`__destruct`, `__wakeup`) that could serve as gadgets."
    }
}

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Task 1: Find ALL instances of `command: "...",` inside `methodology` arrays and REMOVE THEM completely.
    # We will use regex to find `command: "..."` or `command: '...'` and remove it, along with trailing/leading comma/spaces.
    # e.g., `command: "something",` -> ``
    # Note: Because the user wants to delete the line if it is on a separate line, but it is inline, removing the field is the correct approach.
    content = re.sub(r',\s*command:\s*(".*?"|\'.*?\')', '', content)
    content = re.sub(r'command:\s*(".*?"|\'.*?\'),\s*', '', content)
    
    # Task 2: Expand prevention and solution fields for EVERY lab.
    # The labs are objects in an array. We can insert prevention and solution before the closing `}` of each lab object.
    # Let's find all `id: "web-..."` and replace the object end with the prevention/solution.
    # A robust way is to parse the file line by line or use regex.
    # Since we know `labType: "black-box"` is the last field before `}`, let's replace that.
    # Actually, some might end with `labType: "black-box",` or `labType: "black-box" \n }`.
    
    for lab_id, details in lab_details.items():
        if lab_id in content:
            # We want to replace any existing prevention/solution if they exist.
            # But they don't seem to exist. We will just append them before the `}` of the lab object.
            # Find the start of the lab object
            pattern = re.compile(rf'(id:\s*"{lab_id}".*?)(labType:\s*"[^"]*")(,?)(\s*}})', re.DOTALL)
            
            def replacer(match):
                prefix = match.group(1)
                lab_type = match.group(2)
                comma = match.group(3)
                suffix = match.group(4)
                
                prev_text = details['prevention'].replace('"', '\\"')
                sol_text = details['solution'].replace('"', '\\"')
                
                added_fields = f',\n    prevention: "{prev_text}",\n    solution: "{sol_text}"'
                
                # If labType didn't have a comma, we add it.
                return f"{prefix}{lab_type}{added_fields}{suffix}"

            content = pattern.sub(replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates completed successfully.")
