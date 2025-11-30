--
-- PostgreSQL database dump
--

\restrict mIUpLKmNgqRPb3WC2zllhUHrlpzpupz1asda4OdIvlvr4ZF1Q2ngLOQ37ndNDmn

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('36bffd92-6169-4add-aa1c-2cc94e7f8433', 'owner21@example.com', 'Owner Test', 'user', '2025-11-29 20:05:55.750777');
INSERT INTO public.users VALUES ('dad9ab3d-7378-4004-92de-3f213321f47a', 'boss@bosses.com', 'Big Boss', 'user', '2025-11-29 20:06:12.942735');
INSERT INTO public.users VALUES ('bda042a7-868e-4341-9fbb-1f60edefb310', 'nim@burg.com', NULL, 'user', '2025-11-29 21:59:14.416396');
INSERT INTO public.users VALUES ('7a73ec86-75f1-429f-a7e4-4d4a2c1b751c', 'admin@admin.com', 'admin', 'user', '2025-11-29 22:51:51.618527');


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.jobs VALUES ('c3d76909-76ac-4621-ac41-30c2ff11f93f', 'Bouncer', 'Clubs Inc', 'Tel Aviv', 'Stand at the entrance', NULL, '2025-11-27 01:03:52.79145+00');
INSERT INTO public.jobs VALUES ('daddec96-0c8b-4ac2-8c4d-a08c8112e20c', 'Bartender', 'Emirates', 'London', '10 pounds/h', NULL, '2025-11-27 16:11:55.653186+00');
INSERT INTO public.jobs VALUES ('77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'Security Guard', 'Emirates', NULL, NULL, NULL, '2025-11-27 16:13:01.874062+00');
INSERT INTO public.jobs VALUES ('799caab9-cfe6-4652-82cf-aabf9fcbd2b8', 'Ticket Booth', 'Emirates', NULL, NULL, NULL, '2025-11-27 23:06:17.034331+00');
INSERT INTO public.jobs VALUES ('848404ae-0044-484f-b1c3-c7a928490dee', 'VIP Bartender', 'Wembley', 'Wembley Stadium', 'Pour drinks in the VIP floor, 10 pounds/h, 18:30-22:00', NULL, '2025-11-27 23:32:45.552849+00');
INSERT INTO public.jobs VALUES ('7b57a837-827b-4395-9d37-424e05f07d67', 'Pitch Watch', 'Wembley', 'Wembley Stadium', 'Keep the crowd off the pitch during the match', NULL, '2025-11-27 23:41:03.119524+00');
INSERT INTO public.jobs VALUES ('ef7df278-438d-486c-b536-35288eaf58dc', 'Paramedic', 'Wembley', 'Wembley Stadium', 'a certified paramedic is needed for matchday ', NULL, '2025-11-28 16:16:41.947004+00');
INSERT INTO public.jobs VALUES ('9faebcff-865d-4985-ba3b-06e0e11cf4c5', 'Backstage Organizer', 'Taylor Swift Co.', 'O2 Stadium', 'This is some description for a backstage organizer job in a Taylor Swift concert ', NULL, '2025-11-28 16:39:14.407999+00');
INSERT INTO public.jobs VALUES ('28aa50eb-77d0-4b59-92a4-24600d9c1244', 'Cleaner', 'Maintenance Company', 'O2 Stadium', '* Requires two years of experience as a cleaner
* Pays by the hour
* Music concerts and festivals', NULL, '2025-11-28 18:25:00.829827+00');
INSERT INTO public.jobs VALUES ('613c4323-45f0-445c-83e2-777fbdbc8cd1', 'Undercover Dancer', 'Weddings Balagan', NULL, 'This is a job posting meant to push longer job posts lower so I can see the affect on the UI and make sure it doesn''t break', NULL, '2025-11-28 19:01:40.975927+00');
INSERT INTO public.jobs VALUES ('d5e97ab5-fd63-4e1e-84f3-31401898d20a', 'People Counter', 'Entrances Baam', 'Concert Hall', 'Count the people entering the hall', NULL, '2025-11-28 19:25:50.134313+00');
INSERT INTO public.jobs VALUES ('a445f083-1b6b-4bfb-8ba1-db53b6edbc1b', 'Host', 'MSG', 'NYC', 'A host at the entrance of the 1st floor restaurant at MSG
5 hours gig', NULL, '2025-11-28 20:00:27.106221+00');
INSERT INTO public.jobs VALUES ('3fa012f8-3ba0-450d-b90e-c569e30f47e7', 'OwnerTest Job', 'Owners Co', NULL, NULL, 'bda042a7-868e-4341-9fbb-1f60edefb310', '2025-11-29 21:59:41.596446+00');
INSERT INTO public.jobs VALUES ('57781408-0882-450e-9def-5fec6bff0ddc', 'New Drawer Job', 'Drawers Co.', NULL, NULL, 'bda042a7-868e-4341-9fbb-1f60edefb310', '2025-11-30 00:52:03.064947+00');
INSERT INTO public.jobs VALUES ('1fb661aa-fed0-4590-a124-31d3699e88f9', 'Closing Job', 'Closers', NULL, NULL, 'bda042a7-868e-4341-9fbb-1f60edefb310', '2025-11-30 00:54:07.12917+00');


--
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.registrations VALUES ('4637b4b3-3b5d-4224-b7fc-ef31efa192aa', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'example@emails.com', '2025-11-26 23:16:07.863949');
INSERT INTO public.registrations VALUES ('5746da63-3384-446f-b7be-25cb67bdef41', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'another@gmail.com', '2025-11-26 23:16:55.889529');
INSERT INTO public.registrations VALUES ('09f37cd5-679e-4f30-b701-361b0bfefa38', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'arteta@gmail.com', '2025-11-27 15:04:17.977434');
INSERT INTO public.registrations VALUES ('c1d90407-36b9-4fa2-b5d2-567d1482a42a', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'saka@afc.com', '2025-11-27 15:04:34.783299');
INSERT INTO public.registrations VALUES ('e0bba8b8-ce26-46ec-a2e6-16e00859ce60', 'daddec96-0c8b-4ac2-8c4d-a08c8112e20c', 'odeggard@norway.com', '2025-11-27 18:07:11.53871');
INSERT INTO public.registrations VALUES ('7af3f36c-1a6b-4323-8cf8-cabfe2c8be36', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'henry@afc.com', '2025-11-28 18:16:20.157291');
INSERT INTO public.registrations VALUES ('fd269710-29f7-47cf-8116-ff85273461db', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'gunner@afc.com', '2025-11-28 18:16:42.5382');
INSERT INTO public.registrations VALUES ('5b1395cb-049a-4f06-a018-544020f84a53', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'long@list.org', '2025-11-28 18:19:40.982921');
INSERT INTO public.registrations VALUES ('fc5acb41-ff4c-4940-91e3-6eb012a2dc4f', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'longer@list.com', '2025-11-28 18:19:56.639513');
INSERT INTO public.registrations VALUES ('91a318a0-3774-4485-a696-caafaf0f43c5', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'test@gmail.com', '2025-11-28 18:23:53.201704');
INSERT INTO public.registrations VALUES ('fb83b4d0-5bb3-42c8-a507-bf699dcc78bd', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'another@one.com', '2025-11-28 18:24:23.438358');
INSERT INTO public.registrations VALUES ('d4a231b8-1587-4b65-a611-97b7b5f08177', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'bananas@append.com', '2025-11-28 18:24:33.779164');
INSERT INTO public.registrations VALUES ('7030badc-a241-4ec5-9c85-871599e057a6', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'a@lot.com', '2025-11-28 18:42:47.063173');
INSERT INTO public.registrations VALUES ('e86182d1-c46d-439d-8794-6fc70177218c', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'many@names.org', '2025-11-28 18:42:52.119891');
INSERT INTO public.registrations VALUES ('67e81a45-dbe1-4773-a4e9-2c5f68d34878', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'longest@list.ever', '2025-11-28 18:42:56.907745');
INSERT INTO public.registrations VALUES ('e5f35856-63bf-436f-a298-453638a27d0d', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'check@this.one', '2025-11-28 18:43:09.489879');
INSERT INTO public.registrations VALUES ('c247cd63-cbce-4ea4-9583-250d29919296', '77652628-e5ef-4bad-bce9-95d8ce29dc4c', 'maybe@make.scroll', '2025-11-28 18:43:21.113951');
INSERT INTO public.registrations VALUES ('689f5a09-f4eb-4b7a-b5cc-66c2c8c395f4', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'mails@emails.com', '2025-11-29 21:50:07.885991');
INSERT INTO public.registrations VALUES ('3648662c-07dc-475e-92a2-03e09022bd05', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'register@signup.org', '2025-11-29 21:50:21.536084');
INSERT INTO public.registrations VALUES ('4e17497a-3b31-4d14-acf4-173d53a1a827', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'create@list.com', '2025-11-29 21:50:43.907046');
INSERT INTO public.registrations VALUES ('9584b98b-061d-43b4-8ce2-a18857ee9204', 'c3d76909-76ac-4621-ac41-30c2ff11f93f', 'scrollable@scrolls.sc', '2025-11-29 21:50:52.644176');
INSERT INTO public.registrations VALUES ('1c23b69b-e6d6-4844-8845-3232cd50bcb1', '3fa012f8-3ba0-450d-b90e-c569e30f47e7', 'app@note.nice', '2025-11-29 23:18:53.193463');
INSERT INTO public.registrations VALUES ('ba658839-2c20-4469-ac4a-2c93cd0b20ca', '9faebcff-865d-4985-ba3b-06e0e11cf4c5', 'test@test.com', '2025-11-30 02:27:44.759469');


--
-- PostgreSQL database dump complete
--

\unrestrict mIUpLKmNgqRPb3WC2zllhUHrlpzpupz1asda4OdIvlvr4ZF1Q2ngLOQ37ndNDmn

