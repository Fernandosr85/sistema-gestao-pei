# Calendar Synchronization - Implementation Guide

## Overview

This document provides a comprehensive guide for implementing bidirectional calendar synchronization with Google Calendar and Microsoft Outlook/365. The current implementation includes a complete UI with placeholders ready for backend integration.

## Current State

✅ **Implemented:**
- Complete UI for calendar sync management
- State management hook (`useCalendarSync`)
- Type definitions for calendar entities
- Mock OAuth flow with visual feedback
- Sync status tracking and display
- Settings management UI

⏳ **Pending (Backend Required):**
- OAuth 2.0 authentication flow
- Token management and refresh
- Bidirectional event synchronization
- Conflict resolution
- Webhook listeners for real-time updates

---

## Backend Implementation Roadmap

### Phase 1: OAuth Setup

#### 1.1 Google Calendar API

**Prerequisites:**
- Google Cloud Console project
- Enable Google Calendar API
- Configure OAuth 2.0 credentials

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Library"
4. Search and enable "Google Calendar API"
5. Go to "Credentials" > "Create Credentials" > "OAuth client ID"
6. Set application type to "Web application"
7. Add authorized redirect URIs:
   - Development: `http://localhost:54321/functions/v1/calendar-oauth-callback`
   - Production: `https://[project-ref].supabase.co/functions/v1/calendar-oauth-callback`
8. Save Client ID and Client Secret

**Required Scopes:**
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
```

#### 1.2 Microsoft Calendar API

**Prerequisites:**
- Azure Active Directory tenant
- App registration in Azure Portal

**Steps:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Set name and supported account types
5. Add redirect URIs (same pattern as Google)
6. Go to "Certificates & secrets" > "New client secret"
7. Note the Application (client) ID and client secret
8. Go to "API permissions" > "Add permission" > "Microsoft Graph"
9. Add delegated permissions:
   - Calendars.ReadWrite
   - Calendars.ReadWrite.Shared

**Required Scopes:**
```
Calendars.ReadWrite
Calendars.ReadWrite.Shared
offline_access
```

---

### Phase 2: Database Schema

Create tables to store sync configuration and mappings:

```sql
-- Store OAuth tokens (encrypted)
CREATE TABLE calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  scope TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Store sync settings
CREATE TABLE calendar_sync_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  sync_enabled BOOLEAN DEFAULT TRUE,
  sync_meetings BOOLEAN DEFAULT TRUE,
  sync_deadlines BOOLEAN DEFAULT TRUE,
  sync_trainings BOOLEAN DEFAULT TRUE,
  sync_all_tasks BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Map local events to external calendar IDs
CREATE TABLE calendar_event_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_event_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  external_event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(local_event_id, provider)
);

-- Track sync status and errors
CREATE TABLE calendar_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
  events_synced INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Enable RLS
ALTER TABLE calendar_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_event_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own tokens" ON calendar_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own settings" ON calendar_sync_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own mappings" ON calendar_event_mappings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs" ON calendar_sync_log
  FOR SELECT USING (auth.uid() = user_id);
