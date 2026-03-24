# Reflection on Authentication

**What did I learn about authentication?**  
Supabase Auth handles sign-up/sign-in and manages access/refresh tokens through its SDK, so the app doesn’t have to parse or store JWTs manually.

**How does React manage user state?**  
An AuthContext runs `supabase.auth.getSession()` on load and subscribes to `onAuthStateChange`, sharing `user`, `session`, and `loading` with components via context.

**What security risks should I keep in mind?**  
- Use HTTPS to prevent token interception.  
- Avoid exposing tokens to frontend scripts when HttpOnly cookies are available.  
- Validate inputs (email format, password length) and never log credentials.  
- Protect server-side endpoints even if the frontend blocks unauthenticated access.