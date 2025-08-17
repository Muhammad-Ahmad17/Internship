# AWS IAM — Deep Dive

> A comprehensive, practical reference for Identity and Access Management on AWS.

---

## Table of contents
1. Overview and purpose
2. Core concepts (Users, Groups, Roles, Policies)
3. Policy language and elements (Version, Statement, Effect, Action, Resource, Condition)
4. Policy types and where they apply
   - Identity-based
   - Resource-based
   - Permissions boundaries
   - Service Control Policies (SCPs)
   - Session policies and inline policies
5. Policy evaluation logic (how AWS decides Allow vs Deny)
6. Condition keys, operators, and examples
7. Resource ARNs and wildcards: patterns and pitfalls
8. EC2-specific controls & cost-safety patterns
9. Example policies (real-world ready)
   - Developer: launch only Ubuntu t2/t3.micro + S3 bucket + CloudWatch
   - Deny risky services (quick test for AccessDenied)
   - Permissions boundary example for delegated admin
   - Instance profile role for EC2 to access S3
10. Testing & debugging policies (Console, CLI, Policy Simulator, CloudTrail)
11. Best practices and operational tips
12. Troubleshooting checklist
13. Appendix: quotas & limits, glossary

---

## 1. Overview and purpose

IAM (Identity and Access Management) is the central AWS service for controlling who can do what in your account. It provides identity constructs (users, groups, roles) and an expressive policy language to grant or deny actions on AWS resources.

This deep dive assumes you already know the basics and focuses on practical, secure, and auditable ways to design policies for real teams and real environments.

---

## 2. Core concepts

### IAM users
- Long-lived identities for people or applications.
- Have console passwords and/or access keys for the CLI/API.

### IAM groups
- Collections of users with shared permissions; helpful for role-based access management (RBAC).

### IAM roles
- Assume-able identities that issue temporary credentials (STS).
- Common uses: EC2 instance profiles, cross-account access, service-to-service permissions.

### Policies
- JSON documents that define Allow or Deny rules. Attach policies to users, groups, or roles.

>       Role: Security guard.
>       Policy: The instructions in the guard’s handbook.

---

## 3. Policy language & elements (concise reference)

