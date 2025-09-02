-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories
(
    id integer NOT NULL DEFAULT nextval('categories_id_seq'
    ::regclass),
  name character varying NOT NULL UNIQUE,
  description text,
  image text,
  created_at timestamp
    with time zone DEFAULT now
    (),
  updated_at timestamp
    with time zone DEFAULT now
    (),
  CONSTRAINT categories_pkey PRIMARY KEY
    (id)
);
    CREATE TABLE public.products
    (
        id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
        name character varying NOT NULL,
        description text,
        price numeric NOT NULL,
        category character varying NOT NULL,
        images ARRAY DEFAULT '{}'
        ::text[],
  sizes ARRAY DEFAULT '{}'::text[],
  colors ARRAY DEFAULT '{}'::text[],
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamp
        with time zone DEFAULT now
        (),
  updated_at timestamp
        with time zone DEFAULT now
        (),
  CONSTRAINT products_pkey PRIMARY KEY
        (id),
  CONSTRAINT products_category_fkey FOREIGN KEY
        (category) REFERENCES public.categories
        (name)
);
        CREATE TABLE public.user_profiles
        (
            id uuid NOT NULL,
            email text UNIQUE,
            full_name text,
            role text DEFAULT 'user'
            ::text,
  created_at timestamp
            with time zone DEFAULT now
            (),
  updated_at timestamp
            with time zone DEFAULT now
            (),
  CONSTRAINT user_profiles_pkey PRIMARY KEY
            (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY
            (id) REFERENCES auth.users
            (id)
);