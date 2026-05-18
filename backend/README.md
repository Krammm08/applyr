# Applyr PHP Backend

## Setup
1. Create a MySQL database and user.
2. Update database credentials in `config.php`.
3. Run the SQL in `sql/schema.sql`.
4. Upload the `backend` folder to your HelioHost public directory.

## Endpoints
- `POST /api/auth/register.php`
- `POST /api/auth/login.php`
- `POST /api/applications/create.php`
- `POST /api/applications/update.php`
- `POST /api/applications/delete.php`

### Response shape
```
{
  "success": true,
  "data": {
    "token": "...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "User"
    }
  }
}
```

On error:
```
{
  "success": false,
  "message": "Reason"
}
```

## Auth header
Send `Authorization: Bearer <token>` for protected routes.
