SET check_function_bodies = false;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.app_personas (
    value text NOT NULL,
    description text
);
CREATE TABLE public.app_pings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    pathname text DEFAULT ''::text NOT NULL,
    platform text DEFAULT ''::text NOT NULL,
    query_string text DEFAULT ''::text NOT NULL,
    ip text DEFAULT ''::text NOT NULL,
    timezone text DEFAULT ''::text NOT NULL,
    ip_response jsonb,
    country text DEFAULT ''::text NOT NULL,
    region text DEFAULT ''::text NOT NULL,
    city text DEFAULT ''::text NOT NULL,
    zip text DEFAULT ''::text NOT NULL,
    firebase_id text
);
COMMENT ON COLUMN public.app_pings.platform IS 'iOS, Android, Web';
CREATE TABLE public.coach_qualification_groups (
    value text NOT NULL,
    description text
);
CREATE TABLE public.coach_qualification_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.coach_qualifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    group_id text,
    "order" integer NOT NULL,
    display_key text NOT NULL
);
CREATE TABLE public.coach_status (
    value text NOT NULL,
    description text
);
CREATE TABLE public.communication_preference_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.countries (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    iso2 text NOT NULL,
    iso3 text NOT NULL,
    numeric_code text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    currency text NOT NULL,
    phone_code text NOT NULL,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    emoji text NOT NULL
);
COMMENT ON TABLE public.countries IS 'Note that this breaks from the standard and uses the country iso3 as a text field for the id';
CREATE TABLE public.country_subdivisions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    country_id text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    latitude numeric,
    longitude numeric,
    type text NOT NULL
);
CREATE TABLE public.follow_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.gender (
    value text NOT NULL,
    description text
);
CREATE TABLE public.lesson_equipment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    equipment_option_id text NOT NULL,
    lesson_id uuid NOT NULL,
    custom_name text
);
CREATE TABLE public.lesson_equipment_options (
    value text NOT NULL,
    description text
);
CREATE TABLE public.lesson_order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    lesson_order_id uuid NOT NULL,
    lesson_participant_id uuid NOT NULL,
    price_unit_amount integer NOT NULL,
    total_unit_amount integer NOT NULL,
    refund_unit_amount integer NOT NULL,
    status text NOT NULL,
    refunded_at timestamp with time zone,
    refunded_by_persona text
);
CREATE TABLE public.lesson_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    payment_processor text NOT NULL,
    status text NOT NULL,
    customer_user_id uuid NOT NULL,
    seller_user_id uuid NOT NULL,
    stripe_customer_id text NOT NULL,
    stripe_merchant_id text NOT NULL,
    stripe_payment_status text NOT NULL,
    order_total_unit_amount integer NOT NULL,
    order_subtotal_unit_amount integer NOT NULL,
    customer_application_fee_unit_amount integer NOT NULL,
    seller_application_fee_unit_amount integer NOT NULL,
    paid_unit_amount integer NOT NULL,
    refund_unit_amount integer NOT NULL,
    internal_stripe_payment_intent_id uuid NOT NULL,
    external_stripe_payment_intent_id text NOT NULL,
    refunded_at timestamp with time zone,
    refunded_by_persona text,
    transfer_unit_amount integer NOT NULL,
    application_fee_total_unit_amount integer NOT NULL,
    user_credit_card_id uuid
);
COMMENT ON COLUMN public.lesson_orders.order_total_unit_amount IS 'The total after fees and discounts. Note that the coaches fee is not added in. This is only what the player pays. The coaches fee is subtracted from their payout.';
COMMENT ON COLUMN public.lesson_orders.order_subtotal_unit_amount IS 'The sum of the items in the order. This doesn''t include any discounts or fees.';
COMMENT ON COLUMN public.lesson_orders.transfer_unit_amount IS 'The amount transferred to the coach as a payout. It is the price of the lesson minus the coaches fee.';
CREATE TABLE public.lesson_participant_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.lesson_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    lesson_id uuid NOT NULL,
    user_id uuid NOT NULL,
    status text NOT NULL,
    added_at timestamp with time zone,
    paid_at timestamp with time zone,
    removed_at timestamp with time zone,
    refunded_at timestamp with time zone,
    refunded_by_persona text,
    added_by_persona text,
    added_by_user_id uuid,
    removed_by_persona text
);
CREATE TABLE public.lesson_privacy (
    value text NOT NULL,
    description text
);
CREATE TABLE public.lesson_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.lesson_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    original_lesson_id uuid,
    user_id uuid,
    template_name text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    type_custom text NOT NULL,
    cover_image_url text NOT NULL,
    privacy text,
    price_unit_amount integer NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    participant_limit integer NOT NULL,
    user_custom_court_id uuid
);
CREATE TABLE public.lesson_times (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    lesson_id uuid NOT NULL,
    start_date_time timestamp with time zone NOT NULL,
    end_date_time timestamp with time zone NOT NULL
);
COMMENT ON TABLE public.lesson_times IS 'While thinking through how we handle events with multiple dates or times (ie. a camp), this table was made. It will be actively used once that logic has been thought through more. HOWEVER, another option would be to put an FK on lessons that points to a parent lesson that drives it. This would also allow for things like descriptions for each individual lesson. This is a little more complex though.';
CREATE TABLE public.lesson_types (
    value text NOT NULL,
    description text
);
CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    owner_user_id uuid,
    status text NOT NULL,
    type text NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    canceled_at timestamp with time zone,
    cancel_reason text DEFAULT ''::text NOT NULL,
    type_custom text DEFAULT ''::text NOT NULL,
    participant_limit integer,
    cover_image_url text DEFAULT ''::text NOT NULL,
    privacy text NOT NULL,
    price_unit_amount integer NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    user_custom_court_id uuid,
    start_date_time timestamp with time zone,
    end_date_time timestamp with time zone,
    reminder_event_id uuid,
    used_template_id uuid,
    published_at timestamp with time zone,
    cover_image_file_name text DEFAULT ''::text NOT NULL,
    cover_image_path text DEFAULT ''::text NOT NULL,
    cover_image_provider text DEFAULT ''::text NOT NULL,
    cover_image_provider_id text DEFAULT ''::text NOT NULL,
    cover_image_provider_url text DEFAULT ''::text NOT NULL,
    timezone_name text DEFAULT ''::text NOT NULL,
    timezone_offset_minutes integer DEFAULT 0 NOT NULL,
    timezone_abbreviation text DEFAULT ''::text NOT NULL,
    locale text DEFAULT 'en-US'::text NOT NULL
);
COMMENT ON COLUMN public.lessons.price_unit_amount IS 'This follows the standard from Stripe where a price is stored in its smallest denomination as an integer. In USD, this would be cents. For example, $42.23 is stored as 4223.';
CREATE TABLE public.notification_action_types (
    value text NOT NULL,
    description text
);
CREATE TABLE public.notification_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.order_statuses (
    value text NOT NULL,
    description text
);
CREATE TABLE public.payment_processors (
    value text NOT NULL,
    description text
);
CREATE TABLE public.signup_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    email text NOT NULL,
    account_type text NOT NULL,
    username text NOT NULL,
    ip text NOT NULL,
    full_name text NOT NULL,
    preferred_name text NOT NULL,
    timezone text NOT NULL,
    country text NOT NULL,
    region text NOT NULL,
    city text NOT NULL,
    zip text NOT NULL,
    full_details jsonb,
    platform text NOT NULL
);
CREATE TABLE public.stripe_charges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    internal_stripe_payment_intent_id uuid NOT NULL,
    external_stripe_payment_intent_id text NOT NULL,
    amount integer NOT NULL,
    amount_captured integer NOT NULL,
    amount_refunded integer NOT NULL,
    application text,
    application_fee text,
    application_fee_amount integer,
    calculated_statement_descriptor text,
    captured boolean NOT NULL,
    disputed boolean NOT NULL,
    paid boolean NOT NULL,
    refunded boolean NOT NULL,
    payment_method text,
    stripe_customer_id text NOT NULL,
    currency text NOT NULL,
    charge_id text NOT NULL,
    transfer_data_amount integer,
    transfer_data_destination text,
    transfer_id text,
    source_transfer text
);
CREATE TABLE public.stripe_payment_intents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    payment_intent_id text NOT NULL,
    currency text NOT NULL,
    stripe_customer_id text NOT NULL,
    statement_descriptor text,
    status text NOT NULL,
    amount integer NOT NULL,
    amount_capturable integer NOT NULL,
    amount_received integer NOT NULL,
    application text,
    application_fee_amount integer,
    cancellation_reason text,
    on_behalf_of text,
    transfer_data_amount integer,
    transfer_data_destination text,
    transfer_group text,
    payment_method text
);
CREATE TABLE public.tennis_rating_scales (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    short_name text NOT NULL,
    name text NOT NULL,
    minimum numeric NOT NULL,
    maximum numeric NOT NULL,
    "order" integer NOT NULL
);
CREATE TABLE public.user_auth_identities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    email text NOT NULL,
    provider text NOT NULL,
    phone_number text,
    display_name text
);
CREATE TABLE public.user_coach_services (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    type text,
    title text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    price_unit_amount integer NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    cover_image_url text DEFAULT ''::text NOT NULL,
    cover_image_file_name text DEFAULT ''::text NOT NULL,
    cover_image_path text DEFAULT ''::text NOT NULL,
    cover_image_provider text DEFAULT ''::text NOT NULL,
    cover_image_provider_id text DEFAULT ''::text NOT NULL,
    cover_image_provider_url text DEFAULT ''::text NOT NULL
);
CREATE TABLE public.user_communication_preferences (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    new_follower_email text DEFAULT 'ACTIVE'::text NOT NULL,
    new_follower_push text DEFAULT 'ACTIVE'::text NOT NULL,
    marketing_email text DEFAULT 'ACTIVE'::text NOT NULL,
    marketing_push text DEFAULT 'ACTIVE'::text NOT NULL,
    lesson_reminder_email text DEFAULT 'ACTIVE'::text NOT NULL,
    lesson_reminder_push text DEFAULT 'ACTIVE'::text NOT NULL,
    payout_email text DEFAULT 'ACTIVE'::text NOT NULL,
    payout_push text DEFAULT 'ACTIVE'::text NOT NULL,
    lesson_booked_email text DEFAULT 'ACTIVE'::text NOT NULL,
    lesson_booked_push text DEFAULT 'ACTIVE'::text NOT NULL,
    participant_left_lesson_email text DEFAULT 'ACTIVE'::text NOT NULL,
    participant_left_lesson_push text DEFAULT 'ACTIVE'::text NOT NULL,
    new_lesson_published_email text DEFAULT 'ACTIVE'::text NOT NULL,
    new_lesson_published_push text DEFAULT 'ACTIVE'::text NOT NULL,
    lesson_canceled_email text DEFAULT 'ACTIVE'::text NOT NULL,
    lesson_canceled_pushed text DEFAULT 'ACTIVE'::text NOT NULL
);
COMMENT ON COLUMN public.user_communication_preferences.id IS 'This will match the users UUID since it''s 1-1 relationship';
CREATE TABLE public.user_credit_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    expire_month integer NOT NULL,
    expire_year integer NOT NULL,
    last4 text NOT NULL,
    provider text DEFAULT 'STRIPE'::text NOT NULL,
    provider_card_id text NOT NULL,
    country text NOT NULL,
    funding text NOT NULL,
    fingerprint text NOT NULL,
    brand text NOT NULL,
    billing_city text,
    billing_country text,
    billing_line_1 text,
    billing_line_2 text,
    billing_state text,
    billing_postal_code text,
    billing_name text,
    billing_email text,
    billing_phone text,
    user_id uuid NOT NULL
);
CREATE TABLE public.user_custom_courts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    title text DEFAULT ''::text NOT NULL,
    full_address text DEFAULT ''::text NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public.user_follows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    followed_user_id uuid NOT NULL,
    follower_user_id uuid NOT NULL,
    status text NOT NULL
);
CREATE TABLE public.user_image_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    file_name text NOT NULL,
    path text NOT NULL,
    provider text NOT NULL,
    provider_id text NOT NULL,
    provider_url text NOT NULL
);
CREATE TABLE public.user_notification_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    action_type text NOT NULL,
    user_notification_entity_id uuid NOT NULL
);
CREATE TABLE public.user_notification_entities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    lesson_id uuid,
    acting_user_id uuid
);
CREATE TABLE public.user_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    status text DEFAULT 'UNREAD'::text NOT NULL,
    read_at timestamp with time zone,
    user_notification_detail_id uuid NOT NULL
);
CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    firebase_id text NOT NULL,
    email text NOT NULL,
    stripe_customer_id text NOT NULL,
    username text,
    coach_status text,
    full_name text DEFAULT ''::text NOT NULL,
    birthday date,
    preferred_name text DEFAULT ''::text NOT NULL,
    is_marketing_registered boolean DEFAULT true,
    gender text,
    gender_preference text DEFAULT ''::text NOT NULL,
    original_auth_provider text DEFAULT ''::text NOT NULL,
    latest_auth_provider text DEFAULT ''::text NOT NULL,
    stripe_merchant_id text,
    stripe_merchant_details_submitted boolean DEFAULT false NOT NULL,
    stripe_merchant_charges_enabled boolean DEFAULT false NOT NULL,
    stripe_merchant_payouts_enabled boolean DEFAULT false NOT NULL,
    stripe_merchant_currently_due jsonb,
    stripe_merchant_past_due jsonb,
    stripe_merchant_eventually_due jsonb,
    coach_status_updated_at timestamp with time zone,
    is_onboard_complete boolean DEFAULT false NOT NULL,
    profile_image_url text DEFAULT ''::text NOT NULL,
    cover_image_url text DEFAULT ''::text NOT NULL,
    about_me text DEFAULT ''::text NOT NULL,
    about_me_video_url text DEFAULT ''::text NOT NULL,
    default_credit_card_id uuid,
    coach_experience_years numeric DEFAULT '0'::numeric NOT NULL,
    coach_experience_set_at timestamp with time zone,
    country_subdivision_id uuid,
    country_id text,
    city_name text DEFAULT ''::text NOT NULL,
    tennis_rating_scale_id uuid,
    tennis_rating numeric,
    normalized_tennis_rating_scale_id uuid,
    normalized_tennis_rating numeric,
    profile_image_file_name text DEFAULT ''::text NOT NULL,
    profile_image_path text DEFAULT ''::text NOT NULL,
    profile_image_provider text DEFAULT ''::text NOT NULL,
    profile_image_provider_id text DEFAULT ''::text NOT NULL,
    profile_image_provider_url text DEFAULT ''::text NOT NULL,
    cover_image_file_name text DEFAULT ''::text NOT NULL,
    cover_image_path text DEFAULT ''::text NOT NULL,
    cover_image_provider text DEFAULT ''::text NOT NULL,
    cover_image_provider_id text DEFAULT ''::text NOT NULL,
    cover_image_provider_url text DEFAULT ''::text NOT NULL,
    CONSTRAINT users_username_check CHECK (((username IS NULL) OR ((username = lower(username)) AND (length(username) >= 4) AND (length(username) <= 28) AND (username ~ '^[a-z0-9_.-]*$'::text))))
);
COMMENT ON COLUMN public.users.profile_image_url IS 'NOTE: Keeping this field empty for now until we serve from our own custom domain';
COMMENT ON COLUMN public.users.cover_image_url IS 'NOTE: Keeping this field empty for now until we serve from our own custom domain';
CREATE VIEW public.user_profiles AS
 SELECT users.id,
    users.created_at,
    users.updated_at,
    users.deleted_at,
    users.username,
    users.coach_status,
    users.full_name,
    users.preferred_name,
    users.gender,
    users.gender_preference,
    users.about_me,
    users.about_me_video_url,
    users.coach_experience_years,
    users.coach_experience_set_at,
    users.country_subdivision_id,
    users.country_id,
    users.city_name,
    users.tennis_rating_scale_id,
    users.tennis_rating,
    users.normalized_tennis_rating_scale_id,
    users.normalized_tennis_rating,
    users.profile_image_file_name,
    users.profile_image_path,
    users.profile_image_provider,
    users.profile_image_provider_url,
    users.cover_image_file_name,
    users.cover_image_path,
    users.cover_image_provider,
    users.cover_image_provider_url
   FROM public.users;
