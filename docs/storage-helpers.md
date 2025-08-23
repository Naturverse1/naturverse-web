# Storage helpers

- Buckets are configured in the Supabase dashboard: `avatars`, `navatars`, and `products`.
- Helpers allow uploading files and retrieving a public URL.

```ts
const path = await uploadAvatar(user.id, file);
const url = getPublicUrl(path);
```
