alter table public.avatars drop constraint if exists avatars_method_check;
alter table public.avatars add constraint avatars_method_check
check (method is null or method in ('upload','ai','system','generate'));
alter table public.avatars alter column status set default 'ready';
