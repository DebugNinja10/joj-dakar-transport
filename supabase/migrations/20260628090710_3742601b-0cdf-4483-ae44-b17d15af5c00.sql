CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _requested public.app_role;
  _role public.app_role;
  _name TEXT;
BEGIN
  BEGIN
    _requested := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'user');
  EXCEPTION WHEN OTHERS THEN
    _requested := 'user';
  END;

  -- SECURITY: never allow self-assignment of admin from public signup.
  -- Admin must be granted manually via the database.
  IF _requested = 'admin' THEN
    _role := 'user';
  ELSE
    _role := _requested;
  END IF;

  _name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, full_name, role, online_status)
    VALUES (NEW.id, _name, _role, false);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
    ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;