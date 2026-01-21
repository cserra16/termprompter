---
docker:
  image: kalilinux/kali-rolling
  name: demo-kali-01
  workdir: /root
  shell:
    - /bin/bash
---

# Cybersecurity Demo - Part 1: Basics with Kali Linux

This demo guides you through setting up a cybersecurity lab using the official Kali Linux Docker container.

## Step 1: Update Package Lists
Update the local package index to ensure you can install the latest versions of tools.

```bash
apt update
```

## Step 2: Install Nmap
Install `nmap`, a powerful network scanning tool.

```bash
apt install -y nmap
```

## Step 3: Verify Installation
Check that nmap is installed correctly by verifying its version.

```bash
nmap --version
```

## Step 4: Run a Network Scan
Perform a basic scan against `scanme.nmap.org`. This is a service provided by the Nmap project specifically for testing scans legally.

> **Warning**: Only scan networks and systems you have explicit permission to test. Unauthorized scanning is illegal.

```bash
nmap -v scanme.nmap.org
```

**Expected Output:**
You should see output indicating discovered open ports.
