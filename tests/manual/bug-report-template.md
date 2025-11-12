# Bug Report Template

## Bug Information

**Bug ID**: [AUTO-GENERATED OR MANUAL]  
**Date Reported**: [YYYY-MM-DD]  
**Reported By**: [Name/Email]  

---

## Summary
**Title**: [Brief, descriptive title of the issue]

**Description**: [Detailed description of what went wrong]

---

## Classification

**Severity**: 
- [ ] **Critical** - Application crashes, data loss, security vulnerability
- [ ] **High** - Major feature not working, blocking user workflow
- [ ] **Medium** - Feature works but with issues, workaround available
- [ ] **Low** - Minor UI issues, typos, cosmetic problems

**Priority**:
- [ ] **P1** - Fix immediately (Critical blocker)
- [ ] **P2** - Fix in current sprint (High impact)
- [ ] **P3** - Fix in next sprint (Medium impact)
- [ ] **P4** - Fix when convenient (Low impact)

**Category**:
- [ ] Functional Bug
- [ ] UI/UX Issue
- [ ] Performance Issue
- [ ] Security Issue
- [ ] Accessibility Issue
- [ ] Data Issue
- [ ] Integration Issue

---

## Environment Details

**Browser**: [Chrome 120, Firefox 121, Safari 17, etc.]  
**Operating System**: [Windows 11, macOS 14, Ubuntu 22.04, etc.]  
**Device**: [Desktop, iPhone 15, Samsung Galaxy S23, etc.]  
**Screen Resolution**: [1920x1080, 375x667, etc.]  
**Network**: [WiFi, 4G, Slow 3G, etc.]

**Application Info**:
- **URL**: [http://localhost:5173 or production URL]
- **Version**: [Git commit hash or version number]
- **Build**: [Development/Production]

---

## Steps to Reproduce

**Preconditions**: [Any setup required before reproducing the bug]

1. Step 1: [Be specific about what to click, type, or do]
2. Step 2: [Include exact text to enter, buttons to click]
3. Step 3: [Continue until the bug occurs]
4. Step N: [Final step that triggers the issue]

**Test Data Used**: [Specific data that was used during testing]

---

## Expected vs Actual Results

**Expected Result**: [What should happen according to requirements/design]

**Actual Result**: [What actually happened - describe the incorrect behavior]

---

## Supporting Evidence

### Screenshots
- [ ] Screenshot attached showing the issue
- [ ] Before/after screenshots (if applicable)
- [ ] Multiple browser screenshots (if browser-specific)

**Screenshot Notes**: [Brief description of what each screenshot shows]

### Console Logs
```
[Paste any browser console errors or warnings here]
```

### Network Requests
```
[Paste any relevant failed API calls or network errors]
```

### Video Recording
- [ ] Screen recording attached
- [ ] Video URL: [Link to video if hosted elsewhere]

---

## Additional Information

**Frequency**: 
- [ ] Always (100%)
- [ ] Often (>75%)
- [ ] Sometimes (25-75%)
- [ ] Rarely (<25%)
- [ ] One-time occurrence

**User Impact**: [How many users are affected? What workflows are blocked?]

**Business Impact**: [Revenue impact, customer satisfaction impact, etc.]

**Workaround Available**: 
- [ ] Yes - [Describe the workaround]
- [ ] No

---

## Technical Analysis (For Developers)

**Suspected Component**: [Which part of the codebase might be involved]

**Related Files**: [List of potentially affected files]

**API Endpoints Involved**: [If applicable]

**Database Tables Affected**: [If applicable]

**Similar Issues**: [Link to related bugs or tickets]

---

## Testing Notes

**Browsers Tested**:
- [ ] Chrome - Version: _____
- [ ] Firefox - Version: _____
- [ ] Safari - Version: _____
- [ ] Edge - Version: _____

**Devices Tested**:
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile Phone

**Test Environments**:
- [ ] Development
- [ ] Staging
- [ ] Production

---

## Resolution Tracking

**Assigned To**: [Developer name]  
**Assigned Date**: [YYYY-MM-DD]  
**Target Fix Date**: [YYYY-MM-DD]  

**Status**:
- [ ] New
- [ ] In Progress
- [ ] Fixed - Pending Testing
- [ ] Fixed - Verified
- [ ] Closed
- [ ] Won't Fix
- [ ] Duplicate

**Resolution Notes**: [Brief description of how the issue was fixed]

**Fix Verification**:
- [ ] Verified in Development
- [ ] Verified in Staging  
- [ ] Verified in Production

---

## Quality Assurance

**Retested By**: [QA Tester name]  
**Retest Date**: [YYYY-MM-DD]  
**Retest Result**: 
- [ ] ✅ PASS - Bug Fixed
- [ ] ❌ FAIL - Bug Still Exists
- [ ] ⚠️ PARTIAL - Partially Fixed

**Regression Testing**:
- [ ] Related functionality tested
- [ ] No new bugs introduced
- [ ] Performance not degraded

---

## Communication Log

| Date | Who | Action/Comment |
|------|-----|----------------|
| [YYYY-MM-DD] | [Name] | Bug reported |
| [YYYY-MM-DD] | [Name] | Bug reproduced |
| [YYYY-MM-DD] | [Name] | Fix implemented |
| [YYYY-MM-DD] | [Name] | Fix verified |

---

## Related Information

**Related Bugs**: [Links to similar or related bugs]

**User Stories**: [Links to related user stories or requirements]

**Documentation**: [Links to relevant documentation]

**Support Tickets**: [Customer support ticket numbers if applicable]

---

## Example Usage

### Sample Bug Report

**Bug ID**: BUG-001  
**Title**: Cart total shows $0.00 after order placement  
**Severity**: High  
**Priority**: P2  

**Environment**: Chrome 120, Windows 11, localhost:5173

**Steps to Reproduce**:
1. Add desserts to cart (total should be > $0)
2. Navigate to checkout page
3. Fill out all required fields with valid data
4. Click "Submit Order"
5. Observe the bank transfer amount on success page

**Expected**: Bank transfer amount should show calculated total (subtotal + tax + shipping)  
**Actual**: Bank transfer amount shows $0.00

**Console Error**: None  
**Screenshots**: [Attached]  

**User Impact**: Customers cannot see correct payment amount, blocking order completion

**Workaround**: None available

**Status**: Fixed - Pending Testing  
**Assigned To**: Dev Team  
**Fix**: Added orderTotal state to preserve amount before cart clearing

---

*This template should be used for all bug reports to ensure consistency and completeness of information.*