export interface UserSocialLogin {
  name?: string | null;
  owner?: string | null;
  creation?: string | null;
  modified?: string | null;
  modified_by?: string | null;
  docstatus?: number | null;
  idx?: number | null;
  provider?: string | null;
  userid?: string | null;
  parent?: string | null;
  parentfield?: string | null;
  parenttype?: string | null;
  doctype?: string | null;
}

export interface UserRole {
  name?: string | null;
  owner?: string | null;
  creation?: string | null;
  modified?: string | null;
  modified_by?: string | null;
  docstatus?: number | null;
  idx?: number | null;
  role?: string | null;
  parent?: string | null;
  parentfield?: string | null;
  parenttype?: string | null;
  doctype?: string | null;
}

export interface UserDefault {
  name?: string | null;
  owner?: string | null;
  creation?: string | null;
  modified?: string | null;
  modified_by?: string | null;
  docstatus?: number | null;
  idx?: number | null;
  default_key?: string | null;
  default_value?: string | null;
  parent?: string | null;
  parentfield?: string | null;
  parenttype?: string | null;
  doctype?: string | null;
}

export interface UserEmail {
  name?: string | null;
  owner?: string | null;
  creation?: string | null;
  modified?: string | null;
  modified_by?: string | null;
  docstatus?: number | null;
  idx?: number | null;
  email_id?: string | null;
  email_account?: string | null;
  parent?: string | null;
  parentfield?: string | null;
  parenttype?: string | null;
  doctype?: string | null;
}

export interface BlockModule {
  name?: string | null;
  owner?: string | null;
  creation?: string | null;
  modified?: string | null;
  modified_by?: string | null;
  docstatus?: number | null;
  idx?: number | null;
  module?: string | null;
  parent?: string | null;
  parentfield?: string | null;
  parenttype?: string | null;
  doctype?: string | null;
}

export interface User {
  name?: string | null;
  owner?: string | null;
  creation?: string | null;
  modified?: string | null;
  modified_by?: string | null;
  docstatus?: number | null;
  idx?: number | null;
  enabled?: boolean | number | null;
  email?: string | null;
  first_name?: string | null;
  firstName?: string | null;
  last_name?: string | null;
  lastName?: string | null;
  full_name?: string | null;
  fullName?: string | null;
  username?: string | null;
  language?: string | null;
  time_zone?: string | null;
  send_welcome_email?: number | null;
  unsubscribed?: number | null;
  mute_sounds?: number | null;
  desk_theme?: string | null;
  new_password?: string | null;
  logout_all_sessions?: number | null;
  reset_password_key?: string | null;
  last_reset_password_key_generated_on?: string | null;
  document_follow_notify?: number | null;
  document_follow_frequency?: string | null;
  follow_created_documents?: number | null;
  follow_commented_documents?: number | null;
  follow_liked_documents?: number | null;
  follow_assigned_documents?: number | null;
  follow_shared_documents?: number | null;
  thread_notify?: number | null;
  send_me_a_copy?: number | null;
  allowed_in_mentions?: number | null;
  simultaneous_sessions?: number | null;
  login_after?: number | null;
  user_type?: string | null;
  login_before?: number | null;
  bypass_restrict_ip_check_if_2fa_enabled?: number | null;
  onboarding_status?: string | null;
  doctype?: string | null;
  social_logins?: UserSocialLogin[] | null;
  roles?: UserRole[] | null;
  defaults?: UserDefault[] | null;
  user_emails?: UserEmail[] | null;
  block_modules?: BlockModule[] | null;
}

export type NewUser = {
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  enabled?: boolean;
  password?: string;
};
