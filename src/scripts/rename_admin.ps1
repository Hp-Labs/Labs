Copy-Item -Path "src/app/hp-45641c95fa7157d2" -Destination "src/app/hplabs" -Recurse -Force
Remove-Item -Path "src/app/hplabs/users" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/collaborations" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/labs" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/lab-freshness" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/detector" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/support" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/vuln-pipeline" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/partner-students" -Recurse -Force -ErrorAction SilentlyContinue

Copy-Item -Path "src/app/hp-45641c95fa7157d2/users" -Destination "src/app/hplabs/shadow" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/collaborations" -Destination "src/app/hplabs/nexus" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/labs" -Destination "src/app/hplabs/forge" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/lab-freshness" -Destination "src/app/hplabs/pulse" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/detector" -Destination "src/app/hplabs/sentinel" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/support" -Destination "src/app/hplabs/comms" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/vuln-pipeline" -Destination "src/app/hplabs/armory" -Recurse -Force
Copy-Item -Path "src/app/hp-45641c95fa7157d2/partner-students" -Destination "src/app/hplabs/operatives" -Recurse -Force