CREATE TABLE public.user_registration_details (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    platform text NOT NULL,
    ip text NOT NULL,
    timezone text NOT NULL,
    country text NOT NULL,
    region text NOT NULL,
    city text NOT NULL,
    zip text NOT NULL,
    full_details jsonb
);
CREATE TABLE public.user_terms_of_service (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    accepted_at timestamp with time zone NOT NULL,
    ip text NOT NULL,
    user_agent text NOT NULL
);
CREATE TABLE public.username_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    current_username text NOT NULL,
    previous_username text,
    action text NOT NULL
);
COMMENT ON COLUMN public.username_logs.action IS 'ADD or UPDATE to determine what occurred';
CREATE VIEW public.usernames_active AS
 SELECT users.username
   FROM public.users;
CREATE TABLE public.usernames_claimed (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid,
    username text NOT NULL,
    reason text NOT NULL
);
COMMENT ON TABLE public.usernames_claimed IS 'This table prevents reserved words from being used or old usernames being claimed for where identity takeover can happen';
COMMENT ON COLUMN public.usernames_claimed.reason IS 'KEYWORD or USER or FORBIDDEN (more options may be needed)';
CREATE TABLE public.users_coach_qualifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    user_id uuid NOT NULL,
    coach_qualification_id uuid NOT NULL,
    status text NOT NULL
);
ALTER TABLE ONLY public.app_personas
    ADD CONSTRAINT app_personas_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.app_pings
    ADD CONSTRAINT app_pings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.coach_qualification_groups
    ADD CONSTRAINT coach_qualification_groups_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.coach_qualification_statuses
    ADD CONSTRAINT coach_qualification_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.coach_qualifications
    ADD CONSTRAINT coach_qualifications_display_key_key UNIQUE (display_key);
