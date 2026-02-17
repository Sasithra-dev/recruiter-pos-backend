# Recruiter Service API Documentation

## Base URL
`http://localhost:5000/api/v1`

## Authentication & Headers
Required headers for all requests:
- `X-Organisation-Id`: Current Organisation ID (Scope).
- `X-User-Id`: Current User ID (Actor).
- `Content-Type`: `application/json`

## API Standards
- **Scope**: Manages organization-specific entities (Applications/Leads, not Global Candidates).
- **Pagination**: Default `page=1, limit=20` (Max `100`). Response includes `meta.total`.
- **Deletion**: All operations are **Soft Delete** (`archived: true`). Pipelines also use `isActive` for visibility.

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... }, // Object or Array
  "meta": { "total": 100 }, // Optional: Pagination metadata
  "message": "Operation successful" // Optional
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR", // or INTERNAL_ERROR, NOT_FOUND coverage
    "message": "Invalid email format",
    "field": "email" // Optional: for validation errors
  }
}
```

## 1. Common Entity Access (Polymorphic)

### Get Entity
`GET /common/:type/:id`
- **Description**: Unified endpoint to fetch any supported entity (candidate, client, job, pipeline, etc.).
- **Params**:
  - `:type`: `candidate` | `client` | `job`
  - `:id`: Entity ID
- **Query**: `?select=field1,field2`, `?populate=relation:field`

### Common Download
`GET /common/download/:type/:id`
- **Description**: Stream files directly.
- **Types**:
  - `attachment`: Standard file attachment.
  - `candidate-cv`: Active CV.
  - `candidate-image`: Profile picture.

### Archive Entity
`DELETE /common/:type/:id`
- **headers**: `X-Organisation-Id` required.
- **Behavior**: Sets `archived: true`.
- **Standard**: **All** delete operations in this service are soft deletes.
- **Supported Types**: `candidate`, `client`, `job`, `contact`, `guest`, `pipeline`, `activity`, `note`, `tag`.

---

## 2. Candidates

### Create Candidate
`POST /candidates` 

**Payload**: 

```json
{ "firstName": "Alice", "email": "alice@example.com", "jobId": "j1" } 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "c1", "firstName": "Alice", "email": "alice@example.com", "jobId": "j1" }
}
```

### List Candidates
`GET /candidates`

Filters: `?jobId=j1`, `?status=Applied`, `?search=alice`, `?archived=true`

Response:

```json
{
  "success": true,
  "data": [
    { "_id": "c1", "firstName": "Alice", "jobId": "j1", "status": "Applied" }
  ],
  "meta": { "total": 1 }
}
```

### Update Candidate
`PATCH /candidates/:id`

**Payload**:

```json
[
  { "op": "replace", "path": "/firstName", "value": "Alicia" },
  { "op": "add", "path": "/skills/-", "value": "TypeScript" }
]
```

Response:

```json
{
  "success": true,
  "data": { "_id": "c1", "firstName": "Alicia", "skills": ["TypeScript"] }
}
``` 

## 3. Clients 

### Create Client
`POST /clients` 

**Payload**: 

```json
{ "name": "Globex", "website": "globex.com" } 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "cl1", "name": "Globex", "website": "globex.com" }
}
```

### List Clients
`GET /clients`

Filters: `?search=globex`, `?archived=true`, `?page=1&limit=20`

Response:

```json
{
  "success": true,
  "data": [
    { "_id": "cl1", "name": "Globex", "website": "globex.com", "archived": false }
  ],
  "meta": { "total": 1 }
}
```

### Update Client
`PATCH /clients/:id`

**Payload**:

```json
[
  { "op": "replace", "path": "/website", "value": "https://globex.net" }
]
```

Response:

```json
{
  "success": true,
  "data": { "_id": "cl1", "name": "Globex", "website": "https://globex.net" }
}
``` 

## 4. Jobs 

### Create Job
`POST /jobs` 

**Payload**: 

```json
{ "title": "Software Engineer", "clientId": "cl1" } 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "j1", "title": "Software Engineer", "client": "cl1" }
}
```

### List Jobs
`GET /jobs`

Filters: `?client=cl1`, `?search=engineer`, `?archived=true`

Response:

```json
{
  "success": true,
  "data": [
    { "_id": "j1", "title": "Software Engineer", "client": "cl1", "status": "OPEN" }
  ],
  "meta": { "total": 1 }
}
```

### Update Job
`PATCH /jobs/:id`

**Payload**:

```json
[
  { "op": "replace", "path": "/status", "value": "CLOSED" }
]
```

Response:

```json
{
  "success": true,
  "data": { "_id": "j1", "title": "Software Engineer", "status": "CLOSED" }
}
``` 

## 5. Pipelines & Stages 

### Constraints
- **Single Active Pipeline**: An Organization can have only **one** `isActive: true` pipeline per entity type (Client/Job) at a time.
- **Auto-Deactivation**: Creating or Updating a pipeline to `isActive: true` will **automatically deactivate** any other active pipeline of the same type.

### List Pipelines
`GET /pipelines` 

Filters: `?page=1&limit=20` 

> **Note**: Use `PATCH` to change `isActive` status (Deactivate). Use `DELETE` to Remove (`archived`).

Response: 

```json
{ 
  "success": true, 
  "data": [ 
    { "_id": "p1", "name": "Tech Hiring", "entityType": "job" } 
  ], 
  "meta": { "total": 1 } 
} 
```

### Create Pipeline
`POST /pipelines` 

**Payload**: 

```json
{ 
  "name": "Tech Hiring", 
  "entityType": "job" 
} 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "p1", "name": "Tech Hiring", "entityType": "job" }
}
```

**Behavior**: Automatically seeds default stages (e.g., Applied, Interview, Offer).
**Side Effect**: Setting `isActive: true` (default) will **automatically deactivate** any other active pipeline for this entity type. 

### Update Pipeline
`PATCH /pipelines/:id` 

**Payload**: 

```json
[ 
  { "op": "replace", "path": "/name", "value": "Engineering Hiring" },
  { "op": "replace", "path": "/isActive", "value": false } // Deactivate
] 
```

**Note**: Setting `isActive: true` will **automatically deactivate** any other active pipeline for this entity type.

Response:

```json
{
  "success": true,
  "data": { "_id": "p1", "name": "Engineering Hiring", "entityType": "job" }
}
```

### Add Stage
`POST /pipelines/:id/stages` 

**Payload**: 

```json
{ 
  "key": "interview", 
  "label": "Interview", 
  "order": 2 
} 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "p1", "name": "Tech Hiring", "stages": [ { "key": "interview", "label": "Interview" } ] }
}
```

### Update Stage
`PATCH /pipelines/:id/stages/:stageId` 

**Payload**: 

 
```json
[
  { "op": "replace", "path": "/label", "value": "Technical Interview" },
  { "op": "replace", "path": "/order", "value": 3 }
]
``` 
 

Response:

```json
{
  "success": true,
  "data": { "_id": "p1", "stages": [ { "key": "interview", "label": "Technical Interview", "order": 3 } ] }
}
```

### Delete Stage
`DELETE /pipelines/:id/stages/:stageId` 

**Behavior**: Performs a Soft Delete (`archived: true`). 

 

## 6. Activities 

### Create Activity
`POST /activities` 

**Payload**: 

```json
{ 
  "title": "Call with Candidate", 
  "activityType": "CALL", 
  "date": "2023-10-27", 
  "startTime": "10:00", 
  "endTime": "10:30", 
  "entityId": "c1", 
  "entityType": "candidate" 
} 
```
Response:

```json
{
  "success": true,
  "data": { "_id": "a1", "title": "Call with Candidate", "activityType": "CALL" }
}
```

### List Activities
`GET /activities?entityId=c1` 

Filters: `?page=1&limit=20`, `?entityId=c1`, `?activityType=CALL` 

Response:

```json
{
  "success": true,
  "data": [
    { "_id": "a1", "title": "Call with Candidate", "activityType": "CALL" }
  ],
  "meta": { "total": 1 }
}
```

### Update Activity
`PATCH /activities/:id` 

**Payload**: 

```json
[
  { "op": "replace", "path": "/title", "value": "Initial Screening Call" }
]
```

Response:

```json
{
  "success": true,
  "data": { "_id": "a1", "title": "Initial Screening Call", "activityType": "CALL" }
}
```

### Delete Activity
`DELETE /activities/:id` 

## 7. Notes 

### Create Note
`POST /notes` 

**Payload**: 

```json
{ 
  "content": "Candidate is available immediately.", 
  "entityType": "candidate" 
} 
```
Response:

```json
{
  "success": true,
  "data": { "_id": "n1", "content": "Candidate is available immediately.", "entityType": "candidate" }
}
```

### List Notes
`GET /notes?entityId=c1` 

Response:

```json
{
  "success": true,
  "data": [
    { "_id": "n1", "content": "Candidate is available immediately." }
  ],
  "meta": { "total": 1 }
}
```

### Update Note
`PATCH /notes/:id` 

**Payload**: 

```json
[
  { "op": "replace", "path": "/content", "value": "Candidate available from next week." }
]
```

Response:

```json
{
  "success": true,
  "data": { "_id": "n1", "content": "Candidate available from next week." }
}
```

### Delete Note
`DELETE /notes/:id` 

## 8. Contacts & Guests 

### Create Contact
`POST /contacts` 

**Payload**: 

```json
{ "fullName": "Bob", "email": "bob@example.com", "type": "client", "parentId": "cl1" } 
```

Response: 

```json
{ 
  "success": true, 
  "data": { "_id": "c1", "fullName": "Bob", "email": "bob@example.com", "type": "client", "isGuest": false } 
} 
```

### List Contacts
`GET /contacts` 

Response: 

```json
{ 
  "success": true, 
  "data": [ { "_id": "c1", "fullName": "Bob", "isGuest": false } ], 
  "meta": { "total": 1 } 
} 
```

### Update Contact
`PATCH /contacts/:id` 

**Payload**: 

```json
[ 
  { "op": "replace", "path": "/phone", "value": "+1987654321" } 
] 
```

### Convert to Guest
`POST /guests/promote/:id` 

**Payload**: 

 
{ "accessLevel": "viewer" } 
 

Response: 

```json
{ 
  "success": true, 
  "data": { "_id": "c1", "fullName": "Bob", "isGuest": true, "accessLevel": "viewer", "guestStatus": "PENDING" } 
} 
```

### Create Guest
`POST /guests` 

**Payload**: 

```json
{  
  "fullName": "Alice Guest",  
  "email": "alice@example.com",  
  "clientId": "cl1",  
  "accessLevel": "editor"  
} 
```

Response: 

```json
{ 
  "success": true, 
  "data": { "_id": "g1", "fullName": "Alice Guest", "isGuest": true, "accessLevel": "editor", "guestStatus": "PENDING" } 
} 
```

### List Guests
`GET /guests` 

Response: 

```json
{ 
  "success": true, 
  "data": [ { "_id": "g1", "fullName": "Alice Guest", "isGuest": true } ], 
  "meta": { "total": 1 } 
} 
```

### Update Guest
`PATCH /guests/:id` 

**Payload**: 

```json
[ 
  { "op": "replace", "path": "/accessLevel", "value": "admin" } 
] 
```

### Bulk Add / Invite Guest
`POST /guests/invite` 

Response: 

```json
{ 
  "success": true, 
  "data": [ { "_id": "g1", "fullName": "Alice", "isGuest": true } ]  
} 
```

## 9. History 

### List History
`GET /history?entityId=c1` 

Response: 

```json
{ 
  "success": true, 
  "data": [ 
    { 
      "action": "updated", 
      "description": "Candidate John Doe was updated.", 
      "performedBy": "user_id", 
      "createdAt": "2023-10-27T10:00:00Z" 
    } 
  ] 
} 
```

## 10. Tags 

### Create Tag
`POST /tags` 

**Payload**: 

```json
{ 
  "name": "Urgent", 
  "color": "65c123...", // ID of the Tag Color 
  "entityType": "candidate", // 'candidate', 'job', 'client' 
  "organisation": "..." // Optional (inferred from token) 
} 
```

### List Tags
`GET /tags` 

Response: 

```json
{ 
  "success": true, 
  "data": [ 
    {  
      "_id": "...",  
      "name": "Urgent",  
      "color": { "_id": "...", "color": "#FF0000" },  
      "entityType": "candidate"  
    } 
  ] 
} 
```

### Update Tag
`PATCH /tags/:id` 

**Payload**: 

```json
[ 
  { "op": "replace", "path": "/name", "value": "Very Urgent" }, 
  { "op": "replace", "path": "/color", "value": "65c456..." } // ID of new color 
] 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "t1", "name": "Very Urgent", "color": "65c456..." }
}
```

## 11. Tag Colors 

### List Colors
`GET /tags/colors` 

Response: 

```json
{ 
  "success": true, 
  "data": [ 
    { "_id": "...", "color": "#FF0000", "entityType": "candidate", "organisation": null }, 
    { "_id": "...", "color": "#123456", "entityType": "candidate", "organisation": "orgId..." } 
  ] 
} 
```

### Add Color Preset
`POST /tags/colors` 

**Payload**: 

```json
{ "color": "#123456", "entityType": "candidate" } 
```

Response:

```json
{
  "success": true,
  "data": { "_id": "col1", "color": "#123456", "entityType": "candidate" }
}
```

### Remove Color Preset
`DELETE /tags/colors/:id` 

Response:

```json
{
  "success": true,
  "message": "Color preset deleted successfully"
}
``` 

## 12. Field Configuration 

### Get Configuration
`GET /field-configurations/:entityType` 

Response: 

```json
{ 
  "success": true, 
  "data": { 
    "organisation": "...", 
    "entityType": "candidate", 
    "categories": [ 
      { 
        "name": "Personal Details", 
        "isSystem": true, 
        "fields": [ 
          { "key": "firstName", "label": "First Name", "isSystem": true, "required": true }, 
          { "key": "email", "label": "Email", "isSystem": true, "required": true } 
        ] 
      }, 
      { 
        "name": "My Custom Category", 
        "isSystem": false, 
        "fields": [ 
           { "key": "customField1", "label": "Portfolio URL", "type": "url", "isSystem": false } 
        ] 
      } 
    ] 
  } 
} 
```

### Update Configuration
`PATCH /field-configurations/:entityType` 

**Payload**:

```json
[
  { "op": "replace", "path": "/categories", "value": [ ... ] }
]
```

Response:

```json
{
  "success": true,
  "data": { "organisation": "...", "entityType": "candidate", "categories": [ ... ] }
}
``` 

Default System Fields reference: 

Candidate: Personal Details (First Name, Last Name, Email, Phone, Location, Designation); Professional Details (Skills, Experience, Current Company, Salary) 

Job: Job Details (Job Title, Client, Location, Salary Range) 

Client: Company Details (Company Name, Website, Industry) 

## 13. Attachments 

### Upload Attachment
`POST /attachments/upload` 

**Headers**: `Content-Type: multipart/form-data` 

**Payload**: 

 
# form-data 
# file: (Binary) 
# type: 'candidate' | 'job' | 'client' | 'note' 
# parentId: <entityId> 
# displayName: <optional> 
 

Response:

```json
{
  "success": true,
  "data": { "_id": "att1", "fileName": "resume.pdf", "originalName": "Resume.pdf", "url": "..." }
}
```

### List Attachments
`GET /attachments` 

Query Params: `?type=candidate&parentId=c123` 

Response:

```json
{
  "success": true,
  "data": [
    { "_id": "att1", "fileName": "resume.pdf", "url": "..." }
  ],
  "meta": { "total": 1 }
}
```

### Delete Attachment
`DELETE /attachments/:id` 

**Behavior**: Deletes database metadata and the file from Azure Storage. 

Response:

```json
{
  "success": true,
  "message": "Attachment deleted successfully"
}
```
## 14. User View Configuration 

### Get View Configuration
`GET /view/configurations/:entityType` 

Response: 

```json
{ 
  "success": true, 
  "data": [ 
    { "key": "email", "label": "Email", "visible": true, "order": 1 } 
  ] 
} 
```

### Update View Configuration
`PATCH /view/configurations/:entityType` 

**Payload** (Bulk Replacement):

```json
{
  "configurations": [
    { "key": "email", "visible": false, "order": 2 },
    { "key": "phone", "visible": true, "order": 3 }
  ]
}
```

**Strategy**: Uses bulk replacement for efficiency.

Response:

```json
{
  "success": true,
  "data": [
    { "key": "email", "label": "Email", "visible": false, "order": 2 }
  ]
}
``` 