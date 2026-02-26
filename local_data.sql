SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict E9ehObhiPA73ZzDN86CEHZMqA8hpipoHfx7SMuvEwhLWeo8BCYjhxyyehsEOYbW

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '8c75d829-c2bb-4f12-8802-e5225dd3a4bd', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"treblamagic@gmail.com","user_id":"3bff8cd6-c77c-4b01-ae7c-ed154a551df1","user_phone":""}}', '2026-02-26 00:46:00.799843+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f35629ee-42d9-418f-96bc-edacd9050045', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"treblamagic@gmail.com","user_id":"74597bea-1182-4227-8c12-3e8a1c64f705","user_phone":""}}', '2026-02-26 00:46:01.005362+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e87fa511-40ea-4eaa-bc01-ebf158432016', '{"action":"login","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-02-26 00:46:15.840483+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4e2b185-982b-4499-8091-7bec093db13d', '{"action":"token_refreshed","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-26 02:23:33.70904+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee70089c-243b-4a2b-bd2f-6295c76899f5', '{"action":"token_revoked","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-26 02:23:33.722383+00', ''),
	('00000000-0000-0000-0000-000000000000', '57df47e6-c892-47a2-ac22-7b6eb07c662f', '{"action":"token_refreshed","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-26 03:22:17.030885+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce0835c0-641b-4ebc-bde1-8c1c734b1349', '{"action":"token_revoked","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-26 03:22:17.035129+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ba50fe3-9b2b-47c0-8249-b9512997a638', '{"action":"logout","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-02-26 04:02:12.989695+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a937fcd3-f3cb-42c8-8e19-44a6f5b56a1e', '{"action":"login","actor_id":"74597bea-1182-4227-8c12-3e8a1c64f705","actor_username":"treblamagic@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-02-26 04:08:17.396463+00', '');


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '74597bea-1182-4227-8c12-3e8a1c64f705', 'authenticated', 'authenticated', 'treblamagic@gmail.com', '$2a$10$2taF3/6Uw84BY8t1qGFU8eW7JcnTkL5runOUs6x300avp2FamOvzm', '2026-02-26 00:46:01.010308+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-26 04:08:17.398139+00', '{"provider": "email", "providers": ["email"]}', '{"username": "treblamagic", "email_verified": true}', NULL, '2026-02-26 00:46:00.986474+00', '2026-02-26 04:08:17.409259+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('74597bea-1182-4227-8c12-3e8a1c64f705', '74597bea-1182-4227-8c12-3e8a1c64f705', '{"sub": "74597bea-1182-4227-8c12-3e8a1c64f705", "email": "treblamagic@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-02-26 00:46:01.000392+00', '2026-02-26 00:46:01.000488+00', '2026-02-26 00:46:01.000488+00', '345149f4-b9d9-44ab-8688-0b206f504205');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('0306e040-0158-439e-9f04-3d6e85ef4c2f', '74597bea-1182-4227-8c12-3e8a1c64f705', '2026-02-26 04:08:17.398257+00', '2026-02-26 04:08:17.398257+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '172.18.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('0306e040-0158-439e-9f04-3d6e85ef4c2f', '2026-02-26 04:08:17.410576+00', '2026-02-26 04:08:17.410576+00', 'password', '1a1763c9-1324-4a08-8a54-42df58e6f0c3');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 4, 'thh7xrb5rvc5', '74597bea-1182-4227-8c12-3e8a1c64f705', false, '2026-02-26 04:08:17.402318+00', '2026-02-26 04:08:17.402318+00', NULL, '0306e040-0158-439e-9f04-3d6e85ef4c2f');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "name", "email", "position", "department", "hire_date", "salary", "leave_days_allocated", "created_at", "updated_at", "phone") VALUES
	('cd8b2ed0-1d75-4ae8-b246-53002fcab3b5', 'Alex Rivera', 'a.rivera@demo-corp.com', 'Engineering Manager', 'Engineering', '2019-05-13', 12080.00, 15, '2026-02-26 02:52:51.428663+00', '2026-02-26 03:26:07.65541+00', '555-010-1234'),
	('2df8c1e9-b6c5-4d1e-9b8d-ba85d9814541', 'David Wu', 'd.wu@demo-corp.com', 'Financial Analyst', 'Finance', '2023-02-10', 7300.00, 15, '2026-02-26 02:57:40.527455+00', '2026-02-26 03:26:24.921219+00', '555-010-7890'),
	('62c99131-99ab-422d-9e6c-d0eaaadaadb5', 'Elena Rodriguez', 'e.rodriguez@demo-corp.com', 'Head of Marketing', 'Marketing', '2018-11-01', 63300.00, 15, '2026-02-26 02:56:47.543431+00', '2026-02-26 03:26:44.826198+00', '555-010-3456'),
	('133f4eaa-ac59-4454-bf21-fc144fe99a76', 'Isabella Rossi', 'i.rossi@demo-corp.com', 'Content Strategist', 'Marketing', '2024-04-08', 6800.00, 15, '2026-02-26 03:00:48.728976+00', '2026-02-26 03:27:01.786167+00', '555-010-4567'),
	('e14fe1bc-8d58-4b37-93e6-d50c8bc0ad83', 'Jordan Smith', 'j.smith@demo-corp.com', 'Sales Executive', 'Sales', '2020-11-23', 6250.00, 15, '2026-02-26 02:59:15.315464+00', '2026-02-26 03:27:15.662476+00', '555-010-6789'),
	('8d107d0b-838b-4781-8446-b32f2dacb154', 'Liam O’Connor', 'l.oconnor@demo-corp.com', 'IT Support Tech', 'IT', '2023-10-12', 4800.00, 15, '2026-02-26 03:01:29.195244+00', '2026-02-26 03:27:37.219849+00', '555-010-8901'),
	('f45edd5c-0781-4e06-bd4a-8e25c3f3c881', 'Marcus Chen', 'm.chen@demo-corp.com', 'Full Stack Developer', 'Engineering', '2022-11-14', 9500.00, 15, '2026-02-26 02:54:52.539101+00', '2026-02-26 03:27:51.280096+00', '555-010-9012'),
	('b8b79d10-fe32-4bdc-970c-61c466f45040', 'Priya Sharma', 'p.sharma@demo-corp.com', 'UX Designer', 'Product', '2021-07-22', 8750.00, 15, '2026-02-26 02:58:31.637091+00', '2026-02-26 03:28:19.29692+00', '555-010-2345'),
	('21bf25b6-53ec-429b-ad00-ea7bc65ad29f', 'Sam Taylor', 's.taylor@demo-corp.com', 'Customer Success', 'Operations', '2024-01-05', 5100.00, 15, '2026-02-26 03:00:01.13286+00', '2026-02-26 03:28:36.189837+00', '555-010-0123'),
	('5e8c7844-d1ac-4be2-af4b-eda3ad94beb6', 'Sarah Jenkins', 's.jenkins@demo-corp.com', 'Senior HR Specialist', 'People & Culture', '2021-03-22', 7600.00, 15, '2026-02-26 02:54:04.708422+00', '2026-02-26 03:28:55.380499+00', '555-010-5678');


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."attendance" ("id", "employee_id", "date", "status", "created_at", "updated_at") VALUES
	('b5e207ca-4dbc-4153-bdb0-689772866c09', 'cd8b2ed0-1d75-4ae8-b246-53002fcab3b5', '2026-02-26', 'On Time', '2026-02-26 03:02:34.044307+00', '2026-02-26 03:02:34.044307+00'),
	('202a75c8-1fc6-4e9d-887a-a618853c0042', '2df8c1e9-b6c5-4d1e-9b8d-ba85d9814541', '2026-02-26', 'On Time', '2026-02-26 03:10:21.807384+00', '2026-02-26 03:10:21.807384+00'),
	('0d484d28-e276-4079-a46e-2942aa41cb72', '62c99131-99ab-422d-9e6c-d0eaaadaadb5', '2026-02-26', 'On Time', '2026-02-26 03:11:00.950227+00', '2026-02-26 03:11:00.950227+00'),
	('ac91b30f-a150-4591-9f1c-b8ba2c7ca67e', '133f4eaa-ac59-4454-bf21-fc144fe99a76', '2026-02-26', 'Late', '2026-02-26 03:11:07.499388+00', '2026-02-26 03:11:07.499388+00'),
	('4c95f602-5ef7-4f0a-ba95-8c166a10e6b7', '8d107d0b-838b-4781-8446-b32f2dacb154', '2026-02-26', 'On Time', '2026-02-26 03:11:11.574957+00', '2026-02-26 03:11:11.574957+00'),
	('9685eda0-fb15-4461-8a51-7d8c455bdd0d', 'f45edd5c-0781-4e06-bd4a-8e25c3f3c881', '2026-02-26', 'Very Late', '2026-02-26 03:11:20.834658+00', '2026-02-26 03:11:20.834658+00'),
	('0571e5b7-5320-41ef-964d-182fd61d7d06', 'b8b79d10-fe32-4bdc-970c-61c466f45040', '2026-02-26', 'Late', '2026-02-26 03:11:25.276552+00', '2026-02-26 03:11:25.276552+00'),
	('0a343f82-2377-450f-bc10-20482d1f7c51', '21bf25b6-53ec-429b-ad00-ea7bc65ad29f', '2026-02-26', 'On Time', '2026-02-26 03:11:29.726985+00', '2026-02-26 03:11:29.726985+00'),
	('5944e8d8-055a-44fb-9211-d7d0b0384642', '5e8c7844-d1ac-4be2-af4b-eda3ad94beb6', '2026-02-26', 'On Time', '2026-02-26 03:11:31.868888+00', '2026-02-26 03:11:31.868888+00');


--
-- Data for Name: bonuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."bonuses" ("id", "employee_id", "amount", "reason", "date", "created_at", "updated_at") VALUES
	('ad1e3f94-785b-45d1-958d-e038f5dc6dd4', 'f45edd5c-0781-4e06-bd4a-8e25c3f3c881', 5000.00, 'Performance Bonus', '2026-02-26', '2026-02-26 03:33:39.686426+00', '2026-02-26 03:33:39.686426+00');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "name", "email", "phone", "address", "created_at", "updated_at") VALUES
	('1bc4bafc-291c-44e8-88a4-fbcac6621b4c', 'John Doe', 'doe@gmail.com', '555-010-5678', 'Cliff Avenue', '2026-02-26 03:58:37.530822+00', '2026-02-26 03:58:37.530822+00');


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."invoices" ("id", "customer_id", "customer_name", "customer_email", "customer_phone", "customer_address", "items", "subtotal", "tax", "total", "status", "type", "created_at", "updated_at", "date", "due_date", "notes") VALUES
	('d135d01c-a6c5-4d78-9b6f-660c2d2f3ae6', '1bc4bafc-291c-44e8-88a4-fbcac6621b4c', 'John Doe', 'doe@gmail.com', '555-010-5678', 'Cliff Avenue', '[{"id": "65d3b4b8-bc8d-4a53-baf7-4d7d9c715731", "name": "Gateway Z4", "type": "equipment", "amount": 87.5, "quantity": 1, "unitPrice": 87.5, "description": "5G-ready gateway with Wi-Fi 6"}, {"id": "8072c936-775c-4836-a7c8-5e75c83d6f69", "name": "Meraki MX105", "type": "equipment", "amount": 625, "quantity": 1, "unitPrice": 625, "description": "Enterprise-grade router (rack mount) - Up to 750 users"}, {"id": "0b86e325-7eea-432b-9c17-d0a16e6f9722", "name": "MR36 Wi-Fi 6 AP", "type": "equipment", "amount": 375, "quantity": 1, "unitPrice": 375, "description": "Higher-performance Wi-Fi 6 access point"}, {"id": "7fe212b9-07be-4a59-a231-17107a0a421e", "name": "20 Mbps", "type": "internet_speed", "amount": 325, "quantity": 1, "unitPrice": 325, "description": "Startup teams"}, {"id": "f99ec053-4541-406e-a02b-333cafd88599", "name": "Setup", "type": "setup_cost", "amount": 120, "quantity": 1, "unitPrice": 120, "description": "FLAT"}, {"id": "8142d5a5-14f6-4ca6-9f1d-184dca531762", "name": "Pro", "type": "managed_service", "amount": 432, "quantity": 1, "unitPrice": 432, "description": "27x7"}]', 1964.50, 98.23, 2062.73, 'pending', 'full', '2026-02-26 03:58:37.592+00', '2026-02-26 03:58:37.592+00', '2026-02-26 03:58:37.592+00', '2026-03-28 03:58:37.592+00', 'Thank you for your business!');