ALTER TABLE ONLY public.coach_qualifications
    ADD CONSTRAINT coach_qualifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.coach_status
    ADD CONSTRAINT coach_status_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.communication_preference_statuses
    ADD CONSTRAINT communication_preference_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_iso2_key UNIQUE (iso2);
ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.country_subdivisions
    ADD CONSTRAINT country_subdivisions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.follow_statuses
    ADD CONSTRAINT follow_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.gender
    ADD CONSTRAINT gender_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.lesson_equipment
    ADD CONSTRAINT lesson_equipment_lesson_id_equipment_option_id_key UNIQUE (lesson_id, equipment_option_id);
ALTER TABLE ONLY public.lesson_equipment_options
    ADD CONSTRAINT lesson_equipment_options_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.lesson_equipment
    ADD CONSTRAINT lesson_equipment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_order_items
    ADD CONSTRAINT lesson_order_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_external_stripe_payment_intent_id_key UNIQUE (external_stripe_payment_intent_id);
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_internal_stripe_payment_intent_id_key UNIQUE (internal_stripe_payment_intent_id);
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_participant_statuses
    ADD CONSTRAINT lesson_participant_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_lesson_id_user_id_key UNIQUE (lesson_id, user_id);
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_privacy
    ADD CONSTRAINT lesson_privacy_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.lesson_statuses
    ADD CONSTRAINT lesson_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.lesson_templates
    ADD CONSTRAINT lesson_templates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_times
    ADD CONSTRAINT lesson_times_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.lesson_types
    ADD CONSTRAINT lesson_types_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notification_action_types
    ADD CONSTRAINT notification_action_types_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.notification_statuses
    ADD CONSTRAINT notification_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.order_statuses
    ADD CONSTRAINT order_statuses_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.payment_processors
    ADD CONSTRAINT payment_processors_pkey PRIMARY KEY (value);
