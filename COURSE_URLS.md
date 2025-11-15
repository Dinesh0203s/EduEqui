# Course URLs - Correct Course IDs

## Mathematics Course
**Correct URL**: `http://localhost:3000/course/691828a508e836c68a98310e`
**Course ID**: `691828a508e836c68a98310e`

## Science Course
**Correct URL**: `http://localhost:3000/course/691828a508e836c68a983113`
**Course ID**: `691828a508e836c68a983113`

## How to Access Courses

### Option 1: Use Dashboard (Recommended)
1. Go to `http://localhost:3000/dashboard`
2. Click "Continue Learning" on the course card
3. This will automatically use the correct course ID

### Option 2: Direct URL
Use the correct course ID in the URL:
- Mathematics: `/course/691828a508e836c68a98310e`
- Science: `/course/691828a508e836c68a983113`

### ❌ Invalid URLs
- `/course/course-maths` - This doesn't exist
- `/course/mathematics` - This doesn't exist
- `/course/maths` - This doesn't exist

The course IDs are MongoDB ObjectIds, not friendly names.