--
-- Data for Name: isp_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isp_equipment" ("id", "name", "description", "price", "stock", "created_at", "updated_at") VALUES
	('8116a1a3-00a9-485b-9b60-85e408dc7bbd', 'Meraki MX67W', 'Small branch router with built-in Wi-Fi - Up to 50 users', 70.00, 500, '2026-02-26 03:45:07.535419+00', '2026-02-26 03:45:07.535419+00'),
	('5bce33b7-68f9-4ffc-ba6a-a7a3e21085ff', 'Meraki MX68CW', 'Router with Wi-Fi + LTE failover - Up to 50 users', 90.00, 500, '2026-02-26 03:45:42.058175+00', '2026-02-26 03:45:42.058175+00'),
	('641e0d6a-522c-4994-b159-15936cd05007', 'Meraki MX75', 'High-performance small branch router - Up to 200 users', 250.00, 500, '2026-02-26 03:46:15.328163+00', '2026-02-26 03:46:15.328163+00'),
	('8072c936-775c-4836-a7c8-5e75c83d6f69', 'Meraki MX105', 'Enterprise-grade router (rack mount) - Up to 750 users', 500.00, 500, '2026-02-26 03:47:25.97552+00', '2026-02-26 03:47:25.97552+00'),
	('04df2b48-1f95-43c2-aa17-39f7783bc4ce', 'Gateway Z4C', 'LTE-enabled gateway with Wi-Fi 6 (remote work)', 90.00, 250, '2026-02-26 03:48:09.264194+00', '2026-02-26 03:48:09.264194+00'),
	('65d3b4b8-bc8d-4a53-baf7-4d7d9c715731', 'Gateway Z4', '5G-ready gateway with Wi-Fi 6', 70.00, 250, '2026-02-26 03:48:38.661955+00', '2026-02-26 03:48:38.661955+00'),
	('2d872467-786a-4161-898f-bf62297e2c38', 'MS130-8P Switch', '8-port PoE switch (small deployments)', 90.00, 500, '2026-02-26 03:49:23.718266+00', '2026-02-26 03:49:23.718266+00'),
	('87ad54bd-3d21-49e9-8f68-59966f3b83e5', 'MS130-12X Switch', 'High-speed mGig switch', 120.00, 500, '2026-02-26 03:49:47.041007+00', '2026-02-26 03:49:47.041007+00'),
	('7efd9a0b-9fb7-4abe-8249-1f9d5ccc558b', 'MS130-24P Switch', '24-port PoE switch (medium deployments)', 200.00, 250, '2026-02-26 03:50:18.230323+00', '2026-02-26 03:50:18.230323+00'),
	('9f36b31d-a871-4d56-95d5-a056d5fdf573', 'MR28 Wi-Fi 6 AP', 'Entry-level Wi-Fi 6 access point', 120.00, 500, '2026-02-26 03:50:48.01813+00', '2026-02-26 03:50:48.01813+00'),
	('0b86e325-7eea-432b-9c17-d0a16e6f9722', 'MR36 Wi-Fi 6 AP', 'Higher-performance Wi-Fi 6 access point', 300.00, 100, '2026-02-26 03:51:13.781568+00', '2026-02-26 03:51:13.781568+00'),
	('562a44b8-bca1-4923-afb5-85e0c594c263', 'MV32 Camera', '360° smart security camera (with license + analytics)', 300.00, 60, '2026-02-26 03:51:58.63682+00', '2026-02-26 03:51:58.63682+00');


--
-- Data for Name: isp_internet_speeds; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isp_internet_speeds" ("id", "mbps", "description", "price", "created_at", "updated_at") VALUES
	('e6e7f968-167d-42ee-85cc-3c8a15139608', 10, 'Small office', 150.00, '2026-02-26 03:55:07.854887+00', '2026-02-26 03:55:07.854887+00'),
	('7fe212b9-07be-4a59-a231-17107a0a421e', 20, 'Startup teams', 250.00, '2026-02-26 03:55:20.208233+00', '2026-02-26 03:55:20.208233+00'),
	('8bf987a9-6d26-4e09-af31-4b7a3e8d49bc', 50, 'Medium business', 500.00, '2026-02-26 03:55:40.754137+00', '2026-02-26 03:55:40.754137+00'),
	('b99cd02c-3f8d-4b7e-bbdb-3f381d9b1b57', 100, 'Large office', 900.00, '2026-02-26 03:55:57.391092+00', '2026-02-26 03:55:57.391092+00'),
	('cb458300-a1f7-4666-9b7e-df95ba6f5cf6', 200, 'Heavy usage', 1500.00, '2026-02-26 03:56:13.758863+00', '2026-02-26 03:56:13.758863+00'),
	('35123002-fbd5-448a-9076-9fbcf91e75fa', 500, 'Enterprise', 3000.00, '2026-02-26 03:56:31.242844+00', '2026-02-26 03:56:31.242844+00'),
	('52e725f6-5b24-49fd-a06b-74de5a26fe2f', 1000, 'Data-heavy orgs', 5000.00, '2026-02-26 03:56:49.082436+00', '2026-02-26 03:56:49.082436+00');