ALTER TABLE ONLY public.signup_requests
    ADD CONSTRAINT signup_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stripe_charges
    ADD CONSTRAINT stripe_charges_charge_id_key UNIQUE (charge_id);
ALTER TABLE ONLY public.stripe_charges
    ADD CONSTRAINT stripe_charges_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.stripe_payment_intents
    ADD CONSTRAINT stripe_payment_intents_payment_intent_id_key UNIQUE (payment_intent_id);
ALTER TABLE ONLY public.stripe_payment_intents
    ADD CONSTRAINT stripe_payment_intents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tennis_rating_scales
    ADD CONSTRAINT tennis_rating_scales_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_auth_identities
    ADD CONSTRAINT user_auth_identities_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_auth_identities
    ADD CONSTRAINT user_auth_identities_provider_email_user_id_key UNIQUE (provider, email, user_id);
ALTER TABLE ONLY public.user_coach_services
    ADD CONSTRAINT user_coach_services_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_credit_cards
    ADD CONSTRAINT user_credit_cards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_credit_cards
    ADD CONSTRAINT user_credit_cards_provider_card_id_key UNIQUE (provider_card_id);
ALTER TABLE ONLY public.user_custom_courts
    ADD CONSTRAINT user_custom_courts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_followed_user_id_follower_user_id_key UNIQUE (followed_user_id, follower_user_id);
ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_image_log
    ADD CONSTRAINT user_image_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_notification_details
    ADD CONSTRAINT user_notification_details_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_notification_details
    ADD CONSTRAINT user_notification_details_user_notification_entity_id_key UNIQUE (user_notification_entity_id);
