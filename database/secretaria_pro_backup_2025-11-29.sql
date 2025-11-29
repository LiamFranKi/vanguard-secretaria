--
-- PostgreSQL database dump
--

\restrict lOU1lqdKl06Wl9Smk9aPh08uPxGlMqmP05rDcIawkvs6KdCaXC3Z8ho6TYOgRc1

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-29 14:03:36

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

DROP DATABASE IF EXISTS secretaria_pro;
--
-- TOC entry 5092 (class 1262 OID 18751)
-- Name: secretaria_pro; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE secretaria_pro WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Peru.1252';


ALTER DATABASE secretaria_pro OWNER TO postgres;

\unrestrict lOU1lqdKl06Wl9Smk9aPh08uPxGlMqmP05rDcIawkvs6KdCaXC3Z8ho6TYOgRc1
\connect secretaria_pro
\restrict lOU1lqdKl06Wl9Smk9aPh08uPxGlMqmP05rDcIawkvs6KdCaXC3Z8ho6TYOgRc1

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
-- TOC entry 241 (class 1255 OID 18900)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 18788)
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    role character varying(255),
    avatar text,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    direccion text,
    empresa character varying(255),
    detalle text
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18787)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 221
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- TOC entry 226 (class 1259 OID 18818)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(20) NOT NULL,
    size character varying(50) NOT NULL,
    file_path text NOT NULL,
    folder_id integer,
    user_id integer NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT documents_type_check CHECK (((type)::text = ANY ((ARRAY['pdf'::character varying, 'doc'::character varying, 'xls'::character varying, 'img'::character varying, 'txt'::character varying])::text[])))
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18817)
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 225
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- TOC entry 240 (class 1259 OID 18989)
-- Name: event_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_assignments (
    id integer NOT NULL,
    event_id integer NOT NULL,
    assigned_to_user_id integer NOT NULL,
    assigned_by_user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.event_assignments OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18988)
-- Name: event_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_assignments_id_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 239
-- Name: event_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_assignments_id_seq OWNED BY public.event_assignments.id;


--
-- TOC entry 228 (class 1259 OID 18841)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    color character varying(50) NOT NULL,
    type character varying(20) DEFAULT 'reminder'::character varying,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT events_type_check CHECK (((type)::text = ANY ((ARRAY['meeting'::character varying, 'reminder'::character varying, 'personal'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18840)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 227
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 224 (class 1259 OID 18804)
-- Name: folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.folders (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    color character varying(50) NOT NULL,
    icon character varying(50),
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.folders OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18803)
-- Name: folders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.folders_id_seq OWNER TO postgres;

--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 223
-- Name: folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.folders_id_seq OWNED BY public.folders.id;


--
-- TOC entry 236 (class 1259 OID 18945)
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    color character varying(50) DEFAULT '#7c3aed'::character varying,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18944)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO postgres;

--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 235
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- TOC entry 230 (class 1259 OID 18857)
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id integer NOT NULL,
    user_id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    mensaje text NOT NULL,
    tipo character varying(50) NOT NULL,
    relacionado_tipo character varying(50),
    relacionado_id integer,
    leida boolean DEFAULT false,
    enviada_push boolean DEFAULT false,
    enviada_email boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18856)
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 229
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- TOC entry 232 (class 1259 OID 18876)
-- Name: push_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.push_subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    endpoint text NOT NULL,
    p256dh text NOT NULL,
    auth text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.push_subscriptions OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18875)
-- Name: push_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.push_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.push_subscriptions_id_seq OWNER TO postgres;

--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 231
-- Name: push_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.push_subscriptions_id_seq OWNED BY public.push_subscriptions.id;


--
-- TOC entry 234 (class 1259 OID 18928)
-- Name: system_config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_config (
    id integer NOT NULL,
    nombre_sistema character varying(255) DEFAULT 'SecretariaPro'::character varying,
    titulo character varying(255) DEFAULT 'Sistema de Gestión Administrativa'::character varying,
    descripcion_sistema text,
    color_primario character varying(50) DEFAULT '#7c3aed'::character varying,
    color_secundario character varying(50) DEFAULT '#4f46e5'::character varying,
    logo_url text,
    favicon_url text,
    icon_192_url text,
    icon_512_url text,
    apple_touch_icon_url text,
    email_contacto character varying(255),
    telefono_contacto character varying(50),
    direccion text,
    footer_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_config CHECK ((id = 1))
);


ALTER TABLE public.system_config OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18927)
-- Name: system_config_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_config_id_seq OWNER TO postgres;

--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 233
-- Name: system_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_config_id_seq OWNED BY public.system_config.id;


--
-- TOC entry 238 (class 1259 OID 18964)
-- Name: task_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_assignments (
    id integer NOT NULL,
    task_id integer NOT NULL,
    assigned_to_user_id integer NOT NULL,
    assigned_by_user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.task_assignments OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18963)
-- Name: task_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_assignments_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 237
-- Name: task_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_assignments_id_seq OWNED BY public.task_assignments.id;


--
-- TOC entry 220 (class 1259 OID 18768)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    date timestamp without time zone NOT NULL,
    priority character varying(20) DEFAULT 'Media'::character varying,
    status character varying(20) DEFAULT 'Pendiente'::character varying,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tasks_priority_check CHECK (((priority)::text = ANY ((ARRAY['Baja'::character varying, 'Media'::character varying, 'Alta'::character varying])::text[]))),
    CONSTRAINT tasks_status_check CHECK (((status)::text = ANY ((ARRAY['Pendiente'::character varying, 'En Progreso'::character varying, 'Completada'::character varying])::text[])))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18767)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 219
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 218 (class 1259 OID 18753)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'SECRETARIA'::character varying,
    avatar text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SECRETARIA'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18752)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4807 (class 2604 OID 18791)
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- TOC entry 4813 (class 2604 OID 18821)
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- TOC entry 4843 (class 2604 OID 18992)
-- Name: event_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_assignments ALTER COLUMN id SET DEFAULT nextval('public.event_assignments_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 18844)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 18807)
-- Name: folders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders ALTER COLUMN id SET DEFAULT nextval('public.folders_id_seq'::regclass);


--
-- TOC entry 4837 (class 2604 OID 18948)
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 18860)
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 18879)
-- Name: push_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.push_subscriptions_id_seq'::regclass);


--
-- TOC entry 4830 (class 2604 OID 18931)
-- Name: system_config id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_config ALTER COLUMN id SET DEFAULT nextval('public.system_config_id_seq'::regclass);


--
-- TOC entry 4841 (class 2604 OID 18967)
-- Name: task_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments ALTER COLUMN id SET DEFAULT nextval('public.task_assignments_id_seq'::regclass);


--
-- TOC entry 4802 (class 2604 OID 18771)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 18756)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5068 (class 0 OID 18788)
-- Dependencies: 222
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.contacts (id, name, email, phone, role, avatar, user_id, created_at, updated_at, direccion, empresa, detalle) VALUES (2, 'Juan Perez', 'walterlozanoalcalde@gmail.com', '+51970877642', 'Gerente', '/uploads/contacts/contact-2-1764371793840-789957167.jpg', 1, '2025-11-28 18:16:33.776895', '2025-11-28 18:16:33.867492', 'JR Puno 3370 SMP', 'Inversiones Rialto SAC', 'Empresa de Educacion');
INSERT INTO public.contacts (id, name, email, phone, role, avatar, user_id, created_at, updated_at, direccion, empresa, detalle) VALUES (3, 'Maria Sanchez', 'walterlozanossalcalde@gmail.com', '+51970877643', 'Maestro', '/uploads/contacts/contact-3-1764372155962-491810077.jpg', 1, '2025-11-28 18:22:35.890437', '2025-11-28 18:22:35.989401', 'JR Cusco 3370 SMP', 'Inversiones Rialto SAC', 'Maestro');


--
-- TOC entry 5072 (class 0 OID 18818)
-- Dependencies: 226
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.documents (id, name, type, size, file_path, folder_id, user_id, date_added, created_at, updated_at) VALUES (11, 'Factura Subida', 'img', '140.75 KB', 'uploads/file-1764441848744-505306099.jpg', NULL, 1, '2025-11-29 13:44:08.757869', '2025-11-29 13:44:08.757869', '2025-11-29 13:44:08.757869');


--
-- TOC entry 5086 (class 0 OID 18989)
-- Dependencies: 240
-- Data for Name: event_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (1, 1, 5, 1, '2025-11-29 12:03:03.268282');
INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (2, 1, 2, 1, '2025-11-29 12:03:03.272043');
INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (3, 2, 2, 1, '2025-11-29 12:06:14.389409');
INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (4, 3, 5, 1, '2025-11-29 12:18:21.477824');
INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (5, 4, 8, 1, '2025-11-29 13:40:23.315252');
INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (6, 5, 8, 1, '2025-11-29 13:41:48.364867');
INSERT INTO public.event_assignments (id, event_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (7, 6, 8, 1, '2025-11-29 13:48:51.771403');


--
-- TOC entry 5074 (class 0 OID 18841)
-- Dependencies: 228
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events (id, title, start_time, end_time, color, type, user_id, created_at, updated_at) VALUES (1, 'Llegada Sra Diana', '2025-12-06 05:00:00', '2025-12-06 06:00:00', '#f59e0b', 'reminder', 1, '2025-11-28 15:38:10.281342', '2025-11-29 12:03:03.264152');
INSERT INTO public.events (id, title, start_time, end_time, color, type, user_id, created_at, updated_at) VALUES (2, 'Clausura', '2025-12-18 08:42:00', '2025-12-19 08:42:00', '#4f46e5', 'meeting', 1, '2025-11-28 17:43:12.391782', '2025-11-29 12:06:14.37573');
INSERT INTO public.events (id, title, start_time, end_time, color, type, user_id, created_at, updated_at) VALUES (3, 'Prueba', '2025-11-27 08:43:00', '2025-11-29 08:43:00', '#10b981', 'personal', 1, '2025-11-28 17:43:36.214831', '2025-11-29 12:18:21.474629');
INSERT INTO public.events (id, title, start_time, end_time, color, type, user_id, created_at, updated_at) VALUES (4, 'Borrar', '2025-11-29 18:40:00', '2025-11-30 18:40:00', '#3b82f6', 'meeting', 1, '2025-11-29 13:40:23.312413', '2025-11-29 13:40:23.312413');
INSERT INTO public.events (id, title, start_time, end_time, color, type, user_id, created_at, updated_at) VALUES (5, 'Reunion Coordinacion', '2025-12-01 18:41:00', '2025-12-02 18:41:00', '#3b82f6', 'meeting', 1, '2025-11-29 13:41:48.348382', '2025-11-29 13:41:48.348382');
INSERT INTO public.events (id, title, start_time, end_time, color, type, user_id, created_at, updated_at) VALUES (6, 'Prueba Borrar', '2025-12-01 18:48:00', '2025-12-02 18:48:00', '#7c3aed', 'meeting', 1, '2025-11-29 13:48:51.750236', '2025-11-29 13:48:51.750236');


--
-- TOC entry 5070 (class 0 OID 18804)
-- Dependencies: 224
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5082 (class 0 OID 18945)
-- Dependencies: 236
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notes (id, title, content, color, user_id, created_at, updated_at) VALUES (3, 'ver', 'ver todo ahora', '#ec4899', 1, '2025-11-28 17:35:03.169505', '2025-11-28 17:35:33.494114');
INSERT INTO public.notes (id, title, content, color, user_id, created_at, updated_at) VALUES (4, '111', '11111', '#7c3aed', 1, '2025-11-28 17:35:38.619434', '2025-11-28 17:35:38.619434');
INSERT INTO public.notes (id, title, content, color, user_id, created_at, updated_at) VALUES (5, '2222', '22222', '#f59e0b', 1, '2025-11-28 17:35:45.181273', '2025-11-28 17:35:45.181273');
INSERT INTO public.notes (id, title, content, color, user_id, created_at, updated_at) VALUES (6, '3333', '33333', '#10b981', 1, '2025-11-28 17:35:53.325609', '2025-11-28 17:35:53.325609');
INSERT INTO public.notes (id, title, content, color, user_id, created_at, updated_at) VALUES (7, '444', '44444', '#4f46e5', 1, '2025-11-28 17:36:08.263362', '2025-11-28 17:36:08.263362');
INSERT INTO public.notes (id, title, content, color, user_id, created_at, updated_at) VALUES (8, '666', '6666', '#ef4444', 1, '2025-11-28 17:36:30.46649', '2025-11-28 17:36:30.46649');


--
-- TOC entry 5076 (class 0 OID 18857)
-- Dependencies: 230
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (1, 5, 'Tarea Asignada', 'Se te ha asignado la tarea "Tarea de Prueba 29-11-25"', 'tarea', 'task', 4, false, false, false, '2025-11-29 12:01:44.040101', '2025-11-29 12:01:44.040101');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (2, 2, 'Tarea Asignada', 'Se te ha asignado la tarea "Tarea de Prueba 29-11-25"', 'tarea', 'task', 4, false, false, false, '2025-11-29 12:01:44.043454', '2025-11-29 12:01:44.043454');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (4, 5, 'Tarea Asignada', 'Se te ha asignado la tarea "Prieba Borrar"', 'tarea', 'task', 5, false, false, false, '2025-11-29 12:11:40.833323', '2025-11-29 12:11:40.833323');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (6, 5, 'Tarea Asignada', 'Se te ha asignado la tarea "borrar"', 'tarea', 'task', 6, false, false, false, '2025-11-29 12:15:14.10524', '2025-11-29 12:15:14.10524');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (8, 5, 'Tarea Asignada', 'Se te ha asignado la tarea "Borrar"', 'tarea', 'task', 7, false, false, false, '2025-11-29 12:16:05.139345', '2025-11-29 12:16:05.139345');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (10, 2, 'Tarea Asignada', 'Se te ha asignado la tarea "Tarea Prieba"', 'tarea', 'task', 3, false, false, false, '2025-11-29 12:18:37.804767', '2025-11-29 12:18:37.804767');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (3, 1, 'Nueva Tarea Creada', 'Se ha creado la tarea "Tarea de Prueba 29-11-25" con prioridad Media', 'tarea', 'task', 4, true, false, false, '2025-11-29 12:01:44.044222', '2025-11-29 12:19:46.748397');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (5, 1, 'Nueva Tarea Creada', 'Se ha creado la tarea "Prieba Borrar" con prioridad Media', 'tarea', 'task', 5, true, false, false, '2025-11-29 12:11:40.83581', '2025-11-29 12:19:46.748397');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (7, 1, 'Nueva Tarea Creada', 'Se ha creado la tarea "borrar" con prioridad Media', 'tarea', 'task', 6, true, false, false, '2025-11-29 12:15:14.106916', '2025-11-29 12:19:46.748397');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (9, 1, 'Nueva Tarea Creada', 'Se ha creado la tarea "Borrar" con prioridad Media', 'tarea', 'task', 7, true, false, false, '2025-11-29 12:16:05.141545', '2025-11-29 12:19:46.748397');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (11, 8, 'Tarea Asignada', 'Se te ha asignado la tarea "Preuba Ultims"', 'tarea', 'task', 8, false, true, true, '2025-11-29 13:35:30.111263', '2025-11-29 13:35:32.727307');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (12, 1, 'Nueva Tarea Creada', 'Se ha creado la tarea "Preuba Ultims" con prioridad Media', 'tarea', 'task', 8, false, true, false, '2025-11-29 13:35:32.728297', '2025-11-29 13:35:32.730742');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (13, 8, 'Evento Asignado', 'Se te ha asignado el evento "Borrar" para el 29 de noviembre de 2025 a las 13:40', 'evento', 'event', 4, false, true, true, '2025-11-29 13:40:23.355618', '2025-11-29 13:40:25.594854');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (14, 1, 'Nuevo Evento Creado', 'Se ha creado el evento "Borrar" para el 29 de noviembre de 2025 a las 13:40', 'evento', 'event', 4, false, true, false, '2025-11-29 13:40:25.596516', '2025-11-29 13:40:25.598238');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (15, 8, 'Evento Asignado', 'Se te ha asignado el evento "Reunion Coordinacion" para el 1 de diciembre de 2025 a las 13:41', 'evento', 'event', 5, false, true, true, '2025-11-29 13:41:48.372968', '2025-11-29 13:41:50.515861');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (16, 1, 'Nuevo Evento Creado', 'Se ha creado el evento "Reunion Coordinacion" para el 1 de diciembre de 2025 a las 13:41', 'evento', 'event', 5, false, true, false, '2025-11-29 13:41:50.516955', '2025-11-29 13:41:50.518837');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (17, 8, 'Tarea Asignada', 'Se te ha asignado la tarea "Tarea Programada para Ayer"', 'tarea', 'task', 9, false, true, true, '2025-11-29 13:43:03.931354', '2025-11-29 13:43:06.094556');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (18, 1, 'Nueva Tarea Creada', 'Se ha creado la tarea "Tarea Programada para Ayer" con prioridad Media', 'tarea', 'task', 9, false, true, false, '2025-11-29 13:43:06.095411', '2025-11-29 13:43:06.097055');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (19, 1, 'Evento de hoy', 'Tienes el evento "Borrar" hoy a las 18:40', 'recordatorio_hoy', 'event', 4, false, true, true, '2025-11-29 13:44:52.330457', '2025-11-29 13:44:54.926455');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (20, 8, 'Evento de hoy', 'Tienes el evento "Borrar" hoy a las 18:40', 'recordatorio_hoy', 'event', 4, false, true, true, '2025-11-29 13:44:54.930832', '2025-11-29 13:44:57.013853');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (21, 8, 'Evento Asignado', 'Se te ha asignado el evento "Prueba Borrar" para el 1 de diciembre de 2025 a las 13:48', 'evento', 'event', 6, false, true, true, '2025-11-29 13:48:51.815391', '2025-11-29 13:48:54.350841');
INSERT INTO public.notificaciones (id, user_id, titulo, mensaje, tipo, relacionado_tipo, relacionado_id, leida, enviada_push, enviada_email, created_at, updated_at) VALUES (22, 1, 'Nuevo Evento Creado', 'Se ha creado el evento "Prueba Borrar" para el 1 de diciembre de 2025 a las 13:48', 'evento', 'event', 6, false, true, false, '2025-11-29 13:48:54.35189', '2025-11-29 13:48:54.353134');


--
-- TOC entry 5078 (class 0 OID 18876)
-- Dependencies: 232
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5080 (class 0 OID 18928)
-- Dependencies: 234
-- Data for Name: system_config; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.system_config (id, nombre_sistema, titulo, descripcion_sistema, color_primario, color_secundario, logo_url, favicon_url, icon_192_url, icon_512_url, apple_touch_icon_url, email_contacto, telefono_contacto, direccion, footer_text, created_at, updated_at) VALUES (1, 'VanguardSuite', 'Sistema de Gestión Administrativa Profesional', 'Plataforma integral para la gestión de tareas, contactos, documentos y eventos', '#7c3aed', '#4f46e5', '/uploads/config/logo-1764359618540-32541312.png', '/uploads/config/favicon-1764359625646-37284859.png', '/uploads/config/icon_192-1764359633122-801286674.png', '/uploads/config/icon_512-1764359639525-437149128.png', '/uploads/config/apple_touch_icon-1764359645180-853008326.png', 'walterlozanoalcalde@gmail.com', '+51970877642', 'Jr Puno 3370 SMP
Lima', NULL, '2025-11-28 14:21:14.795754', '2025-11-28 17:50:55.558747');


--
-- TOC entry 5084 (class 0 OID 18964)
-- Dependencies: 238
-- Data for Name: task_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (1, 4, 5, 1, '2025-11-29 12:01:44.035096');
INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (2, 4, 2, 1, '2025-11-29 12:01:44.042233');
INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (7, 2, 5, 1, '2025-11-29 12:14:36.809072');
INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (9, 7, 5, 1, '2025-11-29 12:16:05.136895');
INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (10, 3, 2, 1, '2025-11-29 12:18:37.80213');
INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (11, 8, 8, 1, '2025-11-29 13:35:30.102135');
INSERT INTO public.task_assignments (id, task_id, assigned_to_user_id, assigned_by_user_id, created_at) VALUES (12, 9, 8, 1, '2025-11-29 13:43:03.921114');


--
-- TOC entry 5066 (class 0 OID 18768)
-- Dependencies: 220
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tasks (id, title, description, date, priority, status, user_id, created_at, updated_at) VALUES (4, 'Tarea de Prueba 29-11-25', 'Tarea de Prueba 29-11-25', '2025-11-30 19:00:00', 'Media', 'Pendiente', 1, '2025-11-29 12:01:44.031925', '2025-11-29 12:01:44.031925');
INSERT INTO public.tasks (id, title, description, date, priority, status, user_id, created_at, updated_at) VALUES (2, 'Fiesta vanguard', 'Fiesta', '2025-12-02 01:00:00', 'Media', 'Pendiente', 1, '2025-11-28 17:41:48.466123', '2025-11-29 12:14:36.793243');
INSERT INTO public.tasks (id, title, description, date, priority, status, user_id, created_at, updated_at) VALUES (7, 'Borrar', 'Borrar', '2025-11-30 19:00:00', 'Media', 'Pendiente', 1, '2025-11-29 12:16:05.130438', '2025-11-29 12:16:05.130438');
INSERT INTO public.tasks (id, title, description, date, priority, status, user_id, created_at, updated_at) VALUES (3, 'Tarea Prieba', 'Prueba', '2025-12-01 05:00:00', 'Media', 'Completada', 1, '2025-11-28 17:44:44.788838', '2025-11-29 12:18:37.799398');
INSERT INTO public.tasks (id, title, description, date, priority, status, user_id, created_at, updated_at) VALUES (8, 'Preuba Ultims', 'Ver para desarrollar', '2025-11-30 19:00:00', 'Media', 'Pendiente', 1, '2025-11-29 13:35:30.088007', '2025-11-29 13:35:30.088007');
INSERT INTO public.tasks (id, title, description, date, priority, status, user_id, created_at, updated_at) VALUES (9, 'Tarea Programada para Ayer', 'Tarea Programada para Ayer Tarea Programada para Ayer Tarea Programada para Ayer', '2025-12-02 19:00:00', 'Media', 'Pendiente', 1, '2025-11-29 13:43:03.913305', '2025-11-29 13:43:03.913305');


--
-- TOC entry 5064 (class 0 OID 18753)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password, name, role, avatar, created_at, updated_at) VALUES (2, 'secretaria@gmail.com', '$2a$10$LO6vx1KmDeXDEkC0KX4HvuDmDQWXzt3cr2e0A/UxS4xMdQ9fQChEu', 'Secretaria Principal', 'SECRETARIA', NULL, '2025-11-28 13:18:46.93497', '2025-11-28 15:17:48.658326');
INSERT INTO public.users (id, email, password, name, role, avatar, created_at, updated_at) VALUES (5, 'dianaalcalde@gmail.com', '$2a$10$ux179e9kQ0JhYRHk2kzAv.dB7/EQsYblIL2PrINL3oL4gX5tOoht2', 'Diana Alcalde', 'SECRETARIA', NULL, '2025-11-28 15:20:11.706283', '2025-11-28 15:20:11.706283');
INSERT INTO public.users (id, email, password, name, role, avatar, created_at, updated_at) VALUES (1, 'admin@gmail.com', '$2a$10$VRe.Zb3PGqqc/D4OS6FyAe5wql.tizJxGuyQdb63oxyYNpMT07/fe', 'Administrador', 'ADMIN', '/uploads/avatars/avatar-1-1764361845078-970655271.jpg', '2025-11-28 13:18:46.93497', '2025-11-28 17:51:32.513672');
INSERT INTO public.users (id, email, password, name, role, avatar, created_at, updated_at) VALUES (8, 'walterlozanoalcalde@gmail.com', '$2a$10$M1dUFfHJQwAM76yGjhIz7uCyshKeC1OHzEMThIWOUJuu6BfEuAxtW', 'hhhh', 'SECRETARIA', NULL, '2025-11-29 13:29:28.015522', '2025-11-29 13:29:28.015522');


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 221
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_seq', 3, true);


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 225
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 11, true);


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 239
-- Name: event_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_assignments_id_seq', 7, true);


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 227
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 6, true);


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 223
-- Name: folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.folders_id_seq', 3, true);


--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 235
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notes_id_seq', 10, true);


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 229
-- Name: notificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_seq', 22, true);


--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 231
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 1, false);


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 233
-- Name: system_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_config_id_seq', 1, false);


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 237
-- Name: task_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_assignments_id_seq', 12, true);


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 219
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 9, true);


--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 4859 (class 2606 OID 18797)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 18829)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- TOC entry 4889 (class 2606 OID 18997)
-- Name: event_assignments event_assignments_event_id_assigned_to_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_assignments
    ADD CONSTRAINT event_assignments_event_id_assigned_to_user_id_key UNIQUE (event_id, assigned_to_user_id);


--
-- TOC entry 4891 (class 2606 OID 18995)
-- Name: event_assignments event_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_assignments
    ADD CONSTRAINT event_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 18850)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 18811)
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 18955)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 4872 (class 2606 OID 18869)
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 18885)
-- Name: push_subscriptions push_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4877 (class 2606 OID 18887)
-- Name: push_subscriptions push_subscriptions_user_id_endpoint_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_endpoint_key UNIQUE (user_id, endpoint);


--
-- TOC entry 4879 (class 2606 OID 18942)
-- Name: system_config system_config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_pkey PRIMARY KEY (id);


--
-- TOC entry 4885 (class 2606 OID 18970)
-- Name: task_assignments task_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments
    ADD CONSTRAINT task_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 2606 OID 18972)
-- Name: task_assignments task_assignments_task_id_assigned_to_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments
    ADD CONSTRAINT task_assignments_task_id_assigned_to_user_id_key UNIQUE (task_id, assigned_to_user_id);


--
-- TOC entry 4857 (class 2606 OID 18781)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4852 (class 2606 OID 18766)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4854 (class 2606 OID 18764)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4860 (class 1259 OID 18894)
-- Name: idx_contacts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contacts_user_id ON public.contacts USING btree (user_id);


--
-- TOC entry 4865 (class 1259 OID 18896)
-- Name: idx_documents_folder_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_folder_id ON public.documents USING btree (folder_id);


--
-- TOC entry 4866 (class 1259 OID 18895)
-- Name: idx_documents_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_user_id ON public.documents USING btree (user_id);


--
-- TOC entry 4892 (class 1259 OID 19015)
-- Name: idx_event_assignments_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_assignments_event_id ON public.event_assignments USING btree (event_id);


--
-- TOC entry 4893 (class 1259 OID 19016)
-- Name: idx_event_assignments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_event_assignments_user_id ON public.event_assignments USING btree (assigned_to_user_id);


--
-- TOC entry 4869 (class 1259 OID 18897)
-- Name: idx_events_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_user_id ON public.events USING btree (user_id);


