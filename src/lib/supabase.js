import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Detect if Supabase is properly configured or if it uses placeholder keys
const isPlaceholder = !supabaseUrl ||
  supabaseUrl.includes('placeholder') ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes('placeholder')

let supabaseInstance

if (isPlaceholder) {
  console.warn('Supabase is configured with placeholder values. Using instant-fallback mock client to prevent network timeouts.')

  const mockAuth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    },
    signInWithPassword: () => {
      return Promise.resolve({ data: { user: null }, error: new Error('Authentication is disabled in mock mode.') })
    },
    signOut: () => Promise.resolve({ error: null })
  }

  const mockChannel = {
    on: function() { return this; },
    subscribe: function() { return this; }
  }

  const createMockQuery = (data = null, error = null) => {
    const promise = Promise.resolve({ data, error });
    return new Proxy(promise, {
      get(target, prop) {
        if (prop === 'then') return promise.then.bind(promise);
        if (prop === 'catch') return promise.catch.bind(promise);
        if (prop === 'finally') return promise.finally.bind(promise);
        
        // Return a function that continues returning the chainable mock query
        return () => createMockQuery(data, error);
      }
    });
  }

  supabaseInstance = {
    auth: mockAuth,
    from: () => createMockQuery(null, new Error('Supabase is using placeholder credentials.')),
    channel: () => mockChannel,
    removeChannel: () => {}
  }
} else {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseInstance

