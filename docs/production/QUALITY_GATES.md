GUNIMI ENGINEERING RULE

An operation is NEVER considered complete because:

✓ TypeScript passes
✓ ESLint passes
✓ Build passes

Those are only compilation gates.

Every operation must pass ALL Production Quality Gates before it can be reported as COMPLETE.

No exceptions.
GUNIMI PRODUCTION QUALITY GATES v1.0
GATE 1

TypeScript

npm run type-check

Must return:

0 errors
GATE 2

ESLint

npm run lint

Must return:

0 errors
0 warnings
GATE 3

Production Build

npm run build

Must:

compile successfully
contain no unexpected warnings
contain only expected dynamic routes
GATE 4

Browser Console

Open every affected page.

Must contain:

no React errors
no hydration errors
no ReferenceError
no TypeError
no missing locale messages
no CSP errors
no failed JS chunks

Expected result:

0 Console Errors
GATE 5

Network

Chrome DevTools → Network

Verify:

0 HTTP 500

0 HTTP 404

0 failed fetches

0 aborted requests
GATE 6

Runtime Logs

After deployment.

Verify:

0 Exceptions

0 Unhandled Rejections

0 Missing Environment Variables

0 ReferenceErrors

0 TypeErrors
GATE 7

Production Smoke Test

Every affected workflow must be executed.

Minimum:

Register
Login
Logout
Today
Deals
Contacts
Companies
Tasks
Settings
Invite Member
Contact Form
AI
Workspace creation

Every workflow:

PASS

or

FAIL

CRITICAL RULE

If ANY gate fails:

The operation is NOT COMPLETE.

Do NOT report:

"Production Ready"

Do NOT report:

"Completed"

Instead report:

FAILED QUALITY GATE

Gate:

...

Reason:

...

Blocking Issue:

...

Next Required Action:

...
FINAL REPORT FORMAT

Every operation must finish with:

QUALITY GATES

Gate 1
PASS

Gate 2
PASS

Gate 3
PASS

Gate 4
PASS

Evidence:
...

Gate 5
PASS

Evidence:
...

Gate 6
PASS

Evidence:
...

Gate 7
PASS

Evidence:
...

OVERALL STATUS

PRODUCTION READY

YES / NO