--
-- TOC entry 4870 (class 1259 OID 18898)
-- Name: idx_notificaciones_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notificaciones_user_id ON public.notificaciones USING btree (user_id);


--
-- TOC entry 4873 (class 1259 OID 18899)
-- Name: idx_push_subscriptions_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions USING btree (user_id);


--
-- TOC entry 4882 (class 1259 OID 19013)
-- Name: idx_task_assignments_task_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_assignments_task_id ON public.task_assignments USING btree (task_id);


--
-- TOC entry 4883 (class 1259 OID 19014)
-- Name: idx_task_assignments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_assignments_user_id ON public.task_assignments USING btree (assigned_to_user_id);


--
-- TOC entry 4855 (class 1259 OID 18893)
-- Name: idx_tasks_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_user_id ON public.tasks USING btree (user_id);


--
-- TOC entry 4911 (class 2620 OID 18903)
-- Name: contacts update_contacts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4913 (class 2620 OID 18905)
-- Name: documents update_documents_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4914 (class 2620 OID 18906)
-- Name: events update_events_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4912 (class 2620 OID 18904)
-- Name: folders update_folders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4915 (class 2620 OID 18907)
-- Name: notificaciones update_notificaciones_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_notificaciones_updated_at BEFORE UPDATE ON public.notificaciones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4916 (class 2620 OID 18908)
-- Name: push_subscriptions update_push_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON public.push_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4917 (class 2620 OID 18943)
-- Name: system_config update_system_config_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON public.system_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4910 (class 2620 OID 18902)
-- Name: tasks update_tasks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4909 (class 2620 OID 18901)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4895 (class 2606 OID 18798)
-- Name: contacts contacts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4897 (class 2606 OID 18830)
-- Name: documents documents_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id) ON DELETE SET NULL;