--
-- Data for Name: isp_managed_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isp_managed_services" ("id", "name", "description", "price", "created_at", "updated_at") VALUES
	('c9167d89-a568-49bf-bb0a-3dc418dedba5', 'Basic', '8x5', 160.00, '2026-02-26 03:42:31.483522+00', '2026-02-26 03:42:31.483522+00'),
	('8142d5a5-14f6-4ca6-9f1d-184dca531762', 'Pro', '27x7', 320.00, '2026-02-26 03:42:57.110358+00', '2026-02-26 03:42:57.110358+00');


--
-- Data for Name: isp_markup_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isp_markup_settings" ("id", "equipment_markup", "mbps_markup", "setup_markup", "managed_services_markup", "created_at", "updated_at") VALUES
	('1cbc1651-310c-4edb-9534-3ac07206812f', 25.00, 30.00, 20.00, 35.00, '2026-02-26 00:00:33.214896+00', '2026-02-26 00:00:33.214896+00');


--
-- Data for Name: isp_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isp_setup_costs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isp_setup_costs" ("id", "name", "description", "price", "created_at", "updated_at") VALUES
	('f99ec053-4541-406e-a02b-333cafd88599', 'Setup', 'FLAT', 100.00, '2026-02-26 03:43:37.117602+00', '2026-02-26 03:43:37.117602+00');