Policy structure (minimal):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "OptionalId",
      "Effect": "Allow|Deny",
      "Action": ["service:Action"],
      "Resource": ["arn:aws:service:region:acct:resource"],
      "Condition": { ... }
    }
  ]
}
```

- **Version**: language version; use `2012-10-17` for current features.
- **Sid**: statement identifier (optional helpful label).
- **Effect**: `Allow` or `Deny`. An explicit `Deny` always wins.
- **Action**: API operations (you can use wildcards: `ec2:*` or `s3:GetObject`).
- **Resource**: ARNs the statement applies to. Use `*` for all.
- **Condition**: key/value expressions that refine when the statement applies.

---

## 4. Policy types (where & when they apply)

### Identity-based policies
Attached to users, groups, or roles. They grant or deny permissions **to** the principal.

### Resource-based policies
Attached to resources (S3 bucket policy, SNS topic policy, SQS queue policy). They grant permissions **to principals** for that resource.

### Permissions boundaries
A managed policy attached as a boundary that defines the *maximum* permissions an identity-based policy can grant. The effective permissions are the intersection of the identity policy and the permissions boundary.

### Service Control Policies (SCPs)
Used in AWS Organizations. SCPs set the maximum permissions allowed in member accounts—**they do not grant** permissions by themselves. A principal’s effective allowed actions must be permitted by the identity policy *and* the SCP.

### Session policies & inline policies
Session policies are passed in when assuming a role (further restricts). Inline policies are attached directly to a single user/role (not reusable like managed policies).

---

## 5. Policy evaluation logic (how AWS decides Allow vs Deny)

High-level rules (practical form):

1. By default, everything is denied.
2. An explicit `Allow` from any applicable policy may permit the action — *but* only if there is no explicit `Deny` anywhere.
3. An explicit `Deny` in any applicable policy (identity or resource or SCP) overrides any `Allow`.
4. For organization-managed accounts, the action must be allowed by identity-based policies *and* by an organization's SCP (if present).

**Practical consequence:** Use explicit Deny intentionally (for guardrails). Use intersection patterns (SCP + identity) for corporate controls. (See official evaluation logic for exact edge cases.)

---

## 6. Condition keys, operators & examples

Conditions let you make policies contextual and attribute-based. Condition keys include global keys (like `aws:SourceIp`, `aws:RequestedRegion`, `aws:MultiFactorAuthPresent`) and service-specific keys (for EC2, `ec2:InstanceType`, `ec2:ImageId`, `ec2:VolumeSize`, etc.).

Operators include `StringEquals`, `StringLike`, `ForAnyValue:StringLike`, `NumericLessThan`, `Bool`, `DateGreaterThan`, and many more.

### Example: Require MFA for sensitive actions
```json
{
  "Effect": "Deny",
  "Action": "iam:DeleteAccessKey",
  "Resource": "*",
  "Condition": {
    "Bool": { "aws:MultiFactorAuthPresent": "false" }
  }
}
```

### Example: Limit EC2 `RunInstances` to specific instance types and AMIs
```json
{
  "Effect": "Allow",
  "Action": "ec2:RunInstances",
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "ec2:InstanceType": "t2.micro",
      "ec2:ImageId": "ami-0EXAMPLEubuntu"
    }
  }
}
```

> Note: EC2 condition keys are service-defined; check the EC2 docs if a key doesn't behave as you expect.

---

## 7. Resource ARNs, patterns & pitfalls

- ARNs have service-specific formats: `arn:aws:s3:::bucket-name/object`, `arn:aws:ec2:region:acct:instance/instance-id`.
- Wildcards are powerful but risky. Example: `arn:aws:s3:::mybucket/*` matches objects, `arn:aws:s3:::mybucket` matches the bucket itself.
- Some API actions create resources (e.g., `RunInstances`) — restricting resource ARNs for those actions can be tricky. Often you must use `Resource: "*"` and rely on `Condition` keys to limit parameters (instance type, AMI, tags).

---

## 8. EC2-specific controls & cost-safety patterns

When you want to allow people to launch development VMs but prevent costly mistakes, combine `Condition` keys and explicit `Deny` rules:

- **Allow** `RunInstances` but restrict `ec2:InstanceType` to small types (`t2.micro`, `t3.micro`, `t4g.micro`).
- **Deny** `ec2:RunInstances` if `ec2:InstanceType` equals large families (e.g., `m5.*`, `p*`, `g*`) to prevent GPU/large memory launches.
- **Use** `ec2:VolumeSize` to prevent large EBS volumes from being created.
- **Deny** allocation of Elastic IPs (costly if left unused) using `ec2:AllocateAddress`.
- **Deny** `ec2:CreateSnapshot` or `ec2:RegisterImage` if you want to avoid storing large snapshots (snapshots incur storage costs).

These patterns protect your budget while allowing hands-on learning.

---

## 9. Example policies (copy/paste ready)

> Replace `123456789012` and `ami-0EXAMPLEubuntu` with your account ID and the real AMI ID for your region. Always test in a sandbox account.

### 9.1 Developer — minimal safe EC2 + S3 + CloudWatch

This policy lets a user launch `t2.micro`/`t3.micro`, manage their instances, create a key pair, manage security groups, store code in a single S3 bucket, and view/use CloudWatch metrics and logs.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EC2Describe",
      "Effect": "Allow",
      "Action": ["ec2:Describe*"],
      "Resource": "*"
    },
    {
      "Sid": "EC2RunRestricted",
      "Effect": "Allow",
      "Action": [
        "ec2:RunInstances",
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:TerminateInstances"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:InstanceType": ["t2.micro", "t3.micro"],
          "ec2:ImageId": "ami-0EXAMPLEubuntu"
        }
      }
    },
    {
      "Sid": "EC2Networking",
      "Effect": "Allow",
      "Action": [
        "ec2:CreateKeyPair",
        "ec2:DeleteKeyPair",
        "ec2:ImportKeyPair",
        "ec2:CreateSecurityGroup",
        "ec2:DeleteSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupIngress"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3LimitedBucket",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-dev-code-bucket",
        "arn:aws:s3:::my-dev-code-bucket/*"
      ]
    },
    {
      "Sid": "CloudWatchView",
      "Effect": "Allow",
      "Action": ["cloudwatch:GetMetricData", "cloudwatch:ListMetrics", "logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "*"
    }
  ]
}
```

**Notes:**
- Use a specific AMI ID for `ec2:ImageId` (Ubuntu AMI for your region) to avoid other OS images.
- This policy still requires careful testing — `RunInstances` uses `Resource: "*"` because the instance is created by the API call; conditions are used to limit parameters.


### 9.2 Quick deny-policy for testing AccessDenied

Attach this policy (or a similar explicit `Deny`) to simulate `AccessDenied` behavior when the user attempts certain services.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyRDSandLambda",
      "Effect": "Deny",
      "Action": ["rds:*", "lambda:*"],
      "Resource": "*"
    }
  ]
}
```

### 9.3 Permissions boundary example (managed policy)

A permissions boundary is a managed policy you attach as the maximum allowed permissions. The boundary below caps allowed actions to a small set; any identity-based policy can only grant actions that are also in this boundary (intersection rule applies).

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:Describe*", "ec2:StartInstances", "ec2:StopInstances", "s3:ListBucket", "s3:GetObject","s3:PutObject"],
      "Resource": "*"
    }
  ]
}
```

Attach this as a permissions boundary to a role or user so their identity policies cannot exceed it.


### 9.4 Instance profile (trust policy) for EC2 => read-only S3

**Trust policy** (when creating a role for EC2):
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Permissions policy** attached to the role (lets EC2 read a single bucket):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-dev-code-bucket",
        "arn:aws:s3:::my-dev-code-bucket/*"
      ]
    }
  ]
}
```

Attach the role to the EC2 instance as an *instance profile*; your code on the VM can then access S3 without long-lived keys.

---

## 10. Testing & debugging policies

### Tools
- **IAM Policy Simulator (console or `aws iam simulate-principal-policy`)** — test whether a principal can perform a given action under the effective policies.
- **Access Advisor** (in the console) — shows service access history per principal.
- **CloudTrail** — shows API calls and `AccessDenied` events; crucial for auditing.
- **aws sts get-caller-identity** — confirms which identity you are using.

### Quick CLI tests
- Confirm identity:
```bash
aws sts get-caller-identity --profile test-user
```
- Test allowed EC2 describe (should succeed):
```bash
aws ec2 describe-instances --profile test-user
```
- Trigger an AccessDenied (try to list lambda functions if not permitted):
```bash
aws lambda list-functions --profile test-user
# Expect: An error with AccessDeniedException or AccessDenied
```
- Simulate a policy decision:
```bash
aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:user/test-user --action-names ec2:RunInstances
```

---

## 11. Best practices & operational tips

- Follow **least privilege** — start with nothing, add permissions as needed.
- Prefer **roles** over long-lived access keys; use instance profiles for EC2.
- Use **SCPs** and **permissions boundaries** to enforce organizational guardrails.
- Require **MFA** for high-privilege actions (`aws:MultiFactorAuthPresent`).
- Use **tags + ABAC** (attribute-based access control) for scalable policies (e.g., allow actions only on resources with `Owner=${aws:username}`).
- Monitor with **CloudTrail** and automate remediation (lambda that disables risky resources).

---

## 12. Troubleshooting checklist (when users see AccessDenied)
1. Verify identity: `aws sts get-caller-identity`
2. Use Policy Simulator to reproduce the decision.
3. Check for an SCP on the account (Organizations).
4. Check permission boundaries on the role/user.
5. Look for a resource-based policy that might Deny.
6. Inspect CloudTrail for the API call and request parameters.

---

## 13. Appendix

### Quotas & limits (reasonably important)
- Managed policy max size: **6,144 characters** (white space not counted). Keep policies modular using multiple managed policies.
- Role name, group name, etc. have character limits — see IAM quotas.

### Glossary
- **ABAC**: Attribute-based access control.
- **SCP**: Service Control Policy.
- **RCP**: Resource Control Policy (rare, in Organizations context).
- **Principal**: The identity making a request (user, role, service).

---


