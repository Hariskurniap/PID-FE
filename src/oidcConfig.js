import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { Log } from 'oidc-client-ts';

const config = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: import.meta.env.VITE_OIDC_SCOPE,

  // Optional: Menyimpan state di localStorage
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const userManager = new UserManager(config);


Log.setLogger(console);
Log.setLevel(Log.DEBUG);


export default userManager;
