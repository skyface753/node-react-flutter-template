--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE testdb;




--
-- Drop roles
--

DROP ROLE testuser;


--
-- Roles
--

CREATE ROLE testuser;
ALTER ROLE testuser WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:NswgEued90madVZLjpc6Ng==$BPCugW24jLvaQVAZUmpseKkmnr+cDzjL9MFxymsBhYA=:FKPFOT54nVJOt3am7neY82E994GID20k9G27mhP6u8M=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

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

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: testuser
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO testuser;

\connect template1

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
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: testuser
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: testuser
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

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
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: testuser
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

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

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: testuser
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO testuser;

\connect postgres

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
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: testuser
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- Database "testdb" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

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
-- Name: testdb; Type: DATABASE; Schema: -; Owner: testuser
--

CREATE DATABASE testdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE testdb OWNER TO testuser;

\connect testdb

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
-- Name: testuser; Type: SCHEMA; Schema: -; Owner: testuser
--

CREATE SCHEMA testuser;


ALTER SCHEMA testuser OWNER TO testuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avatar; Type: TABLE; Schema: testuser; Owner: testuser
--

CREATE TABLE testuser.avatar (
    userfk integer NOT NULL,
    originalname character varying(255) NOT NULL,
    generatedpath character varying(255) NOT NULL,
    type character varying(255) NOT NULL
);


ALTER TABLE testuser.avatar OWNER TO testuser;

--
-- Name: role; Type: TABLE; Schema: testuser; Owner: testuser
--

CREATE TABLE testuser.role (
    id integer NOT NULL,
    title character varying(255) NOT NULL
);


ALTER TABLE testuser.role OWNER TO testuser;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: testuser; Owner: testuser
--

CREATE SEQUENCE testuser.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE testuser.role_id_seq OWNER TO testuser;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: testuser; Owner: testuser
--

ALTER SEQUENCE testuser.role_id_seq OWNED BY testuser.role.id;


--
-- Name: user; Type: TABLE; Schema: testuser; Owner: testuser
--

CREATE TABLE testuser."user" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    rolefk integer NOT NULL
);


ALTER TABLE testuser."user" OWNER TO testuser;

--
-- Name: user_2fa; Type: TABLE; Schema: testuser; Owner: testuser
--

CREATE TABLE testuser.user_2fa (
    userfk integer NOT NULL,
    secretbase32 character varying(255) NOT NULL,
    verified boolean DEFAULT false NOT NULL
);


ALTER TABLE testuser.user_2fa OWNER TO testuser;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: testuser; Owner: testuser
--

CREATE SEQUENCE testuser.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE testuser.user_id_seq OWNER TO testuser;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: testuser; Owner: testuser
--

ALTER SEQUENCE testuser.user_id_seq OWNED BY testuser."user".id;


--
-- Name: role id; Type: DEFAULT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.role ALTER COLUMN id SET DEFAULT nextval('testuser.role_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser."user" ALTER COLUMN id SET DEFAULT nextval('testuser.user_id_seq'::regclass);


--
-- Data for Name: avatar; Type: TABLE DATA; Schema: testuser; Owner: testuser
--

COPY testuser.avatar (userfk, originalname, generatedpath, type) FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: testuser; Owner: testuser
--

COPY testuser.role (id, title) FROM stdin;
1	admin
0	user
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: testuser; Owner: testuser
--

COPY testuser."user" (id, username, password, rolefk) FROM stdin;
1	user	$2b$10$JrCpPmsxZgVNhGUuJu.O3eOCPP0BWauxliEdDwUtomez7cUQ/rwIG	0
2	admin	$2b$10$9rFxyAR5jVdmfITgECheEON5kCjGySKBgiFmentexGsNhmcYelAFK	1
\.


--
-- Data for Name: user_2fa; Type: TABLE DATA; Schema: testuser; Owner: testuser
--

COPY testuser.user_2fa (userfk, secretbase32, verified) FROM stdin;
\.


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: testuser; Owner: testuser
--

SELECT pg_catalog.setval('testuser.role_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: testuser; Owner: testuser
--

SELECT pg_catalog.setval('testuser.user_id_seq', 415, true);


--
-- Name: avatar avatar_pk; Type: CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.avatar
    ADD CONSTRAINT avatar_pk PRIMARY KEY (userfk);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: role role_title_key; Type: CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.role
    ADD CONSTRAINT role_title_key UNIQUE (title);


--
-- Name: user_2fa user_2fa_pk; Type: CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.user_2fa
    ADD CONSTRAINT user_2fa_pk PRIMARY KEY (userfk);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user user_username_key; Type: CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: avatar avatar_userfk_fkey; Type: FK CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.avatar
    ADD CONSTRAINT avatar_userfk_fkey FOREIGN KEY (userfk) REFERENCES testuser."user"(id) ON DELETE CASCADE;


--
-- Name: user fk_role; Type: FK CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser."user"
    ADD CONSTRAINT fk_role FOREIGN KEY (rolefk) REFERENCES testuser.role(id) ON DELETE CASCADE;


--
-- Name: user_2fa user_2fa_userfk_fkey; Type: FK CONSTRAINT; Schema: testuser; Owner: testuser
--

ALTER TABLE ONLY testuser.user_2fa
    ADD CONSTRAINT user_2fa_userfk_fkey FOREIGN KEY (userfk) REFERENCES testuser."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

