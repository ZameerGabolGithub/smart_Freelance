# Multi-Account Setup Guide

This project now supports multiple Freelancer accounts using URL-based token selection.

## Environment Configuration

Create a `.env` file in your project root with the following format:

```bash
# Default account (optional - used when no user is specified)
VITE_DEFAULT_TOKEN=your_default_oauth_token_here
VITE_DEFAULT_BIDDER=12345678


# # Legacy support (deprecated - use VITE_TOKEN_<USERKEY> instead)
# REACT_APP_FREELANCER_TOKEN=legacy_token_here
# REACT_APP_FREELANCER_AUTH_TOKEN=legacy_auth_token_here
# REACT_APP_BIDDER_ID=legacy_bidder_id_here
# ```

## Usage Methods

### 1. URL Query Parameter
Add `?user=Zameer` to your URL:
```
http://localhost:3000?user=ALICE
```

### 2. Route Pattern
Use the route pattern `/u/:userKey`:
```
http://localhost:3000/u/ALICE
```

### 3. User Switcher UI
Use the dropdown in the top-right corner of the app to switch between configured accounts.

### 4. Default Account
If no user is specified and `VITE_DEFAULT_TOKEN` is configured, it will use the default account.

## Available Users

The following users are pre-configured in the code (add more in `src/contexts/AuthContext.js`):


## Security Notice

⚠️ **Important**: Tokens in this build are client-accessible. This setup is intended for testing purposes only. In production, implement proper server-side authentication.

## Adding New Users

1. Add the user configuration to your `.env.local`:
   ```bash
   VITE_TOKEN_NEWUSER=newuser_oauth_token_here
   VITE_BIDDER_NEWUSER=99999999
   ```

   ```

## API Changes

The API now uses the `freelancer-oauth-v1` header instead of `Authorization: Bearer` for authentication. The `useAuth()` hook provides the current user's token and bidder ID to all components that need them.

## Error Handling

- Unknown user keys will show a friendly error page with available options
- Missing token/bidder configuration will display appropriate error messages
- The app gracefully falls back to default configuration when possible