ALTER TABLE ONLY public.user_notification_entities
    ADD CONSTRAINT user_notification_entities_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_registration_details
    ADD CONSTRAINT user_registration_details_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_registration_details
    ADD CONSTRAINT user_registration_details_user_id_key UNIQUE (user_id);
ALTER TABLE ONLY public.user_terms_of_service
    ADD CONSTRAINT user_terms_of_service_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.username_logs
    ADD CONSTRAINT username_logs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.usernames_claimed
    ADD CONSTRAINT usernames_claimed_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.usernames_claimed
    ADD CONSTRAINT usernames_claimed_username_key UNIQUE (username);
ALTER TABLE ONLY public.users_coach_qualifications
    ADD CONSTRAINT users_coach_qualifications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users_coach_qualifications
    ADD CONSTRAINT users_coach_qualifications_user_id_coach_qualification_id_key UNIQUE (user_id, coach_qualification_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_firebase_id_key UNIQUE (firebase_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_stripe_customer_id_key UNIQUE (stripe_customer_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_stripe_merchant_id_key UNIQUE (stripe_merchant_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
CREATE INDEX country_subdivisions_country_id_key ON public.country_subdivisions USING btree (country_id);
CREATE INDEX lesson_equipment_lesson_id_key ON public.lesson_equipment USING btree (lesson_id);
CREATE INDEX lesson_order_items_lesson_order_id_key ON public.lesson_order_items USING btree (lesson_order_id);
CREATE INDEX lesson_orders_customer_user_id_key ON public.lesson_orders USING btree (customer_user_id);
CREATE INDEX lesson_orders_seller_user_id_key ON public.lesson_orders USING btree (seller_user_id);
CREATE INDEX lesson_participants_lesson_id_key ON public.lesson_participants USING btree (lesson_id);
CREATE INDEX lesson_participants_user_id_key ON public.lesson_participants USING btree (user_id);
CREATE INDEX lesson_templates_user_id_key ON public.lesson_templates USING btree (user_id);
CREATE INDEX lesson_times_lesson_id_key ON public.lesson_times USING btree (lesson_id);
CREATE INDEX lessons_owner_user_id_key ON public.lessons USING btree (owner_user_id);
CREATE INDEX signup_requests_email_key ON public.signup_requests USING btree (email);
CREATE INDEX stripe_charges_external_stripe_payment_intent_id_key ON public.stripe_charges USING btree (external_stripe_payment_intent_id);
CREATE INDEX stripe_charges_internal_stripe_payment_intent_id_key ON public.stripe_charges USING btree (internal_stripe_payment_intent_id);
CREATE INDEX user_coach_services_user_id_key ON public.user_coach_services USING btree (user_id);
CREATE INDEX user_credit_cards_user_id_key ON public.user_credit_cards USING btree (user_id);
CREATE INDEX user_custom_courts_user_id_key ON public.user_custom_courts USING btree (user_id);
CREATE INDEX user_follows_followed_user_id_key ON public.user_follows USING btree (followed_user_id);
CREATE INDEX user_follows_follower_user_id_key ON public.user_follows USING btree (follower_user_id);
CREATE INDEX user_notifications_user_id_created_at_key ON public.user_notifications USING btree (user_id, created_at);
CREATE INDEX user_notifications_user_id_key ON public.user_notifications USING btree (user_id);
CREATE INDEX user_notifications_user_id_status_key ON public.user_notifications USING btree (user_id, status);
CREATE INDEX user_terms_of_service_user_id_key ON public.user_terms_of_service USING btree (user_id);
CREATE INDEX username_logs_user_id_key ON public.username_logs USING btree (user_id);
CREATE INDEX users_coach_qualifications_user_id_key ON public.users_coach_qualifications USING btree (user_id);
CREATE INDEX users_coach_status_key ON public.users USING btree (coach_status);
CREATE TRIGGER set_public_app_pings_updated_at BEFORE UPDATE ON public.app_pings FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_app_pings_updated_at ON public.app_pings IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_coach_qualifications_updated_at BEFORE UPDATE ON public.coach_qualifications FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_coach_qualifications_updated_at ON public.coach_qualifications IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_countries_updated_at ON public.countries IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_country_subdivisions_updated_at BEFORE UPDATE ON public.country_subdivisions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_country_subdivisions_updated_at ON public.country_subdivisions IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lesson_equipment_updated_at BEFORE UPDATE ON public.lesson_equipment FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lesson_equipment_updated_at ON public.lesson_equipment IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lesson_order_items_updated_at BEFORE UPDATE ON public.lesson_order_items FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lesson_order_items_updated_at ON public.lesson_order_items IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lesson_orders_updated_at BEFORE UPDATE ON public.lesson_orders FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lesson_orders_updated_at ON public.lesson_orders IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lesson_participants_updated_at BEFORE UPDATE ON public.lesson_participants FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lesson_participants_updated_at ON public.lesson_participants IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lesson_templates_updated_at BEFORE UPDATE ON public.lesson_templates FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lesson_templates_updated_at ON public.lesson_templates IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lesson_times_updated_at BEFORE UPDATE ON public.lesson_times FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lesson_times_updated_at ON public.lesson_times IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_lessons_updated_at ON public.lessons IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_signup_requests_updated_at BEFORE UPDATE ON public.signup_requests FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_signup_requests_updated_at ON public.signup_requests IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_stripe_charges_updated_at BEFORE UPDATE ON public.stripe_charges FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_stripe_charges_updated_at ON public.stripe_charges IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_stripe_payment_intents_updated_at BEFORE UPDATE ON public.stripe_payment_intents FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_stripe_payment_intents_updated_at ON public.stripe_payment_intents IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_tennis_rating_scales_updated_at BEFORE UPDATE ON public.tennis_rating_scales FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_tennis_rating_scales_updated_at ON public.tennis_rating_scales IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_auth_identities_updated_at BEFORE UPDATE ON public.user_auth_identities FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_auth_identities_updated_at ON public.user_auth_identities IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_coach_services_updated_at BEFORE UPDATE ON public.user_coach_services FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_coach_services_updated_at ON public.user_coach_services IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_communication_preferences_updated_at BEFORE UPDATE ON public.user_communication_preferences FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_communication_preferences_updated_at ON public.user_communication_preferences IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_credit_cards_updated_at BEFORE UPDATE ON public.user_credit_cards FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_credit_cards_updated_at ON public.user_credit_cards IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_custom_courts_updated_at BEFORE UPDATE ON public.user_custom_courts FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_custom_courts_updated_at ON public.user_custom_courts IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_follows_updated_at BEFORE UPDATE ON public.user_follows FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_follows_updated_at ON public.user_follows IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_image_log_updated_at BEFORE UPDATE ON public.user_image_log FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_image_log_updated_at ON public.user_image_log IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_notification_details_updated_at BEFORE UPDATE ON public.user_notification_details FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_notification_details_updated_at ON public.user_notification_details IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_notification_entities_updated_at BEFORE UPDATE ON public.user_notification_entities FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_notification_entities_updated_at ON public.user_notification_entities IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_notifications_updated_at BEFORE UPDATE ON public.user_notifications FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_notifications_updated_at ON public.user_notifications IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_registration_details_updated_at BEFORE UPDATE ON public.user_registration_details FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_registration_details_updated_at ON public.user_registration_details IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_user_terms_of_service_updated_at BEFORE UPDATE ON public.user_terms_of_service FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_terms_of_service_updated_at ON public.user_terms_of_service IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_username_logs_updated_at BEFORE UPDATE ON public.username_logs FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_username_logs_updated_at ON public.username_logs IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_usernames_claimed_updated_at BEFORE UPDATE ON public.usernames_claimed FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_usernames_claimed_updated_at ON public.usernames_claimed IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_coach_qualifications_updated_at BEFORE UPDATE ON public.users_coach_qualifications FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_coach_qualifications_updated_at ON public.users_coach_qualifications IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.app_pings
    ADD CONSTRAINT app_pings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.coach_qualifications
    ADD CONSTRAINT coach_qualifications_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.coach_qualification_groups(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.country_subdivisions
    ADD CONSTRAINT country_subdivisions_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_equipment
    ADD CONSTRAINT lesson_equipment_equipment_option_id_fkey FOREIGN KEY (equipment_option_id) REFERENCES public.lesson_equipment_options(value) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_equipment
    ADD CONSTRAINT lesson_equipment_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_order_items
    ADD CONSTRAINT lesson_order_items_lesson_order_id_fkey FOREIGN KEY (lesson_order_id) REFERENCES public.lesson_orders(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.lesson_order_items
    ADD CONSTRAINT lesson_order_items_lesson_participant_id_fkey FOREIGN KEY (lesson_participant_id) REFERENCES public.lesson_participants(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_order_items
    ADD CONSTRAINT lesson_order_items_refunded_by_persona_fkey FOREIGN KEY (refunded_by_persona) REFERENCES public.app_personas(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_order_items
    ADD CONSTRAINT lesson_order_items_status_fkey FOREIGN KEY (status) REFERENCES public.order_statuses(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_customer_user_id_fkey FOREIGN KEY (customer_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_external_stripe_payment_intent_id_fkey FOREIGN KEY (external_stripe_payment_intent_id) REFERENCES public.stripe_payment_intents(payment_intent_id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_internal_stripe_payment_intent_id_fkey FOREIGN KEY (internal_stripe_payment_intent_id) REFERENCES public.stripe_payment_intents(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_payment_processor_fkey FOREIGN KEY (payment_processor) REFERENCES public.payment_processors(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_refunded_by_persona_fkey FOREIGN KEY (refunded_by_persona) REFERENCES public.app_personas(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_seller_user_id_fkey FOREIGN KEY (seller_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_status_fkey FOREIGN KEY (status) REFERENCES public.order_statuses(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lesson_orders
    ADD CONSTRAINT lesson_orders_user_credit_card_id_fkey FOREIGN KEY (user_credit_card_id) REFERENCES public.user_credit_cards(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_added_by_persona_fkey FOREIGN KEY (added_by_persona) REFERENCES public.app_personas(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_refunded_by_persona_fkey FOREIGN KEY (refunded_by_persona) REFERENCES public.app_personas(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_removed_by_persona_fkey FOREIGN KEY (removed_by_persona) REFERENCES public.app_personas(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_status_fkey FOREIGN KEY (status) REFERENCES public.lesson_participant_statuses(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_participants
    ADD CONSTRAINT lesson_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_templates
    ADD CONSTRAINT lesson_templates_original_lesson_id_fkey FOREIGN KEY (original_lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_templates
    ADD CONSTRAINT lesson_templates_privacy_fkey FOREIGN KEY (privacy) REFERENCES public.lesson_privacy(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_templates
    ADD CONSTRAINT lesson_templates_type_fkey FOREIGN KEY (type) REFERENCES public.lesson_types(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_templates
    ADD CONSTRAINT lesson_templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lesson_times
    ADD CONSTRAINT lesson_times_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_privacy_fkey FOREIGN KEY (privacy) REFERENCES public.lesson_privacy(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_status_fkey FOREIGN KEY (status) REFERENCES public.lesson_statuses(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_type_fkey FOREIGN KEY (type) REFERENCES public.lesson_types(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_used_template_id_fkey FOREIGN KEY (used_template_id) REFERENCES public.lesson_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_user_custom_court_id_fkey FOREIGN KEY (user_custom_court_id) REFERENCES public.user_custom_courts(id) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.stripe_charges
    ADD CONSTRAINT stripe_charges_external_stripe_payment_intent_id_fkey FOREIGN KEY (external_stripe_payment_intent_id) REFERENCES public.stripe_payment_intents(payment_intent_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.stripe_charges
    ADD CONSTRAINT stripe_charges_internal_stripe_payment_intent_id_fkey FOREIGN KEY (internal_stripe_payment_intent_id) REFERENCES public.stripe_payment_intents(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_auth_identities
    ADD CONSTRAINT user_auth_identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_coach_services
    ADD CONSTRAINT user_coach_services_type_fkey FOREIGN KEY (type) REFERENCES public.lesson_types(value) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.user_coach_services
    ADD CONSTRAINT user_coach_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preference_participant_left_lesson_emai_fkey FOREIGN KEY (participant_left_lesson_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preference_participant_left_lesson_push_fkey FOREIGN KEY (participant_left_lesson_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_lesson_booked_email_fkey FOREIGN KEY (lesson_booked_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_lesson_booked_push_fkey FOREIGN KEY (lesson_booked_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_lesson_canceled_email_fkey FOREIGN KEY (lesson_canceled_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_lesson_canceled_pushed_fkey FOREIGN KEY (lesson_canceled_pushed) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_lesson_reminder_email_fkey FOREIGN KEY (lesson_reminder_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_lesson_reminder_push_fkey FOREIGN KEY (lesson_reminder_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_marketing_email_fkey FOREIGN KEY (marketing_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_marketing_push_fkey FOREIGN KEY (marketing_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_new_follower_email_fkey FOREIGN KEY (new_follower_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_new_follower_push_fkey FOREIGN KEY (new_follower_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_new_lesson_published_email_fkey FOREIGN KEY (new_lesson_published_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_new_lesson_published_push_fkey FOREIGN KEY (new_lesson_published_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_payout_email_fkey FOREIGN KEY (payout_email) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_communication_preferences
    ADD CONSTRAINT user_communication_preferences_payout_push_fkey FOREIGN KEY (payout_push) REFERENCES public.communication_preference_statuses(value) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.user_credit_cards
    ADD CONSTRAINT user_credit_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_custom_courts
    ADD CONSTRAINT user_custom_courts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_followed_user_id_fkey FOREIGN KEY (followed_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_user_id_fkey FOREIGN KEY (follower_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_status_fkey FOREIGN KEY (status) REFERENCES public.follow_statuses(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_image_log
    ADD CONSTRAINT user_image_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.user_notification_details
    ADD CONSTRAINT user_notification_details_action_type_fkey FOREIGN KEY (action_type) REFERENCES public.notification_action_types(value) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_notification_details
    ADD CONSTRAINT user_notification_details_user_notification_entity_id_fkey FOREIGN KEY (user_notification_entity_id) REFERENCES public.user_notification_entities(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_notification_entities
    ADD CONSTRAINT user_notification_entities_acting_user_id_fkey FOREIGN KEY (acting_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_notification_entities
    ADD CONSTRAINT user_notification_entities_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_status_fkey FOREIGN KEY (status) REFERENCES public.notification_statuses(value) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_user_notification_detail_id_fkey FOREIGN KEY (user_notification_detail_id) REFERENCES public.user_notification_details(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.user_registration_details
    ADD CONSTRAINT user_registration_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.user_terms_of_service
    ADD CONSTRAINT user_terms_of_service_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.username_logs
    ADD CONSTRAINT username_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.usernames_claimed
    ADD CONSTRAINT usernames_claimed_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.users_coach_qualifications
    ADD CONSTRAINT users_coach_qualifications_coach_qualification_id_fkey FOREIGN KEY (coach_qualification_id) REFERENCES public.coach_qualifications(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users_coach_qualifications
    ADD CONSTRAINT users_coach_qualifications_status_fkey FOREIGN KEY (status) REFERENCES public.coach_qualification_statuses(value) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users_coach_qualifications
    ADD CONSTRAINT users_coach_qualifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_coach_status_fkey FOREIGN KEY (coach_status) REFERENCES public.coach_status(value) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_country_subdivision_id_fkey FOREIGN KEY (country_subdivision_id) REFERENCES public.country_subdivisions(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_default_credit_card_id_fkey FOREIGN KEY (default_credit_card_id) REFERENCES public.user_credit_cards(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_gender_fkey FOREIGN KEY (gender) REFERENCES public.gender(value) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_normalized_tennis_rating_scale_id_fkey FOREIGN KEY (normalized_tennis_rating_scale_id) REFERENCES public.tennis_rating_scales(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_tennis_rating_scale_id_fkey FOREIGN KEY (tennis_rating_scale_id) REFERENCES public.tennis_rating_scales(id) ON UPDATE CASCADE ON DELETE SET NULL;