--
-- Data for Name: leave_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."leave_records" ("id", "employee_id", "start_date", "end_date", "days_used", "reason", "status", "created_at", "updated_at") VALUES
	('ab1ccf78-3d3f-4fad-985e-83ed2ee5712d', '62c99131-99ab-422d-9e6c-d0eaaadaadb5', '2026-02-09', '2026-02-13', 5, 'Paid', 'Approved', '2026-02-26 03:17:51.318909+00', '2026-02-26 03:17:51.318909+00'),
	('830a2987-6c76-49ac-b3bc-c534909830a5', '2df8c1e9-b6c5-4d1e-9b8d-ba85d9814541', '2026-02-16', '2026-02-18', 3, 'Sick', 'Approved', '2026-02-26 03:19:15.542162+00', '2026-02-26 03:19:15.542162+00'),
	('51b0f394-cbaf-4144-b40b-8c1561888201', '21bf25b6-53ec-429b-ad00-ea7bc65ad29f', '2026-02-17', '2026-02-18', 2, 'sick', 'Approved', '2026-02-26 03:19:35.525044+00', '2026-02-26 03:19:35.525044+00'),
	('456fc0a4-e4ca-477d-ab57-36e636d21826', 'b8b79d10-fe32-4bdc-970c-61c466f45040', '2026-02-25', '2026-02-25', 1, 'Family', 'Approved', '2026-02-26 03:19:57.510446+00', '2026-02-26 03:19:57.510446+00');