```

---

### Phase 3: Edge Functions

#### 3.1 OAuth Initiation

Create `supabase/functions/calendar-oauth-start/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider } = await req.json();
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Generate state and code verifier (PKCE)
    const state = crypto.randomUUID();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store state and code verifier temporarily (expires in 10 minutes)
    await supabaseClient
      .from('oauth_states')
      .insert({
        user_id: user.id,
        provider,
        state,
        code_verifier: codeVerifier,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    // Build OAuth URL
    let authUrl: string;
    if (provider === 'google') {
      const params = new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-oauth-callback`,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline',
        prompt: 'consent',
      });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    } else if (provider === 'outlook') {
      const params = new URLSearchParams({
        client_id: Deno.env.get('MICROSOFT_CLIENT_ID')!,
        redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-oauth-callback`,
        response_type: 'code',
        scope: 'Calendars.ReadWrite Calendars.ReadWrite.Shared offline_access',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
    } else {
      throw new Error('Invalid provider');
    }

    return new Response(
      JSON.stringify({ authUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// PKCE helpers
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

function base64UrlEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
```

#### 3.2 OAuth Callback

Create `supabase/functions/calendar-oauth-callback/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`OAuth Error: ${error}`, { status: 400 });
  }

  if (!code || !state) {
    return new Response('Missing code or state', { status: 400 });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    // Verify state and get code verifier
    const { data: oauthState, error: stateError } = await supabaseClient
      .from('oauth_states')
      .select('*')
      .eq('state', state)
      .single();

    if (stateError || !oauthState) {
      throw new Error('Invalid state');
    }

    // Check expiration
    if (new Date(oauthState.expires_at) < new Date()) {
      throw new Error('State expired');
    }

    // Exchange code for tokens
    let tokenResponse: any;
    if (oauthState.provider === 'google') {
      tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
          code,
          code_verifier: oauthState.code_verifier,
          grant_type: 'authorization_code',
          redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-oauth-callback`,
        }),
      }).then(r => r.json());
    } else if (oauthState.provider === 'outlook') {
      tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('MICROSOFT_CLIENT_ID')!,
          client_secret: Deno.env.get('MICROSOFT_CLIENT_SECRET')!,
          code,
          code_verifier: oauthState.code_verifier,
          grant_type: 'authorization_code',
          redirect_uri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-oauth-callback`,
        }),
      }).then(r => r.json());
    }

    if (tokenResponse.error) {
      throw new Error(tokenResponse.error_description || tokenResponse.error);
    }

    // Store tokens (encrypted in production)
    await supabaseClient.from('calendar_tokens').upsert({
      user_id: oauthState.user_id,
      provider: oauthState.provider,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString(),
      scope: tokenResponse.scope.split(' '),
    });

    // Initialize sync settings
    await supabaseClient.from('calendar_sync_settings').upsert({
      user_id: oauthState.user_id,
      provider: oauthState.provider,
      sync_enabled: true,
    });

    // Clean up state
    await supabaseClient.from('oauth_states').delete().eq('state', state);

    // Redirect to success page
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${Deno.env.get('APP_URL')}/minha-agenda?oauth_success=${oauthState.provider}`,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${Deno.env.get('APP_URL')}/minha-agenda?oauth_error=${error.message}`,
      },
    });
  }
});
```

#### 3.3 Sync Engine

Create `supabase/functions/calendar-sync/index.ts`:

```typescript
// Full implementation of bidirectional sync
// - Fetch events from Google/Microsoft APIs
// - Compare with local database
// - Resolve conflicts
// - Push/pull changes
// - Update mappings
```

---

## Frontend Integration

### Update `useCalendarSync` Hook

Replace placeholder functions with actual API calls:

```typescript
const connectProvider = useCallback(async (provider: CalendarProvider) => {
  try {
    const { data, error } = await supabase.functions.invoke('calendar-oauth-start', {
      body: { provider },
    });

    if (error) throw error;

    // Redirect to OAuth page
    window.location.href = data.authUrl;
  } catch (error) {
    toast.error('Erro ao conectar', {
      description: error.message,
    });
  }
}, []);
```

---

## Security Considerations

1. **Token Encryption**: Encrypt tokens at rest using Supabase Vault
2. **PKCE Flow**: Use PKCE for OAuth to prevent authorization code interception
3. **Scope Minimization**: Request only necessary calendar scopes
4. **Token Refresh**: Implement automatic refresh before expiration
5. **Rate Limiting**: Respect API rate limits (Google: 1000 req/day, Microsoft: varies)
6. **Webhook Validation**: Verify webhook signatures from providers

---

## Testing Strategy

1. **Unit Tests**: Test token refresh, conflict resolution logic
2. **Integration Tests**: Test OAuth flow end-to-end
3. **E2E Tests**: Test full sync cycle with real accounts
4. **Load Tests**: Simulate multiple users syncing simultaneously

---

## Monitoring

Set up monitoring for:
- Token refresh failures
- Sync errors and conflicts
- API rate limit hits
- Average sync duration
- User adoption metrics

---

## Future Enhancements

- iCloud Calendar support
- Calendar sharing within team
- Smart conflict resolution with AI
- Offline mode with queue
- Calendar analytics and insights

---

## References

- [Google Calendar API](https://developers.google.com/calendar/api)
- [Microsoft Graph Calendar](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
- [OAuth 2.0 PKCE](https://oauth.net/2/pkce/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
