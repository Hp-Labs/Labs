# 1. Clean up the messed up folders in hplabs
Remove-Item -Path "src/app/hplabs/shadow/users" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/nexus/collaborations" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/forge/labs" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/pulse/lab-freshness" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/sentinel/detector" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/comms/support" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/armory/vuln-pipeline" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/app/hplabs/operatives/partner-students" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Remove the old original dashboard folder (since we moved everything to hplabs)
Remove-Item -Path "src/app/hp-45641c95fa7157d2" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Also remove any duplicated nested folders that might have been copied inside hplabs itself
Remove-Item -Path "src/app/hplabs/hp-45641c95fa7157d2" -Recurse -Force -ErrorAction SilentlyContinue