--
-- Data for Name: payment_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payment_status" ("id", "employee_id", "year", "months", "created_at", "updated_at") VALUES
	('8f6aa6d6-16d5-4cf5-a503-6258019c3da7', 'cd8b2ed0-1d75-4ae8-b246-53002fcab3b5', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.114553+00', '2026-02-26 03:29:13.485854+00'),
	('3c5b5d6c-7865-4294-b32b-211d8a4bb42b', '2df8c1e9-b6c5-4d1e-9b8d-ba85d9814541', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.124568+00', '2026-02-26 03:29:16.777554+00'),
	('08e47979-a83d-4a15-8b0b-a9299a74e665', '62c99131-99ab-422d-9e6c-d0eaaadaadb5', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.112554+00', '2026-02-26 03:29:19.533363+00'),
	('ef78670b-f884-4193-bbc0-daf11fe79e4f', '133f4eaa-ac59-4454-bf21-fc144fe99a76', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.119048+00', '2026-02-26 03:29:23.630344+00'),
	('9395645c-2521-43b0-98e1-1d287392a134', 'e14fe1bc-8d58-4b37-93e6-d50c8bc0ad83', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.117679+00', '2026-02-26 03:29:27.654812+00'),
	('448881a5-8652-4e44-8c2d-225862d60d80', '8d107d0b-838b-4781-8446-b32f2dacb154', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.132972+00', '2026-02-26 03:29:31.06194+00'),
	('d0680273-b524-4374-91b2-78e3fec1f412', 'f45edd5c-0781-4e06-bd4a-8e25c3f3c881', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.135988+00', '2026-02-26 03:29:34.630634+00'),
	('54acc16e-86fe-43eb-b3ad-e4ff4553a2aa', 'b8b79d10-fe32-4bdc-970c-61c466f45040', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.13924+00', '2026-02-26 03:29:37.885926+00'),
	('3bb800b6-d1c7-487b-a39e-0b0d7ee5a7fb', '21bf25b6-53ec-429b-ad00-ea7bc65ad29f', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.147673+00', '2026-02-26 03:29:41.105158+00'),
	('04140f41-5eed-4d64-b662-79f3d2f14d3f', '5e8c7844-d1ac-4be2-af4b-eda3ad94beb6', 2026, '{"May": false, "July": false, "June": false, "April": false, "March": false, "August": false, "January": true, "October": false, "December": false, "February": true, "November": false, "September": false}', '2026-02-26 03:20:41.152687+00', '2026-02-26 03:29:46.795669+00');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "username", "role", "created_at") VALUES
	('c910baab-a936-4b92-8b74-cbab72c09fc8', '74597bea-1182-4227-8c12-3e8a1c64f705', 'treblamagic', 'IT', '2026-02-26 00:46:01.258109+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict E9ehObhiPA73ZzDN86CEHZMqA8hpipoHfx7SMuvEwhLWeo8BCYjhxyyehsEOYbW

RESET ALL;