--
-- TOC entry 4898 (class 2606 OID 18835)
-- Name: documents documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4906 (class 2606 OID 19008)
-- Name: event_assignments event_assignments_assigned_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_assignments
    ADD CONSTRAINT event_assignments_assigned_by_user_id_fkey FOREIGN KEY (assigned_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4907 (class 2606 OID 19003)
-- Name: event_assignments event_assignments_assigned_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_assignments
    ADD CONSTRAINT event_assignments_assigned_to_user_id_fkey FOREIGN KEY (assigned_to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4908 (class 2606 OID 18998)
-- Name: event_assignments event_assignments_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_assignments
    ADD CONSTRAINT event_assignments_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4899 (class 2606 OID 18851)
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4896 (class 2606 OID 18812)
-- Name: folders folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 18956)
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4900 (class 2606 OID 18870)
-- Name: notificaciones notificaciones_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4901 (class 2606 OID 18888)
-- Name: push_subscriptions push_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.push_subscriptions
    ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4903 (class 2606 OID 18983)
-- Name: task_assignments task_assignments_assigned_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments
    ADD CONSTRAINT task_assignments_assigned_by_user_id_fkey FOREIGN KEY (assigned_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4904 (class 2606 OID 18978)
-- Name: task_assignments task_assignments_assigned_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments
    ADD CONSTRAINT task_assignments_assigned_to_user_id_fkey FOREIGN KEY (assigned_to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4905 (class 2606 OID 18973)
-- Name: task_assignments task_assignments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments
    ADD CONSTRAINT task_assignments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- TOC entry 4894 (class 2606 OID 18782)
-- Name: tasks tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-11-29 14:03:36

--
-- PostgreSQL database dump complete
--

\unrestrict lOU1lqdKl06Wl9Smk9aPh08uPxGlMqmP05rDcIawkvs6KdCaXC3Z8ho6TYOgRc1

